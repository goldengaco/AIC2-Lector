export type RetestWindowDays = 7 | 30;
export type RetestPlanStatus = 'upcoming' | 'due' | 'overdue';

export type RetentionSessionLike = {
  id: string;
  text_id?: string;
  started_at: Date;
  finished_at?: Date;
  first_attempt?: boolean;
  assessment_role?: 'formative' | 'transfer' | 'delayed-retest';
  assessment_parent_id?: string;
  assessment_window_days?: RetestWindowDays;
};

export type RetestPlan = {
  parentSessionId: string;
  sourceTextId: string;
  windowDays: RetestWindowDays;
  dueAt: Date;
  status: RetestPlanStatus;
};

const RETEST_WINDOWS: RetestWindowDays[] = [7, 30];
const DUE_TOLERANCE_MS = 24 * 60 * 60 * 1_000;

function hasValidCompletion(session: RetentionSessionLike): boolean {
  if (!session.finished_at) return false;
  const start = new Date(session.started_at).getTime();
  const finish = new Date(session.finished_at).getTime();
  return Number.isFinite(start) && Number.isFinite(finish) && finish >= start;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function getRetestStatus(dueAt: Date, now: Date): RetestPlanStatus {
  if (now.getTime() < dueAt.getTime() - DUE_TOLERANCE_MS) return 'upcoming';
  if (now.getTime() <= dueAt.getTime() + DUE_TOLERANCE_MS) return 'due';
  return 'overdue';
}

/**
 * Creates missing 7-day and 30-day retest plans from immutable first attempts.
 * A plan is evidence scheduling only; it does not claim that learning happened.
 */
export function getRetestPlans(
  sessions: RetentionSessionLike[],
  now = new Date(),
): RetestPlan[] {
  const completedChildren = new Set(
    sessions
      .filter(session => hasValidCompletion(session) && session.assessment_role === 'delayed-retest' && session.assessment_parent_id)
      .map(session => `${session.assessment_parent_id}:${session.assessment_window_days}`),
  );

  return sessions
    .filter(session => hasValidCompletion(session) && session.first_attempt === true && session.assessment_role === 'formative' && session.text_id)
    .flatMap(session => {
      const completedAt = session.finished_at ?? session.started_at;
      return RETEST_WINDOWS
        .filter(windowDays => !completedChildren.has(`${session.id}:${windowDays}`))
        .map(windowDays => {
          const dueAt = addDays(completedAt, windowDays);
          return {
            parentSessionId: session.id,
            sourceTextId: session.text_id!,
            windowDays,
            dueAt,
            status: getRetestStatus(dueAt, now),
          };
        });
    })
    .sort((left, right) => left.dueAt.getTime() - right.dueAt.getTime());
}
