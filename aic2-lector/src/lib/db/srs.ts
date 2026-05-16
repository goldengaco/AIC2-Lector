import { db, type Word, type CognateType } from './index';

const MIN_EF = 1.3;
const DEFAULT_EF = 2.5;

export type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5;

export interface ReviewResult {
  word_id: string;
  quality: ReviewQuality;
  new_interval: number;
  new_ease_factor: number;
  next_review: Date;
}

export function calculateNextReview(word: Word, quality: ReviewQuality): ReviewResult {
  let { ease_factor, interval } = word;
  const now = new Date();
  let new_interval: number;

  if (quality < 2) {
    new_interval = 1;
    ease_factor = Math.max(MIN_EF, ease_factor - 0.2);
  } else {
    if (word.review_count === 0) {
      new_interval = word.cognate_type === 'cognate' ? 7 : 1;
    } else {
      new_interval = Math.round(interval * ease_factor);
    }
    
    ease_factor = Math.max(MIN_EF, ease_factor + (0.1 - (5 - quality) * 0.1));
    
    if (quality >= 4) {
      new_interval = Math.round(new_interval * 1.3);
    } else if (quality === 3) {
      new_interval = Math.max(1, Math.round(new_interval * 0.8));
    }
  }

  return {
    word_id: word.id,
    quality,
    new_interval,
    new_ease_factor: ease_factor,
    next_review: new Date(now.getTime() + new_interval * 86400000),
  };
}

export async function reviewWord(wordId: string, quality: ReviewQuality): Promise<ReviewResult | null> {
  const word = await db.words.get(wordId);
  if (!word) return null;

  const result = calculateNextReview(word, quality);

  await db.words.update(wordId, {
    confidence: quality >= 3 ? Math.min(1, word.confidence + 0.15) : Math.max(0, word.confidence - 0.1),
    next_review: result.next_review,
    review_count: word.review_count + 1,
    ease_factor: result.new_ease_factor,
    interval: result.new_interval,
    updated_at: new Date(),
  });

  return result;
}

export async function getDueWords(limit: number = 20): Promise<Word[]> {
  const now = new Date();
  return db.words
    .where('next_review')
    .belowOrEqual(now)
    .filter(w => w.confidence < 0.85)
    .limit(limit)
    .toArray();
}

export async function getNewWords(limit: number = 10): Promise<Word[]> {
  return db.words.where('review_count').equals(0).limit(limit).toArray();
}

export async function getWordsForToday(newLimit = 10, reviewLimit = 50) {
  const dueWords = await getDueWords(reviewLimit);
  const newWords = await getNewWords(newLimit);
  const totalDue = await db.words.where('next_review').belowOrEqual(new Date()).count();
  
  return { newWords, dueWords, totalDue, totalNew: await db.words.where('review_count').equals(0).count() };
}

export async function markWordAsKnown(wordId: string): Promise<void> {
  await db.words.update(wordId, {
    confidence: 1,
    next_review: new Date(Date.now() + 365 * 86400000),
    ease_factor: DEFAULT_EF,
    updated_at: new Date(),
  });
}

export async function resetWordProgress(wordId: string): Promise<void> {
  await db.words.update(wordId, {
    confidence: 0,
    review_count: 0,
    ease_factor: DEFAULT_EF,
    interval: 0,
    next_review: new Date(),
    updated_at: new Date(),
  });
}

export async function getWordStats() {
  const words = await db.words.toArray();
  const total = words.length;
  const mastered = words.filter(w => w.confidence >= 0.85).length;
  const learning = words.filter(w => w.confidence >= 0.5 && w.confidence < 0.85).length;
  const weak = words.filter(w => w.confidence < 0.5).length;
  const avgConfidence = total > 0 ? words.reduce((s, w) => s + w.confidence, 0) / total : 0;
  
  return { total, mastered, learning, weak, avgConfidence };
}