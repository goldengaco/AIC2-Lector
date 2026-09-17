<script lang="ts">
  import { selectDrills } from '$lib/reading/coaching';
  let { evidence }: { evidence: Array<{kind: string; correct: number; total: number}> } = $props();
  let selected = $derived(selectDrills(evidence));
  let answers = $state<Record<string, number>>({});
  let hints = $state<Record<string, boolean>>({});
</script>

{#if selected.length > 0}
  <section class="card space-y-4" aria-label="Práctica guiada de lectura">
    <h2 class="text-lg font-semibold">Practica lo que te costó</h2>
    <p class="text-sm text-gray-600">Ejercicios breves elegidos a partir de tus errores. Son práctica adicional; no cambian tu evaluación ni tu nivel.</p>
    {#each selected as drill}
      <div class="rounded-lg border p-4 space-y-3">
        <h3 class="font-semibold">{drill.title}</h3>
        {#each drill.examples as example, index}
          {@const key = `${drill.kind}-${index}`}
          {#if index === 0 || answers[`${drill.kind}-0`] !== undefined}
            <fieldset class="space-y-2 border-t pt-3">
              <legend class="text-sm font-medium">{index === 0 ? 'Primero, inténtalo' : 'Ahora aplica la idea en otra frase'}</legend>
              <p lang="en" class="text-lg">{example.text}</p>
              <p>{example.question}</p>
              <div class="flex flex-wrap gap-2">
                {#each example.options as option, optionIndex}
                  <button class="btn-secondary" disabled={answers[key] !== undefined} onclick={() => answers[key] = optionIndex}>{option}</button>
                {/each}
              </div>
              {#if answers[key] === undefined}
                <button class="text-sm underline" onclick={() => hints[key] = true}>Necesito una pista</button>
                {#if hints[key]}<p class="text-sm text-indigo-700">{drill.hint}</p>{/if}
              {:else}
                <p role="status" class="text-sm">{answers[key] === example.answer ? 'Correcto.' : `La respuesta es: ${example.options[example.answer]}.`} {example.explanation}</p>
              {/if}
            </fieldset>
          {/if}
        {/each}
      </div>
    {/each}
  </section>
{/if}
