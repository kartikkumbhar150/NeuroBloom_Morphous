"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
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
  Sparkles,
  Search,
  SlidersHorizontal,
  Shield,
  Zap,
  Clock,
  BarChart2,
  User,
  Calendar,
  CheckCircle2,
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

/* â”€â”€â”€ Floating symbol element â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
interface FloatingEl {
  symbol: string;
  x: string;
  y: string;
  size: string;
  delay: number;
  duration: number;
  rotate?: number;
}

function FloatingSymbol({ el, className }: { el: FloatingEl; className?: string }) {
  const isRotating = el.rotate !== undefined;
  return (
    <motion.div
      className={`absolute pointer-events-none select-none font-extrabold ${className ?? ""}`}
      style={{ left: el.x, top: el.y, fontSize: el.size, opacity: 0.55, zIndex: 1 }}
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

/* â”€â”€â”€ Disability config â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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
    description: "Reading Support Â· 60 Day Plan",
    duration: "60 Days",
    method: "Interactive",
    color: ["#7C6FF7", "#A389F4"],
    icon: <BookOpen size={20} />,
    floaters: [
      { symbol: "ðŸ“–", x: "68%", y: "12%", size: "16px", delay: 0, duration: 3.2 },
      { symbol: "ðŸ”¤", x: "80%", y: "38%", size: "14px", delay: 0.5, duration: 2.8 },
      { symbol: "abc", x: "62%", y: "58%", size: "10px", delay: 1, duration: 3.5 },
      { symbol: "ðŸ§©", x: "74%", y: "75%", size: "14px", delay: 0.3, duration: 2.6 },
      { symbol: "ðŸ“š", x: "88%", y: "20%", size: "14px", delay: 0.8, duration: 3 },
    ],
    phases: [
      {
        title: "Phonics Foundation",
        emoji: "ðŸ”¤",
        days: "Days 1 â€“ 20",
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
        emoji: "ðŸ§©",
        days: "Days 21 â€“ 40",
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
        emoji: "ðŸš€",
        days: "Days 41 â€“ 60",
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
    description: "Number Skills Â· 60 Day Plan",
    duration: "60 Days",
    method: "Visual",
    color: ["#2E7D32", "#66BB6A"],
    icon: <Calculator size={20} />,
    floaters: [
      { symbol: "ðŸ”¢", x: "65%", y: "10%", size: "16px", delay: 0, duration: 3 },
      { symbol: "+âˆ’", x: "78%", y: "30%", size: "14px", delay: 0.5, duration: 2.8 },
      { symbol: "ðŸ§®", x: "68%", y: "55%", size: "16px", delay: 0.9, duration: 3.4 },
      { symbol: "123", x: "85%", y: "18%", size: "11px", delay: 0.2, duration: 3 },
      { symbol: "âš¡", x: "72%", y: "75%", size: "14px", delay: 0.7, duration: 2.6 },
    ],
    phases: [
      {
        title: "Number Sense",
        emoji: "ðŸ”¢",
        days: "Days 1 â€“ 20",
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
        emoji: "âš¡",
        days: "Days 21 â€“ 40",
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
        emoji: "ðŸ†",
        days: "Days 41 â€“ 60",
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
    description: "Handwriting Skills Â· 60 Day Plan",
    duration: "60 Days",
    method: "Hands-On",
    color: ["#FF7043", "#FFA07A"],
    icon: <PenTool size={20} />,
    floaters: [
      { symbol: "âœï¸", x: "66%", y: "8%", size: "16px", delay: 0, duration: 2.5 },
      { symbol: "âœ‹", x: "80%", y: "30%", size: "16px", delay: 0.4, duration: 3 },
      { symbol: "ðŸŒŸ", x: "68%", y: "55%", size: "14px", delay: 0.8, duration: 2.8 },
      { symbol: "ðŸ“", x: "86%", y: "18%", size: "14px", delay: 0.2, duration: 3.5 },
      { symbol: "âœï¸", x: "74%", y: "75%", size: "14px", delay: 1.1, duration: 2.6 },
    ],
    phases: [
      {
        title: "Fine Motor Warm-Up",
        emoji: "âœ‹",
        days: "Days 1 â€“ 20",
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
        emoji: "âœï¸",
        days: "Days 21 â€“ 40",
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
        emoji: "ðŸŒŸ",
        days: "Days 41 â€“ 60",
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

/* â”€â”€â”€ Path Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
type PathStatus = "not_started" | "running" | "complete";

const DISABILITY_TYPES_LIST = ["dyslexia", "dyscalculia", "dysgraphia"] as const;

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) & 0xffff;
  return h;
}

function PathCard({
  assessmentId,
  childName,
  age,
  gender,
  disability,
  reportUrl,
  createdAt,
  delay,
  onEndPath,
  onAnalysisComplete,
}: {
  assessmentId: string;
  childName: string;
  age: number;
  gender: string;
  disability: string | null;
  reportUrl: string;
  createdAt?: string;
  delay: number;
  onEndPath: () => void;
  onAnalysisComplete?: () => void;
}) {
  const [status, setStatus] = useState<PathStatus>("not_started");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [progress, setProgress] = useState(0);
  const [runningAnalysis, setRunningAnalysis] = useState(false);
  const [analysisError, setAnalysisError] = useState("");

  // Stable random disability if not provided
  const resolvedDisability =
    disability ?? DISABILITY_TYPES_LIST[hashId(assessmentId) % 3];
  const cfg = DISABILITY_CONFIG[resolvedDisability.toLowerCase()];
  const isPending = !disability;
  const totalActivities = cfg
    ? cfg.phases.reduce((s, p) => s + p.activities.length, 0)
    : 15;
  const pct = totalActivities > 0 ? Math.round((progress / totalActivities) * 100) : 0;

  const handleStart = () => {
    setStatus("running");
    setStartDate(new Date());
  };

  const handleProgress = () => {
    if (status !== "running") return;
    const next = Math.min(progress + 1, totalActivities);
    setProgress(next);
    if (next >= totalActivities) {
      setStatus("complete");
      setEndDate(new Date());
    }
  };

  const runAnalysis = async () => {
    setRunningAnalysis(true);
    setAnalysisError("");
    try {
      const res = await fetch("http://localhost:5000/predict/full_report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: assessmentId }),
      });
      if (!res.ok) throw new Error("Pipeline failed");
      onAnalysisComplete?.();
    } catch {
      setAnalysisError("Analysis failed. Make sure the Flask server is running.");
    } finally {
      setRunningAnalysis(false);
    }
  };

  const fmt = (d: Date | null, fallbackIso?: string) => {
    if (!d && fallbackIso) {
      try {
        return new Date(fallbackIso).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      } catch {
        return "â€”";
      }
    }
    if (!d) return "â€”";
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  const statusConfig = {
    not_started: {
      label: "Not Started",
      bg: "bg-muted",
      text: "text-muted-foreground",
      dot: "bg-muted-foreground",
    },
    running: {
      label: "Running",
      bg: "bg-primary/10",
      text: "text-primary",
      dot: "bg-primary animate-pulse",
    },
    complete: {
      label: "Completed",
      bg: "bg-emerald-50 dark:bg-emerald-950",
      text: "text-emerald-700 dark:text-emerald-400",
      dot: "bg-emerald-500",
    },
  };
  const sc = statusConfig[status];

  const floaters: FloatingEl[] = cfg?.floaters.slice(0, 3) ?? [
    { symbol: "ðŸ”", x: "70%", y: "10%", size: "16px", delay: 0, duration: 3 },
    { symbol: "ðŸ§ ", x: "82%", y: "35%", size: "14px", delay: 0.5, duration: 2.8 },
    { symbol: "âœ¨", x: "88%", y: "18%", size: "14px", delay: 0.8, duration: 3 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 120, damping: 18 }}
      className="bg-card rounded-3xl overflow-hidden shadow-md relative border border-border"
    >
      {/* Top accent line */}
      <div className="h-1 w-full bg-primary" />

      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl bg-primary/10" />
      </div>

      {/* Floating symbols */}
      {floaters.map((el, i) => (
        <FloatingSymbol key={i} el={el} className="text-primary" />
      ))}

      <div className="p-5 relative z-10">
        {/* â”€â”€ Status badge + End button â”€â”€ */}
        <div className="flex items-center justify-between mb-4">
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${sc.bg}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
            <span className={`text-[10px] font-extrabold tracking-widest uppercase ${sc.text}`}>
              {sc.label}
            </span>
          </div>
          <button
            onClick={() => {
              if (!confirm("End this learning path? This will remove the record.")) return;
              onEndPath();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-extrabold text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-100 dark:border-red-900/40 transition-colors"
          >
            <XCircle size={12} />
            End
          </button>
        </div>

        {/* â”€â”€ User name â”€â”€ */}
        <div className="flex items-center gap-2.5 mb-0.5">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <User size={15} className="text-primary" />
          </div>
          <h3 className="text-[20px] font-extrabold text-card-foreground leading-tight tracking-tight">
            {childName}
          </h3>
        </div>
        <p className="text-[11px] text-muted-foreground mb-3 pl-[46px]">
          Age {age} Â· {gender.charAt(0).toUpperCase() + gender.slice(1)}
        </p>

        {/* â”€â”€ Disability type â”€â”€ */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-[11px] font-bold text-muted-foreground">Disability Type:</span>
          <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-0.5 rounded-full">
            <span className="text-[11px] font-extrabold">
              {cfg?.label ?? (isPending ? "Detectingâ€¦" : resolvedDisability)}
            </span>
          </div>
          {isPending && (
            <span className="text-[9px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border">
              AI Scan Needed
            </span>
          )}
        </div>

        {/* â”€â”€ Date info â”€â”€ */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="rounded-2xl px-3 py-2.5 bg-muted border border-border">
            <div className="flex items-center gap-1 mb-1">
              <Calendar size={9} className="text-muted-foreground" />
              <span className="text-[8px] font-extrabold tracking-widest text-muted-foreground uppercase">
                Created
              </span>
            </div>
            <p className="text-[11px] font-extrabold text-foreground leading-tight">
              {fmt(null, createdAt)}
            </p>
          </div>
          <div className="rounded-2xl px-3 py-2.5 bg-muted border border-border">
            <div className="flex items-center gap-1 mb-1">
              <Play size={9} className="text-muted-foreground" />
              <span className="text-[8px] font-extrabold tracking-widest text-muted-foreground uppercase">
                Started
              </span>
            </div>
            <p className="text-[11px] font-extrabold text-foreground leading-tight">
              {fmt(startDate)}
            </p>
          </div>
          <div className="rounded-2xl px-3 py-2.5 bg-muted border border-border">
            <div className="flex items-center gap-1 mb-1">
              <CheckCircle2 size={9} className="text-muted-foreground" />
              <span className="text-[8px] font-extrabold tracking-widest text-muted-foreground uppercase">
                Done
              </span>
            </div>
            <p className="text-[11px] font-extrabold text-foreground leading-tight">
              {fmt(endDate)}
            </p>
          </div>
        </div>

        {/* â”€â”€ Progress â”€â”€ */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">
              Progress
            </span>
            <span className="text-[10px] font-extrabold text-primary">
              {progress}/{totalActivities} Â· {pct}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>

        {analysisError && (
          <p className="text-[11px] text-red-500 font-semibold mb-3 flex items-center gap-1">
            <XCircle size={12} /> {analysisError}
          </p>
        )}

        {/* â”€â”€ View Report â”€â”€ */}
        <a
          href={reportUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[13px] font-bold text-muted-foreground hover:bg-primary/10 transition-colors mb-3 bg-muted border border-border"
        >
          <FileText size={14} className="text-primary" />
          View Report
        </a>

        {/* â”€â”€ Main action button â”€â”€ */}
        {isPending ? (
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.01 }}
            onClick={runAnalysis}
            disabled={runningAnalysis}
            className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 relative overflow-hidden disabled:opacity-60 bg-primary"
          >
            <motion.div
              className="absolute inset-0 opacity-20 bg-gradient-to-r from-transparent via-white to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <RefreshCw
              size={14}
              className={`text-primary-foreground relative z-10 ${runningAnalysis ? "animate-spin" : ""}`}
            />
            <span className="text-[13px] font-extrabold text-primary-foreground tracking-wide relative z-10">
              {runningAnalysis ? "Running AI Analysisâ€¦" : "Launch AI Analysis"}
            </span>
          </motion.button>
        ) : status === "not_started" ? (
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.01 }}
            onClick={handleStart}
            className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 relative overflow-hidden bg-primary"
          >
            <motion.div
              className="absolute inset-0 opacity-20 bg-gradient-to-r from-transparent via-white to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <Play size={14} className="fill-primary-foreground text-primary-foreground relative z-10" />
            <span className="text-[13px] font-extrabold text-primary-foreground tracking-wide relative z-10">
              Start
            </span>
          </motion.button>
        ) : status === "running" ? (
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.01 }}
            onClick={handleProgress}
            className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 relative overflow-hidden bg-primary"
          >
            <motion.div
              className="absolute inset-0 opacity-20 bg-gradient-to-r from-transparent via-white to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="w-2 h-2 rounded-full bg-primary-foreground animate-pulse relative z-10" />
            <span className="text-[13px] font-extrabold text-primary-foreground tracking-wide relative z-10">
              Running Â· Continue
            </span>
          </motion.button>
        ) : (
          <div className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 bg-emerald-50 dark:bg-emerald-950 border border-emerald-100 dark:border-emerald-900">
            <CheckCircle2 size={14} className="text-emerald-600" />
            <span className="text-[13px] font-extrabold text-emerald-700 dark:text-emerald-400 tracking-wide">
              Completed!
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
}

/* â”€â”€â”€ Filter pill tabs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const FILTERS = ["All", "Dyslexia", "Dyscalculia", "Dysgraphia", "Pending"];

/* â”€â”€â”€ Main Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export default function PersonalisedPathPage() {
  const { t } = useTranslation();
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
    <div className="h-screen w-full bg-background text-foreground flex overflow-hidden">
      {/* â”€ Sidebar â”€ */}
      <aside className="w-20 lg:w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Activity className="text-primary-foreground w-5 h-5" />
          </div>
          <span className="hidden lg:block font-extrabold text-lg tracking-tight text-foreground">NeuroBloom</span>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          <Link href="/dashboard"><NavItem icon={<LayoutDashboard size={18} />} label={t("nav_overview")} /></Link>
          <Link href="/assessments"><NavItem icon={<FileText size={18} />} label={t("nav_reports")} /></Link>
          <Link href="/patients"><NavItem icon={<Users size={18} />} label={t("nav_patients")} /></Link>
          <Link href="/analytics"><NavItem icon={<TrendingUp size={18} />} label={t("nav_analytics")} /></Link>
          <Link href="/personalised-path"><NavItem icon={<Compass size={18} />} label={t("nav_personalist")} active /></Link>
        </nav>

        <div className="p-3 border-t border-border space-y-1">
          <NavItem icon={<Settings size={18} />} label="Settings" />
          <NavItem icon={<HelpCircle size={18} />} label="Support" />
        </div>
      </aside>

      {/* â”€ Main Content â”€ */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
        {/* â”€ Page Header â”€ */}
        <div className="px-8 pt-8 pb-5 border-b border-border bg-card/60 backdrop-blur">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-2xl font-extrabold text-foreground">{t("path_header")}</h1>
            <LanguageSwitcher />
          </div>
          <p className="text-sm text-muted-foreground mb-5">
            {totalCards} personalised {totalCards === 1 ? "quest" : "quests"} ready to explore
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-card rounded-2xl px-4 py-2.5 border border-border shadow-sm">
              <Search size={14} className="text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search child or conditionâ€¦"
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
                <span className="text-5xl animate-pulse">ðŸ§ </span>
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
                <span className="text-5xl">ðŸŽ®</span>
                <h4 className="text-lg font-extrabold text-foreground">No Quests Yet</h4>
                <p className="text-[13px] text-muted-foreground max-w-sm text-center leading-relaxed">
                  Personalised learning quests will appear here once a child&apos;s test report is generated.
                </p>
              </motion.div>
            ) : (
              <motion.div key="list" className="max-w-6xl mx-auto pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {searchFiltered.map((card, i) => (
                    <PathCard
                      key={`${card.id}-${card.disability}`}
                      assessmentId={card.id}
                      childName={card.child_name}
                      age={card.age}
                      gender={card.gender}
                      disability={card.disability}
                      reportUrl={card.report_url}
                      createdAt={card.created_at}
                      delay={i * 0.07}
                      onEndPath={() => handleDelete(card.id)}
                    />
                  ))}
                  {showPending &&
                    searchPending.map((a, i) => (
                      <PathCard
                        key={`pending-${a.id}`}
                        assessmentId={a.id}
                        childName={a.child_name}
                        age={a.age}
                        gender={a.gender}
                        disability={null}
                        reportUrl={a.report_url}
                        createdAt={a.created_at}
                        delay={(searchFiltered.length + i) * 0.07}
                        onEndPath={() => handleDelete(a.id)}
                        onAnalysisComplete={() => {
                          setLoading(true);
                          fetch("/api/assessments")
                            .then((r) => r.json())
                            .then((data: Assessment[]) => {
                              setAssessments(data);
                              setLoading(false);
                            })
                            .catch(() => setLoading(false));
                        }}
                      />
                    ))}
                </div>
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

/* â”€â”€â”€ Nav Item â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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
