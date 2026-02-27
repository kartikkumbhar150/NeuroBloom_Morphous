"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, Check, X, Headphones, Play } from 'lucide-react';
import { useTranslation } from "@/hooks/useTranslation";

interface Level5Props {
  onComplete: () => void;
  onProgress: (gameIndex: number) => void;
}

export function Level5SuperEars({ onComplete, onProgress }: Level5Props) {
  const { t } = useTranslation();
  const [currentGame, setCurrentGame] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [beepActive, setBeepActive] = useState(false);
  const [beepCount, setBeepCount] = useState(0);
  const [soundPlaying, setSoundPlaying] = useState(false);

  const beepStartTime = useRef(0);
  const reactions = useRef<number[]>([]);
  const questionStartTime = useRef(0);
  const beepAudio = useRef<HTMLAudioElement | null>(null);
  const playingAudio = useRef<HTMLAudioElement | null>(null);
  const gaaaAudio = useRef<HTMLAudioElement | null>(null);
  const kaaaAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    beepAudio.current = new Audio("/sounds/beep.mp3");
    beepAudio.current.preload = "auto";
    playingAudio.current = new Audio("/sounds/playing.mp3");
    playingAudio.current.preload = "auto";
    gaaaAudio.current = new Audio("/sounds/gaaa.mp3");
    gaaaAudio.current.preload = "auto";
    kaaaAudio.current = new Audio("/sounds/kaaa.mp3");
    kaaaAudio.current.preload = "auto";
  }, []);

  useEffect(() => {
    questionStartTime.current = Date.now();
  }, [currentGame]);

  const unlockAudio = async () => {
    const sounds = [beepAudio.current, playingAudio.current, gaaaAudio.current, kaaaAudio.current];
    for (let sound of sounds) {
      if (!sound) continue;
      try {
        await sound.play();
        sound.pause();
        sound.currentTime = 0;
      } catch {}
    }
  };

  const handleAnswer = async (isCorrect: boolean, answerIndex?: number) => {
    setSelectedAnswer(answerIndex ?? null);
    //setFeedback(isCorrect ? 'correct' : 'incorrect');

    const score = isCorrect ? 1 : 0;
    const timeTaken = Math.floor((Date.now() - questionStartTime.current) / 1000);
    const sessionId = localStorage.getItem("sessionId");

    const payload = currentGame === 1
        ? { test5_q2_score: score, test5_q2_time: timeTaken }
        : { test5_q3_score: score, test5_q3_time: timeTaken };

    await fetch("/api/session/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, payload })
    });

    setTimeout(() => {
      setFeedback(null);
      setSelectedAnswer(null);
      if (currentGame < 2) {
        setCurrentGame(currentGame + 1);
        onProgress(currentGame + 1);
      } else {
        onComplete();
      }
    }, 1500);
  };

  const startBeepTest = () => {
    setBeepActive(true);
    reactions.current = [];
    let count = 0;

    const interval = setInterval(() => {
      count++;
      setBeepCount(count);
      beepStartTime.current = Date.now();
      if (beepAudio.current) {
        beepAudio.current.currentTime = 0;
        beepAudio.current.play();
      }

      if (count >= 5) {
        clearInterval(interval);
        setTimeout(async () => {
          const sessionId = localStorage.getItem("sessionId");
          await fetch("/api/session/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId,
              payload: {
                test5_q1_r1: reactions.current[0] || null,
                test5_q1_r2: reactions.current[1] || null,
                test5_q1_r3: reactions.current[2] || null,
                test5_q1_r4: reactions.current[3] || null,
                test5_q1_r5: reactions.current[4] || null,
              }
            })
          });
          setBeepActive(false);
          setBeepCount(0);
          setCurrentGame(1);
          onProgress(1);
        }, 1500);
      }
    }, 1500);
  };

  const playSound = (type: "playing" | "gaaa" | "kaaa") => {
    setSoundPlaying(true);
    let audio = type === "playing" ? playingAudio.current : type === "gaaa" ? gaaaAudio.current : kaaaAudio.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.play();
    audio.onended = () => setSoundPlaying(false);
  };

  const games = [
    // Game 1: Beep Test
    <div key="beep-test" className="flex flex-col items-center">
      <div className="mb-4 text-center">
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-600 mb-1">
          {t('game_se1_title')}
        </h2>
        <p className="text-xs text-cyan-600 font-medium tracking-widest uppercase">{t('game_se1_level')}</p>
      </div>
      
      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-xl border border-white max-w-md w-full text-center">
        {!beepActive ? (
          <div className="py-4">
            <div className="bg-cyan-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
              <Headphones className="w-8 h-8 text-cyan-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{t('game_se1_ready')}</h3>
            <p className="text-slate-600 text-sm mb-6">{t('game_se1_instr')}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={async () => { await unlockAudio(); startBeepTest(); }}
              className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-lg font-bold px-8 py-4 rounded-xl shadow-lg flex items-center gap-2 mx-auto"
            >
              <Play size={20} fill="currentColor" /> {t('game_se1_btn_start')}
            </motion.button>
          </div>
        ) : (
          <div className="py-4">
              <motion.div
                onClick={() => {
                  const rt = Date.now() - beepStartTime.current;
                  reactions.current.push(rt);
                }}
                animate={{ 
                  scale: [1, 1.03, 1],
                  boxShadow: ["0px 0px 0px rgba(6,182,212,0)", "0px 0px 20px rgba(6,182,212,0.3)", "0px 0px 0px rgba(6,182,212,0)"]
                }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-48 h-48 mx-auto bg-gradient-to-br from-cyan-400 to-teal-500 rounded-full flex items-center justify-center cursor-pointer shadow-xl border-4 border-white relative overflow-hidden group"
              >
                <span className="text-6xl select-none">👂</span>
              </motion.div>
              <div className="mt-8 space-y-2">
                <p className="text-lg font-bold text-slate-700">{t('game_se1_listen')}</p>
                <div className="flex justify-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`w-3 h-3 rounded-full transition-colors duration-300 ${i < beepCount ? 'bg-cyan-500' : 'bg-slate-200'}`} />
                  ))}
                </div>
              </div>
          </div>
        )}
      </div>
    </div>,

    // Game 2: Word & Picture
    <div key="word-picture" className="flex flex-col items-center">
      <div className="mb-4 text-center">
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 mb-1">
          {t('game_se2_title')}
        </h2>
        <p className="text-xs text-blue-600 font-medium tracking-widest uppercase">{t('game_se2_instr')}</p>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => playSound('playing')}
        className={`relative bg-white p-1.5 rounded-3xl shadow-md mb-6 flex items-center pr-6 gap-3 border border-slate-100 transition-all ${soundPlaying ? 'ring-2 ring-blue-400' : ''}`}
      >
        <div className="bg-blue-500 p-3 rounded-2xl text-white shadow-md">
          <Volume2 className={`w-6 h-6 ${soundPlaying ? 'animate-bounce' : ''}`} />
        </div>
        <span className="text-xl font-black text-slate-700">{t('game_se2_btn_play')}</span>
      </motion.button>

      <div className="grid grid-cols-2 gap-4 max-w-2xl w-full px-2">
        {[
          { image: '/playing.jpg', label: t('game_se2_playing'), correct: true },
          { image: '/studying.jpg', label: t('game_se2_studying'), correct: false },
          { image: '/sleeping.jpg', label: t('game_se2_sleeping'), correct: false },
          { image: '/eating.jpg', label: t('game_se2_eating'), correct: false },
        ].map((item, index) => (
          <motion.button
            key={index}
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => handleAnswer(item.correct, index)}
            disabled={feedback !== null}
            className={`group relative overflow-hidden bg-white rounded-3xl shadow-md border-2 transition-all ${
              selectedAnswer === index
                ? feedback === 'correct'
                  ? 'border-green-500 ring-2 ring-green-100'
                  : 'border-red-500 ring-2 ring-red-100'
                : 'border-white hover:border-blue-200'
            }`}
          >
            <div className="aspect-video w-full overflow-hidden relative">
              <img 
                src={item.image} 
                alt={item.label} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${item.label}&background=random&size=128`;
                }}
              />
            </div>
            <div className="p-3 bg-white text-center">
              <p className="text-lg font-black text-slate-700 capitalize">{item.label}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>,

    // Game 3: Sound Discrimination
    <div key="sound-discrimination" className="flex flex-col items-center">
      <div className="mb-4 text-center">
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600 mb-1">
          {t('game_se3_title')}
        </h2>
        <p className="text-xs text-teal-600 font-medium tracking-widest uppercase">{t('game_se3_level')}</p>
      </div>

      <div className="bg-white/90 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-xl border border-white max-w-lg w-full text-center relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-cyan-400" />
        <p className="text-lg font-bold text-slate-600 mb-6">{t('game_se3_compare')}</p>
        <div className="flex gap-4 justify-center mb-8">
          {['gaaa', 'kaaa'].map((type) => (
            <motion.button
              key={type}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => playSound(type as any)}
              className="bg-slate-50 border border-slate-100 p-4 rounded-2xl shadow-sm hover:bg-white transition-all group w-28"
            >
              <div className="bg-teal-500 w-10 h-10 rounded-xl flex items-center justify-center text-white mx-auto mb-2 group-hover:scale-110 transition-transform">
                <Volume2 size={20} />
              </div>
              <span className="text-lg font-black text-slate-700">"{type}"</span>
            </motion.button>
          ))}
        </div>
        <div className="flex gap-3 justify-center">
          {[
            { label: t('game_se3_same'), val: false, color: 'bg-slate-100 text-slate-700' },
            { label: t('game_se3_different'), val: true, color: 'bg-teal-500 text-white' }
          ].map((btn, idx) => (
            <motion.button
              key={btn.label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswer(btn.val, idx)}
              disabled={feedback !== null}
              className={`text-lg font-black px-8 py-4 rounded-xl shadow-md transition-all ${
                selectedAnswer === idx
                  ? feedback === (btn.val ? 'correct' : 'incorrect')
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                  : btn.color
              }`}
            >
              {btn.label}
            </motion.button>
          ))}
        </div>
      </div>
    </div>,
  ];

  return (
    <div className="min-h-screen bg-[#f0f9ff] py-6 px-4 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-cyan-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-teal-100 rounded-full blur-3xl opacity-50" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentGame}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          className="relative z-10 container mx-auto"
        >
          {games[currentGame]}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-[100] bg-white/10 backdrop-blur-sm"
          >
            <motion.div 
              className={`p-10 rounded-[3rem] shadow-2xl ${
                feedback === 'correct' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}
            >
              {feedback === 'correct' ? (
                <div className="flex flex-col items-center">
                  <Check className="w-24 h-24 stroke-[3]" />
                  <span className="text-3xl font-black mt-2 uppercase tracking-wide">{t('game_se_great')}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <X className="w-24 h-24 stroke-[3]" />
                  <span className="text-3xl font-black mt-2 uppercase tracking-wide">{t('game_se_try_again')}</span>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}