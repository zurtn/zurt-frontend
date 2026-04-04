import { Check, X } from "lucide-react";
import { Link } from "react-router-dom";

interface PlanDef {
  name: string;
  price: string;
  cents: string;
  description: string;
  features: { text: string; ok: boolean }[];
  featured: boolean;
  disabled: boolean;
  cta: string;
  href: string;
}

const plans: PlanDef[] = [
  {
    name: "Starter",
    price: "29",
    cents: ",90",
    description: "Organize seu dinheiro em um só lugar.",
    features: [
      { text: "3 conexões bancárias", ok: true },
      { text: "Dashboard completo", ok: true },
      { text: "Cotações de mercado", ok: true },
      { text: "10 perguntas ao ZURT Agent", ok: true },
      { text: "Integração B3", ok: false },
      { text: "Relatórios PDF", ok: false },
    ],
    featured: false,
    disabled: false,
    cta: "Começar agora",
    href: "/register",
  },
  {
    name: "Pro",
    price: "79",
    cents: ",90",
    description: "Visão completa do seu patrimônio.",
    features: [
      { text: "Conexões ilimitadas", ok: true },
      { text: "Integração B3", ok: true },
      { text: "ZURT Agent ilimitado", ok: true },
      { text: "Relatórios PDF", ok: true },
      { text: "Alertas inteligentes", ok: true },
      { text: "Score financeiro", ok: true },
    ],
    featured: true,
    disabled: false,
    cta: "Assinar Pro",
    href: "/register",
  },
  {
    name: "Family",
    price: "149",
    cents: ",90",
    description: "Patrimônio familiar consolidado.",
    features: [
      { text: "Tudo do Pro incluído", ok: true },
      { text: "Até 5 membros", ok: true },
      { text: "Dashboard familiar", ok: true },
      { text: "Relatórios por membro", ok: true },
      { text: "Permissões de visibilidade", ok: true },
      { text: "Convites por email/link", ok: true },
    ],
    featured: false,
    disabled: false,
    cta: "Assinar Family",
    href: "/register",
  },
  {
    name: "Enterprise",
    price: "499",
    cents: ",90",
    description: "Seu consultor dedicado.",
    features: [
      { text: "Tudo do Family incluído", ok: true },
      { text: "Até 10 membros", ok: true },
      { text: "Consultor dedicado CVM", ok: true },
      { text: "Reunião mensal", ok: true },
      { text: "Análise personalizada", ok: true },
      { text: "WhatsApp direto", ok: true },
    ],
    featured: false,
    disabled: true,
    cta: "Em breve",
    href: "#",
  },
];

const PricingSection = () => {
  return (
    <section id="tools" className="relative py-24 md:py-32 scroll-mt-20" style={{ background: '#000' }}>
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="landing-reveal text-center mb-16">
          <h2 className="display-font" style={{ fontSize: 'clamp(40px, 5vw, 64px)', color: '#F0F0EE' }}>
            ESCOLHA SEU <span style={{ color: '#00FF7A' }}>PLANO</span>
          </h2>
          <p className="body-font mt-4 text-base" style={{ color: 'rgba(255,255,255,0.4)', maxWidth: '480px', margin: '16px auto 0' }}>
            Comece e faça upgrade conforme cresce. Cancele quando quiser.
          </p>
        </div>

        {/* Plans grid */}
        <div className="landing-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-[1200px] mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`plan-card-hover relative flex flex-col p-6 border ${
                plan.disabled ? 'opacity-45 pointer-events-none' : ''
              }`}
              style={{
                background: plan.featured ? 'rgba(0,255,122,0.03)' : 'rgba(255,255,255,0.02)',
                borderColor: plan.featured ? 'rgba(0,255,122,0.3)' : 'rgba(255,255,255,0.06)',
              }}
            >
              {/* Featured tag */}
              {plan.featured && (
                <div
                  className="absolute -top-px left-1/2 -translate-x-1/2 mono-font text-[9px] tracking-[0.16em] uppercase px-4 py-1"
                  style={{ background: '#00FF7A', color: '#000', fontWeight: 500 }}
                >
                  Mais Popular
                </div>
              )}

              {/* Disabled tag */}
              {plan.disabled && (
                <div
                  className="absolute top-4 right-4 mono-font text-[9px] tracking-[0.12em] uppercase px-2.5 py-1 border"
                  style={{ color: 'rgba(255,255,255,0.3)', borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}
                >
                  Em breve
                </div>
              )}

              {/* Name */}
              <div className="mono-font text-[10px] tracking-[0.18em] uppercase mb-6"
                style={{ color: plan.featured ? '#00FF7A' : 'rgba(255,255,255,0.35)' }}>
                {plan.name}
              </div>

              {/* Price */}
              <div className="flex items-baseline mb-1">
                <span className="display-font" style={{ fontSize: '48px', color: '#F0F0EE', lineHeight: 1 }}>
                  <span style={{ fontSize: '20px', color: 'rgba(255,255,255,0.4)' }}>R$</span>
                  {plan.price}
                </span>
                <span className="body-font text-lg" style={{ color: 'rgba(255,255,255,0.4)' }}>{plan.cents}</span>
              </div>
              <div className="mono-font text-[10px] tracking-[0.1em] uppercase mb-2" style={{ color: 'rgba(255,255,255,0.2)' }}>
                por mês
              </div>

              {/* Description */}
              <p className="body-font text-xs mb-6" style={{ color: 'rgba(255,255,255,0.35)', minHeight: '32px' }}>
                {plan.description}
              </p>

              {/* Divider */}
              <div className="h-px mb-5" style={{ background: 'rgba(255,255,255,0.06)' }} />

              {/* Features */}
              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map((f, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    {f.ok ? (
                      <Check className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" style={{ color: '#00FF7A' }} />
                    ) : (
                      <X className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.15)' }} />
                    )}
                    <span className="body-font text-xs" style={{ color: f.ok ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)' }}>
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {plan.disabled ? (
                <div
                  className="mono-font text-center text-[11px] tracking-[0.14em] uppercase py-3 border"
                  style={{ borderColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.2)', cursor: 'not-allowed' }}
                >
                  Indisponível
                </div>
              ) : (
                <Link
                  to={plan.href}
                  className="mono-font text-center text-[11px] tracking-[0.14em] uppercase py-3 block border transition-all hover:opacity-85"
                  style={
                    plan.featured
                      ? { background: '#00FF7A', color: '#000', borderColor: '#00FF7A', fontWeight: 500 }
                      : { borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)' }
                  }
                >
                  {plan.cta}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
