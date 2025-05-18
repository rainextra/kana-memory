import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import Button from './common/Button';
import Card, { CardContent, CardHeader, CardFooter } from './common/Card';
import Timer from './common/Timer';
import { getCharacterColor, isAnswerCorrect } from '../utils';
import { ArrowRight, Info } from 'lucide-react';

const GameScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const { 
    characters, 
    currentCharacterIndex, 
    userAnswers, 
    options,
    timerActive,
    characterTimerActive
  } = state;
  
  const [inputValue, setInputValue] = useState('');
  const [showResult, setShowResult] = useState<'correct' | 'incorrect' | null>(null);
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const currentCharacter = characters[currentCharacterIndex];
  
  // Focus input on screen load and when moving to next character
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setInputValue('');
    setShowResult(null);
    setShowHint(false);
  }, [currentCharacterIndex]);
  
  // Handle timer expiration
  const handleTimerExpired = () => {
    dispatch({ type: 'STOP_TIMER' });
    dispatch({ type: 'SET_GAME_STATUS', payload: 'results' });
  };

  // Handle character timer expiration
  const handleCharacterTimerExpired = () => {
    dispatch({ type: 'STOP_CHARACTER_TIMER' });
    handleSkip();
  };
  
  // Handle answer submission
  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    
    const correct = isAnswerCorrect(inputValue, currentCharacter.romaji);
    setShowResult(correct ? 'correct' : 'incorrect');
    
    setTimeout(() => {
      dispatch({ type: 'SUBMIT_ANSWER', payload: inputValue });
      setInputValue('');
      setShowResult(null);
    }, 800);
  };
  
  // For keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };
  
  // Skip current character
  const handleSkip = () => {
    dispatch({ type: 'SUBMIT_ANSWER', payload: '' });
  };
  
  // Show hint
  const toggleHint = () => {
    setShowHint(!showHint);
  };
  
  // Progress bar calculation
  const progressPercentage = ((currentCharacterIndex + 1) / characters.length) * 100;
  
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-3xl mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">
            Character {currentCharacterIndex + 1} of {characters.length}
          </span>
          <div className="flex gap-4">
            {options.characterTimer && (
              <Timer
                initialSeconds={options.characterTimerDuration}
                isActive={characterTimerActive}
                onTimeout={handleCharacterTimerExpired}
                className="w-48"
              />
            )}
            {options.useTimer && (
              <Timer
                initialSeconds={options.timerDuration}
                isActive={timerActive}
                onTimeout={handleTimerExpired}
                className="w-48"
              />
            )}
          </div>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <Card className="w-full max-w-2xl">
        <CardContent className="flex flex-col items-center py-10">
          <div 
            className={`
              text-8xl mb-8 transition-all duration-500 transform
              ${showResult === 'correct' ? 'text-green-500 scale-110' : ''}
              ${showResult === 'incorrect' ? 'text-red-500 scale-90' : ''}
              ${getCharacterColor(currentCharacter.type)}
            `}
          >
            {currentCharacter.kana}
          </div>
          
          <div className="flex w-full max-w-md items-center space-x-2 mb-6">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type the romaji..."
              className={`
                flex-1 px-4 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2
                ${showResult === 'correct' ? 'border-green-500 focus:ring-green-500' : ''}
                ${showResult === 'incorrect' ? 'border-red-500 focus:ring-red-500' : ''}
                ${!showResult ? 'border-gray-300 focus:ring-indigo-500' : ''}
              `}
              disabled={showResult !== null}
            />
            <Button onClick={handleSubmit} disabled={!inputValue.trim() || showResult !== null}>
              Check
            </Button>
          </div>
          
          {showResult === 'incorrect' && (
            <div className="text-red-600 mb-4 text-center">
              <p className="font-bold">Incorrect!</p>
              <p>The correct answer is: {currentCharacter.romaji}</p>
            </div>
          )}
          
          {showHint && (
            <div className="text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200 text-center mb-4">
              <p className="text-sm">
                <span className="font-medium">Hint:</span> This is a {currentCharacter.type} character
                {currentCharacter.category && ` (${currentCharacter.category})`}. 
                The first letter is "{currentCharacter.romaji[0]}".
              </p>
            </div>
          )}
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleHint}
              className="flex items-center"
            >
              <Info className="h-4 w-4 mr-1" />
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleSkip}
            >
              Skip <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameScreen;