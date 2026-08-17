import { useEffect, useState } from 'react';

/**
 * Adaptador do Painel — traduz as APIs da ZURT para as props que o
 * PainelDesign espera.
 *
 * Esta camada existe para o componente convertido do design NUNCA precisar
 * ser editado. Ele é gerado por conversor; toda lógica mora aqui.
 *
 * Formas conferidas contra o backend em 29/07/2026, não presumidas:
 *   /dashboard/summary   -> { caixa, investido, divida, total, contas,
 *                             investimentos, porClasse, temDado }
 *   /portfolio/rentabilidade -> { investido, resultado, percentual, estado,
 *                                 cobertura:{ pct, posicoesComCusto, posicoesTotal } }
 *   /macro -> { selicMeta:{valor}, cdi:{valor}, ipca12m:{valor}, ptax:{valor} }
 */

const brl = (v: number | null | undefined) =>
  v == null ? null : v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL',
                                                 maximumFractionDigits: 0 });
const brlExato = (v: number | null | undefined) =>
  v == null ? null : v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const pct = (v: number | null | undefined) =>
  v == null ? null : `${v > 0 ? '+' : ''}${v.toFixed(2).replace('.', ',')}%`;

async function pega(url: string, token: string) {
  const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!r.ok) return null;
  return r.json();
}

export interface DadosPainel {
  patrimonio: any;
  rentabilidade: any;
  macro: any;
  serie: Array<{ d: string; v: number }>;
}

export function useDadosPainel() {
  const [dados, setDados] = useState<DadosPainel | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) { setCarregando(false); return; }
    let vivo = true;

    Promise.all([
      pega('/api/dashboard/summary', token),
      pega('/api/portfolio/rentabilidade', token),
      pega('/api/macro', token),
      pega('/api/dashboard/net-worth-evolution?dias=90', token),
    ]).then(([patrimonio, rentabilidade, macro, evo]) => {
      if (!vivo) return;
      const serie = Array.isArray(evo?.serie) ? evo.serie
                  : Array.isArray(evo) ? evo : [];
      setDados({ patrimonio, rentabilidade, macro, serie });
      setCarregando(false);
    }).catch(() => { if (vivo) setCarregando(false); });

    return () => { vivo = false; };
  }, []);

  return { dados, carregando };
}

/** Escala do número grande: 52 → 36 → 28. Nunca quebra em duas linhas. */
function tamanhoPl(largura: number): string {
  if (largura >= 1200) return '52px';
  if (largura >= 900) return '36px';
  return '28px';
}

/** Caminho SVG da série. Sem pontos suficientes, devolve null — e o gráfico
 *  não é desenhado. Curva inventada em tela de patrimônio é dado falso. */
