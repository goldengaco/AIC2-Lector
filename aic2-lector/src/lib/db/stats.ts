import { db, type UserStats, type DailyProgress, type CefrLevel } from './index';
import { estimateGradeLevel, getOverallProgress, getCategoryProgress } from './grades';

export async function getStats(): Promise<UserStats | undefined> {
  return db.userStats.get('main');
}

export async function getTodayProgress(): Promise<DailyProgress | null> {
  const today = new Date().toISOString().split('T')[0];
  return (await db.dailyProgress.where('date').equals(today).first()) ?? null;
}

export async function recordDailyProgress(data: Partial<DailyProgress>): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  const existing = await getTodayProgress();

  if (existing) {
    await db.dailyProgress.update(existing.id, {
      words_reviewed: existing.words_reviewed + (data.words_reviewed || 0),
      words_learned: existing.words_learned + (data.words_learned || 0),
      reading_time_min: existing.reading_time_min + (data.reading_time_min || 0),
      sessions_count: existing.sessions_count + (data.sessions_count || 0),
      wpm_avg: data.wpm_avg || existing.wpm_avg,
    });
  } else {
    await db.dailyProgress.add({
      id: `daily-${today}`,
      date: today,
      words_reviewed: data.words_reviewed || 0,
      words_learned: data.words_learned || 0,
      reading_time_min: data.reading_time_min || 0,
      sessions_count: data.sessions_count || 1,
      wpm_avg: data.wpm_avg || 0,
      comprehension_avg: 0,
    });
  }

  const stats = await getStats();
  if (stats) {
    const newWordsLearned = data.words_learned || 0;
    const newReadingTime = data.reading_time_min || 0;
    const newSessions = data.sessions_count || 0;

    const words = await db.words.toArray();
    const mastered = words.filter(w => w.confidence >= 0.85).length;

    const todayStr = today;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const yesterdayProgress = await db.dailyProgress.where('date').equals(yesterdayStr).first();
    const newStreak = yesterdayProgress && yesterdayProgress.sessions_count > 0
      ? stats.current_streak + 1
      : (stats.last_session_date && new Date(stats.last_session_date).toDateString() === new Date().toDateString()
        ? stats.current_streak
        : 1);

    await db.userStats.update('main', {
      total_words_learned: stats.total_words_learned + newWordsLearned,
      total_words_mastered: mastered,
      total_reading_time_min: stats.total_reading_time_min + newReadingTime,
      total_sessions: stats.total_sessions + newSessions,
      current_streak: Math.max(newStreak, stats.current_streak),
      longest_streak: Math.max(newStreak, stats.longest_streak),
      last_session_date: new Date(),
      avg_wpm: data.wpm_avg || stats.avg_wpm,
      updated_at: new Date(),
    });
  }
}

export async function getVocabularyBreakdown() {
  const words = await db.words.toArray();
  return {
    mastered: words.filter(w => w.confidence >= 0.85).length,
    learning: words.filter(w => w.confidence >= 0.5 && w.confidence < 0.85).length,
    weak: words.filter(w => w.confidence < 0.5).length,
    total: words.length,
  };
}

export function estimateCefrLevel(totalWords: number, avgWpm: number): CefrLevel {
  if (totalWords >= 10000 && avgWpm >= 250) return 'C2';
  if (totalWords >= 7000 && avgWpm >= 200) return 'C1';
  if (totalWords >= 4000 && avgWpm >= 150) return 'B2';
  if (totalWords >= 2000 && avgWpm >= 100) return 'B1';
  if (totalWords >= 800 && avgWpm >= 60) return 'A2';
  return 'A1';
}

export async function getWeeklyProgress() {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  return db.dailyProgress.where('date').above(weekAgo.toISOString().split('T')[0]).toArray();
}

export async function getMonthlyStats() {
  const monthAgo = new Date();
  monthAgo.setDate(monthAgo.getDate() - 30);
  const progress = await db.dailyProgress.where('date').above(monthAgo.toISOString().split('T')[0]).toArray();
  return {
    totalWordsLearned: progress.reduce((s, p) => s + p.words_learned, 0),
    totalReadingTime: progress.reduce((s, p) => s + p.reading_time_min, 0),
    totalSessions: progress.reduce((s, p) => s + p.sessions_count, 0),
    avgWpm: progress.length > 0 ? Math.round(progress.reduce((s, p) => s + p.wpm_avg, 0) / progress.length) : 0,
    avgComprehension: progress.length > 0 ? Math.round(progress.reduce((s, p) => s + p.comprehension_avg, 0) / progress.length) : 0,
    daysActive: progress.filter(p => p.sessions_count > 0).length,
  };
}

