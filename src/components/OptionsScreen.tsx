// ✅ Final update for OptionsScreen.tsx with clean layout, i18n, and consistent structure

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGame } from '../context/GameContext';
import Button from './common/Button';
import Card, { CardContent, CardHeader, CardFooter } from './common/Card';
import { ArrowLeft, Settings, Clock, Edit3, ListChecks } from 'lucide-react';
import Layout from './Layout';

const OptionsScreen: React.FC = () => {
	const { state, dispatch } = useGame();
	const { options } = state;
	const { t } = useTranslation();

	return (
		<Layout>
			<div className="flex flex-col items-center px-4">
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-gray-800 mb-2">
						{t('options.title')}
					</h1>
					<p className="text-lg text-gray-600">
						{t('options.description', { type: t(`kana.${options.kanaType}`) })}
					</p>
				</div>

				<Card className="w-full max-w-3xl">
					<CardHeader className="flex items-center justify-between">
						<div className="flex items-center">
							<Settings className="h-5 w-5 text-gray-500 mr-2" />
							<h2 className="text-xl font-bold text-gray-800">
								{t('options.characterOptions')}
							</h2>
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={() => dispatch({ type: 'SET_GAME_STATUS', payload: 'start' })}
							className="flex items-center"
						>
							<ArrowLeft className="h-4 w-4 mr-1" />
							{t('buttons.back')}
						</Button>
					</CardHeader>

					<CardContent className="space-y-6">
						{/* Special Characters */}
						<section>
							<label className="text-base font-medium text-gray-700 block mb-4 text-center">
								{t('options.specialCharacters')}
							</label>
							<div className="space-y-4 max-w-md mx-auto">
								{/* Include Yōon */}
								<div className="flex items-center gap-4 px-4 py-3 rounded-lg">
									<label className="relative inline-flex items-center cursor-pointer">
										<input
											type="checkbox"
											checked={options.includeYoon}
											onChange={(e) =>
												dispatch({ type: 'SET_INCLUDE_YOON', payload: e.target.checked })
											}
											className="sr-only peer"
										/>
										<div className="w-11 h-6 rounded-full peer peer-focus:ring-2 peer-focus:ring-indigo-500 
          dark:bg-gray-400 peer-checked:bg-indigo-500 
          after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300
          after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white">
										</div>
									</label>
									<span className="text-sm text-gray-800 font-medium">
										{t('options.includeYoon')}
									</span>
								</div>

								{/* Include Dakuten & Handakuten */}
								<div className="flex items-center gap-4 px-4 py-3 rounded-lg">
									<label className="relative inline-flex items-center cursor-pointer">
										<input
											type="checkbox"
											checked={options.includeDakutenHandakuten}
											onChange={(e) =>
												dispatch({ type: 'SET_INCLUDE_DAKUTEN_HANDAKUTEN', payload: e.target.checked })
											}
											className="sr-only peer"
										/>
										<div className="w-11 h-6 rounded-full peer peer-focus:ring-2 peer-focus:ring-indigo-500 
          dark:bg-gray-400 peer-checked:bg-indigo-500 
          after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300
          after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white">
										</div>
									</label>
									<span className="text-sm text-gray-800 font-medium">
										{t('options.includeDakuten')}
									</span>
								</div>
							</div>
						</section>


						{/* Character count */}
						<section className="text-center">
							<label className="text-base font-medium text-gray-700 block mb-4">
								{t('options.characterCount')}
							</label>
							<div className="inline-flex flex-wrap justify-center gap-3">
								{[5, 10, 20, 30, 50].map((count) => (
									<button
										key={count}
										className={`rounded-full px-5 py-2 text-base font-medium transition 
          ${options.characterCount === count
												? 'bg-indigo-500 text-white shadow'
												: 'bg-gray-100 text-gray-800 hover:bg-white'}`}
										onClick={() => dispatch({ type: 'SET_CHARACTER_COUNT', payload: count })}
									>
										{count}
									</button>
								))}
							</div>
						</section>


						{/* Timer settings */}
						<section>
							<label className="text-base font-medium text-gray-700 block mb-4 text-center">
								{t('options.timerOptions')}
							</label>
							<div className="space-y-4 max-w-md mx-auto">
								{/* Toggle game session timer */}
								<div className="flex items-center gap-4 px-4 py-3 rounded-lg">
									<label className="relative inline-flex items-center cursor-pointer">
										<input
											type="checkbox"
											checked={options.useTimer}
											onChange={(e) => dispatch({ type: 'SET_USE_TIMER', payload: e.target.checked })}
											className="sr-only peer"
										/>
										<div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-indigo-500 
          after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white 
          after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full">
										</div>
									</label>
									<span className="text-sm text-gray-800 font-medium">
										{t('options.enableTimerSession')}
									</span>
								</div>

								{/* Timer duration */}
								{options.useTimer && (
									<div className="text-center">
										<p className="text-sm text-gray-700 font-medium mb-2">
											{t('options.timerDuration')}
										</p>
										<div className="inline-flex flex-wrap justify-center gap-2">
											{[15, 30, 60, 120, 180, 240, 300, 600].map((sec) => (
												<button
													key={sec}
													className={`rounded-full px-5 py-2 text-sm font-medium transition 
                ${options.timerDuration === sec
															? 'bg-indigo-500 text-white shadow'
															: 'bg-gray-100 text-gray-800 hover:bg-white'}`}
													onClick={() => dispatch({ type: 'SET_TIMER_DURATION', payload: sec })}
												>
													{sec >= 60
														? `${Math.floor(sec / 60)}m${sec % 60 > 0 ? ` ${sec % 60}s` : ''}`
														: `${sec}s`}
												</button>
											))}
										</div>
									</div>
								)}
							</div>
						</section>


						{/* Answer Mode */}
						<section className="text-center">
							<label className="text-base font-medium text-gray-700 block mb-4">
								{t('options.answerMode')}
							</label>
							<div className="inline-flex bg-gray-200 rounded-full p-1">
								<button
									className={`
        flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full transition-all duration-200
        ${options.answerMode === 'typing'
											? 'bg-indigo-500 text-white shadow-md'
											: 'text-gray-700'}
      `}
									onClick={() => dispatch({ type: 'SET_ANSWER_MODE', payload: 'typing' })}
								>
									<Edit3 className="h-4 w-4" />
									{t('options.typing')}
								</button>
								<button
									className={`
        flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full transition-all duration-200
        ${options.answerMode === 'multiple-choice'
											? 'bg-indigo-500 text-white shadow-md'
											: 'text-gray-700'}
      `}
									onClick={() => dispatch({ type: 'SET_ANSWER_MODE', payload: 'multiple-choice' })}
								>
									<ListChecks className="h-4 w-4" />
									{t('options.multipleChoice')}
								</button>
							</div>
						</section>


					</CardContent>

					<CardFooter className="flex justify-end">
						<Button onClick={() => dispatch({ type: 'SET_GAME_STATUS', payload: 'character-selection' })}>
							{t('buttons.continue')}
						</Button>
					</CardFooter>
				</Card>
			</div>
		</Layout>
	);
};

export default OptionsScreen;