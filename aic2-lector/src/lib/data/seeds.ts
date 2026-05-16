import { db, type Word, type CefrLevel, type CognateType, type VocabLayer, type Text } from '../db';

function makeWord(
  lemma: string,
  pos: string[],
  es: string[],
  layer: VocabLayer,
  cefr: CefrLevel,
  rank: number,
  opts?: {
    cognate_type?: CognateType;
    cognate_es?: string;
    ipa?: string;
    examples?: string[];
    collocations?: string[];
    synonyms?: string[];
    antonyms?: string[];
  },
): Word {
  const now = new Date();
  return {
    id: `${layer}-${lemma.replace(/\s+/g, '-')}`,
    lemma,
    pos,
    translations_es: es,
    cognate_type: opts?.cognate_type ?? 'no-cognate',
    cognate_es: opts?.cognate_es,
    frequency_rank: rank,
    cefr_level: cefr,
    layer,
    examples: opts?.examples ?? [],
    collocations: opts?.collocations ?? [],
    synonyms_en: opts?.synonyms ?? [],
    antonyms_en: opts?.antonyms ?? [],
    ipa: opts?.ipa,
    confidence: 0,
    review_count: 0,
    ease_factor: 2.5,
    interval: 0,
    next_review: now,
    created_at: now,
    updated_at: now,
  };
}

const VERBS = [
  { en: 'open', es: 'abrir', example: 'Open the file on your desktop.', colloc: 'open a file', ipa: '/ˈoʊpən/' },
  { en: 'close', es: 'cerrar', example: 'Close the door when you leave.', colloc: 'close the window', ipa: '/kloʊz/' },
  { en: 'click', es: 'hacer clic', example: 'Click the button to start.', colloc: 'click the link', ipa: '/klɪk/' },
  { en: 'press', es: 'presionar', example: 'Press the Enter key to continue.', colloc: 'press a button', ipa: '/prɛs/' },
  { en: 'select', es: 'seleccionar', example: 'Select the correct option.', colloc: 'select a file', ipa: '/sɪˈlɛkt/' },
  { en: 'type', es: 'escribir (teclear)', example: 'Type your name in the box.', colloc: 'type a letter', ipa: '/taɪp/' },
  { en: 'save', es: 'guardar', example: 'Save your work before closing.', colloc: 'save a document', ipa: '/seɪv/' },
  { en: 'delete', es: 'eliminar', example: 'Delete the old files to free space.', colloc: 'delete a file', ipa: '/dɪˈliːt/' },
  { en: 'copy', es: 'copiar', example: 'Copy the text and paste it here.', colloc: 'copy a file', ipa: '/ˈkɑːpi/' },
  { en: 'paste', es: 'pegar', example: 'Paste the copied text here.', colloc: 'paste text', ipa: '/peɪst/' },
  { en: 'read', es: 'leer', example: 'Read the instructions carefully.', colloc: 'read a book', ipa: '/riːd/' },
  { en: 'write', es: 'escribir', example: 'Write a short paragraph about yourself.', colloc: 'write an email', ipa: '/raɪt/' },
  { en: 'send', es: 'enviar', example: 'Send the email to your manager.', colloc: 'send a message', ipa: '/sɛnd/' },
  { en: 'receive', es: 'recibir', example: 'Did you receive my email?', colloc: 'receive a package', ipa: '/rɪˈsiːv/' },
  { en: 'confirm', es: 'confirmar', example: 'Please confirm your attendance.', colloc: 'confirm a booking', ipa: '/kənˈfɜːrm/' },
  { en: 'cancel', es: 'cancelar', example: 'Cancel the order if not needed.', colloc: 'cancel a meeting', ipa: '/ˈkænsəl/' },
  { en: 'submit', es: 'enviar (formulario)', example: 'Submit the form after completing it.', colloc: 'submit a report', ipa: '/səbˈmɪt/' },
  { en: 'check', es: 'revisar/verificar', example: 'Check your answers before handing in.', colloc: 'check for errors', ipa: '/tʃɛk/' },
  { en: 'add', es: 'agregar', example: 'Add your name to the list.', colloc: 'add a comment', ipa: '/æd/' },
  { en: 'remove', es: 'quitar/eliminar', example: 'Remove the old entries from the list.', colloc: 'remove a file', ipa: '/rɪˈmuːv/' },
  { en: 'start', es: 'empezar', example: 'Start the test when you are ready.', colloc: 'start a project', ipa: '/stɑːrt/' },
  { en: 'finish', es: 'terminar', example: 'Finish the exercise before the bell.', colloc: 'finish a task', ipa: '/ˈfɪnɪʃ/' },
  { en: 'repeat', es: 'repetir', example: 'Repeat the word after the teacher.', colloc: 'repeat a sentence', ipa: '/rɪˈpiːt/' },
  { en: 'listen', es: 'escuchar', example: 'Listen to the audio carefully.', colloc: 'listen to a podcast', ipa: '/ˈlɪsən/' },
  { en: 'speak', es: 'hablar', example: 'Speak clearly so everyone can hear.', colloc: 'speak English', ipa: '/spiːk/' },
  { en: 'explain', es: 'explicar', example: 'Explain the meaning of this word.', colloc: 'explain a concept', ipa: '/ɪkˈspleɪn/' },
  { en: 'describe', es: 'describir', example: 'Describe your daily routine.', colloc: 'describe a process', ipa: '/dɪˈskraɪb/' },
  { en: 'complete', es: 'completar', example: 'Complete the sentences with the correct word.', colloc: 'complete a form', ipa: '/kəmˈpliːt/' },
  { en: 'match', es: 'emparejar', example: 'Match the words with their definitions.', colloc: 'match the columns', ipa: '/mætʃ/' },
  { en: 'underline', es: 'subrayar', example: 'Underline the correct answer.', colloc: 'underline the key words', ipa: '/ˌʌndərˈlaɪn/' },
];

