import assert from 'node:assert/strict';
import test from 'node:test';
import { addDays, getRetestPlans, getRetestStatus } from './retention.ts';

const startedAt = new Date('2026-01-01T12:00:00.000Z');

test('schedules 7-day and 30-day plans from a completed first attempt', () => {
  const plans = getRetestPlans([{
    id: 't0',
    text_id: 'text-a',
    started_at: startedAt,
    finished_at: startedAt,
    first_attempt: true,
    assessment_role: 'formative',
  }], new Date('2026-01-04T12:00:00.000Z'));

  assert.deepEqual(plans.map(plan => ({
    parentSessionId: plan.parentSessionId,
    sourceTextId: plan.sourceTextId,
    windowDays: plan.windowDays,
    status: plan.status,
  })), [
    { parentSessionId: 't0', sourceTextId: 'text-a', windowDays: 7, status: 'upcoming' },
    { parentSessionId: 't0', sourceTextId: 'text-a', windowDays: 30, status: 'upcoming' },
  ]);
});

test('does not recreate a retest plan after its delayed attempt is saved', () => {
  const plans = getRetestPlans([
    {
      id: 't0', text_id: 'text-a', started_at: startedAt, finished_at: startedAt,
      first_attempt: true, assessment_role: 'formative',
    },
    {
      id: 't7', text_id: 'text-b', started_at: addDays(startedAt, 7),
      finished_at: addDays(startedAt, 7), first_attempt: true,
      assessment_role: 'delayed-retest', assessment_parent_id: 't0', assessment_window_days: 7,
    },
  ], new Date('2026-01-10T12:00:00.000Z'));

  assert.deepEqual(plans.map(plan => plan.windowDays), [30]);
});

test('uses a one-day tolerance around the due date and marks late work overdue', () => {
  const dueAt = new Date('2026-01-08T12:00:00.000Z');
  assert.equal(getRetestStatus(dueAt, new Date('2026-01-07T12:00:00.000Z')), 'due');
  assert.equal(getRetestStatus(dueAt, new Date('2026-01-10T12:00:01.000Z')), 'overdue');
});
