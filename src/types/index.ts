export type KanaType = 'hiragana' | 'katakana' | 'both';
export type GameStatus = 'start' | 'options' | 'character-selection' | 'playing' | 'results';
export type AnswerMode = 'typing' | 'multiple-choice';

export interface KanaCharacter {
  kana: string;
  romaji: string;
  type: 'hiragana' | 'katakana';
  category?: 'basic' | 'yoon' | 'dakuten' | 'handakuten';
}

export interface GameOptions {
  kanaType: KanaType;
  includeYoon: boolean;
  includeDakutenHandakuten: boolean;
  characterCount: number;
  selectedCharacters: KanaCharacter[];
  useTimer: boolean;
  timerDuration: number; // in seconds
  characterTimer: boolean;
  characterTimerDuration: number; // in seconds
  shuffleManualSelection: boolean;
  answerMode: AnswerMode; // ✅ <-- tambahkan di sini
}

export interface GameState {
  status: GameStatus;
  options: GameOptions;
  currentCharacterIndex: number;
  characters: KanaCharacter[];
  userAnswers: string[];
  startTime: number;
  endTime: number;
  timerActive: boolean;
  characterTimerActive: boolean;
}

export interface GameResult {
  correct: KanaCharacter[];
  incorrect: KanaCharacter[];
  userAnswers: string[];
  accuracy: number;
  timeTaken: number; // in seconds
}

export interface KanaCharacter {
  kana: string;
  romaji: string;
  type: 'hiragana' | 'katakana';
  category?: 'basic' | 'dakuten' | 'handakuten' | 'yoon'; // ← GUNAKAN category
  row?: string;
}