const COGNATES = [
  { en: 'information', es: 'información', ipa: '/ˌɪnfərˈmeɪʃən/', cognate_es: 'información' },
  { en: 'education', es: 'educación', ipa: '/ˌɛdʒuˈkeɪʃən/', cognate_es: 'educación' },
  { en: 'operation', es: 'operación', ipa: '/ˌɑːpəˈreɪʃən/', cognate_es: 'operación' },
  { en: 'station', es: 'estación', ipa: '/ˈsteɪʃən/', cognate_es: 'estación' },
  { en: 'nation', es: 'nación', ipa: '/ˈneɪʃən/', cognate_es: 'nación' },
  { en: 'function', es: 'función', ipa: '/ˈfʌŋkʃən/', cognate_es: 'función' },
  { en: 'attention', es: 'atención', ipa: '/əˈtɛnʃən/', cognate_es: 'atención' },
  { en: 'community', es: 'comunidad', ipa: '/kəˈmjuːnɪti/', cognate_es: 'comunidad' },
  { en: 'activity', es: 'actividad', ipa: '/ækˈtɪvɪti/', cognate_es: 'actividad' },
  { en: 'quality', es: 'calidad', ipa: '/ˈkwɑːlɪti/', cognate_es: 'calidad' },
  { en: 'reality', es: 'realidad', ipa: '/riˈælɪti/', cognate_es: 'realidad' },
  { en: 'communicate', es: 'comunicar', ipa: '/kəˈmjuːnɪkeɪt/', cognate_es: 'comunicar' },
  { en: 'organize', es: 'organizar', ipa: '/ˈɔːrɡənaɪz/', cognate_es: 'organizar' },
  { en: 'important', es: 'importante', ipa: '/ɪmˈpɔːrtənt/', cognate_es: 'importante' },
  { en: 'different', es: 'diferente', ipa: '/ˈdɪfərənt/', cognate_es: 'diferente' },
  { en: 'natural', es: 'natural', ipa: '/ˈnætʃərəl/', cognate_es: 'natural' },
  { en: 'possible', es: 'posible', ipa: '/ˈpɑːsəbəl/', cognate_es: 'posible' },
  { en: 'responsible', es: 'responsable', ipa: '/rɪˈspɑːnsəbəl/', cognate_es: 'responsable' },
  { en: 'similar', es: 'similar', ipa: '/ˈsɪmɪlər/', cognate_es: 'similar' },
  { en: 'global', es: 'global', ipa: '/ˈɡloʊbəl/', cognate_es: 'global' },
  { en: 'digital', es: 'digital', ipa: '/ˈdɪdʒɪtəl/', cognate_es: 'digital' },
  { en: 'social', es: 'social', ipa: '/ˈsoʊʃəl/', cognate_es: 'social' },
  { en: 'normal', es: 'normal', ipa: '/ˈnɔːrməl/', cognate_es: 'normal' },
  { en: 'central', es: 'central', ipa: '/ˈsɛntrəl/', cognate_es: 'central' },
  { en: 'general', es: 'general', ipa: '/ˈdʒɛnərəl/', cognate_es: 'general' },
  { en: 'capital', es: 'capital', ipa: '/ˈkæpɪtəl/', cognate_es: 'capital' },
  { en: 'logic', es: 'lógica', ipa: '/ˈlɑːdʒɪk/', cognate_es: 'lógica' },
  { en: 'music', es: 'música', ipa: '/ˈmjuːzɪk/', cognate_es: 'música' },
  { en: 'public', es: 'público', ipa: '/ˈpʌblɪk/', cognate_es: 'público' },
  { en: 'basic', es: 'básico', ipa: '/ˈbeɪsɪk/', cognate_es: 'básico' },
];

