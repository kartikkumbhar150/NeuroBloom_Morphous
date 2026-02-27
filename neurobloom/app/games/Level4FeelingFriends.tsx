"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from 'lucide-react';
import { useTranslation } from "@/hooks/useTranslation";

interface Level4Props {
  onComplete: () => void;
  onProgress: (gameIndex: number) => void;
}

type Emotion = 'happy' | 'sad' | 'angry' | 'crying';

export function Level4FeelingFriends({ onComplete, onProgress }: Level4Props) {
  const { t } = useTranslation();
  const [currentGame, setCurrentGame] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedFace, setSelectedFace] = useState<number | null>(null);

  const questionStartTime = useRef<number>(Date.now());

  useEffect(() => {
    questionStartTime.current = Date.now();
  }, [currentGame]);

  const emotions: { emotion: Emotion; label: string; correctIndex: number }[] = [
    { emotion: 'happy', label: t('game_f1_happy'), correctIndex: 1 },
    { emotion: 'sad', label: t('game_f1_sad'), correctIndex: 0 },
    { emotion: 'angry', label: t('game_f1_angry'), correctIndex: 2 },
    { emotion: 'crying', label: t('game_f1_crying'), correctIndex: 1 },
  ];

  const faces = {
    happy: [
      { src: '/sad.jpg', emotion: 'sad' },
      { src: '/happy.jpg', emotion: 'happy' },
      { src: '/angry.jpg', emotion: 'angry' },
    ],
    sad: [
      { src: '/sad.jpg', emotion: 'sad' },
      { src: '/happy.jpg', emotion: 'happy' },
      { src: '/crying.jpg', emotion: 'crying' },
    ],
    angry: [
      { src: '/happy.jpg', emotion: 'happy' },
      { src: '/sad.jpg', emotion: 'sad' },
      { src: '/angry.jpg', emotion: 'angry' },
    ],
    crying: [
      { src: '/angry.jpg', emotion: 'angry' },
      { src: '/crying.jpg', emotion: 'crying' },
      { src: '/happy.jpg', emotion: 'happy' },
    ],
  };

  const currentEmotion = emotions[currentGame];

  const handleAnswer = async (faceIndex: number) => {
    if (feedback !== null) return;

    const isCorrect = faceIndex === currentEmotion.correctIndex;
    const score = isCorrect ? 1 : 0;
    const timeTaken = Math.floor((Date.now() - questionStartTime.current) / 1000);
    const sessionId = localStorage.getItem("sessionId");

    setSelectedFace(faceIndex);
    

    const payloadMap: any = {
      0: { test4_q1: score, test4_q1_time: timeTaken },
      1: { test4_q2: score, test4_q2_time: timeTaken },
      2: { test4_q3: score, test4_q3_time: timeTaken },
      3: { test4_q4: score, test4_q4_time: timeTaken },
    };

    try {
      await fetch("/api/session/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          payload: payloadMap[currentGame]
        })
      });
    } catch (error) {
      console.error("Failed to save progress:", error);
    }

    setTimeout(() => {
      setFeedback(null);
      setSelectedFace(null);

      if (currentGame < 3) {
        setCurrentGame(currentGame + 1);
        onProgress(currentGame + 1);
      } else {
        onComplete();
      }
    }, 1200);
  };

  return (
    <div className="text-center max-w-2xl mx-auto px-4 py-2">
      <h2 className="text-2xl font-black text-orange-600 mb-4 uppercase tracking-tight">
        {t('game_f1_title')}
      </h2>

      <div className="bg-gradient-to-br from-yellow-100 to-orange-100 p-4 rounded-2xl shadow-md mb-6 border-b-4 border-orange-200">
        <p className="text-2xl font-black text-orange-700">
          {t('game_f1_instr')} <span className="underline decoration-orange-400">{currentEmotion.label}</span> {t('game_f1_instr_face')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
        {faces[currentEmotion.emotion].map((face, index) => (
          <motion.button
            key={`${currentGame}-${index}`}
            whileHover={{ scale: feedback === null ? 1.03 : 1 }}
            whileTap={{ scale: feedback === null ? 0.98 : 1 }}
            onClick={() => handleAnswer(index)}
            disabled={feedback !== null}
            className={`relative overflow-hidden bg-white rounded-2xl shadow-lg transition-all border-4 ${
              selectedFace === index
                ? feedback === 'correct'
                  ? 'border-green-500'
                  : 'border-red-500'
                : 'border-transparent hover:border-orange-200'
            }`}
          >
            <img 
              src={face.src} 
              alt={face.emotion} 
              className="w-full h-40 md:h-44 object-cover"
            />
            
            <AnimatePresence>
              {selectedFace === index && feedback && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[2px]"
                >
                  {feedback === 'correct' ? (
                    <div className="bg-green-500 rounded-full p-2">
                      <Check className="w-10 h-10 text-white" strokeWidth={5} />
                    </div>
                  ) : (
                    <div className="bg-red-500 rounded-full p-2">
                      <X className="w-10 h-10 text-white" strokeWidth={5} />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      {/* Progress indicator - Scaled down */}
      <div className="mt-8 flex justify-center gap-3">
        {emotions.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index < currentGame
                ? 'bg-green-500'
                : index === currentGame
                ? 'bg-orange-500 ring-2 ring-orange-200'
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Background Hearts - Reduced size and count for zoom clarity */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }}>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl opacity-30"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {['💛', '💙', '💚', '❤️'][i % 4]}
          </motion.div>
        ))}
      </div>
    </div>
  );
}