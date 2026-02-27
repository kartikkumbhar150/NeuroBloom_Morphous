"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Activity, 
  LayoutDashboard, 
  FileText, 
  Users, 
  TrendingUp, 
  Settings, 
  HelpCircle, 
  FileDown,
  Search,
  ChevronRight,
  Compass
} from 'lucide-react';
import { useTranslation } from "@/hooks/useTranslation";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

interface Assessment {
  child_id: string;
  child_name: string;
  gender: string;
  age: number;
  report_url: string;
  created_at?: string;
}

export default function AssessmentsPage() {
  const { t } = useTranslation();
  const [data, setData] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/assessments")
      .then(res => res.json())
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="h-screen w-full bg-background text-foreground flex overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Activity className="text-primary-foreground w-5 h-5" />
          </div>
          <span className="hidden lg:block font-extrabold text-lg tracking-tight text-foreground">NeuroBloom</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <Link href="/dashboard"><NavItem icon={<LayoutDashboard size={18} />} label="Overview" /></Link>
          <Link href="/assessments"><NavItem icon={<FileText size={18} />} label="Reports" active /></Link>
          <Link href="/patients"><NavItem icon={<Users size={18} />} label="Patient List" /></Link>
          <Link href="/analytics"><NavItem icon={<TrendingUp size={18} />} label="Analytics" /></Link>
          <Link href="/personalised-path"><NavItem icon={<Compass size={18} />} label="Personalised Path" /></Link>
        </nav>

        <div className="p-3 border-t border-border space-y-1">
          <NavItem icon={<Settings size={18} />} label={t("nav_settings")} />
          <NavItem icon={<HelpCircle size={18} />} label={t("nav_support")} />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-background overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-10 pb-4 flex-shrink-0 bg-background flex items-center justify-between">
          <div>
            <h2 className="text-[22px] font-extrabold text-foreground leading-tight">{t("assess_test_reports")}</h2>
            <p className="text-sm text-muted-foreground mt-1">{t("assess_review_manage")}</p>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <div className="hidden sm:block text-right">
              <p className="text-xs font-bold text-foreground">{t("assess_dr_sarah")}</p>
              <p className="text-[10px] text-muted-foreground font-medium">{t("assess_chief_neuro")}</p>
            </div>
            <div className="w-10 h-10 bg-primary/10 rounded-2xl border border-primary/20 flex items-center justify-center text-primary font-extrabold text-xs">SC</div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 px-8 py-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto">

            {/* Search Bar */}
            <div className="flex justify-end mb-6">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder={t("assess_search")} 
                  className="bg-card border border-border rounded-xl py-2 pl-10 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-64 text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Table Container */}
            <div className="bg-card border border-border rounded-[1.25rem] shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">{t("assess_child_patient")}</th>
                    <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">{t("assess_gender")}</th>
                    <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">{t("assess_age")}</th>
                    <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">{t("assess_report_status")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-400 text-sm animate-pulse">
                        {t("assess_syncing")}
                      </td>
                    </tr>
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-400 text-xs uppercase font-bold tracking-widest">
                        {t("assess_no_records")}
                      </td>
                    </tr>
                  ) : (
                    data.map((item, idx) => (
                      <motion.tr 
                        key={item.child_id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground font-bold text-[10px] group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                              {item.child_name.substring(0, 2).toUpperCase()}
                            </div>
                            <span className="font-bold text-foreground text-sm">{item.child_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-md">
                            {item.gender}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-foreground">
                          {item.age} <span className="text-[10px] text-muted-foreground ml-1 uppercase">{t("assess_years")}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {item.report_url ? (
                            <a
                              href={item.report_url}
                              download
                              target="_blank"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-xs font-bold text-foreground hover:border-primary hover:text-primary hover:shadow-sm transition-all"
                            >
                              <FileDown size={14} />
                              {t("assess_download_pdf")}
                              <ChevronRight size={12} className="opacity-30" />
                            </a>
                          ) : (
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-muted border border-border rounded-lg text-xs font-bold text-muted-foreground cursor-default">
                              <FileText size={14} />
                              No Report Yet
                            </span>
                          )}
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>

        {/* Footer */}
        <footer className="h-10 bg-card/60 backdrop-blur border-t border-border px-8 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-muted-foreground">{t("assess_records_sync")}</span>
           </div>
           <span className="text-xs text-muted-foreground font-bold">{t("assess_db_node")}</span>
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