const BUSINESS_WORDS = [
  { en: 'meeting', es: 'reunión', ex: 'The meeting starts at 2 PM.', colloc: 'attend a meeting', ipa: '/ˈmiːtɪŋ/' },
  { en: 'deadline', es: 'fecha límite', ex: 'We have a tight deadline this week.', colloc: 'meet a deadline', ipa: '/ˈdɛdlaɪn/' },
  { en: 'budget', es: 'presupuesto', ex: 'The project is under budget.', colloc: 'set a budget', ipa: '/ˈbʌdʒɪt/' },
  { en: 'colleague', es: 'compañero', ex: 'My colleague helped me with the report.', colloc: 'work with a colleague', ipa: '/ˈkɑːliːɡ/' },
  { en: 'client', es: 'cliente', ex: 'The client approved the proposal.', colloc: 'meet a client', ipa: '/ˈklaɪənt/' },
  { en: 'manager', es: 'gerente', ex: 'The manager reviewed the plan.', colloc: 'report to a manager', ipa: '/ˈmænɪdʒər/' },
  { en: 'project', es: 'proyecto', ex: 'The project was completed on time.', colloc: 'lead a project', ipa: '/ˈprɑːdʒɛkt/' },
  { en: 'report', es: 'informe', ex: 'Please submit the report by Friday.', colloc: 'write a report', ipa: '/rɪˈpɔːrt/' },
  { en: 'schedule', es: 'horario/agenda', ex: 'Let me check my schedule.', colloc: 'set a schedule', ipa: '/ˈskɛdʒuːl/' },
  { en: 'team', es: 'equipo', ex: 'Our team achieved the sales target.', colloc: 'work in a team', ipa: '/tiːm/' },
  { en: 'email', es: 'correo electrónico', ex: 'I received an email from the client.', colloc: 'send an email', ipa: '/ˈiːmeɪl/' },
  { en: 'conference', es: 'conferencia', ex: 'The conference is next Monday.', colloc: 'attend a conference', ipa: '/ˈkɑːnfərəns/' },
  { en: 'presentation', es: 'presentación', ex: 'She gave an excellent presentation.', colloc: 'give a presentation', ipa: '/ˌprɛzənˈteɪʃən/' },
  { en: 'strategy', es: 'estrategia', ex: 'We need a new marketing strategy.', colloc: 'develop a strategy', ipa: '/ˈstrætədʒi/' },
  { en: 'performance', es: 'rendimiento', ex: 'The team performance improved.', colloc: 'evaluate performance', ipa: '/pərˈfɔːrməns/' },
  { en: 'negotiation', es: 'negociación', ex: 'The negotiation lasted three hours.', colloc: 'enter a negotiation', ipa: '/nɪˌɡoʊʃiˈeɪʃən/' },
  { en: 'contract', es: 'contrato', ex: 'Sign the contract before the deadline.', colloc: 'sign a contract', ipa: '/ˈkɑːntrækt/' },
  { en: 'revenue', es: 'ingresos', ex: 'Revenue increased by 15% this quarter.', colloc: 'generate revenue', ipa: '/ˈrɛvɪnuː/' },
  { en: 'profit', es: 'ganancias', ex: 'The company made a large profit.', colloc: 'make a profit', ipa: '/ˈprɑːfɪt/' },
  { en: 'investment', es: 'inversión', ex: 'The investment paid off quickly.', colloc: 'make an investment', ipa: '/ɪnˈvɛstmənt/' },
  { en: 'decision', es: 'decisión', ex: 'We made a decision to expand.', colloc: 'make a decision', ipa: '/dɪˈsɪʒən/' },
  { en: 'agreement', es: 'acuerdo', ex: 'Both parties signed the agreement.', colloc: 'reach an agreement', ipa: '/əˈɡriːmənt/' },
  { en: 'department', es: 'departamento', ex: 'The HR department hired new staff.', colloc: 'manage a department', ipa: '/dɪˈpɑːrtmənt/' },
  { en: 'employee', es: 'empleado', ex: 'The company has 500 employees.', colloc: 'hire an employee', ipa: '/ɪmˈplɔɪiː/' },
  { en: 'target', es: 'objetivo', ex: 'We exceeded our sales target.', colloc: 'set a target', ipa: '/ˈtɑːrɡɪt/' },
  { en: 'feedback', es: 'retroalimentación', ex: 'Please give me some feedback.', colloc: 'provide feedback', ipa: '/ˈfiːdbæk/' },
  { en: 'promotion', es: 'promoción/ascenso', ex: 'She got a promotion to manager.', colloc: 'get a promotion', ipa: '/prəˈmoʊʃən/' },
  { en: 'benefit', es: 'beneficio/prestación', ex: 'Good health benefits are important.', colloc: 'employee benefits', ipa: '/ˈbɛnɪfɪt/' },
  { en: 'appointment', es: 'cita', ex: 'I have an appointment at 3 PM.', colloc: 'schedule an appointment', ipa: '/əˈpɔɪntmənt/' },
  { en: 'invoice', es: 'factura', ex: 'Please send the invoice by email.', colloc: 'pay an invoice', ipa: '/ˈɪnvɔɪs/' },
];

