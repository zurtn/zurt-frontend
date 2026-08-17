import React from 'react';
import { cor, fonte, texto } from '@/design/tokens';

/**
 * PatrimonioHero — extraído do design, medidas verbatim.
 *
 *   raio 24 · aurora radial no topo (blur 40, opacity .4)
 *   eyebrow 9.5px mono tracking .24em
 *   valor: escala 52 → 36 → 28 conforme a largura (regra do design:
 *          o número grande NUNCA quebra em duas linhas)
 *   chip de variação: fundo rgba(16,185,129,.10), borda .18
 *   legenda 12.5px  #71717a
 *
 * REGRAS DE DADO:
 * - `valor` null → "—". Patrimônio ausente não é R$ 0,00.
 * - `variacao` null → o chip inteiro some. Sem série histórica não há
 *   direção para apontar, e seta que aponta sem base é dado inventado.
 * - `retorno` null → mostra "—" com o motivo. Hoje o histórico tem 12 dias
 *   (começou em 15/07/2026), então retorno no período ainda não existe.
 */
export interface PatrimonioHeroProps {
  valor: string | null;
  variacao?: string | null;
  legenda?: string;
  rotuloPeriodo?: string;
  retorno?: string | null;
  motivoSemRetorno?: string;
  cdi?: string | null;
  /** Largura do container, em px — decide a escala do número. */
  largura?: number;
  children?: React.ReactNode;
}

function escalaValor(largura: number): number {
  if (largura >= 1200) return texto.heroXl;   // 52
  if (largura >= 900)  return texto.heroMd;   // 36
  return texto.heroSm;                        // 28
}

export function PatrimonioHero({
  valor, variacao, legenda, rotuloPeriodo = 'NO PERÍODO',
  retorno, motivoSemRetorno, cdi, largura = 1280, children,
}: PatrimonioHeroProps) {
  const semValor = valor == null;
  const tamanho = escalaValor(largura);

  return (
    <section
      style={{
        position: 'relative',
        borderRadius: 24,
        border: '1px solid rgba(255,255,255,0.06)',
        background: cor.superficie,
        padding: 24,
        overflow: 'hidden',
        boxShadow: '0 20px 80px -30px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      {/* aurora — decorativa, não carrega informação */}
      <div aria-hidden style={{
        position: 'absolute', top: -130, left: '50%', transform: 'translateX(-50%)',
        width: '70%', height: 200, opacity: 0.4, filter: 'blur(40px)',
        pointerEvents: 'none',
        background: 'radial-gradient(ellipse, rgba(56,189,248,0.30) 0%, transparent 70%)',
      }} />

      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start',
                      justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: fonte.dado, fontSize: 9.5, fontWeight: 700,
                          letterSpacing: '0.24em', color: cor.textoMinimo }}>
              PATRIMÔNIO CONSOLIDADO
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 10 }}>
              <div style={{ fontFamily: fonte.dado, fontSize: tamanho, fontWeight: 600,
                            letterSpacing: '-0.03em', lineHeight: 1,
                            whiteSpace: 'nowrap',
                            color: semValor ? cor.textoFraco : cor.texto }}>
                {semValor ? '—' : valor}
              </div>

              {/* Sem variação, o chip não existe — não há direção a apontar. */}
              {variacao != null && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5,
                              padding: '4px 8px', borderRadius: 8,
                              background: 'rgba(16,185,129,0.10)',
                              border: '1px solid rgba(16,185,129,0.18)' }}>
                  <span style={{ color: cor.positivo, fontSize: 11 }}>↑</span>
                  <span style={{ fontFamily: fonte.dado, fontSize: 11.5,
                                 fontWeight: 600, color: cor.positivo }}>{variacao}</span>
                </div>
              )}
            </div>

            {legenda && (
              <div style={{ fontSize: 12.5, color: cor.textoFraco, marginTop: 8 }}>{legenda}</div>
            )}
          </div>

          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontFamily: fonte.dado, fontSize: 9, fontWeight: 700,
                          letterSpacing: '0.18em', color: cor.textoMinimo }}>
              RETORNO {rotuloPeriodo}
            </div>
            <div style={{ fontFamily: fonte.dado, fontSize: 20, fontWeight: 600,
                          marginTop: 6,
                          color: retorno == null ? cor.textoFraco : cor.positivo }}>
              {retorno ?? '—'}
            </div>
            <div style={{ fontFamily: fonte.dado, fontSize: 10,
                          color: cor.textoMinimo, marginTop: 3 }}>
              {retorno == null ? (motivoSemRetorno ?? '') : (cdi ? `CDI ${cdi}` : '')}
            </div>
          </div>
        </div>

        {children && <div style={{ marginTop: 20, position: 'relative' }}>{children}</div>}
      </div>
    </section>
  );
}
