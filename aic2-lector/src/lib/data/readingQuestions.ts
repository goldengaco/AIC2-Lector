import { getFoundationLesson } from './foundation';

export type ReadingQuestionKind =
  | 'literal'
  | 'sequence'
  | 'causal'
  | 'inference'
  | 'cohesion'
  | 'modality'
  | 'stance'
  | 'implicature'
  | 'rhetorical-purpose';

export type ReadingQuestion = {
  id: string;
  kind: ReadingQuestionKind;
  prompt_en: string;
  support_es: string;
  options: string[];
  correct_index: number;
  explanation_es: string;
};

const QUESTIONS_BY_TEXT: Record<string, ReadingQuestion[]> = {
  'text-001': [
    {
      id: 'text-001-literal', kind: 'literal',
      prompt_en: 'What should you type?', support_es: '¿Qué debes escribir?',
      options: ['Your name', 'The file', 'The button', 'Your work'], correct_index: 0,
      explanation_es: 'El texto dice: “Type your name”.',
    },
    {
      id: 'text-001-sequence', kind: 'sequence',
      prompt_en: 'What happens immediately after you open the file?', support_es: '¿Qué ocurre inmediatamente después de abrir el archivo?',
      options: ['Save your work', 'Press Enter', 'Click the button', 'Type your name'], correct_index: 2,
      explanation_es: 'La segunda instrucción es hacer clic en el botón.',
    },
    {
      id: 'text-001-inference', kind: 'inference',
      prompt_en: 'What is the final goal of these instructions?', support_es: '¿Cuál es el objetivo final de estas instrucciones?',
      options: ['Delete a file', 'Save completed work', 'Send an email', 'Close the computer'], correct_index: 1,
      explanation_es: 'La secuencia termina con “Save your work”.',
    },
  ],
  'text-002': [
    {
      id: 'text-002-literal', kind: 'literal',
      prompt_en: 'What time does the person go to work?', support_es: '¿A qué hora va la persona al trabajo?',
      options: ['At seven', 'At eight', 'At nine', 'At ten'], correct_index: 2,
      explanation_es: 'El texto dice: “I go to work at nine”.',
    },
    {
      id: 'text-002-sequence', kind: 'sequence',
      prompt_en: 'What happens after dinner?', support_es: '¿Qué sucede después de la cena?',
      options: ['Breakfast', 'Work', 'Lunch', 'TV and reading'], correct_index: 3,
      explanation_es: 'Después de cenar, ve televisión y lee un libro.',
    },
    {
      id: 'text-002-inference', kind: 'inference',
      prompt_en: 'Which sentence best describes the text?', support_es: '¿Qué oración describe mejor el texto?',
      options: ['A work problem', 'A daily schedule', 'A computer lesson', 'A weekend trip'], correct_index: 1,
      explanation_es: 'Todas las acciones forman una rutina diaria.',
    },
  ],
  'text-003': [
    {
      id: 'text-003-literal', kind: 'literal',
      prompt_en: 'What does the internet connect?', support_es: '¿Qué conecta internet?',
      options: ['Only phones', 'Millions of computers', 'Only schools', 'Books and paper'], correct_index: 1,
      explanation_es: 'El texto dice que conecta millones de computadoras.',
    },
    {
      id: 'text-003-causal', kind: 'causal',
      prompt_en: 'Why is the internet important?', support_es: '¿Por qué es importante internet?',
      options: ['For sleep', 'For food', 'For communication and education', 'For driving'], correct_index: 2,
      explanation_es: 'La razón explícita es comunicación y educación.',
    },
    {
      id: 'text-003-inference', kind: 'inference',
      prompt_en: 'Which activity is NOT supported by the text?', support_es: '¿Qué actividad NO está respaldada por el texto?',
      options: ['Sending email', 'Watching videos', 'Studying', 'Repairing a car'], correct_index: 3,
      explanation_es: 'El texto no menciona reparar automóviles.',
    },
  ],
  'text-004': [
    {
      id: 'text-004-literal', kind: 'literal',
      prompt_en: 'Who introduced the new employee to the team?', support_es: '¿Quién presentó al nuevo empleado con el equipo?',
      options: ['The client', 'The manager', 'A colleague', 'The director'], correct_index: 1,
      explanation_es: 'El gerente hizo la presentación.',
    },
    {
      id: 'text-004-sequence', kind: 'sequence',
      prompt_en: 'What must the employee prepare for next week?', support_es: '¿Qué debe preparar el empleado para la próxima semana?',
      options: ['A contract', 'A budget', 'A presentation', 'A survey'], correct_index: 2,
      explanation_es: 'Tiene una reunión con un cliente y necesita una presentación.',
    },
    {
      id: 'text-004-inference', kind: 'inference',
      prompt_en: 'How was the first day overall?', support_es: '¿Cómo fue el primer día en general?',
      options: ['Hostile', 'Positive and informative', 'Boring and empty', 'Unsuccessful'], correct_index: 1,
      explanation_es: 'Los colegas fueron amables y la persona aprendió sobre el proyecto.',
    },
  ],
  'text-005': [
    {
      id: 'text-005-literal', kind: 'literal',
      prompt_en: 'What did the client want?', support_es: '¿Qué quería el cliente?',
      options: ['A better price', 'A new manager', 'More employees', 'A later meeting'], correct_index: 0,
      explanation_es: 'El cliente quería un mejor precio.',
    },
    {
      id: 'text-005-causal', kind: 'causal',
      prompt_en: 'Why could the team not simply lower the price?', support_es: '¿Por qué el equipo no podía simplemente bajar el precio?',
      options: ['The contract was lost', 'They needed to protect the profit margin', 'The client left', 'The meeting was canceled'], correct_index: 1,
      explanation_es: 'El texto contrasta el precio con la necesidad de mantener el margen.',
    },
    {
      id: 'text-005-inference', kind: 'inference',
      prompt_en: 'What proves that the negotiation succeeded?', support_es: '¿Qué demuestra que la negociación tuvo éxito?',
      options: ['It lasted three hours', 'The client asked a question', 'Both parties signed', 'The team met in the morning'], correct_index: 2,
      explanation_es: 'La firma de ambas partes prueba que llegaron a un acuerdo.',
    },
  ],
  'text-006': [
    {
      id: 'text-006-literal', kind: 'literal',
      prompt_en: 'When is the meeting?', support_es: '¿Cuándo es la reunión?',
      options: ['Monday at 2 PM', 'Monday at 5 PM', 'Friday at 2 PM', 'Tuesday at 2 PM'], correct_index: 0,
      explanation_es: 'El correo confirma el lunes a las 2 PM.',
    },
    {
      id: 'text-006-sequence', kind: 'sequence',
      prompt_en: 'What should Mr. Johnson do before the meeting?', support_es: '¿Qué debe hacer el Sr. Johnson antes de la reunión?',
      options: ['Sign a contract', 'Review the document', 'Prepare an invoice', 'Call the manager'], correct_index: 1,
      explanation_es: 'La remitente pide revisar el documento antes de la reunión.',
    },
    {
      id: 'text-006-inference', kind: 'inference',
      prompt_en: 'What is the main purpose of the email?', support_es: '¿Cuál es el propósito principal del correo?',
      options: ['Cancel a project', 'Confirm a meeting and share preparation', 'Request a salary increase', 'Report an error'], correct_index: 1,
      explanation_es: 'El correo confirma la reunión y comparte agenda e informe.',
    },
  ],
  'text-007': [
    {
      id: 'text-007-literal', kind: 'literal',
      prompt_en: 'What does machine learning find in information?', support_es: '¿Qué encuentra machine learning en la información?',
      options: ['Prices', 'Patterns', 'Emails', 'Budgets'], correct_index: 1,
      explanation_es: 'Los algoritmos encuentran patrones.',
    },
    {
      id: 'text-007-causal', kind: 'causal',
      prompt_en: 'Why can deep learning solve difficult problems?', support_es: '¿Por qué deep learning puede resolver problemas difíciles?',
      options: ['It uses many layers', 'It uses no data', 'It avoids networks', 'It removes algorithms'], correct_index: 0,
      explanation_es: 'El texto relaciona muchas capas con problemas difíciles.',
    },
    {
      id: 'text-007-inference', kind: 'inference',
      prompt_en: 'How are transformers related to neural networks?', support_es: '¿Cómo se relacionan los transformers con las redes neuronales?',
      options: ['They replace all data', 'They are a type of neural network', 'They are only videos', 'They are business reports'], correct_index: 1,
      explanation_es: 'El texto define transformer como un tipo de red neuronal.',
    },
  ],
  'text-008': [
    {
      id: 'text-008-literal', kind: 'literal',
      prompt_en: 'How do managers collect employee feedback?', support_es: '¿Cómo recopilan los gerentes la retroalimentación?',
      options: ['Through surveys', 'Through contracts', 'Through invoices', 'Through videos'], correct_index: 0,
      explanation_es: 'La retroalimentación se recopila mediante encuestas.',
    },
    {
      id: 'text-008-causal', kind: 'causal',
      prompt_en: 'Why do they analyze the survey results?', support_es: '¿Por qué analizan los resultados?',
      options: ['To cancel work', 'To improve performance', 'To remove the team', 'To avoid decisions'], correct_index: 1,
      explanation_es: 'Analizan los resultados para mejorar el rendimiento.',
    },
    {
      id: 'text-008-inference', kind: 'inference',
      prompt_en: 'Which skill supports better decisions in this text?', support_es: '¿Qué habilidad apoya mejores decisiones?',
      options: ['Fast typing', 'Good communication', 'Long meetings', 'More documents'], correct_index: 1,
      explanation_es: 'La conclusión dice que una buena comunicación es esencial.',
    },
  ],
  'text-009': [
    {
      id: 'text-009-literal', kind: 'literal',
      prompt_en: 'What does each layer extract?', support_es: '¿Qué extrae cada capa?',
      options: ['Different features', 'More meetings', 'Contract terms', 'Email addresses'], correct_index: 0,
      explanation_es: 'Cada capa extrae características diferentes de la entrada.',
    },
    {
      id: 'text-009-causal', kind: 'causal',
      prompt_en: 'Why does backpropagation adjust the weights?', support_es: '¿Por qué backpropagation ajusta los pesos?',
      options: ['To add data', 'To reduce the error', 'To increase the loss', 'To delete the model'], correct_index: 1,
      explanation_es: 'Ajusta los pesos para reducir el error.',
    },
    {
      id: 'text-009-inference', kind: 'inference',
      prompt_en: 'What indicates that training has worked?', support_es: '¿Qué indica que el entrenamiento funcionó?',
      options: ['The dataset is large', 'The model makes accurate predictions', 'The layers disappear', 'The input is deleted'], correct_index: 1,
      explanation_es: 'El resultado final esperado son predicciones precisas.',
    },
  ],
  'text-010': [
    {
      id: 'text-010-literal', kind: 'literal',
      prompt_en: 'Who participates in the performance review?', support_es: '¿Quién participa en la evaluación de desempeño?',
      options: ['A client and a supplier', 'A manager and an employee', 'Two customers', 'Only the director'], correct_index: 1,
      explanation_es: 'Es una reunión entre gerente y empleado.',
    },
    {
      id: 'text-010-sequence', kind: 'sequence',
      prompt_en: 'What do they do after discussing past achievements?', support_es: '¿Qué hacen después de hablar de logros pasados?',
      options: ['Set objectives', 'Cancel the review', 'Send an invoice', 'Hire a client'], correct_index: 0,
      explanation_es: 'Después establecen objetivos para el siguiente año.',
    },
    {
      id: 'text-010-inference', kind: 'inference',
      prompt_en: 'Which topic affects future career growth?', support_es: '¿Qué tema afecta el crecimiento profesional futuro?',
      options: ['Lunch time', 'Promotion criteria', 'Office color', 'Travel dates'], correct_index: 1,
      explanation_es: 'Los criterios de promoción se relacionan con crecimiento profesional.',
    },
  ],
  'mulesoft-agent-registry-b1': [
    {
      id: 'mulesoft-registry-literal', kind: 'literal',
      prompt_en: 'What does Agent Registry store in one shared inventory?', support_es: '¿Qué guarda Agent Registry en un inventario compartido?',
      options: ['Only APIs', 'Agents, MCP servers, APIs, proxies, and gateways', 'Only user passwords', 'Only CloudHub logs'], correct_index: 1,
      explanation_es: 'El inventario reúne varios tipos de activos de IA e integración.',
    },
    {
      id: 'mulesoft-registry-causal', kind: 'causal',
      prompt_en: 'Why should a team search the catalog before building?', support_es: '¿Por qué debe buscar en el catálogo antes de construir?',
      options: ['To reuse an existing asset', 'To delete all scanners', 'To avoid governance', 'To hide instance health'], correct_index: 0,
      explanation_es: 'El objetivo es descubrir y reutilizar antes de reconstruir.',
    },
    {
      id: 'mulesoft-registry-inference', kind: 'inference',
      prompt_en: 'What problem do scanners mainly solve?', support_es: '¿Qué problema resuelven principalmente los scanners?',
      options: ['Writing agent code', 'Keeping the catalog current as assets change', 'Translating documentation', 'Reducing every model cost'], correct_index: 1,
      explanation_es: 'Los scanners descubren y registran activos para mantener actualizado el inventario.',
    },
  ],
  'mulesoft-runtime-policy-transfer-b1': [
    {
      id: 'mulesoft-policy-transfer-literal', kind: 'literal',
      prompt_en: 'What can a runtime policy require?', support_es: '¿Qué puede exigir una política en tiempo de ejecución?',
      options: ['Authentication', 'A new catalog', 'A different language', 'A larger team'], correct_index: 0,
      explanation_es: 'El texto dice que una política puede exigir autenticación.',
    },
    {
      id: 'mulesoft-policy-transfer-causal', kind: 'causal',
      prompt_en: 'Why should teams test both normal and rejected requests?', support_es: '¿Por qué deben probar solicitudes normales y rechazadas?',
      options: ['To remove monitoring', 'To see whether the policy has the intended effect', 'To avoid the gateway', 'To delete the backend'], correct_index: 1,
      explanation_es: 'Probar ambos casos permite observar el efecto de la política y detectar bloqueos incorrectos.',
    },
    {
      id: 'mulesoft-policy-transfer-inference', kind: 'inference',
      prompt_en: 'What is most useful when a valid request is blocked?', support_es: '¿Qué resulta más útil cuando se bloquea una solicitud válida?',
      options: ['Logs and response details', 'A longer title', 'More catalog pages', 'A new password for every user'], correct_index: 0,
      explanation_es: 'Los logs y los detalles de respuesta ayudan a encontrar la causa del bloqueo.',
    },
  ],
  'mulesoft-pilot-registry-a-b1': [
    {
      id: 'pilot-a-main', kind: 'inference',
      prompt_en: 'Which statement best expresses the passage’s main point?',
      support_es: '¿Cuál expresa mejor la idea principal?',
      options: [
        'A registry makes every asset safe without further checks.',
        'Reliable discovery can reduce duplication, but reuse still needs current evidence and judgment.',
        'Teams should stop publishing assets on different platforms.',
        'Scanners replace owners and production approval.',
      ], correct_index: 1,
      explanation_es: 'El texto defiende descubrir y reutilizar, pero aclara que el registro no garantiza por sí solo un uso seguro.',
    },
    {
      id: 'pilot-a-detail-assets', kind: 'literal',
      prompt_en: 'Which set of assets does the passage say scanners may discover?',
      support_es: '¿Qué conjunto de activos pueden descubrir los scanners según el texto?',
      options: ['Agents, MCP servers, and APIs', 'Only databases and queues', 'Only source repositories', 'Only model weights'], correct_index: 0,
      explanation_es: 'El texto menciona explícitamente agents, MCP servers y APIs.',
    },
    {
      id: 'pilot-a-detail-risk', kind: 'literal',
      prompt_en: 'What operational risk follows when similar assets are built by several teams?',
      support_es: '¿Qué riesgo operativo aparece cuando varios equipos crean activos similares?',
      options: ['A fix may have to be repeated across implementations.', 'All assets are deleted.', 'The gateway always rejects traffic.', 'Versions become automatically stable.'], correct_index: 0,
      explanation_es: 'La sección de riesgo habla de mantenimiento duplicado y de repetir correcciones.',
    },
    {
      id: 'pilot-a-cohesion', kind: 'cohesion',
      prompt_en: 'In “This uncertainty encourages another local implementation,” what does “This uncertainty” refer to?',
      support_es: '¿A qué se refiere “This uncertainty”?',
      options: ['The time spent reading a catalogue', 'The lack of context needed to decide whether reuse is safe', 'The existence of a scanner schedule', 'The final production approval'], correct_index: 1,
      explanation_es: 'La frase retoma la falta de información sobre capacidad, dueño, versión, conformidad y salud.',
    },
    {
      id: 'pilot-a-connector', kind: 'sequence',
      prompt_en: 'What relationship does “However” introduce in the recommendation?',
      support_es: '¿Qué relación introduce “However”?',
      options: ['A contrast that limits the previous benefit', 'A chronological list of scanner runs', 'A definition of an API', 'A numerical comparison'], correct_index: 0,
      explanation_es: '“However” contrasta el valor de un catálogo con la advertencia de que no garantiza un uso seguro.',
    },
    {
      id: 'pilot-a-modality', kind: 'modality',
      prompt_en: 'In “Scanners may discover agents...,” what does “may” communicate?',
      support_es: '¿Qué comunica “may” en esta frase?',
      options: ['A possibility or capability, not an unconditional guarantee', 'A completed action', 'A prohibition', 'A mandatory deadline'], correct_index: 0,
      explanation_es: '“May” presenta una posibilidad o capacidad; el texto no promete que siempre ocurra.',
    },
    {
      id: 'pilot-a-stance', kind: 'stance',
      prompt_en: 'What is the author’s stance toward Agent Registry?',
      support_es: '¿Cuál es la postura del autor hacia Agent Registry?',
      options: ['Cautiously supportive: useful for discovery but insufficient as final approval', 'Hostile: it should never be used', 'Uncritically enthusiastic: it removes all risk', 'Indifferent: it has no effect on reuse'], correct_index: 0,
      explanation_es: 'El texto recomienda el registro, pero exige verificar evidencia antes de una decisión de producción.',
    },
    {
      id: 'pilot-a-implicature', kind: 'implicature',
      prompt_en: 'What is implied by “discovery as the first step, not the final approval”?',
      support_es: '¿Qué se implica con “primer paso, no aprobación final”?',
      options: ['Finding an asset should be followed by technical and ownership checks.', 'A catalogue entry is never useful.', 'Approval should happen before searching.', 'Scanners should be disabled before reuse.'], correct_index: 0,
      explanation_es: 'La recomendación implica que descubrir no sustituye verificar conformidad, dueño y salud.',
    },
    {
      id: 'pilot-a-purpose', kind: 'rhetorical-purpose',
      prompt_en: 'Why does the passage mention a scanner schedule?',
      support_es: '¿Por qué menciona el texto un horario de scanners?',
      options: ['To illustrate how the inventory can remain current', 'To define a security password', 'To prove that every asset is authentic', 'To compare two API versions'], correct_index: 0,
      explanation_es: 'El horario aparece como ejemplo de cómo descubrir activos y mantener actualizada la información.',
    },
  ],
  'mulesoft-pilot-policy-b-b1': [
    {
      id: 'pilot-b-main', kind: 'inference',
      prompt_en: 'Which statement best expresses the passage’s main point?',
      support_es: '¿Cuál expresa mejor la idea principal?',
      options: [
        'Gateway policies always produce the same result on every platform.',
        'Unexpected policy behavior requires reading interactions and testing the combined configuration.',
        'Teams should remove authentication when requests fail.',
        'Logs are enough to prove the cause of every rejection.',
      ], correct_index: 1,
      explanation_es: 'El texto centra el problema en la interacción, la precedencia, los valores de configuración y las pruebas.',
    },
    {
      id: 'pilot-b-detail-code', kind: 'literal',
      prompt_en: 'According to the passage, what can policies enforce without changing application code?',
      support_es: '¿Qué pueden hacer las políticas sin cambiar el código de la aplicación?',
      options: ['Authentication, access, consumption, or service-level rules', 'Only database migrations', 'Only user-interface colors', 'Only source-code formatting'], correct_index: 0,
      explanation_es: 'El texto enumera autenticación, acceso, consumo y reglas de nivel de servicio.',
    },
    {
      id: 'pilot-b-detail-cors', kind: 'literal',
      prompt_en: 'Which policy behavior is identified as the Mule 4 ordering exception?',
      support_es: '¿Qué comportamiento se identifica como excepción al orden en Mule 4?',
      options: ['CORS executes first.', 'Authentication is never applied.', 'All policies execute randomly.', 'Quota sharing is always disabled.'], correct_index: 0,
      explanation_es: 'El pasaje dice que las políticas pueden ordenarse, pero CORS es la excepción documentada y se ejecuta primero.',
    },
    {
      id: 'pilot-b-cohesion', kind: 'cohesion',
      prompt_en: 'In “the combined result depends on the policies in scope,” what does “the combined result” mean?',
      support_es: '¿Qué significa “the combined result”?',
      options: ['The effect produced by the policies considered together', 'The name of one policy', 'The date of a gateway release', 'The number of backend servers'], correct_index: 0,
      explanation_es: 'La expresión resume el efecto conjunto, no el comportamiento de una política aislada.',
    },
    {
      id: 'pilot-b-connector', kind: 'sequence',
      prompt_en: 'What relationship does “but” signal in the sentence about policy ordering?',
      support_es: '¿Qué relación introduce “but”?',
      options: ['A qualification or contrast to the general ordering rule', 'A repeated example with no change', 'A time sequence from past to future', 'A definition of quota sharing'], correct_index: 0,
      explanation_es: '“But” limita la regla general al introducir la excepción de CORS.',
    },
    {
      id: 'pilot-b-modality', kind: 'modality',
      prompt_en: 'In “Teams should document...,” what does “should” communicate?',
      support_es: '¿Qué comunica “should”?',
      options: ['A strong recommendation, not a statement that the action already happened', 'A physical ability', 'A past obligation already completed', 'An impossible action'], correct_index: 0,
      explanation_es: '“Should” funciona como recomendación para documentar y verificar.',
    },
    {
      id: 'pilot-b-stance', kind: 'stance',
      prompt_en: 'What is the author’s stance toward centralized standards?',
      support_es: '¿Cuál es la postura hacia los estándares centralizados?',
      options: ['Conditionally supportive: expand them as testing and accountability improve', 'Absolutely opposed', 'Certain that they remove all incidents', 'Neutral and unrelated to testing'], correct_index: 0,
      explanation_es: 'La recomendación final es condicional y depende de cobertura de pruebas y responsabilidad.',
    },
    {
      id: 'pilot-b-implicature', kind: 'implicature',
      prompt_en: 'What is implied by “a test result is evidence about that configuration”?',
      support_es: '¿Qué se implica con esa frase?',
      options: ['The result should not automatically be generalized to every gateway or policy set.', 'Testing is unnecessary after deployment.', 'One failure proves every policy is broken.', 'Logs should never be inspected.'], correct_index: 0,
      explanation_es: 'El texto limita el alcance de la evidencia a la configuración probada.',
    },
    {
      id: 'pilot-b-purpose', kind: 'rhetorical-purpose',
      prompt_en: 'Why does the passage mention response details and logs?',
      support_es: '¿Por qué menciona detalles de respuesta y logs?',
      options: ['To illustrate evidence used when observed behavior differs from expectation', 'To define the API version number', 'To prove CORS is always disabled', 'To replace all testing'], correct_index: 0,
      explanation_es: 'Se presentan como herramientas para investigar una discrepancia concreta.',
    },
  ],
  'mulesoft-pilot-versioning-c-b1': [
    {
      id: 'pilot-c-main', kind: 'inference',
      prompt_en: 'Which statement best expresses the passage’s main point?',
      support_es: '¿Cuál expresa mejor la idea principal?',
      options: [
        'Publishing a new version automatically migrates every consumer.',
        'Clear version and lifecycle information supports migration, but deprecation should follow evidence of readiness.',
        'Stable assets can always be overwritten without notice.',
        'Only the version number matters to API consumers.',
      ], correct_index: 1,
      explanation_es: 'El texto conecta versionado, ciclo de vida, guía de migración y preparación del consumidor.',
    },
    {
      id: 'pilot-c-detail-semver', kind: 'literal',
      prompt_en: 'What model does Exchange use for asset versions?',
      support_es: '¿Qué modelo usa Exchange para las versiones de activos?',
      options: ['Semantic Versioning', 'A weekly calendar', 'A random label', 'A database row number'], correct_index: 0,
      explanation_es: 'El pasaje dice que Exchange versiona los activos con semantic versioning.',
    },
    {
      id: 'pilot-c-detail-states', kind: 'literal',
      prompt_en: 'Which lifecycle states are named?',
      support_es: '¿Qué estados del ciclo de vida se nombran?',
      options: ['Development, stable, and deprecated', 'Draft, hidden, and deleted only', 'Open, closed, and archived', 'Alpha, beta, and expired'], correct_index: 0,
      explanation_es: 'La sección de ciclo de vida enumera development, stable y deprecated.',
    },
    {
      id: 'pilot-c-cohesion', kind: 'cohesion',
      prompt_en: 'In “but a number alone does not explain readiness,” what does “a number” refer to?',
      support_es: '¿A qué se refiere “a number”?',
      options: ['A version number by itself', 'The number of consumers in a meeting', 'A support telephone number', 'A count of gateway errors'], correct_index: 0,
      explanation_es: 'La frase contrasta el número de versión con la información adicional de preparación y compatibilidad.',
    },
    {
      id: 'pilot-c-connector', kind: 'sequence',
      prompt_en: 'What relationship does “while” signal between the two kinds of version?',
      support_es: '¿Qué relación introduce “while”?',
      options: ['A contrast between an asset version and a consumer-facing API version', 'A list of two identical labels', 'A cause explaining a gateway rejection', 'A chronological sequence of incidents'], correct_index: 0,
      explanation_es: '“While” contrasta la versión del activo con la versión de API visible para consumidores.',
    },
    {
      id: 'pilot-c-modality', kind: 'modality',
      prompt_en: 'In “an unplanned migration can surface hidden dependencies,” what does “can” communicate?',
      support_es: '¿Qué comunica “can”?',
      options: ['A possible risk or outcome', 'A mandatory action', 'A completed migration', 'A prohibition'], correct_index: 0,
      explanation_es: '“Can” presenta una posibilidad de riesgo, no una certeza ni una obligación.',
    },
    {
      id: 'pilot-c-stance', kind: 'stance',
      prompt_en: 'What is the author’s stance toward formal deprecation?',
      support_es: '¿Cuál es la postura hacia la deprecación formal?',
      options: ['Conditional: use readiness, compatibility evidence, and ownership to guide it', 'Immediate and universal', 'Always opposed', 'Unconcerned with consumers'], correct_index: 0,
      explanation_es: 'El texto rechaza una deprecación abrupta y pide evidencia de preparación.',
    },
    {
      id: 'pilot-c-implicature', kind: 'implicature',
      prompt_en: 'What is implied by “deprecation is a lifecycle signal, not evidence that every consumer has migrated”?',
      support_es: '¿Qué se implica con esa advertencia?',
      options: ['A provider still needs to track and support consumers during migration.', 'A deprecated asset is automatically unusable.', 'Consumers do not need migration guidance.', 'Stable and deprecated mean exactly the same thing in every decision.'], correct_index: 0,
      explanation_es: 'La señal de ciclo de vida no demuestra que los consumidores ya estén listos.',
    },
    {
      id: 'pilot-c-purpose', kind: 'rhetorical-purpose',
      prompt_en: 'Why does the passage end by distinguishing the version from the decision around it?',
      support_es: '¿Por qué termina distinguiendo la versión de la decisión asociada?',
      options: ['To show that useful catalog information includes context for action, not only a label', 'To define how to delete a database', 'To prove all API versions are equal', 'To recommend hiding lifecycle states'], correct_index: 0,
      explanation_es: 'El cierre resume que el catálogo debe apoyar decisiones de migración, no solo mostrar un número.',
    },
  ],
};

export function getReadingQuestions(textId: string): ReadingQuestion[] {
  const lesson = getFoundationLesson(textId);
  if (lesson) return lesson.questions.map((question, index) => ({ ...question, id: `${textId}-q${index + 1}` }));
  return QUESTIONS_BY_TEXT[textId] ?? [];
}
