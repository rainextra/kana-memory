import { useTranslation, Trans } from 'react-i18next';
import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import Button from './common/Button';
import Card, { CardContent } from './common/Card';
import Timer from './common/Timer';
import { getCharacterColor, isAnswerCorrect, getMultipleChoices } from '../utils';
import { ArrowRight, Info } from 'lucide-react';
import Layout from './Layout';
import { motion, AnimatePresence } from 'framer-motion';

const FEEDBACK_DELAY = 1600;

const useWindowSize = () => {
	const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

	useEffect(() => {
		const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return size;
};


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

	const { t } = useTranslation();
	const [inputValue, setInputValue] = useState('');
	const [showResult, setShowResult] = useState<'correct' | 'incorrect' | null>(null);
	const [showHint, setShowHint] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);

	const FEEDBACK_DELAY = 1600; // bisa diubah jadi 2000 (2 detik) kalau mau

	const currentCharacter = characters[currentCharacterIndex];

	useEffect(() => {
		if (inputRef.current && options.answerMode === 'typing') {
			inputRef.current.focus();
		}
		setInputValue('');
		setShowResult(null);
		setShowHint(false);
	}, [currentCharacterIndex]);

	useEffect(() => {
		if (options.characterTimer) {
			dispatch({ type: 'STOP_CHARACTER_TIMER' }); // stop current timer
			setTimeout(() => {
				dispatch({ type: 'START_CHARACTER_TIMER' }); // restart after short delay
			}, 50); // 50ms delay to ensure unmount/remount
		}
	}, [currentCharacterIndex]);



	const handleTimerExpired = () => {
		dispatch({ type: 'STOP_TIMER' });
		dispatch({ type: 'SET_GAME_STATUS', payload: 'results' });
	};

	const handleCharacterTimerExpired = () => {
		setShowResult('incorrect');
		setShowTimeoutMessage(true);

		setTimeout(() => {
			setShowResult(null);
			setShowTimeoutMessage(false);
			dispatch({ type: 'SUBMIT_ANSWER', payload: '' });
		}, FEEDBACK_DELAY);
	};



	const handleSubmit = (value?: string) => {
		const answer = value ?? inputValue.trim();
		if (!answer) return;

		const correct = isAnswerCorrect(answer, currentCharacter.romaji);
		setShowResult(correct ? 'correct' : 'incorrect');

		setTimeout(() => {
			dispatch({ type: 'SUBMIT_ANSWER', payload: answer });

			// Tambahkan ini untuk restart timer karakter
			if (options.characterTimer) {
				dispatch({ type: 'START_CHARACTER_TIMER' });
			}

			setInputValue('');
			setShowResult(null);
		}, FEEDBACK_DELAY);
	};

	const handleSkip = () => {
		dispatch({ type: 'SUBMIT_ANSWER', payload: '' });

		// Tambahkan ini juga
		if (options.characterTimer) {
			dispatch({ type: 'START_CHARACTER_TIMER' });
		}
	};


	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleSubmit();
		}
	};


	const toggleHint = () => {
		setShowHint(!showHint);
	};

	const progressPercentage = ((currentCharacterIndex + 1) / characters.length) * 100;

	const [multipleChoices, setMultipleChoices] = useState<string[]>([]);

	useEffect(() => {
		if (options.answerMode === 'multiple-choice') {
			const newChoices = getMultipleChoices(currentCharacter.romaji, characters);
			setMultipleChoices(newChoices);
		}
	}, [currentCharacterIndex, options.answerMode]);


	return (
		<Layout>
			<div className="flex flex-col items-center">
				<div className="w-full max-w-3xl mb-6">
					{/* TOP SECTION (only game session timer here) */}
					<div className="flex justify-between items-center mb-2">
						<span className="text-sm font-medium text-gray-600">
							{t('game.characterProgress', {
								current: currentCharacterIndex + 1,
								total: characters.length
							})}
						</span>
						<div>
							{options.useTimer && (
								<div className="text-right">
									<p className="text-xs text-gray-600 mb-1">Session Time</p>
									<Timer
										initialSeconds={options.timerDuration}
										isActive={timerActive}
										onTimeout={handleTimerExpired}
										className="w-48"
									/>
								</div>
							)}
						</div>
					</div>

					<div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
						<div
							className="h-full bg-indigo-600 transition-all duration-500"
							style={{ width: `${progressPercentage}%` }}
						/>
					</div>

				</div>

				<Card className="w-full max-w-2xl">
					<CardContent className="flex flex-col items-center py-10 relative">
						<AnimatePresence mode="wait">
							{options.characterTimer && (
								<div className="mb-4">
									<Timer
										key={currentCharacterIndex}
										initialSeconds={options.characterTimerDuration}
										isActive={characterTimerActive}
										onTimeout={handleCharacterTimerExpired}
										className="w-40"
										hideLabel
										hideProgress
									/>
								</div>
							)}
							<motion.div
								initial={false}
								animate={{
									rotate: showResult === 'incorrect' ? [0, -10, 10, -10, 10, 0] : 0,
									scale: showResult === 'correct' ? [1, 1.2, 1] : 1,
									color:
										showResult === 'correct'
											? '#16a34a'
											: showResult === 'incorrect'
												? '#dc2626'
												: undefined
								}}
								transition={{ duration: 0.4, ease: 'easeInOut' }}
								className={`text-8xl mb-8 ${getCharacterColor(currentCharacter.type)}`}
							>
								{currentCharacter.kana}
							</motion.div>


						</AnimatePresence>

						{/* Answer Input or Choices */}
						{options.answerMode === 'typing' ? (
							<div className="w-full max-w-md mb-6">
								<input
									ref={inputRef}
									type="text"
									value={inputValue}
									onChange={(e) => setInputValue(e.target.value)}
									onKeyDown={handleKeyDown}
									placeholder={t('game.typeRomaji')}
									className={`
										w-full px-4 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2 mb-3
										${showResult === 'correct' ? 'border-green-500 focus:ring-green-500 text-green-600' : ''}
										${showResult === 'incorrect' ? 'border-red-500 focus:ring-red-500 text-red-600' : ''}
										${!showResult ? 'border-gray-300 focus:ring-indigo-500 text-gray-800' : ''}
									`}
									disabled={showResult !== null}
								/>
								<Button
									onClick={() => handleSubmit()}
									disabled={!inputValue.trim() || showResult !== null}
									className="w-full"
								>
									{t('buttons.check')}
								</Button>
							</div>
						) : (
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 w-full max-w-md">
								{multipleChoices.map((choice) => (
									<Button
										key={choice}
										variant="outline"
										className={`py-3 text-lg ${showResult && choice === currentCharacter.romaji
											? showResult === 'correct'
												? 'border-green-500 text-green-600'
												: 'border-red-500 text-red-600'
											: ''
											}`}
										onClick={() => handleSubmit(choice)}
										disabled={showResult !== null}
									>
										{choice}
									</Button>
								))}
							</div>
						)}

						{/* Feedback */}
						<AnimatePresence>
							{showResult === 'incorrect' && (
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									transition={{ duration: 0.3 }}
									className="text-red-600 mb-4 text-center"
								>
									<p className="font-bold">
										{showTimeoutMessage ? t('game.notAnswer') : t('game.incorrect')}
									</p>
									<p>
										<Trans
											i18nKey="game.correctAnswer"
											values={{ answer: currentCharacter.romaji }}
											components={{ strong: <strong /> }}
										/>
									</p>


								</motion.div>
							)}
						</AnimatePresence>


						{showHint && (
							<div className="text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200 text-center mb-4">
								<p className="text-sm">
									{t('game.hint.text', {
										type: currentCharacter.type,
										category: currentCharacter.category
											? t('game.hint.category', { category: currentCharacter.category })
											: '',
										letter: currentCharacter.romaji[0]
									})}
								</p>
							</div>
						)}

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md mb-4">
							<Button
								variant="outline"
								size="sm"
								onClick={toggleHint}
								className="flex items-center justify-center"
							>
								<Info className="h-4 w-4 mr-1" />
								{showHint ? t('buttons.hideHint') : t('buttons.showHint')}
							</Button>

							<Button
								variant="outline"
								size="sm"
								onClick={handleSkip}
								className="flex items-center justify-center"
							>
								{t('buttons.skip')}
								<ArrowRight className="h-4 w-4 ml-1" />
							</Button>
						</div>

						{/* New End Game Button */}
						<div className="w-full max-w-md text-center">
							<button
								onClick={() => dispatch({ type: 'SET_GAME_STATUS', payload: 'start' })}
								className="text-sm text-red-500 hover:underline focus:outline-none"
							>
								{t('buttons.endGame')}
							</button>
						</div>

					</CardContent>
				</Card>
			</div>
		</Layout>
	);
};

export default GameScreen;
