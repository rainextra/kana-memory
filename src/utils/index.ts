import { KanaCharacter, GameResult } from '../types';

// Shuffle an array (Fisher-Yates algorithm)
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Check if answer is correct (case-insensitive)
export const isAnswerCorrect = (
  userAnswer: string,
  correctAnswer: string
): boolean => {
  return userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase();
};

// Calculate game results
export const calculateResults = (
  characters: KanaCharacter[],
  userAnswers: string[],
  startTime: number,
  endTime: number
): GameResult => {
  const correct: KanaCharacter[] = [];
  const incorrect: KanaCharacter[] = [];

  characters.forEach((character, index) => {
    if (isAnswerCorrect(userAnswers[index] || '', character.romaji)) {
      correct.push(character);
    } else {
      incorrect.push(character);
    }
  });

  const accuracy = characters.length > 0 
    ? (correct.length / characters.length) * 100 
    : 0;
  
  const timeTaken = (endTime - startTime) / 1000; // Convert to seconds

  return {
    correct,
    incorrect,
    userAnswers,
    accuracy,
    timeTaken,
  };
};

// Format time (for timer display)
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Get character color based on type
export const getCharacterColor = (type: 'hiragana' | 'katakana'): string => {
  return type === 'hiragana' ? 'text-indigo-600' : 'text-pink-700';
};

// Get a friendly name for kana type
export const getKanaTypeName = (type: 'hiragana' | 'katakana' | 'both'): string => {
  switch (type) {
    case 'hiragana':
      return 'Hiragana';
    case 'katakana':
      return 'Katakana';
    case 'both':
      return 'Hiragana & Katakana';
    default:
      return 'Kana';
  }
};

export function getMultipleChoices(correct: string, pool: KanaCharacter[]): string[] {
  const others = pool
    .map((char) => char.romaji)
    .filter((r) => r !== correct);

  const shuffled = shuffleArray(others).slice(0, 2); // ambil 2 pilihan salah
  const choices = shuffleArray([correct, ...shuffled]);
  return choices;
}

export const getRandomColor = () => {
  const colors = ['#facc15', '#34d399', '#60a5fa', '#f87171', '#c084fc'];
  return colors[Math.floor(Math.random() * colors.length)];
};
