"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Sparkles, Trophy, ArrowRight } from 'lucide-react';
import { Level1MathAdventure } from '../games/Level1MathAdventure';
import { Level2ReadingRocket } from '../games/Level2ReadingRocket';
import { Level3WritingWizard } from '../games/Level3WritingWizard';
import { Level4FeelingFriends } from '../games/Level4FeelingFriends';
import { Level5SuperEars } from '../games/Level5SuperEars';
import { Level6EagleEyes } from '../games/Level6EagleEyes';
import { useTranslation } from "@/hooks/useTranslation";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

interface AssessmentPlatformProps {
  onExit?: () => void;
}

type LevelId = 1 | 2 | 3 | 4 | 5 | 6;

interface Level {
  id: LevelId;
  name: string;
  theme: string;
  icon: string;
  color: string;
  totalGames: number;
  completed: boolean;
  unlocked: boolean;
}

export function AssessmentPlatform({ onExit }: AssessmentPlatformProps) {
  const { t } = useTranslation();
  const [currentLevel, setCurrentLevel] = useState<LevelId | null>(null);
  const [currentGame, setCurrentGame] = useState<number>(0);
  const [stars, setStars] = useState<number>(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [completedLevels, setCompletedLevels] = useState<LevelId[]>([]);

  const levels: Level[] = [
    {
      id: 1,
      name: t('ap_math_adv'),
      theme: t('ap_math_theme'),
      icon: '🌳',
      color: 'from-green-400 to-emerald-500',
      totalGames: 6,
      completed: false,
      unlocked: true,
    },
    {
      id: 2,
      name: t('ap_read_rock'),
      theme: t('ap_read_theme'),
      icon: '🚀',
      color: 'from-blue-400 to-indigo-500',
      totalGames: 2,
      completed: false,
      unlocked: true,
    },
    {
      id: 3,
      name: t('ap_writ_wiz'),
      theme: t('ap_writ_theme'),
      icon: '✨',
      color: 'from-purple-400 to-pink-500',
      totalGames: 1,
      completed: false,
      unlocked: true,
    },
    {
      id: 4,
      name: t('ap_feel_fri'),
      theme: t('ap_feel_theme'),
      icon: '😊',
      color: 'from-yellow-400 to-orange-500',
      totalGames: 4,
      completed: false,
      unlocked: true,
    },
    {
      id: 5,
      name: t('ap_sup_ears'),
      theme: t('ap_sup_theme'),
      icon: '🔊',
      color: 'from-cyan-400 to-teal-500',
      totalGames: 3,
      completed: false,
      unlocked: true,
    },
    {
      id: 6,
      name: t('ap_eag_eyes'),
      theme: t('ap_eag_theme'),
      icon: '👀',
      color: 'from-rose-400 to-red-500',
      totalGames: 4,
      completed: false,
      unlocked: true,
    },
  ];

  const celebrateLevelComplete = () => {
    setShowCelebration(true);
    setStars(stars + 1);
    if (currentLevel) {
      setCompletedLevels([...completedLevels, currentLevel]);
    }
    setTimeout(() => {
      setShowCelebration(false);
      setCurrentLevel(null);
      setCurrentGame(0);
    }, 3000);
  };

  if (showCelebration) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-pink-300 to-purple-400 flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="inline-block mb-6"
          >
            <Trophy className="w-32 h-32 text-yellow-400" />
          </motion.div>
          <h1 className="text-6xl font-black text-white mb-4">
            {t('ap_amazing_work')}
          </h1>
          <div className="flex gap-2 justify-center">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Star className="w-12 h-12 fill-yellow-300 text-yellow-400" />
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Floating sparkles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: '100vh', x: Math.random() * window.innerWidth, opacity: 1 }}
            animate={{ y: '-100vh', opacity: 0 }}
            transition={{ duration: 3, delay: Math.random() * 2, repeat: Infinity }}
            className="absolute"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
        ))}
      </div>
    );
  }

  if (!currentLevel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-8">
        {/* Header with mascot */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block text-8xl mb-4"
            >
              🦉
            </motion.div>
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
              {t('ap_welcome')}
            </h1>
            <p className="text-2xl text-purple-600">
              {t('ap_choose_level')}
            </p>
          </div>

          {/* Stars collected */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <div className="bg-white rounded-full px-6 py-3 shadow-lg flex items-center gap-2">
              <Star className="w-6 h-6 fill-yellow-400 text-yellow-500" />
              <span className="text-2xl font-bold text-purple-600">{stars} {t('ap_stars')}</span>
            </div>
            <LanguageSwitcher />
          </div>

          {/* Level path */}
          <div className="relative">
            {/* Connecting path */}
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
              <path
                d="M 150 100 Q 300 150, 450 100 T 750 100 Q 900 150, 1050 100"
                stroke="#E0BBE4"
                strokeWidth="8"
                fill="none"
                strokeDasharray="10 5"
              />
            </svg>

            <div className="grid grid-cols-3 gap-8 relative" style={{ zIndex: 1 }}>
              {levels.map((level, index) => (
                <motion.div
                  key={level.id}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: index * 0.1, type: 'spring' }}
                  whileHover={{ scale: level.unlocked ? 1.1 : 1 }}
                  whileTap={{ scale: level.unlocked ? 0.95 : 1 }}
                  className={`cursor-pointer ${!level.unlocked && 'opacity-50 cursor-not-allowed'}`}
                  onClick={() => level.unlocked && setCurrentLevel(level.id)}
                >
                  <div className={`bg-gradient-to-br ${level.color} rounded-3xl p-8 shadow-2xl relative overflow-hidden`}>
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-4 right-4 text-6xl">✨</div>
                      <div className="absolute bottom-4 left-4 text-4xl">⭐</div>
                    </div>

                    <div className="relative text-center">
                      <div className="text-7xl mb-4">{level.icon}</div>
                      <h3 className="text-3xl font-black text-white mb-2">
                        {t('ap_level')}{level.id}
                      </h3>
                      <h4 className="text-xl font-bold text-white/90 mb-1">
                        {level.name}
                      </h4>
                      <p className="text-white/80 text-sm mb-4">{level.theme}</p>
                      
                      <div className="bg-white/30 rounded-full px-4 py-2 inline-block">
                        <span className="text-white font-bold">
                          {level.totalGames}{t('ap_games_count')}
                        </span>
                      </div>

                      {level.completed && (
                        <div className="absolute top-2 right-2">
                          <Star className="w-8 h-8 fill-yellow-300 text-yellow-400" />
                        </div>
                      )}

                      {!level.unlocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-3xl">
                          <div className="text-6xl">🔒</div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mascot encouragement */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-12 text-center"
          >
            <div className="bg-white rounded-3xl shadow-xl p-6 inline-block">
              <p className="text-2xl text-purple-600">
                <span className="text-3xl mr-2">🦉</span>
                {t('ap_mascot_msg')}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Level is selected - render game content
  const selectedLevel = levels.find(l => l.id === currentLevel)!;
  
  const renderLevelContent = () => {
    switch (currentLevel) {
      case 1:
        return (
          <Level1MathAdventure
            onComplete={celebrateLevelComplete}
            onProgress={(gameIndex) => setCurrentGame(gameIndex)}
          />
        );
      case 2:
        return (
          <Level2ReadingRocket
            onComplete={celebrateLevelComplete}
            onProgress={(gameIndex) => setCurrentGame(gameIndex)}
          />
        );
      case 3:
        return (
          <Level3WritingWizard
            onComplete={celebrateLevelComplete}
            onProgress={(gameIndex) => setCurrentGame(gameIndex)}
          />
        );
      case 4:
        return (
          <Level4FeelingFriends
            onComplete={celebrateLevelComplete}
            onProgress={(gameIndex) => setCurrentGame(gameIndex)}
          />
        );
      case 5:
        return (
          <Level5SuperEars
            onComplete={celebrateLevelComplete}
            onProgress={(gameIndex) => setCurrentGame(gameIndex)}
          />
        );
      case 6:
        return (
          <Level6EagleEyes
            onComplete={celebrateLevelComplete}
            onProgress={(gameIndex) => setCurrentGame(gameIndex)}
          />
        );
      default:
        return (
          <div className="text-center">
            <h2 className="text-4xl font-black text-purple-600 mb-4">
              {selectedLevel.name}
            </h2>
            <p className="text-2xl text-gray-600 mb-8">{t('ap_coming_soon')}</p>
            <button
              onClick={() => {
                setCurrentLevel(null);
                setCurrentGame(0);
              }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl font-bold px-12 py-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              {t('ap_back_levels')}
            </button>
          </div>
        );
    }
  };
  
  return (
    <div className={`min-h-screen bg-gradient-to-br ${selectedLevel.color} p-8`}>
      <div className="max-w-4xl mx-auto">
        {/* Progress bar */}
        <div className="bg-white rounded-full p-2 shadow-lg mb-8">
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(currentGame / selectedLevel.totalGames) * 100}%` }}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full rounded-full"
              />
            </div>
            <span className="text-lg font-bold text-purple-600 min-w-[80px]">
              {currentGame}/{selectedLevel.totalGames}
            </span>
            <button
              onClick={() => {
                setCurrentLevel(null);
                setCurrentGame(0);
              }}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              {t('ap_exit')}
            </button>
          </div>
        </div>

        {/* Game content */}
        <div className="bg-white rounded-3xl shadow-2xl p-12">
          {renderLevelContent()}
        </div>
      </div>
    </div>
  );
}