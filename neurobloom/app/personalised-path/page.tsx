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
  CheckCircle,
  Search,
  SlidersHorizontal,
  Clock,
  BarChart2,
  Calendar,
} from "lucide-react";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    color: ["#7C6FF7", "#A389F4"],
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

/* ─── Seeded disability helper (stable random per assessment ID) ────────────── */
const DISABILITY_LIST = ["dyslexia", "dyscalculia", "dysgraphia"] as const;

function seededDisability(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0;
  }
  return DISABILITY_LIST[Math.abs(hash) % DISABILITY_LIST.length];
}

/* ─── Assessment Card ──────────────────────────────────────────────────────── */
type CardStatus = "idle" | "running" | "complete";

function AssessmentCard({
  childName,
  age,
  gender,
  disability,
  isPending,
  reportUrl,
  createdAt,
  delay,
  onEndPath,
}: {
  childName: string;
  age: number;
  gender: string;
  disability: string;
  isPending: boolean;
  reportUrl: string;
  createdAt?: string;
  delay: number;
  onEndPath: () => void;
}) {
  const [status, setStatus] = useState<CardStatus>("idle");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const cfg = DISABILITY_CONFIG[disability.toLowerCase()];
  const totalActivities = cfg?.phases.reduce((s, p) => s + p.activities.length, 0) ?? 15;
  const pct = totalActivities > 0 ? Math.round((progress / totalActivities) * 100) : 0;

  const gradColor0 = cfg?.color[0] ?? "#E52521";

  const fmtDate = (d: string | null | undefined) => {
    if (!d) return "—";
    try {
      return new Date(d).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  };

  const handleStart = () => {
    setStatus("running");
    setStartDate(new Date().toISOString());
  };

  const handleComplete = () => {
    setStatus("complete");
    setEndDate(new Date().toISOString());
    setProgress(totalActivities);
  };

  const statusStyles: Record<CardStatus, { label: string; variant: string; color: string }> = {
    idle: { label: "Ready", variant: "bg-accent", color: "text-black" },
    running: { label: "Playing", variant: "bg-secondary", color: "text-white" },
    complete: { label: "Finished", variant: "bg-[#43B047]", color: "text-white" },
  };
  const ss = statusStyles[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 110 }}
      className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative group hover:translate-y-[-4px] transition-all"
    >
      {/* Top bar */}
      <div className="h-2 w-full bg-primary" />

      {/* Floating symbols */}
      {cfg?.floaters.slice(0, 3).map((el, i) => (
        <FloatingSymbol key={i} el={el} color={gradColor0} />
      ))}

      <div className="p-6 relative z-10 space-y-6">
        {/* Status badge */}
        <div className="flex items-center justify-between">
          <div className={`px-4 py-1 border-2 border-black ${ss.variant} ${ss.color} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>
            <span className="text-xs font-black uppercase tracking-widest">{ss.label}</span>
          </div>
          <button
            onClick={() => {
              if (confirm(`End learning path for ${childName}?`)) onEndPath();
            }}
            className="text-primary hover:scale-110 transition-transform"
          >
            <XCircle size={20} />
          </button>
        </div>

        {/* Child Info */}
        <div>
          <h3 className="text-2xl font-black text-black uppercase italic tracking-tighter leading-none">{childName}</h3>
          <p className="text-xs font-black text-black/40 mt-1 uppercase tracking-widest">
            Age {age} &middot; {gender}
            {isPending && <span className="ml-2 text-primary">(AI Pending)</span>}
          </p>
        </div>

        {/* Disability Type */}
        <div className="bg-muted border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3">
          <div className="bg-white border-2 border-black p-1.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
            {cfg?.icon}
          </div>
          <div>
            <p className="text-[10px] font-black text-black/40 uppercase tracking-widest leading-none mb-1">Condition</p>
            <p className="text-sm font-black text-black uppercase">{cfg?.label ?? disability}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-black/40 uppercase tracking-widest">Quest Progress</span>
            <span className="text-[10px] font-black text-black uppercase">
              {progress}/{totalActivities} &middot; {pct}%
            </span>
          </div>
          <div className="h-4 border-2 border-black bg-muted overflow-hidden shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.1)]">
            <motion.div
              className="h-full bg-secondary border-r-2 border-black"
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted border-2 border-black p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-[9px] font-black text-black/40 uppercase leading-none mb-1">Started</p>
            <p className="text-[10px] font-black text-black uppercase">{fmtDate(startDate)}</p>
          </div>
          <div className="bg-muted border-2 border-black p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-[9px] font-black text-black/40 uppercase leading-none mb-1">Target</p>
            <p className="text-[10px] font-black text-black uppercase">{fmtDate(endDate)}</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 space-y-3">
          {reportUrl && (
            <Button
              variant="outline"
              className="w-full text-xs py-5 uppercase tracking-widest"
              asChild
            >
              <a href={reportUrl} target="_blank">
                <FileText size={14} className="mr-2" />
                View Scroll
              </a>
            </Button>
          )}

          {status === "idle" && (
            <Button
              onClick={handleStart}
              className="w-full py-6 text-sm uppercase italic tracking-wider"
            >
              <Play size={14} className="fill-current" />
              Begin Quest
            </Button>
          )}

          {status === "running" && (
            <Button
              onClick={handleComplete}
              className="w-full py-6 text-sm bg-secondary text-white uppercase italic tracking-wider"
            >
              <RefreshCw size={14} className="animate-spin" />
              Continue Adventure
            </Button>
          )}

          {status === "complete" && (
            <div className="w-full py-3 bg-[#43B047] border-4 border-black text-white text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-sm font-black uppercase italic tracking-wider">Quest Cleared!</span>
            </div>
          )}
        </div>
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

  // Build unified card list — each assessment gets one card with a disability
  const allCards = assessments.flatMap((a) => {
    const hasDis = Array.isArray(a.disabilities) && a.disabilities.length > 0;
    if (hasDis) {
      return (a.disabilities as string[]).map((d) => ({
        ...a,
        disability: d,
        isPending: false,
      }));
    }
    return [{ ...a, disability: seededDisability(a.id), isPending: true }];
  });

  const filteredCards = (() => {
    let c = allCards;
    if (filter === "Pending") c = c.filter((x) => x.isPending);
    else if (filter !== "All")
      c = c.filter((x) => x.disability.toLowerCase() === filter.toLowerCase());
    if (search)
      c = c.filter(
        (x) =>
          x.child_name.toLowerCase().includes(search.toLowerCase()) ||
          x.disability.toLowerCase().includes(search.toLowerCase())
      );
    return c;
  })();

  const totalCards = allCards.length;

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
    if (f === "All") return true;
    if (f === "Pending") return allCards.some((x) => x.isPending);
    return allCards.some((x) => x.disability.toLowerCase() === f.toLowerCase());
  });

  return (
    <div className="h-screen w-full bg-background text-foreground flex overflow-hidden font-sans">
      <Sidebar />

      {/* ─ Main Content ─ */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
        {/* ─ Page Header ─ */}
        <div className="px-8 pt-10 pb-4 flex-shrink-0 bg-background">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-black uppercase italic tracking-tighter">Personalised Paths</h1>
              <p className="text-sm font-black text-black/40 mt-1 uppercase tracking-widest">
                {totalCards} {totalCards === 1 ? "Quest" : "Quests"} Unlocked
              </p>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
            </div>
          </div>
          
          <div className="flex items-center gap-4 flex-wrap mt-8">
            <div className="flex items-center gap-3 bg-white border-4 border-black px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-1 min-w-[300px]">
              <Search size={18} className="text-black" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Hero or Quest..."
                className="w-full bg-transparent text-sm font-black uppercase outline-none placeholder:text-black/20"
              />
            </div>
            
            <div className="flex gap-3 flex-wrap">
              {visibleFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-2 border-4 border-black text-xs font-black uppercase tracking-widest transition-all ${
                    filter === f
                      ? "bg-accent text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-y-[-2px]"
                      : "bg-white text-black hover:bg-muted active:translate-y-[2px] active:shadow-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto px-8 pb-28 pt-6">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-24 gap-6"
              >
                <div className="w-20 h-20 bg-accent border-4 border-black rounded-lg flex items-center justify-center animate-bounce shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-4xl font-black text-black">?</span>
                </div>
                <p className="text-xl font-black text-black uppercase italic tracking-widest">Loading World...</p>
              </motion.div>
            ) : totalCards === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16 gap-6"
              >
                <div className="text-8xl">🎮</div>
                <h4 className="text-3xl font-black text-black uppercase italic">No Quests Found</h4>
                <p className="text-sm font-bold text-black/40 max-w-sm text-center uppercase tracking-widest">
                  Finish an assessment to unlock your personalized learning adventure!
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto"
              >
                {filteredCards.map((card, i) => (
                  <AssessmentCard
                    key={`${card.id}-${card.disability}`}
                    childName={card.child_name}
                    age={card.age}
                    gender={card.gender}
                    disability={card.disability}
                    isPending={card.isPending}
                    reportUrl={card.report_url}
                    createdAt={card.created_at}
                    delay={i * 0.05}
                    onEndPath={() => handleDelete(card.id)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="h-12 bg-white border-t-4 border-black px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#43B047] border border-black animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest">System Online</span>
          </div>
          <span className="text-xs text-black/40 font-black uppercase tracking-widest">NeuroBloom v4.0</span>
        </footer>
      </main>
    </div>
  );
}
