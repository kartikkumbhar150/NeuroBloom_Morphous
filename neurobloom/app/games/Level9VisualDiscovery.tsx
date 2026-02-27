"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Eye, Image as ImageIcon } from 'lucide-react';
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from '@/components/ui/button';

interface Level9Props {
  onComplete: () => void;
  onProgress: (gameIndex: number) => void;
}

export function Level9VisualDiscovery({ onComplete, onProgress }: Level9Props) {
  const { t } = useTranslation();
  const [currentGame, setCurrentGame] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const rounds = [
    { target: "HAPPY", options: ["😊", "😢", "😠"] },
    { target: "APPLE", options: ["🍎", "🚗", "🐶"] },
    { target: "HOUSE", options: ["🌳", "🏠", "🌟"] },
  ];

  const currentRound = rounds[currentGame];

  const handleAnswer = (option: string) => {
    if (feedback !== null) return;

    // Simple check based on index for this placeholder
    const isCorrect = option === currentRound.options[0] || option === currentRound.options[1] && currentRound.target === "HOUSE"; 

    if (option === "😊" && currentRound.target === "HAPPY" || 
        option === "🍎" && currentRound.target === "APPLE" ||
        option === "🏠" && currentRound.target === "HOUSE") {
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }

    setTimeout(() => {
      setFeedback(null);
      if (option === "😊" || option === "🍎" || option === "🏠") {
        if (currentGame < rounds.length - 1) {
          setCurrentGame(c => c + 1);
          onProgress(currentGame + 1);
        } else {
          onComplete();
        }
      }
    }, 1500);
  };

  return (
    <div className="w-full h-full flex flex-col relative bg-muted p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-chart-2 border-4 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Eye className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-black text-black uppercase italic tracking-wider">
            Visual Discovery
          </h2>
        </div>
        <div className="bg-white border-4 border-black px-6 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-xl font-black text-black">
            Scene {currentGame + 1}/{rounds.length}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-12">
        <p className="text-xl font-bold uppercase tracking-widest text-black/60 text-center max-w-lg">
          Match the visual sign to the word!
        </p>

        <div className="bg-white border-8 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rotate-[-2deg]">
          <h1 className="text-6xl font-black uppercase tracking-widest text-primary">
            {currentRound.target}
          </h1>
        </div>

        <div className="flex gap-8 mt-12">
          {currentRound.options.map((opt, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.1, rotate: Math.random() > 0.5 ? 5 : -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleAnswer(opt)}
              className="w-32 h-32 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-7xl hover:bg-accent transition-colors"
            >
              {opt}
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border-8 border-black p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] ${
                feedback === 'correct' ? 'rotate-3' : '-rotate-3'
              }`}
            >
              {feedback === 'correct' ? (
                <Check className="w-32 h-32 text-chart-4" strokeWidth={4} />
              ) : (
                <X className="w-32 h-32 text-destructive" strokeWidth={4} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
