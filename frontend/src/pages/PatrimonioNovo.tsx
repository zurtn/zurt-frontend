import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PatrimonioDesign } from '@/components/zurt/PatrimonioDesign';
import { PatrimonioVazioDesign } from '@/components/zurt/PatrimonioVazioDesign';
import { usarApi, useLargura, grades, fmtBRL, fmtPct } from '@/hooks/useHub';

/**
 * PatrimonioNovo — posições e bens.
 *
 * Duas realidades do dado que o design ja previu e que aqui sao respeitadas:
 * renda fixa de balcao da B3 NAO tem cotacao por contrato (11 de 25 posicoes),
 * e posicao cuja quantidade nao fecha com a custodia fica sem rentabilidade.
 * Nos dois casos: "—" com motivo, nunca zero.
 */
export default function PatrimonioNovo() {
  const nav = useNavigate();
  const largura = useLargura();
  const pat = usarApi<any>('/api/dashboard/summary');
  const rent = usarApi<any>('/api/portfolio/rentabilidade');

  if (pat.carregando || rent.carregando) {
    return <div style={{ height: 280, borderRadius: 20, background: '#0b0e14' }} />;
  }

  const p = pat.dados;
  const r = rent.dados;
  const g = grades(largura);
  const temDado = !!p?.temDado && (p?.total ?? 0) !== 0;

  if (!temDado) {
    return (
      <PatrimonioVazioDesign
        stepsGrid={g.stepsGrid}
        plSize={largura >= 1200 ? '52px' : '28px'}
        goConexoes={() => nav('/app/connections')}
        patVazioLinhas={[
          { label: 'Financeiro', nota: 'aparece ao conectar banco, corretora ou exchange' },
          { label: 'Imóveis e bens', nota: 'aparece ao cadastrar um bem' },
          { label: 'Passivo', nota: 'aparece ao conectar cartão ou financiamento' },
        ]}
      />
    );
  }

  const semPreco = (r?.porAtivo ?? []).filter((a: any) => a.atual == null).length;
  const total = (r?.porAtivo ?? []).length;

  const posicoes = (r?.porAtivo ?? []).map((a: any) => ({
    ticker: a.nome,
    origem: a.fonte === 'b3' ? 'B3' : 'OPEN FINANCE',
    qtd: a.quantidade != null ? String(a.quantidade) : '—',
    pm: a.precoMedio != null ? fmtBRL(a.precoMedio) : '—',
    valor: a.atual != null ? fmtBRL(a.atual) : '—',
    ret: a.confiavel && a.percentual != null ? fmtPct(a.percentual) : '—',
    retCor: a.percentual == null ? '#52525b' : a.percentual >= 0 ? '#34d399' : '#f87171',
    motivo: a.motivo ?? '',
  }));

  return (
    <PatrimonioDesign
      heroGrid={g.heroGrid}
      kpiGrid={g.kpiGrid}
      midCols={largura >= 900 ? '1.2fr 1fr' : '1fr'}
      tableCols={largura >= 760 ? '1.4fr .7fr .9fr 1fr .8fr' : '1.6fr 1fr .9fr'}
      plSize={largura >= 1200 ? '52px' : largura >= 900 ? '36px' : '28px'}
      ret={r?.percentual != null ? fmtPct(r.percentual) : null}
      origensChip={`${p.contas} contas`}
      origensCaption={`${fmtBRL(p.caixa)} em caixa · ${p.investimentos} posições`}
      posicoes={posicoes}
      posComItens={posicoes.length > 0}
      posVazio={posicoes.length === 0}
      posTitle="Posições"
      tableHead={['ATIVO', 'ORIGEM', 'PREÇO MÉDIO', 'VALOR HOJE', 'RETORNO']}
      totalValor={fmtBRL(p.total, true)}
      totalNota={`${total - semPreco} de ${total} com cotação`}
      qualidade={semPreco > 0 ? [{
        rotulo: 'SEM COTAÇÃO',
        valor: `${semPreco} ${semPreco === 1 ? 'posição' : 'posições'}`,
        nota: 'renda fixa de balcão não tem preço na B3, por contrato',
      }] : []}
      kpis={[]}
      composicao={[]}
      tabs={[]}
      patInsight=""
    />
  );
}
