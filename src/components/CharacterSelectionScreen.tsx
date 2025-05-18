import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGame } from '../context/GameContext';
import Button from './common/Button';
import Card, { CardContent, CardHeader, CardFooter } from './common/Card';
import { ArrowLeft, CheckCircle2, Circle, Play, ListFilter, Shuffle } from 'lucide-react';
import { getKanaByType } from '../data/kanaData';
import { KanaCharacter } from '../types';
import { getCharacterColor, getKanaTypeName } from '../utils';
import Layout from './Layout';

const CharacterSelectionScreen: React.FC = () => {
	const { state, dispatch } = useGame();
	const { options } = state;
	const { t } = useTranslation();
	const [selectionMode, setSelectionMode] = useState<'random' | 'manual'>('random');
	const [selectedCharacters, setSelectedCharacters] = useState<KanaCharacter[]>([]);

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
			dispatch({ type: 'START_GAME', payload: { selectedCharacters } });
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

	const vowels = ['a', 'i', 'u', 'e', 'o'];
	const consonants = ['', 'k', 's', 't', 'n', 'h', 'm', 'y', 'r', 'w', 'n'];

	const findKana = (set: KanaCharacter[], prefix: string, vowel: string): KanaCharacter | null => {
		if (prefix === '' && vowel === 'n') return set.find(k => k.romaji === 'n') || null;
		if (prefix === 's' && vowel === 'i') return set.find(k => k.romaji === 'shi') || null;
		if (prefix === 't' && vowel === 'i') return set.find(k => k.romaji === 'chi') || null;
		if (prefix === 't' && vowel === 'u') return set.find(k => k.romaji === 'tsu') || null;
		if (prefix === 'h' && vowel === 'u') return set.find(k => k.romaji === 'fu') || null;
		if (prefix === 'w' && vowel === 'o') return set.find(k => k.romaji === 'wo') || null;
		if (prefix === 'y' && !['a', 'u', 'o'].includes(vowel)) return null;
		if (prefix === 'w' && !['a', 'o'].includes(vowel)) return null;
		return set.find(k => k.romaji === `${prefix}${vowel}`) || null;
	};

	const renderCharacterTable = (kanaSet: KanaCharacter[]) => (
		<div className="space-y-2">
			{consonants.map((consonant) => (
				<div key={consonant} className="grid grid-cols-5 gap-2">
					{vowels.map((vowel) => {
						const char = findKana(kanaSet, consonant, vowel);
						if (!char) return <div key={`${consonant}${vowel}`} className="h-16" />;

						const isSelected = selectedCharacters.some(c => c.kana === char.kana);

						return (
							<button
								key={char.kana}
								onClick={() => toggleCharacterSelection(char)}
								className={`
								flex flex-col items-center justify-center p-2 rounded-md border-2 
								transition-all duration-200
								${isSelected
										? 'border-indigo-500 bg-indigo-50'
										: 'border-gray-200 hover:border-gray-300'
									}
							`}
							>
								<span className={`text-xl ${getCharacterColor(char.type)}`}>
									{char.kana}
								</span>
								<span className="text-xs text-gray-500 mt-1">{char.romaji}</span>
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
			))}
		</div>
	);

	const renderAdditionalCharacters = (title: string, characters: KanaCharacter[]) => {
		if (characters.length === 0) return null;

		// Group by consonant prefix: g, z, d, b, p
		const groups = ['g', 'z', 'd', 'b', 'p'];
		const vowels = ['a', 'i', 'u', 'e', 'o'];

		const getChar = (prefix: string, vowel: string) =>
			characters.find(c => c.romaji === `${prefix}${vowel}`);

		return (
			<div>
				<h3 className="text-md font-medium text-gray-700 mb-2">{title}</h3>
				<div className="space-y-2">
					{groups.map((group) => {
						const rowChars = vowels.map(v => getChar(group, v));
						// Jika semua null, skip baris
						if (rowChars.every(c => !c)) return null;

						return (
							<div key={group} className="grid grid-cols-5 gap-2">
								{rowChars.map((char, i) => {
									if (!char) return <div key={`${group}${vowels[i]}`} className="h-16" />;

									const isSelected = selectedCharacters.some(c => c.kana === char.kana);

									return (
										<button
											key={char.kana}
											onClick={() => toggleCharacterSelection(char)}
											className={`
											flex flex-col items-center justify-center p-2 rounded-md border-2 
											transition-all duration-200
											${isSelected
													? 'border-indigo-500 bg-indigo-50'
													: 'border-gray-200 hover:border-gray-300'
												}
										`}
										>
											<span className={`text-xl ${getCharacterColor(char.type)}`}>
												{char.kana}
											</span>
											<span className="text-xs text-gray-500 mt-1">{char.romaji}</span>
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
					})}
				</div>
			</div>
		);
	};

	const renderYoonCharacters = (characters: KanaCharacter[]) => {
		if (characters.length === 0) return null;

		const groups = [
			'ky', 'sh', 'ch', 'ny', 'hy',
			'my', 'ry', 'gy', 'j', 'by', 'py'
		];
		const vowels = ['a', 'u', 'o'];

		const getChar = (prefix: string, vowel: string) => {
			if (prefix === 'j') return characters.find(c => c.romaji === `j${vowel}`);
			return characters.find(c => c.romaji === `${prefix}${vowel}`);
		};

		return (
			<div>
				<h3 className="text-md font-medium text-gray-700 mb-2">Yōon Characters</h3>
				<div className="space-y-2">
					{groups.map((group) => {
						const rowChars = vowels.map(v => getChar(group, v));
						if (rowChars.every(c => !c)) return null;

						return (
							<div key={group} className="grid grid-cols-3 gap-2">
								{rowChars.map((char, i) => {
									if (!char) return <div key={`${group}${vowels[i]}`} className="h-16" />;
									const isSelected = selectedCharacters.some(c => c.kana === char.kana);
									return (
										<button
											key={char.kana}
											onClick={() => toggleCharacterSelection(char)}
											className={`
											flex flex-col items-center justify-center p-2 rounded-md border-2 
											transition-all duration-200
											${isSelected
													? 'border-indigo-500 bg-indigo-50'
													: 'border-gray-200 hover:border-gray-300'
												}
										`}
										>
											<span className={`text-xl ${getCharacterColor(char.type)}`}>
												{char.kana}
											</span>
											<span className="text-xs text-gray-500 mt-1">{char.romaji}</span>
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
					})}
				</div>
			</div>
		);
	};




	return (
		<Layout>
			<div className="flex flex-col items-center">
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-gray-800 mb-2">
						{t('selection.title')}
					</h1>
					<p className="text-lg text-gray-600">
						{t('selection.subtitle', { type: getKanaTypeName(options.kanaType) })}
					</p>
				</div>

				<Card className="w-full max-w-4xl">
					<CardHeader className="flex items-center justify-between">
						<div className="flex items-center">
							<ListFilter className="h-5 w-5 text-gray-500 mr-2" />
							<h2 className="text-xl font-bold text-gray-800">{t('selection.title')}</h2>
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={() => dispatch({ type: 'SET_GAME_STATUS', payload: 'options' })}
							className="flex items-center"
						>
							<ArrowLeft className="h-4 w-4 mr-1" />
							{t('buttons.back')}
						</Button>
					</CardHeader>

					<CardContent>
						<div className="space-y-6">
							<section className="text-center w-full">
								<label className="text-base font-medium text-gray-700 block mb-4">
									{t('selection.mode.label')}
								</label>
								<div className="inline-flex w-full rounded-full p-1 bg-gray-200 shadow-inner">
									<button
										className={`flex-1 px-5 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${selectionMode === 'random'
											? 'bg-indigo-500 text-white shadow'
											: 'text-gray-700 hover:bg-white'
											}`}
										onClick={() => setSelectionMode('random')}
									>
										{t('selection.mode.random')}
									</button>
									<button
										className={`flex-1 px-5 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${selectionMode === 'manual'
											? 'bg-indigo-500 text-white shadow'
											: 'text-gray-700 hover:bg-white'
											}`}
										onClick={() => setSelectionMode('manual')}
									>
										{t('selection.mode.manual')}
									</button>
								</div>
							</section>

							{selectionMode === 'random' ? (
								<div className="space-y-4">
									<p className="text-gray-700">
										{t('selection.randomDesc', { count: options.characterCount })}
									</p>
									<div className="border rounded-md p-3 space-y-2">
										<div className="font-medium text-gray-700">{t('selection.currentOptions')}</div>
										<div className="text-sm text-gray-600">
											<div>• {t('selection.type', { type: getKanaTypeName(options.kanaType) })}</div>
											<div>• {t('selection.yoon', { value: t(options.includeYoon ? 'buttons.check' : 'buttons.skip') })}</div>
											<div>• {t('selection.dakuten', { value: t(options.includeDakutenHandakuten ? 'buttons.check' : 'buttons.skip') })}</div>
											<div>• {t('selection.available', { count: availableCharacters.length })}</div>
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

									<div className="space-y-6">
										<div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">

											{/* Timer toggle as switch */}
											<div className="flex-1">
												<label className="text-sm font-medium text-gray-700 block mb-2">
													{t('options.characterTimerLabel')}
												</label>
												<label className="flex items-center cursor-pointer space-x-3">
													<div className="relative">
														<input
															type="checkbox"
															className="sr-only"
															checked={options.characterTimer}
															onChange={(e) =>
																dispatch({ type: 'SET_CHARACTER_TIMER', payload: e.target.checked })
															}
														/>
														<div
															className={`w-10 h-6 rounded-full transition-colors duration-300 ${options.characterTimer ? 'bg-indigo-500' : 'bg-gray-300'
																}`}
														></div>
														<div
															className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${options.characterTimer ? 'translate-x-4' : ''
																}`}
														></div>
													</div>
													<span className="text-sm text-gray-700">
														{t('options.enableCharacterTimer')}
													</span>
												</label>
											</div>


											{/* Timer options */}
											{options.characterTimer && (
												<div className="flex-1 w-full">
													<label className="text-sm font-medium text-gray-700 block mb-2">
														Time per Character (seconds)
													</label>
													<div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
														{[5, 10, 15, 20, 25, 30].map((seconds) => {
															const isActive = options.characterTimerDuration === seconds;
															return (
																<button
																	key={seconds}
																	className={`w-full py-2 rounded-lg text-sm font-semibold transition-all duration-200
              ${isActive
																			? 'bg-indigo-500 text-white shadow'
																			: 'bg-gray-100 text-gray-800 hover:bg-white'}`}
																	onClick={() =>
																		dispatch({ type: 'SET_CHARACTER_TIMER_DURATION', payload: seconds })
																	}
																>
																	{seconds}s
																</button>
															);
														})}
													</div>
												</div>
											)}

										</div>
									</div>


									<div className="border rounded-md p-4 space-y-4 max-h-96 overflow-y-auto">
										{options.kanaType === 'hiragana' && (
											<>
												{renderCharacterTable(availableCharacters.filter(c => c.category === 'basic'))}

												{options.includeDakutenHandakuten &&
													renderAdditionalCharacters('Dakuten & Handakuten', availableCharacters.filter(c =>
														c.category === 'dakuten' || c.category === 'handakuten'))}

												{options.includeYoon &&
													renderYoonCharacters(availableCharacters.filter(c => c.category === 'yoon'))}
											</>

										)}

										{options.kanaType === 'katakana' && (
											<>
												{renderCharacterTable(availableCharacters.filter(c => c.category === 'basic'))}

												{options.includeDakutenHandakuten &&
													renderAdditionalCharacters('Dakuten & Handakuten', availableCharacters.filter(c =>
														c.category === 'dakuten' || c.category === 'handakuten'))}

												{options.includeYoon &&
													renderYoonCharacters(availableCharacters.filter(c => c.category === 'yoon'))}
											</>

										)}

										{options.kanaType === 'both' && (
											<>
												<div className="border-b pb-4 mb-4">
													<h3 className="text-lg font-medium text-indigo-600 mb-2">Hiragana</h3>
													{renderCharacterTable(
														availableCharacters.filter(c => c.type === 'hiragana' && c.category === 'basic')
													)}
													{options.includeDakutenHandakuten &&
														renderAdditionalCharacters('Dakuten & Handakuten', availableCharacters.filter(c =>
															c.type === 'hiragana' && (c.category === 'dakuten' || c.category === 'handakuten')))}
													{options.includeYoon &&
														renderAdditionalCharacters('Yōon', availableCharacters.filter(c =>
															c.type === 'hiragana' && c.category === 'yoon'))}
												</div>

												<div>
													<h3 className="text-lg font-medium text-pink-700 mb-2">Katakana</h3>
													{renderCharacterTable(
														availableCharacters.filter(c => c.type === 'katakana' && c.category === 'basic')
													)}
													{options.includeDakutenHandakuten &&
														renderAdditionalCharacters('Dakuten & Handakuten', availableCharacters.filter(c =>
															c.type === 'katakana' && (c.category === 'dakuten' || c.category === 'handakuten')))}
													{options.includeYoon &&
														renderAdditionalCharacters('Yōon', availableCharacters.filter(c =>
															c.type === 'katakana' && c.category === 'yoon'))}
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
							{t('buttons.continue')}
						</Button>
					</CardFooter>
				</Card>
			</div>
		</Layout>
	);
};

export default CharacterSelectionScreen;