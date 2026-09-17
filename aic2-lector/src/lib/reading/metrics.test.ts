import assert from 'node:assert/strict';
import test from 'node:test';
import {
  calculateCalibrationSummary,
  calculateGlossCoverage,
  calculateWpm,
  combineWeightedAverage,
  isWpmValidated,
  minimumCorrectAnswers,
  scoreByQuestionKind,
  scoreComprehension,
} from './metrics.ts';

test('calculates exact glossary coverage without claiming knowledge', () => {
  assert.deepEqual(calculateGlossCoverage("API calls and APIs.", ['api', 'call']), {
    totalTokens: 4,
    coveredTokens: 1,
    percentage: 25,
  });
});

test('returns zero coverage for empty or punctuation-only text', () => {
  assert.deepEqual(calculateGlossCoverage('... —', ['api']), {
    totalTokens: 0,
    coveredTokens: 0,
    percentage: 0,
  });
});

test('calculateWpm rejects invalid or empty sessions', () => {
  assert.equal(calculateWpm(100, 0), 0);
  assert.equal(calculateWpm(0, 60_000), 0);
  assert.equal(calculateWpm(100, 60_000), 100);
});

test('scoreComprehension calculates a transparent percentage', () => {
  const questions = [{ correct_index: 1 }, { correct_index: 0 }, { correct_index: 2 }];
  assert.deepEqual(scoreComprehension([1, 3, 2], questions), {
    correct: 2,
    total: 3,
    percentage: 67,
  });
});

test('scoreByQuestionKind exposes uneven reading evidence without CEFR claims', () => {
  const questions = [
    { kind: 'literal', correct_index: 0 },
    { kind: 'literal', correct_index: 1 },
    { kind: 'inference', correct_index: 2 },
    { kind: 'inference', correct_index: 0 },
  ];

  assert.deepEqual(scoreByQuestionKind([0, 3, 2, 3], questions), [
    { kind: 'literal', correct: 1, total: 2, percentage: 50 },
    { kind: 'inference', correct: 1, total: 2, percentage: 50 },
  ]);
});

test('scoreByQuestionKind keeps unclassified questions visible', () => {
  assert.deepEqual(scoreByQuestionKind([0], [{ correct_index: 0 }]), [
    { kind: 'unclassified', correct: 1, total: 1, percentage: 100 },
  ]);
});

test('confidence is measured separately and never changes the score', () => {
  const summary = calculateCalibrationSummary(
    [0, 3, 2],
    [{ correct_index: 0 }, { correct_index: 1 }, { correct_index: 2 }],
    [2, 2, 0],
  );

  assert.deepEqual(summary, {
    n: 3,
    omitted: 0,
    accuracy: 0.667,
    meanConfidence: 0.667,
    bias: 0,
    brierLike: 0.667,
    reportable: false,
  });
});

test('calibration metrics become reportable only after enough observations', () => {
  const questions = Array.from({ length: 10 }, () => ({ correct_index: 0 }));
  const summary = calculateCalibrationSummary(
    Array(10).fill(0),
    questions,
    Array(10).fill(1),
  );

  assert.equal(summary.reportable, true);
  assert.equal(summary.bias, -0.5);
  assert.equal(summary.brierLike, 0.25);
});

test('WPM only validates when comprehension reaches the pilot threshold', () => {
  assert.equal(isWpmValidated(79, 100), false);
  assert.equal(isWpmValidated(80, 100), true);
});

test('WPM above the pilot safety ceiling remains descriptive but is not validated', () => {
  assert.equal(isWpmValidated(100, 400), true);
  assert.equal(isWpmValidated(100, 401), false);
  assert.equal(isWpmValidated(100, 0), false);
});

test('the UI can disclose the real number of correct answers required', () => {
  assert.equal(minimumCorrectAnswers(3, 80), 3);
  assert.equal(minimumCorrectAnswers(5, 80), 4);
  assert.equal(minimumCorrectAnswers(0, 80), 0);
});

test('combineWeightedAverage preserves counts instead of keeping only the latest score', () => {
  assert.equal(combineWeightedAverage(80, 2, 100, 1), 260 / 3);
  assert.equal(combineWeightedAverage(0, 0, 75, 1), 75);
  assert.equal(combineWeightedAverage(75, 1, 0, 0), 75);
});
