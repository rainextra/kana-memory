import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameState, GameStatus, KanaType, KanaCharacter, GameOptions, GameResult } from '../types';
import { getKanaByType, getRandomKana } from '../data/kanaData';
import { calculateResults, shuffleArray } from '../utils';

// Initial game options
const initialOptions: GameOptions = {
  kanaType: 'hiragana',
  includeYoon: false,
  includeDakutenHandakuten: false,
  characterCount: 10,
  selectedCharacters: [],
  useTimer: false,
  timerDuration: 120, // 2 minutes
  characterTimer: false,
  characterTimerDuration: 10, // 10 seconds per character
  shuffleManualSelection: true,
};

// Initial game state
const initialState: GameState = {
  status: 'start',
  options: initialOptions,
  currentCharacterIndex: 0,
  characters: [],
  userAnswers: [],
  startTime: 0,
  endTime: 0,
  timerActive: false,
  characterTimerActive: false,
};

// Action types
type GameAction =
  | { type: 'SET_KANA_TYPE'; payload: KanaType }
  | { type: 'SET_INCLUDE_YOON'; payload: boolean }
  | { type: 'SET_INCLUDE_DAKUTEN_HANDAKUTEN'; payload: boolean }
  | { type: 'SET_CHARACTER_COUNT'; payload: number }
  | { type: 'SET_SELECTED_CHARACTERS'; payload: KanaCharacter[] }
  | { type: 'SET_USE_TIMER'; payload: boolean }
  | { type: 'SET_TIMER_DURATION'; payload: number }
  | { type: 'SET_CHARACTER_TIMER'; payload: boolean }
  | { type: 'SET_CHARACTER_TIMER_DURATION'; payload: number }
  | { type: 'SET_SHUFFLE_MANUAL_SELECTION'; payload: boolean }
  | { type: 'SET_GAME_STATUS'; payload: GameStatus }
  | { type: 'START_GAME'; payload?: { selectedCharacters?: KanaCharacter[] } }
  | { type: 'SUBMIT_ANSWER'; payload: string }
  | { type: 'NEXT_CHARACTER' }
  | { type: 'RESET_GAME' }
  | { type: 'RESTART_GAME'; payload?: { retryIncorrect?: boolean } }
  | { type: 'START_TIMER' }
  | { type: 'STOP_TIMER' }
  | { type: 'START_CHARACTER_TIMER' }
  | { type: 'STOP_CHARACTER_TIMER' };

