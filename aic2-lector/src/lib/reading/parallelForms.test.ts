import assert from 'node:assert/strict';
import test from 'node:test';
import { validateParallelForms, type ParallelFormMetadata } from './parallelForms.ts';

const baseForm: ParallelFormMetadata = {
  formId: 'pilot-a',
  textId: 'text-a',
  level: 'B1',
  genre: 'technical-ia',
  wordCount: 240,
  itemCount: 9,
  capabilityKinds: ['literal', 'cohesion', 'modality', 'inference'],
  version: '1.0.0',
};

function form(overrides: Partial<ParallelFormMetadata>): ParallelFormMetadata {
  return { ...baseForm, ...overrides };
}

test('accepts a structurally parallel A/B/C bank', () => {
  assert.deepEqual(validateParallelForms([
    form({ formId: 'pilot-a', textId: 'text-a', wordCount: 240 }),
    form({ formId: 'pilot-b', textId: 'text-b', wordCount: 250 }),
    form({ formId: 'pilot-c', textId: 'text-c', wordCount: 235 }),
  ]), { valid: true, issues: [] });
});

test('rejects a bank that only shares a CEFR label but not the construct', () => {
  const result = validateParallelForms([
    form({ formId: 'pilot-a', textId: 'text-a' }),
    form({ formId: 'pilot-b', textId: 'text-b', capabilityKinds: ['literal', 'inference'] }),
    form({ formId: 'pilot-c', textId: 'text-c' }),
  ]);

  assert.equal(result.valid, false);
  assert.ok(result.issues.some(issue => issue.includes('constructos')));
});

test('rejects large length differences and duplicate identifiers', () => {
  const result = validateParallelForms([
    form({ formId: 'pilot-a', textId: 'text-a', wordCount: 200 }),
    form({ formId: 'pilot-a', textId: 'text-b', wordCount: 240 }),
    form({ formId: 'pilot-c', textId: 'text-b', wordCount: 230 }),
  ]);

  assert.equal(result.valid, false);
  assert.ok(result.issues.some(issue => issue.includes('formId')));
  assert.ok(result.issues.some(issue => issue.includes('textId')));
  assert.ok(result.issues.some(issue => issue.includes('10%')));
});
