<script lang="ts">
  import { ChevronRight, Volume2, Info, Briefcase } from 'lucide-svelte';

  const businessInstructions = [
    { en: 'Match the two columns.', es: 'Empareja las dos columnas.', example: 'Match 1-6 with A-F to form common business phrases.' },
    { en: 'Complete the sentence using the correct form of the word.', es: 'Completa la oración usando la forma correcta de la palabra.', example: 'Complete: Our team ___ (achieve) the targets last quarter.' },
    { en: 'Put the words in the correct order.', es: 'Pon las palabras en el orden correcto.', example: 'Put: meeting / called / manager / a / the → The manager called a meeting.' },
    { en: 'Choose the correct option to complete the email.', es: 'Elige la opción correcta para completar el email.', example: 'Options: A) attached B) attach C) attaching' },
    { en: 'Underline the correct answer.', es: 'Subraya la respuesta correcta.', example: 'The ___ will review the report. (manager/managers/managing)' },
    { en: 'Rewrite the sentence so it means the same.', es: 'Reescribe la oración para que signifique lo mismo.', example: '"The meeting was attended by 50 people." → "50 people ___ the meeting."' },
    { en: 'Find and correct the mistake in each sentence.', es: 'Encuentra y corrige el error en cada oración.', example: 'Her and I attended the conference. → She and I attended...' },
    { en: 'Complete the collocation.', es: 'Completa la colocación.', example: 'make ___ (decision, a decision, the decision)' },
    { en: 'Which word does NOT fit?', es: '¿Qué palabra NO encaja?', example: 'team / project / budget / happy → "happy" does NOT fit.' },
    { en: 'Complete the word in each gap.', es: 'Completa la palabra en cada espacio.', example: 'We need to improve our ___ performance. (per___)' },
    { en: 'Complete the sentence with ONE word.', es: 'Completa la oración con UNA palabra.', example: 'The report is ___ the manager\'s desk. (in, on, at)' },
    { en: 'Listen and fill in the gaps.', es: 'Escucha y completa los espacios.', example: 'Complete the phone conversation with the words you hear.' },
    { en: 'Listen and repeat.', es: 'Escucha y repite.', example: 'Practice pronunciation of business vocabulary.' },
    { en: 'Role-play this conversation with a partner.', es: 'Practica este diálogo con un compañero.', example: 'Act out a meeting negotiation with your partner.' },
    { en: 'Write an email based on the notes.', es: 'Escribe un email basado en las notas.', example: 'Use the information in the notes to write a formal email to a client.' },
    { en: 'Put the paragraphs in the correct order.', es: 'Pon los párrafos en el orden correcto.', example: 'Reorganize the email into a logical sequence.' },
    { en: 'Cross out the word that does NOT belong.', es: 'Tacha la palabra que NO pertenece.', example: 'budget / deadline / meeting / happy (tacha "happy")' },
    { en: 'Fill in the missing letters.', es: 'Llena las letras que faltan.', example: 'The cl___nt sent an email. (client)' },
    { en: 'Complete with the correct preposition.', es: 'Completa con la preposición correcta.', example: 'We discussed ___ the new strategy. (about, with, on)' },
    { en: 'Circle the correct option.', es: 'Rodea la opción correcta.', example: 'Circle A, B, or C: The meeting starts ___ 2 PM.' },
  ];

  const generalInstructions = [
    {
      category: 'Comprensión Lectora',
      cefr: 'A1-B1',
      items: [
        { en: 'Read the text and answer the questions.', es: 'Lee el texto y responde las preguntas.', example: 'Read the text and answer the questions about the main idea.' },
        { en: 'Circle the correct answer.', es: 'Marca/Circula la respuesta correcta.', example: 'Circle the correct answer: (a) John (b) Mary (c) Peter' },
        { en: 'Choose the best title for the text.', es: 'Elige el mejor título para el texto.', example: 'Choose the best title for the text: 1) Dogs 2) How to Train Your Pet 3) Animals' },
        { en: 'What is the main idea of the passage?', es: '¿Cuál es la idea principal del pasaje?', example: 'What is the main idea of the passage? It\'s about... (Respuesta libre)' },
        { en: 'Find evidence in the text that...', es: 'Encuentra evidencia en el texto que...', example: 'Find evidence in the text that supports the author\'s opinion.' },
        { en: 'Based on the text, which of the following is TRUE?', es: 'Según el texto, ¿cuál de las siguientes es VERDADERA?', example: 'Based on the text, which of the following is TRUE? Select one.' },
      ]
    },
    {
      category: 'Completar Espacios',
      cefr: 'A1-B2',
      items: [
        { en: 'Fill in the blanks with the correct word.', es: 'Completa los espacios con la palabra correcta.', example: 'Fill in the blanks with the correct word: The cat ___ on the mat.' },
        { en: 'Complete the sentences using the words from the box.', es: 'Completa las oraciones usando las palabras de la caja.', example: 'Complete the sentences using the words from the box: cat, dog, bird, fish.' },
        { en: 'Choose the best word to complete each sentence.', es: 'Elige la mejor palabra para completar cada oración.', example: 'Choose the best word: I ___ to the store yesterday. (go/went/going)' },
        { en: 'Put the words in the correct order.', es: 'Pon las palabras en el orden correcto.', example: 'Put the words in the correct order: /like/I/English/' },
        { en: 'Use the words in brackets to complete the sentences.', es: 'Usa las palabras entre paréntesis para completar las oraciones.', example: 'She ___ (be) a doctor. / She ___ (read) a book.' },
        { en: 'Fill in each gap with ONE suitable word.', es: 'Llena cada espacio con UNA palabra adecuada.', example: 'Fill in each gap with ONE suitable word. The first letter is given.' },
      ]
    },
    {
      category: 'Opción Múltiple',
      cefr: 'A1-B2',
      items: [
        { en: 'Select the correct option.', es: 'Selecciona la opción correcta.', example: 'Select the correct option: A, B, C, or D' },
        { en: 'Mark (✓) the correct answer.', es: 'Marca (✓) la respuesta correcta.', example: 'Mark (✓) the correct answer: ○ A  ○ B  ○ C' },
        { en: 'Choose A, B, C, or D.', es: 'Elige A, B, C o D.', example: 'Choose A, B, C, or D to complete the sentence.' },
        { en: 'Which of these is NOT mentioned in the text?', es: '¿Cuál de estos NO se menciona en el texto?', example: 'Which of these is NOT mentioned? (La respuesta está en el texto menos uno)' },
        { en: 'All of the following are true EXCEPT...', es: 'Todas las siguientes son verdaderas EXCEPTO...', example: 'All of the following are true EXCEPT: Find la excepción.' },
        { en: 'The author implies that...', es: 'El autor implica que...', example: 'The author implies that... (Respuesta: lo que se deduce, no lo literal)' },
      ]
    },
    {
      category: 'Verdadero o Falso',
      cefr: 'A1-B1',
      items: [
        { en: 'True or False. Correct the false statements.', es: 'Verdadero o Falso. Corrige las afirmaciones falsas.', example: 'True or False. Tom is a doctor. If false: Tom is a teacher.' },
        { en: 'Write T for true and F for false.', es: 'Escribe V para verdadero y F para falso.', example: '1. T  2. F  3. T  4. F' },
        { en: 'Correct the statement if it is false.', es: 'Corrige el enunciado si es falso.', example: 'Statement: Dogs can fly. Correction: Dogs cannot fly. They are land animals.' },
        { en: 'Justify your answer.', es: 'Justifica tu respuesta.', example: 'True. Line 3 says "..." / False. Line 5 states "..." instead.' },
        { en: 'Find evidence in the text to support your answer.', es: 'Encuentra evidencia en el texto para apoyar tu respuesta.', example: 'Find evidence: "The study shows..." (line 12)' },
      ]
    },
  ];

  let expandedCategory = $state<string | null>('Oxford Business Result');

  function speak(text: string) {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  }
