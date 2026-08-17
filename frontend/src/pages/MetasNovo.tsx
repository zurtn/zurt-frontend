import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MetasDesign } from '@/components/zurt/MetasDesign';
import { usarApi, useLargura, grades, fmtBRL } from '@/hooks/useHub';

/**
 * MetasNovo — metas com progresso + as 5 calculadoras como faixa discreta.
 *
 * Hierarquia deliberada do design: Metas ocupa a tela; calculadora e
 * ferramenta de uso raro (alguem abre a de ITCMD uma vez na vida).
 *
 * Metas e a UNICA tela do hub que funciona sem conectar nada — por isso e a
 * terceira saida oferecida a quem nao quer conectar conta.
 */
export default function MetasNovo() {
  const nav = useNavigate();
  const largura = useLargura();
  const { dados, carregando } = usarApi<any>('/api/goals');

  if (carregando) {
    return <div style={{ height: 220, borderRadius: 20, background: '#0b0e14' }} />;
  }

  const lista: any[] = Array.isArray(dados) ? dados
    : Array.isArray(dados?.goals) ? dados.goals : [];

  const metas = lista.map((g: any) => {
    const alvo = Number(g.target_amount ?? g.targetAmount ?? 0);
    const atual = Number(g.current_amount ?? g.currentAmount ?? 0);
    const pct = alvo > 0 ? Math.min(100, (atual / alvo) * 100) : 0;
    const prazo = g.target_date ?? g.targetDate ?? null;
    const atrasada = prazo ? new Date(prazo) < new Date() && pct < 100 : false;
    return {
      nome: g.name ?? g.title ?? 'Meta',
      valor: fmtBRL(atual), alvoStr: fmtBRL(alvo),
      pct: `${pct.toFixed(0)}%`, w: `${pct.toFixed(1)}%`,
      prazo: prazo ? String(prazo).slice(0, 10).split('-').reverse().join('/') : '—',
      status: atrasada ? 'ATRASADA' : pct >= 100 ? 'CONCLUÍDA' : 'EM CURSO',
      statusCor: atrasada ? '#f87171' : pct >= 100 ? '#34d399' : '#38bdf8',
    };
  });

  const FERRAMENTAS = [
    { label: 'FIRE', rota: '/app/calculators/fire' },
    { label: 'Juros Compostos', rota: '/app/calculators/compound-interest' },
    { label: 'Usufruto', rota: '/app/calculators/usufruct' },
    { label: 'ITCMD', rota: '/app/calculators/itcmd' },
    { label: 'Rentabilidade', rota: '/app/calculators/profitability' },
  ];

  return (
    <MetasDesign
      metasGrid={largura >= 900 ? 'repeat(3,1fr)' : '1fr'}
      ferrGrid={largura >= 900 ? 'repeat(5,1fr)' : 'repeat(2,1fr)'}
      metas={metas}
      metasTemItens={metas.length > 0}
      metasVazio={metas.length === 0}
      metasSub={metas.length
        ? `${metas.length} ${metas.length === 1 ? 'objetivo' : 'objetivos'}`
        : 'Nenhuma meta ainda — e esta tela funciona sem conectar nada'}
      ferramentas={FERRAMENTAS}
      openPalette={() => {
        // ⌘K ainda não implementado; leva ao hub de calculadoras.
        nav('/app/calculators');
      }}
      goConexoes={() => nav('/app/connections')}
    />
  );
}
