import React from 'react';

/**
 * MovimentacoesDesign — CONVERTIDO do markup do Claude Design (bloco @73749).
 * Gerado por conv-final.cjs. Cada estilo e byte-a-byte o do design.
 * NAO EDITAR A MAO: se o design mudar, rode o conversor de novo.
 */
export interface MovimentacoesDesignProps {
  catsOpt?: any;
  contasOpt?: any;
  dias?: any;
  faixas?: any;
  goConexoes?: any;
  lentes?: any;
  limparMov?: any;
  midCols?: any;
  movCat?: any;
  movCols?: any;
  movComDados?: any;
  movConta?: any;
  movFiltrado?: any;
  movKpiGrid?: any;
  movKpis?: any;
  movPaginacao?: any;
  movQ?: any;
  movResultado?: any;
  movSemResultado?: any;
  movTitulo?: any;
  movVazio?: any;
  onMovCat?: any;
  onMovConta?: any;
  onMovQ?: any;
}

export function MovimentacoesDesign({ catsOpt, contasOpt, dias, faixas, goConexoes, lentes, limparMov, midCols, movCat, movCols, movComDados, movConta, movFiltrado, movKpiGrid, movKpis, movPaginacao, movQ, movResultado, movSemResultado, movTitulo, movVazio, onMovCat, onMovConta, onMovQ }: MovimentacoesDesignProps) {
  return (
    <>
<div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

              {(movVazio) ? (<>
                <div style={{ maxWidth: '680px', margin: '40px auto', textAlign: 'center' }}>
                  <div style={{ width: '56px', height: '56px', margin: '0 auto', borderRadius: '16px', border: '1px solid rgba(56,189,248,0.20)', background: 'rgba(56,189,248,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', color: '#38bdf8' }}>◰</div>
                  <h2 style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '-0.02em', margin: '20px 0 0', textWrap: 'pretty' }}>Sem extrato porque não há conta conectada</h2>
                  <p style={{ fontSize: '13.5px', color: '#a1a1aa', lineHeight: '1.6', margin: '12px auto 0', maxWidth: '480px', textWrap: 'pretty' }}>Ao conectar um banco pelo Open Finance, a ZURT importa os últimos 12 meses de uma vez — gasto, recebimento, fatura e provento no mesmo lugar.</p>
                  <button onClick={goConexoes} style={{ marginTop: '20px', padding: '11px 17px', border: 'none', borderRadius: '11px', background: 'linear-gradient(90deg,#38bdf8,#06b6d4)', color: '#07090e', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>Conectar banco →</button>
                </div>
              </>) : null}

              {(movComDados) ? (<>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                  <div style={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', padding: '16px 18px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', padding: '3px', borderRadius: '11px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', gap: '2px' }}>
                        {(lentes || []).map((l, il) => (<React.Fragment key={il}>
                          <button onClick={l.go} style={{ padding: '7px 13px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600', background: `${l.bg}`, color: `${l.fg}`, display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
                            {l.label}
                            <span style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9.5px', color: `${l.nFg}` }}>{l.n}</span>
                          </button>
                        </React.Fragment>))}
                      </div>
                      <div style={{ flex: '1', minWidth: '200px', position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#52525b', fontSize: '12px' }}>⌕</span>
                        <input value={movQ} onChange={onMovQ} placeholder="Buscar descrição, ativo, estabelecimento…" style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px 9px 30px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#e4e4e7', fontSize: '12.5px', outline: 'none' }} />
                      </div>
                      
                        {(contasOpt || []).map((c, ic) => (<React.Fragment key={ic}>
                          <option value={c.id}>{c.label}</option>
                        </React.Fragment>))}
                      
                      
                        {(catsOpt || []).map((c, ic) => (<React.Fragment key={ic}>
                          <option value={c.id}>{c.label}</option>
                        </React.Fragment>))}
                      
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '8.5px', fontWeight: '700', letterSpacing: '0.18em', color: '#52525b' }}>FAIXA DE VALOR</span>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {(faixas || []).map((x, ix) => (<React.Fragment key={ix}>
                          <button onClick={x.go} style={{ padding: '5px 10px', borderRadius: '9999px', cursor: 'pointer', fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9.5px', fontWeight: '700', letterSpacing: '0.08em', background: `${x.bg}`, border: `1px solid ${x.bd}`, color: `${x.fg}` }}>{x.label}</button>
                        </React.Fragment>))}
                      </div>
                      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '10px', color: '#52525b' }}>{movResultado}</span>
                        {(movFiltrado) ? (<>
                          <button onClick={limparMov} style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '11.5px', fontWeight: '600', cursor: 'pointer' }}>Limpar filtros</button>
                        </>) : null}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: `${movKpiGrid}`, gap: '14px' }}>
                    {(movKpis || []).map((k, ik) => (<React.Fragment key={ik}>
                      <div style={{ borderRadius: '14px', border: `1px solid ${k.bd}`, background: `${k.bg}`, padding: '15px 16px' }}>
                        <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9px', fontWeight: '700', letterSpacing: '0.2em', color: `${k.tone}` }}>{k.label}</div>
                        <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '19px', fontWeight: '600', letterSpacing: '-0.02em', color: `${k.color}`, marginTop: '8px', whiteSpace: 'nowrap' }}>{k.value}</div>
                        <div style={{ fontSize: '11.5px', color: '#71717a', marginTop: '5px' }}>{k.sub}</div>
                      </div>
                    </React.Fragment>))}
                  </div>

                  <div style={{ borderRadius: '18px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)', overflow: 'hidden' }}>
                    <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <div>
                        <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9px', fontWeight: '700', letterSpacing: '0.22em', color: '#52525b' }}>EXTRATO CONSOLIDADO</div>
                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#f4f4f5', letterSpacing: '-0.01em', marginTop: '4px' }}>{movTitulo}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}><span style={{ width: '8px', height: '8px', borderRadius: '3px', background: 'rgba(255,255,255,0.14)' }}></span><span style={{ fontSize: '11px', color: '#71717a' }}>dinheiro</span></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}><span style={{ width: '8px', height: '8px', borderRadius: '3px', background: 'rgba(167,139,250,0.55)' }}></span><span style={{ fontSize: '11px', color: '#71717a' }}>carteira — não entra no saldo do dia</span></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}><span style={{ display: 'inline-block', padding: '1px 6px', borderRadius: '9999px', fontSize: '8.5px', fontWeight: '700', letterSpacing: '0.1em', color: '#a78bfa', background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.22)' }}>2 ORIGENS</span><span style={{ fontSize: '11px', color: '#71717a' }}>provento pareado — conta uma vez</span></div>
                      </div>
                    </div>

                    {(dias || []).map((d, id) => (<React.Fragment key={id}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 20px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <span style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '10px', fontWeight: '700', letterSpacing: '0.14em', color: '#a1a1aa' }}>{d.data}</span>
                          <span style={{ fontSize: '11.5px', color: '#52525b' }}>{d.dow}</span>
                          {(d.temEventos) ? (<>
                            <span style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '8.5px', fontWeight: '700', letterSpacing: '0.12em', padding: '3px 8px', borderRadius: '9999px', color: '#a78bfa', background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.22)' }}>{d.eventos}</span>
                          </>) : null}
                          <span style={{ marginLeft: 'auto', fontFamily: '\'JetBrains Mono\', monospace', fontSize: '11.5px', fontWeight: '600', color: `${d.saldoColor}` }}>{d.saldo}</span>
                        </div>
                        {(d.linhas || []).map((m, im) => (<React.Fragment key={im}>
                          <div style={{ display: 'grid', gridTemplateColumns: `${movCols}`, gap: '12px', alignItems: 'center', padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.03)', background: `${m.rowBg}`, borderLeft: `2px solid ${m.rail}` }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '11px', minWidth: '0' }}>
                              <span style={{ display: 'inline-block', flexShrink: '0', padding: '3px 8px', borderRadius: '6px', fontFamily: '\'JetBrains Mono\', monospace', fontSize: '10px', fontWeight: '700', letterSpacing: '0.04em', background: 'rgba(255,255,255,0.04)', color: `${m.tagFg}`, border: `1px solid ${m.tagBd}` }}>{m.tag}</span>
                              <div style={{ minWidth: '0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '0' }}>
                                  <span style={{ fontSize: '13px', color: '#e4e4e7', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.desc}</span>
                                  {(m.temPar) ? (<>
                                    <span style={{ display: 'inline-block', flexShrink: '0', padding: '2px 7px', borderRadius: '9999px', fontSize: '8.5px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#a78bfa', background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.22)' }}>2 ORIGENS</span>
                                  </>) : null}
                                </div>
                                <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9.5px', color: '#52525b', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.meta}</div>
                                {(m.temPar) ? (<>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginTop: '5px', paddingLeft: '9px', borderLeft: '1px solid rgba(167,139,250,0.28)' }}>
                                    <span style={{ color: '#34d399', fontSize: '10px' }}>✓</span>
                                    <span style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9px', color: '#71717a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>LIQUIDADO EM CONTA · {m.par}</span>
                                  </div>
                                </>) : null}
                              </div>
                            </div>
                            {(midCols) ? (<>
                              <div style={{ minWidth: '0' }}>
                                <div style={{ fontSize: '12px', color: '#a1a1aa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.categoria}</div>
                                {(m.temOriginal) ? (<>
                                  <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9px', color: '#3f3f46', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.original}</div>
                                </>) : null}
                              </div>
                            </>) : null}
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '13px', fontWeight: '600', color: `${m.valorColor}`, whiteSpace: 'nowrap' }}>{m.valor}</div>
                              {(m.temNota) ? (<>
                                <div style={{ fontSize: '9.5px', color: '#52525b', marginTop: '2px', whiteSpace: 'nowrap' }}>{m.nota}</div>
                              </>) : null}
                            </div>
                          </div>
                        </React.Fragment>))}
                      </div>
                    </React.Fragment>))}

                    {(movSemResultado) ? (<>
                      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#e4e4e7' }}>Nenhum movimento com esses filtros</div>
                        <div style={{ fontSize: '12.5px', color: '#71717a', marginTop: '6px' }}>Tente uma faixa de valor maior ou limpe a busca.</div>
                        <button onClick={limparMov} style={{ marginTop: '14px', padding: '8px 13px', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', color: '#e4e4e7', fontSize: '12.5px', fontWeight: '600', cursor: 'pointer' }}>Limpar filtros</button>
                      </div>
                    </>) : null}

                    <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', background: 'rgba(255,255,255,0.02)' }}>
                      <span style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '10px', color: '#52525b', letterSpacing: '0.06em' }}>{movPaginacao}</span>
                      <button style={{ marginLeft: 'auto', padding: '8px 13px', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', color: '#e4e4e7', fontSize: '12.5px', fontWeight: '600', cursor: 'pointer' }}>Carregar mais 50</button>
                      <button style={{ padding: '8px 13px', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', color: '#a1a1aa', fontSize: '12.5px', fontWeight: '600', cursor: 'pointer' }}>Exportar CSV</button>
                    </div>
                  </div>

                  <div style={{ borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', padding: '14px 18px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9px', fontWeight: '700', letterSpacing: '0.18em', color: '#52525b', flexShrink: '0', marginTop: '3px' }}>NOTA</span>
                    <div style={{ fontSize: '12px', color: '#71717a', lineHeight: '1.55', textWrap: 'pretty' }}>As categorias chegam em inglês da Pluggy e são traduzidas na exibição — o rótulo original fica embaixo, para você conferir. Transferência entre suas próprias contas não conta como gasto nem como receita: aparece em cinza e fica fora do saldo do dia.<br /><br /><strong style={{ color: '#a1a1aa', fontWeight: '600' }}>Provento em duas fontes.</strong> Quando a B3 registra o provento e o banco registra o crédito (<span style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '11px', color: '#a1a1aa' }}>Proceeds interests and dividends</span>), é o mesmo fato: 347 lançamentos bancários (R$ 34.771,73) contra 481 movimentos da B3 em produção. O registro da B3 manda — é quem sabe o ativo e o tipo de provento — e o crédito bancário aparece recolhido dentro dele como liquidação confirmada. O valor conta <strong style={{ color: '#a1a1aa', fontWeight: '600' }}>uma vez</strong>, como entrada de dinheiro; por isso o total único é 8.016 e não 8.363. Um provento pareado aparece nas duas lentes porque é dinheiro e é evento — mas nunca é somado duas vezes. Enquanto a B3 estiver expirada, provento que só chegou pelo banco fica sem par e é exibido como entrada comum, com a categoria traduzida.</div>
                  </div>
                </div>
              </>) : null}
            </div>
    </>
  );
}
