"use client";
import { Brain, BookOpen, Shield, Users, CheckCircle, ArrowRight, Sparkles, Lock, Heart, Star, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '../hooks/useTranslation';
import { LanguageSwitcher } from './ui/LanguageSwitcher';
import { MarioHero } from './MarioHero';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export default function LandingPage() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => router.push("/")}>
            <div className="w-10 h-10 bg-primary border-2 border-black rounded-lg flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:translate-y-[-2px] transition-transform">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-black text-foreground tracking-tight">{t("landing_brand")}</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#how" className="text-foreground font-bold hover:text-primary transition-colors">{t("landing_nav_how")}</a>
            <a href="#why" className="text-foreground font-bold hover:text-primary transition-colors">{t("landing_nav_why")}</a>
            <a href="#who" className="text-foreground font-bold hover:text-primary transition-colors">{t("landing_nav_who")}</a>
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Button 
              variant="ghost"
              onClick={() => router.push("/login")}
              className="hidden sm:flex"
            >
              {t("landing_btn_signin")}
            </Button>
            <Button 
              onClick={() => router.push("/signup")}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {t("landing_btn_getstarted")}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent border-2 border-black text-accent-foreground rounded-full mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-bold uppercase tracking-wider">{t("landing_hero_badge")}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-foreground mb-6 leading-[1.1] drop-shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">
              {t("landing_hero_title").split('\n').map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </h1>
            
            <p className="text-xl text-foreground/80 mb-10 max-w-xl leading-relaxed font-medium">
              {t("landing_hero_subtitle")}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button 
                size="lg"
                onClick={() => router.push("/signup")}
                className="w-full sm:w-auto text-xl py-8 px-10 h-auto"
              >
                {t("landing_hero_btn_start")}
                <ArrowRight className="w-6 h-6" />
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-xl py-8 px-10 h-auto"
              >
                {t("landing_hero_btn_learn")}
                <BookOpen className="w-6 h-6" />
              </Button>
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-4 bg-primary/20 rounded-3xl blur-2xl group-hover:bg-primary/30 transition-colors" />
            <MarioHero />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-24 px-6 bg-secondary/10 border-y-4 border-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4 uppercase tracking-tight">{t("landing_how_title")}</h2>
            <div className="w-24 h-2 bg-primary mx-auto mb-6" />
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto font-medium">
              {t("landing_how_subtitle")}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: "landing_how_step1_title", desc: "landing_how_step1_desc", color: "bg-primary" },
              { icon: Brain, title: "landing_how_step2_title", desc: "landing_how_step2_desc", color: "bg-secondary" },
              { icon: Sparkles, title: "landing_how_step3_title", desc: "landing_how_step3_desc", color: "bg-accent" }
            ].map((step, i) => (
              <Card key={i} className="hover:translate-y-[-8px] transition-transform duration-300">
                <CardHeader>
                  <div className={`w-16 h-16 ${step.color} border-2 border-black rounded-xl flex items-center justify-center mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-black">{t(step.title)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/70 font-medium leading-relaxed">
                    {t(step.desc)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why NeuroBloom */}
      <section id="why" className="py-24 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4 uppercase tracking-tight">{t("landing_why_title")}</h2>
            <div className="w-24 h-2 bg-secondary mx-auto mb-6" />
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto font-medium">
              {t("landing_why_subtitle")}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { icon: CheckCircle, title: "landing_why_feature1_title", desc: "landing_why_feature1_desc" },
              { icon: Shield, title: "landing_why_feature2_title", desc: "landing_why_feature2_desc" },
              { icon: Lock, title: "landing_why_feature3_title", desc: "landing_why_feature3_desc" },
              { icon: Users, title: "landing_why_feature4_title", desc: "landing_why_feature4_desc" }
            ].map((feature, i) => (
              <div key={i} className="bg-card p-6 rounded-xl border-2 border-black shadow-sm flex gap-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-accent/20 border-2 border-black rounded-lg flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <feature.icon className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-foreground mb-2 uppercase">{t(feature.title)}</h3>
                  <p className="text-foreground/70 font-medium">{t(feature.desc)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section id="who" className="py-24 px-6 bg-accent/10 border-y-4 border-black">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-16 uppercase tracking-tight">{t("landing_who_title")}</h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: Heart, title: "landing_who_parents_title", desc: "landing_who_parents_desc", color: "bg-primary" },
              { icon: BookOpen, title: "landing_who_educators_title", desc: "landing_who_educators_desc", color: "bg-secondary" },
              { icon: Brain, title: "landing_who_researchers_title", desc: "landing_who_researchers_desc", color: "bg-accent" }
            ].map((item, i) => (
              <div key={i} className="group">
                <div className={`w-20 h-20 ${item.color} border-4 border-black rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-black text-foreground mb-4 uppercase">{t(item.title)}</h3>
                <p className="text-foreground/70 font-medium leading-relaxed">
                  {t(item.desc)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ethics & Trust */}
      <section id="ethics" className="py-24 px-6 bg-foreground text-background relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block p-4 bg-primary border-4 border-black mb-8 rotate-[-2deg] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-3xl md:text-4xl font-black uppercase text-white tracking-widest">{t("landing_ethics_title")}</h2>
          </div>
          <p className="text-xl text-background/80 mb-12 leading-relaxed font-bold italic">
            "{t("landing_ethics_subtitle")}"
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 text-left">
            {[
              { icon: Shield, title: "landing_ethics_item1_title", desc: "landing_ethics_item1_desc" },
              { icon: Lock, title: "landing_ethics_item2_title", desc: "landing_ethics_item2_desc" }
            ].map((item, i) => (
              <div key={i} className="bg-background/10 backdrop-blur-sm p-8 rounded-xl border-2 border-background/20 hover:border-background/40 transition-colors">
                <div className="flex items-start gap-4">
                  <item.icon className="w-8 h-8 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-black mb-2 uppercase tracking-tight">{t(item.title)}</h3>
                    <p className="text-background/70 font-medium leading-relaxed">
                      {t(item.desc)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-6 bg-accent border-b-4 border-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black text-foreground mb-8 uppercase tracking-tighter leading-none">
            {t("landing_cta_title")}
          </h2>
          <p className="text-xl text-foreground/80 mb-12 font-bold">
            {t("landing_cta_subtitle")}
          </p>
          <Button 
            size="lg"
            onClick={() => router.push("/signup")}
            className="text-2xl py-10 px-16 h-auto bg-primary hover:bg-primary shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:shadow-none translate-y-[-4px]"
          >
            {t("landing_cta_btn")}
            <ArrowRight className="w-8 h-8" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-16 px-6 relative">
        {/* Pipe decorations */}
        <div className="absolute top-0 left-10 w-16 h-8 bg-green-500 border-x-4 border-b-4 border-black rounded-b-lg" />
        <div className="absolute top-0 right-20 w-20 h-12 bg-green-500 border-x-4 border-b-4 border-black rounded-b-lg" />

        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-primary border-2 border-black rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-black tracking-tight">{t("landing_footer_brand")}</span>
              </div>
              <p className="text-background/60 font-medium leading-relaxed">
                {t("landing_footer_tagline")}
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-black uppercase mb-6 tracking-widest text-sm">{t("landing_footer_product")}</h4>
              <ul className="space-y-4 font-bold text-background/60">
                <li><a href="#how" className="hover:text-primary transition-colors">{t("landing_footer_link_how")}</a></li>
                <li><a href="#why" className="hover:text-primary transition-colors">{t("landing_footer_link_why")}</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">{t("landing_footer_link_pricing")}</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-black uppercase mb-6 tracking-widest text-sm">{t("landing_footer_company")}</h4>
              <ul className="space-y-4 font-bold text-background/60">
                <li><a href="#" className="hover:text-primary transition-colors">{t("landing_footer_link_about")}</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">{t("landing_footer_link_research")}</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">{t("landing_footer_link_contact")}</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-black uppercase mb-6 tracking-widest text-sm">{t("landing_footer_legal")}</h4>
              <ul className="space-y-4 font-bold text-background/60">
                <li><a href="#" className="hover:text-primary transition-colors">{t("landing_footer_link_privacy")}</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">{t("landing_footer_link_terms")}</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">{t("landing_footer_link_ethics")}</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t-2 border-background/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-background/40 font-bold text-sm">
            <p>{t("landing_footer_copyright")}</p>
            <div className="flex gap-6">
              <Trophy className="w-5 h-5 hover:text-accent cursor-pointer" />
              <Star className="w-5 h-5 hover:text-accent cursor-pointer" />
              <Sparkles className="w-5 h-5 hover:text-accent cursor-pointer" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
