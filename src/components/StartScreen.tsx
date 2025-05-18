import React from 'react';
import { KanaType } from '../types';
import { useGame } from '../context/GameContext';
import Button from './common/Button';
import Card, { CardContent, CardHeader, CardFooter } from './common/Card';
import { Cherry, Moon, Castle } from 'lucide-react';

const StartScreen: React.FC = () => {
  const { dispatch } = useGame();

  const handleKanaTypeSelect = (type: KanaType) => {
    dispatch({ type: 'SET_KANA_TYPE', payload: type });
    dispatch({ type: 'SET_GAME_STATUS', payload: 'options' });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Japanese Kana Memory Game
        </h1>
        <p className="text-lg text-gray-600 max-w-xl">
          Test and improve your knowledge of Japanese Hiragana and Katakana characters!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <Card className="transform transition-all duration-300 hover:scale-105">
          <CardHeader className="bg-indigo-50">
            <div className="flex items-center justify-center h-16">
              <Cherry className="h-10 w-10 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent>
            <h2 className="text-xl font-bold text-gray-800 text-center mb-2">Hiragana</h2>
            <p className="text-gray-600 text-center mb-4">
              Practice the basic cursive Japanese script used for native words.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              onClick={() => handleKanaTypeSelect('hiragana')}
              variant="primary"
              fullWidth
            >
              Practice Hiragana
            </Button>
          </CardFooter>
        </Card>

        <Card className="transform transition-all duration-300 hover:scale-105">
          <CardHeader className="bg-pink-50">
            <div className="flex items-center justify-center h-16">
              <Moon className="h-10 w-10 text-pink-600" /> 
            </div>
          </CardHeader>
          <CardContent>
            <h2 className="text-xl font-bold text-gray-800 text-center mb-2">Katakana</h2>
            <p className="text-gray-600 text-center mb-4">
              Learn the angular Japanese script used primarily for foreign words.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              onClick={() => handleKanaTypeSelect('katakana')}
              variant="secondary"
              fullWidth
            >
              Practice Katakana
            </Button>
          </CardFooter>
        </Card>

        <Card className="transform transition-all duration-300 hover:scale-105">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-pink-50">
            <div className="flex items-center justify-center h-16">
              <Castle className="h-10 w-10 text-gray-700" />
            </div>
          </CardHeader>
          <CardContent>
            <h2 className="text-xl font-bold text-gray-800 text-center mb-2">Combined</h2>
            <p className="text-gray-600 text-center mb-4">
              Challenge yourself with both Hiragana and Katakana characters.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              onClick={() => handleKanaTypeSelect('both')}
              variant="outline"
              fullWidth
            >
              Practice Both
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default StartScreen;