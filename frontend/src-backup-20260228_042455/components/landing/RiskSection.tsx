import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Bell, CreditCard, TrendingUp, Shield, PieChart, Zap, Wallet, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const RiskSection = () => {
  const { t } = useTranslation('landing');

  const insights = [
    {
      icon: CreditCard,
      title: t('risk.insightBillDueTitle'),
      value: t('risk.insightBillDueValue'),
      accent: "warning",
    },
    {
      icon: Wallet,
      title: t('risk.insightLowBalanceTitle'),
      value: t('risk.insightLowBalanceValue'),
      accent: "info",
    },
    {
      icon: TrendingUp,
      title: t('risk.insightOpportunityTitle'),
      value: t('risk.insightOpportunityValue'),
      accent: "success",
    },
    {
      icon: PieChart,
      title: t('risk.insightRiskAnalysisTitle'),
      value: t('risk.insightRiskAnalysisValue'),
      accent: "warning",
    },
  ];

  const accentMap: Record<string, { bg: string; border: string; iconBg: string; iconColor: string }> = {
    warning: { bg: "from-warning/10 to-warning/5", border: "border-warning/20", iconBg: "bg-warning/10", iconColor: "text-warning" },
    info: { bg: "from-info/10 to-info/5", border: "border-info/20", iconBg: "bg-info/10", iconColor: "text-info" },
    success: { bg: "from-success/10 to-success/5", border: "border-success/20", iconBg: "bg-success/10", iconColor: "text-success" },
  };

  return (
    <section id="risk" className="py-20 pb-24 sm:pb-20 bg-background overflow-x-hidden scroll-mt-20">
      <div className="container mx-auto px-6 sm:px-4 min-w-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — Visual */}
          <div className="relative">
            <div className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden min-h-[500px] shadow-card">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-success/5 rounded-full blur-3xl" />

              {/* Header */}
              <div className="relative z-10 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Bell className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{t('risk.alertsTitle')}</h3>
                      <p className="text-xs text-muted-foreground">{t('risk.updatedNow')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
                    <Zap className="h-3 w-3 text-primary" />
                    <span className="text-xs font-medium text-primary">{t('risk.aiBadge')}</span>
                  </div>
                </div>
              </div>

              {/* Insight Cards Grid */}
              <div className="relative z-10 grid grid-cols-2 gap-3 mb-6">
                {insights.map((insight, index) => {
                  const Icon = insight.icon;
                  const styles = accentMap[insight.accent];
                  return (
                    <div
                      key={index}
                      className={`bg-gradient-to-br ${styles.bg} border ${styles.border} rounded-xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 ${styles.iconBg} rounded-lg flex-shrink-0 transition-transform group-hover:scale-110`}>
                          <Icon className={`h-4 w-4 ${styles.iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-muted-foreground mb-1">{insight.title}</p>
                          <p className="text-sm font-semibold text-foreground line-clamp-2">{insight.value}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Risk Visualization */}
              <div className="relative z-10 bg-background/40 rounded-xl p-5 border border-border/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-4">
                  <PieChart className="h-4 w-4 text-muted-foreground" />
                  <h4 className="text-sm font-semibold text-foreground">{t('risk.riskVisualization')}</h4>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{t('risk.portfolioRiskLevel')}</span>
                    <span className="text-xs font-bold text-warning bg-warning/10 px-2 py-1 rounded">{t('risk.moderate')}</span>
                  </div>

                  {/* Risk Progress Bar */}
                  <div className="relative h-2.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-success via-warning to-destructive rounded-full transition-all duration-1000"
                      style={{ width: '55%' }}
                    />
                  </div>

                  {/* Risk Categories */}
                  <div className="grid grid-cols-3 gap-3 mt-3">
                    {[
                      { label: t('risk.low'), color: "bg-success/50", bgColor: "bg-success/10", textColor: "text-success", height: "40%" },
                      { label: t('risk.medium'), color: "bg-warning/60", bgColor: "bg-warning/10", textColor: "text-warning", height: "70%" },
                      { label: t('risk.high'), color: "bg-destructive/50", bgColor: "bg-destructive/10", textColor: "text-destructive", height: "25%" },
                    ].map((cat) => (
                      <div key={cat.label} className="text-center">
                        <div className={`h-12 ${cat.bgColor} rounded-lg mb-2 flex items-end justify-center p-2`}>
                          <div className={`w-full ${cat.color} rounded-t transition-all duration-1000`} style={{ height: cat.height }} />
                        </div>
                        <p className={`text-xs font-medium ${cat.textColor}`}>{cat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Content */}
          <div className="space-y-6">
            <p className="text-sm font-semibold text-primary tracking-wide uppercase">
              {t('contents.risksAlerts', 'Riscos e alertas')}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
              {t('risk.heading')}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('risk.description')}
            </p>
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20">
              <Link to="/register" className="flex items-center gap-2">
                {t('risk.cta')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RiskSection;
