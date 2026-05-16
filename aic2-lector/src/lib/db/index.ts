import Dexie, { type EntityTable } from 'dexie';

export type USGradeLevel = 'K' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'college';
export type SkillCategory = 'reading' | 'vocabulary' | 'comprehension' | 'analysis';
export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type VocabLayer = 'frequency' | 'awl' | 'technical-ia' | 'mined';
export type CognateType = 'cognate' | 'partial-cognate' | 'false-cognate' | 'no-cognate';
export type MorphemeType = 'root' | 'prefix' | 'suffix';
export type TextGenre = 'narrative' | 'journalistic' | 'technical-ia' | 'instructive' | 'academic' | 'literary' | 'business';

export interface GradeSkill {
  id: string;
  grade: USGradeLevel;
  category: SkillCategory;
  name: string;
  description: string;
  milestones: string[];
  cefr_equiv: CefrLevel;
  completed: boolean;
  completed_at?: Date;
}

export interface UserGrade {
  id: string;
  current_grade: USGradeLevel;
  target_grade: USGradeLevel;
  updated_at: Date;
}

export interface Word {
  id: string;
  lemma: string;
  pos: string[];
  translations_es: string[];
  cognate_es?: string;
  cognate_type: CognateType;
  frequency_rank: number;
  cefr_level: CefrLevel;
  layer: VocabLayer;
  examples: string[];
  roots?: string[];
  prefixes?: string[];
  suffixes?: string[];
  audio_url?: string;
  ipa?: string;
  collocations: string[];
  synonyms_en: string[];
  antonyms_en: string[];
  confidence: number;
  next_review?: Date;
  review_count: number;
  ease_factor: number;
  interval: number;
  created_at: Date;
  updated_at: Date;
}

export interface Text {
  id: string;
  title: string;
  body: string;
  cefr_level: CefrLevel;
  genre: TextGenre;
  word_count: number;
  unique_words: number;
  avg_sentence_length: number;
  source?: string;
  is_authentic: boolean;
  key_vocabulary: string[];
  created_at: Date;
}

export interface ReadingSession {
  id: string;
  text_id?: string;
  started_at: Date;
  finished_at?: Date;
  duration_sec: number;
  words_read: number;
  wpm: number;
  comprehension_score: number;
  subvocalization_estimated: number;
}

export interface MinedSentence {
  id: string;
  sentence: string;
  source_type: 'paper' | 'error' | 'novel' | 'blog' | 'doc' | 'other';
  source_url?: string;
  word_ids: string[];
  created_at: Date;
}

export interface Morpheme {
  id: string;
  type: MorphemeType;
  meaning_es: string;
  origin: 'latin' | 'greek' | 'germanic' | 'french';
  example_words: string[];
  cefr_level: CefrLevel;
  confidence: number;
  review_count: number;
  created_at: Date;
}

export interface GrammarRule {
  id: string;
  title: string;
  pattern: string;
  explanation_md: string;
  examples_en: string[];
  cefr_level: CefrLevel;
  category: 'basico' | 'frecuente-en-tecnico' | 'literario' | 'academico-formal';
  confidence: number;
  review_count: number;
  created_at: Date;
}

export interface UserStats {
  id: string;
  current_phase: number;
  total_words_learned: number;
  total_words_mastered: number;
  total_reading_time_min: number;
  total_sessions: number;
  current_streak: number;
  longest_streak: number;
  last_session_date?: Date;
  avg_wpm: number;
  cefr_estimated: CefrLevel;
  updated_at: Date;
}

export interface DailyProgress {
  id: string;
  date: string;
  words_reviewed: number;
  words_learned: number;
  reading_time_min: number;
  sessions_count: number;
  wpm_avg: number;
  comprehension_avg: number;
}

export interface Settings {
  id: string;
  key: string;
  value: string;
}

class AIC2Database extends Dexie {
  words!: EntityTable<Word, 'id'>;
  texts!: EntityTable<Text, 'id'>;
  readingSessions!: EntityTable<ReadingSession, 'id'>;
  minedSentences!: EntityTable<MinedSentence, 'id'>;
  morphemes!: EntityTable<Morpheme, 'id'>;
  grammarRules!: EntityTable<GrammarRule, 'id'>;
  userStats!: EntityTable<UserStats, 'id'>;
  dailyProgress!: EntityTable<DailyProgress, 'id'>;
  settings!: EntityTable<Settings, 'id'>;
  gradeSkills!: EntityTable<GradeSkill, 'id'>;
  userGrade!: EntityTable<UserGrade, 'id'>;

  constructor() {
    super('AIC2LectorV2');
    
    this.version(1).stores({
      words: 'id, lemma, cefr_level, layer, frequency_rank, next_review, confidence, review_count',
      texts: 'id, cefr_level, genre, created_at',
      readingSessions: 'id, text_id, started_at, finished_at',
      minedSentences: 'id, source_type, created_at',
      morphemes: 'id, type, cefr_level',
      grammarRules: 'id, cefr_level, category',
      userStats: 'id',
      dailyProgress: 'id, date',
      settings: 'id, key',
    });

    this.version(2).stores({
      words: 'id, lemma, cefr_level, layer, frequency_rank, next_review, confidence, review_count',
      texts: 'id, cefr_level, genre, created_at',
      readingSessions: 'id, text_id, started_at, finished_at',
      minedSentences: 'id, source_type, created_at',
      morphemes: 'id, type, cefr_level',
      grammarRules: 'id, cefr_level, category',
      userStats: 'id',
      dailyProgress: 'id, date',
      settings: 'id, key',
      gradeSkills: 'id, grade, category, cefr_equiv, completed',
      userGrade: 'id, current_grade',
    });
  }
}

export const db = new AIC2Database();

export async function initializeDatabase(): Promise<void> {
  try {
    await db.open();
  } catch (e) {
    console.warn('DB init warning:', e);
  }
}

export async function getSettings(key: string): Promise<string | undefined> {
  const setting = await db.settings.get(key);
  return setting?.value;
}

export async function setSettings(key: string, value: string): Promise<void> {
  await db.settings.put({ id: key, key, value });
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export * from './srs';
export * from './stats';