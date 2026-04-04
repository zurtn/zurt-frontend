import { useState } from "react";

const faqs = [
  {
    q: "O ZURT acessa minha senha bancária?",
    a: "Nunca. O ZURT utiliza Open Finance regulamentado pelo Banco Central do Brasil. A autorização é feita diretamente no aplicativo do seu banco, com acesso somente-leitura. Nunca movimentamos valores.",
  },
  {
    q: "Quais bancos são suportados?",
    a: "Todos que participam do Open Finance do Banco Central — Itaú, Bradesco, BB, Santander, Nubank, Inter, BTG, XP e mais de 200 instituições. Além disso, integração direta com a B3 nos planos Pro e superiores.",
  },
  {
    q: "O que é o ZURT Agent?",
    a: "Assistente financeiro com IA. Analisa seu patrimônio, responde perguntas sobre investimentos e envia alertas proativos sobre oportunidades e riscos.",
  },
  {
    q: "Posso mudar de plano?",
    a: "Sim. Upgrade ou downgrade a qualquer momento. Valor ajustado proporcionalmente no próximo ciclo.",
  },
  {
    q: "Como funciona o grupo familiar?",
    a: "O admin convida membros por email ou link. Cada membro conecta suas contas. O admin configura permissões de visibilidade. Dashboard consolida o patrimônio de toda a família.",
  },
  {
    q: "Por que o Enterprise está indisponível?",
    a: "Inclui consultor de investimentos dedicado e credenciado pela CVM. Estamos finalizando a estrutura regulatória. Em breve.",
  },
  {
    q: "Como cancelo?",
    a: "No app, Configurações → Assinatura. Cancelamento imediato, sem multa. Acesso mantido até o fim do período pago.",
  },
];

const LandingFAQ = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-24 md:py-32 scroll-mt-20" style={{ background: '#000' }}>
      <div className="section-divider absolute top-0 left-0 right-0" />

      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="landing-reveal text-center mb-14">
            <h2 className="display-font" style={{ fontSize: 'clamp(36px, 4.5vw, 56px)', color: '#F0F0EE' }}>
              PERGUNTAS <span style={{ color: '#00FF7A' }}>FREQUENTES</span>
            </h2>
          </div>

          {/* Items */}
          <div className="landing-reveal">
            {faqs.map((faq, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={i}
                  className="border-b cursor-pointer"
                  style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <div className="flex justify-between items-center py-5 gap-4 group">
                    <span
                      className="body-font text-sm md:text-base font-medium transition-colors"
                      style={{ color: isOpen ? '#00FF7A' : '#F0F0EE' }}
                    >
                      {faq.q}
                    </span>
                    <span
                      className="text-lg flex-shrink-0 transition-transform duration-300"
                      style={{
                        color: isOpen ? '#00FF7A' : 'rgba(255,255,255,0.2)',
                        transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                      }}
                    >
                      +
                    </span>
                  </div>
                  <div
                    className="overflow-hidden transition-all duration-350"
                    style={{
                      maxHeight: isOpen ? '200px' : '0px',
                      opacity: isOpen ? 1 : 0,
                      paddingBottom: isOpen ? '20px' : '0px',
                    }}
                  >
                    <p className="body-font text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="landing-reveal container mx-auto px-6 mt-20 text-center">
        <h2 className="display-font mb-4" style={{ fontSize: 'clamp(32px, 4vw, 48px)', color: '#F0F0EE' }}>
          PARE DE ADIVINHAR.<br />
          <span style={{ color: '#00FF7A' }}>COMECE A SABER.</span>
        </h2>
        <p className="body-font text-sm mb-8" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Sem compromisso. Cancele quando quiser.
        </p>
        <a
          href="/register"
          className="inline-block mono-font text-xs tracking-[0.12em] uppercase px-12 py-4 transition-opacity hover:opacity-85"
          style={{ background: '#00FF7A', color: '#000', fontWeight: 500 }}
        >
          Criar conta
        </a>
      </div>
    </section>
  );
};

export default LandingFAQ;
