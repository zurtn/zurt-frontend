import React from 'react';

/**
 * AnaliseDesign — CONVERTIDO do markup do Claude Design (bloco @91073).
 * Gerado por conv-final.cjs. Cada estilo e byte-a-byte o do design.
 * NAO EDITAR A MAO: se o design mudar, rode o conversor de novo.
 */
export interface AnaliseDesignProps {
  goConexoes?: any;
  histCols?: any;
  histTemItens?: any;
  histTitulo?: any;
  histVazio?: any;
  historico?: any;
  lowGrid?: any;
  radarAnteriores?: any;
  relBase?: any;
  relBlocos?: any;
  relDisponivel?: any;
  relIndisponivel?: any;
  relTempo?: any;
}

export function AnaliseDesign({ goConexoes, histCols, histTemItens, histTitulo, histVazio, historico, lowGrid, radarAnteriores, relBase, relBlocos, relDisponivel, relIndisponivel, relTempo }: AnaliseDesignProps) {
  return (
    <>
<div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

              <div style={{ borderRadius: '14px', border: '1px solid rgba(167,139,250,0.20)', background: 'linear-gradient(135deg, rgba(167,139,250,0.08), transparent 70%)', padding: '14px 18px', display: 'flex', gap: '13px', alignItems: 'flex-start' }}>
                <span style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9px', fontWeight: '700', letterSpacing: '0.18em', color: '#a78bfa', flexShrink: '0', marginTop: '3px' }}>CVM 179</span>
                <div style={{ fontSize: '12.5px', color: '#e4e4e7', lineHeight: '1.55', textWrap: 'pretty' }}>Todo conteúdo desta seção — relatório gerado por IA e Radar Semanal — é <strong style={{ fontWeight: '600' }}>análise informativa</strong> e não constitui recomendação de investimento, oferta ou consultoria personalizada. Decisões de alocação são suas; se quiser recomendação, fale com um assessor certificado.</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: `${lowGrid}`, gap: '14px', alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ borderRadius: '18px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)', padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9px', fontWeight: '700', letterSpacing: '0.22em', color: '#52525b' }}>SOB DEMANDA</div>
                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#f4f4f5', letterSpacing: '-0.01em', marginTop: '4px' }}>Relatório de patrimônio</div>
                      </div>
                      <span style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9.5px', color: '#52525b' }}>{relBase}</span>
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#71717a', lineHeight: '1.55', marginTop: '8px' }}>PDF com composição, alocação, concentração e liquidez, mais a leitura da IA sobre o momento da carteira. Feito para levar à reunião com o assessor.</div>

                    {(relDisponivel) ? (<>
                      <div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', marginTop: '16px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', overflow: 'hidden' }}>
                          {(relBlocos || []).map((b, ib) => (<React.Fragment key={ib}>
                            <div onClick={b.toggle} style={{ background: '#0d1018', padding: '11px 13px', display: 'flex', alignItems: 'center', gap: '11px', cursor: 'pointer' }}>
                              <span style={{ width: '16px', height: '16px', borderRadius: '5px', flexShrink: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', background: `${b.boxBg}`, border: `1px solid ${b.boxBd}`, color: '#07090e' }}>{b.check}</span>
                              <div style={{ flex: '1', minWidth: '0' }}>
                                <div style={{ fontSize: '12.5px', color: '#e4e4e7' }}>{b.label}</div>
                                <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9.5px', color: '#52525b', marginTop: '2px' }}>{b.meta}</div>
                              </div>
                              <span style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9px', fontWeight: '700', letterSpacing: '0.12em', color: `${b.tone}` }}>{b.status}</span>
                            </div>
                          </React.Fragment>))}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
                          <button style={{ padding: '11px 16px', border: 'none', borderRadius: '11px', background: 'linear-gradient(90deg,#38bdf8,#06b6d4)', color: '#07090e', fontSize: '13px', fontWeight: '700', boxShadow: '0 10px 24px -10px rgba(56,189,248,0.35)', cursor: 'pointer' }}>Gerar relatório →</button>
                          <span style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '10px', color: '#52525b' }}>{relTempo}</span>
                        </div>
                      </div>
                    </>) : null}
                    {(relIndisponivel) ? (<>
                      <div style={{ marginTop: '16px', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.02)', padding: '18px', textAlign: 'center' }}>
                        <div style={{ fontSize: '13.5px', fontWeight: '600', color: '#e4e4e7' }}>Não há patrimônio para relatar</div>
                        <div style={{ fontSize: '12.5px', color: '#71717a', marginTop: '6px', lineHeight: '1.5', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>O relatório é gerado sobre dado real de custódia e conta. Sem origem conectada, não há o que analisar — e a ZURT não emite PDF com número estimado.</div>
                        <button onClick={goConexoes} style={{ marginTop: '14px', padding: '9px 14px', border: 'none', borderRadius: '10px', background: 'linear-gradient(90deg,#38bdf8,#06b6d4)', color: '#07090e', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer' }}>Conectar origem →</button>
                      </div>
                    </>) : null}
                  </div>

                  <div style={{ borderRadius: '18px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)', overflow: 'hidden' }}>
                    <div style={{ padding: '18px 20px 0' }}>
                      <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9px', fontWeight: '700', letterSpacing: '0.22em', color: '#52525b' }}>HISTÓRICO</div>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: '#f4f4f5', letterSpacing: '-0.01em', marginTop: '4px' }}>{histTitulo}</div>
                    </div>
                    {(histTemItens) ? (<>
                      <div style={{ marginTop: '14px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: `${histCols}`, gap: '12px', padding: '11px 20px', background: 'rgba(255,255,255,0.02)' }}>
                          <div style={{ fontSize: '9px', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#52525b' }}>Emitido em</div>
                          <div style={{ fontSize: '9px', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#52525b' }}>Escopo</div>
                          <div style={{ fontSize: '9px', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#52525b', textAlign: 'right' }}>Páginas</div>
                          <div style={{ fontSize: '9px', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#52525b', textAlign: 'right' }}>Arquivo</div>
                        </div>
                        {(historico || []).map((h, ih) => (<React.Fragment key={ih}>
                          <div style={{ display: 'grid', gridTemplateColumns: `${histCols}`, gap: '12px', padding: '10px 20px', borderTop: '1px solid rgba(255,255,255,0.03)', alignItems: 'center' }}>
                            <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '12px', color: '#e4e4e7' }}>{h.data}</div>
                            <div style={{ fontSize: '12.5px', color: '#a1a1aa', minWidth: '0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{h.escopo}</div>
                            <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '12px', color: '#71717a', textAlign: 'right' }}>{h.pag}</div>
                            <div style={{ textAlign: 'right' }}><button style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Baixar ↓</button></div>
                          </div>
                        </React.Fragment>))}
                      </div>
                    </>) : null}
                    {(histVazio) ? (<>
                      <div style={{ padding: '26px 20px 24px', fontSize: '12.5px', color: '#71717a', lineHeight: '1.5' }}>Você ainda não gerou nenhum relatório. Os emitidos ficam guardados aqui por 24 meses.</div>
                    </>) : null}
                  </div>
                </div>

                <div style={{ borderRadius: '18px', border: '1px solid rgba(56,189,248,0.16)', background: 'linear-gradient(160deg, rgba(56,189,248,0.07), rgba(255,255,255,0.02) 55%)', overflow: 'hidden' }}>
                  <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9px', fontWeight: '700', letterSpacing: '0.22em', color: '#38bdf8' }}>PUBLICADO PELA ZURT</div>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: '#f4f4f5', letterSpacing: '-0.01em', marginTop: '4px' }}>Radar Semanal</div>
                    </div>
                    <span style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '8.5px', fontWeight: '700', letterSpacing: '0.14em', padding: '3px 8px', borderRadius: '9999px', color: '#34d399', background: 'rgba(16,185,129,0.18)', border: '1px solid rgba(16,185,129,0.25)' }}>INCLUSO NO SEU PLANO</span>
                  </div>
                  <div style={{ padding: '8px 20px 0', fontSize: '12.5px', color: '#71717a', lineHeight: '1.55' }}>Toda sexta às 19h, um PDF analítico sobre a semana de mercado. Não depende de conexão — chega igual para todo assinante.</div>

                  <div style={{ padding: '16px 20px 0' }}>
                    <div style={{ display: 'flex', gap: '14px' }}>
                      <div style={{ flexShrink: '0', width: '86px', position: 'relative', aspectRatio: '3 / 4', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', background: 'linear-gradient(150deg, #0e1826 0%, #071019 60%, #050810 100%)' }}>
                        <div style={{ position: 'absolute', inset: '0', background: 'radial-gradient(ellipse 90% 70% at 25% 15%, rgba(56,189,248,0.28) 0%, transparent 62%)' }}></div>
                        <div style={{ position: 'absolute', right: '-4px', bottom: '-14px', fontFamily: '\'JetBrains Mono\', monospace', fontSize: '52px', fontWeight: '700', lineHeight: '1', color: 'rgba(255,255,255,0.09)' }}>26</div>
                        <div style={{ position: 'absolute', top: '8px', left: '8px', fontFamily: '\'JetBrains Mono\', monospace', fontSize: '7.5px', fontWeight: '700', letterSpacing: '0.16em', color: '#22d3ee' }}>MACRO</div>
                      </div>
                      <div style={{ flex: '1', minWidth: '0' }}>
                        <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9px', fontWeight: '700', letterSpacing: '0.18em', color: '#38bdf8' }}>EDIÇÃO 26 · 22 JUL</div>
                        <div style={{ fontSize: '15px', fontWeight: '700', letterSpacing: '-0.02em', lineHeight: '1.25', color: '#f4f4f5', marginTop: '6px', textWrap: 'pretty' }}>Selic em 10,25%: o fim do ciclo de corte?</div>
                        <div style={{ fontSize: '12px', color: '#a1a1aa', lineHeight: '1.5', marginTop: '6px' }}>A curva devolveu 40 bps. Onde alongar e o que evitar em crédito privado.</div>
                        <button style={{ marginTop: '10px', padding: '8px 13px', border: 'none', borderRadius: '10px', background: 'linear-gradient(90deg,#38bdf8,#06b6d4)', color: '#07090e', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>Baixar PDF ↓</button>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '16px 20px 0' }}>
                    <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '8.5px', fontWeight: '700', letterSpacing: '0.2em', color: '#52525b' }}>EDIÇÕES ANTERIORES</div>
                    <div style={{ marginTop: '8px' }}>
                      {(radarAnteriores || []).map((r, ir) => (<React.Fragment key={ir}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '9px 0', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                          <span style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '10px', fontWeight: '700', color: '#52525b', width: '20px', flexShrink: '0' }}>{r.num}</span>
                          <div style={{ flex: '1', minWidth: '0' }}>
                            <div style={{ fontSize: '12.5px', color: '#e4e4e7', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.titulo}</div>
                            <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9px', color: '#52525b', marginTop: '2px' }}>{r.meta}</div>
                          </div>
                          <span style={{ color: '#38bdf8', fontSize: '12px' }}>↓</span>
                        </div>
                      </React.Fragment>))}
                    </div>
                  </div>

                  <div style={{ padding: '16px 20px 20px' }}>
                    <a href="Radar Semanal.dc.html" style={{ display: 'block', textAlign: 'center', padding: '10px', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', color: '#e4e4e7', fontSize: '12.5px', fontWeight: '600' }}>Ver acervo completo · 26 edições →</a>
                    <div style={{ fontSize: '10.5px', color: '#52525b', lineHeight: '1.45', marginTop: '12px' }}>Conteúdo analítico da mesa ZURT. Não constitui recomendação de investimento (CVM 179).</div>
                  </div>
                </div>
              </div>
            </div>
    </>
  );
}
