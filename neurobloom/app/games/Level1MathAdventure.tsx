"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from "framer-motion";
import { Check, X, Star, Coins } from 'lucide-react';
import { useTranslation } from "@/hooks/useTranslation";


interface Level1Props {
  onComplete: () => void;
  onProgress: (gameIndex: number) => void;
}

export function Level1MathAdventure({ onComplete, onProgress }: Level1Props) {
  const { t } = useTranslation();
  const [currentGame, setCurrentGame] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [selectedCoins, setSelectedCoins] = useState<number[]>([]);

  const questionStartTime = useRef<number>(Date.now());

  useEffect(() => {
    questionStartTime.current = Date.now();
  }, [currentGame]);


  const handleAnswer = async (isCorrect: boolean) => {
    const timeTaken = Math.floor((Date.now() - questionStartTime.current) / 1000);
    const sessionId = localStorage.getItem("sessionId");

    const scoreValue = isCorrect ? 1 : 0;

    const payloadMap: any = {
      0: { test1_q1: scoreValue, test1_q1_time: timeTaken },
      1: { test1_q2: scoreValue, test1_q2_time: timeTaken },
      2: { test1_q3: scoreValue, test1_q3_time: timeTaken },
      3: { test1_q4: scoreValue, test1_q4_time: timeTaken },
      4: { test1_q5: scoreValue, test1_q5_time: timeTaken },
      5: { test1_q6: scoreValue, test1_q6_time: timeTaken },
    };

    await fetch("/api/session/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        payload: payloadMap[currentGame]
      })
    });

    if (currentGame < 5) {
      setCurrentGame(currentGame + 1);
      onProgress(currentGame + 1);
    } else {
      onComplete();
    }
  };


  const games = [
    // Game 1: Count the Apples
    <div key="game1" className="text-center">
      <h2 className="text-3xl font-black text-green-700 mb-4">
        {t('game_m1_title1')}
      </h2>
      <div className="flex flex-wrap justify-center gap-4 mb-6 bg-green-50 p-6 rounded-3xl">
        {[...Array(7)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: i * 0.1 }}
            className="text-5xl"
          >
            🍎
          </motion.div>
        ))}
      </div>
      <p className="text-xl text-gray-700 mb-4">{t('game_m1_q1')}</p>
      <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto">
        {[5, 6, 7, 8].map((num, idx) => (
          <motion.button
            key={num}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleAnswer(num === 7)}
            disabled={feedback !== null}
            className={`text-3xl font-black py-6 rounded-2xl shadow-lg transition-all ${
              selectedAnswer === idx
                ? feedback === 'correct'
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
                : 'bg-white text-green-600 hover:bg-green-100'
            }`}
          >
            {num}
          </motion.button>
        ))}
      </div>
    </div>,

    // Game 2: Which Has More Stars?
    <div key="game2" className="text-center">
      <h2 className="text-3xl font-black text-green-700 mb-4">
        {t('game_m1_title2')}
      </h2>
      <p className="text-xl text-gray-700 mb-6">{t('game_m1_q2')}</p>
      <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleAnswer(false)}
          disabled={feedback !== null}
          className={`bg-gradient-to-br from-blue-100 to-blue-200 p-8 rounded-3xl shadow-xl transition-all ${
            selectedAnswer === 0
              ? feedback === 'incorrect'
                ? 'ring-4 ring-red-500'
                : ''
              : 'hover:shadow-2xl'
          }`}
        >
          <div className="flex flex-wrap justify-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="text-4xl">⭐</div>
            ))}
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleAnswer(true)}

          disabled={feedback !== null}
          className={`bg-gradient-to-br from-purple-100 to-purple-200 p-8 rounded-3xl shadow-xl transition-all ${
            selectedAnswer === 1
              ? feedback === 'correct'
                ? 'ring-4 ring-green-500'
                : ''
              : 'hover:shadow-2xl'
          }`}
        >
          <div className="flex flex-wrap justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="text-4xl">⭐</div>
            ))}
          </div>
        </motion.button>
      </div>
    </div>,

    // Game 3: Compare Numbers
    <div key="game3" className="text-center">
      <h2 className="text-3xl font-black text-green-700 mb-4">
        {t('game_m1_title3')}
      </h2>
      <div className="flex justify-center gap-8 mb-8">
        <div className="bg-blue-500 text-white text-7xl font-black w-32 h-32 rounded-3xl flex items-center justify-center shadow-xl">
          7
        </div>
        <div className="text-4xl flex items-center text-gray-400">{t('game_m1_vs')}</div>
        <div className="bg-purple-500 text-white text-7xl font-black w-32 h-32 rounded-3xl flex items-center justify-center shadow-xl">
          4
        </div>
      </div>
      <p className="text-xl text-gray-700 mb-6">{t('game_m1_q3')}</p>
      <div className="flex gap-4 justify-center">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleAnswer(true)}
          disabled={feedback !== null}
          className={`text-2xl font-black px-8 py-6 rounded-2xl shadow-lg transition-all ${
            selectedAnswer === 0
              ? feedback === 'correct'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
              : 'bg-white text-blue-600 hover:bg-blue-100'
          }`}
        >
          {t('game_m1_q3_opt1')}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleAnswer(false)}
          disabled={feedback !== null}
          className={`text-2xl font-black px-8 py-6 rounded-2xl shadow-lg transition-all ${
            selectedAnswer === 1
              ? feedback === 'incorrect'
                ? 'bg-red-500 text-white'
                : 'bg-green-500 text-white'
              : 'bg-white text-purple-600 hover:bg-purple-100'
          }`}
        >
          {t('game_m1_q3_opt2')}
        </motion.button>
      </div>
    </div>,

    // Game 4: Add the Numbers
    <div key="game4" className="text-center">
      <h2 className="text-3xl font-black text-green-700 mb-4">
        {t('game_m1_title4')}
      </h2>
      <div className="bg-gradient-to-br from-yellow-100 to-orange-100 p-8 rounded-3xl shadow-xl mb-8 max-w-lg mx-auto">
        <div className="flex items-center justify-center gap-4 text-6xl font-black text-orange-600">
          <span>3</span>
          <span className="text-4xl">+</span>
          <span>2</span>
          <span className="text-4xl">=</span>
          <span className="text-purple-600">?</span>
        </div>
      </div>
      <p className="text-xl text-gray-700 mb-6">{t('game_m1_q4')}</p>
      <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
        {[4, 5, 6].map((num, idx) => (
          <motion.button
            key={num}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleAnswer(num === 5)}
            disabled={feedback !== null}
            className={`text-4xl font-black py-8 rounded-2xl shadow-lg transition-all ${
              selectedAnswer === idx
                ? feedback === 'correct'
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
                : 'bg-white text-orange-600 hover:bg-orange-100'
            }`}
          >
            {num}
          </motion.button>
        ))}
      </div>
    </div>,

    // Game 5: Coin Game
    <div key="game5" className="text-center">
      <h2 className="text-3xl font-black text-green-700 mb-4">
        {t('game_m1_title5')}
      </h2>
      <div className="bg-gradient-to-br from-pink-100 to-purple-100 p-4 rounded-2xl shadow-md mb-4 max-w-xs mx-auto">
        <div className="text-4xl mb-2">🧸</div>
        <p className="text-2xl font-black text-purple-600">{t('game_m1_q5_item')}</p>
      </div>
      
      <p className="text-xl text-gray-700 mb-3">
        {t('game_m1_q5_total')}{selectedCoins.reduce((sum, coin) => sum + coin, 0)}
      </p>

      {/* Selected coins tray */}
      <div className="bg-green-100 rounded-2xl p-4 mb-4 min-h-[60px] max-w-lg mx-auto">
        <div className="flex flex-wrap gap-2 justify-center">
          {selectedCoins.map((coin, idx) => (
            <div
              key={idx}
              className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full font-bold text-lg"
            >
              ₹{coin}
            </div>
          ))}
        </div>
      </div>

      {/* Coin buttons */}
      <div className="grid grid-cols-4 gap-3 max-w-md mx-auto mb-6">
        {[1, 2, 5, 10].map((coin) => (
          <motion.button
            key={coin}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSelectedCoins([...selectedCoins, coin])}
            disabled={feedback !== null}
            className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-yellow-900 text-2xl font-black py-6 rounded-full shadow-md transition-all"
          >
            ₹{coin}
          </motion.button>
        ))}
      </div>

      <div className="flex gap-3 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            const total = selectedCoins.reduce((s,c)=>s+c,0)
            handleAnswer(total === 12)
          }}

          disabled={feedback !== null || selectedCoins.length === 0}
          className="bg-gradient-to-r from-green-500 to-emerald-500 text-xl font-black px-8 py-4 rounded-full shadow-lg disabled:opacity-50 text-white"
        >
          {t('game_m1_btn_check')}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedCoins([])}
          className="bg-gray-300 text-gray-700 text-xl font-bold px-6 py-4 rounded-full shadow-md"
        >
          {t('game_m1_btn_clear')}
        </motion.button>
      </div>
    </div>,

    // Game 6: Final Math Round
    <div key="game6" className="text-center">
      <h2 className="text-3xl font-black text-green-700 mb-4">
        {t('game_m1_title6')}
      </h2>
      <div className="bg-gradient-to-br from-green-100 to-teal-100 p-8 rounded-3xl shadow-xl mb-6 max-w-lg mx-auto">
        <p className="text-2xl font-bold text-gray-800 mb-6">
          {t('game_m1_q6')}
        </p>
        <div className="flex justify-center gap-2 mb-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`text-3xl ${i < 3 ? 'opacity-30' : ''}`}>
              🍬
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
        {[4, 5, 6].map((num, idx) => (
          <motion.button
            key={num}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleAnswer(num === 5)}
            disabled={feedback !== null}
            className={`text-4xl font-black py-8 rounded-2xl shadow-lg transition-all ${
              selectedAnswer === idx
                ? feedback === 'correct'
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
                : 'bg-white text-teal-600 hover:bg-teal-100'
            }`}
          >
            {num}
          </motion.button>
        ))}
      </div>
    </div>,
  ];

  return (
    <div className="relative max-w-4xl mx-auto px-4">
      <motion.div
        key={currentGame}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
      >
        {games[currentGame]}
      </motion.div>

      {/* Feedback animation */}
      {feedback && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
        >
          <div
            className={`text-8xl ${
              feedback === 'correct' ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {feedback === 'correct' ? <Check className="w-32 h-32" /> : <X className="w-32 h-32" />}
          </div>
        </motion.div>
      )}
    </div>
  );
}