"use client";
import { Brain, BookOpen, Shield, Users, CheckCircle, ArrowRight, Sparkles, Lock, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '../hooks/useTranslation';
import { LanguageSwitcher } from './ui/LanguageSwitcher';

export default function LandingPage() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-semibold text-foreground">{t("landing_brand")}</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#how" className="text-muted-foreground hover:text-primary transition-colors">{t("landing_nav_how")}</a>
            <a href="#why" className="text-muted-foreground hover:text-primary transition-colors">{t("landing_nav_why")}</a>
            <a href="#who" className="text-muted-foreground hover:text-primary transition-colors">{t("landing_nav_who")}</a>
            <a href="#ethics" className="text-muted-foreground hover:text-primary transition-colors">{t("landing_nav_ethics")}</a>
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <button 
              onClick={() => router.push("/login")}
              className="px-4 py-2 text-primary hover:text-primary/80 transition-colors"
            >
              {t("landing_btn_signin")}
            </button>
            <button 
              onClick={() => router.push("/signup")}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
            >
              {t("landing_btn_getstarted")}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 opacity-60"></div>
        <div className="absolute inset-0 opacity-5">
          <img 
            src="https://images.unsplash.com/photo-1750969185331-e03829f72c7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMG5ldXJhbCUyMG5ldHdvcmt8ZW58MXx8fHwxNzY3Nzc0NDEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">{t("landing_hero_badge")}</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight whitespace-pre-wrap">
            {t("landing_hero_title")}
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            {t("landing_hero_subtitle")}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => router.push("/signup")}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 text-lg"
            >
              {t("landing_hero_btn_start")}
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 bg-background text-primary rounded-xl hover:bg-muted transition-all border-2 border-primary/20 flex items-center gap-2 text-lg">
              {t("landing_hero_btn_learn")}
              <BookOpen className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* How NeuroBloom Works */}
      <section id="how" className="py-20 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">{t("landing_how_title")}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("landing_how_subtitle")}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-2xl border border-border hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mb-6">
                <BookOpen className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-3">{t("landing_how_step1_title")}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("landing_how_step1_desc")}
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-2xl border border-border hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mb-6">
                <Brain className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-3">{t("landing_how_step2_title")}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("landing_how_step2_desc")}
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-2xl border border-border hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-3">{t("landing_how_step3_title")}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("landing_how_step3_desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why NeuroBloom */}
      <section id="why" className="py-20 px-6 bg-primary/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">{t("landing_why_title")}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("landing_why_subtitle")}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-xl border border-border flex gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{t("landing_why_feature1_title")}</h3>
                <p className="text-muted-foreground">{t("landing_why_feature1_desc")}</p>
              </div>
            </div>
            
            <div className="bg-card p-6 rounded-xl border border-border flex gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{t("landing_why_feature2_title")}</h3>
                <p className="text-muted-foreground">{t("landing_why_feature2_desc")}</p>
              </div>
            </div>
            
            <div className="bg-card p-6 rounded-xl border border-border flex gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{t("landing_why_feature3_title")}</h3>
                <p className="text-muted-foreground">{t("landing_why_feature3_desc")}</p>
              </div>
            </div>
            
            <div className="bg-card p-6 rounded-xl border border-border flex gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{t("landing_why_feature4_title")}</h3>
                <p className="text-muted-foreground">{t("landing_why_feature4_desc")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section id="who" className="py-20 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">{t("landing_who_title")}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("landing_who_subtitle")}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-card rounded-2xl border border-border">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-3">{t("landing_who_parents_title")}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("landing_who_parents_desc")}
              </p>
            </div>
            
            <div className="text-center p-8 bg-card rounded-2xl border border-border">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-3">{t("landing_who_educators_title")}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("landing_who_educators_desc")}
              </p>
            </div>
            
            <div className="text-center p-8 bg-card rounded-2xl border border-border">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Brain className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-3">{t("landing_who_researchers_title")}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("landing_who_researchers_desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ethics & Trust */}
      <section id="ethics" className="py-20 px-6 bg-foreground text-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1764336312138-14a5368a6cd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFpbiUyMHRlY2hub2xvZ3klMjBibHVlfGVufDF8fHx8MTc2NzkwMTczMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6">{t("landing_ethics_title")}</h2>
          <p className="text-xl text-muted mb-12 leading-relaxed">
            {t("landing_ethics_subtitle")}
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="bg-background/10 backdrop-blur-sm p-6 rounded-xl border border-background/20">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">{t("landing_ethics_item1_title")}</h3>
                  <p className="text-muted">
                    {t("landing_ethics_item1_desc")}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-background/10 backdrop-blur-sm p-6 rounded-xl border border-background/20">
              <div className="flex items-start gap-3">
                <Lock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">{t("landing_ethics_item2_title")}</h3>
                  <p className="text-muted">
                    {t("landing_ethics_item2_desc")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 bg-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t("landing_cta_title")}
          </h2>
          <p className="text-xl text-muted-foreground mb-10">
            {t("landing_cta_subtitle")}
          </p>
          <button 
            onClick={() => router.push("/signup")}
            className="px-10 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 text-lg mx-auto"
          >
            {t("landing_cta_btn")}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-muted py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-semibold text-background">{t("landing_footer_brand")}</span>
              </div>
              <p className="text-sm text-muted">
                {t("landing_footer_tagline")}
              </p>
            </div>
            
            <div>
              <h4 className="text-background font-semibold mb-3">{t("landing_footer_product")}</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#how" className="hover:text-primary transition-colors">{t("landing_footer_link_how")}</a></li>
                <li><a href="#why" className="hover:text-primary transition-colors">{t("landing_footer_link_why")}</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">{t("landing_footer_link_pricing")}</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-background font-semibold mb-3">{t("landing_footer_company")}</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">{t("landing_footer_link_about")}</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">{t("landing_footer_link_research")}</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">{t("landing_footer_link_contact")}</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-background font-semibold mb-3">{t("landing_footer_legal")}</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">{t("landing_footer_link_privacy")}</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">{t("landing_footer_link_terms")}</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">{t("landing_footer_link_ethics")}</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 text-center text-sm text-muted">
            <p>{t("landing_footer_copyright")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
