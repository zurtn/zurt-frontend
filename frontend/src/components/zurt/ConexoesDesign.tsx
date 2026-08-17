import React from 'react';

/**
 * ConexoesDesign — CONVERTIDO do markup do Claude Design (bloco @44704).
 * Gerado por conv-final.cjs. Cada estilo e byte-a-byte o do design.
 * NAO EDITAR A MAO: se o design mudar, rode o conversor de novo.
 */
export interface ConexoesDesignProps {
  cxGanhos?: any;
  cxGrid?: any;
  cxHeadline?: any;
  cxResumo?: any;
  cxSub?: any;
  lowGrid?: any;
  origens?: any;
}

export function ConexoesDesign({ cxGanhos, cxGrid, cxHeadline, cxResumo, cxSub, lowGrid, origens }: ConexoesDesignProps) {
  return (
    <>
<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              <div style={{ display: 'grid', gridTemplateColumns: `${lowGrid}`, gap: '14px', alignItems: 'stretch' }}>
                <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.07)', background: 'linear-gradient(180deg, #0c1119 0%, #070a10 100%)', padding: '22px 24px' }}>
                  <div style={{ position: 'absolute', inset: '0', background: 'radial-gradient(ellipse 70% 60% at 8% 0%, rgba(56,189,248,0.13) 0%, transparent 60%)', pointerEvents: 'none' }}></div>
                  <div style={{ position: 'relative' }}>
                    <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9.5px', fontWeight: '700', letterSpacing: '0.24em', color: '#52525b' }}>ORIGENS DE DADO</div>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '-0.02em', margin: '12px 0 0', textWrap: 'pretty' }}>{cxHeadline}</h2>
                    <p style={{ fontSize: '13.5px', color: '#a1a1aa', lineHeight: '1.55', margin: '10px 0 0', maxWidth: '560px', textWrap: 'pretty' }}>{cxSub}</p>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '18px', flexWrap: 'wrap' }}>
                      {(cxResumo || []).map((r, ir) => (<React.Fragment key={ir}>
                        <div style={{ border: `1px solid ${r.bd}`, background: `${r.bg}`, borderRadius: '12px', padding: '10px 14px', minWidth: '132px' }}>
                          <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '8.5px', fontWeight: '700', letterSpacing: '0.18em', color: `${r.tone}` }}>{r.label}</div>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '5px' }}>
                            <span style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '18px', fontWeight: '600', color: `${r.tone}` }}>{r.n}</span>
                            <span style={{ fontSize: '11.5px', color: '#71717a' }}>{r.sub}</span>
                          </div>
                        </div>
                      </React.Fragment>))}
                    </div>
                  </div>
                </div>

                <div style={{ borderRadius: '18px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)', padding: '20px' }}>
                  <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9px', fontWeight: '700', letterSpacing: '0.22em', color: '#52525b' }}>O QUE VOCÊ GANHA</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '13px', marginTop: '14px' }}>
                    {(cxGanhos || []).map((g, ig) => (<React.Fragment key={ig}>
                      <div style={{ display: 'flex', gap: '11px', alignItems: 'flex-start' }}>
                        <span style={{ width: '22px', height: '22px', borderRadius: '7px', flexShrink: '0', background: 'rgba(56,189,248,0.10)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>{g.glyph}</span>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '600', color: '#e4e4e7' }}>{g.title}</div>
                          <div style={{ fontSize: '12px', color: '#71717a', lineHeight: '1.45', marginTop: '3px' }}>{g.desc}</div>
                        </div>
                      </div>
                    </React.Fragment>))}
                  </div>
                  <div style={{ fontSize: '11px', color: '#52525b', lineHeight: '1.5', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>Acesso somente leitura, revogável a qualquer momento em Configurações. A ZURT não movimenta valores e não guarda senha de banco.</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: `${cxGrid}`, gap: '14px' }}>
                {(origens || []).map((o, io) => (<React.Fragment key={io}>
                  <div style={{ border: `1px solid ${o.bd}`, borderRadius: '18px', background: `${o.bg}`, padding: '20px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '13px' }}>
                      <span style={{ width: '38px', height: '38px', borderRadius: '11px', flexShrink: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '\'JetBrains Mono\', monospace', fontSize: '12px', fontWeight: '700', background: `${o.chipBg}`, color: `${o.chipFg}`, border: `1px solid ${o.chipBd}` }}>{o.sigla}</span>
                      <div style={{ flex: '1', minWidth: '0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '9px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '15px', fontWeight: '600', color: '#f4f4f5', letterSpacing: '-0.01em' }}>{o.nome}</span>
                          <span style={{ display: 'inline-block', padding: '3px 9px', borderRadius: '9999px', fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: `${o.statusFg}`, background: `${o.statusBg}`, border: `1px solid ${o.statusBd}` }}>{o.status}</span>
                        </div>
                        <div style={{ fontSize: '12.5px', color: '#71717a', lineHeight: '1.5', marginTop: '6px' }}>{o.desc}</div>
                      </div>
                    </div>

                    <div style={{ marginTop: '14px', borderRadius: '12px', background: `${o.metaBg}`, border: `1px solid ${o.metaBd}`, padding: '11px 13px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', flexShrink: '0', background: `${o.statusFg}` }}></span>
                        <span style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '10px', letterSpacing: '0.06em', color: `${o.metaFg}` }}>{o.meta}</span>
                      </div>
                      {(o.temMotivo) ? (<>
                        <div style={{ fontSize: '12px', color: '#a1a1aa', lineHeight: '1.45', marginTop: '8px' }}>{o.motivo}</div>
                      </>) : null}
                    </div>

                    {(o.temLista) ? (<>
                      <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '1px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', overflow: 'hidden' }}>
                        {(o.itens || []).map((i, ii) => (<React.Fragment key={ii}>
                          <div style={{ background: '#0d1018', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ display: 'inline-block', flexShrink: '0', padding: '3px 8px', borderRadius: '6px', fontFamily: '\'JetBrains Mono\', monospace', fontSize: '10px', fontWeight: '700', letterSpacing: '0.04em', background: 'rgba(255,255,255,0.04)', color: `${i.chipFg}`, border: `1px solid ${i.chipBd}` }}>{i.sigla}</span>
                            <div style={{ flex: '1', minWidth: '0' }}>
                              <div style={{ fontSize: '12.5px', color: '#e4e4e7' }}>{i.nome}</div>
                              <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9.5px', color: '#52525b', marginTop: '2px' }}>{i.meta}</div>
                            </div>
                            <span style={{ display: 'inline-block', padding: '3px 9px', borderRadius: '9999px', fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: `${i.fg}`, background: `${i.bg}`, border: `1px solid ${i.bd}` }}>{i.status}</span>
                          </div>
                        </React.Fragment>))}
                      </div>
                    </>) : null}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
                      {(o.b3) ? (<>
                        <button style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '11px 16px', borderRadius: '11px', border: '1px solid rgba(255,255,255,0.14)', background: '#f4f4f5', color: '#07090e', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: '1px', fontFamily: '\'JetBrains Mono\', monospace', fontWeight: '700' }}>
                            <span style={{ fontSize: '12px' }}>[</span><span style={{ fontSize: '14px' }}>B</span><span style={{ fontSize: '12px' }}>]</span><span style={{ fontSize: '10px', alignSelf: 'flex-start' }}>3</span>
                          </span>
                          Vincular conta B3
                        </button>
                      </>) : null}
                      {(o.temCta) ? (<>
                        <button style={{ padding: '11px 16px', borderRadius: '11px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', border: `${o.ctaBd}`, background: `${o.ctaBg}`, color: `${o.ctaFg}` }}>{o.cta}</button>
                      </>) : null}
                      {(o.temSec) ? (<>
                        <button style={{ padding: '11px 14px', borderRadius: '11px', border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.03)', color: '#a1a1aa', fontSize: '12.5px', fontWeight: '600', cursor: 'pointer' }}>{o.sec}</button>
                      </>) : null}
                    </div>

                    <div style={{ fontSize: '11px', color: '#52525b', lineHeight: '1.5', marginTop: '12px' }}>{o.nota}</div>
                  </div>
                </React.Fragment>))}
              </div>
            </div>
    </>
  );
}
