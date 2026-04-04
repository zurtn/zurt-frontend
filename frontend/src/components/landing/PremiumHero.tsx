import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const PremiumHero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: '#000' }}>
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,255,122,0.06) 0%, transparent 60%)' }} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,255,122,0.03) 0%, transparent 60%)' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10 pt-28 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-4 items-center">
          {/* Left: Content */}
          <div className="space-y-8 max-w-xl">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mono-font"
              style={{ borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#00FF7A' }} />
              <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Open Finance + B3
              </span>
            </div>

            {/* Headline */}
            <h1 className="display-font leading-[0.92]" style={{ fontSize: 'clamp(56px, 8vw, 96px)', color: '#F0F0EE' }}>
              VOCÊ NÃO SABE{" "}
              <span className="neon-text-glow" style={{ color: '#00FF7A' }}>QUANTO TEM.</span>
            </h1>

            {/* Sub */}
            <p className="body-font text-base md:text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)', maxWidth: '460px' }}>
              Seus investimentos estão espalhados em bancos, corretoras e na B3. 
              A ZURT consolida tudo em um único painel — com dados reais, não estimativas.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-7 py-3.5 mono-font text-xs tracking-[0.14em] uppercase transition-opacity hover:opacity-85"
                style={{ background: '#00FF7A', color: '#000', fontWeight: 500 }}
              >
                Começar agora
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center px-7 py-3.5 mono-font text-xs tracking-[0.14em] uppercase border transition-colors hover:border-white/30"
                style={{ borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)' }}
              >
                Já tenho conta
              </Link>
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap gap-6 pt-4 mono-font text-[10px] tracking-[0.12em] uppercase" style={{ color: 'rgba(255,255,255,0.3)' }}>
              <span>◈ Somente leitura</span>
              <span>◈ 200+ instituições</span>
              <span>◈ Dados direto da B3</span>
            </div>
          </div>

          {/* Right: Phone Mockup */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="phone-float relative">
              {/* Glow behind phone */}
              <div className="absolute inset-0 scale-110 rounded-[3rem] blur-[80px]"
                style={{ background: 'rgba(0,255,122,0.08)' }} />
              <img
                src="/phone-mokeup.png"
                alt="ZURT App"
                className="relative z-10 w-[280px] md:w-[340px] lg:w-[380px] h-auto"
                style={{ filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.6))' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom stats bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10 section-divider" />
    </section>
  );
};

export default PremiumHero;
