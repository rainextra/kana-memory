import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import Button from './common/Button';
import Card, { CardContent, CardHeader, CardFooter } from './common/Card';
import { ArrowLeft, CheckCircle2, Circle, Play, ListFilter, Clock, Shuffle } from 'lucide-react';
import { getKanaByType } from '../data/kanaData';
import { KanaCharacter } from '../types';
import { getCharacterColor, getKanaTypeName } from '../utils';

const CharacterSelectionScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const { options } = state;
  const [selectionMode, setSelectionMode] = useState<'random' | 'manual'>('random');
  const [selectedCharacters, setSelectedCharacters] = useState<KanaCharacter[]>([]);
  
  // Get all available characters based on current options
  const availableCharacters = getKanaByType(
    options.kanaType,
    options.includeYoon,
    options.includeDakutenHandakuten
  );

  const toggleCharacterSelection = (character: KanaCharacter) => {
    if (selectedCharacters.some(c => c.kana === character.kana)) {
      setSelectedCharacters(selectedCharacters.filter(c => c.kana !== character.kana));
    } else {
      setSelectedCharacters([...selectedCharacters, character]);
    }
  };

  const handleStartGame = () => {
    if (selectionMode === 'manual' && selectedCharacters.length > 0) {
      dispatch({ 
        type: 'START_GAME', 
        payload: { selectedCharacters } 
      });
    } else {
      dispatch({ type: 'START_GAME' });
    }
  };

  const renderCharacterGrid = (characters: KanaCharacter[]) => {
    return (
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
        {characters.map((character) => {
          const isSelected = selectedCharacters.some(c => c.kana === character.kana);
          return (
            <button
              key={character.kana}
              onClick={() => toggleCharacterSelection(character)}
              className={`
                flex flex-col items-center justify-center p-2 rounded-md border-2 
                transition-all duration-200
                ${isSelected 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <span className={`text-xl ${getCharacterColor(character.type)}`}>
                {character.kana}
              </span>
              <span className="text-xs text-gray-500 mt-1">
                {character.romaji}
              </span>
              <div className="mt-1">
                {isSelected 
                  ? <CheckCircle2 className="h-4 w-4 text-indigo-500" /> 
                  : <Circle className="h-4 w-4 text-gray-300" />
                }
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Select Characters
        </h1>
        <p className="text-lg text-gray-600">
          Choose which {getKanaTypeName(options.kanaType)} characters you want to practice
        </p>
      </div>

      <Card className="w-full max-w-4xl">
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center">
            <ListFilter className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">Character Selection</h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => dispatch({ type: 'SET_GAME_STATUS', payload: 'options' })}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant={selectionMode === 'random' ? 'primary' : 'outline'}
                onClick={() => setSelectionMode('random')}
                className="flex-1"
              >
                Random Selection
              </Button>
              <Button 
                variant={selectionMode === 'manual' ? 'primary' : 'outline'}
                onClick={() => setSelectionMode('manual')}
                className="flex-1"
              >
                Manual Selection
              </Button>
            </div>
            
            {selectionMode === 'random' ? (
              <div className="space-y-4">
                <p className="text-gray-700">
                  {options.characterCount} random characters will be selected from the available 
                  {options.kanaType === 'both' ? ' Hiragana and Katakana' : 
                   options.kanaType === 'hiragana' ? ' Hiragana' : ' Katakana'} set.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <div className="border rounded-md p-3 space-y-2">
                    <div className="font-medium text-gray-700">Currently selected options:</div>
                    <div className="text-sm text-gray-600">
                      <div>• Character type: {getKanaTypeName(options.kanaType)}</div>
                      <div>• Yōon characters: {options.includeYoon ? 'Yes' : 'No'}</div>
                      <div>• Dakuten & Handakuten: {options.includeDakutenHandakuten ? 'Yes' : 'No'}</div>
                      <div>• Total characters available: {availableCharacters.length}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-gray-700">
                    Select the specific characters you want to practice
                  </p>
                  <p className="text-sm font-medium">
                    Selected: {selectedCharacters.length}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Character Timer
                      </label>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="characterTimer"
                          className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                          checked={options.characterTimer}
                          onChange={(e) => dispatch({ type: 'SET_CHARACTER_TIMER', payload: e.target.checked })}
                        />
                        <label htmlFor="characterTimer" className="ml-2 text-sm text-gray-600">
                          Enable per-character timer
                        </label>
                      </div>
                    </div>

                    {options.characterTimer && (
                      <div className="flex-1">
                        <label className="text-sm font-medium text-gray-700 mb-1 block">
                          Time per Character (seconds)
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {[5, 10, 15, 20, 25, 30].map((seconds) => (
                            <Button
                              key={seconds}
                              variant={options.characterTimerDuration === seconds ? 'primary' : 'outline'}
                              size="sm"
                              onClick={() => dispatch({ type: 'SET_CHARACTER_TIMER_DURATION', payload: seconds })}
                            >
                              {seconds}s
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="shuffleManualSelection"
                      className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                      checked={options.shuffleManualSelection}
                      onChange={(e) => dispatch({ type: 'SET_SHUFFLE_MANUAL_SELECTION', payload: e.target.checked })}
                    />
                    <label htmlFor="shuffleManualSelection" className="ml-2 text-sm text-gray-600 flex items-center">
                      Shuffle characters during practice
                      <Shuffle className="h-4 w-4 ml-1 text-gray-400" />
                    </label>
                  </div>
                </div>
                
                <div className="border rounded-md p-4 space-y-4 max-h-96 overflow-y-auto">
                  {options.kanaType === 'hiragana' && (
                    renderCharacterGrid(availableCharacters)
                  )}
                  
                  {options.kanaType === 'katakana' && (
                    renderCharacterGrid(availableCharacters)
                  )}
                  
                  {options.kanaType === 'both' && (
                    <>
                      <div className="border-b pb-2 mb-2">
                        <h3 className="text-lg font-medium text-indigo-600 mb-3">Hiragana</h3>
                        {renderCharacterGrid(
                          availableCharacters.filter(char => char.type === 'hiragana')
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-pink-600 mb-3">Katakana</h3>
                        {renderCharacterGrid(
                          availableCharacters.filter(char => char.type === 'katakana')
                        )}
                      </div>
                    </>
                  )}
                </div>
                
                {selectedCharacters.length === 0 && (
                  <p className="text-sm text-red-500">
                    Please select at least one character to continue
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end">
          <Button
            onClick={handleStartGame}
            disabled={selectionMode === 'manual' && selectedCharacters.length === 0}
            className="flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            Start Game
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CharacterSelectionScreen;