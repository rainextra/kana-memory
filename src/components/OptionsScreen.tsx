import React from 'react';
import { useGame } from '../context/GameContext';
import Button from './common/Button';
import Card, { CardContent, CardHeader, CardFooter } from './common/Card';
import { ArrowLeft, Settings, Clock } from 'lucide-react';
import { getKanaTypeName } from '../utils';

const OptionsScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const { options } = state;

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Game Options
        </h1>
        <p className="text-lg text-gray-600">
          Customize your {getKanaTypeName(options.kanaType)} practice session
        </p>
      </div>

      <Card className="w-full max-w-2xl">
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center">
            <Settings className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">Character Options</h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => dispatch({ type: 'SET_GAME_STATUS', payload: 'start' })}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-lg font-medium text-gray-700 block">
                Special Characters
              </label>
              
              <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeYoon"
                    className="h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                    checked={options.includeYoon}
                    onChange={(e) => dispatch({ type: 'SET_INCLUDE_YOON', payload: e.target.checked })}
                  />
                  <label htmlFor="includeYoon" className="ml-2 text-base text-gray-700">
                    Include Yōon (やゆよ-based digraphs)
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeDakutenHandakuten"
                    className="h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                    checked={options.includeDakutenHandakuten}
                    onChange={(e) => dispatch({ type: 'SET_INCLUDE_DAKUTEN_HANDAKUTEN', payload: e.target.checked })}
                  />
                  <label htmlFor="includeDakutenHandakuten" className="ml-2 text-base text-gray-700">
                    Include Dakuten & Handakuten
                  </label>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="text-lg font-medium text-gray-700 block">
                Character Count
              </label>
              
              <div className="flex flex-wrap gap-2">
                {[5, 10, 20, 30, 50].map((count) => (
                  <Button
                    key={count}
                    variant={options.characterCount === count ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => dispatch({ type: 'SET_CHARACTER_COUNT', payload: count })}
                  >
                    {count}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="text-lg font-medium text-gray-700 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Timer Options
              </label>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="useTimer"
                  className="h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                  checked={options.useTimer}
                  onChange={(e) => dispatch({ type: 'SET_USE_TIMER', payload: e.target.checked })}
                />
                <label htmlFor="useTimer" className="ml-2 text-base text-gray-700">
                  Enable Timer
                </label>
              </div>
              
              {options.useTimer && (
                <div className="pl-7 space-y-2">
                  <label className="text-sm font-medium text-gray-700 block">
                    Time Limit (seconds)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[60, 120, 180, 300].map((seconds) => (
                      <Button
                        key={seconds}
                        variant={options.timerDuration === seconds ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => dispatch({ type: 'SET_TIMER_DURATION', payload: seconds })}
                      >
                        {seconds / 60} {seconds / 60 === 1 ? 'minute' : 'minutes'}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end">
          <Button
            onClick={() => dispatch({ type: 'SET_GAME_STATUS', payload: 'character-selection' })}
          >
            Continue
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OptionsScreen;