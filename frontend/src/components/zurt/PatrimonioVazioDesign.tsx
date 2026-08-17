import React from 'react';

/**
 * PatrimonioVazioDesign — CONVERTIDO do markup do Claude Design (bloco @54488).
 * Gerado por conv-final.cjs. Cada estilo e byte-a-byte o do design.
 * NAO EDITAR A MAO: se o design mudar, rode o conversor de novo.
 */
export interface PatrimonioVazioDesignProps {
  goConexoes?: any;
  patVazioLinhas?: any;
  plSize?: any;
  stepsGrid?: any;
}

export function PatrimonioVazioDesign({ goConexoes, patVazioLinhas, plSize, stepsGrid }: PatrimonioVazioDesignProps) {
  return (
    <>
<div style={{ maxWidth: '760px', margin: '30px auto', animation: 'fadeUp 480ms cubic-bezier(.21,.78,.35,1) both' }}>
                <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.07)', background: 'linear-gradient(180deg, #0c1119 0%, #070a10 100%)', padding: '30px' }}>
                  <div style={{ position: 'absolute', inset: '0', background: 'radial-gradient(ellipse 70% 60% at 12% 0%, rgba(56,189,248,0.12) 0%, transparent 60%)', pointerEvents: 'none' }}></div>
                  <div style={{ position: 'relative' }}>
                    <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9.5px', fontWeight: '700', letterSpacing: '0.24em', color: '#52525b' }}>PATRIMÔNIO LÍQUIDO</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginTop: '10px' }}>
                      <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: `${plSize}`, fontWeight: '600', color: '#3f3f46', lineHeight: '1' }}>—</div>
                      <div style={{ fontSize: '12.5px', color: '#52525b' }}>nenhuma origem para somar</div>
                    </div>
                    <h2 style={{ fontSize: '22px', fontWeight: '700', letterSpacing: '-0.02em', margin: '20px 0 0', textWrap: 'pretty' }}>Ainda não há posição, conta ou bem para consolidar</h2>
                    <p style={{ fontSize: '13.5px', color: '#a1a1aa', lineHeight: '1.6', margin: '10px 0 0', maxWidth: '560px', textWrap: 'pretty' }}>Esta tela soma financeiro, bens e passivo. Nenhum dos três existe hoje na sua conta — e a ZURT não preenche com estimativa.</p>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
                      <button onClick={goConexoes} style={{ padding: '11px 16px', border: 'none', borderRadius: '11px', background: 'linear-gradient(90deg,#38bdf8,#06b6d4)', color: '#07090e', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>Conectar uma origem →</button>
                      <button style={{ padding: '11px 16px', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '11px', background: 'rgba(255,255,255,0.03)', color: '#e4e4e7', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Cadastrar bem manual</button>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: `${stepsGrid}`, gap: '12px', marginTop: '14px' }}>
                  {(patVazioLinhas || []).map((l, il) => (<React.Fragment key={il}>
                    <div style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', background: 'rgba(255,255,255,0.02)', padding: '16px' }}>
                      <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '8.5px', fontWeight: '700', letterSpacing: '0.18em', color: '#52525b' }}>{l.label}</div>
                      <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '20px', fontWeight: '600', color: '#3f3f46', marginTop: '8px' }}>—</div>
                      <div style={{ fontSize: '11.5px', color: '#71717a', marginTop: '5px', lineHeight: '1.45' }}>{l.sub}</div>
                    </div>
                  </React.Fragment>))}
                </div>
              </div>
    </>
  );
}