const IA_TERMS = [
  { en: 'algorithm', es: 'algoritmo', ex: 'The algorithm sorts data efficiently.', colloc: 'design an algorithm', ipa: '/ˈælɡəˌrɪðəm/' },
  { en: 'machine learning', es: 'aprendizaje automático', ex: 'Machine learning improves with more data.', colloc: 'apply machine learning', ipa: '/məˈʃiːn ˈlɜːrnɪŋ/' },
  { en: 'neural network', es: 'red neuronal', ex: 'Neural networks process complex patterns.', colloc: 'train a neural network', ipa: '/ˈnʊrəl ˈnɛtwɜːrk/' },
  { en: 'deep learning', es: 'aprendizaje profundo', ex: 'Deep learning requires large datasets.', colloc: 'deep learning model', ipa: '/diːp ˈlɜːrnɪŋ/' },
  { en: 'transformer', es: 'transformador', ex: 'Transformers revolutionized NLP.', colloc: 'transformer architecture', ipa: '/trænsˈfɔːrmər/' },
  { en: 'training', es: 'entrenamiento', ex: 'Model training takes hours.', colloc: 'training data', ipa: '/ˈtreɪnɪŋ/' },
  { en: 'model', es: 'modelo', ex: 'The model achieves high accuracy.', colloc: 'deploy a model', ipa: '/ˈmɑːdəl/' },
  { en: 'dataset', es: 'conjunto de datos', ex: 'The dataset contains millions of images.', colloc: 'prepare a dataset', ipa: '/ˈdeɪtəˌsɛt/' },
  { en: 'embedding', es: 'incrustación', ex: 'Word embeddings capture semantic meaning.', colloc: 'generate embeddings', ipa: '/ɪmˈbɛdɪŋ/' },
  { en: 'token', es: 'token', ex: 'The sentence is split into tokens.', colloc: 'token sequence', ipa: '/ˈtoʊkən/' },
  { en: 'prompt', es: 'indicación', ex: 'The prompt asks the model to translate.', colloc: 'design a prompt', ipa: '/prɑːmpt/' },
  { en: 'inference', es: 'inferencia', ex: 'Inference is faster than training.', colloc: 'run inference', ipa: '/ˈɪnfərəns/' },
  { en: 'attention', es: 'atención', ex: 'The attention mechanism weighs each word.', colloc: 'attention layer', ipa: '/əˈtɛnʃən/' },
  { en: 'encoder', es: 'codificador', ex: 'The encoder processes input text.', colloc: 'encoder layer', ipa: '/ɛnˈkoʊdər/' },
  { en: 'decoder', es: 'decodificador', ex: 'The decoder generates output tokens.', colloc: 'decoder stack', ipa: '/diːˈkoʊdər/' },
  { en: 'fine-tuning', es: 'ajuste fino', ex: 'Fine-tuning adapts the model to a task.', colloc: 'fine-tune a model', ipa: '/faɪn ˈtuːnɪŋ/' },
  { en: 'overfitting', es: 'sobreajuste', ex: 'Overfitting occurs when the model memorizes.', colloc: 'avoid overfitting', ipa: '/ˌoʊvərˈfɪtɪŋ/' },
  { en: 'validation', es: 'validación', ex: 'Validation checks model generalization.', colloc: 'validation set', ipa: '/ˌvælɪˈdeɪʃən/' },
  { en: 'hyperparameter', es: 'hiperparámetro', ex: 'Hyperparameters control the learning process.', colloc: 'tune hyperparameters', ipa: '/ˌhaɪpərpəˈræmɪtər/' },
  { en: 'backpropagation', es: 'retropropagación', ex: 'Backpropagation updates the weights.', colloc: 'backpropagation algorithm', ipa: '/ˌbækprɑːpəˈɡeɪʃən/' },
  { en: 'gradient', es: 'gradiente', ex: 'The gradient points uphill.', colloc: 'gradient descent', ipa: '/ˈɡreɪdiənt/' },
  { en: 'loss function', es: 'función de pérdida', ex: 'The loss function measures error.', colloc: 'minimize loss function', ipa: '/lɔːs ˈfʌŋkʃən/' },
  { en: 'layer', es: 'capa', ex: 'The network has 12 layers.', colloc: 'hidden layer', ipa: '/ˈleɪər/' },
  { en: 'weight', es: 'peso', ex: 'The model updates weights after each batch.', colloc: 'weight matrix', ipa: '/weɪt/' },
  { en: 'bias', es: 'sesgo', ex: 'The bias term shifts the activation.', colloc: 'bias term', ipa: '/ˈbaɪəs/' },
];

