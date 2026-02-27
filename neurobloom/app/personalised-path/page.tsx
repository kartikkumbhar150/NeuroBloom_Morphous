"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  LayoutDashboard,
  FileText,
  Users,
  TrendingUp,
  Settings,
  HelpCircle,
  Compass,
  BookOpen,
  Calculator,
  PenTool,
  RefreshCw,
  XCircle,
  Play,
  Lock,
  Sparkles,
  Search,
  SlidersHorizontal,
  Shield,
  Zap,
  Clock,
  BarChart2,
} from "lucide-react";

interface Assessment {
  id: string;
  child_name: string;
  gender: string;
  age: number;
  report_url: string;
  disabilities: string[] | null;
  created_at?: string;
}

/* ─── Floating symbol element ──────────────────────────────────────────────── */
interface FloatingEl {
  symbol: string;
  x: string;
  y: string;
  size: string;
  delay: number;
  duration: number;
  rotate?: number;
}

function FloatingSymbol({ el, color }: { el: FloatingEl; color: string }) {
  const isRotating = el.rotate !== undefined;
  return (
    <motion.div
      className="absolute pointer-events-none select-none font-extrabold"
      style={{ left: el.x, top: el.y, fontSize: el.size, color, opacity: 0.55, zIndex: 1 }}
      animate={isRotating ? { y: [0, -8, 0], rotate: [0, el.rotate ?? 360] } : { y: [0, -7, 0] }}
      transition={{
        duration: el.duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: el.delay,
        ...(isRotating ? { rotate: { duration: el.duration * 2, repeat: Infinity, ease: "linear" } } : {}),
      }}
    >
      {el.symbol}
    </motion.div>
  );
}

/* ─── Disability config ────────────────────────────────────────────────────── */
const DISABILITY_CONFIG: Record<
  string,
  {
    label: string;
    questName: string;
    description: string;
    duration: string;
    method: string;
    color: [string, string];
    floaters: FloatingEl[];
    icon: React.ReactNode;
    phases: { title: string; emoji: string; days: string; activities: string[] }[];
  }
