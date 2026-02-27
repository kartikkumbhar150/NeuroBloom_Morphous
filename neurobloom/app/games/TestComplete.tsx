"use client";

import { motion } from "framer-motion";
import { Trophy, Star, Download, Home, Sparkles } from 'lucide-react';
import { StudentData } from './StudentForm';
import { useEffect, useState } from "react";
import { useVideo } from "@/context/VideoContext";
import { useTranslation } from "@/hooks/useTranslation";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

interface TestCompleteProps {
  studentData: StudentData;
  onReturnHome: () => void;
}

export function TestComplete({ studentData, onReturnHome }: TestCompleteProps) {
  const { t } = useTranslation();
  const { stopAndUpload } = useVideo();
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    const stop = async () => {
      await stopAndUpload();
    };
    stop();

    // Set initial window size and update on resize
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [stopAndUpload]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center overflow-x-hidden p-4 relative">
      <div className="absolute top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>
      {/* Container restricted to a smaller max-width for better "fit" */}
      <div className="max-w-3xl w-full py-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="text-center"
        >
          {/* Trophy Animation - Scaled Down */}
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 5, 0],
              y: [0, -10, 0]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <div className="relative">
              <Trophy className="w-28 h-28 text-yellow-300" />
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-2 -right-2"
              >
                <Star className="w-12 h-12 fill-yellow-200 text-yellow-300" />
              </motion.div>
            </div>
          </motion.div>

          {/* Completion Message - Reduced Font Sizes */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-black text-white mb-3"
          >
            🎉 {t('tcomp_amazing')}{studentData.name}! 🎉
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-white/90 mb-8"
          >
            {t('tcomp_adventure_complete')}
          </motion.p>

          {/* Stats Cards - Compact Padding */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-3 gap-4 mb-8"
          >
            {[
              { icon: '🎯', stat: '6/6', label: t('tcomp_levels') },
              { icon: '⭐', stat: '20+', label: t('tcomp_games') },
              { icon: '🏆', stat: '100%', label: t('tcomp_done') },
            ].map((item, i) => (
              <div key={i} className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30">
                <div className="text-3xl mb-1">{item.icon}</div>
                <h3 className="text-2xl font-black text-white">{item.stat}</h3>
                <p className="text-white/70 text-sm">{item.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Achievement Badges - Smaller Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20"
          >
            <h2 className="text-xl font-black text-white mb-4">{t('tcomp_achievements')}</h2>
            <div className="grid grid-cols-6 gap-3">
              {[
                { icon: '🌳', name: t('tcomp_math') },
                { icon: '🚀', name: t('tcomp_reading') },
                { icon: '✨', name: t('tcomp_writing') },
                { icon: '😊', name: t('tcomp_emotion') },
                { icon: '🔊', name: t('tcomp_sound') },
                { icon: '👀', name: t('tcomp_vision') },
              ].map((badge, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  className="bg-white/20 rounded-xl p-2"
                >
                  <div className="text-3xl mb-1">{badge.icon}</div>
                  <p className="text-white text-[10px] font-bold truncate">{badge.name}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Next Steps - Smaller text */}
          <motion.div
            className="bg-indigo-500/20 backdrop-blur-md rounded-2xl p-5 mb-8 border border-white/20"
          >
            <p className="text-white/90 text-sm leading-relaxed">
              {t('tcomp_results_processing')}
            </p>
          </motion.div>

          {/* Action Buttons - Smaller padding and font */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onReturnHome}
              className="bg-white text-purple-600 text-lg font-black px-8 py-3 rounded-xl shadow-xl flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              {t('tcomp_return_home')}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/20 backdrop-blur-sm border border-white text-white text-lg font-black px-8 py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              {t('tcomp_certificate')}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Confetti and Sparkles - Use windowSize state for better positioning */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: '110vh', x: Math.random() * windowSize.width }}
          animate={{ y: '-10vh' }}
          transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 5 }}
          className="absolute pointer-events-none opacity-40"
        >
          <Sparkles className="text-yellow-200 w-4 h-4" />
        </motion.div>
      ))}
    </div>
  );
}