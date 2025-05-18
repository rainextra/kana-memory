import React from 'react';
import { useGame } from '../context/GameContext';
import Button from './common/Button';
import Card, { CardContent, CardHeader, CardFooter } from './common/Card';
import { 
  RotateCcw, 
  Home, 
  RefreshCw, 
  Check, 
  X, 
  Clock, 
  BarChart4
} from 'lucide-react';
import { getCharacterColor, formatTime, getKanaTypeName } from '../utils';

const ResultsScreen: React.FC = () => {
  const { state, dispatch, calculateGameResults } = useGame();
  const results = calculateGameResults();
  const { options } = state;

  // Calculate percentage of correct answers with fixed decimal places
  const accuracyFormatted = results.accuracy.toFixed(1);
  
  // Determine performance message
  const getPerformanceMessage = () => {
    if (results.accuracy >= 90) return "Excellent job! You're becoming a master!";
    if (results.accuracy >= 70) return "Great work! Keep practicing!";
    if (results.accuracy >= 50) return "Good effort! You're making progress.";
    return "Nice start! Regular practice will help improve.";
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Results
        </h1>
        <p className="text-lg text-gray-600">
          {getPerformanceMessage()}
        </p>
      </div>

      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="text-center py-8">
              <div className="flex justify-center mb-3">
                <Check className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-1">Correct</h3>
              <p className="text-3xl font-bold text-green-600">{results.correct.length}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-red-50 to-red-100">
            <CardContent className="text-center py-8">
              <div className="flex justify-center mb-3">
                <X className="h-10 w-10 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-1">Incorrect</h3>
              <p className="text-3xl font-bold text-red-600">{results.incorrect.length}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100">
            <CardContent className="text-center py-8">
              <div className="flex justify-center mb-3">
                <BarChart4 className="h-10 w-10 text-indigo-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-1">Accuracy</h3>
              <p className="text-3xl font-bold text-indigo-600">{accuracyFormatted}%</p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-500 mr-2" />
              <h2 className="text-xl font-bold text-gray-800">Practice Summary</h2>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="mb-4 md:mb-0">
                <p className="font-medium text-gray-700">Practice Type:</p>
                <p className="text-gray-600">{getKanaTypeName(options.kanaType)}</p>
              </div>
              
              <div className="mb-4 md:mb-0">
                <p className="font-medium text-gray-700">Characters Practiced:</p>
                <p className="text-gray-600">{state.characters.length}</p>
              </div>
              
              <div className="mb-4 md:mb-0">
                <p className="font-medium text-gray-700">Time Taken:</p>
                <p className="text-gray-600">{formatTime(results.timeTaken)}</p>
              </div>
              
              <div>
                <p className="font-medium text-gray-700">Special Characters:</p>
                <p className="text-gray-600">
                  {options.includeYoon ? 'Yōon, ' : ''}
                  {options.includeDakutenHandakuten ? 'Dakuten & Handakuten' : ''}
                  {!options.includeYoon && !options.includeDakutenHandakuten ? 'None' : ''}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {results.incorrect.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <h2 className="text-xl font-bold text-gray-800">Characters to Review</h2>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-3">
                {results.incorrect.map((character, index) => (
                  <div 
                    key={`${character.kana}-${index}`} 
                    className="border rounded-md p-3 text-center"
                  >
                    <p className={`text-2xl ${getCharacterColor(character.type)}`}>
                      {character.kana}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">{character.romaji}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            onClick={() => dispatch({ type: 'RESET_GAME' })}
            variant="outline"
            className="flex items-center w-full sm:w-auto"
          >
            <Home className="h-4 w-4 mr-2" />
            Return to Start
          </Button>
          
          <Button 
            onClick={() => dispatch({ type: 'RESTART_GAME' })}
            className="flex items-center w-full sm:w-auto"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Play Again
          </Button>
          
          {results.incorrect.length > 0 && (
            <Button 
              onClick={() => dispatch({ 
                type: 'RESTART_GAME', 
                payload: { retryIncorrect: true } 
              })}
              variant="secondary"
              className="flex items-center w-full sm:w-auto"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Practice Incorrect Only
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;