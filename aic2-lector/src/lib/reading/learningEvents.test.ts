import assert from 'node:assert/strict';
import test from 'node:test';
import { buildReadingLearningEvents } from './learningEvents.ts';

test('builds a minimal deterministic event ledger without raw answers or text', () => {
  const events = buildReadingLearningEvents({
    sessionId: 'session-1',
    textId: 'text-1',
    occurredAt: new Date('2026-09-15T12:00:00.000Z'),
    assessmentRole: 'delayed-retest',
    assessmentWindowDays: 7,
    questions: [
      { id: 'q-1', kind: 'inference', isCorrect: true, confidence: 2 },
      { id: 'q-2', kind: 'literal', isCorrect: false, confidence: null },
    ],
  });

  assert.equal(events.length, 3);
  assert.deepEqual(events[0], {
    id: 'event-session-1-session-completed',
    schema_version: 1,
    action: 'session-completed',
    object_id: 'session-1',
    object_type: 'reading-session',
    occurred_at: new Date('2026-09-15T12:00:00.000Z'),
    session_id: 'session-1',
    text_id: 'text-1',
    assessment_role: 'delayed-retest',
    assessment_window_days: 7,
  });
  assert.equal(events[1].is_correct, true);
  assert.equal(events[1].confidence, 2);
  assert.equal('raw_answer' in events[1], false);
  assert.equal('body' in events[0], false);
});
