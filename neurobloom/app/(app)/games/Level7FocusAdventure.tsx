"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Target, Zap } from 'lucide-react';
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from '@/components/ui/button';

interface Level7Props {
  onComplete: () => void;
  onProgress: (gameIndex: number) => void;
}

export function Level7FocusAdventure({ onComplete, onProgress }: Level7Props) {
  const { t } = useTranslation();
  const [currentGame, setCurrentGame] = useState(0);
  const [targetColor, setTargetColor] = useState<'red' | 'green'>('red');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startRound = () => {
    setTargetColor('red');
    setFeedback(null);
    
    // Random delay between 1s and 3s to turn green
    const delay = Math.random() * 2000 + 1000;
    timeoutRef.current = setTimeout(() => {
      setTargetColor('green');
    }, delay);
  };

  useEffect(() => {
    startRound();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentGame]);

  const handleTap = () => {
    if (feedback !== null) return;
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (targetColor === 'green') {
      setFeedback('correct');
      setScore(s => s + 1);
    } else {
      setFeedback('incorrect');
    }

    setTimeout(() => {
      if (currentGame < 4) {
        setCurrentGame(c => c + 1);
        onProgress(currentGame + 1);
      } else {
        onComplete();
      }
    }, 1500);
  };

  return (
    <div className="w-full h-full flex flex-col relative bg-muted p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary border-4 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-black text-black uppercase italic tracking-wider">
            Focus Adventure
          </h2>
        </div>
        <div className="bg-white border-4 border-black px-6 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-xl font-black text-black">
            Round {currentGame + 1}/5
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-12">
        <p className="text-xl font-bold uppercase tracking-widest text-black/60 text-center max-w-lg">
          Wait for the green light, then tap as fast as you can!
        </p>

        <motion.div
          animate={{ scale: targetColor === 'green' ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 0.5, repeat: targetColor === 'green' ? Infinity : 0 }}
          className={`w-48 h-48 rounded-full border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center transition-colors duration-200 ${
            targetColor === 'red' ? 'bg-destructive' : 'bg-chart-4'
          }`}
        >
          {targetColor === 'red' ? (
            <Target className="w-20 h-20 text-white opacity-50" />
          ) : (
            <Zap className="w-20 h-20 text-white" />
          )}
        </motion.div>

        <Button 
          onClick={handleTap}
          size="lg"
          className="text-2xl py-8 px-16 uppercase italic tracking-widest border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        >
          TAP NOW!
        </Button>

        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
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