function caminho(serie: Array<{ v: number }>, area: boolean): string | null {
  if (!serie || serie.length < 2) return null;
  const vs = serie.map((p) => Number(p.v) || 0);
  const min = Math.min(...vs), max = Math.max(...vs);
  const span = max - min || 1;
  const pts = vs.map((v, i) => {
    const x = (i / (vs.length - 1)) * 640;
    const y = 140 - ((v - min) / span) * 120;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const linha = `M ${pts.join(' L ')}`;
  return area ? `${linha} L 640,150 L 0,150 Z` : linha;
}

export function montarPropsPainel(d: DadosPainel | null, largura: number) {
  const p = d?.patrimonio ?? null;
  const r = d?.rentabilidade ?? null;
  const serie = d?.serie ?? [];

  // `temDado` vem do backend e distingue "sem conexão" de "conectado com zero".
  // Essa diferença é a razão de o painel ter duas versões.
  const comDados = !!p?.temDado && (p?.total ?? 0) !== 0;

  const heroGrid = largura >= 1200 ? '1.55fr 1fr' : '1fr';
  const kpiGrid  = largura >= 1200 ? 'repeat(4,1fr)'
                 : largura >= 900  ? 'repeat(2,1fr)' : '1fr';
  const lowGrid  = largura >= 1200 ? '1.3fr 1fr' : '1fr';

  if (!comDados) {
    return {
      vazio: true, comDados: false,
      heroGrid, kpiGrid, lowGrid,
      emptyGrid: largura >= 900 ? 'repeat(3,1fr)' : '1fr',
      stepsGrid: largura >= 900 ? 'repeat(3,1fr)' : '1fr',
    };
  }

  const cob = r?.cobertura ?? null;
  const temRetorno = r?.percentual != null && r?.estado !== 'sem_custo';

  return {
    vazio: false, comDados: true,
    heroGrid, kpiGrid, lowGrid,

    pl: brl(p.total),
    plSize: tamanhoPl(largura),
    // Sem base de cálculo, o chip de variação some — não aponta direção.
    plDelta: temRetorno ? pct(r.percentual) : null,
    plCaption: [
      brlExato(p.caixa) ? `${brlExato(p.caixa)} em caixa` : null,
      p.divida ? `${brlExato(Math.abs(p.divida))} em passivo` : null,
      `${p.contas} contas · ${p.investimentos} posições`,
    ].filter(Boolean).join(' · '),

    periodLabel: 'DESDE O INÍCIO',
    ret: temRetorno ? pct(r.percentual) : null,
    cdi: d?.macro?.cdi?.valor != null
      ? `${d.macro.cdi.valor.toFixed(2).replace('.', ',')}%` : null,

    areaPath: caminho(serie, true),
    linePath: caminho(serie, false),
    axis: serie.length >= 2
      ? serie.filter((_, i) => i % Math.ceil(serie.length / 5) === 0)
             .map((s: any) => String(s.d ?? '').slice(8, 10))
      : [],
  };
}

/** Blocos de composição: financeiro, bens, passivo. */
export function montarBuckets(p: any) {
  if (!p) return [];
  const financeiro = (Number(p.caixa) || 0) + (Number(p.investido) || 0);
  const passivo = Math.abs(Number(p.divida) || 0);
  const base = financeiro + passivo || 1;
  return [
    { label: 'Financeiro', value: brlExato(financeiro),
      pct: `${Math.round((financeiro / base) * 100)}%`,
      sub: 'BANCOS · B3 · FUNDOS · CRIPTO', color: '#38bdf8' },
    // Bens manuais: a tabela está vazia em produção e o cadastro pode não
    // existir. Mostrar "—", nunca R$ 0,00 — ausência não é zero.
    { label: 'Imóveis e bens', value: null, pct: '0%',
      sub: 'NENHUM BEM CADASTRADO AINDA', color: '#a78bfa' },
    { label: 'Passivo', value: passivo ? `- ${brlExato(passivo)}` : null,
      pct: `${Math.round((passivo / base) * 100)}%`,
      sub: 'FINANCIAMENTO + CARTÃO', color: '#f87171' },
  ];
}

/** Alocação por classe, direto do porClasse do backend. */
export function montarClasses(p: any) {
  const pc = p?.porClasse ?? {};
  const ROTULO: Record<string, { label: string; color: string }> = {
    fixedIncome: { label: 'Renda Fixa',    color: '#38bdf8' },
    stocks:      { label: 'Ações BR',      color: '#34d399' },
    funds:       { label: 'Fundos',        color: '#fbbf24' },
    international:{ label: 'Internacional', color: '#a78bfa' },
    reits:       { label: 'FIIs',          color: '#22d3ee' },
    crypto:      { label: 'Cripto',        color: '#7c8aff' },
  };
  const itens = Object.entries(pc)
    .map(([k, v]) => ({ k, v: Number(v) || 0 }))
    .filter((x) => x.v > 0)
    .sort((a, b) => b.v - a.v);
  const total = itens.reduce((s, x) => s + x.v, 0) || 1;
  const maior = itens[0]?.v || 1;
  return itens.map((x) => {
    const meta = ROTULO[x.k] ?? { label: x.k, color: '#71717a' };
    const p100 = (x.v / total) * 100;
    return {
      label: meta.label, color: meta.color, color2: meta.color,
      value: brlExato(x.v),
      pct: `${p100.toFixed(1).replace('.', ',')}%`,
      w: `${((x.v / maior) * 100).toFixed(1)}%`,
    };
  });
}

/** KPIs — só entram os que temos como calcular. Custo de carrego ficou fora
 *  porque nenhuma fonte informa quanto o cliente pagou de taxa. */
export function montarKpis(p: any, r: any) {
  const cob = r?.cobertura ?? null;
  const caixa = Number(p?.caixa) || 0;
  const total = Number(p?.total) || 0;
  return [
    { label: 'LIQUIDEZ IMEDIATA', value: brl(caixa), color: '#38bdf8',
      delta: `${p?.contas ?? 0} contas`, arrow: '', deltaColor: '#71717a',
      sub: total ? `${((caixa / total) * 100).toFixed(1).replace('.', ',')}% do patrimônio` : '',
      temSpark: false, shadow: '0 0 40px -10px rgba(56,189,248,0.15)' },
    { label: 'RESULTADO ACUMULADO',
      value: r?.resultado != null ? brl(r.resultado) : null,
      color: (r?.resultado ?? 0) >= 0 ? '#34d399' : '#f87171',
      delta: r?.percentual != null ? pct(r.percentual) : '',
      arrow: r?.percentual == null ? '' : (r.percentual >= 0 ? '▲' : '▼'),
      deltaColor: (r?.resultado ?? 0) >= 0 ? '#34d399' : '#f87171',
      sub: 'valorização + vendas + proventos', temSpark: false, shadow: 'none' },
    { label: 'PROVENTOS RECEBIDOS',
      value: r?.proventos != null ? brl(r.proventos) : null, color: '#a78bfa',
      delta: r?.proventosEventos ? String(r.proventosEventos) : '',
      arrow: '', deltaColor: '#71717a', sub: 'dividendos e JCP',
      temSpark: false, shadow: 'none' },
    { label: 'COBERTURA DE PREÇO',
      value: cob ? `${cob.posicoesComCusto} de ${cob.posicoesTotal}` : null,
      color: '#fbbf24',
      delta: cob ? `${cob.pct.toFixed(0)}%` : '', arrow: '', deltaColor: '#71717a',
      sub: 'posições com preço médio', temSpark: false, shadow: 'none' },
  ];
}
