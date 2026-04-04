import { ArrowRight, Shield, Landmark, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PremiumHero = () => {
  const { t } = useTranslation('landing');

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 bg-background">
        <div
          className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.07] animate-float"
          style={{ background: "var(--gradient-hero)", filter: "blur(120px)" }}
        />
        <div
          className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-[0.05] animate-float"
          style={{ background: "var(--gradient-primary)", filter: "blur(100px)", animationDelay: "1.5s" }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      <div className="container mx-auto px-6 sm:px-4 relative pt-28 sm:pt-32 pb-16" style={{ zIndex: 10 }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Copy */}
          <div className="space-y-8 max-w-xl">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <Shield className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium text-primary">Open Finance · BCB Regulado</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] tracking-tight">
              {t('hero.headlinePart1')}{" "}
              <span className="gradient-text">{t('hero.headlineHighlight')}</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
              {t('hero.description')}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 h-12 px-8 text-base font-semibold group">
                <Link to="/register">
                  {t('hero.cta')}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-border text-foreground hover:bg-muted/50 h-12 px-8 text-base">
                <Link to="/login">{t('navbar.login')}</Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Landmark className="h-4 w-4 text-primary/70" />
                <span>400+ instituições</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BarChart3 className="h-4 w-4 text-primary/70" />
                <span>B3 integrada</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-primary/70" />
                <span>Somente leitura</span>
              </div>
            </div>
          </div>

          {/* Right — Phone mockup */}
          <div className="relative flex justify-center lg:justify-end items-center" style={{ perspective: '1000px' }}>
            <div className="relative">
              {/* Glow */}
              <div className="absolute inset-0 rounded-[2.5rem] scale-110 animate-pulse-soft" style={{ background: "var(--gradient-primary)", opacity: 0.12, filter: "blur(60px)" }} />

              <img
                src="/phone-mokeup.png"
                alt={t('hero.altPhone')}
                className="relative w-[300px] lg:w-[380px] h-auto transition-transform duration-500 hover:scale-[1.03]"
                style={{ filter: 'drop-shadow(0 25px 60px rgba(0,0,0,0.4))', maxHeight: '620px', objectFit: 'contain' }}
                onError={(e) => { const t = e.target as HTMLImageElement; if (!t.src.includes('phone-mockup1')) t.src = '/phone-mockup1.png'; }}
              />

              {/* Floating cards — desktop */}
              <div className="absolute inset-0 hidden lg:block pointer-events-none" style={{ zIndex: 20 }}>
                <div className="absolute top-[15%] -left-[40px] animate-float" style={{ animationDelay: '0s' }}>
                  <div className="bg-card/90 backdrop-blur-md border border-border rounded-xl p-3 shadow-lg w-48">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                      <span className="text-xs font-semibold text-foreground">{t('hero.floatingOptimize')}</span>
                    </div>
                    <span className="text-sm font-bold text-success">{t('hero.floatingOptimizeValue')}</span>
                  </div>
                </div>
                <div className="absolute bottom-[25%] -left-[30px] animate-float" style={{ animationDelay: '1s' }}>
                  <div className="bg-card/90 backdrop-blur-md border border-border rounded-xl p-3 shadow-lg w-48">
                    <span className="text-xs font-semibold text-foreground">{t('hero.floatingGoalTitle')}</span>
                    <p className="text-sm font-bold text-foreground mt-0.5">{t('hero.floatingGoalAmount')}</p>
                    <p className="text-[10px] text-success mt-0.5">{t('hero.floatingGoalStatus')}</p>
                  </div>
                </div>
                <div className="absolute top-[40%] -right-[50px] animate-float" style={{ animationDelay: '2s' }}>
                  <div className="bg-card/90 backdrop-blur-md border border-warning/30 rounded-xl p-3 shadow-lg w-52">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-warning mt-1 animate-pulse" />
                      <p className="text-[11px] text-foreground leading-relaxed">{t('hero.floatingAlert')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumHero;
