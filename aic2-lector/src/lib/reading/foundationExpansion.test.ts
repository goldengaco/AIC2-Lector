import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import type { FoundationLesson } from '../data/foundation';

const read = (name: string): FoundationLesson[] => JSON.parse(readFileSync(new URL(`../data/${name}`, import.meta.url), 'utf8'));
const base = read('foundationLessons.json');
const added = read('foundationExpansion.json');

test('expansion preserves original IDs and adds 12 provisional units per level', () => {
  assert.equal(base.length, 12);
  assert.equal(added.length, 24);
  const all = [...base, ...added];
  assert.equal(new Set(all.map(l => l.id)).size, 36);
  for (const level of ['A1', 'A2']) assert.equal(added.filter(l => l.level === level).length, 12);
});

test('expansion has usable supports and exact evidence for all 96 questions', () => {
  for (const l of added) {
    assert.ok(l.title && l.body && l.objective_es && l.grammar_es);
    assert.equal(l.glossary.length, 5);
    for (const g of l.glossary) assert.ok(g.en && g.es);
    assert.equal(l.questions.length, 4);
    for (const q of l.questions) {
      assert.ok(q.prompt_en && q.support_es);
      assert.ok(['literal', 'sequence', 'causal', 'cohesion', 'inference'].includes(q.kind));
      assert.equal(q.options.length, 3);
      assert.equal(new Set(q.options).size, 3);
      assert.ok(Number.isInteger(q.correct_index) && q.correct_index >= 0 && q.correct_index < 3);
      const quotes = [...q.explanation_es.matchAll(/“([^”]+)”/g)].map(m => m[1]);
      assert.ok(quotes.length > 0, l.id);
      for (const quote of quotes) assert.ok(l.body.includes(quote), `${l.id}: ${quote}`);
    }
  }
});
