import React from 'react';

/**
 * InboxDesign — CONVERTIDO do markup do Claude Design (bloco @112188).
 * Gerado por conv-final.cjs. Cada estilo e byte-a-byte o do design.
 * NAO EDITAR A MAO: se o design mudar, rode o conversor de novo.
 */
export interface InboxDesignProps {
  closeInbox?: any;
  inboxItens?: any;
  inboxTabs?: any;
  inboxVazio?: any;
}

export function InboxDesign({ closeInbox, inboxItens, inboxTabs, inboxVazio }: InboxDesignProps) {
  return (
    <>
<div style={{ position: 'absolute', top: '0', right: '0', bottom: '0', width: '400px', maxWidth: '92vw', background: '#0b0e14', borderLeft: '1px solid rgba(255,255,255,0.08)', boxShadow: '-30px 0 80px -20px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', animation: 'fadeIn 240ms ease both' }}>
            <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div>
                  <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '8.5px', fontWeight: '700', letterSpacing: '0.2em', color: '#52525b' }}>/APP/INBOX</div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#f4f4f5', letterSpacing: '-0.01em', marginTop: '3px' }}>Caixa de entrada</div>
                </div>
                <span style={{ marginLeft: 'auto', display: 'inline-block', padding: '3px 9px', borderRadius: '9999px', fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fbbf24', background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.25)' }}>BACKLOG</span>
                <button onClick={closeInbox} style={{ width: '26px', height: '26px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.03)', color: '#a1a1aa', fontSize: '12px', cursor: 'pointer' }}>✕</button>
              </div>
              <div style={{ fontSize: '11.5px', color: '#71717a', lineHeight: '1.5', marginTop: '10px' }}>Proposta de consolidação: hoje são três telas separadas (<span style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '10.5px', color: '#a1a1aa' }}>/notifications</span>, <span style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '10.5px', color: '#a1a1aa' }}>/invitations</span>, <span style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '10.5px', color: '#a1a1aa' }}>/messages</span>). Rota nova, pendente de implementação — as antigas seguem redirecionando, porque o app iOS aponta para elas.</div>
              <div style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
                {(inboxTabs || []).map((t, it) => (<React.Fragment key={it}>
                  <button onClick={t.go} style={{ padding: '6px 11px', borderRadius: '9px', cursor: 'pointer', fontSize: '11.5px', fontWeight: '600', background: `${t.bg}`, border: `1px solid ${t.bd}`, color: `${t.fg}`, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>{t.label}<span style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9px', color: `${t.nFg}` }}>{t.n}</span></button>
                </React.Fragment>))}
              </div>
            </div>
            <div style={{ flex: '1', overflowY: 'auto', padding: '8px 0' }}>
              {(inboxItens || []).map((i, ii) => (<React.Fragment key={ii}>
                <div style={{ padding: '13px 18px', borderBottom: '1px solid rgba(255,255,255,0.03)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', flexShrink: '0', marginTop: '5px', background: `${i.dot}` }}></span>
                  <div style={{ flex: '1', minWidth: '0' }}>
                    <div style={{ fontSize: '13px', color: '#e4e4e7', fontWeight: '500' }}>{i.titulo}</div>
                    <div style={{ fontSize: '12px', color: '#71717a', lineHeight: '1.45', marginTop: '3px' }}>{i.corpo}</div>
                    <div style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9px', letterSpacing: '0.1em', color: '#3f3f46', marginTop: '6px' }}>{i.quando}</div>
                  </div>
                </div>
              </React.Fragment>))}
              {(inboxVazio) ? (<>
                <div style={{ padding: '40px 20px', textAlign: 'center', fontSize: '12.5px', color: '#71717a' }}>Nada por aqui ainda.</div>
              </>) : null}
            </div>
          </div>
    </>
  );
}
