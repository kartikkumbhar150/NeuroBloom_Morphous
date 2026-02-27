"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "./ui/button";

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
      <aside className="w-20 lg:w-64 bg-card border-r-4 border-black flex flex-col">
        <div className="p-6 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary border-2 border-black rounded-lg flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Activity className="text-white w-6 h-6" />
          </div>
          <span className="hidden lg:block font-black text-xl tracking-tight text-foreground uppercase">NeuroBloom</span>
        </div>
        
        <nav className="flex-1 px-3 space-y-2">
          <Link href="/">
            <NavItem
              icon={<LayoutDashboard size={20} />}
              label={t("nav_overview")}
              active
            />
          </Link>

          <Link href="/assessments">
            <NavItem
              icon={<FileText size={20} />}
              label={t("nav_reports")}
            />
          </Link>

          <Link href="/patients">
            <NavItem
              icon={<Users size={20} />}
              label={t("nav_patients")}
            />
          </Link>

          <Link href="/analytics">
            <NavItem
              icon={<TrendingUp size={20} />}
              label={t("nav_analytics")}
            />
          </Link>

          <Link href="/personalised-path">
            <NavItem
              icon={<Compass size={20} />}
              label={t("nav_personalist")}
            />
          </Link>
        </nav>

        <div className="p-3 border-t-4 border-black space-y-2">
          <NavItem icon={<Settings size={20} />} label="Settings" />
          <NavItem icon={<HelpCircle size={20} />} label="Support" />
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
              <LanguageSwitcher />
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
                          className="w-full max-w-md bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-4px] transition-all relative overflow-hidden"
                        >
                          {/* Top gradient line */}
                          <div className="h-2 w-full bg-primary" />
            
                          {/* Floating animated symbols */}
                          {CARD_FLOATERS.map((el, i) => (
                            <FloatingSymbol key={i} el={el} className="text-primary/40" />
                          ))}
            
                          {/* Card content */}
                          <div className="p-6 relative z-10">
                            {/* Top row: status badge + shield */}
                            <div className="flex items-center justify-between mb-6">
                              <div className="flex items-center gap-2 bg-accent border-2 border-black px-4 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                <Zap size={12} className="fill-black text-black" />
                                <span className="text-xs font-black tracking-widest uppercase text-black">
                                  {t("dash_system_ready")}
                                </span>
                              </div>
                              <motion.div
                                whileHover={{ scale: 1.1, rotate: 10 }}
                                className="w-10 h-10 border-2 border-black flex items-center justify-center bg-primary text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                              >
                                <Shield size={20} />
                              </motion.div>
                            </div>
            
                            {/* Title & subtitle */}
                            <h3 className="text-2xl font-black text-black leading-tight mb-1 uppercase italic">
                              {t("dash_cognitive_reading")}
                            </h3>
                            <p className="text-xs text-black/40 font-black mb-6 uppercase tracking-widest">{t("dash_ai_module")}</p>
            
                            {/* Stat boxes */}
                            <div className="flex gap-3 mb-6">
                              <div className="flex-1 border-2 border-black p-3 bg-muted shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                <div className="flex items-center gap-1 mb-1">
                                  <Clock size={12} className="text-black/40" />
                                  <span className="text-[10px] font-black tracking-widest text-black/40 uppercase">
                                    {t("dash_duration")}
                                  </span>
                                </div>
                                <p className="text-sm font-black text-black uppercase">{t("dash_duration_val")}</p>
                              </div>
                              <div className="flex-1 border-2 border-black p-3 bg-muted shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                <div className="flex items-center gap-1 mb-1">
                                  <BarChart2 size={12} className="text-black/40" />
                                  <span className="text-[10px] font-black tracking-widest text-black/40 uppercase">
                                    {t("dash_method")}
                                  </span>
                                </div>
                                <p className="text-sm font-black text-black uppercase">{t("dash_method_val")}</p>
                              </div>
                            </div>
            
                            {/* Launch button */}
                            <Button
                              size="lg"
                              onClick={onStartTest}
                              className="w-full text-lg py-8 uppercase italic"
                            >
                              <Play size={16} className="fill-current" />
                              {t("dash_launch_env")}
                            </Button>
            
                            {/* Footer */}
                            <p className="text-center text-[10px] font-black tracking-widest text-black/40 uppercase mt-4">
                              {t("dash_auth_clinical")}
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    </div>
            
                    {/* Footer Status */}
                    <footer className="h-12 bg-white border-t-4 border-black px-8 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-secondary border border-black animate-pulse" />
                        <span className="text-xs font-black uppercase tracking-widest">{t("dash_system_conn")}</span>
                      </div>
                      <span className="text-xs text-black/40 font-black uppercase tracking-widest">{t("dash_terminal_id")}</span>
                    </footer>
                  </main>
                </div>
              );
            }
            
            function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
              return (
                <div className={`
                  flex items-center gap-4 px-4 py-3 border-2 border-black transition-all group
                  ${active ? 'bg-primary text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'text-black hover:bg-accent shadow-none hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px]'}
                `}>
                  <span className={active ? 'text-white' : 'text-black group-hover:scale-110 transition-transform'}>{icon}</span>
                  <span className={`hidden lg:block text-sm uppercase tracking-widest ${active ? 'font-black' : 'font-bold'}`}>{label}</span>
                </div>
              );
            }
            