> = {
  dyslexia: {
    label: "Dyslexia",
    questName: "Reading Quest",
    description: "Reading Support · 60 Day Plan",
    duration: "60 Days",
    method: "Interactive",
    color: ["#7C6FF7", "#A389F4"],
    icon: <BookOpen size={20} />,
    floaters: [
      { symbol: "📖", x: "68%", y: "12%", size: "16px", delay: 0, duration: 3.2 },
      { symbol: "🔤", x: "80%", y: "38%", size: "14px", delay: 0.5, duration: 2.8 },
      { symbol: "abc", x: "62%", y: "58%", size: "10px", delay: 1, duration: 3.5 },
      { symbol: "🧩", x: "74%", y: "75%", size: "14px", delay: 0.3, duration: 2.6 },
      { symbol: "📚", x: "88%", y: "20%", size: "14px", delay: 0.8, duration: 3 },
    ],
    phases: [
      {
        title: "Phonics Foundation",
        emoji: "🔤",
        days: "Days 1 – 20",
        activities: [
          "Letter Sound Matching Game",
          "Rhyme Builder Challenge",
          "Syllable Clapping Activity",
          "Word Bingo (Audio Cues)",
          "Alphabet Tracing with Sound",
        ],
      },
      {
        title: "Word Decoding",
        emoji: "🧩",
        days: "Days 21 – 40",
        activities: [
          "Word Puzzle Tiles",
          "Sight Word Flash Cards",
          "Sentence Assembly Game",
          "Story Completion Quest",
          "Reading Speed Races",
        ],
      },
      {
        title: "Fluency & Comprehension",
        emoji: "🚀",
        days: "Days 41 – 60",
        activities: [
          "Audio Story + Quiz Game",
          "Word Hunt Adventure",
          "Reading Rocket Challenge",
          "Comprehension Map Builder",
          "Book Report Mini-Game",
        ],
      },
    ],
  },
  dyscalculia: {
    label: "Dyscalculia",
    questName: "Math Adventure",
    description: "Number Skills · 60 Day Plan",
    duration: "60 Days",
    method: "Visual",
    color: ["#2E7D32", "#66BB6A"],
    icon: <Calculator size={20} />,
    floaters: [
      { symbol: "🔢", x: "65%", y: "10%", size: "16px", delay: 0, duration: 3 },
      { symbol: "+−", x: "78%", y: "30%", size: "14px", delay: 0.5, duration: 2.8 },
      { symbol: "🧮", x: "68%", y: "55%", size: "16px", delay: 0.9, duration: 3.4 },
      { symbol: "123", x: "85%", y: "18%", size: "11px", delay: 0.2, duration: 3 },
      { symbol: "⚡", x: "72%", y: "75%", size: "14px", delay: 0.7, duration: 2.6 },
    ],
    phases: [
      {
        title: "Number Sense",
        emoji: "🔢",
        days: "Days 1 – 20",
        activities: [
          "Counting Objects Game",
          "Number Line Jump",
          "More or Less Challenge",
          "Shape & Pattern Sorter",
          "Visual Quantity Match",
        ],
      },
      {
        title: "Basic Operations",
        emoji: "⚡",
        days: "Days 21 – 40",
        activities: [
          "Addition Adventure Island",
          "Subtraction Spaceship",
          "Money Market Simulator",
          "Clock Reading Quest",
          "Math Fact Flashcards",
        ],
      },
      {
        title: "Applied Math",
        emoji: "🏆",
        days: "Days 41 – 60",
        activities: [
          "Word Problem Detective",
          "Multiplication Magic Forest",
          "Fraction Pizza Builder",
          "Measurement Lab",
          "Math Olympics Challenge",
        ],
      },
    ],
  },
  dysgraphia: {
    label: "Dysgraphia",
    questName: "Writing Wizard",
    description: "Handwriting Skills · 60 Day Plan",
    duration: "60 Days",
    method: "Hands-On",
    color: ["#FF7043", "#FFA07A"],
    icon: <PenTool size={20} />,
    floaters: [
      { symbol: "✏️", x: "66%", y: "8%", size: "16px", delay: 0, duration: 2.5 },
      { symbol: "✋", x: "80%", y: "30%", size: "16px", delay: 0.4, duration: 3 },
      { symbol: "🌟", x: "68%", y: "55%", size: "14px", delay: 0.8, duration: 2.8 },
      { symbol: "📝", x: "86%", y: "18%", size: "14px", delay: 0.2, duration: 3.5 },
      { symbol: "✍️", x: "74%", y: "75%", size: "14px", delay: 1.1, duration: 2.6 },
    ],
    phases: [
      {
        title: "Fine Motor Warm-Up",
        emoji: "✋",
        days: "Days 1 – 20",
        activities: [
          "Dot-to-Dot Tracing Game",
          "Grip & Draw Challenge",
          "Maze Navigator",
          "Finger Yoga Exercises",
          "Clay Shape Sculptor",
        ],
      },
      {
        title: "Letter Formation",
        emoji: "✏️",
        days: "Days 21 – 40",
        activities: [
          "Letter Tracing Wizard",
          "Alphabet Writing Race",
          "Copy & Compare Game",
          "Word Spacing Trainer",
          "Lined Paper Adventure",
        ],
      },
      {
        title: "Writing Fluency",
        emoji: "🌟",
        days: "Days 41 – 60",
        activities: [
          "Sentence Builder Game",
          "Story Starters & Writing",
          "Dictation Challenge",
          "Handwriting Speed Test",
          "Creative Writing Quest",
        ],
      },
    ],
  },
};

