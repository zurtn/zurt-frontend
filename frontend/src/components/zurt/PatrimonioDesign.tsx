import React from 'react';

/**
 * PatrimonioDesign — CONVERTIDO do markup do Claude Design (bloco @57766).
 * Gerado por conv-final.cjs. Cada estilo e byte-a-byte o do design.
 * NAO EDITAR A MAO: se o design mudar, rode o conversor de novo.
 */
export interface PatrimonioDesignProps {
  composicao?: any;
  heroGrid?: any;
  kpiGrid?: any;
  kpis?: any;
  midCols?: any;
  origensCaption?: any;
  origensChip?: any;
  patInsight?: any;
  plSize?: any;
  posComItens?: any;
  posTitle?: any;
  posVazio?: any;
  posicoes?: any;
  qualidade?: any;
  ret?: any;
  tableCols?: any;
  tableHead?: any;
  tabs?: any;
  totalNota?: any;
  totalValor?: any;
}

export function PatrimonioDesign({ composicao, heroGrid, kpiGrid, kpis, midCols, origensCaption, origensChip, patInsight, plSize, posComItens, posTitle, posVazio, posicoes, qualidade, ret, tableCols, tableHead, tabs, totalNota, totalValor }: PatrimonioDesignProps) {
  return (
    <>
<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              <div style={{ display: 'grid', gridTemplateColumns: `${heroGrid}`, gap: '14px', alignItems: 'stretch' }}>
                <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.06)', background: 'radial-gradient(ellipse 80% 60% at 15% 20%, rgba(56,189,248,0.10) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 85% 90%, rgba(167,139,250,0.12) 0%, transparent 55%), linear-gradient(180deg, #0b1018 0%, #050810 100%)', boxShadow: '0 20px 80px -30px rgba(56,189,248,0.25), inset 0 0 0 1px rgba(255,255,255,0.03)', padding: '26px 28px' }}>
                  <div style={{ position: 'absolute', inset: '0', opacity: '0.035', pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '48px 48px', WebkitMaskImage: 'radial-gradient(ellipse 100% 80% at 50% 50%, black 40%, transparent 100%)', maskImage: 'radial-gradient(ellipse 100% 80% at 50% 50%, black 40%, transparent 100%)' }}></div>
                  <div style={{ position: 'absolute', top: '-130px', left: '50%', transform: 'translateX(-50%)', width: '70%', height: '200px', opacity: '0.4', filter: 'blur(40px)', pointerEvents: 'none', background: 'radial-gradient(ellipse, rgba(56,189,248,0.35) 0%, transparent 70%)' }}></div>
                  <div style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '14px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', animation: 'dotPulse 1.8s infinite' }}></span>
                      <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.28em', color: '#a1a1aa', fontWeight: '600' }}>Patrimônio líquido</span>
                      <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#52525b', fontWeight: '500', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)' }}>{origensChip}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginTop: '10px', flexWrap: 'wrap' }}>
                      <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: `${plSize}`, fontWeight: '600', letterSpacing: '-0.03em', lineHeight: '1', color: '#f4f4f5', whiteSpace: 'nowrap' }}>R$ 2.936.500</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 8px', borderRadius: '8px', background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.18)' }}>
                        <span style={{ color: '#34d399', fontSize: '11px' }}>▲</span>
                        <span style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '11.5px', fontWeight: '600', color: '#34d399' }}>{ret}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '22px', marginTop: '20px', flexWrap: 'wrap' }}>
                      {(composicao || []).map((c, ic) => (<React.Fragment key={ic}>
                        <div>
                          <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '8.5px', fontWeight: '700', letterSpacing: '0.18em', color: '#52525b' }}>{c.label}</div>
                          <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '17px', fontWeight: '600', color: `${c.color}`, marginTop: '5px' }}>{c.value}</div>
                          <div style={{ fontSize: '11.5px', color: '#71717a', marginTop: '2px' }}>{c.sub}</div>
                        </div>
                      </React.Fragment>))}
                    </div>
                    <div style={{ height: '10px', borderRadius: '9999px', overflow: 'hidden', display: 'flex', gap: '2px', marginTop: '20px' }}>
                      <div style={{ width: '95%', background: 'linear-gradient(90deg,#38bdf8,rgba(56,189,248,0.5))' }}></div>
                      <div style={{ width: '5%', background: '#f87171' }}></div>
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#52525b', marginTop: '10px' }}>{origensCaption}</div>
                  </div>
                </div>

                <div style={{ borderRadius: '18px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9px', fontWeight: '700', letterSpacing: '0.22em', color: '#52525b' }}>QUALIDADE DO DADO</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#e4e4e7', marginTop: '4px' }}>O que a ZURT sabe e o que não sabe</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {(qualidade || []).map((q, iq) => (<React.Fragment key={iq}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <span style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '11px', fontWeight: '700', color: `${q.tone}`, flexShrink: '0', width: '46px', textAlign: 'right' }}>{q.n}</span>
                        <div>
                          <div style={{ fontSize: '12.5px', color: '#e4e4e7', lineHeight: '1.4' }}>{q.label}</div>
                          <div style={{ fontSize: '11.5px', color: '#71717a', lineHeight: '1.45', marginTop: '2px' }}>{q.desc}</div>
                        </div>
                      </div>
                    </React.Fragment>))}
                  </div>
                  <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '11px', color: '#52525b', lineHeight: '1.5' }}>As 76 posições vêm da B3 (25) e do Open Finance (51). As 2 posições de cripto ficam fora da contagem enquanto a Foxbit está com erro. Valor "—" não é falha: é ausência de dado confiável na fonte.</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: `${kpiGrid}`, gap: '14px' }}>
                {(kpis || []).map((k, ik) => (<React.Fragment key={ik}>
                  <div style={{ borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', padding: '16px', minHeight: '118px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px', boxShadow: `${k.shadow}` }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                      <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9px', fontWeight: '700', letterSpacing: '0.2em', color: '#52525b' }}>{k.label}</div>
                      {(k.temSpark) ? (<>
                        <svg width="56" height="20" style={{ overflow: 'visible', flexShrink: '0' }}>
                          <polyline points={k.spark} fill="none" stroke={k.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.85"></polyline>
                        </svg>
                      </>) : null}
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

              <div style={{ borderRadius: '18px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)', overflow: 'hidden' }}>
                <div style={{ padding: '18px 20px 0', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9px', fontWeight: '700', letterSpacing: '0.22em', color: '#52525b' }}>POSIÇÕES</div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#f4f4f5', letterSpacing: '-0.01em', marginTop: '4px' }}>{posTitle}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {(tabs || []).map((t, it) => (<React.Fragment key={it}>
                      <button onClick={t.go} style={{ padding: '6px 11px', borderRadius: '9px', cursor: 'pointer', fontFamily: '\'JetBrains Mono\', monospace', fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', background: `${t.bg}`, border: `1px solid ${t.bd}`, color: `${t.fg}` }}>{t.label}</button>
                    </React.Fragment>))}
                  </div>
                </div>

                <div style={{ padding: '14px 0 0' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: `${tableCols}`, gap: '12px', padding: '11px 20px', background: 'rgba(255,255,255,0.02)' }}>
                    {(tableHead || []).map((h, ih) => (<React.Fragment key={ih}>
                      <div style={{ fontSize: '9px', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#52525b', textAlign: `${h.align}` as any }}>{h.label}</div>
                    </React.Fragment>))}
                  </div>
                  {(posVazio) ? (<>
                    <div style={{ padding: '34px 20px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#e4e4e7' }}>Nenhum bem cadastrado</div>
                      <div style={{ fontSize: '12.5px', color: '#71717a', marginTop: '6px', lineHeight: '1.5', maxWidth: '420px', marginLeft: 'auto', marginRight: 'auto' }}>Imóvel, veículo ou participação em empresa entram aqui pelo valor que você declara — é a única parte do patrimônio que não depende de conectar conta.</div>
                      <button style={{ marginTop: '14px', padding: '9px 14px', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', color: '#e4e4e7', fontSize: '12.5px', fontWeight: '600', cursor: 'pointer' }}>Cadastrar primeiro bem</button>
                    </div>
                  </>) : null}
                  {(posicoes || []).map((p, ip) => (<React.Fragment key={ip}>
                    <div style={{ display: 'grid', gridTemplateColumns: `${tableCols}`, gap: '12px', padding: '10px 20px', borderTop: '1px solid rgba(255,255,255,0.03)', alignItems: 'center' }}>
                      <div style={{ minWidth: '0' }}>
                        <div style={{ fontSize: '13px', color: '#e4e4e7', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.nome}</div>
                        <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9.5px', color: '#52525b', marginTop: '2px' }}>{p.meta}</div>
                      </div>
                      <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '12px', color: '#a1a1aa', textAlign: 'right' }}>{p.qtd}</div>
                      <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '12px', color: `${p.precoColor}`, textAlign: 'right' }}>{p.preco}</div>
                      <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '13px', fontWeight: '600', color: `${p.valorColor}`, textAlign: 'right' }}>{p.valor}</div>
                      <div style={{ textAlign: 'right' }}>
                        {(p.temRent) ? (<>
                          <span style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '12px', fontWeight: '600', color: `${p.rentColor}`, display: 'inline-flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>{p.rentArrow}{p.rent}</span>
                        </>) : null}
                        {(p.semRent) ? (<>
                          <span title={p.rentMotivo} style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '12px', color: '#3f3f46', borderBottom: '1px dashed rgba(255,255,255,0.12)', cursor: 'help' }}>—</span>
                        </>) : null}
                      </div>
                    </div>
                  </React.Fragment>))}
                  {(posComItens) ? (<>
                  <div style={{ display: 'grid', gridTemplateColumns: `${tableCols}`, gap: '12px', padding: '12px 20px', background: 'rgba(56,189,248,0.04)', borderTop: '2px solid rgba(56,189,248,0.2)', alignItems: 'center' }}>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#f4f4f5', letterSpacing: '0.04em' }}>TOTAL</div>
                    {(midCols) ? (<>
                      <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '12px', fontWeight: '700', color: '#52525b', textAlign: 'right' }}>—</div>
                    </>) : null}
                    {(midCols) ? (<>
                      <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '12px', fontWeight: '700', color: '#52525b', textAlign: 'right' }}>—</div>
                    </>) : null}
                    <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '12px', fontWeight: '700', color: '#f4f4f5', textAlign: 'right' }}>{totalValor}</div>
                    <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '11px', fontWeight: '700', color: '#52525b', textAlign: 'right' }}>{totalNota}</div>
                  </div>
                  </>) : null}
                  <div style={{ display: 'flex', gap: '18px', margin: '0', padding: '14px 20px 20px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}><span style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '11px', color: '#3f3f46' }}>—</span><span style={{ fontSize: '11.5px', color: '#71717a' }}>sem cotação na fonte (B3 informa só quantidade, ISIN e vencimento)</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}><span style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '11px', color: '#3f3f46', borderBottom: '1px dashed rgba(255,255,255,0.12)' }}>—</span><span style={{ fontSize: '11.5px', color: '#71717a' }}>rentabilidade não conferida com a custódia</span></div>
                  </div>
                </div>
              </div>

              <div style={{ borderRadius: '16px', border: '1px solid rgba(167,139,250,0.16)', background: 'linear-gradient(135deg, rgba(167,139,250,0.07), transparent 65%)', padding: '16px 18px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9px', fontWeight: '700', letterSpacing: '0.18em', color: '#a78bfa', flexShrink: '0', marginTop: '3px' }}>IA</span>
                <div>
                  <div style={{ fontSize: '13px', color: '#e4e4e7', lineHeight: '1.55', textWrap: 'pretty' }}>{patInsight}</div>
                  <div style={{ fontSize: '10.5px', color: '#52525b', marginTop: '8px', lineHeight: '1.45' }}>Conteúdo analítico gerado automaticamente sobre 76 posições de B3 e Open Finance, das quais 11 sem cotação na fonte; as 2 de cripto estão fora enquanto a origem está com erro. Não constitui recomendação de investimento (CVM 179).</div>
                </div>
              </div>
            </div>
    </>
  );
}