const SAMPLE_TEXTS: Text[] = [
  {
    id: 'text-001',
    title: 'How to Use Your Computer',
    body: 'Open the file. Click the button to start. Select the option. Type your name. Press Enter. Save your work.',
    cefr_level: 'A1',
    genre: 'instructive',
    word_count: 22,
    unique_words: 18,
    avg_sentence_length: 6,
    source: 'seed',
    is_authentic: true,
    key_vocabulary: [],
    created_at: new Date(),
  },
  {
    id: 'text-002',
    title: 'My Daily Routine',
    body: 'I wake up at seven. I have breakfast at eight. I go to work at nine. I eat lunch at one. I finish work at five. I go home. I have dinner at seven. I watch TV and read a book. I go to bed at ten.',
    cefr_level: 'A1',
    genre: 'narrative',
    word_count: 52,
    unique_words: 30,
    avg_sentence_length: 6,
    source: 'seed',
    is_authentic: true,
    key_vocabulary: [],
    created_at: new Date(),
  },
  {
    id: 'text-003',
    title: 'The Internet',
    body: 'The internet is a global network. It connects millions of computers around the world. You can browse websites, send emails, and watch videos. It is important for communication and education. Many people use it for work and study.',
    cefr_level: 'A2',
    genre: 'journalistic',
    word_count: 43,
    unique_words: 30,
    avg_sentence_length: 10,
    source: 'seed',
    is_authentic: true,
    key_vocabulary: [],
    created_at: new Date(),
  },
  {
    id: 'text-004',
    title: 'My First Day at Work',
    body: 'Today was my first day at the new company. The manager introduced me to the team. My colleagues were very friendly. I learned about the project deadlines and the budget. I have a meeting with a client next week. I need to prepare a presentation.',
    cefr_level: 'B1',
    genre: 'narrative',
    word_count: 47,
    unique_words: 35,
    avg_sentence_length: 8,
    source: 'seed',
    is_authentic: true,
    key_vocabulary: ['manager', 'colleagues', 'deadlines', 'budget', 'meeting', 'presentation', 'client', 'project'],
    created_at: new Date(),
  },
  {
    id: 'text-005',
    title: 'Business Negotiation',
    body: 'Our team started the negotiation with the client this morning. We discussed the terms of the contract carefully. The client wants a better price, but we need to maintain our profit margin. After three hours of discussion, we reached an agreement. Both parties signed the contract. It was a successful negotiation.',
    cefr_level: 'B1',
    genre: 'business',
    word_count: 55,
    unique_words: 38,
    avg_sentence_length: 9,
    source: 'Oxford Business Result',
    is_authentic: true,
    key_vocabulary: ['negotiation', 'contract', 'agreement', 'profit', 'client', 'terms'],
    created_at: new Date(),
  },
  {
    id: 'text-006',
    title: 'Email Communication',
    body: 'Dear Mr. Johnson, I am writing to confirm our meeting on Monday at 2 PM. Please find attached the agenda and the project report. Please review the document before the meeting. If you have any questions, please let me know. I look forward to meeting you. Best regards, Sarah Chen.',
    cefr_level: 'B1',
    genre: 'business',
    word_count: 55,
    unique_words: 36,
    avg_sentence_length: 8,
    source: 'Oxford Business Result',
    is_authentic: true,
    key_vocabulary: ['confirm', 'meeting', 'agenda', 'report', 'review'],
    created_at: new Date(),
  },
  {
    id: 'text-007',
    title: 'Artificial Intelligence Overview',
    body: 'Artificial Intelligence allows machines to learn from data. Machine Learning uses algorithms to find patterns in information. Neural networks process complex data through layers of neurons. Deep Learning uses many layers to solve difficult problems. Transformers are a type of neural network that powers modern AI systems like language models.',
    cefr_level: 'B1',
    genre: 'technical-ia',
    word_count: 52,
    unique_words: 34,
    avg_sentence_length: 10,
    source: 'seed',
    is_authentic: true,
    key_vocabulary: ['algorithm', 'neural', 'network', 'layer', 'transformer', 'pattern', 'data'],
    created_at: new Date(),
  },
  {
    id: 'text-008',
    title: 'Making Decisions at Work',
    body: 'Companies make important decisions every day. Managers collect feedback from employees through surveys. They analyze the results to improve performance. The team discusses the budget and sets new targets for the next quarter. Good communication is essential for making the right decisions.',
    cefr_level: 'B1',
    genre: 'business',
    word_count: 44,
    unique_words: 30,
    avg_sentence_length: 9,
    source: 'Oxford Business Result',
    is_authentic: true,
    key_vocabulary: ['decisions', 'feedback', 'employees', 'surveys', 'performance', 'budget', 'targets'],
    created_at: new Date(),
  },
  {
    id: 'text-009',
    title: 'Training a Neural Network',
    body: 'Training a neural network requires a large dataset. The model processes the data through multiple layers. Each layer extracts different features from the input. The loss function measures how wrong the predictions are. Backpropagation adjusts the weights to reduce the error. After many iterations, the model learns to make accurate predictions.',
    cefr_level: 'B2',
    genre: 'technical-ia',
    word_count: 55,
    unique_words: 38,
    avg_sentence_length: 9,
    source: 'seed',
    is_authentic: true,
    key_vocabulary: ['training', 'neural', 'network', 'dataset', 'layer', 'loss function', 'backpropagation', 'weights', 'predictions'],
    created_at: new Date(),
  },
  {
    id: 'text-010',
    title: 'Performance Review',
    body: 'The performance review is an important meeting between the manager and the employee. They discuss the achievements of the past year and set objectives for the next one. The employee receives feedback on their strengths and areas for improvement. The manager also explains the criteria for promotion and salary increases.',
    cefr_level: 'B2',
    genre: 'business',
    word_count: 50,
    unique_words: 34,
    avg_sentence_length: 12,
    source: 'Oxford Business Result',
    is_authentic: true,
    key_vocabulary: ['performance', 'review', 'achievements', 'objectives', 'feedback', 'promotion', 'criteria'],
    created_at: new Date(),
  },
];

