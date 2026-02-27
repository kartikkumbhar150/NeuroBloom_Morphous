"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from "framer-motion";
import { Check, X } from 'lucide-react';
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";

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
      <h2 className="text-4xl font-black text-black mb-6 uppercase tracking-tight">
        {t('game_ee1_title')}
      </h2>
      
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="text-8xl mb-8 drop-shadow-lg"
      >
        🦅
      </motion.div>

      <div className="bg-white border-4 border-black p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8">
        <p className="text-2xl font-black text-black mb-10 uppercase tracking-widest">{t('game_ee1_instr')}</p>
        <div className="flex justify-center items-center gap-6">
          {['●', '●', '■', '●'].map((shape, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.1, y: -4 }}
              whileTap={{ scale: 0.9, y: 0 }}
              onClick={() => handleAnswer(index === 2, index)}
              className={`text-6xl p-10 border-4 border-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none ${
                selectedAnswer === index
                  ? feedback === 'correct' ? 'bg-secondary text-white' : 'bg-primary text-white'
                  : 'bg-white text-black hover:bg-accent'
              }`}
            >
              {shape}
            </motion.button>
          ))}
        </div>
      </div>
    </div>,

    // Game 2: Memory
    <div key="memory" className="text-center max-w-4xl mx-auto">
      <h2 className="text-4xl font-black text-black mb-6 uppercase tracking-tight">
        {t('game_ee2_title')}
      </h2>
      
      <motion.div
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="text-8xl mb-8 drop-shadow-lg"
      >
        🎯
      </motion.div>

      {showMemoryItems ? (
        <div className="bg-white border-4 border-black p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="bg-accent border-4 border-black text-black text-xl font-black px-10 py-4 inline-block mb-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase">
            {t('game_ee2_remember')} {t('game_ee2_time')} {memoryTimer}s
          </div>
          <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
            {originalMemoryItems.map((itemIndex) => (
              <motion.div
                key={itemIndex}
                className="bg-muted border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-6xl"
              >
                {allMemoryItems[itemIndex]}
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white border-4 border-black p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-2xl font-black text-black mb-8 uppercase tracking-widest">
            {t('game_ee2_select')} <span className="text-primary">({selectedItems.length}/6)</span>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 max-w-2xl mx-auto mb-10">
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
                className={`p-6 border-4 border-black transition-all text-5xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none ${
                  selectedItems.includes(index) ? 'bg-secondary' : 'bg-white hover:bg-muted'
                }`}
              >
                {item}
              </motion.button>
            ))}
          </div>
          <Button
            size="lg"
            onClick={() => {
              const correct = selectedItems.length === 6 && selectedItems.every(i => originalMemoryItems.includes(i));
              handleAnswer(correct);
            }}
            disabled={selectedItems.length !== 6}
            className="text-2xl py-8 px-12"
          >
            {t('game_ee2_btn_check')}
          </Button>
        </div>
      )}
    </div>,

    // Game 3: Mirror Letters
    <div key="mirror-letters" className="text-center max-w-4xl mx-auto">
      <h2 className="text-4xl font-black text-black mb-6 uppercase tracking-tight">
        {t('game_ee3_title')}
      </h2>
      
      <motion.div
        animate={{ scaleX: [-1, 1, -1] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="text-8xl mb-8 drop-shadow-lg"
      >
        🦋
      </motion.div>

      <div className="bg-white border-4 border-black p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <p className="text-2xl font-black text-black mb-10 uppercase tracking-widest">{t('game_ee3_instr')}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
          {['b', 'd', 'p', 'q'].map((letter, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95, y: 0 }}
              onClick={() => handleAnswer(index === 1, index)}
              className={`text-7xl font-black p-10 border-4 border-black transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none ${
                selectedAnswer === index
                  ? feedback === 'correct' ? 'bg-secondary text-white' : 'bg-primary text-white'
                  : 'bg-white text-black hover:bg-accent'
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
      <h2 className="text-4xl font-black text-black mb-6 uppercase tracking-tight">
        {t('game_ee4_title')}
      </h2>
      
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        className="text-8xl mb-8 drop-shadow-lg"
      >
        🎨
      </motion.div>

      <div className="bg-white border-4 border-black p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex justify-center items-center gap-4 mb-12 bg-muted border-4 border-black p-8 shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.1)]">
          <div className="text-6xl">🔴</div>
          <div className="text-6xl">🔵</div>
          <div className="text-6xl">🔴</div>
          <div className="text-6xl">🔵</div>
          <div className="text-6xl animate-bounce">❓</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-lg mx-auto">
          {[
            { emoji: '🔴', label: t('game_ee4_red'), correct: true },
            { emoji: '🔵', label: t('game_ee4_blue'), correct: false },
            { emoji: '🟢', label: t('game_ee4_green'), correct: false },
          ].map((option, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95, y: 0 }}
              onClick={() => handleAnswer(option.correct, index)}
              className={`p-8 border-4 border-black transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none ${
                selectedAnswer === index
                  ? feedback === 'correct' ? 'bg-secondary text-white' : 'bg-primary text-white'
                  : 'bg-white text-black hover:bg-accent'
              }`}
            >
              <div className="text-6xl mb-4">{option.emoji}</div>
              <p className="text-xl font-black uppercase">{option.label}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>,
  ];

    return (
      <div className="relative">
        <motion.div
          key={currentGame}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {games[currentGame]}
        </motion.div>
  
        {feedback && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50 bg-black/20 backdrop-blur-sm"
          >
            <div className={`p-12 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] ${
              feedback === 'correct' ? 'bg-secondary text-white' : 'bg-primary text-white'
            }`}>
              {feedback === 'correct' ? (
                <Check className="w-32 h-32 stroke-[4]" />
              ) : (
                <X className="w-32 h-32 stroke-[4]" />
              )}
            </div>
          </motion.div>
        )}
      </div>
    );
  }
  