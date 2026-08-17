import React from 'react';
import { cor, fonte, raio } from '@/design/tokens';

/**
 * KpiCard — extraído do design (Claude Design), não recriado de memória.
 *
 * Medidas verbatim do markup original:
 *   raio 14 · borda rgba(255,255,255,0.06) · fundo rgba(255,255,255,0.03)
 *   backdrop blur 20 · padding 16 · min-height 118 · gap 12
 *   eyebrow  9px   mono 700 tracking .2em  #52525b
 *   valor   21px   mono 600 tracking -.02em, cor por KPI
 *   delta   10.5px mono 600
 *   sub     11.5px #71717a
 *   sparkline 56×20, stroke 1.5, opacity .85
 *
 * REGRA: `valor` aceita null. Ausência NÃO vira "0" nem "R$ 0,00" — vira "—"
 * com o motivo no `sub`. Foi essa confusão que fez patrimônio real aparecer
 * como R$ 0 no site em 26/07.
 */
export interface KpiCardProps {
  /** Eyebrow em caixa alta. Ex.: "LIQUIDEZ IMEDIATA" */
  label: string;
  /** Valor já formatado. `null` = indisponível, renderiza "—". */
  valor: string | null;
  /** Cor do valor e da sparkline. Default: acento. */
  corValor?: string;
  /** Apoio à esquerda: variação ou contagem. */
  delta?: string;
  /** ▲ ▼ ou nada. Some quando o dado não permite afirmar direção. */
  seta?: '▲' | '▼' | '';
  corDelta?: string;
  /** Contexto à direita do delta. Ex.: "497 proventos" */
  sub?: string;
  /** Pontos "x,y x,y" da polyline. Sem pontos, não desenha. */
  spark?: string;
  /** Glow do card principal. */
  destaque?: boolean;
}

export function KpiCard({
  label, valor, corValor = cor.acento, delta, seta = '',
  corDelta = cor.textoFraco, sub, spark, destaque = false,
}: KpiCardProps) {
  const indisponivel = valor == null;

  return (
    <div
      style={{
        borderRadius: 14,
        border: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px)',
        padding: 16,
        minHeight: 118,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 12,
        boxShadow: destaque ? `0 0 40px -10px ${corValor}26` : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ fontFamily: fonte.dado, fontSize: 9, fontWeight: 700,
                      letterSpacing: '0.2em', color: cor.textoMinimo }}>
          {label}
        </div>
        {/* Sem série, sem sparkline. Linha reta inventada seria dado falso. */}
        {spark && !indisponivel && (
          <svg width={56} height={20} style={{ overflow: 'visible', flexShrink: 0 }} aria-hidden>
            <polyline points={spark} fill="none" stroke={corValor}
                      strokeWidth={1.5} strokeLinecap="round"
                      strokeLinejoin="round" opacity={0.85} />
          </svg>
        )}
      </div>

      <div>
        <div style={{ fontFamily: fonte.dado, fontSize: 21, fontWeight: 600,
                      letterSpacing: '-0.02em', whiteSpace: 'nowrap',
                      color: indisponivel ? cor.textoFraco : corValor }}>
          {indisponivel ? '—' : valor}
        </div>
        {(delta || sub) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 5 }}>
            {delta && !indisponivel && (
              <span style={{ fontFamily: fonte.dado, fontSize: 10.5, fontWeight: 600,
                             color: corDelta, display: 'inline-flex',
                             alignItems: 'center', gap: 4 }}>
                {seta}{delta}
              </span>
            )}
            {sub && <span style={{ fontSize: 11.5, color: cor.textoFraco }}>{sub}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
