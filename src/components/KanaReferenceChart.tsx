import React, { useState } from 'react';
import {
	basicHiragana,
	basicKatakana,
	dakutenHandakutenHiragana,
	dakutenHandakutenKatakana,
	yoonHiragana,
	yoonKatakana,
} from '../data/kanaData';
import Button from './common/Button';
import Card, { CardContent, CardHeader } from './common/Card';
import { BookOpen, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface KanaReferenceChartProps {
	isOpen: boolean;
	onClose: () => void;
}


const KanaReferenceChart: React.FC<KanaReferenceChartProps> = ({
	isOpen,
	onClose,
}) => {
	const [activeTab, setActiveTab] = useState<'hiragana' | 'katakana'>('hiragana');
	const { t } = useTranslation();

	if (!isOpen) return null;

	// Define the grid structure
	const vowels = ['a', 'i', 'u', 'e', 'o'];
	const consonants = ['', 'k', 's', 't', 'n', 'h', 'm', 'y', 'r', 'w', 'n'];

	// Helper function to find kana by romaji prefix and vowel
	const findKana = (kanaSet: typeof basicKatakana, prefix: string, vowel: string) => {
		if (prefix === '' && vowel === 'n') {
			return kanaSet.find((k) => k.romaji === 'n');
		}

		// Special cases for irregular readings
		if (prefix === 's' && vowel === 'i') return kanaSet.find((k) => k.romaji === 'shi');
		if (prefix === 't' && vowel === 'i') return kanaSet.find((k) => k.romaji === 'chi');
		if (prefix === 't' && vowel === 'u') return kanaSet.find((k) => k.romaji === 'tsu');
		if (prefix === 'h' && vowel === 'u') return kanaSet.find((k) => k.romaji === 'fu');
		if (prefix === 'w' && vowel === 'o') return kanaSet.find((k) => k.romaji === 'wo');

		// Handle ya, yu, yo row
		if (prefix === 'y') {
			if (vowel === 'a' || vowel === 'u' || vowel === 'o') {
				return kanaSet.find((k) => k.romaji === `${prefix}${vowel}`);
			}
			return null;
		}

		// Handle wa row
		if (prefix === 'w') {
			if (vowel === 'a') {
				return kanaSet.find((k) => k.romaji === 'wa');
			}
			return null;
		}

		return kanaSet.find((k) => k.romaji === `${prefix}${vowel}`);
	};

	const renderKanaGrid = (kanaSet: typeof basicKatakana) => (
		<div className="grid grid-cols-5 gap-2 w-full">
			{consonants.map((consonant) => (
				vowels.map((vowel) => {
					const kana = findKana(kanaSet, consonant, vowel);
					if (!kana && ((consonant === 'y' && vowel !== 'a' && vowel !== 'u' && vowel !== 'o') ||
						(consonant === 'w' && vowel !== 'a' && vowel !== 'o'))) {
						return <div key={`${consonant}${vowel}`} className="h-16 md:h-20" />;
					}

					if (!kana) return null;

					return (
						<div
							key={`${consonant}${vowel}`}
							className={`
                flex flex-col items-center justify-center p-2 md:p-4
                border rounded-lg bg-white shadow-sm
                transition-all duration-200
                ${activeTab === 'hiragana'
									? 'hover:border-indigo-200 hover:shadow-md'
									: 'hover:border-pink-200 hover:shadow-md'}
              `}
						>
							<span
								className={`text-2xl md:text-3xl font-medium mb-1
                  ${activeTab === 'hiragana' ? 'text-indigo-600' : 'text-pink-700'}`}
							>
								{kana.kana}
							</span>
							<span className="text-xs md:text-sm text-gray-600">
								{kana.romaji}
							</span>
						</div>
					);
				})
			))}
		</div>
	);

	const renderDakutenGrid = (kanaSet: typeof basicKatakana) => {
		const consonantGroups = ['g', 'z', 'd', 'b', 'p'];
		const vowels = ['a', 'i', 'u', 'e', 'o'];

		const getChar = (prefix: string, vowel: string) => kanaSet.find(
			(k) => k.romaji === `${prefix}${vowel}`
		);

		return (
			<div className="space-y-2">
				{consonantGroups.map((group) => {
					const rowChars = vowels.map(v => getChar(group, v));
					if (rowChars.every(c => !c)) return null;

					return (
						<div key={group} className="grid grid-cols-5 gap-2">
							{rowChars.map((char, i) =>
								char ? (
									<div
										key={char.kana}
										className={`flex flex-col items-center justify-center p-3 border rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-200
									${activeTab === 'hiragana' ? 'hover:border-indigo-200' : 'hover:border-pink-200'}
								`}>
										<span className={`text-2xl md:text-3xl font-medium mb-1 ${activeTab === 'hiragana' ? 'text-indigo-600' : 'text-pink-700'}`}>
											{char.kana}
										</span>
										<span className="text-xs md:text-sm text-gray-600">
											{char.romaji}
										</span>
									</div>
								) : (
									<div key={`${group}${vowels[i]}`} className="h-16" />
								)
							)}
						</div>
					);
				})}
			</div>
		);
	};


	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
			<div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
				<div className="p-4 border-b border-gray-200 flex justify-between items-center">
					<div className="flex items-center">
						<BookOpen className="h-5 w-5 text-indigo-600 mr-2" />
						<h2 className="text-xl font-bold text-gray-800">
							{t('kana.referenceChart')}
						</h2>
					</div>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700 focus:outline-none"
						aria-label={t('buttons.close')}
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				<div className="border-b border-gray-200">
					<div className="flex">
						<button
							className={`px-4 py-2 font-medium text-sm flex-1 ${activeTab === 'hiragana'
								? 'border-b-2 border-indigo-600 text-indigo-600'
								: 'text-gray-500 hover:text-gray-700'
								}`}
							onClick={() => setActiveTab('hiragana')}
						>
							{t('kana.hiragana')}
						</button>
						<button
							className={`px-4 py-2 font-medium text-sm flex-1 ${activeTab === 'katakana'
								? 'border-b-2 border-pink-600 text-pink-700'
								: 'text-gray-500 hover:text-gray-700'
								}`}
							onClick={() => setActiveTab('katakana')}
						>
							{t('kana.katakana')}
						</button>
					</div>
				</div>

				<div className="overflow-y-auto p-6">
					<div className="space-y-8">
						<div>
							<h3 className="text-lg font-medium text-gray-800 mb-4">
								{t('kana.basic')}
							</h3>
							{renderKanaGrid(
								activeTab === 'hiragana' ? basicHiragana : basicKatakana
							)}
						</div>

						<div>
							<h3 className="text-lg font-medium text-gray-800 mb-4">
								{t('kana.dakutenHandakuten')}
							</h3>
							{renderDakutenGrid(
								activeTab === 'hiragana'
									? dakutenHandakutenHiragana
									: dakutenHandakutenKatakana
							)}

						</div>

						<div>
							<h3 className="text-lg font-medium text-gray-800 mb-4">
								{t('kana.yoon')}
							</h3>
							<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
								{(activeTab === 'hiragana' ? yoonHiragana : yoonKatakana).map(
									(char) => (
										<div
											key={char.kana}
											className={`
														flex flex-col items-center justify-center p-3
														border rounded-lg bg-white shadow-sm hover:shadow-md
														transition-all duration-200
														${activeTab === 'hiragana'
														? 'hover:border-indigo-200'
														: 'hover:border-pink-200'
														}
											`}
											>
											<span
												className={`text-2xl md:text-3xl font-medium mb-1 ${activeTab === 'hiragana'
													? 'text-indigo-600'
													: 'text-pink-700'
													}`}
											>
												{char.kana}
											</span>
											<span className="text-xs md:text-sm text-gray-600">
												{char.romaji}
											</span>
										</div>
									)
								)}
							</div>
						</div>
					</div>
				</div>

				<div className="border-t border-gray-200 p-4 flex justify-end">
					<Button onClick={onClose}>{t('buttons.close')}</Button>
				</div>
			</div>
		</div>
	);
};

export default KanaReferenceChart;