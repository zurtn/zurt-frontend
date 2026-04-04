import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation('landing');

  return (
    <footer className="border-t border-border bg-card/50 py-16">
      <div className="container px-6 sm:px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-1.5 mb-4">
              <span className="font-heading font-bold text-xl tracking-tight">
                <span className="gradient-text">z</span>
                <span className="text-foreground">urT</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-[240px]">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground text-sm">{t('footer.product')}</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link to="/pricing" className="hover:text-foreground transition-colors">{t('footer.pricing')}</Link></li>
              <li><Link to="/features" className="hover:text-foreground transition-colors">{t('footer.features')}</Link></li>
              <li><Link to="/security" className="hover:text-foreground transition-colors">{t('footer.security')}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground text-sm">{t('footer.company')}</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground transition-colors">{t('footer.about')}</Link></li>
              <li><Link to="/blog" className="hover:text-foreground transition-colors">{t('footer.blog')}</Link></li>
              <li><Link to="/careers" className="hover:text-foreground transition-colors">{t('footer.careers')}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground text-sm">{t('footer.legal')}</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link to="/privacy" className="hover:text-foreground transition-colors">{t('footer.privacyPolicy')}</Link></li>
              <li><Link to="/terms" className="hover:text-foreground transition-colors">{t('footer.termsOfService')}</Link></li>
              <li><Link to="/cookies" className="hover:text-foreground transition-colors">{t('footer.cookiePolicy')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>{t('footer.copyright')}</p>
          <p>{t('footer.madeWith')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
