<script lang="ts">
  let minutes = $state<5 | 20 | 45>(5);
  const plans = {
    5: ['1 min: mira el título y elige un texto familiar.', '3 min: lee y vuelve a la frase que te cueste; consulta una glosa si la necesitas.', '1 min: localiza un dato y comprueba qué frase lo respalda.'],
    20: ['3 min: revisa el objetivo y vocabulario de apoyo.', '12 min: lee a tu ritmo y responde buscando evidencia en el texto.', '5 min: revisa los errores y relee las frases correspondientes.'],
    45: ['5 min: elige una unidad y revisa su objetivo.', '15 min: lee y comprueba la comprensión.', '5 min: pausa voluntaria, lejos del texto si te ayuda.', '15 min: revisa dificultades o practica otra unidad.', '5 min: cierra revisando una idea que ahora entiendas mejor.'],
  };
</script>

<section class="card space-y-3" aria-label="Tiempo disponible para leer">
  <h2 class="font-semibold">¿Cuánto tiempo tienes hoy?</h2>
  <div class="flex flex-wrap gap-2">
    {#each [5, 20, 45] as value}
      <button type="button" class="btn-secondary" aria-pressed={minutes === value} onclick={() => minutes = value as 5 | 20 | 45}>{value} minutos</button>
    {/each}
  </div>
  <ol class="list-decimal pl-5 space-y-1 text-sm text-gray-700" aria-live="polite">
    {#each plans[minutes] as step}<li>{step}</li>{/each}
  </ol>
  <p class="text-sm text-gray-600">Guía flexible, sin cuenta regresiva ni obligación de terminar. Puedes parar cuando lo necesites. Si tienes más tiempo, combina bloques con descansos.</p>
  <p class="text-sm text-gray-600">Si no entiendes la idea, usa la ayuda o elige un tema más familiar. Un texto corto no siempre es más fácil.</p>
</section>
