export type AssessmentRole = 'formative' | 'transfer' | 'delayed-retest';

export type ReadingEvidenceSession = {
  assessment_role?: AssessmentRole;
  question_count?: number;
  correct_count?: number;
  first_attempt?: boolean;
  calibration_evidence?: Array<{
    is_correct: boolean;
    confidence: 0 | 1 | 2 | null;
  }>;
};

export type WilsonInterval = {
  lower: number;
  upper: number;
};

export type AssessmentLedgerSummary = {
  role: AssessmentRole;
  sessions: number;
  measuredSessions: number;
  firstAttemptSessions: number;
  retrySessions: number;
  answered: number;
  correct: number;
  accuracy: number | null;
  interval: WilsonInterval | null;
  enoughForDescriptiveTrend: boolean;
};

export type CalibrationLedgerSummary = {
  role: AssessmentRole;
  n: number;
  omitted: number;
  accuracy: number | null;
  interval: WilsonInterval | null;
  meanConfidence: number | null;
  bias: number | null;
  brierLike: number | null;
  enoughForDescriptiveTrend: boolean;
};

export const ASSESSMENT_ROLES: AssessmentRole[] = ['formative', 'transfer', 'delayed-retest'];
export const DESCRIPTIVE_TREND_MINIMUM = 30;

function round(value: number): number {
  return Math.round(value * 1_000) / 1_000;
}

function isValidCount(correct: number, total: number): boolean {
  return Number.isInteger(correct)
    && Number.isInteger(total)
    && total > 0
    && correct >= 0
    && correct <= total;
}

/**
 * Wilson score interval for a binomial proportion.
 *
 * It is intentionally used instead of a normal/Wald interval because the
 * app's early samples are small and can be close to 0% or 100%.
 */
export function calculateWilsonInterval(
  correct: number,
  total: number,
  z = 1.96,
): WilsonInterval | null {
  if (!isValidCount(correct, total) || !Number.isFinite(z) || z <= 0) return null;

  const proportion = correct / total;
  const zSquared = z ** 2;
  const denominator = 1 + zSquared / total;
  const centre = (proportion + zSquared / (2 * total)) / denominator;
  const margin = z * Math.sqrt(
    (proportion * (1 - proportion) / total) + (zSquared / (4 * total ** 2)),
  ) / denominator;

  return {
    lower: round(Math.max(0, centre - margin)),
    upper: round(Math.min(1, centre + margin)),
  };
}

function emptyAssessmentLedger(role: AssessmentRole): AssessmentLedgerSummary {
  return {
    role,
    sessions: 0,
    measuredSessions: 0,
    firstAttemptSessions: 0,
    retrySessions: 0,
    answered: 0,
    correct: 0,
    accuracy: null,
    interval: null,
    enoughForDescriptiveTrend: false,
  };
}

function finalizeAssessmentLedger(
  ledger: Omit<AssessmentLedgerSummary, 'accuracy' | 'interval' | 'enoughForDescriptiveTrend'>,
): AssessmentLedgerSummary {
  const accuracy = ledger.answered > 0 ? round(ledger.correct / ledger.answered) : null;
  return {
    ...ledger,
    accuracy,
    interval: calculateWilsonInterval(ledger.correct, ledger.answered),
    enoughForDescriptiveTrend: ledger.answered >= DESCRIPTIVE_TREND_MINIMUM,
  };
}

/**
 * Aggregates only sessions with explicit question and correct-answer counts.
 * Missing counts are not reconstructed from a rounded percentage.
 */
export function aggregateAssessmentLedgers(
  sessions: ReadingEvidenceSession[],
): AssessmentLedgerSummary[] {
  const ledgers = new Map(ASSESSMENT_ROLES.map(role => [role, emptyAssessmentLedger(role)]));

  for (const session of sessions) {
    const role = session.assessment_role;
    if (!role) continue;

    const current = ledgers.get(role);
    if (!current) continue;
    current.sessions += 1;

    if (!isValidCount(session.correct_count ?? -1, session.question_count ?? -1)) continue;

    current.measuredSessions += 1;
    current.answered += session.question_count ?? 0;
    current.correct += session.correct_count ?? 0;
    if (session.first_attempt === true) current.firstAttemptSessions += 1;
    if (session.first_attempt === false) current.retrySessions += 1;
  }

  return ASSESSMENT_ROLES.map(role => {
    const ledger = ledgers.get(role)!;
    return finalizeAssessmentLedger(ledger);
  });
}

function emptyCalibrationLedger(role: AssessmentRole): CalibrationLedgerSummary {
  return {
    role,
    n: 0,
    omitted: 0,
    accuracy: null,
    interval: null,
    meanConfidence: null,
    bias: null,
    brierLike: null,
    enoughForDescriptiveTrend: false,
  };
}

/**
 * Aggregates confidence only when the learner supplied a confidence level.
 * Confidence remains descriptive and never changes comprehension scoring.
 */
export function aggregateCalibrationLedgers(
  sessions: ReadingEvidenceSession[],
): CalibrationLedgerSummary[] {
  const ledgers = new Map(ASSESSMENT_ROLES.map(role => [role, emptyCalibrationLedger(role)]));
  const sums = new Map(ASSESSMENT_ROLES.map(role => [role, {
    correct: 0,
    confidence: 0,
    squaredError: 0,
    totalObservations: 0,
  }]));

  for (const session of sessions) {
    const role = session.assessment_role;
    if (!role) continue;

    const ledger = ledgers.get(role);
    const sum = sums.get(role);
    if (!ledger || !sum || !session.calibration_evidence) continue;

    for (const observation of session.calibration_evidence) {
      sum.totalObservations += 1;
      if (observation.confidence === null || observation.confidence === undefined) continue;

      const confidence = observation.confidence / 2;
      const correct = observation.is_correct ? 1 : 0;
      sum.correct += correct;
      sum.confidence += confidence;
      sum.squaredError += (confidence - correct) ** 2;
      ledger.n += 1;
    }
  }

  return ASSESSMENT_ROLES.map(role => {
    const ledger = ledgers.get(role)!;
    const sum = sums.get(role)!;
    ledger.omitted = Math.max(0, sum.totalObservations - ledger.n);

    if (ledger.n > 0) {
      ledger.accuracy = round(sum.correct / ledger.n);
      ledger.interval = calculateWilsonInterval(sum.correct, ledger.n);
      ledger.meanConfidence = round(sum.confidence / ledger.n);
      ledger.bias = round(ledger.meanConfidence - ledger.accuracy);
      ledger.brierLike = round(sum.squaredError / ledger.n);
    }

    ledger.enoughForDescriptiveTrend = ledger.n >= DESCRIPTIVE_TREND_MINIMUM;
    return ledger;
  });
}
