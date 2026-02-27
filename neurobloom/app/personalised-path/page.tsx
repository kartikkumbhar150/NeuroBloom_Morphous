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

  const gradColor0 = cfg?.color[0] ?? "#7C6FF7";
  const gradColor1 = cfg?.color[1] ?? "#A389F4";

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

  const statusStyles: Record<CardStatus, { label: string; textCls: string; bgCls: string }> = {
    idle: { label: "Not Started", textCls: "text-muted-foreground", bgCls: "bg-muted" },
    running: { label: "Running", textCls: "text-blue-600", bgCls: "bg-blue-50 dark:bg-blue-950/40" },
    complete: { label: "Complete", textCls: "text-emerald-600", bgCls: "bg-emerald-50 dark:bg-emerald-950/40" },
  };
  const ss = statusStyles[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 110 }}
      className="bg-card rounded-3xl overflow-hidden shadow-md relative border border-border"
    >
      {/* Top gradient bar */}
      <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${gradColor0}, ${gradColor1})` }} />

      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl" style={{ background: gradColor0 + "18" }} />
      </div>

      {/* Floating decorative symbols */}
      {cfg?.floaters.slice(0, 3).map((el, i) => (
        <FloatingSymbol key={i} el={el} color={gradColor0} />
      ))}

      <div className="p-5 relative z-10 space-y-4">
        {/* Status badge + End button */}
        <div className="flex items-center justify-between">
          <span className={`text-[10px] font-extrabold tracking-widest uppercase px-3 py-1 rounded-full flex items-center gap-1.5 ${ss.bgCls} ${ss.textCls}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
            {ss.label}
          </span>
          <button
            onClick={() => {
              if (confirm(`End learning path for ${childName}?`)) onEndPath();
            }}
            className="px-3 py-1.5 rounded-xl text-[11px] font-bold text-red-400 hover:text-red-600 hover:bg-red-50 border border-red-100 transition-colors flex items-center gap-1.5"
          >
            <XCircle size={12} />
            End
          </button>
        </div>

        {/* Child name */}
        <div>
          <h3 className="text-[20px] font-extrabold text-foreground leading-tight">{childName}</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Age {age} &middot; {gender.charAt(0).toUpperCase() + gender.slice(1)}
            {isPending && <span className="ml-2 text-purple-500 font-bold">(AI Pending)</span>}
          </p>
        </div>

        {/* Disability type */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-bold text-muted-foreground">Disability type:</span>
          <span
            className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full"
            style={{ background: gradColor0 + "22", color: gradColor0 }}
          >
            {cfg?.label ?? disability}
          </span>
          {isPending && (
            <span className="text-[9px] font-bold text-muted-foreground italic">(predicted)</span>
          )}
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">Progress</span>
            <span className="text-[10px] font-extrabold" style={{ color: gradColor0 }}>
              {progress}/{totalActivities} &middot; {pct}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${gradColor0}, ${gradColor1})` }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Date boxes */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-muted rounded-2xl px-3 py-2.5 border border-border">
            <div className="flex items-center gap-1 mb-1">
              <Calendar size={9} className="text-muted-foreground" />
              <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest">Created</span>
            </div>
            <p className="text-[11px] font-extrabold text-foreground">{fmtDate(createdAt)}</p>
          </div>
          <div className="bg-muted rounded-2xl px-3 py-2.5 border border-border">
            <div className="flex items-center gap-1 mb-1">
              <Play size={9} className="text-muted-foreground" />
              <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest">Started</span>
            </div>
            <p className="text-[11px] font-extrabold text-foreground">{fmtDate(startDate)}</p>
          </div>
          <div className="bg-muted rounded-2xl px-3 py-2.5 border border-border">
            <div className="flex items-center gap-1 mb-1">
              <CheckCircle size={9} className="text-muted-foreground" />
              <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest">
                {status === "complete" ? "Completed" : "End Date"}
              </span>
            </div>
            <p className="text-[11px] font-extrabold text-foreground">{fmtDate(endDate)}</p>
          </div>
        </div>

        {/* View Report */}
        {reportUrl ? (
          <a
            href={reportUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-3 rounded-2xl text-[13px] font-bold text-muted-foreground hover:bg-muted/80 transition-colors bg-muted border border-border"
          >
            <FileText size={14} style={{ color: gradColor0 }} />
            View Report
          </a>
        ) : (
          <div className="flex items-center gap-2 px-4 py-3 rounded-2xl text-[13px] font-bold text-muted-foreground bg-muted border border-border opacity-50 cursor-not-allowed">
            <FileText size={14} className="text-muted-foreground" />
            No Report Yet
          </div>
        )}

        {/* Action button */}
        {status === "idle" && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.01 }}
            onClick={handleStart}
            className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 relative overflow-hidden"
            style={{ background: "#1A1A2E" }}
          >
            <motion.div
              className="absolute inset-0 opacity-20"
              style={{ background: `linear-gradient(90deg, transparent, ${gradColor1}, transparent)` }}
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 relative z-10"
              style={{ background: `linear-gradient(90deg, ${gradColor0}, ${gradColor1})` }}
            >
              <Play size={10} className="fill-white text-white ml-0.5" />
            </div>
            <span className="text-[13px] font-extrabold text-white tracking-wide relative z-10">Start</span>
          </motion.button>
        )}

        {status === "running" && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.01 }}
            onClick={handleComplete}
            className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            <RefreshCw size={14} className="animate-spin" />
            <span className="text-[13px] font-extrabold tracking-wide">Running… Mark Complete</span>
          </motion.button>
        )}

        {status === "complete" && (
          <div className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 bg-emerald-500 text-white">
            <CheckCircle size={14} />
            <span className="text-[13px] font-extrabold tracking-wide">Completed!</span>
          </div>
        )}
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
    <div className="h-screen w-full bg-background text-foreground flex overflow-hidden">
      {/* ─ Sidebar ─ */}
      <aside className="w-20 lg:w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Activity className="text-primary-foreground w-5 h-5" />
          </div>
          <span className="hidden lg:block font-extrabold text-lg tracking-tight text-foreground">NeuroBloom</span>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          <Link href="/dashboard"><NavItem icon={<LayoutDashboard size={18} />} label="Overview" /></Link>
          <Link href="/assessments"><NavItem icon={<FileText size={18} />} label="Reports" /></Link>
          <Link href="/patients"><NavItem icon={<Users size={18} />} label="Patient List" /></Link>
          <Link href="/analytics"><NavItem icon={<TrendingUp size={18} />} label="Analytics" /></Link>
          <Link href="/personalised-path"><NavItem icon={<Compass size={18} />} label="Personalised Path" active /></Link>
        </nav>

        <div className="p-3 border-t border-border space-y-1">
          <NavItem icon={<Settings size={18} />} label="Settings" />
          <NavItem icon={<HelpCircle size={18} />} label="Support" />
        </div>
      </aside>

      {/* ─ Main Content ─ */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
        {/* ─ Page Header ─ */}
        <div className="px-8 pt-10 pb-4 flex-shrink-0 bg-background">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[22px] font-extrabold text-foreground leading-tight">Personalised Paths</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {totalCards} personalised {totalCards === 1 ? "quest" : "quests"} ready to explore
              </p>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap mt-4">
            <div className="flex items-center gap-2 bg-card rounded-2xl px-4 py-2.5 border border-border shadow-sm">
              <Search size={14} className="text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search child or condition…"
                className="w-52 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <button className="bg-card rounded-2xl p-2.5 border border-border shadow-sm hover:bg-muted transition-colors">
              <SlidersHorizontal size={16} className="text-muted-foreground" />
            </button>
            <div className="flex gap-2 flex-wrap">
              {visibleFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wide transition-all ${
                    filter === f
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "bg-card text-muted-foreground border border-border hover:bg-muted"
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
                <p className="text-[13px] font-bold text-muted-foreground">Loading learning paths...</p>
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
                <h4 className="text-lg font-extrabold text-foreground">No Quests Yet</h4>
                <p className="text-[13px] text-muted-foreground max-w-sm text-center leading-relaxed">
                  Personalised learning quests will appear here once a child&apos;s test report is generated.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 max-w-7xl mx-auto pt-6"
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
        <footer className="h-10 bg-card/60 backdrop-blur border-t border-border px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-muted-foreground">System Online</span>
          </div>
          <span className="text-xs text-muted-foreground font-bold">NeuroBloom v4.0</span>
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
          ? "bg-primary/10 text-primary shadow-sm"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <span className={active ? "text-primary" : "text-muted-foreground"}>{icon}</span>
      <span className={`hidden lg:block text-sm ${active ? "font-bold" : "font-semibold"}`}>{label}</span>
    </div>
  );
}
