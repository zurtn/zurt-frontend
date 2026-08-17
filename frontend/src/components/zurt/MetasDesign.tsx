import React from 'react';

/**
 * MetasDesign — CONVERTIDO do markup do Claude Design (bloco @104771).
 * Gerado por conv-final.cjs. Cada estilo e byte-a-byte o do design.
 * NAO EDITAR A MAO: se o design mudar, rode o conversor de novo.
 */
export interface MetasDesignProps {
  ferrGrid?: any;
  ferramentas?: any;
  goConexoes?: any;
  metas?: any;
  metasGrid?: any;
  metasSub?: any;
  metasTemItens?: any;
  metasVazio?: any;
  openPalette?: any;
}

export function MetasDesign({ ferrGrid, ferramentas, goConexoes, metas, metasGrid, metasSub, metasTemItens, metasVazio, openPalette }: MetasDesignProps) {
  return (
    <>
<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9px', fontWeight: '700', letterSpacing: '0.22em', color: '#52525b' }}>OBJETIVOS</div>
                  <h2 style={{ fontSize: '22px', fontWeight: '700', letterSpacing: '-0.02em', margin: '6px 0 0' }}>Metas</h2>
                  <p style={{ fontSize: '12.5px', color: '#71717a', margin: '6px 0 0' }}>{metasSub}</p>
                </div>
                <button style={{ padding: '10px 15px', border: 'none', borderRadius: '11px', background: 'linear-gradient(90deg,#38bdf8,#06b6d4)', color: '#07090e', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>+ Nova meta</button>
              </div>

              {(metasTemItens) ? (<>
                <div style={{ display: 'grid', gridTemplateColumns: `${metasGrid}`, gap: '14px' }}>
                  {(metas || []).map((m, im) => (<React.Fragment key={im}>
                    <div style={{ borderRadius: '18px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)', padding: '20px', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                        <div style={{ minWidth: '0' }}>
                          <div style={{ fontSize: '15px', fontWeight: '600', color: '#f4f4f5', letterSpacing: '-0.01em' }}>{m.nome}</div>
                          <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9.5px', letterSpacing: '0.12em', color: '#52525b', marginTop: '4px' }}>{m.prazo}</div>
                        </div>
                        <span style={{ display: 'inline-block', flexShrink: '0', padding: '3px 9px', borderRadius: '9999px', fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: `${m.pillFg}`, background: `${m.pillBg}`, border: `1px solid ${m.pillBd}` }}>{m.pill}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '16px' }}>
                        <span style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '24px', fontWeight: '600', letterSpacing: '-0.02em', color: '#f4f4f5' }}>{m.atual}</span>
                        <span style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '12px', color: '#52525b' }}>de {m.alvo}</span>
                      </div>
                      <div style={{ height: '8px', borderRadius: '9999px', background: 'rgba(255,255,255,0.04)', marginTop: '12px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: '9999px', width: `${m.w}`, background: `linear-gradient(90deg, ${m.cor}, ${m.cor2})` }}></div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: '8px' }}>
                        <span style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '11.5px', fontWeight: '600', color: `${m.cor}` }}>{m.pct}</span>
                        <span style={{ fontSize: '11.5px', color: '#71717a' }}>{m.falta}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#71717a', lineHeight: '1.5', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>{m.nota}</div>
                    </div>
                  </React.Fragment>))}
                </div>
              </>) : null}

              {(metasVazio) ? (<>
                <div style={{ borderRadius: '20px', border: '1px solid rgba(56,189,248,0.18)', background: 'linear-gradient(135deg, rgba(56,189,248,0.07), transparent 65%)', padding: '30px', textAlign: 'center' }}>
                  <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9px', fontWeight: '700', letterSpacing: '0.22em', color: '#38bdf8' }}>FUNCIONA SEM CONECTAR NADA</div>
                  <h3 style={{ fontSize: '22px', fontWeight: '700', letterSpacing: '-0.02em', margin: '14px 0 0', textWrap: 'pretty' }}>Crie a primeira meta e acompanhe na mão até conectar</h3>
                  <p style={{ fontSize: '13.5px', color: '#a1a1aa', lineHeight: '1.6', margin: '10px auto 0', maxWidth: '470px', textWrap: 'pretty' }}>Você define o alvo e o prazo, e atualiza o valor quando quiser. Ao conectar uma conta depois, o progresso passa a ser calculado sozinho.</p>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
                    <button style={{ padding: '11px 16px', border: 'none', borderRadius: '11px', background: 'linear-gradient(90deg,#38bdf8,#06b6d4)', color: '#07090e', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>+ Criar primeira meta</button>
                    <button onClick={goConexoes} style={{ padding: '11px 16px', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '11px', background: 'rgba(255,255,255,0.03)', color: '#e4e4e7', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Conectar conta</button>
                  </div>
                </div>
              </>) : null}

              <div style={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)', padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9px', fontWeight: '700', letterSpacing: '0.22em', color: '#52525b' }}>FERRAMENTAS DE CÁLCULO</div>
                    <div style={{ fontSize: '12.5px', color: '#71717a', marginTop: '5px' }}>Uso pontual — todas também abrem por <span style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '11px', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '4px', padding: '1px 5px', color: '#a1a1aa' }}>⌘K</span></div>
                  </div>
                  <button onClick={openPalette} style={{ background: 'none', border: 'none', color: '#52525b', fontSize: '11.5px', cursor: 'pointer' }}>Buscar ferramenta →</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: `${ferrGrid}`, gap: '8px', marginTop: '14px' }}>
                  {(ferramentas || []).map((t, it) => (<React.Fragment key={it}>
                    <button style={{ textAlign: 'left', padding: '12px 13px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '12.5px', fontWeight: '600', color: '#e4e4e7' }}>{t.nome}</span>
                      <span style={{ fontSize: '11px', color: '#71717a', lineHeight: '1.4' }}>{t.desc}</span>
                    </button>
                  </React.Fragment>))}
                </div>
              </div>
            </div>
    </>
  );
}
