import { db, type UserStats, type DailyProgress, type CefrLevel } from './index';

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