/* ─── Per-phase distinct color themes ─────────────────────────────────────── */
const PHASE_THEMES: { color: [string, string]; floaters: FloatingEl[] }[] = [
  {
    color: ["#7C6FF7", "#A389F4"],
    floaters: [
      { symbol: "🧠", x: "68%", y: "12%", size: "16px", delay: 0, duration: 3.2 },
      { symbol: "⚡", x: "80%", y: "38%", size: "14px", delay: 0.5, duration: 2.8 },
      { symbol: "✨", x: "88%", y: "20%", size: "14px", delay: 0.8, duration: 3 },
    ],
  },
  {
    color: ["#0EA5E9", "#38BDF8"],
    floaters: [
      { symbol: "🎮", x: "68%", y: "12%", size: "16px", delay: 0, duration: 3 },
      { symbol: "🔬", x: "80%", y: "38%", size: "14px", delay: 0.4, duration: 2.8 },
      { symbol: "💡", x: "88%", y: "20%", size: "14px", delay: 0.7, duration: 3.2 },
    ],
  },
  {
    color: ["#E11D48", "#FB7185"],
    floaters: [
      { symbol: "🏆", x: "68%", y: "12%", size: "16px", delay: 0, duration: 2.8 },
      { symbol: "🚀", x: "80%", y: "38%", size: "14px", delay: 0.3, duration: 3.1 },
      { symbol: "🌟", x: "88%", y: "20%", size: "14px", delay: 0.9, duration: 2.6 },
    ],
  },
];

