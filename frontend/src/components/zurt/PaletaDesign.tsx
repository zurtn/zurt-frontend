import React from 'react';

/**
 * PaletaDesign — CONVERTIDO do markup do Claude Design (bloco @117395).
 * Gerado por conv-final.cjs. Cada estilo e byte-a-byte o do design.
 * NAO EDITAR A MAO: se o design mudar, rode o conversor de novo.
 */
export interface PaletaDesignProps {
  onPq?: any;
  paletteEmpty?: any;
  paletteItems?: any;
  pq?: any;
}

export function PaletaDesign({ onPq, paletteEmpty, paletteItems, pq }: PaletaDesignProps) {
  return (
    <>
<div style={{ position: 'absolute', top: '14vh', left: '50%', transform: 'translateX(-50%)', width: '560px', maxWidth: '90vw', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.10)', background: '#0b0e14', boxShadow: '0 30px 80px -20px rgba(0,0,0,0.6)', overflow: 'hidden', animation: 'scaleIn 220ms cubic-bezier(.21,.78,.35,1) both' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ color: '#52525b', fontSize: '13px' }}>⌕</span>
              <input value={pq} onChange={onPq} placeholder="Ir para tela, buscar ativo, conta ou transação…" style={{ flex: '1', background: 'none', border: 'none', outline: 'none', color: '#f4f4f5', fontSize: '14px' }} />
              <span style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9px', color: '#52525b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '2px 5px' }}>ESC</span>
            </div>
            <div style={{ maxHeight: '320px', overflowY: 'auto', padding: '8px' }}>
              {(paletteItems || []).map((p, ip) => (<React.Fragment key={ip}>
                <button onClick={p.go} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', border: 'none', borderRadius: '10px', background: 'transparent', color: '#e4e4e7', fontSize: '13px', textAlign: 'left', cursor: 'pointer' }}>
                  <span style={{ width: '16px', color: '#52525b', fontSize: '13px', flexShrink: '0' }}>{p.glyph}</span>
                  <span style={{ flex: '1' }}>{p.label}</span>
                  <span style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9.5px', color: '#3f3f46' }}>{p.hint}</span>
                </button>
              </React.Fragment>))}
              {(paletteEmpty) ? (<>
                <div style={{ padding: '30px 12px', textAlign: 'center', fontSize: '13px', color: '#71717a' }}>Nada encontrado. Tente "conexões", "B3", "relatório".</div>
              </>) : null}
            </div>
          </div>
    </>
  );
}
