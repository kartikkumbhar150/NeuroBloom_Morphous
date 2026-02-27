"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Lock,
  Eye,
  Scale,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

interface TermsAndConditionsProps {
  onAccept: () => void;
  onBack?: () => void;
}

export function TermsAndConditions({ onAccept }: TermsAndConditionsProps) {
  const { t } = useTranslation();
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="relative h-screen w-full bg-gradient-to-br from-indigo-50 via-slate-50 to-white flex items-center justify-center p-6 overflow-hidden font-sans">
      
      {/* Ambient medical glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.15),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(56,189,248,0.12),transparent_40%)]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-3xl z-10"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-[1.75rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] border border-white/50 overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-10 py-6 flex justify-between items-center border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                <ShieldCheck className="text-indigo-400" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-black text-white tracking-tight">
                  {t('tc_title')}
                </h1>
                <p className="text-indigo-300 text-[10px] uppercase tracking-[0.25em] font-black">
                  {t('tc_subtitle')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                  {t('tc_hipaa')}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">

            {/* Terms Box */}
            <div className="bg-gradient-to-b from-white to-slate-50 border border-slate-200/70 rounded-2xl p-6 mb-6 max-h-64 overflow-y-auto shadow-inner">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-600">

                {[
                  {
                    title: t('tc_data_usage'),
                    icon: <Eye size={14} className="text-indigo-600" />,
                    text: t('tc_data_usage_desc'),
                  },
                  {
                    title: t('tc_privacy'),
                    icon: <Lock size={14} className="text-indigo-600" />,
                    text: t('tc_privacy_desc'),
                  },
                  {
                    title: t('tc_medical'),
                    icon: <Scale size={14} className="text-indigo-600" />,
                    text: t('tc_medical_desc'),
                  },
                  {
                    title: t('tc_guardian'),
                    icon: <CheckCircle2 size={14} className="text-indigo-600" />,
                    text: t('tc_guardian_desc'),
                  },
                ].map((item, i) => (
                  <motion.section
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-2 flex items-center gap-2">
                      {item.icon}
                      {item.title}
                    </h3>
                    <p className="text-[13px] leading-relaxed">
                      {item.text}
                    </p>
                  </motion.section>
                ))}

              </div>
            </div>

            {/* Accept Row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-slate-100 pt-6">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={accepted}
                  onChange={() => setAccepted(!accepted)}
                />
                <div
                  className={`w-7 h-7 rounded-lg border-2 transition-all flex items-center justify-center shadow-sm ${
                    accepted
                      ? "bg-indigo-600 border-indigo-600 shadow-indigo-300/40"
                      : "border-slate-300 bg-white group-hover:border-indigo-400"
                  }`}
                >
                  {accepted && <CheckCircle2 size={14} className="text-white" />}
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">
                  {t('tc_accept')}
                </span>
              </label>

              <motion.button
                whileHover={accepted ? { scale: 1.05 } : {}}
                whileTap={accepted ? { scale: 0.97 } : {}}
                onClick={onAccept}
                disabled={!accepted}
                className={`px-10 py-4 rounded-xl font-bold text-sm transition-all flex items-center gap-3 ${
                  accepted
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-[0_20px_40px_-10px_rgba(99,102,241,0.6)] hover:from-indigo-700 hover:to-indigo-600"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                {t('tc_proceed')}
                <ArrowRight size={18} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Stepper */}
        <div className="mt-10 flex justify-center items-center gap-10 bg-white/60 backdrop-blur-lg px-8 py-4 rounded-full shadow-lg border border-white">
          <Step label={t('sf_step_info')} completed />
          <Step label={t('tc_step_consent')} active />
          <Step label={t('sf_step_assessment')} />
        </div>
      </motion.div>
    </div>
  );
}

function Step({
  label,
  active = false,
  completed = false,
}: {
  label: string;
  active?: boolean;
  completed?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-3 h-3 rounded-full ${
          completed
            ? "bg-indigo-600"
            : active
            ? "bg-indigo-600 ring-4 ring-indigo-100"
            : "bg-slate-300"
        }`}
      />
      <span
        className={`text-[10px] font-black uppercase tracking-widest ${
          active || completed ? "text-slate-900" : "text-slate-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
}