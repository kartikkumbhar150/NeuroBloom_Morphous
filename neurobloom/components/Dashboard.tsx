"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

import { 
  Play, 
  Activity,
  LayoutDashboard,
  FileText,
  Users,
  TrendingUp,
  Settings,
  HelpCircle,
  Shield,
  Clock,
  BarChart2,
  Zap,
  Compass,
  UserCircle
} from 'lucide-react';
import { LanguageSwitcher } from "./ui/LanguageSwitcher";
import { useTranslation } from "@/hooks/useTranslation";

/* ─── Floating decorative symbol ─────────────────────────────────────────── */
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
      className={`absolute pointer-events-none select-none font-extrabold ${className || ''}`}
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

const CARD_FLOATERS: FloatingEl[] = [
  { symbol: "🧠", x: "68%", y: "12%", size: "16px", delay: 0, duration: 3.2 },
  { symbol: "🎮", x: "80%", y: "38%", size: "14px", delay: 0.5, duration: 2.8 },
  { symbol: "✨", x: "62%", y: "58%", size: "14px", delay: 1, duration: 3.5 },
  { symbol: "📊", x: "74%", y: "75%", size: "12px", delay: 0.3, duration: 2.6 },
  { symbol: "🔬", x: "88%", y: "20%", size: "14px", delay: 0.8, duration: 3 },
];

interface DashboardProps {
  onStartTest: () => void;
}

export default function Dashboard({ onStartTest }: DashboardProps) {
  const { t } = useTranslation();
  const [userName, setUserName] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userName") || "Kartik Kumbhar";
    }
    return "Kartik Kumbhar";
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.name) {
          setUserName(data.name);
          localStorage.setItem("userName", data.name);
        }
      })
      .catch(() => {});
  }, []);

  const initials = userName
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join("");

  return (
    <div className="h-screen w-full bg-background text-foreground flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Activity className="text-primary-foreground w-5 h-5" />
          </div>
          <span className="hidden lg:block font-extrabold text-lg tracking-tight text-foreground">NeuroBloom</span>
        </div>
        
        <nav className="flex-1 px-3 space-y-1">
          <Link href="/">
            <NavItem
              icon={<LayoutDashboard size={18} />}
              label={t("nav_overview")}
              active
            />
          </Link>

          <Link href="/assessments">
            <NavItem
              icon={<FileText size={18} />}
              label={t("nav_reports")}
            />
          </Link>

          <Link href="/patients">
            <NavItem
              icon={<Users size={18} />}
              label={t("nav_patients")}
            />
          </Link>

          <Link href="/analytics">
            <NavItem
              icon={<TrendingUp size={18} />}
              label={t("nav_analytics")}
            />
          </Link>

          <Link href="/personalised-path">
            <NavItem
              icon={<Compass size={18} />}
              label={t("nav_personalist")}
            />
          </Link>
        </nav>

        <div className="p-3 border-t border-border space-y-1">
          <NavItem icon={<Settings size={18} />} label="Settings" />
          <NavItem icon={<HelpCircle size={18} />} label="Support" />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
        {/* Header */}
        <div className="px-8 pt-10 pb-4 flex-shrink-0 bg-background">
          <div className="flex items-center justify-between">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[22px] font-extrabold text-foreground leading-tight"
              >
                Hello, <span className="italic font-black text-primary">{userName}</span>
              </motion.h1>
              <p className="text-sm text-muted-foreground mt-1">Welcome back to your diagnostic terminal</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-bold text-foreground">{userName}</p>
                <p className="text-[10px] text-muted-foreground font-medium">{t("dash_practitioner")}</p>
              </div>
              <div className="w-10 h-10 bg-primary/10 rounded-2xl border border-primary/20 flex items-center justify-center text-primary font-extrabold text-xs relative">
                <UserCircle className="w-6 h-6 text-primary" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-background" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-8 py-6 overflow-y-auto">
          <div className="max-w-6xl flex flex-col items-start">
            
            {/* Section Header */}
            <div className="mb-6">
              <h3 className="text-lg font-extrabold text-foreground">Active Modules</h3>
              <p className="text-sm text-muted-foreground mt-1">Select an environment to begin patient screening.</p>
            </div>

            {/* Assessment Card — exact reference style */}
            <motion.div 
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 110 }}
              className="w-full max-w-md bg-card rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-shadow relative border border-border"
            >
              {/* Top gradient line */}
              <div className="h-1 w-full bg-primary" />

              {/* Background glow */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl bg-primary/10" />
              </div>

              {/* Floating animated symbols */}
              {CARD_FLOATERS.map((el, i) => (
                <FloatingSymbol key={i} el={el} className="text-primary" />
              ))}

              {/* Card content */}
              <div className="p-4 relative z-10">
                {/* Top row: status badge + shield */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full dark:bg-emerald-950 dark:text-emerald-400">
                    <Zap size={10} className="fill-current text-current" />
                    <span className="text-[10px] font-extrabold tracking-widest uppercase">
                      Ready
                    </span>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className="w-9 h-9 rounded-full flex items-center justify-center bg-primary/10"
                  >
                    <Shield size={16} className="text-primary" />
                  </motion.div>
                </div>

                {/* Title & subtitle */}
                <h3 className="text-[17px] font-extrabold text-card-foreground leading-tight mb-0.5">
                  Test 1:{" "}
                  <span className="text-primary">Cognitive Reading</span>
                </h3>
                <p className="text-[11px] text-muted-foreground mb-4">AI-Analysis Module v4.2</p>

                {/* Stat boxes */}
                <div className="flex gap-2 mb-4">
                  <div className="flex-1 rounded-2xl px-3 py-2.5 bg-muted border border-border">
                    <div className="flex items-center gap-1 mb-1">
                      <Clock size={10} className="text-muted-foreground" />
                      <span className="text-[9px] font-extrabold tracking-widest text-muted-foreground uppercase">
                        Duration
                      </span>
                    </div>
                    <p className="text-[13px] font-extrabold text-foreground">18 Mins</p>
                  </div>
                  <div className="flex-1 rounded-2xl px-3 py-2.5 bg-muted border border-border">
                    <div className="flex items-center gap-1 mb-1">
                      <BarChart2 size={10} className="text-muted-foreground" />
                      <span className="text-[9px] font-extrabold tracking-widest text-muted-foreground uppercase">
                        Method
                      </span>
                    </div>
                    <p className="text-[13px] font-extrabold text-foreground">Biometric</p>
                  </div>
                </div>

                {/* Launch button */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.01 }}
                  onClick={onStartTest}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 relative overflow-hidden bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 relative z-10 bg-background/20">
                    <Play size={10} className="fill-current text-current ml-0.5" />
                  </div>
                  <span className="text-[13px] font-extrabold tracking-wide relative z-10">
                    Launch Environment
                  </span>
                </motion.button>

                {/* Footer */}
                <p className="text-center text-[9px] font-bold tracking-widest text-muted-foreground uppercase mt-3">
                  Authorized Clinical Use Only
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer Status */}
        <footer className="h-10 bg-card/60 backdrop-blur border-t border-border px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-muted-foreground">System Online</span>
          </div>
          <span className="text-xs text-muted-foreground font-bold">Terminal ID: 882-NB</span>
        </footer>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={`
      flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer transition-all
      ${active ? 'bg-primary/10 text-primary shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}
    `}>
      <span className={active ? 'text-primary' : 'text-muted-foreground'}>{icon}</span>
      <span className={`hidden lg:block text-sm ${active ? 'font-bold' : 'font-semibold'}`}>{label}</span>
    </div>
  );
}