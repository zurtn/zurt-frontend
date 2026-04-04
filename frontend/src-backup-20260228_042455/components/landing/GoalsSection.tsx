import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const GoalsSection = () => {
  const { t } = useTranslation('landing');

  const alerts = [
    t('goals.alert1'),
    t('goals.alert2'),
    t('goals.alert3'),
    t('goals.alert4'),
    t('goals.alert5'),
  ];

  return (
    <section id="goals" className="py-20 bg-background scroll-mt-20">
      <div className="container mx-auto px-6 sm:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — Content */}
          <div className="space-y-6">
            <p className="text-sm font-semibold text-primary tracking-wide uppercase">
              {t('contents.goalsObjectives', 'Metas e objetivos')}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
              {t('goals.heading')}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('goals.description')}
            </p>
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20">
              <Link to="/register" className="flex items-center gap-2">
                {t('goals.cta')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Right — Scrolling Alerts */}
          <div className="bg-card border border-border rounded-xl p-6 overflow-hidden shadow-card">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <span className="text-sm font-semibold text-foreground">
                {t('risk.alertsTitle', 'Alertas em Tempo Real')}
              </span>
              <div className="ml-auto flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                <span className="text-[10px] text-muted-foreground">{t('risk.updatedNow', 'Atualizado agora')}</span>
              </div>
            </div>

            <div className="relative h-[350px] overflow-hidden">
              {/* Fade edges */}
              <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-card to-transparent z-10 pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card to-transparent z-10 pointer-events-none" />

              {/* Animated scroll container */}
              <div
                className="absolute w-full animate-scrollUp"
                style={{ willChange: 'transform', top: 0, left: 0 }}
              >
                {[...alerts, ...alerts, ...alerts].map((alert, index) => (
                  <div
                    key={`alert-${index}`}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors duration-200 mb-2.5"
                  >
                    <div className="p-1.5 rounded-md bg-warning/10 flex-shrink-0 mt-0.5">
                      <AlertTriangle className="h-3 w-3 text-warning" />
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{alert}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoalsSection;
