import test from 'node:test';
import assert from 'node:assert/strict';
import { getRetestPlans } from './retention.ts';

const start = new Date('2026-01-01T12:00:00Z');
const parent = { id: 'parent', text_id: 'a', started_at: start, first_attempt: true, assessment_role: 'formative' as const };

test('unfinished and invalid parent attempts do not create retests', () => {
  for (const finished_at of [undefined, new Date('invalid'), new Date('2025-01-01')]) {
    assert.deepEqual(getRetestPlans([{...parent, finished_at}], start), []);
  }
});

test('an unfinished child does not suppress a pending retest', () => {
  const sessions = [
    {...parent, finished_at: start},
    {id:'child', started_at:start, assessment_role:'delayed-retest' as const, assessment_parent_id:'parent', assessment_window_days:7 as const},
  ];
  assert.deepEqual(getRetestPlans(sessions, start).map(p => p.windowDays), [7, 30]);
  assert.deepEqual(getRetestPlans([sessions[0], {...sessions[1], finished_at:start}], start).map(p => p.windowDays), [30]);
});
