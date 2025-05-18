import { useTranslation } from 'react-i18next';
import React from 'react';
import { KanaType } from '../types';
import { useGame } from '../context/GameContext';
import Button from './common/Button';
import Card, { CardContent, CardHeader, CardFooter } from './common/Card';
import { Cherry, Moon, Castle } from 'lucide-react';
import Layout from './Layout';


const StartScreen: React.FC = () => {
	const { dispatch } = useGame();
	const { t } = useTranslation();

	const handleKanaTypeSelect = (type: KanaType) => {
		dispatch({ type: 'SET_KANA_TYPE', payload: type });
		dispatch({ type: 'SET_GAME_STATUS', payload: 'options' });
	};

	return (
		<Layout>
			<div className="flex flex-col items-center">
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-gray-800 mb-2">
						{t('app.title')}
					</h1>
					<p className="text-lg text-gray-600 max-w-xl">
						{t('app.description')}
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
					{/* Hiragana Card */}
					<Card className="transform transition-all duration-300 hover:scale-105">
						<CardHeader className="bg-indigo-50">
							<div className="flex items-center justify-center h-16">
								<Cherry className="h-10 w-10 text-indigo-600" />
							</div>
						</CardHeader>
						<CardContent>
							<h2 className="text-xl font-bold text-gray-800 text-center mb-2">
								{t('kana.hiragana')}
							</h2>
							<p className="text-gray-600 text-center mb-4">
								{t('kana.hiraganaDesc')}
							</p>
						</CardContent>
						<CardFooter className="flex justify-center">
							<Button
								onClick={() => handleKanaTypeSelect('hiragana')}
								variant="primary"
								fullWidth
							>
								{t('buttons.practice', { type: t('kana.hiragana') })}
							</Button>
						</CardFooter>
					</Card>

					{/* Katakana Card */}
					<Card className="transform transition-all duration-300 hover:scale-105">
						<CardHeader className="bg-pink-50">
							<div className="flex items-center justify-center h-16">
								<Moon className="h-10 w-10 text-pink-700" />
							</div>
						</CardHeader>
						<CardContent>
							<h2 className="text-xl font-bold text-gray-800 text-center mb-2">
								{t('kana.katakana')}
							</h2>
							<p className="text-gray-600 text-center mb-4">
								{t('kana.katakanaDesc')}
							</p>
						</CardContent>
						<CardFooter className="flex justify-center">
							<Button
								onClick={() => handleKanaTypeSelect('katakana')}
								variant="secondary"
								fullWidth
							>
								{t('buttons.practice', { type: t('kana.katakana') })}
							</Button>
						</CardFooter>
					</Card>

					{/* Combined Card */}
					<Card className="transform transition-all duration-300 hover:scale-105">
						<CardHeader className="bg-gradient-to-r from-indigo-50 to-pink-50">
							<div className="flex items-center justify-center h-16">
								<Castle className="h-10 w-10 text-gray-700" />
							</div>
						</CardHeader>
						<CardContent>
							<h2 className="text-xl font-bold text-gray-800 text-center mb-2">
								{t('kana.both')}
							</h2>
							<p className="text-gray-600 text-center mb-4">
								{t('kana.bothDesc')}
							</p>
						</CardContent>
						<CardFooter className="flex justify-center">
							<Button
								onClick={() => handleKanaTypeSelect('both')}
								variant="outline"
								fullWidth
							>
								{t('buttons.practiceBoth')}
							</Button>
						</CardFooter>
					</Card>
				</div>
			</div>
		</Layout>
	);
};

export default StartScreen;
