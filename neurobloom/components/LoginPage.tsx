"use client";

import { useState } from 'react';
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Brain, Lock, Mail, ArrowLeft, ShieldCheck, Activity, Globe } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { LanguageSwitcher } from './ui/LanguageSwitcher';

export function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Login failed");
        return;
      }
      localStorage.setItem("token", data.token);
      if (data.name) localStorage.setItem("userName", data.name);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-background flex items-center justify-center p-6 overflow-hidden font-sans">
      {/* Back to home - Professional floating button */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-8 left-8 flex items-center gap-2 text-muted-foreground hover:text-primary transition-all text-xs font-bold uppercase tracking-widest"
      >
        <ArrowLeft size={16} />
        {t("login_back_to_portal")}
      </button>

      <div className="absolute top-8 right-8">
        <LanguageSwitcher />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        <div className="bg-card rounded-[2rem] shadow-2xl shadow-primary/5 border border-border overflow-hidden flex flex-col md:flex-row min-h-[500px]">
          
          {/* Left Side: Branding & Context (Hidden on small mobile) */}
          <div className="hidden md:flex w-2/5 bg-foreground p-12 flex-col justify-between relative overflow-hidden">
            {/* Background Decorative element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-32 -mt-32 blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-primary rounded-xl shadow-lg shadow-primary/20">
                  <Brain className="text-primary-foreground" size={24} />
                </div>
                <span className="text-xl font-bold text-background tracking-tight">{t("login_neurobloom_brand")}</span>
              </div>
              <h2 className="text-3xl font-bold text-background leading-tight mb-4">
                {t("login_advanced_cognitive")} <br /> 
                <span className="text-primary">{t("login_diagnostics")}</span>
              </h2>
              <p className="text-muted text-sm leading-relaxed font-medium">
                {t("login_description")}
              </p>
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3 text-muted">
                <ShieldCheck size={18} className="text-emerald-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest">{t("login_end_to_end")}</span>
              </div>
              <div className="flex items-center gap-3 text-muted">
                <Globe size={18} className="text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest">{t("login_regional_data")}</span>
              </div>
            </div>
          </div>

          {/* Right Side: Login Form */}
          <div className="flex-1 p-10 md:p-14 flex flex-col justify-center">
            <div className="mb-8">
              <h1 className="text-2xl font-black text-foreground tracking-tight">{t("login_practitioner_login")}</h1>
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-2">{t("login_auth_required")}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1">{t("login_email_protocol")}</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("login_email_placeholder")}
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium text-foreground"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{t("login_security_token")}</label>
                  <button type="button" className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">{t("login_reset")}</button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("login_password_placeholder")}
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium text-foreground"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  disabled={loading}
                  type="submit"
                  className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-sm shadow-xl shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-3"
                >
                  {loading ? t("login_authorizing") : t("login_initialize_session")}
                  {!loading && <Activity size={18} />}
                </button>
              </div>
            </form>

            <div className="mt-10 pt-6 border-t border-border text-center">
              <p className="text-muted-foreground text-xs font-medium">
                {t("login_new_practitioner")}{" "}
                <button
                  onClick={() => router.push("/signup")}
                  className="text-primary font-bold hover:underline"
                >
                  {t("login_request_access")}
                </button>
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer Meta */}
        <div className="mt-6 flex justify-center gap-6 text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em]">
          <span>{t("login_footer_copyright")}</span>
          <span>•</span>
          <span>{t("login_footer_status")}</span>
          <span>•</span>
          <span>{t("login_footer_version")}</span>
        </div>
      </motion.div>
    </div>
  );
}