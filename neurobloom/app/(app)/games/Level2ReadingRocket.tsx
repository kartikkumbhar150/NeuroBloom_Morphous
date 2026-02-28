"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface Level2Props {
  onComplete: () => void;
  onProgress: (gameIndex: number) => void;
  phase?: number;
}

const TOTAL_GAMES = 5;
const BG = "#049CD8";

export function Level2ReadingRocket({ onComplete, onProgress, phase = 0 }: Level2Props) {
  const { t } = useTranslation();
  const [currentGame, setCurrentGame] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [tappedLetter, setTappedLetter] = useState<number | null>(null);
  const questionStartTime = useRef(Date.now());

  useEffect(() => {
    questionStartTime.current = Date.now();
    setTappedLetter(null);
  }, [currentGame]);

  const handleAnswer = async (isCorrect: boolean, answerIndex?: number) => {
    if (feedback) return;
    setFeedback(isCorrect ? "correct" : "incorrect");
    if (answerIndex !== undefined) setSelectedAnswer(answerIndex);

    const score = isCorrect ? 1 : 0;
    const timeTaken = Math.floor((Date.now() - questionStartTime.current) / 1000);
    const sessionId = localStorage.getItem("sessionId");

    const payloadMap: Record<number, object> = {
      0: { test2_q1_score: score, test2_q1_time: timeTaken },
      1: { test2_q2_score: score, test2_q2_time: timeTaken },
      2: { test2_q3_score: score, test2_q3_time: timeTaken },
      3: { test2_q4_score: score, test2_q4_time: timeTaken },
      4: { test2_q5_score: score, test2_q5_time: timeTaken },
    };

    await fetch("/api/session/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, payload: payloadMap[currentGame] }),
    });

    setTimeout(() => {
      setFeedback(null);
      setSelectedAnswer(null);
      if (currentGame < TOTAL_GAMES - 1) {
        setCurrentGame((g) => g + 1);
        onProgress(currentGame + 1);
      } else {
        onComplete();
      }
    }, 1500);
  };

  const OptionBtn = ({
    label,
    index,
    correct,
  }: {
    label: string;
    index: number;
    correct: boolean;
  }) => (
    <button
      onClick={() => handleAnswer(correct, index)}
      disabled={feedback !== null}
      className={`p-5 border-4 border-black text-xl font-black uppercase tracking-tight shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 transition-all ${
        selectedAnswer === index
          ? feedback === "correct"
            ? "bg-[#43B047] text-white"
            : "bg-[#E52521] text-white"
          : "bg-white hover:bg-[#FBD000]"
      }`}
    >
      {label}
    </button>
  );

  const Header = ({ title, sub }: { title: string; sub: string }) => (
    <div className="w-full border-b-4 border-black px-6 py-4 mb-6 flex-shrink-0" style={{ background: BG }}>
      <p className="text-xs font-black uppercase tracking-widest text-white/70">LEVEL 2  READING ROCKET</p>
      <h2 className="text-2xl font-black uppercase text-white tracking-tight">{title}</h2>
      <p className="text-sm font-bold text-white/80 mt-0.5">{sub}</p>
    </div>
  );

  const progressPct = Math.round(((currentGame + 1) / TOTAL_GAMES) * 100);

  const games = [
    /* GAME 1  Rhyme Hunter */
    <div key="rhyme" className="flex flex-col items-center text-center px-4 pb-6 w-full">
      <Header title=" Rhyme Hunter" sub="Listen to the sound at the end!" />
      <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-6 max-w-sm w-full">
        <p className="text-sm font-black uppercase text-black/50 mb-3 tracking-widest">Which word rhymes with</p>
        <div className="border-4 border-black px-8 py-4 inline-block shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" style={{ background: BG }}>
          <span className="text-5xl font-black text-white uppercase tracking-widest">STAR </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 max-w-sm w-full">
        <OptionBtn label="CAR " index={0} correct={true} />
        <OptionBtn label="DOG " index={1} correct={false} />
        <OptionBtn label="HAT " index={2} correct={false} />
        <OptionBtn label="BUS " index={3} correct={false} />
      </div>
    </div>,

    /* GAME 2  Odd Letter Out */
    <div key="odd-letter" className="flex flex-col items-center text-center px-4 pb-6 w-full">
      <Header title=" Odd Letter Out" sub="Tap the letter that looks different!" />
      <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-6 max-w-sm w-full">
        <p className="text-sm font-black uppercase text-black/50 mb-4 tracking-widest">
          Which letter is the <span className="text-[#E52521]">odd one out?</span>
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          {["b", "b", "d", "b"].map((letter, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (feedback) return;
                setTappedLetter(idx);
                handleAnswer(idx === 2, idx);
              }}
              disabled={feedback !== null}
              className={`w-20 h-20 border-4 border-black text-5xl font-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 ${
                tappedLetter === idx
                  ? feedback === "correct" ? "bg-[#43B047] text-white" : "bg-[#E52521] text-white"
                  : "bg-white hover:bg-[#FBD000]"
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-[#FBD000] border-4 border-black px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-w-xs">
        <p className="font-black uppercase text-sm text-black">Tip: look at which way the bump faces!</p>
      </div>
    </div>,

    /* GAME 3  Missing Word */
    <div key="missing-word" className="flex flex-col items-center text-center px-4 pb-6 w-full">
      <Header title=" Missing Word" sub="Complete the sentence!" />
      <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-6 max-w-sm w-full">
        <p className="text-sm font-black uppercase text-black/50 mb-4 tracking-widest">Fill in the blank</p>
        <p className="text-3xl font-black text-black leading-snug">
           The cat sat on the{" "}
          <span className="inline-block border-b-4 border-black px-4 text-[#E52521]">___</span>
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 max-w-sm w-full">
        <OptionBtn label="MAT " index={0} correct={true} />
        <OptionBtn label="SKY " index={1} correct={false} />
        <OptionBtn label="CAR " index={2} correct={false} />
        <OptionBtn label="BLUE " index={3} correct={false} />
      </div>
    </div>,

    /* GAME 4  Picture-Word Match */
    <div key="picture-match" className="flex flex-col items-center text-center px-4 pb-6 w-full">
      <Header title=" Picture Match" sub="Match the word to the picture!" />
      <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-6 max-w-xs w-full flex flex-col items-center">
        <p className="text-sm font-black uppercase text-black/50 mb-3 tracking-widest">Which word matches this?</p>
        <div className="text-[7rem] leading-none select-none"></div>
      </div>
      <div className="grid grid-cols-2 gap-4 max-w-sm w-full">
        <OptionBtn label="APPLE" index={0} correct={true} />
        <OptionBtn label="ORANGE" index={1} correct={false} />
        <OptionBtn label="HOUSE" index={2} correct={false} />
        <OptionBtn label="BALL" index={3} correct={false} />
      </div>
    </div>,

    /* GAME 5  Word Sort */
    <div key="word-sort" className="flex flex-col items-center text-center px-4 pb-6 w-full">
      <Header title=" Word Sort" sub="Sort the word into the right group!" />
      <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-6 max-w-sm w-full">
        <p className="text-sm font-black uppercase text-black/50 mb-4 tracking-widest">Is this a FRUIT or an ANIMAL?</p>
        <div className="border-4 border-black px-8 py-4 inline-block shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" style={{ background: BG }}>
          <span className="text-5xl font-black text-white uppercase tracking-widest"> LION</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 max-w-sm w-full">
        <button
          onClick={() => handleAnswer(false, 0)}
          disabled={feedback !== null}
          className={`py-8 text-3xl font-black uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 transition-all ${
            selectedAnswer === 0
              ? feedback === "correct" ? "bg-[#43B047] text-white" : "bg-[#E52521] text-white"
              : "bg-white hover:bg-[#FBD000]"
          }`}
        >
           FRUIT
        </button>
        <button
          onClick={() => handleAnswer(true, 1)}
          disabled={feedback !== null}
          className={`py-8 text-3xl font-black uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 transition-all ${
            selectedAnswer === 1
              ? feedback === "correct" ? "bg-[#43B047] text-white" : "bg-[#E52521] text-white"
              : "bg-white hover:bg-[#FBD000]"
          }`}
        >
           ANIMAL
        </button>
      </div>
    </div>,
  ];

  return (
    <div className="relative h-full flex flex-col overflow-hidden">
      {/* Progress bar */}
      <div className="h-3 bg-black/10 border-b-2 border-black flex-shrink-0">
        <div
          className="h-full bg-[#FBD000] border-r-2 border-black transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Score chip */}
      <div className="flex justify-end px-4 pt-2 flex-shrink-0">
        <div className="bg-white border-2 border-black px-3 py-1 text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          {currentGame + 1} / {TOTAL_GAMES}
        </div>
      </div>

      {/* Game area */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentGame}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
            className="w-full flex flex-col items-center"
          >
            {games[currentGame]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Feedback overlay */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-[100] bg-black/20 backdrop-blur-sm"
          >
            <div
              className={`p-12 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] ${
                feedback === "correct" ? "bg-[#43B047] rotate-2" : "bg-[#E52521] -rotate-2"
              }`}
            >
              {feedback === "correct" ? (
                <div className="flex flex-col items-center text-white">
                  <Check className="w-20 h-20 stroke-[4]" />
                  <span className="text-3xl font-black mt-3 uppercase tracking-widest">Correct! </span>
                </div>
              ) : (
                <div className="flex flex-col items-center text-white">
                  <X className="w-20 h-20 stroke-[4]" />
                  <span className="text-3xl font-black mt-3 uppercase tracking-widest">Try Again!</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
