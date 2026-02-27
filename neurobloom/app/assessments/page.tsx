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
    <div className="h-screen w-full bg-[#f8fafc] text-slate-900 flex overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
            <Activity className="text-white w-6 h-6" />
          </div>
          <span className="hidden lg:block font-black text-lg tracking-tight text-slate-800">NeuroBloom</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <Link href="/dashboard"><NavItem icon={<LayoutDashboard size={18} />} label="Overview" /></Link>
          <Link href="/assessments"><NavItem icon={<FileText size={18} />} label="Reports" active /></Link>
          <Link href="/patients"><NavItem icon={<Users size={18} />} label="Patient List" /></Link>
          <Link href="/analytics"><NavItem icon={<TrendingUp size={18} />} label="Analytics" /></Link>
          <Link href="/personalised-path"><NavItem icon={<Compass size={18} />} label="Personalised Path" /></Link>
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-1">
          <NavItem icon={<Settings size={18} />} label={t("nav_settings")} />
          <NavItem icon={<HelpCircle size={18} />} label={t("nav_support")} />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50/50 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-10 flex items-center justify-between">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{t("assess_records_archive")}</h2>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <div className="hidden sm:block text-right">
              <p className="text-xs font-bold text-slate-800">{t("assess_dr_sarah")}</p>
              <p className="text-[10px] text-slate-400 font-medium">{t("assess_chief_neuro")}</p>
            </div>
            <div className="w-9 h-9 bg-indigo-50 rounded-full border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">SC</div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 p-10 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            
            {/* Page Title & Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">{t("assess_test_reports")}</h3>
                <p className="text-sm text-slate-500 mt-1">{t("assess_review_manage")}</p>
              </div>
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder={t("assess_search")} 
                  className="bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-64"
                />
              </div>
            </div>

            {/* Table Container */}
            <div className="bg-white border border-slate-200 rounded-[1.25rem] shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("assess_child_patient")}</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("assess_gender")}</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("assess_age")}</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">{t("assess_report_status")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
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
                        className="group hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-[10px] group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                              {item.child_name.substring(0, 2).toUpperCase()}
                            </div>
                            <span className="font-bold text-slate-700 text-sm">{item.child_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                            {item.gender}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-600">
                          {item.age} <span className="text-[10px] text-slate-400 ml-1 uppercase">{t("assess_years")}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <a
                            href={item.report_url}
                            download
                            target="_blank"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:border-indigo-600 hover:text-indigo-600 hover:shadow-sm transition-all"
                          >
                            <FileDown size={14} />
                            {t("assess_download_pdf")}
                            <ChevronRight size={12} className="opacity-30" />
                          </a>
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
        <footer className="h-10 bg-white border-t border-slate-200 px-10 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{t("assess_records_sync")}</span>
           </div>
           <span className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">{t("assess_db_node")}</span>
        </footer>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={`
      flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all
      ${active ? 'bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100/50' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'}
    `}>
      <span className={active ? 'text-indigo-600' : 'text-slate-400'}>{icon}</span>
      <span className="hidden lg:block font-bold text-xs uppercase tracking-wider">{label}</span>
    </div>
  );
}
