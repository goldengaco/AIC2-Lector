import type { LearningEvent, LearningEventAction } from '$lib/db';

type ReadingEventInput = {
  sessionId: string;
  textId: string;
  occurredAt: Date;
  assessmentRole: 'formative' | 'transfer' | 'delayed-retest';
  assessmentWindowDays?: 7 | 30;
  questions: Array<{
    id: string;
    kind?: string;
    isCorrect: boolean;
    confidence: 0 | 1 | 2 | null;
  }>;
};

function eventId(sessionId: string, action: LearningEventAction, suffix = ''): string {
  return `event-${sessionId}-${action}${suffix ? `-${suffix}` : ''}`;
}

/**
 * Builds a minimal, deterministic local event ledger. Raw text and raw answer
 * choices are deliberately excluded so the ledger can be exported later with
 * less privacy risk.
 */
export function buildReadingLearningEvents(input: ReadingEventInput): LearningEvent[] {
  const sessionEvent: LearningEvent = {
    id: eventId(input.sessionId, 'session-completed'),
    schema_version: 1,
    action: 'session-completed',
    object_id: input.sessionId,
    object_type: 'reading-session',
    occurred_at: input.occurredAt,
    session_id: input.sessionId,
    text_id: input.textId,
    assessment_role: input.assessmentRole,
    assessment_window_days: input.assessmentWindowDays,
  };

  const itemEvents = input.questions.map((question, index): LearningEvent => ({
    id: eventId(input.sessionId, 'item-answered', `${index}-${question.id}`),
    schema_version: 1,
    action: 'item-answered',
    object_id: question.id,
    object_type: 'reading-question',
    occurred_at: input.occurredAt,
    session_id: input.sessionId,
    text_id: input.textId,
    assessment_role: input.assessmentRole,
    assessment_window_days: input.assessmentWindowDays,
    question_kind: question.kind,
    is_correct: question.isCorrect,
    confidence: question.confidence,
  }));

  return [sessionEvent, ...itemEvents];
}