export async function getWordsByLayer() {
  const words = await db.words.toArray();
  return {
    frequency: words.filter(w => w.layer === 'frequency').length,
    awl: words.filter(w => w.layer === 'awl').length,
    'technical-ia': words.filter(w => w.layer === 'technical-ia').length,
    mined: words.filter(w => w.layer === 'mined').length,
  };
}

export async function getGradeStats() {
  const stats = await getStats();
  if (!stats) return null;
  const grade = estimateGradeLevel(stats);
  const progress = await getOverallProgress();
  return { grade, progress };
}

export async function getGradeCategoryBreakdown() {
  return {
    reading: await getCategoryProgress('reading'),
    vocabulary: await getCategoryProgress('vocabulary'),
    comprehension: await getCategoryProgress('comprehension'),
    analysis: await getCategoryProgress('analysis'),
  };
}

const CEFR_WORD_TARGETS: Record<CefrLevel, number> = {
  A1: 500, A2: 1500, B1: 3000, B2: 5000, C1: 8000, C2: 12000,
};

const CEFR_HOUR_TARGETS: Record<CefrLevel, number> = {
  A1: 80, A2: 200, B1: 400, B2: 600, C1: 800, C2: 1200,
};

const CEFR_LABELS: Record<CefrLevel, string> = {
  A1: 'Beginner', A2: 'Elementary', B1: 'Intermediate', B2: 'Upper Intermediate', C1: 'Advanced', C2: 'Proficiency',
};

const CEFR_COLORS: Record<CefrLevel, string> = {
  A1: 'bg-gray-100 text-gray-700',
  A2: 'bg-blue-100 text-blue-700',
  B1: 'bg-green-100 text-green-700',
  B2: 'bg-yellow-100 text-yellow-700',
  C1: 'bg-orange-100 text-orange-700',
  C2: 'bg-red-100 text-red-700',
};

export async function getEstimatedDaysToLevels(): Promise<{
  currentLevel: CefrLevel;
  levels: {
    level: CefrLevel;
    label: string;
    color: string;
    wordsNeeded: number;
    hoursNeeded: number;
    daysByWords: number | null;
    daysByHours: number | null;
    daysEstimated: number | null;
    isReached: boolean;
  }[];
}> {
  const stats = await getStats();
  if (!stats) {
    return { currentLevel: 'A1', levels: [] };
  }

  const currentLevel = stats.cefr_estimated;
  const currentWords = stats.total_words_learned;
  const currentHours = Math.round(stats.total_reading_time_min / 60);

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekProgress = await db.dailyProgress.where('date').above(weekAgo.toISOString().split('T')[0]).toArray();
  const activeDays = weekProgress.filter(p => p.sessions_count > 0).length;
  const avgWordsPerDay = activeDays > 0 ? weekProgress.reduce((s, p) => s + p.words_learned, 0) / activeDays : 0;
  const avgMinutesPerDay = activeDays > 0 ? weekProgress.reduce((s, p) => s + p.reading_time_min, 0) / activeDays : 0;

  const levels: typeof CEFR_WORD_TARGETS extends Record<infer K, any> ? K extends CefrLevel ? {
    level: CefrLevel;
    label: string;
    color: string;
    wordsNeeded: number;
    hoursNeeded: number;
    daysByWords: number | null;
    daysByHours: number | null;
    daysEstimated: number | null;
    isReached: boolean;
  } : never : never[] = [];

  const levelOrder: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  for (const level of levelOrder) {
    const wordsTarget = CEFR_WORD_TARGETS[level];
    const hoursTarget = CEFR_HOUR_TARGETS[level];
    const wordsNeeded = Math.max(0, wordsTarget - currentWords);
    const hoursNeeded = Math.max(0, hoursTarget - currentHours);
    const isReached = currentWords >= wordsTarget;

    let daysByWords: number | null = null;
    let daysByHours: number | null = null;

    if (avgWordsPerDay > 0 && wordsNeeded > 0) {
      daysByWords = Math.ceil(wordsNeeded / avgWordsPerDay);
    }
    if (avgMinutesPerDay > 0 && hoursNeeded > 0) {
      daysByHours = Math.ceil((hoursNeeded * 60) / avgMinutesPerDay);
    }

    let daysEstimated: number | null = null;
    if (daysByWords !== null && daysByHours !== null) {
      daysEstimated = Math.max(daysByWords, daysByHours);
    } else if (daysByWords !== null) {
      daysEstimated = daysByWords;
    } else if (daysByHours !== null) {
      daysEstimated = daysByHours;
    }

    levels.push({
      level,
      label: CEFR_LABELS[level],
      color: CEFR_COLORS[level],
      wordsNeeded,
      hoursNeeded,
      daysByWords,
      daysByHours,
      daysEstimated,
      isReached,
    });
  }

  return { currentLevel, levels };
}
