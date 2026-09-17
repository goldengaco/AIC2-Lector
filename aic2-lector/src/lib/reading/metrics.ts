export const PILOT_COMPREHENSION_THRESHOLD = 80;
export const PILOT_MAX_VALIDATED_WPM = 400;

export type ScorableQuestion = {
  id?: string;
  correct_index: number;
  kind?: string;
};

export type ComprehensionResult = {
  correct: number;
  total: number;
  percentage: number;
};

export type GlossCoverageResult = {
  totalTokens: number;
  coveredTokens: number;
  percentage: number;
};

export type QuestionKindScore = ComprehensionResult & {
  kind: string;
};

export type ConfidenceLevel = 0 | 1 | 2;

export type CalibrationSummary = {
  n: number;
  omitted: number;
  accuracy: number | null;
  meanConfidence: number | null;
  bias: number | null;
  brierLike: number | null;
  reportable: boolean;
};

/**
 * Breaks a reading result down by the capability tested by each question.
 *
 * This is evidence about the current text and question set, not a CEFR
 * classifier. Keeping the dimensions visible prevents one total percentage
 * (or WPM) from hiding a weakness in inference, cohesion, or literal recall.
 */
export function scoreByQuestionKind(
  answers: Array<number | undefined>,
  questions: ScorableQuestion[],
): QuestionKindScore[] {
  const groups = new Map<string, { answers: Array<number | undefined>; questions: ScorableQuestion[] }>();

  questions.forEach((question, index) => {
    const kind = question.kind?.trim() || 'unclassified';
    const group = groups.get(kind) ?? { answers: [], questions: [] };
    group.answers.push(answers[index]);
    group.questions.push(question);
    groups.set(kind, group);
  });

  return Array.from(groups.entries()).map(([kind, group]) => ({
    kind,
    ...scoreComprehension(group.answers, group.questions),
  }));
}

/**
 * Compares retrospective confidence with correctness for this question set.
 * Confidence is a study signal only: it never adds or removes points.
 */
export function calculateCalibrationSummary(
  answers: Array<number | undefined>,
  questions: ScorableQuestion[],
  confidence: Array<ConfidenceLevel | null>,
): CalibrationSummary {
  const observations = questions.flatMap((question, index) => {
    const level = confidence[index];
    if (level === null || level === undefined || answers[index] === undefined) return [];
    return [{
      confidence: level / 2,
      correct: answers[index] === question.correct_index ? 1 : 0,
    }];
  });

  const n = observations.length;
  const omitted = Math.max(0, questions.length - n);
  if (n === 0) {
    return { n, omitted, accuracy: null, meanConfidence: null, bias: null, brierLike: null, reportable: false };
  }

  const accuracy = observations.reduce((sum, item) => sum + item.correct, 0) / n;
  const meanConfidence = observations.reduce((sum, item) => sum + item.confidence, 0) / n;
  const bias = meanConfidence - accuracy;
  const brierLike = observations.reduce(
    (sum, item) => sum + (item.confidence - item.correct) ** 2,
    0,
  ) / n;
  const round = (value: number) => Math.round(value * 1_000) / 1_000;

  return {
    n,
    omitted,
    accuracy: round(accuracy),
    meanConfidence: round(meanConfidence),
    bias: round(bias),
    brierLike: round(brierLike),
    reportable: n >= 10,
  };
}

/**
 * Measures exact text-token coverage by the glossary bank.
 *
 * This is not a vocabulary-knowledge or CEFR estimate: a glossary entry may
 * still be unfamiliar, and inflections/derivations are not guessed here.
 */
export function calculateGlossCoverage(
  text: string,
  knownWords: Iterable<string>,
): GlossCoverageResult {
  const tokens = text.match(/[A-Za-z]+(?:'[A-Za-z]+)?/g)?.map(token => token.toLowerCase()) ?? [];
  const known = new Set(Array.from(knownWords, word => word.toLowerCase()));
  const coveredTokens = tokens.filter(token => known.has(token)).length;

  return {
    totalTokens: tokens.length,
    coveredTokens,
    percentage: tokens.length === 0 ? 0 : Math.round((coveredTokens / tokens.length) * 100),
  };
}

export function calculateWpm(wordCount: number, durationMs: number): number {
  if (!Number.isFinite(wordCount) || !Number.isFinite(durationMs) || wordCount <= 0 || durationMs <= 0) {
    return 0;
  }

  return Math.round((wordCount / durationMs) * 60_000);
}

export function scoreComprehension(
  answers: Array<number | undefined>,
  questions: ScorableQuestion[],
): ComprehensionResult {
  const total = questions.length;
  if (total === 0) return { correct: 0, total: 0, percentage: 0 };

  const correct = questions.reduce(
    (sum, question, index) => sum + (answers[index] === question.correct_index ? 1 : 0),
    0,
  );

  return {
    correct,
    total,
    percentage: Math.round((correct / total) * 100),
  };
}

export function isWpmValidated(
  comprehensionPercentage: number,
  wpm: number,
  threshold = PILOT_COMPREHENSION_THRESHOLD,
  maximumWpm = PILOT_MAX_VALIDATED_WPM,
): boolean {
  return comprehensionPercentage >= threshold && wpm > 0 && wpm <= maximumWpm;
}

export function minimumCorrectAnswers(
  questionCount: number,
  threshold = PILOT_COMPREHENSION_THRESHOLD,
): number {
  if (!Number.isFinite(questionCount) || questionCount <= 0) return 0;
  return Math.ceil(questionCount * threshold / 100);
}

export function combineWeightedAverage(
  previousAverage: number,
  previousCount: number,
  incomingAverage: number,
  incomingCount: number,
): number {
  if (incomingCount <= 0) return previousAverage;
  if (previousCount <= 0) return incomingAverage;

  return (
    (previousAverage * previousCount + incomingAverage * incomingCount)
    / (previousCount + incomingCount)
  );
}
