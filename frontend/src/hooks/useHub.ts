import { useEffect, useState } from 'react';

/**
 * Adaptadores das telas do hub — traduzem as APIs da ZURT para as props que
 * os componentes CONVERTIDOS do design esperam.
 *
 * Os componentes em components/zurt/*Design.tsx sao gerados por conversor e
 * nao devem ser editados. Toda logica mora aqui.
 *
 * Endpoints conferidos em 29/07/2026 (grep no index.ts do backend), nao
 * presumidos: /connections · /goals · /radar/editions · /finance/investments
 */

export function usarApi<T = any>(url: string | null) {
  const [dados, setDados] = useState<T | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!url) { setCarregando(false); return; }
    const token = localStorage.getItem('auth_token');
    if (!token) { setCarregando(false); return; }
    let vivo = true;
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (vivo) { setDados(d); setCarregando(false); } })
      .catch(() => { if (vivo) setCarregando(false); });
    return () => { vivo = false; };
  }, [url]);

  return { dados, carregando };
}

export function useLargura() {
  const [l, setL] = useState(typeof window !== 'undefined' ? window.innerWidth : 1280);
  useEffect(() => {
    const f = () => setL(window.innerWidth);
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, []);
  return l;
}

export const fmtBRL = (v: number | null | undefined, curto = false) =>
  v == null ? null
    : v.toLocaleString('pt-BR', {
        style: 'currency', currency: 'BRL',
        maximumFractionDigits: curto ? 0 : 2,
      });

export const fmtPct = (v: number | null | undefined) =>
  v == null ? null : `${v > 0 ? '+' : ''}${v.toFixed(2).replace('.', ',')}%`;

/** Grades responsivas — os cortes do design: 1200 / 900 / 760. */
export function grades(l: number) {
  return {
    heroGrid: l >= 1200 ? '1.55fr 1fr' : '1fr',
    kpiGrid: l >= 1200 ? 'repeat(4,1fr)' : l >= 900 ? 'repeat(2,1fr)' : '1fr',
    lowGrid: l >= 1200 ? '1.3fr 1fr' : '1fr',
    emptyGrid: l >= 900 ? 'repeat(3,1fr)' : '1fr',
    stepsGrid: l >= 900 ? 'repeat(3,1fr)' : '1fr',
    cxGrid: l >= 900 ? 'repeat(2,1fr)' : '1fr',
    emptyH: l >= 1200 ? '30px' : '24px',
  };
}