</script>

<svelte:head>
  <title>Instructions - AIC2-Lector</title>
</svelte:head>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Exercise Instructions</h1>
      <p class="text-gray-500 mt-1">Aprende qué te piden los ejercicios en inglés</p>
    </div>
    <a
      href="/"
      class="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
    >
      ← Volver
    </a>
  </div>

  <div class="bg-primary-50 border border-primary-200 rounded-xl p-4">
    <div class="flex gap-3">
      <Info class="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
      <div class="text-sm text-primary-800">
        <strong>¿Por qué esto te ayuda?</strong><br />
        Cuando sabes exactamente qué te piden, puedes concentrarte en <em>resolver</em> el ejercicio en lugar de <em>adivinar</em> qué tienes que hacer. 
        Esto reduce frustración y aumenta tu confianza.
      </div>
    </div>
  </div>

  <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
    <div class="flex items-center gap-3 mb-3">
      <div class="p-2 bg-blue-600 rounded-lg">
        <Briefcase class="w-5 h-5 text-white" />
      </div>
      <h2 class="text-lg font-bold text-gray-900">Oxford Business Result</h2>
    </div>
    <p class="text-sm text-gray-600 mb-4">Instrucciones específicas que verás en tus libros Business Result:</p>
    
    <div class="grid md:grid-cols-2 gap-3">
      {#each businessInstructions as item}
        <div class="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors">
          <div class="flex items-start gap-2">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="font-medium text-gray-900 text-sm">{item.en}</span>
                <button
                  onclick={() => speak(item.en)}
                  class="p-1 text-gray-400 hover:text-primary-600 rounded transition-colors flex-shrink-0"
                  title="Escuchar"
                >
                  <Volume2 class="w-4 h-4" />
                </button>
              </div>
              <p class="text-primary-700 text-sm mb-2">{item.es}</p>
              <p class="text-xs text-gray-500 italic bg-gray-50 rounded p-2">Ej: {item.example}</p>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <div class="space-y-3">
    {#each generalInstructions as section}
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <button
          onclick={() => expandedCategory = expandedCategory === section.category ? null : section.category}
          class="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center gap-3">
            <span class="font-semibold text-gray-900">{section.category}</span>
            <span class="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
              {section.cefr}
            </span>
            <span class="text-gray-400 text-sm">({section.items.length} instrucciones)</span>
          </div>
          <ChevronRight class="w-5 h-5 text-gray-400 transition-transform {expandedCategory === section.category ? 'rotate-90' : ''}" />
        </button>

        {#if expandedCategory === section.category}
          <div class="border-t border-gray-100 bg-gray-50/50">
            <div class="divide-y divide-gray-100">
              {#each section.items as item}
                <div class="px-5 py-4 hover:bg-white transition-colors">
                  <div class="flex items-start gap-4">
                    <div class="flex-1 space-y-2">
                      <div class="flex items-center gap-2">
                        <span class="font-medium text-gray-900">{item.en}</span>
                        <button
                          onclick={() => speak(item.en)}
                          class="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Escuchar pronunciación"
                        >
                          <Volume2 class="w-4 h-4" />
                        </button>
                      </div>
                      <p class="text-primary-700 font-medium">{item.es}</p>
                      <div class="bg-white border border-gray-200 rounded-lg p-3">
                        <span class="text-xs text-gray-400 uppercase tracking-wide">Ejemplo:</span>
                        <p class="text-gray-700 text-sm mt-1">{item.example}</p>
                      </div>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    {/each}
  </div>

  <div class="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white">
    <h2 class="font-bold text-lg mb-2">¿No encuentras tu instrucción?</h2>
    <p class="text-primary-100 mb-4">
      Las instrucciones varían según el libro. Si encuentras una que no entiendes, anótala y pregúntame. 
      La agregaré a la lista.
    </p>
    <div class="bg-white/10 rounded-lg p-4">
      <p class="text-sm text-primary-100">Consejo: Cuando veas un ejercicio, busca la primera oración. 
      Esa casi siempre es la instrucción (qué hacer). El resto son las preguntas.</p>
    </div>
  </div>
</div>