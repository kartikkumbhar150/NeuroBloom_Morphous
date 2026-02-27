"use client";

import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Star, Sparkles, Trophy } from 'lucide-react';
import { Level1MathAdventure } from '../games/Level1MathAdventure';
import { Level2ReadingRocket } from '../games/Level2ReadingRocket';
import { Level3WritingWizard } from '../games/Level3WritingWizard';
import { Level4FeelingFriends } from '../games/Level4FeelingFriends';
import { Level5SuperEars } from '../games/Level5SuperEars';
import { Level6EagleEyes } from '../games/Level6EagleEyes';
import { StudentData } from './StudentForm';
import { useTranslation } from "@/hooks/useTranslation";

interface ContinuousAssessmentProps {
  studentData: StudentData;
  onComplete: () => void;
}

type LevelId = 1 | 2 | 3 | 4 | 5 | 6;

interface Level {
  id: LevelId;
  name: string;
  theme: string;
  icon: string;
  color: string;
  totalGames: number;
}

export function ContinuousAssessment({ studentData, onComplete }: ContinuousAssessmentProps) {
  const { t } = useTranslation();
  const [currentLevel, setCurrentLevel] = useState<LevelId>(1);
  const [currentGame, setCurrentGame] = useState<number>(0);
  const [showTransition, setShowTransition] = useState(false);
  const [completedLevels, setCompletedLevels] = useState<LevelId[]>([]);

  const levels: Level[] = [
    {
      id: 1,
      name: t('ap_math_adv'),
      theme: t('ap_math_theme'),
      icon: '🌳',
      color: 'from-green-400 to-emerald-500',
      totalGames: 6,
    },
    {
      id: 2,
      name: t('ap_read_rock'),
      theme: t('ap_read_theme'),
      icon: '🚀',
      color: 'from-blue-400 to-indigo-500',
      totalGames: 2,
    },
    {
      id: 3,
      name: t('ap_writ_wiz'),
      theme: t('ap_writ_theme'),
      icon: '✨',
      color: 'from-purple-400 to-pink-500',
      totalGames: 1,
    },
    {
      id: 4,
      name: t('ap_feel_fri'),
      theme: t('ap_feel_theme'),
      icon: '😊',
      color: 'from-yellow-400 to-orange-500',
      totalGames: 4,
    },
    {
      id: 5,
      name: t('ap_sup_ears'),
      theme: t('ap_sup_theme'),
      icon: '🔊',
      color: 'from-cyan-400 to-teal-500',
      totalGames: 3,
    },
    {
      id: 6,
      name: t('ap_eag_eyes'),
      theme: t('ap_eag_theme'),
      icon: '👀',
      color: 'from-rose-400 to-red-500',
      totalGames: 4,
    },
  ];

  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } catch (error) {
        console.log('Fullscreen not supported or denied');
      }
    };
    enterFullscreen();

    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
  }, []);

  const handleLevelComplete = () => {
    setCompletedLevels([...completedLevels, currentLevel]);
    
    if (currentLevel < 6) {
      setShowTransition(true);
      setTimeout(() => {
        setCurrentLevel((currentLevel + 1) as LevelId);
        setCurrentGame(0);
        setShowTransition(false);
      }, 3000);
    } else {
      onComplete();
    }
  };

  const selectedLevel = levels.find(l => l.id === currentLevel)!;
  const totalGames = levels.reduce((sum, level) => sum + level.totalGames, 0);
  const completedGames = levels
    .slice(0, currentLevel - 1)
    .reduce((sum, level) => sum + level.totalGames, 0) + currentGame;
  const overallProgress = (completedGames / totalGames) * 100;

  if (showTransition) {
    const nextLevel = levels.find(l => l.id === currentLevel + 1)!;
    return (
      <div className={`min-h-screen bg-gradient-to-br ${nextLevel.color} flex items-center justify-center overflow-hidden p-4`}>
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="inline-block mb-4"
          >
            <Trophy className="w-20 h-20 text-yellow-400" />
          </motion.div>
          <h1 className="text-4xl font-black text-white mb-2">
            {t('ca_level_complete')}
          </h1>
          <div className="flex gap-1 justify-center mb-6">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Star className="w-8 h-8 fill-yellow-300 text-yellow-400" />
              </motion.div>
            ))}
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 max-w-xs mx-auto">
            <p className="text-lg text-white mb-2">{t('ca_get_ready')}</p>
            <div className="text-6xl mb-2">{nextLevel.icon}</div>
            <h2 className="text-2xl font-black text-white mb-1">{nextLevel.name}</h2>
            <p className="text-md text-white/90">{nextLevel.theme}</p>
          </div>
        </motion.div>
        
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: '100vh', x: Math.random() * 100 + 'vw', opacity: 1 }}
            animate={{ y: '-100vh', opacity: 0 }}
            transition={{ duration: 3, delay: Math.random() * 2, repeat: Infinity }}
            className="absolute"
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>
        ))}
      </div>
    );
  }

  const renderLevelContent = () => {
    switch (currentLevel) {
      case 1: return <Level1MathAdventure onComplete={handleLevelComplete} onProgress={(gameIndex) => setCurrentGame(gameIndex)} />;
      case 2: return <Level2ReadingRocket onComplete={handleLevelComplete} onProgress={(gameIndex) => setCurrentGame(gameIndex)} />;
      case 3: return <Level3WritingWizard onComplete={handleLevelComplete} onProgress={(gameIndex) => setCurrentGame(gameIndex)} />;
      case 4: return <Level4FeelingFriends onComplete={handleLevelComplete} onProgress={(gameIndex) => setCurrentGame(gameIndex)} />;
      case 5: return <Level5SuperEars onComplete={handleLevelComplete} onProgress={(gameIndex) => setCurrentGame(gameIndex)} />;
      case 6: return <Level6EagleEyes onComplete={handleLevelComplete} onProgress={(gameIndex) => setCurrentGame(gameIndex)} />;
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${selectedLevel.color} p-4 md:p-6`}>
      <div className="max-w-4xl mx-auto">
        {/* Top Header - Resized */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black">
                {studentData.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-md font-bold text-gray-800 leading-tight">{studentData.name}</h3>
                <p className="text-xs text-gray-600">{t('ca_age')} {studentData.age} • {t('ca_assessment')}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">{t('ca_level')} {currentLevel} {t('ca_of')} 6</p>
              <p className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                {selectedLevel.name}
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-gray-600">{t('ca_progress')}</span>
              <span className="text-xs font-bold text-purple-600">{Math.round(overallProgress)}%</span>
            </div>
            <div className="bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 h-full rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Current Level Progress - Resized */}
        <div className="bg-white rounded-2xl p-3 shadow-md mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="text-2xl">{selectedLevel.icon}</div>
              <span className="text-sm font-bold text-gray-700 whitespace-nowrap">
                {t('ca_game')} {currentGame + 1}/{selectedLevel.totalGames}
              </span>
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentGame) / selectedLevel.totalGames) * 100}%` }}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Game Content - Resized Padding */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 min-h-[40vh]">
          {renderLevelContent()}
        </div>

        {/* Level indicators - Resized icons */}
        <div className="mt-4 flex justify-center gap-2">
          {levels.map((level) => (
            <div
              key={level.id}
              className={`flex flex-col items-center gap-1 transition-all ${
                level.id === currentLevel ? 'scale-105' : 'opacity-60'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg ${
                  completedLevels.includes(level.id)
                    ? 'bg-green-500 text-white'
                    : level.id === currentLevel
                    ? `bg-gradient-to-br ${level.color} text-white`
                    : 'bg-white/50'
                }`}
              >
                {completedLevels.includes(level.id) ? '✓' : level.icon}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}