<script lang="ts">
  import { onMount } from 'svelte';
  import { db, type Text } from '$lib/db';
  import { getStats, estimateCefrLevel } from '$lib/db/stats';
  import { toasts } from '$lib/stores/app';
  import { Award, CheckCircle, Clock, Target, BookOpen, TrendingUp } from 'lucide-svelte';

  let texts = $state<Text[]>([]);
  let currentTest = $state<{
    text: Text | null;
    questions: { question: string; options: string[]; correct: number }[];
    currentQuestion: number;
    answers: number[];
    showResults: boolean;
  }>({
    text: null,
    questions: [],
    currentQuestion: 0,
    answers: [],
    showResults: false,
  });

  const levelCheckpoints = [
    {
      level: 'A1',
      title: 'Checkpoint A0 → A1',
      description: 'Read basic instructions, 800 words vocabulary',
      requirements: ['60 wpm reading speed', '80 verb recognition', 'Basic sentence structure'],
      icon: '📘',
    },
    {
      level: 'A2',
      title: 'Checkpoint A1 → A2',
      description: 'Read simple texts, 2000 words vocabulary',
      requirements: ['80 wpm reading speed', '500 cognates recognized', 'Present/Past tense understanding'],
      icon: '📗',
    },
    {
      level: 'B1',
      title: 'Checkpoint A2 → B1',
      description: 'Read intermediate texts, 4000 words vocabulary',
      requirements: ['100 wpm reading speed', 'AWL sublists 1-3', 'Basic academic vocabulary'],
      icon: '📙',
    },
    {
      level: 'B2',
      title: 'Checkpoint B1 → B2',
      description: 'Read complex texts, 7000 words vocabulary',
      requirements: ['150 wpm reading speed', 'Morphology mastery (100 roots)', 'Technical vocabulary 500+'],
      icon: '📕',
    },
    {
      level: 'C1',
      title: 'Checkpoint B2 → C1',
      description: 'Read advanced texts, 10000 words vocabulary',
      requirements: ['200 wpm reading speed', 'IA technical vocabulary 2000+', 'Academic discourse markers'],
      icon: '📓',
    },
    {
      level: 'C2',
      title: 'Checkpoint C1 → C2',
      description: 'Read expert-level texts, 12000+ words',
      requirements: ['250+ wpm reading speed', 'Paper comprehension 95%+', 'Native-like inference'],
      icon: '📔',
    },
  ];

  const sampleQuestions: Record<string, { question: string; options: string[]; correct: number; explanation?: string }[]> = {
    'A1': [
      {
        question: 'What does "Open the file" mean?',
        options: ['A) Close the file', 'B) Open the file', 'C) Save the file', 'D) Delete the file'],
        correct: 1,
        explanation: '"Open" = Abrir. Cognado: file/archivo.'
      },
      {
        question: 'What does "Click the button" mean?',
        options: ['A) Close the button', 'B) Press/Hit the button', 'C) Save the button', 'D) Delete the button'],
        correct: 1,
        explanation: '"Click" = Hacer clic / Presionar un botón.'
      },
      {
        question: 'What does "Fill in the blanks" mean?',
        options: ['A) Read the blanks', 'B) Complete the spaces', 'C) Delete the blanks', 'D) Circle the blanks'],
        correct: 1,
        explanation: '"Fill in" = Llenar/Completar. "Blanks" = espacios en blanco.'
      },
      {
        question: 'What does "Circle the correct answer" mean?',
        options: ['A) Underline the answer', 'B) Mark/Circle the correct answer', 'C) Cross out the answer', 'D) Write the answer'],
        correct: 1,
        explanation: '"Circle" = Rodea. Usa un círculo para marcar la respuesta correcta.'
      },
      {
        question: 'What does "True or False" mean?',
        options: ['A) Yes or No', 'B) Right or Wrong', 'C) Good or Bad', 'D) Fast or Slow'],
        correct: 1,
        explanation: '"True" = Verdadero/Correcto, "False" = Falso/Incorrecto.'
      },
      {
        question: 'What does "Match the columns" mean?',
        options: ['A) Translate the columns', 'B) Join the columns', 'C) Read the columns', 'D) Delete the columns'],
        correct: 1,
        explanation: '"Match" = Emparejar. Une elementos de una columna con la otra.'
      },
      {
        question: 'What does "Put the words in order" mean?',
        options: ['A) Read the words', 'B) Write the words', 'C) Arrange the words correctly', 'D) Delete the words'],
        correct: 2,
        explanation: '"Put in order" = Ordenar/Organizar correctamente.'
      },
      {
        question: 'What does "Rewrite the sentence" mean?',
        options: ['A) Read the sentence', 'B) Translate the sentence', 'C) Write the sentence again', 'D) Delete the sentence'],
        correct: 2,
        explanation: '"Rewrite" = Reescribir. Usa tus propias palabras.'
      },
    ],
    'A2': [
      {
        question: 'What does "Complete the collocation" mean?',
        options: ['A) Complete the translation', 'B) Complete the word combination', 'C) Complete the paragraph', 'D) Complete the reading'],
        correct: 1,
        explanation: '"Collocation" = palabras que van juntas. Ej: "make a decision"'
      },
      {
        question: 'What does "Which word does NOT fit?" mean?',
        options: ['A) Which word is correct?', 'B) Which word does NOT belong?', 'C) Which word is missing?', 'D) Which word is difficult?'],
        correct: 1,
        explanation: '"Fit" = encajar. Busca la palabra que no pertenece al grupo.'
      },
      {
        question: '"A cognate" with "information" is:',
        options: ['A) Formation', 'B) Information', 'C) Informing', 'D) Informal'],
        correct: 1,
        explanation: 'Cognados = misma raíz: inform- / información. Casi idénticos!'
      },
      {
        question: 'What does "Listen and fill in the gaps" mean?',
        options: ['A) Read and write', 'B) Hear and complete the spaces', 'C) Speak and read', 'D) Watch and write'],
        correct: 1,
        explanation: 'Escucha el audio y escribe las palabras que faltan.'
      },
    ],
    'B1': [
      {
        question: 'What does "Find evidence in the text" mean?',
        options: ['A) Write your opinion', 'B) Find proof in the text', 'C) Invent an answer', 'D) Translate the text'],
        correct: 1,
        explanation: 'Busca la parte del texto que prueba/justifica tu respuesta.'
      },
      {
        question: 'What does "Role-play this conversation" mean?',
        options: ['A) Translate the dialogue', 'B) Read the dialogue aloud', 'C) Act out with a partner', 'D) Write a new dialogue'],
        correct: 2,
        explanation: '"Role-play" = actuar/hacer de personaje. Practica con alguien.'
      },
      {
        question: 'In "transformation", the root "form" means:',
        options: ['A) To form/shape', 'B) To inform', 'C) To perform', 'D) To reform'],
        correct: 0,
        explanation: '"Form" = forma. "Transformation" = cambio de forma.'
      },
      {
        question: 'The suffix "-tion" typically indicates:',
        options: ['A) A person', 'B) An action/state', 'C) An adjective', 'D) An adverb'],
        correct: 1,
        explanation: '-tion convierte verbos en sustantivos: inform → information'
      },
      {
        question: 'What does "Write an email based on the notes" mean?',
        options: ['A) Read the notes', 'B) Delete the notes', 'C) Create an email using the notes', 'D) Translate the notes'],
        correct: 2,
        explanation: 'Usa la información de las notas para escribir un email formal.'
      },
    ],
  };

  onMount(async () => {
    texts = await db.texts.toArray();
  });

  function startTest(cefrLevel: string) {
    const text = texts.find(t => t.cefr_level === cefrLevel) || texts[0];
    const questions = sampleQuestions[cefrLevel] || sampleQuestions['A1'];

    currentTest = {
      text,
      questions,
      currentQuestion: 0,
      answers: [],
      showResults: false,
    };
  }

  function answerQuestion(answerIndex: number) {
    currentTest.answers[currentTest.currentQuestion] = answerIndex;
    currentTest.answers = [...currentTest.answers];
  }

  function nextQuestion() {
    if (currentTest.currentQuestion < currentTest.questions.length - 1) {
      currentTest.currentQuestion++;
    } else {
      currentTest.showResults = true;
    }
  }

  function getScore(): { correct: number; total: number; percentage: number } {
    const correct = currentTest.answers.reduce((acc, answer, index) => {
      return acc + (answer === currentTest.questions[index].correct ? 1 : 0);
    }, 0);
    const total = currentTest.questions.length;
    return {
      correct,
      total,
      percentage: Math.round((correct / total) * 100),
    };
  }

  function closeResults() {
    currentTest = {
      text: null,
      questions: [],
      currentQuestion: 0,
      answers: [],
      showResults: false,
    };
  }

  function getGrade(percentage: number): { grade: string; color: string; message: string } {
    if (percentage >= 90) return { grade: 'A+', color: 'text-green-600', message: 'Excellent! You\'re ready for the next level!' };
    if (percentage >= 80) return { grade: 'A', color: 'text-green-600', message: 'Great job! Keep practicing!' };
    if (percentage >= 70) return { grade: 'B', color: 'text-blue-600', message: 'Good work! A bit more practice and you\'ll excel.' };
    if (percentage >= 60) return { grade: 'C', color: 'text-yellow-600', message: 'Passing. Focus on the weak areas.' };
    return { grade: 'F', color: 'text-red-600', message: 'Keep studying. You\'ll get there!' };
  }