// Game reducer
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_KANA_TYPE':
      return {
        ...state,
        options: { ...state.options, kanaType: action.payload },
      };
    case 'SET_INCLUDE_YOON':
      return {
        ...state,
        options: { ...state.options, includeYoon: action.payload },
      };
    case 'SET_INCLUDE_DAKUTEN_HANDAKUTEN':
      return {
        ...state,
        options: { ...state.options, includeDakutenHandakuten: action.payload },
      };
    case 'SET_CHARACTER_COUNT':
      return {
        ...state,
        options: { ...state.options, characterCount: action.payload },
      };
    case 'SET_SELECTED_CHARACTERS':
      return {
        ...state,
        options: { ...state.options, selectedCharacters: action.payload },
      };
    case 'SET_USE_TIMER':
      return {
        ...state,
        options: { ...state.options, useTimer: action.payload },
      };
    case 'SET_TIMER_DURATION':
      return {
        ...state,
        options: { ...state.options, timerDuration: action.payload },
      };
    case 'SET_CHARACTER_TIMER':
      return {
        ...state,
        options: { ...state.options, characterTimer: action.payload },
      };
    case 'SET_CHARACTER_TIMER_DURATION':
      return {
        ...state,
        options: { ...state.options, characterTimerDuration: action.payload },
      };
    case 'SET_SHUFFLE_MANUAL_SELECTION':
      return {
        ...state,
        options: { ...state.options, shuffleManualSelection: action.payload },
      };
    case 'SET_GAME_STATUS':
      return {
        ...state,
        status: action.payload,
      };
    case 'START_GAME': {
      const { kanaType, includeYoon, includeDakutenHandakuten, characterCount, shuffleManualSelection } = state.options;
      
      // Use either provided characters or get random ones based on options
      let characters: KanaCharacter[];
      if (action.payload?.selectedCharacters && action.payload.selectedCharacters.length > 0) {
        characters = shuffleManualSelection ? shuffleArray([...action.payload.selectedCharacters]) : [...action.payload.selectedCharacters];
      } else if (state.options.selectedCharacters.length > 0) {
        characters = shuffleManualSelection ? shuffleArray([...state.options.selectedCharacters]) : [...state.options.selectedCharacters];
      } else {
        const availableCharacters = getKanaByType(kanaType, includeYoon, includeDakutenHandakuten);
        characters = getRandomKana(availableCharacters, characterCount);
      }
      
      return {
        ...state,
        status: 'playing',
        characters,
        userAnswers: Array(characters.length).fill(''),
        currentCharacterIndex: 0,
        startTime: Date.now(),
        endTime: 0,
        timerActive: state.options.useTimer,
        characterTimerActive: state.options.characterTimer,
      };
    }
    case 'SUBMIT_ANSWER': {
      const newUserAnswers = [...state.userAnswers];
      newUserAnswers[state.currentCharacterIndex] = action.payload;
      
      // Check if this was the last character
      const isLastCharacter = state.currentCharacterIndex === state.characters.length - 1;
      
      if (isLastCharacter) {
        return {
          ...state,
          userAnswers: newUserAnswers,
          status: 'results',
          endTime: Date.now(),
          timerActive: false,
          characterTimerActive: false,
        };
      }
      
      return {
        ...state,
        userAnswers: newUserAnswers,
        currentCharacterIndex: state.currentCharacterIndex + 1,
        characterTimerActive: state.options.characterTimer,
      };
    }
    case 'NEXT_CHARACTER': {
      // Move to the next character or to results if it was the last one
      const isLastCharacter = state.currentCharacterIndex === state.characters.length - 1;
      
      if (isLastCharacter) {
        return {
          ...state,
          status: 'results',
          endTime: Date.now(),
          timerActive: false,
          characterTimerActive: false,
        };
      }
      
      return {
        ...state,
        currentCharacterIndex: state.currentCharacterIndex + 1,
        characterTimerActive: state.options.characterTimer,
      };
    }
    case 'RESET_GAME':
      return {
        ...initialState,
        options: state.options, // Keep the user's last options
      };
    case 'RESTART_GAME': {
      const retryIncorrect = action.payload?.retryIncorrect ?? false;
      
      if (retryIncorrect && state.status === 'results') {
        // Calculate which characters were answered incorrectly
        const results = calculateResults(
          state.characters, 
          state.userAnswers, 
          state.startTime, 
          state.endTime
        );
        
        // Only retry if there were incorrect answers
        if (results.incorrect.length > 0) {
          const characters = state.options.shuffleManualSelection 
            ? shuffleArray([...results.incorrect])
            : results.incorrect;

          return {
            ...state,
            status: 'playing',
            characters,
            userAnswers: Array(results.incorrect.length).fill(''),
            currentCharacterIndex: 0,
            startTime: Date.now(),
            endTime: 0,
            timerActive: state.options.useTimer,
            characterTimerActive: state.options.characterTimer,
          };
        }
      }
      
      // Standard restart (or no incorrect answers to retry)
      const characters = state.options.shuffleManualSelection 
        ? shuffleArray([...state.characters])
        : [...state.characters];

      return {
        ...state,
        status: 'playing',
        characters,
        userAnswers: Array(state.characters.length).fill(''),
        currentCharacterIndex: 0,
        startTime: Date.now(),
        endTime: 0,
        timerActive: state.options.useTimer,
        characterTimerActive: state.options.characterTimer,
      };
    }
    case 'START_TIMER':
      return {
        ...state,
        timerActive: true,
      };
    case 'STOP_TIMER':
      return {
        ...state,
        timerActive: false,
        endTime: state.endTime || Date.now(),
      };
    case 'START_CHARACTER_TIMER':
      return {
        ...state,
        characterTimerActive: true,
      };
    case 'STOP_CHARACTER_TIMER':
      return {
        ...state,
        characterTimerActive: false,
      };
    default:
      return state;
  }
};

// Create context
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  calculateGameResults: () => GameResult;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const calculateGameResults = (): GameResult => {
    return calculateResults(
      state.characters,
      state.userAnswers,
      state.startTime,
      state.endTime || Date.now()
    );
  };

  return (
    <GameContext.Provider value={{ state, dispatch, calculateGameResults }}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the game context
export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};