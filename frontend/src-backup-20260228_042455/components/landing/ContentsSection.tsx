import { BookOpen, Target, AlertTriangle, CreditCard } from "lucide-react";
import { useTranslation } from "react-i18next";

const ContentsSection = () => {
  const { t } = useTranslation('landing');

  const items = [
    { id: "about", labelKey: "contents.knowPlatform", icon: BookOpen, number: "01" },
    { id: "goals", labelKey: "contents.goalsObjectives", icon: Target, number: "02" },
    { id: "risk", labelKey: "contents.risksAlerts", icon: AlertTriangle, number: "03" },
    { id: "tools", labelKey: "contents.pricingPlans", icon: CreditCard, number: "04" },
  ];

  return (
    <section id="contents" className="relative py-16 md:py-20 scroll-mt-20">
      <div className="container mx-auto px-6 sm:px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            {t('contents.heading')}
          </h2>
          <p className="text-muted-foreground mb-10">
            {t('contents.description')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {items.map(({ id, labelKey, icon: Icon, number }) => (
              <a
                key={id}
                href={`#${id}`}
                className="group flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-card-hover transition-all duration-300 text-left"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById(id);
                  if (el) {
                    const headerOffset = 80;
                    const elementPosition = el.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                  }
                }}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors flex-shrink-0">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-foreground text-sm">{t(labelKey)}</span>
                </div>
                <span className="text-xs font-mono text-muted-foreground/50 group-hover:text-primary/50 transition-colors">
                  {number}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContentsSection;
