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
	BarChart4,
	Sparkles
} from 'lucide-react';
import { getCharacterColor, formatTime, getKanaTypeName } from '../utils';
import { useTranslation } from 'react-i18next';

const ResultsScreen: React.FC = () => {
	const { state, dispatch, calculateGameResults } = useGame();
	const results = calculateGameResults();
	const { options } = state;
	const { t } = useTranslation();

	const accuracyFormatted = results.accuracy.toFixed(1);

	const getPerformanceMessage = () => {
		if (results.accuracy === 100) return t('results.performance.excellent');
		if (results.accuracy >= 90) return t('results.performance.great');
		if (results.accuracy >= 70) return t('results.performance.good');
		return t('results.performance.start');
	};

	return (
		<div className="flex flex-col items-center px-4 py-8">
			<div className="text-center mb-6">
				<h1 className="text-4xl font-extrabold text-gray-800 mb-2">
					{t('results.title')}
				</h1>
				<p className="text-lg text-gray-600">{getPerformanceMessage()}</p>
			</div>

			<div className="w-full max-w-5xl">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
					<Card className="bg-gradient-to-br from-green-50 to-green-100">
						<CardContent className="text-center py-8">
							<Check className="h-10 w-10 text-green-600 mx-auto mb-3" />
							<h3 className="text-lg font-medium text-gray-700 mb-1">
								{t('results.stats.correct')}
							</h3>
							<p className="text-3xl font-bold text-green-600">{results.correct.length}</p>
						</CardContent>
					</Card>

					<Card className="bg-gradient-to-br from-red-50 to-red-100">
						<CardContent className="text-center py-8">
							<X className="h-10 w-10 text-red-600 mx-auto mb-3" />
							<h3 className="text-lg font-medium text-gray-700 mb-1">
								{t('results.stats.incorrect')}
							</h3>
							<p className="text-3xl font-bold text-red-600">{results.incorrect.length}</p>
						</CardContent>
					</Card>

					<Card className="bg-gradient-to-br from-indigo-50 to-indigo-100">
						<CardContent className="text-center py-8">
							<BarChart4 className="h-10 w-10 text-indigo-600 mx-auto mb-3" />
							<h3 className="text-lg font-medium text-gray-700 mb-1">
								{t('results.stats.accuracy')}
							</h3>
							<p className="text-3xl font-bold text-indigo-600">{accuracyFormatted}%</p>
							{results.accuracy === 100 && (
								<div className="mt-2 text-sm font-medium text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full inline-block">
									<Sparkles className="inline h-4 w-4 mr-1" /> {t('results.stats.perfectBadge')}
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				<Card className="mb-6">
					<CardHeader>
						<div className="flex items-center">
							<Clock className="h-5 w-5 text-gray-500 mr-2" />
							<h2 className="text-xl font-bold text-gray-800">
								{t('results.stats.summary')}
							</h2>
						</div>
					</CardHeader>
					<CardContent className="grid md:grid-cols-2 gap-4 text-gray-700 text-sm">
						<div>
							<span className="font-medium">{t('results.stats.practiceType')}:</span>{' '}
							{getKanaTypeName(options.kanaType)}
						</div>
						<div>
							<span className="font-medium">{t('results.stats.charactersPracticed')}:</span>{' '}
							{state.characters.length}
						</div>
						<div>
							<span className="font-medium">{t('results.stats.timeTaken')}:</span>{' '}
							{formatTime(results.timeTaken)}
						</div>
						<div>
							<span className="font-medium">{t('results.stats.specialCharacters')}:</span>{' '}
							{[
								options.includeYoon && 'Yōon',
								options.includeDakutenHandakuten && 'Dakuten & Handakuten',
							].filter(Boolean).join(', ') || t('results.stats.none')}
						</div>
					</CardContent>
				</Card>

				{results.incorrect.length > 0 && (
					<Card className="mb-8">
						<CardHeader>
							<h2 className="text-xl font-bold text-gray-800">{t('results.review.title')}</h2>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-3">
								{results.incorrect.map((character, i) => (
									<div key={i} className="border rounded-md p-3 text-center">
										<p className={`text-2xl ${getCharacterColor(character.type)}`}>
											{character.kana}
										</p>
										<p className="text-sm text-gray-600">{character.romaji}</p>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				)}

				<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
					<Button onClick={() => dispatch({ type: 'RESET_GAME' })} variant="outline" className="w-full sm:w-auto">
						<Home className="h-4 w-4 mr-2" /> {t('buttons.returnToStart')}
					</Button>
					<Button onClick={() => dispatch({ type: 'RESTART_GAME' })} className="w-full sm:w-auto">
						<RotateCcw className="h-4 w-4 mr-2" /> {t('buttons.playAgain')}
					</Button>
					{results.incorrect.length > 0 && (
						<Button
							onClick={() => dispatch({ type: 'RESTART_GAME', payload: { retryIncorrect: true } })}
							variant="secondary"
							className="w-full sm:w-auto"
						>
							<RefreshCw className="h-4 w-4 mr-2" /> {t('buttons.practiceIncorrect')}
						</Button>
					)}
				</div>
			</div>
		</div>
	);
};

export default ResultsScreen;