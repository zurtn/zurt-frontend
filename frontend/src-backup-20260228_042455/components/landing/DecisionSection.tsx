import { useState, useEffect, useRef } from "react";
import { CheckCircle2, Building2, TrendingUp, CreditCard, Wallet, BarChart3, Shield, Zap, PieChart, ArrowUpRight, ArrowDownRight, Activity, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const DecisionSection = () => {
  const { t } = useTranslation('landing');
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true);
          else setIsVisible(false);
        });
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
  }, []);

  const useCountUp = (target: number, duration: number = 2000, enabled: boolean = true, decimals: number = 0) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
      if (!enabled) { setCount(0); return; }
      let startTime: number | null = null;
      let animationFrameId: number;
      const animate = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentValue = target * easeOutCubic;
        setCount(decimals === 0 ? Math.floor(currentValue) : Number(currentValue.toFixed(decimals)));
        if (progress < 1) animationFrameId = requestAnimationFrame(animate);
        else setCount(decimals === 0 ? target : Number(target.toFixed(decimals)));
      };
      animationFrameId = requestAnimationFrame(animate);
      return () => { if (animationFrameId) cancelAnimationFrame(animationFrameId); };
    }, [target, duration, enabled, decimals]);
    return count;
  };

  const PatrimonioValue = useCountUp(250, 2000, isVisible, 0);
  const RendimentoValue = useCountUp(12.5, 2000, isVisible, 1);
  const AtivosValue = useCountUp(24, 2000, isVisible, 0);

  const barTargets = [40, 65, 45, 75, 55, 85, 70, 60, 80, 75];
  const bars = barTargets.map((v, i) => useCountUp(v, 2000, isVisible, 0));

  const getBarColor = (h: number) => h <= 50 ? "from-primary to-primary/40" : h <= 70 ? "from-success to-success/40" : "from-accent to-accent/40";

  const integrationCards = [
    {
      icon: Shield, badge: Building2, title: t('decision.openFinanceTitle'), subtitle: t('decision.openFinanceSubtitle'),
      gradient: "from-primary/15 to-primary/5", borderColor: "border-primary/20",
      extra: (
        <div className="flex items-center gap-1 px-2 py-1 bg-success/15 rounded-md border border-success/20">
          <Zap className="h-3 w-3 text-success" />
          <span className="text-[10px] font-semibold text-success">{t('decision.syncLabel')}</span>
        </div>
      ),
    },
    {
      icon: BarChart3, badge: TrendingUp, title: t('decision.b3Title'), subtitle: t('decision.b3Subtitle'),
      gradient: "from-success/15 to-success/5", borderColor: "border-success/20",
      extra: (
        <div className="flex items-center gap-1 flex-wrap">
          {[t('decision.b3Acoes'), t('decision.b3FIIs'), t('decision.b3BDRs')].map((label) => (
            <span key={label} className="text-[10px] px-2 py-0.5 bg-success/10 text-success rounded font-medium border border-success/20">{label}</span>
          ))}
        </div>
      ),
    },
    {
      icon: Wallet, title: t('decision.connectedAccounts'), subtitle: t('decision.activeInstitutions'),
      gradient: "from-accent/15 to-accent/5", borderColor: "border-accent/20",
      extra: (
        <div className="flex -space-x-2">
          {["bg-primary", "bg-success", "bg-accent"].map((c, i) => (
            <div key={i} className={`w-6 h-6 ${c} rounded-full border-2 border-card`} />
          ))}
        </div>
      ),
      badgePosition: "right" as const,
    },
    {
      icon: CreditCard, title: t('decision.cardsTitle'), subtitle: t('decision.cardsSubtitle'),
      gradient: "from-warning/15 to-warning/5", borderColor: "border-warning/20",
      extra: (
        <div className="flex gap-1">
          <div className="w-8 h-5 bg-primary rounded border border-primary/30" style={{ transform: 'perspective(100px) rotateY(-5deg)' }} />
          <div className="w-8 h-5 bg-accent rounded border border-accent/30" style={{ transform: 'perspective(100px) rotateY(5deg)' }} />
        </div>
      ),
      badgePosition: "right" as const,
    },
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-background">
      <div className="container mx-auto px-6 sm:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — Dashboard Visual */}
          <div className="relative">
            <div className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden min-h-[550px] shadow-card">
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-success/5 rounded-full blur-3xl" />

              <div className="relative z-10 grid grid-cols-2 gap-4 min-h-[500px]">
                {/* Main Dashboard Card */}
                <div className="col-span-2 bg-gradient-to-br from-primary/10 to-transparent rounded-xl p-5 border border-primary/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-primary/15 rounded-lg">
                        <Activity className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-foreground">{t('decision.dashboardTitle')}</h3>
                        <p className="text-xs text-muted-foreground">{t('decision.dashboardSubtitle')}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {[0, 200, 400].map((d) => (
                        <div key={d} className="w-2 h-2 bg-success rounded-full animate-pulse" style={{ animationDelay: `${d}ms` }} />
                      ))}
                    </div>
                  </div>

                  {/* Bar Chart */}
                  <div className="h-24 bg-background/50 rounded-lg p-3 flex items-end justify-between gap-1 mb-3">
                    {barTargets.map((target, i) => (
                      <div
                        key={i}
                        className="flex-1 relative rounded-t overflow-hidden transition-all"
                        style={{ height: `${bars[i]}%` }}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-t ${getBarColor(target)} rounded-t`} />
                      </div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">{t('decision.patrimonio')}</p>
                      <p className="text-sm font-bold text-foreground">R$ {PatrimonioValue.toLocaleString('pt-BR')}k</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">{t('decision.rendimento')}</p>
                      <p className="text-sm font-bold text-success flex items-center justify-center gap-1">
                        <ArrowUpRight className="h-3 w-3" />
                        +{RendimentoValue.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">{t('decision.ativos')}</p>
                      <p className="text-sm font-bold text-foreground">{AtivosValue}</p>
                    </div>
                  </div>
                </div>

                {/* Integration Cards */}
                {integrationCards.map((card, i) => {
                  const Icon = card.icon;
                  const Badge = card.badge;
                  return (
                    <div
                      key={i}
                      className={`bg-gradient-to-br ${card.gradient} border ${card.borderColor} rounded-xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group relative overflow-hidden`}
                    >
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-3">
                          <div className="p-2 bg-background/30 rounded-lg">
                            <Icon className="h-5 w-5 text-foreground/80" />
                          </div>
                          {card.badgePosition === "right" && card.extra}
                          {Badge && !card.badgePosition && <Badge className="h-4 w-4 text-muted-foreground/60" />}
                        </div>
                        <h4 className="text-sm font-bold text-foreground mb-1">{card.title}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{card.subtitle}</p>
                        {!card.badgePosition && card.extra}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right — Content */}
          <div className="space-y-6">
            <p className="text-sm font-semibold text-primary tracking-wide uppercase">Open Finance + B3</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
              {t('decision.heading')}
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>{t('decision.paragraph1')}</p>
              <p>{t('decision.paragraph2')}</p>
              <p>{t('decision.paragraph3')}</p>
            </div>
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20">
              <Link to="/register" className="flex items-center gap-2">
                {t('decision.cta')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DecisionSection;
