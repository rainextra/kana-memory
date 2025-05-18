import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GameProvider, useGame } from './context/GameContext';
import StartScreen from './components/StartScreen';
import OptionsScreen from './components/OptionsScreen';
import CharacterSelectionScreen from './components/CharacterSelectionScreen';
import GameScreen from './components/GameScreen';
import ResultsScreen from './components/ResultsScreen';
import KanaReferenceChart from './components/KanaReferenceChart';
import LanguageSelector from './components/LanguageSelector';
import { BookOpen } from 'lucide-react';

// Main game component with screen management
const Game: React.FC = () => {
  const { state } = useGame();
  const [showReferenceChart, setShowReferenceChart] = useState(false);
  const { t } = useTranslation();
  
  useEffect(() => {
    // Update the document title based on game state
    const gameTitles = {
      start: t('app.title'),
      options: `${t('options.title')} | ${t('app.title')}`,
      'character-selection': `${t('selection.title')} | ${t('app.title')}`,
      playing: `${t('game.practice')} | ${t('app.title')}`,
      results: `${t('results.title')} | ${t('app.title')}`,
    };
    
    document.title = gameTitles[state.status] || t('app.title');
  }, [state.status, t]);

  const renderScreen = () => {
    switch (state.status) {
      case 'start':
        return <StartScreen />;
      case 'options':
        return <OptionsScreen />;
      case 'character-selection':
        return <CharacterSelectionScreen />;
      case 'playing':
        return <GameScreen />;
      case 'results':
        return <ResultsScreen />;
      default:
        return <StartScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6">
      <LanguageSelector />
      <div className="max-w-6xl mx-auto">
        {renderScreen()}
        
        {/* Reference chart button - always visible */}
        <div className="fixed bottom-4 right-4">
          <button
            onClick={() => setShowReferenceChart(true)}
            className="bg-white p-3 rounded-full shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
            aria-label="Open Kana Reference Chart"
          >
            <BookOpen className="h-6 w-6 text-indigo-600" />
          </button>
        </div>
        
        {/* Kana reference chart (modal) */}
        <KanaReferenceChart 
          isOpen={showReferenceChart} 
          onClose={() => setShowReferenceChart(false)} 
        />
      </div>
    </div>
  );
};

// App wrapper with context provider
function App() {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  );
}

export default App;