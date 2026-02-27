"use client";
import { useRouter } from "next/navigation";
import { useTranslation } from '../hooks/useTranslation';
import { LanguageSwitcher } from './ui/LanguageSwitcher';

import { Brain, Mail, Lock, User, ArrowLeft, Shield, CheckCircle } from 'lucide-react';
import { useState } from 'react';



export function SignUpPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'parent',
    agreement: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Signup failed");
      return;
    }

    //  Signup success
    alert("Account created successfully!");
    router.push("/login");

  } catch (error) {
    console.error("Signup error:", error);
    alert("Something went wrong. Please try again.");
  }
};


  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <img 
          src="https://images.unsplash.com/photo-1766788465885-f96073dbf9e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm93dGglMjBwbGFudCUyMGFic3RyYWN0fGVufDF8fHx8MTc2NzkwMTczMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Back to home button */}
      <button
        onClick={() => router.push("/landing")}
        className="absolute top-6 left-6 flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>{t("signup_back_to_home")}</span>
      </button>

      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>

      {/* Sign Up Card */}
      <div className="w-full max-w-5xl relative z-10">
        <div className="grid md:grid-cols-5 gap-0 bg-card rounded-2xl shadow-xl shadow-primary/10 border border-border overflow-hidden">
          
          {/* Left Side - Mission Message */}
          <div className="md:col-span-2 bg-primary p-8 md:p-10 text-primary-foreground flex flex-col justify-center">
            <div className="w-14 h-14 bg-background/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6">
              <Brain className="w-8 h-8 text-primary-foreground" />
            </div>
            
            <h2 className="text-3xl font-bold mb-4">
              {t("signup_join_neurobloom")}
            </h2>
            
            <p className="text-primary-foreground/90 mb-8 leading-relaxed">
              {t("signup_join_description")}
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-primary-foreground/90">{t("signup_feature_1")}</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-primary-foreground/90">{t("signup_feature_2")}</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-primary-foreground/90">{t("signup_feature_3")}</p>
              </div>
            </div>
          </div>

          {/* Right Side - Sign Up Form */}
          <div className="md:col-span-3 p-8 md:p-10">
            {/* Logo (mobile only) */}
            <div className="md:hidden flex items-center justify-center gap-2 mb-6">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground">{t("signup_neurobloom_brand")}</span>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {t("signup_create_account")}
              </h1>
              <p className="text-muted-foreground">
                {t("signup_create_subtitle")}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">
                  {t("signup_full_name_label")}
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder={t("signup_full_name_placeholder")}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-background text-foreground"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  {t("signup_email_label")}
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t("signup_email_placeholder")}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-background text-foreground"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                  {t("signup_password_label")}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder={t("signup_password_placeholder")}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-background text-foreground"
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-foreground mb-2">
                  {t("signup_role_label")}
                </label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none bg-background text-foreground"
                >
                  <option value="parent">{t("signup_role_parent")}</option>
                  <option value="educator">{t("signup_role_educator")}</option>
                  <option value="researcher">{t("signup_role_researcher")}</option>
                </select>
              </div>

              {/* Agreement Checkbox */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.agreement}
                    onChange={(e) => setFormData({ ...formData, agreement: e.target.checked })}
                    required
                    className="mt-1 w-5 h-5 border-2 border-primary/30 rounded focus:ring-2 focus:ring-primary text-primary cursor-pointer"
                  />
                  <span className="text-sm text-foreground leading-relaxed">
                    {t("signup_agreement_text")}
                  </span>
                </label>
              </div>

              {/* Create Account Button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 font-medium text-lg"
              >
                {t("signup_submit_button")}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                {t("signup_already_have_account")}{' '}
                <button
                  onClick={() => router.push("/login")}
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  {t("signup_login_link")}
                </button>
              </p>
            </div>

            {/* Privacy Note */}
            <div className="mt-6 flex items-start gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p>
                {t("signup_privacy_note")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}