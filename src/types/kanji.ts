export interface KanjiCompoundExample {
  word: string;
  reading: string;
  hanViet: string;
  meaning: string;
}

export interface KanjiDetail {
  kanji: string;
  hanViet: string;
  meaning: string;
  on: string[];
  kun: string[];
  radical: string;
  radicalMeaning?: string;
  strokeCount: number;
  jlpt: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  mnemonic?: string; // Chiết tự / mẹo ghi nhớ
  compounds?: KanjiCompoundExample[];
  isCustom?: boolean;
}

export interface CompoundWord {
  word: string;
  reading: string;
  romaji: string;
  hanViet: string;
  meaning: string;
  jlpt: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  category: string;
  nuance?: string;
  exampleSentence?: {
    ja: string;
    reading: string;
    vi: string;
  };
  isCustom?: boolean;
}

export interface SearchResult {
  query: string;
  matchedCompound?: CompoundWord;
  compoundHanViet: string;
  kanjiList: KanjiDetail[];
  otherMatchingCompounds: CompoundWord[];
}

export interface SearchHistoryEntry {
  id: string;
  query: string;
  displayWord: string;
  hanViet: string;
  meaning: string;
  timestamp: number;
}

export interface FavoriteEntry {
  id: string;
  word: string;
  reading: string;
  hanViet: string;
  meaning: string;
  jlpt?: string;
  note?: string;
  tags?: string[];
  savedAt: number;
}

export interface QuizQuestion {
  id: string;
  type: 'kanji-to-hanviet' | 'hanviet-to-kanji' | 'compound-meaning';
  prompt: string;
  subPrompt?: string;
  correctAnswer: string;
  options: string[];
  explanation: string;
  relatedData: {
    word: string;
    reading?: string;
    hanViet: string;
    meaning: string;
  };
}

export type PastelThemeId = 'sakura' | 'matcha' | 'hydrangea' | 'sorbet' | 'sumi' | 'minimal';
export type FontSizeSetting = 'compact' | 'normal' | 'comfortable' | 'spacious';
export type KanjiFontStyle = 'serif' | 'sans' | 'brush';

export interface ThemeSettings {
  themeId: PastelThemeId;
  fontSize: FontSizeSetting;
  kanjiFont: KanjiFontStyle;
}

export interface UserAccount {
  id: string;
  email?: string;
  username: string;
  displayName: string;
  avatar: string;
  photoUrl?: string;
  isGoogleUser?: boolean;
  role?: string;
  themeSettings: ThemeSettings;
  createdAt: number;
}

export interface SavedHandwriting {
  id: string;
  kanji: string;
  hanViet: string;
  dataUrl: string;
  createdAt: number;
}

export interface HandwritingCandidate {
  kanji: string;
  hanViet: string;
  meaning: string;
  on?: string[];
  kun?: string[];
  radical?: string;
  strokeCount?: number;
  confidence?: 'high' | 'medium' | 'low';
  compounds?: KanjiCompoundExample[];
  exampleSentence?: {
    japanese: string;
    furigana?: string;
    vietnamese: string;
  };
}

export interface ExternalExampleSentence {
  japanese: string;
  furigana?: string;
  vietnamese: string;
}

export interface ExternalSearchResult {
  word: string;
  reading: string;
  romaji: string;
  hanViet: string;
  meaning: string;
  detailedMeaning?: string;
  jlpt: string;
  category: string;
  kanjiList: KanjiDetail[];
  exampleSentences?: ExternalExampleSentence[];
  originNotes?: string;
}

// User Practice Folders
export interface UserPracticeFolder {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  words: string[];
  createdAt: number;
  updatedAt?: number;
}

// Streak & Mascot System
export type MascotId = 'neko' | 'usagi' | 'kuma' | 'shiba' | 'kitsune';
export type MascotStage = 'baby' | 'kid' | 'teen' | 'master';
export type MascotItemType = 'headwear' | 'eyewear' | 'outfit' | 'handheld';

export interface MascotAccessory {
  id: string;
  name: string;
  category: MascotItemType;
  icon: string;
  requiredStreak: number;
  description: string;
}

export interface UserMascotState {
  userId: string;
  streak: number; // completed 10-word sessions in streak
  highestStreak: number;
  totalCompletedSessions: number;
  selectedMascotId: MascotId | null;
  equippedItems: {
    headwear?: string;
    eyewear?: string;
    outfit?: string;
    handheld?: string;
  };
  lastTrainedAt?: number;
}
