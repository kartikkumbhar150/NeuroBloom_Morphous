"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Check, Play, Volume2 } from 'lucide-react';
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from '@/components/ui/button';

interface Level8Props {
  onComplete: () => void;
  onProgress: (gameIndex: number) => void;
}

export function Level8ClarityQuest({ onComplete, onProgress }: Level8Props) {
  const { t } = useTranslation();
  const [currentGame, setCurrentGame] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | null>(null);

  const words = ["Ba-na-na", "El-e-phant", "Um-brel-la", "Wa-ter-mel-on"];

  const handleRecord = () => {
    setIsRecording(true);
    
    // Simulate recording duration
    setTimeout(() => {
      setIsRecording(false);
      setFeedback('correct');
      
      setTimeout(() => {
        setFeedback(null);
        if (currentGame < words.length - 1) {
          setCurrentGame(c => c + 1);
          onProgress(currentGame + 1);
        } else {
          onComplete();
        }
      }, 1500);
    }, 2000);
  };

  return (
    <div className="w-full h-full flex flex-col relative bg-muted p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-secondary border-4 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Volume2 className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-black text-black uppercase italic tracking-wider">
            Clarity Quest
          </h2>
        </div>
        <div className="bg-white border-4 border-black px-6 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-xl font-black text-black">
            Word {currentGame + 1}/{words.length}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-12">
        <p className="text-xl font-bold uppercase tracking-widest text-black/60 text-center max-w-lg">
          Listen to the word, then repeat it clearly!
        </p>

        <div className="flex items-center gap-6">
          <Button variant="outline" size="icon" className="w-16 h-16 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Play className="w-8 h-8 ml-1" />
          </Button>
          <div className="bg-white border-4 border-black px-8 py-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h1 className="text-5xl font-black uppercase tracking-widest text-primary">
              {words[currentGame]}
            </h1>
          </div>
        </div>

        <motion.div
          animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <Button 
            onClick={handleRecord}
            disabled={isRecording || feedback !== null}
            size="lg"
            className={`text-xl py-8 px-12 border-4 border-black uppercase italic tracking-widest transition-all ${
              isRecording ? 'bg-destructive animate-pulse shadow-none translate-y-1' : 'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'
            }`}
          >
            <Mic className={`w-8 h-8 mr-3 ${isRecording ? 'animate-bounce' : ''}`} />
            {isRecording ? "Listening..." : "Hold to Speak"}
          </Button>
        </motion.div>

        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border-8 border-black p-8 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center gap-4"
            >
              <Check className="w-24 h-24 text-chart-4" strokeWidth={4} />
              <p className="text-2xl font-black uppercase italic">Great Job!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
