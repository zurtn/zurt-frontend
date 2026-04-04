import { Landmark, BarChart3, Users, Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const AboutSection = () => {
  const { t } = useTranslation('landing');

  const points = [
    { icon: Landmark, titleKey: "about.openFinance.title", descKey: "about.openFinance.description", accent: "primary" },
    { icon: BarChart3, titleKey: "about.realTimeAnalysis.title", descKey: "about.realTimeAnalysis.description", accent: "accent" },
    { icon: Users, titleKey: "about.forYouAndConsultant.title", descKey: "about.forYouAndConsultant.description", accent: "success" },
    { icon: Shield, titleKey: "about.security.title", descKey: "about.security.description", accent: "warning" },
  ];

  const accentStyles: Record<string, { iconBg: string; iconColor: string; borderHover: string }> = {
    primary: { iconBg: "bg-primary/10", iconColor: "text-primary", borderHover: "hover:border-primary/30" },
    accent: { iconBg: "bg-accent/10", iconColor: "text-accent", borderHover: "hover:border-accent/30" },
    success: { iconBg: "bg-success/10", iconColor: "text-success", borderHover: "hover:border-success/30" },
    warning: { iconBg: "bg-warning/10", iconColor: "text-warning", borderHover: "hover:border-warning/30" },
  };

  return (
    <section id="about" className="relative py-20 md:py-28 scroll-mt-20">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-transparent to-transparent" />

      <div className="container mx-auto px-6 sm:px-4 relative">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <p className="text-sm font-semibold text-primary mb-3 tracking-wide uppercase">
            {t('about.heading')}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
            {t('about.heading')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('about.description')}
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {points.map(({ icon: Icon, titleKey, descKey, accent }, index) => {
            const styles = accentStyles[accent];
            return (
              <div
                key={titleKey}
                className={`group relative p-6 rounded-xl bg-card border border-border ${styles.borderHover} transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1`}
              >
                {/* Top accent line on hover */}
                <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className={`w-11 h-11 rounded-lg ${styles.iconBg} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className={`h-5 w-5 ${styles.iconColor}`} />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{t(titleKey)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(descKey)}</p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20">
            <Link to="/register" className="flex items-center gap-2">
              {t('about.cta')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
