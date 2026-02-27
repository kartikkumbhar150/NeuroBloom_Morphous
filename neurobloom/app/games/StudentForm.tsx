"use client";

import { useState } from 'react';
import { motion } from "framer-motion";
import { User, Calendar, Users, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useVideo } from "@/context/VideoContext";
import { useTranslation } from "@/hooks/useTranslation";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

interface StudentFormProps {
  onNext: (data: StudentData) => void;
  onBack?: () => void;
}

export interface StudentData {
  name: string;
  age: number;
  gender: string;
}

export function StudentForm({ onNext, onBack }: StudentFormProps) {
  const { t } = useTranslation();
  const { setSessionId } = useVideo();
  const [formData, setFormData] = useState<StudentData>({
    name: '',
    age: 6,
    gender: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = t('sf_err_name');
    if (!formData.gender) newErrors.gender = t('sf_err_gender');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const res = await fetch("/api/session/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    const { sessionId } = await res.json();
    localStorage.setItem("sessionId", sessionId);
    setSessionId(sessionId);
    onNext(formData);
  };

  return (
    <div className="h-screen w-full bg-[#f8fafc] flex items-center justify-center p-4 overflow-hidden font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white rounded-[1.5rem] shadow-2xl shadow-slate-200 border border-slate-200 overflow-hidden">
          {/* Compact Professional Header */}
          <div className="bg-slate-900 px-10 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">{t('sf_patient_registration')}</h1>
              <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-bold mt-1">{t('sf_assessment_intake')}</p>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                <ShieldCheck size={16} className="text-indigo-400" />
                <span className="text-[10px] text-white font-medium uppercase tracking-wider">{t('sf_secure_portal')}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-6">
            {/* Wide Name Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                <User size={14} className="text-indigo-600" />
                {t('sf_full_name')}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('sf_name_placeholder')}
                className={`w-full px-5 py-3.5 bg-slate-50 rounded-xl border transition-all text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 ${
                  errors.name ? 'border-red-300' : 'border-slate-200 focus:border-indigo-500'
                }`}
              />
            </div>

            {/* Horizontal Split for Age and Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Age Group Selection */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  <Calendar size={14} className="text-indigo-600" />
                  {t('sf_age_group')}
                </label>
                <div className="flex gap-2">
                  {[6, 7, 8].map((age) => (
                    <button
                      key={age}
                      type="button"
                      onClick={() => setFormData({ ...formData, age })}
                      className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all text-sm ${
                        formData.age === age
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100'
                          : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
                      }`}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender Selection - Horizontal Grid */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  <Users size={14} className="text-indigo-600" />
                  {t('sf_gender')}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: t('sf_gender_male'), value: 'male' },
                    { label: t('sf_gender_female'), value: 'female' },
                    { label: t('sf_gender_other'), value: 'other' }
                  ].map((gender) => (
                    <button
                      key={gender.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: gender.value })}
                      className={`py-3 rounded-xl border-2 font-bold transition-all text-[11px] uppercase tracking-tighter ${
                        formData.gender === gender.value
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100'
                          : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
                      }`}
                    >
                      {gender.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Action Area */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span className="text-[10px] font-bold uppercase">{t('sf_ready')}</span>
              </div>
              
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold text-sm transition-all flex items-center gap-3 shadow-xl shadow-indigo-100"
              >
                {t('sf_launch')}
                <ArrowRight size={18} />
              </motion.button>
            </div>
          </form>
        </div>

        {/* Minimal Progress Step Indicator */}
        <div className="mt-6 flex justify-center items-center gap-8">
           <Step label={t('sf_step_info')} active />
           <div className="w-12 h-[1px] bg-slate-200" />
           <Step label={t('sf_step_assessment')} />
           <div className="w-12 h-[1px] bg-slate-200" />
           <Step label={t('sf_step_analytics')} />
        </div>
      </motion.div>
    </div>
  );
}

function Step({ label, active = false }: { label: string, active?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${active ? 'bg-indigo-600 ring-4 ring-indigo-50' : 'bg-slate-300'}`} />
      <span className={`text-[10px] font-bold uppercase tracking-widest ${active ? 'text-slate-900' : 'text-slate-400'}`}>
        {label}
      </span>
    </div>
  );
}