const MORPHEME_DATA = [
  { id: 'un-', type: 'prefix' as const, meaning_es: 'no / lo opuesto', origin: 'germanic' as const, cefr_level: 'A1' as CefrLevel, example_words: ['unhappy', 'unlock', 'unfair', 'unknown'] },
  { id: 're-', type: 'prefix' as const, meaning_es: 'de nuevo / otra vez', origin: 'germanic' as const, cefr_level: 'A1' as CefrLevel, example_words: ['rewrite', 'restart', 'return', 'review'] },
  { id: 'pre-', type: 'prefix' as const, meaning_es: 'antes / antes de', origin: 'latin' as const, cefr_level: 'A2' as CefrLevel, example_words: ['preview', 'predict', 'prepare', 'prepay'] },
  { id: 'dis-', type: 'prefix' as const, meaning_es: 'no / opuesto', origin: 'latin' as const, cefr_level: 'A2' as CefrLevel, example_words: ['disagree', 'disappear', 'disable', 'disconnect'] },
  { id: 'mis-', type: 'prefix' as const, meaning_es: 'mal / incorrecto', origin: 'germanic' as const, cefr_level: 'A2' as CefrLevel, example_words: ['misunderstand', 'mistake', 'mislead', 'misplace'] },
  { id: 'over-', type: 'prefix' as const, meaning_es: 'demasiado / sobre', origin: 'germanic' as const, cefr_level: 'B1' as CefrLevel, example_words: ['overload', 'overbook', 'overcome', 'overthink'] },
  { id: 'under-', type: 'prefix' as const, meaning_es: 'debajo de / insuficiente', origin: 'germanic' as const, cefr_level: 'B1' as CefrLevel, example_words: ['underestimate', 'underline', 'understand', 'underground'] },
  { id: 'inter-', type: 'prefix' as const, meaning_es: 'entre / mutuamente', origin: 'latin' as const, cefr_level: 'B1' as CefrLevel, example_words: ['international', 'interact', 'interview', 'internet'] },
  { id: 'trans-', type: 'prefix' as const, meaning_es: 'a través / más allá', origin: 'latin' as const, cefr_level: 'B1' as CefrLevel, example_words: ['transport', 'translate', 'transform', 'transfer'] },
  { id: 'de-', type: 'prefix' as const, meaning_es: 'quitar / reverso', origin: 'latin' as const, cefr_level: 'B1' as CefrLevel, example_words: ['decode', 'deactivate', 'delete', 'decrease'] },
  { id: '-tion', type: 'suffix' as const, meaning_es: 'acción o estado (→ sustantivo)', origin: 'latin' as const, cefr_level: 'A1' as CefrLevel, example_words: ['information', 'operation', 'education', 'attention'] },
  { id: '-sion', type: 'suffix' as const, meaning_es: 'acción o estado (→ sustantivo)', origin: 'latin' as const, cefr_level: 'A2' as CefrLevel, example_words: ['decision', 'division', 'conclusion', 'provision'] },
  { id: '-ity', type: 'suffix' as const, meaning_es: 'cualidad o estado', origin: 'latin' as const, cefr_level: 'A2' as CefrLevel, example_words: ['quality', 'reality', 'activity', 'community'] },
  { id: '-ment', type: 'suffix' as const, meaning_es: 'resultado o medio (→ sustantivo)', origin: 'latin' as const, cefr_level: 'A2' as CefrLevel, example_words: ['agreement', 'development', 'management', 'investment'] },
  { id: '-ness', type: 'suffix' as const, meaning_es: 'cualidad o estado', origin: 'germanic' as const, cefr_level: 'A2' as CefrLevel, example_words: ['happiness', 'business', 'darkness', 'kindness'] },
  { id: '-er/-or', type: 'suffix' as const, meaning_es: 'persona que hace algo', origin: 'latin' as const, cefr_level: 'A1' as CefrLevel, example_words: ['teacher', 'manager', 'worker', 'actor', 'creator'] },
  { id: '-ly', type: 'suffix' as const, meaning_es: 'de manera (→ adverbio)', origin: 'germanic' as const, cefr_level: 'A1' as CefrLevel, example_words: ['quickly', 'easily', 'carefully', 'finally'] },
  { id: '-ful', type: 'suffix' as const, meaning_es: 'lleno de (→ adjetivo)', origin: 'germanic' as const, cefr_level: 'A2' as CefrLevel, example_words: ['helpful', 'useful', 'careful', 'successful'] },
  { id: '-less', type: 'suffix' as const, meaning_es: 'sin (→ adjetivo)', origin: 'germanic' as const, cefr_level: 'A2' as CefrLevel, example_words: ['useless', 'careless', 'endless', 'homeless'] },
  { id: '-able/-ible', type: 'suffix' as const, meaning_es: 'que se puede (→ adjetivo)', origin: 'latin' as const, cefr_level: 'A2' as CefrLevel, example_words: ['possible', 'responsible', 'readable', 'affordable', 'visible'] },
  { id: '-al', type: 'suffix' as const, meaning_es: 'relativo a (→ adjetivo)', origin: 'latin' as const, cefr_level: 'B1' as CefrLevel, example_words: ['global', 'digital', 'natural', 'social', 'basic'] },
  { id: '-ize/-ise', type: 'suffix' as const, meaning_es: 'convertir en (→ verbo)', origin: 'latin' as const, cefr_level: 'B1' as CefrLevel, example_words: ['organize', 'realize', 'recognize', 'summarize'] },
  { id: '-ment', type: 'suffix' as const, meaning_es: 'acción o resultado', origin: 'latin' as const, cefr_level: 'A2' as CefrLevel, example_words: ['management', 'development', 'achievement', 'agreement'] },
  { id: 'form', type: 'root' as const, meaning_es: 'forma', origin: 'latin' as const, cefr_level: 'B1' as CefrLevel, example_words: ['transform', 'information', 'perform', 'reform', 'uniform'] },
  { id: 'port', type: 'root' as const, meaning_es: 'llevar', origin: 'latin' as const, cefr_level: 'B1' as CefrLevel, example_words: ['transport', 'import', 'export', 'report', 'portable'] },
  { id: 'dict', type: 'root' as const, meaning_es: 'decir', origin: 'latin' as const, cefr_level: 'B1' as CefrLevel, example_words: ['predict', 'dictionary', 'contradict', 'dictate'] },
  { id: 'struct', type: 'root' as const, meaning_es: 'construir', origin: 'latin' as const, cefr_level: 'B1' as CefrLevel, example_words: ['structure', 'construct', 'destroy', 'instruction'] },
  { id: 'spect', type: 'root' as const, meaning_es: 'mirar', origin: 'latin' as const, cefr_level: 'B1' as CefrLevel, example_words: ['inspect', 'respect', 'expect', 'spectacle'] },
  { id: 'graph/gram', type: 'root' as const, meaning_es: 'escribir', origin: 'greek' as const, cefr_level: 'B1' as CefrLevel, example_words: ['program', 'diagram', 'paragraph', 'telegram', 'autograph'] },
  { id: 'cred', type: 'root' as const, meaning_es: 'creer', origin: 'latin' as const, cefr_level: 'B2' as CefrLevel, example_words: ['credit', 'incredible', 'credential', 'credibility'] },
];

