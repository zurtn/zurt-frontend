import React from 'react';

/**
 * LoginDesign — CONVERTIDO do markup do Claude Design (bloco @7215).
 * Gerado por conv-final.cjs. Cada estilo e byte-a-byte o do design.
 * NAO EDITAR A MAO: se o design mudar, rode o conversor de novo.
 */
export interface LoginDesignProps {
  authCta?: any;
  enter?: any;
  goLogin?: any;
  goSignup?: any;
  isLogin?: any;
  isSignup?: any;
}

export function LoginDesign({ authCta, enter, goLogin, goSignup, isLogin, isSignup }: LoginDesignProps) {
  return (
    <>
<div style={{ width: '100%', maxWidth: '400px', animation: 'fadeUp 500ms cubic-bezier(.21,.78,.35,1) both' }}>
          {(isLogin) ? (<>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '-0.02em', margin: '0' }}>Entrar na sua conta</h2>
              <p style={{ fontSize: '13px', color: '#71717a', margin: '8px 0 0' }}>Ainda não tem conta? <a href="#" onClick={goSignup}>Criar conta grátis →</a></p>
            </div>
          </>) : null}
          {(isSignup) ? (<>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '-0.02em', margin: '0' }}>Criar sua conta</h2>
              <p style={{ fontSize: '13px', color: '#71717a', margin: '8px 0 0' }}>Já é cliente? <a href="#" onClick={goLogin}>Entrar →</a></p>
            </div>
          </>) : null}

          <button onClick={enter} style={{ width: '100%', marginTop: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', color: '#e4e4e7', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
            <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#4285f4" d="M45 24c0-1.6-.14-3.14-.4-4.63H24v8.76h11.77c-.5 2.7-2.05 5-4.35 6.54v5.44h7.03C42.6 36.24 45 30.6 45 24z"></path><path fill="#34a853" d="M24 46c5.94 0 10.92-1.97 14.45-5.34l-7.03-5.44c-1.96 1.32-4.47 2.1-7.42 2.1-5.7 0-10.53-3.85-12.26-9.03H4.5v5.67C8.05 41.06 15.4 46 24 46z"></path><path fill="#fbbc04" d="M11.74 28.29A13.3 13.3 0 0 1 11.03 24c0-1.49.26-2.94.71-4.29V14.04H4.5A21.9 21.9 0 0 0 2 24c0 3.55.85 6.9 2.5 9.96l7.24-5.67z"></path><path fill="#ea4335" d="M24 10.75c3.22 0 6.1 1.11 8.37 3.28l6.24-6.24C34.9 4.28 29.93 2 24 2 15.4 2 8.05 6.94 4.5 14.04l7.24 5.67C13.47 14.6 18.3 10.75 24 10.75z"></path></svg>
            Continuar com Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
            <div style={{ flex: '1', height: '1px', background: 'rgba(255,255,255,0.06)' }}></div>
            <span style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9px', letterSpacing: '0.2em', color: '#52525b' }}>OU E-MAIL</span>
            <div style={{ flex: '1', height: '1px', background: 'rgba(255,255,255,0.06)' }}></div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {(isSignup) ? (<>
              <div>
                <label style={{ display: 'block', fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9px', fontWeight: '700', letterSpacing: '0.18em', color: '#71717a', marginBottom: '7px' }}>NOME COMPLETO</label>
                <input placeholder="Como está no seu documento" style={{ width: '100%', boxSizing: 'border-box', padding: '11px 13px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#e4e4e7', fontSize: '13px', outline: 'none' }} />
              </div>
            </>) : null}
            <div>
              <label style={{ display: 'block', fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9px', fontWeight: '700', letterSpacing: '0.18em', color: '#71717a', marginBottom: '7px' }}>E-MAIL</label>
              <input placeholder="voce@email.com" style={{ width: '100%', boxSizing: 'border-box', padding: '11px 13px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#e4e4e7', fontSize: '13px', outline: 'none' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '7px' }}>
                <label style={{ fontFamily: '\'JetBrains Mono\', monospace', fontSize: '9px', fontWeight: '700', letterSpacing: '0.18em', color: '#71717a' }}>SENHA</label>
                {(isLogin) ? (<>
                  <a href="#" style={{ fontSize: '11px', color: '#52525b' }}>Esqueci</a>
                </>) : null}
              </div>
              <input type="password" placeholder="••••••••••" style={{ width: '100%', boxSizing: 'border-box', padding: '11px 13px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#e4e4e7', fontSize: '13px', outline: 'none' }} />
            </div>
          </div>

          <button onClick={enter} style={{ width: '100%', marginTop: '20px', padding: '13px', border: 'none', borderRadius: '10px', background: 'linear-gradient(90deg,#38bdf8,#06b6d4)', color: '#07090e', fontSize: '14px', fontWeight: '700', boxShadow: '0 10px 24px -10px rgba(56,189,248,0.35)', cursor: 'pointer' }}>{authCta}</button>

          <div style={{ fontSize: '11px', color: '#52525b', lineHeight: '1.55', marginTop: '16px', textWrap: 'pretty' }}>Ao continuar você aceita os <a href="#" style={{ color: '#71717a' }}>Termos de Uso</a> e a <a href="#" style={{ color: '#71717a' }}>Política de Privacidade</a>. Seus dados são criptografados e a ZURT nunca movimenta dinheiro na sua conta.</div>
        </div>
    </>
  );
}
