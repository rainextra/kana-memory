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
			<div className="flex flex-col items-center">
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-gray-800 mb-2">
						{t('options.title')}
					</h1>
					<p className="text-lg text-gray-600">
						{t('options.description', { type: t(`kana.${options.kanaType}`) })}
					</p>
				</div>

				<Card className="w-full max-w-2xl">
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

					<CardContent>
						<div className="space-y-6">

							{/* Special Characters */}
							<div className="space-y-3">
								<label className="text-lg font-medium text-gray-700 block">
									{t('options.specialCharacters')}
								</label>
								<div className="flex flex-col sm:flex-row gap-3">
									<div className="flex items-center">
										<input
											type="checkbox"
											id="includeYoon"
											className="h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
											checked={options.includeYoon}
											onChange={(e) => dispatch({ type: 'SET_INCLUDE_YOON', payload: e.target.checked })}
										/>
										<label htmlFor="includeYoon" className="ml-2 text-base text-gray-700">
											{t('options.includeYoon')}
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
											{t('options.includeDakuten')}
										</label>
									</div>
								</div>
							</div>

							{/* Character Count */}
							<div className="space-y-3">
								<label className="text-lg font-medium text-gray-700 block">
									{t('options.characterCount')}
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

							{/* Timer Options */}
							<div className="space-y-3">
								<label className="text-lg font-medium text-gray-700 flex items-center">
									<Clock className="h-5 w-5 mr-2" />
									{t('options.timerOptions')}
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
										{t('options.enableTimer')}
									</label>
								</div>

								{options.useTimer && (
									<div className="pl-7 space-y-2">
										<label className="text-sm font-medium text-gray-700 block">
											{t('options.timerDuration')}
										</label>
										<div className="flex flex-wrap gap-2">
											{[60, 120, 180, 300].map((seconds) => (
												<Button
													key={seconds}
													variant={options.timerDuration === seconds ? 'primary' : 'outline'}
													size="sm"
													onClick={() => dispatch({ type: 'SET_TIMER_DURATION', payload: seconds })}
												>
													{t('options.minutes', { count: seconds / 60 })}
												</Button>
											))}
										</div>
									</div>
								)}
							</div>

							{/* Answer Mode */}
							<div className="space-y-3">
								<label className="text-lg font-medium text-gray-700 block">
									{t('options.answerMode')}
								</label>
								<div className="flex gap-2">
									<Button
										variant={options.answerMode === 'typing' ? 'primary' : 'outline'}
										size="sm"
										onClick={() => dispatch({ type: 'SET_ANSWER_MODE', payload: 'typing' })}
									>
										<Edit3 className="h-4 w-4 mr-1" />
										{t('options.typing')}
									</Button>
									<Button
										variant={options.answerMode === 'multiple-choice' ? 'primary' : 'outline'}
										size="sm"
										onClick={() => dispatch({ type: 'SET_ANSWER_MODE', payload: 'multiple-choice' })}
									>
										<ListChecks className="h-4 w-4 mr-1" />
										{t('options.multipleChoice')}
									</Button>
								</div>
							</div>
						</div>
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