/* ─── Lesson Phase Card (matches reference exactly) ────────────────────────── */
function LessonPhaseCard({
  phase,
  index,
  locked,
  cfg,
  childName,
  onEndPath,
}: {
  phase: { title: string; emoji: string; days: string; activities: string[] };
  index: number;
  locked: boolean;
  cfg: (typeof DISABILITY_CONFIG)[string];
  childName: string;
  onEndPath: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const total = phase.activities.length;
  const lessonNumber = ["One", "Two", "Three"][index] ?? `${index + 1}`;
  const theme = PHASE_THEMES[index % PHASE_THEMES.length];
  const phaseColor = theme.color;
  const phaseFloaters = theme.floaters;
  const softColor = phaseColor[0] + "22";
  const pct = total > 0 ? Math.round((progress / total) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.09, type: "spring", stiffness: 110 }}
      className="bg-white rounded-3xl overflow-hidden shadow-md relative"
      style={{ border: "1px solid #EDEDF5" }}
    >
      {/* Top gradient line */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${phaseColor[0]}, ${phaseColor[1]})` }} />

      {/* Background decorative glow */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl" style={{ background: softColor }} />
      </div>

      {/* Floating animated symbols */}
      {phaseFloaters.map((el, i) => (
        <FloatingSymbol key={i} el={el} color={phaseColor[0]} />
      ))}

      {/* Card content */}
      <div className="p-4 relative z-10">
        {/* Top row: status badge + shield */}
        <div className="flex items-center justify-between mb-3">
          {locked ? (
            <div className="flex items-center gap-1.5 bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
              <Lock size={10} className="text-gray-400" />
              <span className="text-[10px] font-extrabold tracking-widest uppercase">Locked</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-[#E6F9EE] text-[#1DAF5A] px-3 py-1 rounded-full">
              <Zap size={10} className="fill-[#1DAF5A] text-[#1DAF5A]" />
              <span className="text-[10px] font-extrabold tracking-widest uppercase">Ready</span>
            </div>
          )}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "#F0EEFF" }}
          >
            <Shield size={16} style={{ color: phaseColor[0] }} />
          </motion.div>
        </div>

        {/* Title & subtitle */}
        <h3 className="text-[17px] font-extrabold text-[#1A1A2E] leading-tight mb-0.5">
          Lesson {lessonNumber}:{" "}
          <span style={{ color: phaseColor[0] }}>{phase.title}</span>
        </h3>
        <p className="text-[11px] text-gray-400 mb-4">
          {childName} &middot; {phase.days}
        </p>

        {/* Stat boxes */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 rounded-2xl px-3 py-2.5" style={{ background: "#F7F6FF", border: "1px solid #EDEDF5" }}>
            <div className="flex items-center gap-1 mb-1">
              <Clock size={10} className="text-gray-400" />
              <span className="text-[9px] font-extrabold tracking-widest text-gray-400 uppercase">Duration</span>
            </div>
            <p className="text-[13px] font-extrabold text-[#1A1A2E]">20 Days</p>
          </div>
          <div className="flex-1 rounded-2xl px-3 py-2.5" style={{ background: "#F7F6FF", border: "1px solid #EDEDF5" }}>
            <div className="flex items-center gap-1 mb-1">
              <BarChart2 size={10} className="text-gray-400" />
              <span className="text-[9px] font-extrabold tracking-widest text-gray-400 uppercase">Activities</span>
            </div>
            <p className="text-[13px] font-extrabold text-[#1A1A2E]">{total} Tasks</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Progress</span>
            <span className="text-[10px] font-extrabold" style={{ color: phaseColor[0] }}>{progress}/{total} · {pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${phaseColor[0]}, ${phaseColor[1]})` }}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Start / Locked button */}
        {locked ? (
          <button disabled className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-400 rounded-2xl py-3.5 cursor-not-allowed mb-2">
            <Lock size={14} />
            <span className="text-[13px] font-extrabold">Locked</span>
          </button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.01 }}
            onClick={() => setProgress((p) => Math.min(p + 1, total))}
            className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 relative overflow-hidden mb-2"
            style={{ background: "#1A1A2E" }}
          >
            <motion.div
              className="absolute inset-0 opacity-20"
              style={{ background: `linear-gradient(90deg, transparent, ${phaseColor[1]}, transparent)` }}
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 relative z-10"
              style={{ background: `linear-gradient(90deg, ${phaseColor[0]}, ${phaseColor[1]})` }}
            >
              <Play size={10} className="fill-white text-white ml-0.5" />
            </div>
            <span className="text-[13px] font-extrabold text-white tracking-wide relative z-10">
              Start Lesson
            </span>
          </motion.button>
        )}

        {/* End Path button */}
        <button
          onClick={() => {
            if (!confirm("End this learning path? This will remove the record.")) return;
            onEndPath();
          }}
          className="w-full flex items-center justify-center gap-2 rounded-2xl py-2.5 text-[12px] font-extrabold text-red-400 hover:text-red-600 hover:bg-red-50 border border-red-100 transition-colors"
        >
          <XCircle size={13} />
          End Path
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Pending Analysis Card ────────────────────────────────────────────────── */
function PendingCard({
  childName,
  age,
  gender,
  sessionId,
  reportUrl,
  delay,
  onAnalysisComplete,
  onEndPath,
}: {
  childName: string;
  age: number;
  gender: string;
  sessionId: string;
  reportUrl: string;
  delay: number;
  onAnalysisComplete: () => void;
  onEndPath: () => void;
}) {
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");

  const pendingFloaters: FloatingEl[] = [
    { symbol: "🔍", x: "68%", y: "12%", size: "16px", delay: 0, duration: 3.2 },
    { symbol: "🧠", x: "80%", y: "38%", size: "14px", delay: 0.5, duration: 2.8 },
    { symbol: "⚙️", x: "62%", y: "58%", size: "14px", delay: 1, duration: 3.5 },
    { symbol: "✨", x: "88%", y: "20%", size: "14px", delay: 0.8, duration: 3 },
    { symbol: "📊", x: "74%", y: "75%", size: "14px", delay: 0.3, duration: 2.6 },
  ];

  const runAnalysis = async () => {
    setRunning(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/predict/full_report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      });
      if (!res.ok) throw new Error("Pipeline failed");
      onAnalysisComplete();
    } catch {
      setError("Analysis failed. Make sure the Flask server is running.");
    } finally {
      setRunning(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 110 }}
      className="bg-white rounded-3xl overflow-hidden shadow-md relative"
      style={{ border: "1px solid #EDEDF5" }}
    >
      {/* Top gradient line */}
      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #F59E0B, #F97316)" }} />

      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl" style={{ background: "#F59E0B22" }} />
      </div>

      {/* Floating symbols */}
      {pendingFloaters.map((el, i) => (
        <FloatingSymbol key={i} el={el} color="#F59E0B" />
      ))}

      {/* Card content */}
      <div className="p-4 relative z-10">
        {/* Top row: badge + end path */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
            <Sparkles size={10} className="text-amber-600" />
            <span className="text-[10px] font-extrabold tracking-widest uppercase">
              Scan Needed
            </span>
          </div>
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 10 }}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "#FFF7ED" }}
            >
              <Shield size={16} className="text-amber-500" />
            </motion.div>
            <button
              onClick={() => {
                if (!confirm("End this child's learning path? This will remove the record.")) return;
                onEndPath();
              }}
              className="p-2 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="End Path"
            >
              <XCircle size={18} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-[17px] font-extrabold text-[#1A1A2E] leading-tight mb-0.5">
          AI Analysis:{" "}
          <span className="text-amber-600">{childName}</span>
        </h3>
        <p className="text-[11px] text-gray-400 mb-4">
          Age {age} &middot; {gender.charAt(0).toUpperCase() + gender.slice(1)} &middot; Pending Discovery
        </p>

        {/* Stat boxes */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 rounded-2xl px-3 py-2.5" style={{ background: "#F7F6FF", border: "1px solid #EDEDF5" }}>
            <div className="flex items-center gap-1 mb-1">
              <FileText size={10} className="text-gray-400" />
              <span className="text-[9px] font-extrabold tracking-widest text-gray-400 uppercase">
                Report
              </span>
            </div>
            <p className="text-[13px] font-extrabold text-[#1A1A2E]">Ready</p>
          </div>
          <div className="flex-1 rounded-2xl px-3 py-2.5" style={{ background: "#F7F6FF", border: "1px solid #EDEDF5" }}>
            <div className="flex items-center gap-1 mb-1">
              <BarChart2 size={10} className="text-gray-400" />
              <span className="text-[9px] font-extrabold tracking-widest text-gray-400 uppercase">
                Status
              </span>
            </div>
            <p className="text-[13px] font-extrabold text-amber-600">AI Pending</p>
          </div>
        </div>

        {/* View Report */}
        <a
          href={reportUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-4 py-3 rounded-2xl text-[13px] font-bold text-gray-500 hover:bg-amber-50 transition-colors mb-3"
          style={{ background: "#F7F6FF", border: "1px solid #EDEDF5" }}
        >
          <FileText size={14} className="text-amber-500" />
          View Existing Report
        </a>

        {error && (
          <p className="text-[11px] text-red-500 font-semibold mb-3 flex items-center gap-1">
            <XCircle size={12} /> {error}
          </p>
        )}

        {/* Launch Analysis button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.01 }}
          onClick={runAnalysis}
          disabled={running}
          className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 relative overflow-hidden disabled:opacity-60"
          style={{ background: "#1A1A2E" }}
        >
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{ background: "linear-gradient(90deg, transparent, #FFA07A, transparent)" }}
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <RefreshCw size={14} className={`text-white relative z-10 ${running ? "animate-spin" : ""}`} />
          <span className="text-[13px] font-extrabold text-white tracking-wide relative z-10">
            {running ? "Running AI Analysis…" : "Launch AI Analysis"}
          </span>
        </motion.button>

        <p className="text-center text-[9px] font-bold tracking-widest text-gray-300 uppercase mt-3">
          Powered by NeuroBloom AI
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Disability Quest Card (wraps lesson phase cards) ─────────────────────── */
function DisabilityCard({
  childName,
  age,
  gender,
  disability,
  reportUrl,
  delay,
  onEndPath,
}: {
  childName: string;
  age: number;
  gender: string;
  disability: string;
  reportUrl: string;
  delay: number;
  onEndPath: () => void;
  assessmentId: string;
}) {
  const cfg = DISABILITY_CONFIG[disability.toLowerCase()];
  if (!cfg) return null;

  const totalActivities = cfg.phases.reduce((s, p) => s + p.activities.length, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 220, damping: 22 }}
      className="space-y-5"
    >
      {/* Quest header card */}
      <div
        className="bg-white rounded-3xl overflow-hidden shadow-md relative"
        style={{ border: "1px solid #EDEDF5" }}
      >
        <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${cfg.color[0]}, ${cfg.color[1]})` }} />

        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl" style={{ background: cfg.color[0] + "22" }} />
        </div>

        {cfg.floaters.map((el, i) => (
          <FloatingSymbol key={i} el={el} color={cfg.color[0]} />
        ))}

        <div className="p-5 relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 bg-[#E6F9EE] text-[#1DAF5A] px-3 py-1 rounded-full">
              <Zap size={10} className="fill-[#1DAF5A] text-[#1DAF5A]" />
              <span className="text-[10px] font-extrabold tracking-widest uppercase">Quest Active</span>
            </div>
            <div className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: "#F0EEFF" }}
              >
                <Shield size={16} style={{ color: cfg.color[0] }} />
              </motion.div>
            </div>
          </div>

          <h3 className="text-[19px] font-extrabold text-[#1A1A2E] leading-tight mb-0.5">
            {cfg.questName}:{" "}
            <span style={{ color: cfg.color[0] }}>{childName}</span>
          </h3>
          <p className="text-[11px] text-gray-400 mb-4">
            {cfg.description} &middot; Age {age} &middot; {gender.charAt(0).toUpperCase() + gender.slice(1)}
          </p>

          {/* Stat boxes */}
          <div className="flex gap-2 mb-4">
            <div className="flex-1 rounded-2xl px-3 py-2.5" style={{ background: "#F7F6FF", border: "1px solid #EDEDF5" }}>
              <div className="flex items-center gap-1 mb-1">
                <Clock size={10} className="text-gray-400" />
                <span className="text-[9px] font-extrabold tracking-widest text-gray-400 uppercase">Duration</span>
              </div>
              <p className="text-[13px] font-extrabold text-[#1A1A2E]">{cfg.duration}</p>
            </div>
            <div className="flex-1 rounded-2xl px-3 py-2.5" style={{ background: "#F7F6FF", border: "1px solid #EDEDF5" }}>
              <div className="flex items-center gap-1 mb-1">
                <BarChart2 size={10} className="text-gray-400" />
                <span className="text-[9px] font-extrabold tracking-widest text-gray-400 uppercase">Activities</span>
              </div>
              <p className="text-[13px] font-extrabold text-[#1A1A2E]">{totalActivities} Tasks</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Overall Progress</span>
              <span className="text-[10px] font-extrabold" style={{ color: cfg.color[0] }}>0/{totalActivities} · 0%</span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full rounded-full w-0 transition-all" style={{ background: `linear-gradient(90deg, ${cfg.color[0]}, ${cfg.color[1]})` }} />
            </div>
          </div>

          {/* View Report */}
          <a
            href={reportUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-3 rounded-2xl text-[13px] font-bold text-gray-500 hover:bg-gray-50 transition-colors mb-3"
            style={{ background: "#F7F6FF", border: "1px solid #EDEDF5" }}
          >
            <FileText size={14} style={{ color: cfg.color[0] }} />
            View Full Report
          </a>

          {/* Start Quest button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.01 }}
            className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 relative overflow-hidden"
            style={{ background: "#1A1A2E" }}
          >
            <motion.div
              className="absolute inset-0 opacity-20"
              style={{ background: `linear-gradient(90deg, transparent, ${cfg.color[1]}, transparent)` }}
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 relative z-10"
              style={{ background: `linear-gradient(90deg, ${cfg.color[0]}, ${cfg.color[1]})` }}
            >
              <Play size={10} className="fill-white text-white ml-0.5" />
            </div>
            <span className="text-[13px] font-extrabold text-white tracking-wide relative z-10">Start Quest</span>
          </motion.button>
        </div>
      </div>

      {/* Phase lesson cards — 3-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cfg.phases.map((phase, i) => (
          <LessonPhaseCard
            key={i}
            phase={phase}
            index={i}
            locked={i > 0}
            cfg={cfg}
            childName={childName}
            onEndPath={onEndPath}
          />
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Filter pill tabs ─────────────────────────────────────────────────────── */
const FILTERS = ["All", "Dyslexia", "Dyscalculia", "Dysgraphia", "Pending"];

/* ─── Main Page ────────────────────────────────────────────────────────────── */
export default function PersonalisedPathPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/assessments")
      .then((r) => r.json())
      .then((data: Assessment[]) => {
        setAssessments(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const withReports = assessments.filter((a) => a.report_url);

  const withDisabilities = withReports.filter(
    (a) => Array.isArray(a.disabilities) && a.disabilities.length > 0
  );
  const pendingAnalysis = withReports.filter(
    (a) => !Array.isArray(a.disabilities) || a.disabilities.length === 0
  );

  const cards = withDisabilities.flatMap((a) =>
    (a.disabilities as string[]).map((d) => ({ ...a, disability: d }))
  );

  // Filter + search logic
  const filteredCards =
    filter === "All" || filter === "Pending"
      ? cards
      : cards.filter((c) => c.disability.toLowerCase() === filter.toLowerCase());

  const searchFiltered = search
    ? filteredCards.filter(
        (c) =>
          c.child_name.toLowerCase().includes(search.toLowerCase()) ||
          c.disability.toLowerCase().includes(search.toLowerCase())
      )
    : filteredCards;

  const showPending = filter === "All" || filter === "Pending";
  const searchPending = search
    ? pendingAnalysis.filter((a) =>
        a.child_name.toLowerCase().includes(search.toLowerCase())
      )
    : pendingAnalysis;

  const totalCards = cards.length + pendingAnalysis.length;

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/assessments/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        alert(`Delete failed: ${body.error ?? res.statusText}`);
        return;
      }
      setAssessments((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert("Delete failed: network error. Check your connection.");
    }
  };

  const visibleFilters = FILTERS.filter((f) => {
    if (f === "Pending") return pendingAnalysis.length > 0;
    if (f === "All") return true;
    return cards.some((c) => c.disability.toLowerCase() === f.toLowerCase());
  });

  return (
    <div className="h-screen w-full bg-[#F5F2FF] text-slate-900 flex overflow-hidden">
      {/* ─ Sidebar ─ */}
      <aside className="w-20 lg:w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Activity className="text-white w-5 h-5" />
          </div>
          <span className="hidden lg:block font-extrabold text-lg tracking-tight text-slate-800">NeuroBloom</span>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          <Link href="/dashboard"><NavItem icon={<LayoutDashboard size={18} />} label="Overview" /></Link>
          <Link href="/assessments"><NavItem icon={<FileText size={18} />} label="Reports" /></Link>
          <Link href="/patients"><NavItem icon={<Users size={18} />} label="Patient List" /></Link>
          <Link href="/analytics"><NavItem icon={<TrendingUp size={18} />} label="Analytics" /></Link>
          <Link href="/personalised-path"><NavItem icon={<Compass size={18} />} label="Personalised Path" active /></Link>
        </nav>

        <div className="p-3 border-t border-slate-100 space-y-1">
          <NavItem icon={<Settings size={18} />} label="Settings" />
          <NavItem icon={<HelpCircle size={18} />} label="Support" />
        </div>
      </aside>

      {/* ─ Main Content ─ */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F5F2FF]">
        {/* ─ Page Header ─ */}
        <div className="px-8 pt-8 pb-5 border-b border-slate-200/60 bg-white/60 backdrop-blur">
          <h1 className="text-2xl font-extrabold text-[#1A1A2E] mb-0.5">Personalised Paths</h1>
          <p className="text-sm text-gray-400 mb-5">
            {totalCards} personalised {totalCards === 1 ? "quest" : "quests"} ready to explore
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-white rounded-2xl px-4 py-2.5 border border-[#EDEDF5] shadow-sm">
              <Search size={14} className="text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search child or condition…"
                className="w-52 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
            <button className="bg-white rounded-2xl p-2.5 border border-[#EDEDF5] shadow-sm hover:bg-gray-50 transition-colors">
              <SlidersHorizontal size={16} className="text-gray-500" />
            </button>
            <div className="flex gap-2 flex-wrap">
              {visibleFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wide transition-all ${
                    filter === f
                      ? "bg-[#7C6FF7] text-white shadow-md shadow-purple-200"
                      : "bg-white text-gray-500 border border-[#EDEDF5] hover:bg-gray-50"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Content area */}
        <div className="flex-1 overflow-y-auto px-8 pb-28" style={{ scrollbarWidth: "none" }}>
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-24 gap-3"
              >
                <span className="text-5xl animate-pulse">🧠</span>
                <p className="text-[13px] font-bold text-gray-400">Loading learning paths...</p>
              </motion.div>
            ) : totalCards === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16 gap-3"
              >
                <span className="text-5xl">🎮</span>
                <h4 className="text-lg font-extrabold text-gray-600">No Quests Yet</h4>
                <p className="text-[13px] text-gray-400 max-w-sm text-center leading-relaxed">
                  Personalised learning quests will appear here once a child&apos;s test report is generated.
                </p>
              </motion.div>
            ) : (
              <motion.div key="list" className="space-y-10 max-w-6xl mx-auto pt-6">
                {searchFiltered.map((card, i) => (
                  <DisabilityCard
                    key={`${card.id}-${card.disability}`}
                    assessmentId={card.id}
                    childName={card.child_name}
                    age={card.age}
                    gender={card.gender}
                    disability={card.disability}
                    reportUrl={card.report_url}
                    delay={i * 0.07}
                    onEndPath={() => handleDelete(card.id)}
                  />
                ))}
                {showPending && searchPending.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {searchPending.map((a, i) => (
                      <PendingCard
                        key={`pending-${a.id}`}
                        childName={a.child_name}
                        age={a.age}
                        gender={a.gender}
                        sessionId={a.id}
                        reportUrl={a.report_url}
                        delay={(searchFiltered.length + i) * 0.07}
                        onEndPath={() => handleDelete(a.id)}
                        onAnalysisComplete={() => {
                          setLoading(true);
                          fetch("/api/assessments")
                            .then((r) => r.json())
                            .then((data: Assessment[]) => { setAssessments(data); setLoading(false); })
                            .catch(() => setLoading(false));
                        }}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="h-10 bg-white/60 backdrop-blur border-t border-slate-200/50 px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-gray-400">System Online</span>
          </div>
          <span className="text-xs text-gray-300 font-bold">NeuroBloom v4.0</span>
        </footer>
      </main>
    </div>
  );
}

/* ─── Nav Item ─────────────────────────────────────────────────────────────── */
function NavItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer transition-all ${
        active
          ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm"
          : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
      }`}
    >
      <span className={active ? "text-indigo-600" : "text-slate-400"}>{icon}</span>
      <span className={`hidden lg:block text-sm ${active ? "font-bold" : "font-semibold"}`}>{label}</span>
    </div>
  );
}
