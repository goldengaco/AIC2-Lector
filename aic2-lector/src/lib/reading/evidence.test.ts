import assert from 'node:assert/strict';
import test from 'node:test';
import {
  aggregateAssessmentLedgers,
  aggregateCalibrationLedgers,
  calculateWilsonInterval,
} from './evidence.ts';

test('Wilson interval remains bounded for extreme small samples', () => {
  assert.deepEqual(calculateWilsonInterval(1, 1), { lower: 0.207, upper: 1 });
  assert.deepEqual(calculateWilsonInterval(0, 1), { lower: 0, upper: 0.793 });
  assert.equal(calculateWilsonInterval(1, 0), null);
  assert.equal(calculateWilsonInterval(2, 1), null);
});

test('assessment ledgers separate roles and do not infer missing counts', () => {
  const result = aggregateAssessmentLedgers([
    { assessment_role: 'formative', question_count: 9, correct_count: 8, first_attempt: true },
    { assessment_role: 'formative', comprehension_score: 100 } as never,
    { assessment_role: 'transfer', question_count: 9, correct_count: 4, first_attempt: true },
    { assessment_role: 'delayed-retest', question_count: 9, correct_count: 7, first_attempt: false },
  ]);

  assert.deepEqual(result.map(ledger => ({
    role: ledger.role,
    sessions: ledger.sessions,
    measuredSessions: ledger.measuredSessions,
    answered: ledger.answered,
    correct: ledger.correct,
    accuracy: ledger.accuracy,
    firstAttemptSessions: ledger.firstAttemptSessions,
    retrySessions: ledger.retrySessions,
  })), [
    { role: 'formative', sessions: 2, measuredSessions: 1, answered: 9, correct: 8, accuracy: 0.889, firstAttemptSessions: 1, retrySessions: 0 },
    { role: 'transfer', sessions: 1, measuredSessions: 1, answered: 9, correct: 4, accuracy: 0.444, firstAttemptSessions: 1, retrySessions: 0 },
    { role: 'delayed-retest', sessions: 1, measuredSessions: 1, answered: 9, correct: 7, accuracy: 0.778, firstAttemptSessions: 0, retrySessions: 1 },
  ]);
});

test('calibration aggregation keeps omitted confidence separate from accuracy', () => {
  const result = aggregateCalibrationLedgers([
    {
      assessment_role: 'transfer',
      calibration_evidence: [
        { is_correct: true, confidence: 2 },
        { is_correct: false, confidence: 2 },
        { is_correct: true, confidence: null },
      ],
    },
  ]);

  assert.deepEqual(result.find(ledger => ledger.role === 'transfer'), {
    role: 'transfer',
    n: 2,
    omitted: 1,
    accuracy: 0.5,
    interval: { lower: 0.095, upper: 0.905 },
    meanConfidence: 1,
    bias: 0.5,
    brierLike: 0.5,
    enoughForDescriptiveTrend: false,
  });
});
