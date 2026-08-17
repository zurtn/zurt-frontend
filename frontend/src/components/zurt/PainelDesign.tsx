import React from 'react';

/**
 * PainelDesign — CONVERTIDO do markup do Claude Design (bloco @19809).
 * Gerado por conv-final.cjs. Cada estilo e byte-a-byte o do design.
 * NAO EDITAR A MAO: se o design mudar, rode o conversor de novo.
 */
export interface PainelDesignProps {
  areaPath?: any;
  axis?: any;
  buckets?: any;
  cdi?: any;
  classes?: any;
  comDados?: any;
  conexoes?: any;
  conexoesTitle?: any;
  emptyGrid?: any;
  emptyH?: any;
  emptyPreview?: any;
  emptySteps?: any;
  goConexoes?: any;
  goMov?: any;
  goPatrimonio?: any;
  heroGrid?: any;
  insight?: any;
  kpiGrid?: any;
  kpis?: any;
  linePath?: any;
  lowGrid?: any;
  movs?: any;
  periodLabel?: any;
  pl?: any;
  plCaption?: any;
  plDelta?: any;
  plSize?: any;
  ret?: any;
  stepsGrid?: any;
  vazio?: any;
}

export function PainelDesign({ areaPath, axis, buckets, cdi, classes, comDados, conexoes, conexoesTitle, emptyGrid, emptyH, emptyPreview, emptySteps, goConexoes, goMov, goPatrimonio, heroGrid, insight, kpiGrid, kpis, linePath, lowGrid, movs, periodLabel, pl, plCaption, plDelta, plSize, ret, stepsGrid, vazio }: PainelDesignProps) {
  return (
    <>
<div>
              {(vazio) ? (<>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeUp 500ms cubic-bezier(.21,.78,.35,1) both' }}>
                  <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.07)', background: 'linear-gradient(180deg, #0c1119 0%, #070a10 100%)', padding: '30px' }}>
                    <div style={{ position: 'absolute', inset: '0', background: 'radial-gradient(ellipse 70% 60% at 10% 0%, rgba(56,189,248,0.15) 0%, transparent 60%), radial-gradient(ellipse 60% 60% at 95% 100%, rgba(167,139,250,0.10) 0%, transparent 60%)', pointerEvents: 'none' }}></div>
                    <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: `${emptyGrid}`, gap: '30px', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9.5px', fontWeight: '700', letterSpacing: '0.24em', color: '#38bdf8' }}>PRIMEIRO ACESSO</div>
                        <h2 style={{ fontSize: `${emptyH}`, fontWeight: '700', letterSpacing: '-0.03em', lineHeight: '1.08', margin: '14px 0 0', textWrap: 'pretty' }}>Conecte uma origem e seu patrimônio aparece pronto — não digitado.</h2>
                        <p style={{ fontSize: '14px', color: '#a1a1aa', lineHeight: '1.6', margin: '14px 0 0', maxWidth: '520px', textWrap: 'pretty' }}>Leva cerca de dois minutos. A ZURT lê saldo, posição e provento; nunca movimenta dinheiro e nunca pede sua senha de banco.</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '22px' }}>
                          <button onClick={goConexoes} style={{ padding: '12px 18px', border: 'none', borderRadius: '11px', background: 'linear-gradient(90deg,#38bdf8,#06b6d4)', color: '#07090e', fontSize: '13.5px', fontWeight: '700', boxShadow: '0 10px 24px -10px rgba(56,189,248,0.4)', cursor: 'pointer' }}>Conectar primeira origem →</button>
                          <button onClick={goConexoes} style={{ padding: '12px 16px', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '11px', background: 'rgba(255,255,255,0.03)', color: '#e4e4e7', fontSize: '13.5px', fontWeight: '600', cursor: 'pointer' }}>Ver como funciona</button>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', marginTop: '22px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}><span style={{ color: '#34d399', fontSize: '11px' }}>●</span><span style={{ fontSize: '12px', color: '#a1a1aa' }}>Somente leitura</span></div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}><span style={{ color: '#34d399', fontSize: '11px' }}>●</span><span style={{ fontSize: '12px', color: '#a1a1aa' }}>Consentimento revogável</span></div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}><span style={{ color: '#34d399', fontSize: '11px' }}>●</span><span style={{ fontSize: '12px', color: '#a1a1aa' }}>CPF nunca exibido em claro</span></div>
                        </div>
                      </div>
                      <div style={{ position: 'relative' }}>
                        <div style={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', padding: '16px 18px', overflow: 'hidden' }}>
                          <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '8.5px', fontWeight: '700', letterSpacing: '0.2em', color: '#52525b' }}>DEPOIS DE CONECTAR, ESTA ÁREA MOSTRA</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '14px' }}>
                            {(emptyPreview || []).map((p, ip) => (<React.Fragment key={ip}>
                              <div>
                                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '10px' }}>
                                  <span style={{ fontSize: '12.5px', color: '#a1a1aa' }}>{p.label}</span>
                                  <span style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '12px', color: '#3f3f46' }}>—</span>
                                </div>
                                <div style={{ height: '5px', borderRadius: '9999px', background: 'rgba(255,255,255,0.04)', marginTop: '6px', overflow: 'hidden' }}>
                                  <div style={{ height: '100%', width: `${p.w}`, borderRadius: '9999px', background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.10) 0 6px, transparent 6px 12px)' }}></div>
                                </div>
                              </div>
                            </React.Fragment>))}
                          </div>
                          <div style={{ fontSize: '11px', color: '#52525b', marginTop: '16px', lineHeight: '1.5' }}>Nenhum valor é estimado. Enquanto não houver dado real, a ZURT mostra "—" no lugar de um número plausível.</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: `${stepsGrid}`, gap: '14px' }}>
                    {(emptySteps || []).map((s, is) => (<React.Fragment key={is}>
                      <div style={{ border: `1px solid ${s.bd}`, borderRadius: '16px', padding: '18px', background: `${s.bg}`, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9px', fontWeight: '700', letterSpacing: '0.18em', color: `${s.tone}` }}>{s.step}</div>
                          <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9px', letterSpacing: '0.14em', color: '#52525b' }}>{s.tempo}</div>
                        </div>
                        <div style={{ fontSize: '14.5px', fontWeight: '600', color: '#f4f4f5', marginTop: '10px' }}>{s.title}</div>
                        <div style={{ fontSize: '12.5px', color: '#71717a', marginTop: '6px', lineHeight: '1.5', flex: '1' }}>{s.desc}</div>
                        <button onClick={goConexoes} style={{ marginTop: '14px', alignSelf: 'flex-start', padding: '9px 14px', borderRadius: '10px', cursor: 'pointer', fontSize: '12.5px', fontWeight: '700', border: `${s.btnBd}`, background: `${s.btnBg}`, color: `${s.btnFg}` }}>{s.cta}</button>
                      </div>
                    </React.Fragment>))}
                  </div>

                  <div style={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9px', fontWeight: '700', letterSpacing: '0.2em', color: '#52525b' }}>PREFERE COMEÇAR SEM CONECTAR NADA?</span>
                    <span style={{ fontSize: '12.5px', color: '#a1a1aa', flex: '1', minWidth: '220px' }}>Cadastre um imóvel ou uma participação e o painel já passa a somar patrimônio.</span>
                    <button onClick={goPatrimonio} style={{ padding: '9px 14px', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', color: '#e4e4e7', fontSize: '12.5px', fontWeight: '600', cursor: 'pointer' }}>Cadastrar bem manual</button>
                  </div>
                </div>
              </>) : null}

              {(comDados) ? (<>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                  <div style={{ display: 'grid', gridTemplateColumns: `${heroGrid}`, gap: '14px', alignItems: 'stretch' }}>
                    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.06)', background: 'radial-gradient(ellipse 80% 60% at 15% 20%, rgba(56,189,248,0.12) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 85% 90%, rgba(16,185,129,0.10) 0%, transparent 55%), linear-gradient(180deg, #0b1018 0%, #050810 100%)', boxShadow: '0 20px 80px -30px rgba(56,189,248,0.25), inset 0 0 0 1px rgba(255,255,255,0.03)', padding: '24px 26px', animation: 'fadeUp 460ms cubic-bezier(.21,.78,.35,1) both' }}>
                      <div style={{ position: 'absolute', inset: '0', opacity: '0.035', pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '48px 48px', WebkitMaskImage: 'radial-gradient(ellipse 100% 80% at 50% 50%, black 40%, transparent 100%)', maskImage: 'radial-gradient(ellipse 100% 80% at 50% 50%, black 40%, transparent 100%)' }}></div>
                      <div style={{ position: 'absolute', top: '-130px', left: '50%', transform: 'translateX(-50%)', width: '70%', height: '200px', opacity: '0.4', filter: 'blur(40px)', pointerEvents: 'none', background: 'radial-gradient(ellipse, rgba(56,189,248,0.30) 0%, transparent 70%)' }}></div>
                      <div style={{ position: 'relative' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                          <div style={{ minWidth: '0' }}>
                            <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9.5px', fontWeight: '700', letterSpacing: '0.24em', color: '#52525b' }}>PATRIMÔNIO CONSOLIDADO</div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginTop: '10px' }}>
                              <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: `${plSize}`, fontWeight: '600', letterSpacing: '-0.03em', lineHeight: '1', color: '#f4f4f5', whiteSpace: 'nowrap' }}>{pl}</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 8px', borderRadius: '8px', background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.18)' }}>
                                <span style={{ color: '#34d399', fontSize: '11px' }}>↑</span>
                                <span style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '11.5px', fontWeight: '600', color: '#34d399' }}>{plDelta}</span>
                              </div>
                            </div>
                            <div style={{ fontSize: '12.5px', color: '#71717a', marginTop: '8px' }}>{plCaption}</div>
                          </div>
                          <div style={{ textAlign: 'right', flexShrink: '0' }}>
                            <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9px', fontWeight: '700', letterSpacing: '0.18em', color: '#52525b' }}>RETORNO {periodLabel}</div>
                            <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '20px', fontWeight: '600', color: '#34d399', marginTop: '6px' }}>{ret}</div>
                            <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '10px', color: '#52525b', marginTop: '3px' }}>CDI {cdi}</div>
                          </div>
                        </div>

                        <div style={{ marginTop: '20px', position: 'relative' }}>
                          <svg viewBox="0 0 640 150" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '150px' }}>
                            <defs>
                              <linearGradient id="areaG" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.28"></stop>
                                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0"></stop>
                              </linearGradient>
                            </defs>
                            <path d={areaPath} fill="url(#areaG)"></path>
                            <path d={linePath} fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1400" style={{ animation: 'drawIn 1400ms cubic-bezier(.21,.78,.35,1) both' }}></path>
                          </svg>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                            {(axis || []).map((a, ia) => (<React.Fragment key={ia}>
                              <span style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9px', letterSpacing: '0.1em', color: '#3f3f46' }}>{a}</span>
                            </React.Fragment>))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{ flex: '1', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', padding: '16px 18px', animation: 'fadeUp 520ms cubic-bezier(.21,.78,.35,1) both' }}>
                        <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9px', fontWeight: '700', letterSpacing: '0.22em', color: '#52525b' }}>COMPOSIÇÃO</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '11px', marginTop: '14px' }}>
                          {(buckets || []).map((b, ib) => (<React.Fragment key={ib}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '12.5px', color: '#e4e4e7' }}>{b.label}</span>
                                <span style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '12.5px', fontWeight: '600', color: `${b.color}` }}>{b.value}</span>
                              </div>
                              <div style={{ height: '5px', borderRadius: '9999px', background: 'rgba(255,255,255,0.04)', marginTop: '6px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', borderRadius: '9999px', width: `${b.pct}`, background: `${b.color}`, opacity: '0.85' }}></div>
                              </div>
                              <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9.5px', color: '#52525b', marginTop: '4px' }}>{b.sub}</div>
                            </div>
                          </React.Fragment>))}
                        </div>
                      </div>
                      <div style={{ borderRadius: '16px', border: '1px solid rgba(251,191,36,0.18)', background: 'linear-gradient(135deg, rgba(251,191,36,0.08), transparent 65%)', padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9px', fontWeight: '700', letterSpacing: '0.2em', color: '#fbbf24' }}>ATENÇÃO</span>
                        </div>
                        <div style={{ fontSize: '13px', color: '#e4e4e7', marginTop: '7px', lineHeight: '1.45' }}>Sua conexão com a <strong style={{ fontWeight: '600' }}>B3</strong> expirou há 3 dias — a carteira de ações não está atualizando.</div>
                        <button onClick={goConexoes} style={{ marginTop: '11px', padding: '8px 12px', border: '1px solid rgba(251,191,36,0.28)', borderRadius: '9px', background: 'rgba(251,191,36,0.10)', color: '#fbbf24', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Reconectar agora →</button>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: `${kpiGrid}`, gap: '14px' }}>
                    {(kpis || []).map((k, ik) => (<React.Fragment key={ik}>
                      <div style={{ borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', padding: '16px', minHeight: '118px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px', boxShadow: `${k.shadow}` }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                          <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9px', fontWeight: '700', letterSpacing: '0.2em', color: '#52525b' }}>{k.label}</div>
                          <svg width="56" height="20" style={{ overflow: 'visible', flexShrink: '0' }}>
                            <polyline points={k.spark} fill="none" stroke={k.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.85"></polyline>
                          </svg>
                        </div>
                        <div>
                          <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '21px', fontWeight: '600', letterSpacing: '-0.02em', color: `${k.color}`, whiteSpace: 'nowrap' }}>{k.value}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '5px' }}>
                            <span style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '10.5px', fontWeight: '600', color: `${k.deltaColor}`, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>{k.arrow}{k.delta}</span>
                            <span style={{ fontSize: '11.5px', color: '#71717a' }}>{k.sub}</span>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>))}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: `${lowGrid}`, gap: '14px', alignItems: 'start' }}>
                    <div style={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)', padding: '18px' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9px', fontWeight: '700', letterSpacing: '0.22em', color: '#52525b' }}>ALOCAÇÃO POR CLASSE</div>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#e4e4e7', marginTop: '4px' }}>Mix do patrimônio financeiro</div>
                        </div>
                        <button onClick={goPatrimonio} style={{ background: 'none', border: 'none', color: '#52525b', fontSize: '11.5px', cursor: 'pointer' }}>Abrir carteira →</button>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', marginTop: '16px' }}>
                        {(classes || []).map((c, ic) => (<React.Fragment key={ic}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ width: '96px', flexShrink: '0', fontSize: '12.5px', color: '#e4e4e7' }}>{c.label}</span>
                            <div style={{ flex: '1', height: '20px', borderRadius: '6px', background: 'rgba(255,255,255,0.03)', overflow: 'hidden' }}>
                              <div style={{ height: '100%', borderRadius: '6px', width: `${c.w}`, background: `linear-gradient(90deg, ${c.color}, ${c.color2})` }}></div>
                            </div>
                            <span style={{ width: '54px', textAlign: 'right', fontFamily: '\'JetBrains Mono\', monospace', fontSize: '12px', fontWeight: '600', color: `${c.color}` }}>{c.pct}</span>
                            <span style={{ width: '92px', textAlign: 'right', fontFamily: '\'JetBrains Mono\', monospace', fontSize: '11.5px', color: '#71717a' }}>{c.value}</span>
                          </div>
                        </React.Fragment>))}
                      </div>
                      <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <span style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9px', fontWeight: '700', letterSpacing: '0.18em', color: '#a78bfa', flexShrink: '0', marginTop: '2px' }}>IA</span>
                        <div>
                          <div style={{ fontSize: '12.5px', color: '#e4e4e7', lineHeight: '1.5', textWrap: 'pretty' }}>{insight}</div>
                          <div style={{ fontSize: '10.5px', color: '#52525b', marginTop: '7px', lineHeight: '1.45' }}>Conteúdo analítico gerado automaticamente. Não constitui recomendação de investimento (CVM 179).</div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)', padding: '18px' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                          <div>
                            <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9px', fontWeight: '700', letterSpacing: '0.22em', color: '#52525b' }}>ORIGENS DE DADO</div>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#e4e4e7', marginTop: '4px' }}>{conexoesTitle}</div>
                          </div>
                          <button onClick={goConexoes} style={{ background: 'none', border: 'none', color: '#52525b', fontSize: '11.5px', cursor: 'pointer' }}>Gerenciar →</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', marginTop: '14px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', overflow: 'hidden' }}>
                          {(conexoes || []).map((c, ic) => (<React.Fragment key={ic}>
                            <div style={{ background: '#0d1018', padding: '11px 13px', display: 'flex', alignItems: 'center', gap: '11px' }}>
                              <span style={{ width: '26px', height: '26px', borderRadius: '8px', flexShrink: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9.5px', fontWeight: '700', background: `${c.chipBg}`, color: `${c.chipFg}` }}>{c.sigla}</span>
                              <div style={{ flex: '1', minWidth: '0' }}>
                                <div style={{ fontSize: '12.5px', color: '#e4e4e7', fontWeight: '500' }}>{c.nome}</div>
                                <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9.5px', color: '#52525b', marginTop: '2px' }}>{c.meta}</div>
                              </div>
                              <span style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '8.5px', fontWeight: '700', letterSpacing: '0.14em', padding: '3px 7px', borderRadius: '9999px', color: `${c.statusFg}`, background: `${c.statusBg}` }}>{c.status}</span>
                            </div>
                          </React.Fragment>))}
                        </div>
                      </div>

                      <div style={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)', padding: '18px' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                          <div>
                            <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9px', fontWeight: '700', letterSpacing: '0.22em', color: '#52525b' }}>MOVIMENTAÇÕES</div>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#e4e4e7', marginTop: '4px' }}>Últimos 7 dias</div>
                          </div>
                          <button onClick={goMov} style={{ background: 'none', border: 'none', color: '#52525b', fontSize: '11.5px', cursor: 'pointer' }}>Ver extrato →</button>
                        </div>
                        <div style={{ marginTop: '12px' }}>
                          {(movs || []).map((m, im) => (<React.Fragment key={im}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                              <div style={{ flex: '1', minWidth: '0' }}>
                                <div style={{ fontSize: '12.5px', color: '#e4e4e7', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.desc}</div>
                                <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9.5px', color: '#52525b', marginTop: '2px' }}>{m.meta}</div>
                              </div>
                              <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '12.5px', fontWeight: '600', color: `${m.color}`, whiteSpace: 'nowrap' }}>{m.valor}</div>
                            </div>
                          </React.Fragment>))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>) : null}
            </div>
    </>
  );
}
