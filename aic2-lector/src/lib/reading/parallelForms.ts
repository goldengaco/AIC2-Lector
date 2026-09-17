import type { CefrLevel, TextGenre } from '$lib/db';

export type ParallelFormMetadata = {
  formId: string;
  textId: string;
  level: CefrLevel;
  genre: TextGenre;
  wordCount: number;
  itemCount: number;
  capabilityKinds: string[];
  version: string;
};

export type ParallelFormsValidation = {
  valid: boolean;
  issues: string[];
};

const REQUIRED_FORM_COUNT = 3;
const WORD_COUNT_TOLERANCE = 0.10;

/**
 * Validates the minimum structural contract for an A/B/C retest bank.
 * Passing this check is not psychometric equating or CEFR validation.
 */
export function validateParallelForms(forms: ParallelFormMetadata[]): ParallelFormsValidation {
  const issues: string[] = [];
  const formIds = new Set(forms.map(form => form.formId));
  const textIds = new Set(forms.map(form => form.textId));

  if (forms.length !== REQUIRED_FORM_COUNT) {
    issues.push(`Se requieren exactamente ${REQUIRED_FORM_COUNT} formas A/B/C.`);
  }
  if (formIds.size !== forms.length) issues.push('Los formId deben ser únicos.');
  if (textIds.size !== forms.length) issues.push('Los textId deben ser únicos.');
  if (forms.some(form => !Number.isFinite(form.wordCount) || form.wordCount <= 0)) {
    issues.push('Cada forma necesita un wordCount positivo.');
  }
  if (forms.some(form => !Number.isFinite(form.itemCount) || form.itemCount <= 0)) {
    issues.push('Cada forma necesita al menos un ítem.');
  }

  const first = forms[0];
  if (first) {
    if (forms.some(form => form.level !== first.level)) issues.push('Las formas deben compartir nivel objetivo.');
    if (forms.some(form => form.genre !== first.genre)) issues.push('Las formas deben compartir género discursivo.');
    if (forms.some(form => form.itemCount !== first.itemCount)) issues.push('Las formas deben tener el mismo número de ítems.');

    const expectedKinds = [...new Set(first.capabilityKinds)].sort();
    if (expectedKinds.length === 0) issues.push('La especificación necesita capacidades evaluadas.');
    if (forms.some(form => JSON.stringify([...new Set(form.capabilityKinds)].sort()) !== JSON.stringify(expectedKinds))) {
      issues.push('Las formas deben conservar los mismos constructos en el mismo banco.');
    }

    const minWords = Math.min(...forms.map(form => form.wordCount));
    const maxWords = Math.max(...forms.map(form => form.wordCount));
    if (minWords > 0 && (maxWords - minWords) / minWords > WORD_COUNT_TOLERANCE) {
      issues.push('La diferencia de longitud supera el 10% del texto más corto.');
    }
  }

  return { valid: issues.length === 0, issues };
}