</script>

<div class="space-y-6">
  <div>
    <h1 class="text-2xl font-bold text-gray-900">Tests & Checkpoints</h1>
    <p class="text-gray-500 mt-1">Track your progress through CEFR levels</p>
  </div>

  {#if !currentTest.text && !currentTest.showResults}
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each levelCheckpoints as checkpoint}
        <div class="card-hover">
          <div class="flex items-start gap-4">
            <span class="text-4xl">{checkpoint.icon}</span>
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900">{checkpoint.title}</h3>
              <p class="text-sm text-gray-500 mt-1">{checkpoint.description}</p>
              <ul class="mt-3 space-y-1">
                {#each checkpoint.requirements as req}
                  <li class="text-sm text-gray-600 flex items-center gap-2">
                    <CheckCircle class="w-4 h-4 text-green-500" />
                    {req}
                  </li>
                {/each}
              </ul>
              <button 
                onclick={() => startTest(checkpoint.level)}
                class="btn-primary mt-4 w-full"
              >
                Take Test
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>

    <div class="card mt-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Quick Level Indicator</h2>
      <div class="flex items-center justify-center gap-4 py-8">
        {#each ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as level, i}
          <div class="flex items-center">
            <div class="w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg
                        {i < 2 ? 'bg-green-100 text-green-700' : 
                         i < 4 ? 'bg-blue-100 text-blue-700' : 
                         i < 5 ? 'bg-yellow-100 text-yellow-700' : 
                         'bg-red-100 text-red-700'}">
              {level}
            </div>
            {#if i < 5}
              <div class="w-8 h-1 bg-gray-200 mx-1"></div>
            {/if}
          </div>
        {/each}
      </div>
      <p class="text-center text-sm text-gray-500 mt-4">
        Your current estimated level is based on vocabulary size, reading speed, and comprehension.
      </p>
    </div>

  {:else if currentTest.showResults}
    {@const score = getScore()}
    {@const grade = getGrade(score.percentage)}
    
    <div class="card text-center py-8 max-w-2xl mx-auto">
      <div class="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center
                  {score.percentage >= 60 ? 'bg-green-100' : 'bg-red-100'}">
        <span class="text-3xl font-bold {grade.color}">{grade.grade}</span>
      </div>
      
      <h2 class="text-xl font-bold text-gray-900 mb-1">Test Complete!</h2>
      <p class="text-gray-600 mb-6">{grade.message}</p>

      <div class="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-8">
        <div class="text-center">
          <p class="text-2xl font-bold text-primary-600">{score.correct}</p>
          <p class="text-xs text-gray-500">Correct</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold text-gray-400">{score.total - score.correct}</p>
          <p class="text-xs text-gray-500">Wrong</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold {score.percentage >= 70 ? 'text-green-600' : 'text-red-600'}">
            {score.percentage}%
          </p>
          <p class="text-xs text-gray-500">Score</p>
        </div>
      </div>

      <div class="text-left bg-gray-50 rounded-lg p-4 mb-6 max-h-96 overflow-y-auto">
        <h3 class="font-semibold text-gray-900 mb-3">Review Answers:</h3>
        {#each currentTest.questions as q, i}
          {@const isCorrect = currentTest.answers[i] === q.correct}
          <div class="mb-4 pb-3 border-b border-gray-200 last:border-0">
            <p class="text-sm font-medium text-gray-800 mb-1">{i + 1}. {q.question}</p>
            <p class="text-xs {isCorrect ? 'text-green-600' : 'text-red-600'}">
              Tu respuesta: {q.options[currentTest.answers[i]]}
              {isCorrect ? '✓' : `✗ (Correcta: ${q.options[q.correct]})`}
            </p>
            {#if q.explanation}
              <p class="text-xs text-blue-600 mt-1 bg-blue-50 p-2 rounded">💡 {q.explanation}</p>
            {/if}
          </div>
        {/each}
      </div>

      <div class="space-y-3">
        <button onclick={closeResults} class="btn-primary w-full">
          Back to Checkpoints
        </button>
        <button onclick={() => startTest(currentTest.text?.cefr_level || 'A1')} class="btn-secondary w-full">
          Try Again
        </button>
      </div>
    </div>

  {:else}
    <div class="max-w-2xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <button onclick={closeResults} class="text-gray-500 hover:text-gray-700">
          ← Cancel Test
        </button>
        <div class="flex items-center gap-2">
          <span class="badge-info">Level {currentTest.text?.cefr_level}</span>
          <span class="text-sm text-gray-500">
            Question {currentTest.currentQuestion + 1} of {currentTest.questions.length}
          </span>
        </div>
      </div>

      <div class="card">
        {#if currentTest.questions[currentTest.currentQuestion]}
          {@const q = currentTest.questions[currentTest.currentQuestion]}
          <h3 class="text-lg font-semibold text-gray-900 mb-6">{q.question}</h3>
          
          <div class="space-y-3">
            {#each q.options as option, i}
              <button
                onclick={() => answerQuestion(i)}
                class="w-full p-4 text-left rounded-lg border-2 transition-all
                       {currentTest.answers[currentTest.currentQuestion] === i
                         ? 'border-primary-500 bg-primary-50'
                         : 'border-gray-200 hover:border-gray-300'}"
              >
                <span class="font-medium text-gray-700">{option}</span>
              </button>
            {/each}
          </div>

          <button
            onclick={nextQuestion}
            disabled={currentTest.answers[currentTest.currentQuestion] === undefined}
            class="btn-primary w-full mt-6"
          >
            {currentTest.currentQuestion < currentTest.questions.length - 1 ? 'Next →' : 'See Results'}
          </button>
        {/if}
      </div>

      <div class="flex justify-center gap-2 mt-4">
        {#each currentTest.questions as _, i}
          <div class="w-3 h-3 rounded-full
                      {currentTest.answers[i] !== undefined ? 'bg-primary-500' : 'bg-gray-300'}"></div>
        {/each}
      </div>
    </div>
  {/if}
</div>