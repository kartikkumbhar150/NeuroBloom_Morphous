"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from "framer-motion";
import { Check, X } from 'lucide-react';
import { useTranslation } from "@/hooks/useTranslation";

interface Level6Props {
  onComplete: () => void;
  onProgress: (gameIndex: number) => void;
}

export function Level6EagleEyes({ onComplete, onProgress }: Level6Props) {
  const { t } = useTranslation();
  const [currentGame, setCurrentGame] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showMemoryItems, setShowMemoryItems] = useState(true);
  const [memoryTimer, setMemoryTimer] = useState(5);
  const questionStartTime = useRef<number>(Date.now());

  useEffect(() => {
    questionStartTime.current = Date.now();
  }, [currentGame]);

  const handleAnswer = async (isCorrect: boolean, answerIndex?: number) => {
    const score = isCorrect ? 1 : 0;
    const timeTaken = Math.floor((Date.now() - questionStartTime.current) / 1000);
    const sessionId = localStorage.getItem("sessionId");

    // Show visual feedback before proceeding
    //setFeedback(isCorrect ? 'correct' : 'incorrect');
    setSelectedAnswer(answerIndex ?? null);

    const payloadMap: any = {
      0: { test6_q1_score: score, test6_q1_time: timeTaken },
      1: { test6_q2_score: score, test6_q2_time: timeTaken },
      2: { test6_q3_score: score, test6_q3_time: timeTaken },
      3: { test6_q4_score: score, test6_q4_time: timeTaken },
    };

    await fetch("/api/session/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        payload: payloadMap[currentGame]
      })
    });

    setTimeout(() => {
      setFeedback(null);
      setSelectedAnswer(null);
      if (currentGame < 3) {
        setCurrentGame(currentGame + 1);
        onProgress(currentGame + 1);
      } else {
        onComplete();
      }
    }, 1000);
  };

  useEffect(() => {
    if (currentGame === 1 && showMemoryItems && memoryTimer > 0) {
      const timer = setTimeout(() => {
        setMemoryTimer(memoryTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (memoryTimer === 0) {
      setShowMemoryItems(false);
    }
  }, [currentGame, memoryTimer, showMemoryItems]);

  const originalMemoryItems = [0, 2, 4, 6, 8, 9];
  const allMemoryItems = ['🍎', '🚗', '⚽', '🌟', '🎨', '📚', '🍕', '🎮', '🌈', '🦋'];

  const games = [
    // Game 1: Odd One Out
    <div key="odd-one-out" className="text-center max-w-4xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-black text-rose-700 mb-4">
        {t('game_ee1_title')}
      </h2>
      
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-6xl mb-4"
      >
        🦅
      </motion.div>

      <div className="bg-gradient-to-br from-rose-100 to-pink-100 p-6 md:p-8 rounded-3xl shadow-xl mb-4">
        <p className="text-xl font-bold text-rose-700 mb-6">{t('game_ee1_instr')}</p>
        <div className="flex justify-center items-center gap-4 md:gap-6">
          {['●', '●', '■', '●'].map((shape, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleAnswer(index === 2, index)}
              disabled={feedback !== null}
              className={`text-5xl md:text-6xl p-6 rounded-2xl transition-all ${
                selectedAnswer === index
                  ? feedback === 'correct' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              } shadow-lg`}
            >
              {shape}
            </motion.button>
          ))}
        </div>
      </div>
    </div>,

    // Game 2: Memory
    <div key="memory" className="text-center max-w-4xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-black text-rose-700 mb-4">
        {t('game_ee2_title')}
      </h2>
      
      <motion.div
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-6xl mb-4"
      >
        🎯
      </motion.div>

      {showMemoryItems ? (
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-3xl shadow-xl">
          <div className="bg-yellow-200 text-yellow-900 text-lg font-black px-6 py-2 rounded-full inline-block mb-6">
            {t('game_ee2_remember')} {t('game_ee2_time')} {memoryTimer}s
          </div>
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            {originalMemoryItems.map((itemIndex) => (
              <motion.div
                key={itemIndex}
                className="bg-white p-4 rounded-2xl shadow-md text-5xl"
              >
                {allMemoryItems[itemIndex]}
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-6 rounded-3xl shadow-xl">
          <p className="text-xl font-bold text-rose-700 mb-4">
            {t('game_ee2_select')} ({selectedItems.length}/6)
          </p>
          <div className="grid grid-cols-5 gap-3 max-w-2xl mx-auto mb-6">
            {allMemoryItems.map((item, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  if (selectedItems.includes(index)) {
                    setSelectedItems(selectedItems.filter(i => i !== index));
                  } else if (selectedItems.length < 6) {
                    setSelectedItems([...selectedItems, index]);
                  }
                }}
                disabled={feedback !== null}
                className={`p-4 rounded-xl shadow-md transition-all text-4xl ${
                  selectedItems.includes(index) ? 'bg-blue-500 ring-2 ring-blue-300' : 'bg-white'
                }`}
              >
                {item}
              </motion.button>
            ))}
          </div>
          <button
            onClick={() => {
              const correct = selectedItems.length === 6 && selectedItems.every(i => originalMemoryItems.includes(i));
              handleAnswer(correct);
            }}
            disabled={selectedItems.length !== 6 || feedback !== null}
            className="bg-green-500 text-white text-xl font-black px-8 py-3 rounded-full shadow-lg disabled:opacity-50"
          >
            {t('game_ee2_btn_check')}
          </button>
        </div>
      )}
    </div>,

    // Game 3: Mirror Letters
    <div key="mirror-letters" className="text-center max-w-4xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-black text-rose-700 mb-4">
        {t('game_ee3_title')}
      </h2>
      
      <motion.div
        animate={{ scaleX: [-1, 1, -1] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="text-6xl mb-4"
      >
        🦋
      </motion.div>

      <div className="bg-gradient-to-br from-pink-100 to-rose-100 p-6 md:p-8 rounded-3xl shadow-xl">
        <p className="text-xl font-bold text-rose-700 mb-6">{t('game_ee3_instr')}</p>
        <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
          {['b', 'd', 'p', 'q'].map((letter, index) => (
            <motion.button
              key={index}
              onClick={() => handleAnswer(index === 1, index)}
              disabled={feedback !== null}
              className={`text-6xl md:text-7xl font-bold p-6 rounded-2xl shadow-lg transition-all ${
                selectedAnswer === index
                  ? feedback === 'correct' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  : 'bg-white text-gray-800'
              }`}
            >
              {letter}
            </motion.button>
          ))}
        </div>
      </div>
    </div>,

    // Game 4: Visual Puzzle
    <div key="visual-puzzle" className="text-center max-w-4xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-black text-rose-700 mb-4">
        {t('game_ee4_title')}
      </h2>
      
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        className="text-6xl mb-4"
      >
        🎨
      </motion.div>

      <div className="bg-gradient-to-br from-orange-100 to-rose-100 p-6 rounded-3xl shadow-xl">
        <div className="flex justify-center items-center gap-2 mb-8 bg-white p-4 rounded-xl inline-flex">
          <div className="text-4xl">🔴</div>
          <div className="text-4xl">🔵</div>
          <div className="text-4xl">🔴</div>
          <div className="text-4xl">🔵</div>
          <div className="text-4xl">❓</div>
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
          {[
            { emoji: '🔴', label: t('game_ee4_red'), correct: true },
            { emoji: '🔵', label: t('game_ee4_blue'), correct: false },
            { emoji: '🟢', label: t('game_ee4_green'), correct: false },
          ].map((option, index) => (
            <motion.button
              key={index}
              onClick={() => handleAnswer(option.correct, index)}
              disabled={feedback !== null}
              className={`p-6 rounded-2xl shadow-lg transition-all ${
                selectedAnswer === index
                  ? feedback === 'correct' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  : 'bg-white'
              }`}
            >
              <div className="text-5xl mb-2">{option.emoji}</div>
              <p className="text-lg font-bold text-gray-700">{option.label}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>,
  ];

  return (
    <div className="relative max-h-screen overflow-y-auto px-4 py-6">
      <motion.div
        key={currentGame}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {games[currentGame]}
      </motion.div>

      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }}>
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3 + Math.random() * 2, repeat: Infinity }}
          >
            🌿
          </motion.div>
        ))}
      </div>

      {feedback && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
        >
          <div className={feedback === 'correct' ? 'text-green-500' : 'text-red-500'}>
            {feedback === 'correct' ? (
              <Check className="w-32 h-32" />
            ) : (
              <X className="w-32 h-32" />
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}