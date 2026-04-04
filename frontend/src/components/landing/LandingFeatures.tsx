import { useEffect } from "react";

const features = [
  {
    tag: "CONSOLIDAÇÃO",
    title: "TODOS OS SEUS\nBANCOS EM UM\nSÓ LUGAR",
    desc: "Conecte Itaú, Bradesco, Nubank, XP, BTG e mais de 200 instituições via Open Finance do Banco Central. Saldo, transações e investimentos atualizados a cada 6 horas.",
    icon: "⊘",
  },
  {
    tag: "MERCADO",
    title: "DADOS DIRETO\nDA B3",
    desc: "Ações, FIIs, ETFs, BDRs e renda fixa importados automaticamente da Área do Investidor B3. Posição real, não estimativa.",
    icon: "◈",
  },
  {
    tag: "INTELIGÊNCIA",
    title: "SEU ASSISTENTE\nFINANCEIRO\nCOM IA",
    desc: "O ZURT Agent analisa seu patrimônio, responde perguntas sobre seus investimentos e envia alertas proativos sobre oportunidades e riscos.",
    icon: "⟐",
  },
  {
    tag: "FAMÍLIA",
    title: "PATRIMÔNIO\nFAMILIAR\nCONSOLIDADO",
    desc: "Convide membros da família. Configure quem vê o quê. Dashboard unificado com o patrimônio completo de toda a família.",
    icon: "◉",
  },
];

const LandingFeatures = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll(".landing-reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className="relative scroll-mt-20" style={{ background: '#000' }}>
      {features.map((feat, i) => {
        const isEven = i % 2 === 0;
        return (
          <div key={feat.tag}>
            <div className="container mx-auto px-6">
              <div
                className={`landing-reveal grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center py-20 md:py-28 ${
                  isEven ? "" : "direction-rtl"
                }`}
                style={{ direction: isEven ? "ltr" : "rtl" }}
              >
                {/* Text side */}
                <div style={{ direction: "ltr" }} className="space-y-6">
                  <span
                    className="mono-font inline-block text-[10px] tracking-[0.2em] uppercase px-3 py-1 border"
                    style={{ color: '#00FF7A', borderColor: 'rgba(0,255,122,0.2)', background: 'rgba(0,255,122,0.04)' }}
                  >
                    {feat.tag}
                  </span>
                  <h2
                    className="display-font leading-[0.95]"
                    style={{ fontSize: 'clamp(36px, 5vw, 56px)', color: '#F0F0EE', whiteSpace: 'pre-line' }}
                  >
                    {feat.title}
                  </h2>
                  <p className="body-font text-sm md:text-base leading-relaxed max-w-md" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    {feat.desc}
                  </p>
                </div>

                {/* Visual side */}
                <div style={{ direction: "ltr" }} className="flex justify-center">
                  <div
                    className="relative w-full max-w-[400px] aspect-square rounded-2xl flex items-center justify-center feature-card border"
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      borderColor: 'rgba(255,255,255,0.06)',
                    }}
                  >
                    <div className="absolute inset-0 rounded-2xl" style={{
                      background: `radial-gradient(circle at ${isEven ? '30% 30%' : '70% 70%'}, rgba(0,255,122,0.04) 0%, transparent 60%)`
                    }} />
                    <span className="text-[80px] md:text-[120px] opacity-20" style={{ color: '#00FF7A' }}>{feat.icon}</span>
                  </div>
                </div>
              </div>
            </div>
            {i < features.length - 1 && <div className="section-divider" />}
          </div>
        );
      })}

      {/* Stats bar */}
      <div className="section-divider" />
      <div className="landing-reveal py-16 md:py-20" style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: "200+", label: "Instituições" },
              { num: "6h", label: "Sync automático" },
              { num: "0", label: "Senhas armazenadas" },
              { num: "100%", label: "Somente leitura" },
            ].map((s) => (
              <div key={s.label}>
                <div className="display-font neon-text-glow" style={{ fontSize: 'clamp(36px, 4vw, 56px)', color: '#00FF7A' }}>
                  {s.num}
                </div>
                <div className="mono-font text-[10px] tracking-[0.14em] uppercase mt-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="section-divider" />
    </section>
  );
};

export default LandingFeatures;