const GRAMMAR_DATA = [
  { id: 'present-simple', title: 'Present Simple', pattern: 'Subject + verb (s/es for he/she/it)', explanation_md: 'Para acciones habituales, rutinas y hechos generales.', cefr_level: 'A1' as CefrLevel, category: 'basico' as const, examples_en: ['I work every day.', 'She likes coffee.', 'The sun rises in the east.'] },
  { id: 'present-continuous', title: 'Present Continuous', pattern: 'Subject + be + verb-ing', explanation_md: 'Para acciones que están ocurriendo ahora mismo o alrededor del momento actual.', cefr_level: 'A1' as CefrLevel, category: 'basico' as const, examples_en: ['I am reading a book right now.', 'She is working on the report.', 'They are having a meeting.'] },
  { id: 'past-simple', title: 'Past Simple', pattern: 'Subject + verb-ed (or irregular past)', explanation_md: 'Para acciones completadas en el pasado.', cefr_level: 'A1' as CefrLevel, category: 'basico' as const, examples_en: ['I visited Paris last year.', 'She finished the report yesterday.', 'We went to the conference.'] },
  { id: 'past-continuous', title: 'Past Continuous', pattern: 'Subject + was/were + verb-ing', explanation_md: 'Para acciones que estaban en progreso en un momento específico del pasado.', cefr_level: 'A2' as CefrLevel, category: 'basico' as const, examples_en: ['I was reading when you called.', 'They were working at 5 PM.', 'She was preparing the presentation.'] },
  { id: 'present-perfect', title: 'Present Perfect', pattern: 'Subject + have/has + past participle', explanation_md: 'Para conectar el pasado con el presente. Experiencias, cambios, noticias.', cefr_level: 'A2' as CefrLevel, category: 'frecuente-en-tecnico' as const, examples_en: ['I have finished the report.', 'She has never been to London.', 'They have already signed the contract.'] },
  { id: 'future-will', title: 'Future with Will', pattern: 'Subject + will + base verb', explanation_md: 'Para predicciones, decisiones espontáneas y promesas.', cefr_level: 'A2' as CefrLevel, category: 'basico' as const, examples_en: ['I will call you tomorrow.', 'The meeting will start at 3 PM.', 'It will rain later.'] },
  { id: 'future-going-to', title: 'Future with Going To', pattern: 'Subject + am/is/are going to + verb', explanation_md: 'Para planes e intenciones, o predicciones con evidencia.', cefr_level: 'A2' as CefrLevel, category: 'basico' as const, examples_en: ['We are going to launch the product in May.', 'She is going to study abroad.', 'Look at those clouds — it is going to rain.'] },
  { id: 'passive-voice', title: 'Passive Voice', pattern: 'Subject + be + past participle (+ by agent)', explanation_md: 'Se usa cuando el foco está en la acción o el objeto, no en quién la realiza. Muy común en textos académicos y técnicos.', cefr_level: 'B1' as CefrLevel, category: 'frecuente-en-tecnico' as const, examples_en: ['The report was written by the team.', 'Data is collected automatically.', 'The model was trained on 10 million images.'] },
  { id: 'relative-clauses', title: 'Relative Clauses', pattern: 'Noun + who/which/that + clause', explanation_md: 'Para dar información adicional sobre una persona o cosa. "Who" para personas, "which" para cosas, "that" para ambos.', cefr_level: 'B1' as CefrLevel, category: 'frecuente-en-tecnico' as const, examples_en: ['The manager who hired me is very kind.', 'The algorithm which processes the data is efficient.', 'A tool that saves time is valuable.'] },
  { id: 'first-conditional', title: 'First Conditional', pattern: 'If + present simple, will + base verb', explanation_md: 'Para situaciones posibles o probables en el futuro.', cefr_level: 'A2' as CefrLevel, category: 'basico' as const, examples_en: ['If it rains, I will stay home.', 'If we finish early, we will leave.', 'If you study hard, you will pass the exam.'] },
  { id: 'second-conditional', title: 'Second Conditional', pattern: 'If + past simple, would + base verb', explanation_md: 'Para situaciones hipotéticas o improbables en el presente/futuro.', cefr_level: 'B1' as CefrLevel, category: 'frecuente-en-tecnico' as const, examples_en: ['If I had more time, I would learn Python.', 'If the model were better, we would use it.', 'If I were you, I would accept the offer.'] },
  { id: 'reported-speech', title: 'Reported Speech', pattern: 'He/she said that + clause (backshift)', explanation_md: 'Para reportar lo que alguien dijo. Los tiempos verbales retroceden (present→past, will→would).', cefr_level: 'B1' as CefrLevel, category: 'frecuente-en-tecnico' as const, examples_en: ['She said that she was working on the project.', 'He told me that he would send the email.', 'They reported that the results were positive.'] },
  { id: 'modals-obligation', title: 'Modals of Obligation', pattern: 'must/have to/should + base verb', explanation_md: '"Must" y "have to" expresan obligación fuerte. "Should" expresa consejo u obligación débil.', cefr_level: 'A2' as CefrLevel, category: 'frecuente-en-tecnico' as const, examples_en: ['You must complete the form.', 'We have to meet the deadline.', 'You should check the results carefully.'] },
  { id: 'modals-possibility', title: 'Modals of Possibility', pattern: 'may/might/could + base verb', explanation_md: 'Para expresar posibilidad o probabilidad. "May" es más formal que "might".', cefr_level: 'B1' as CefrLevel, category: 'frecuente-en-tecnico' as const, examples_en: ['The meeting may be postponed.', 'The model might need more data.', 'This could be the solution.'] },
  { id: 'gerunds-infinitives', title: 'Gerunds and Infinitives', pattern: 'verb + -ing / to + verb', explanation_md: 'Algunos verbos requieren gerundio (-ing) y otros infinitivo (to + verb).', cefr_level: 'B1' as CefrLevel, category: 'basico' as const, examples_en: ['I enjoy reading technical papers.', 'She decided to change her strategy.', 'We finished working on the project.'] },
];

