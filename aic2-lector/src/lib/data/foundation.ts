import rawLessons from './foundationLessons.json';
import expansionLessons from './foundationExpansion.json';
import type { Text } from '$lib/db';
import type { ReadingQuestion } from './readingQuestions';

export type FoundationLesson = {
  id: string; level: 'A1' | 'A2'; title: string; objective_es: string;
  grammar_es: string; body: string; glossary: Array<{en: string; es: string}>;
  questions: Array<Omit<ReadingQuestion, 'id'>>;
};
export const FOUNDATION_LESSONS = [...rawLessons, ...expansionLessons] as FoundationLesson[];
export function getFoundationLesson(id: string): FoundationLesson | undefined {
  return FOUNDATION_LESSONS.find(lesson => lesson.id === id);
}
export const FOUNDATION_TEXTS: Text[] = FOUNDATION_LESSONS.map(lesson => {
  const words = lesson.body.match(/[A-Za-z]+(?:'[A-Za-z]+)?/g) ?? [];
  return {
    id: lesson.id, title: lesson.title, body: lesson.body, cefr_level: lesson.level,
    genre: 'instructive', word_count: words.length,
    unique_words: new Set(words.map(word => word.toLowerCase())).size,
    avg_sentence_length: Math.round(words.length / Math.max(1, lesson.body.split(/[.!?]+/).filter(s => s.trim()).length)),
    source: 'Original graded training; provisional level; foundation-v1',
    is_authentic: false, key_vocabulary: lesson.glossary.map(item => item.en),
    created_at: new Date('2026-09-16T00:00:00Z'),
  };
});
