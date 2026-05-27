import { db, type USGradeLevel, type SkillCategory, type CefrLevel, type UserStats, type GradeSkill } from './index';

export type { GradeSkill, SkillCategory, USGradeLevel } from './index';

export const GRADE_ORDER: USGradeLevel[] = ['K', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 'college'];

export const GRADE_LABELS: Record<string, string> = {
  'K': 'Kindergarten',
  1: '1st Grade', 2: '2nd Grade', 3: '3rd Grade', 4: '4th Grade', 5: '5th Grade',
  6: '6th Grade', 7: '7th Grade', 8: '8th Grade', 9: '9th Grade', 10: '10th Grade',
  11: '11th Grade', 12: '12th Grade',
  'college': 'College / University',
};

export const GRADE_CEFR: Record<string, string> = {
  'K': 'A1', 1: 'A1', 2: 'A1', 3: 'A2', 4: 'A2', 5: 'B1', 6: 'B1',
  7: 'B2', 8: 'B2', 9: 'C1', 10: 'C1', 11: 'C1-C2', 12: 'C2', 'college': 'C2',
};

export const GRADE_CAN_READ: Record<string, string> = {
  'K': 'Instrucciones simples con imágenes',
  1: 'Palabras simples y frases de 3-4 palabras',
  2: 'Oraciones cortas y diálogos básicos',
  3: 'Párrafos simples y cuentos cortos',
  4: 'Textos de 200-300 palabras, emails simples',
  5: 'Artículos de 500+ palabras, emails corporativos',
  6: 'Textos informativos variados, reportes simples',
  7: 'Reportes técnicos, documentación, ensayos',
  8: 'Ensayos argumentativos, contratos simples',
  9: 'Papers académicos, documentación de APIs',
  10: 'Artículos de investigación de IA, documentos legales',
  11: 'Cualquier texto técnico sin apoyo',
  12: 'Papers de última generación, jerga especializada',
  'college': 'CUALQUIER texto: papers IA, docs ejecutivos, contratos complejos',
};

export const CATEGORY_LABELS: Record<SkillCategory, string> = {
  reading: 'Lectura',
  vocabulary: 'Vocabulario',
  comprehension: 'Comprensión',
  analysis: 'Análisis',
};

export const CATEGORY_COLORS: Record<SkillCategory, string> = {
  reading: 'bg-blue-500',
  vocabulary: 'bg-green-500',
  comprehension: 'bg-purple-500',
  analysis: 'bg-orange-500',
};

export const CATEGORY_STROKE: Record<SkillCategory, string> = {
  reading: 'stroke-blue-500',
  vocabulary: 'stroke-green-500',
  comprehension: 'stroke-purple-500',
  analysis: 'stroke-orange-500',
};

export function getGradeIndex(grade: USGradeLevel): number {
  return GRADE_ORDER.indexOf(grade);
}

export function getNextGrade(grade: USGradeLevel): USGradeLevel | null {
  const idx = getGradeIndex(grade);
  return idx < GRADE_ORDER.length - 1 ? GRADE_ORDER[idx + 1] : null;
}

export function getGradeFromCefr(cefr: CefrLevel): USGradeLevel {
  const map: Record<CefrLevel, USGradeLevel> = {
    A1: 'K', A2: 3, B1: 5, B2: 7, C1: 9, C2: 12,
  };
  return map[cefr];
}

export async function getSkillsByGrade(grade: USGradeLevel): Promise<GradeSkill[]> {
  return db.gradeSkills.where('grade').equals(grade).toArray();
}

export async function getSkillsByCategory(category: SkillCategory): Promise<GradeSkill[]> {
  return db.gradeSkills.where('category').equals(category).toArray();
}

export async function completeSkill(skillId: string): Promise<void> {
  await db.gradeSkills.update(skillId, {
    completed: true,
    completed_at: new Date(),
  });
}

export async function uncompleteSkill(skillId: string): Promise<void> {
  await db.gradeSkills.update(skillId, {
    completed: false,
    completed_at: undefined,
  });
}

export async function getGradeProgress(grade: USGradeLevel): Promise<number> {
  const skills = await getSkillsByGrade(grade);
  if (skills.length === 0) return 0;
  const completed = skills.filter(s => s.completed).length;
  return Math.round((completed / skills.length) * 100);
}

export async function getCategoryProgress(category: SkillCategory): Promise<number> {
  const skills = await getSkillsByCategory(category);
  if (skills.length === 0) return 0;
  const completed = skills.filter(s => s.completed).length;
  return Math.round((completed / skills.length) * 100);
}

export async function getOverallProgress(): Promise<{
  totalPct: number;
  currentGrade: USGradeLevel;
  maxGradeReached: USGradeLevel;
  totalCompleted: number;
  totalSkills: number;
}> {
  const allSkills = await db.gradeSkills.toArray();
  const completed = allSkills.filter(s => s.completed).length;
  const total = allSkills.length;
  const totalPct = total > 0 ? Math.round((completed / total) * 100) : 0;

  let maxGradeReached: USGradeLevel = 'K';
  for (const grade of GRADE_ORDER) {
    const skills = allSkills.filter(s => s.grade === grade);
    if (skills.length === 0) break;
    const pct = (skills.filter(s => s.completed).length / skills.length) * 100;
    if (pct >= 50) {
      maxGradeReached = grade;
    } else {
      break;
    }
  }

  const stats = await db.userStats.get('main');
  const currentGrade = stats ? estimateGradeLevel(stats) : 'K';

  return { totalPct, currentGrade, maxGradeReached, totalCompleted: completed, totalSkills: total };
}

export function estimateGradeLevel(stats: UserStats): USGradeLevel {
  const { total_words_learned, cefr_estimated } = stats;

  if (cefr_estimated === 'C2' && total_words_learned >= 10000) return 'college';
  if (cefr_estimated === 'C2') return 12;
  if (cefr_estimated === 'C1' && total_words_learned >= 5000) return 11;
  if (cefr_estimated === 'C1') return 10;
  if (cefr_estimated === 'B2' && total_words_learned >= 2500) return 9;
  if (cefr_estimated === 'B2') return 8;
  if (cefr_estimated === 'B1' && total_words_learned >= 1500) return 7;
  if (cefr_estimated === 'B1') return 6;
  if (cefr_estimated === 'A2' && total_words_learned >= 500) return 5;
  if (cefr_estimated === 'A2') return 4;
  if (total_words_learned >= 200) return 3;
  if (total_words_learned >= 100) return 2;
  if (total_words_learned >= 50) return 1;
  return 'K';
}

export async function initializeUserGrade(): Promise<void> {
  const existing = await db.userGrade.get('main');
  if (!existing) {
    const stats = await db.userStats.get('main');
    const currentGrade = stats ? estimateGradeLevel(stats) : 'K';
    await db.userGrade.add({
      id: 'main',
      current_grade: currentGrade,
      target_grade: 'college',
      updated_at: new Date(),
    });
  }
}