export async function seedDatabase(): Promise<void> {
  const existing = await db.words.count();
  if (existing > 0) {
    console.log('DB ready, words:', existing);
    return;
  }

  const now = new Date();
  const allWords: Word[] = [];
  let rank = 1;

  for (const v of VERBS) {
    allWords.push(makeWord(v.en, ['verb'], [v.es], 'frequency', 'A1', rank++, {
      examples: [v.example],
      collocations: [v.colloc],
      ipa: v.ipa,
    }));
  }

  for (const c of COGNATES) {
    allWords.push(makeWord(c.en, ['noun'], [c.es], 'frequency', 'A1', rank++, {
      cognate_type: 'cognate',
      cognate_es: c.cognate_es,
      ipa: c.ipa,
      examples: [`The ${c.en} is important.`],
    }));
  }

  for (const b of BUSINESS_WORDS) {
    allWords.push(makeWord(b.en, ['noun'], [b.es], 'awl', 'B1', rank++, {
      examples: [b.ex],
      collocations: [b.colloc],
      ipa: b.ipa,
      cognate_type: 'cognate',
      cognate_es: b.es,
    }));
  }

  for (const t of IA_TERMS) {
    allWords.push(makeWord(t.en, ['noun'], [t.es], 'technical-ia', 'B1', rank++, {
      examples: [t.ex],
      collocations: [t.colloc],
      ipa: t.ipa,
      cognate_type: 'cognate',
      cognate_es: t.es,
    }));
  }

  await db.words.bulkPut(allWords);
  await db.texts.bulkPut(SAMPLE_TEXTS);
  
  console.log('Seeded:', allWords.length, 'words,', SAMPLE_TEXTS.length, 'texts');
}

export async function seedMorphemes(): Promise<void> {
  const existing = await db.morphemes.count();
  if (existing > 0) return;
  
  const morphemes = MORPHEME_DATA.map(m => ({
    ...m,
    confidence: 0,
    review_count: 0,
    created_at: new Date(),
  }));
  
  await db.morphemes.bulkPut(morphemes);
  console.log('Seeded:', morphemes.length, 'morphemes');
}

export async function seedGrammarRules(): Promise<void> {
  const existing = await db.grammarRules.count();
  if (existing > 0) return;
  
  const rules = GRAMMAR_DATA.map(r => ({
    ...r,
    confidence: 0,
    review_count: 0,
    created_at: new Date(),
  }));
  
  await db.grammarRules.bulkPut(rules);
  console.log('Seeded:', rules.length, 'grammar rules');
}

export async function seedAWL(): Promise<void> {
  const existing = await db.words.where('layer').equals('awl').count();
  if (existing > 0) return;

  const now = new Date();
  const awlList = [
    { en: 'approach', es: 'enfoque' }, { en: 'analysis', es: 'análisis' },
    { en: 'assessment', es: 'evaluación' }, { en: 'concept', es: 'concepto' },
    { en: 'context', es: 'contexto' }, { en: 'data', es: 'datos' },
    { en: 'environment', es: 'entorno' }, { en: 'evidence', es: 'evidencia' },
    { en: 'factor', es: 'factor' }, { en: 'function', es: 'función' },
  ];
  
  const words = awlList.map((w, i) => makeWord(w.en, ['noun'], [w.es], 'awl', 'B1', i + 200, {
    cognate_type: 'cognate',
    cognate_es: w.es,
  }));
  
  await db.words.bulkPut(words);
}

export async function seedMoreTexts(): Promise<void> {
  // Already included in SAMPLE_TEXTS
}

export async function seedTechnicalTexts(): Promise<void> {
  // Already included in SAMPLE_TEXTS
}

export async function initializeStats(): Promise<void> {
  const stats = await db.userStats.get('main');
  if (!stats) {
    await db.userStats.add({
      id: 'main',
      current_phase: 0,
      total_words_learned: 0,
      total_words_mastered: 0,
      total_reading_time_min: 0,
      total_sessions: 0,
      current_streak: 0,
      longest_streak: 0,
      avg_wpm: 0,
      cefr_estimated: 'A1',
      updated_at: new Date(),
    });
  }
}
