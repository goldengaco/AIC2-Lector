import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const lessons = JSON.parse(readFileSync(new URL('../data/foundationLessons.json', import.meta.url), 'utf8')) as Array<{
  id: string; level: string; body: string; objective_es: string; grammar_es: string;
  glossary: Array<{en: string; es: string}>;
  questions: Array<{kind: string; options: string[]; correct_index: number; explanation_es: string}>;
}>;

test('foundation curriculum has distinct A1 and A2 lessons with usable reading support', () => {
  assert.equal(lessons.length, 12);
  assert.equal(new Set(lessons.map(l => l.id)).size, 12);
  for (const level of ['A1', 'A2']) assert.equal(lessons.filter(l => l.level === level).length, 6);
  for (const lesson of lessons) {
    assert.ok(lesson.id.startsWith(`foundation-${lesson.level.toLowerCase()}-`));
    assert.ok(lesson.objective_es.length > 10 && lesson.grammar_es.length > 10);
    assert.equal(lesson.glossary.length, 3);
    assert.equal(lesson.questions.length, 4);
    for (const entry of lesson.glossary) assert.ok(entry.en && entry.es);
  }
});

test('every foundation explanation cites actual passage evidence and every answer is in range', () => {
  for (const lesson of lessons) for (const question of lesson.questions) {
    assert.ok(['literal','sequence','causal','cohesion','inference'].includes(question.kind));
    assert.equal(new Set(question.options).size, 3);
    assert.ok(Number.isInteger(question.correct_index) && question.correct_index >= 0 && question.correct_index < question.options.length);
    const quote = question.explanation_es.match(/“(.+)”/)?.[1];
    assert.ok(quote && lesson.body.includes(quote), `${lesson.id}: evidence must exist in the passage`);
  }
});
