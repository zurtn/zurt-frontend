import { useEffect, useState } from 'react';

/**
 * Contrato de /api/portfolio/rentabilidade — espelha services/rentabilidade.ts
 * do backend. Campos nullable são intencionais: `percentual` vem null quando
 * não há base de cálculo, NUNCA 0.
 */
export interface AtivoRentabilidade {
  nome: string;
  fonte: 'pluggy' | 'b3';
  quantidade: number | null;
  precoMedio: number | null;
  investido: number | null;
  atual: number | null;
  valorizacao: number | null;
  percentual: number | null;
  confiavel: boolean;
  motivo?: string;
}

export interface Rentabilidade {
  investido: number;
  atual: number;
  valorizacao: number;
  realizado: number;
  proventos: number;
  proventosEventos: number;
  resultado: number;
  percentual: number | null;
  cobertura: {
    posicoesComCusto: number;
    posicoesTotal: number;
    valorComCusto: number;
    valorTotal: number;
    pct: number;
  };
  estado: 'ok' | 'parcial' | 'sem_custo';
  porAtivo: AtivoRentabilidade[];
}

export function useRentabilidade() {
  const [dados, setDados] = useState<Rentabilidade | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let vivo = true;
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (!token) { setCarregando(false); setErro('sem sessão'); return; }

    fetch('/api/portfolio/rentabilidade', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => { if (vivo) { setDados(d); setCarregando(false); } })
      .catch((e) => { if (vivo) { setErro(String(e.message ?? e)); setCarregando(false); } });

    return () => { vivo = false; };
  }, []);

  return { dados, carregando, erro };
}

/** Formatação BR. Valor monetário sempre em mono — regra do design system. */
export function brl(v: number | null | undefined): string | null {
  if (v == null || Number.isNaN(v)) return null;
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function pct(v: number | null | undefined): string | null {
  if (v == null || Number.isNaN(v)) return null;
  const s = v.toFixed(2).replace('.', ',');
  return `${v > 0 ? '+' : ''}${s}%`;
}
