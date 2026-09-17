export type Drill = { kind: string; title: string; hint: string; examples: Array<{ text: string; question: string; options: string[]; answer: number; explanation: string }> };
export const drills: Drill[] = [
  { kind: 'literal', title: 'Localizar información', hint: 'Busca quién, qué y cuándo. No añadas información que el texto no dice.', examples: [
    { text: 'The library opens at nine on weekdays and at ten on Saturday.', question: '¿A qué hora abre el sábado?', options: ['A las nueve', 'A las diez'], answer: 1, explanation: '“On Saturday” identifica el día; “at ten” da la hora.' },
    { text: 'Marta works at home on Monday. On Tuesday she works at the office.', question: '¿Dónde trabaja Marta el martes?', options: ['En casa', 'En la oficina'], answer: 1, explanation: 'La segunda frase dice “On Tuesday ... at the office”.' },
  ] },
  { kind: 'inference', title: 'Inferir con evidencia', hint: 'Elige la conclusión apoyada por las pistas, sin convertir una posibilidad en certeza.', examples: [
    { text: 'Leo reached the station as the last train disappeared around the bend.', question: '¿Qué conclusión apoya el texto?', options: ['Leo perdió ese tren', 'Leo decidió viajar en autobús'], answer: 0, explanation: 'El tren ya se alejaba cuando llegó; nada dice qué transporte usó después.' },
    { text: 'The café lights were off, and a sign on the door said “Back tomorrow”.', question: '¿Qué es razonable concluir?', options: ['El café cerró para siempre', 'El café no estaba atendiendo en ese momento'], answer: 1, explanation: '“Back tomorrow” indica un cierre temporal, no definitivo.' },
  ] },
  { kind: 'modality', title: 'Distinguir obligación y posibilidad', hint: 'Must indica obligación; may puede indicar permiso o posibilidad según el contexto. Compara el alcance de cada afirmación.', examples: [
    { text: 'Visitors must show a ticket. They may leave their bags at reception.', question: '¿Qué es obligatorio?', options: ['Dejar las bolsas', 'Mostrar el boleto'], answer: 1, explanation: '“Must show” exige mostrarlo; “may leave” permite dejar las bolsas.' },
    { text: 'The medicine may cause drowsiness.', question: '¿Qué afirma la frase?', options: ['La somnolencia es posible', 'Todas las personas tendrán somnolencia'], answer: 0, explanation: '“May cause” expresa posibilidad, no un efecto inevitable.' },
  ] },
  { kind: 'cohesion', title: 'Seguir referencias y contrastes', hint: 'Localiza a qué se refieren los pronombres y qué relación establece el conector.', examples: [
    { text: 'Nora lent Eva a book. Eva returned it on Friday.', question: '¿A qué se refiere “it”?', options: ['Al libro', 'Al viernes'], answer: 0, explanation: '“It” retoma “a book”, el objeto devuelto.' },
    { text: 'The room was small. However, it was comfortable.', question: '¿Qué función tiene “However”?', options: ['Indica una causa', 'Introduce un contraste'], answer: 1, explanation: 'Contrasta el tamaño reducido con una cualidad favorable.' },
  ] },
];

/** Select at most two supported skills with actual errors; no CEFR inference. */
export function selectDrills(evidence: Array<{kind: string; correct: number; total: number}>): Drill[] {
  return evidence.filter(e => Number.isInteger(e.total) && e.total > 0 && Number.isInteger(e.correct) && e.correct >= 0 && e.correct < e.total)
    .sort((a, b) => a.correct / a.total - b.correct / b.total)
    .flatMap(e => drills.filter(d => d.kind === e.kind)).filter((d, i, all) => all.indexOf(d) === i).slice(0, 2);
}
