import React from 'react';
import { cor, fonte } from '@/design/tokens';
import { KpiCard } from '@/components/zurt/KpiCard';
import { PatrimonioHero } from '@/components/zurt/PatrimonioHero';
import { DataTable, Traco, type Coluna } from '@/components/zurt/DataTable';
import { useRentabilidade, brl, pct, type AtivoRentabilidade } from '@/hooks/useRentabilidade';

/**
 * Rentabilidade — primeira tela do hub novo ligada em dado real.
 *
 * DECISÃO DE APRESENTAÇÃO (medida nos 6 usuários de produção):
 * um percentual único é sempre verdade parcial. A `andreia` tem 20% de
 * cobertura: "-11,89%" descreve um quinto da carteira dela. Por isso:
 *
 *   1. valor absoluto primeiro, percentual depois
 *   2. as três parcelas separadas — valorização, realizado, proventos.
 *      A `nath` perdeu R$ 771 operando e recebeu R$ 1.033 em dividendo;
 *      somar num número só apaga a informação que muda a decisão.
 *   3. cobertura colada no percentual, não em rodapé
 *   4. ausência é estado, não zero
 */
export default function Rentabilidade() {
  const { dados, carregando, erro } = useRentabilidade();
  const [largura, setLargura] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth : 1280);

  React.useEffect(() => {
    const f = () => setLargura(window.innerWidth);
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, []);

  if (carregando) {
    return <div style={{ height: 200, borderRadius: 24, background: cor.superficie,
                         animation: 'pulse 1.4s ease-in-out infinite' }} />;
  }
  if (erro || !dados) {
    return <Aviso titulo="Não conseguimos carregar sua rentabilidade"
                  texto="Tente novamente em instantes." />;
  }

  const { cobertura, estado } = dados;

  if (estado === 'sem_custo') {
    return (
      <Aviso
        titulo="Ainda não dá para calcular sua rentabilidade"
        texto={`Temos ${cobertura.posicoesTotal} posições, mas nenhuma com histórico de compra. ` +
               `Sem preço médio não há como dizer quanto rendeu — e um número inventado seria pior que nenhum.`}
      />
    );
  }

  const colunas: Coluna<AtivoRentabilidade>[] = [
    { chave: 'nome', titulo: 'ATIVO', render: (a) => (
        <span style={{ fontFamily: fonte.dado, fontWeight: 600 }}>{a.nome}</span>) },
    { chave: 'fonte', titulo: 'ORIGEM', essencial: false, render: (a) => (
        <span style={{ fontFamily: fonte.dado, fontSize: 10, color: cor.textoMinimo }}>
          {a.fonte === 'b3' ? 'B3' : 'OPEN FINANCE'}
        </span>) },
    { chave: 'pm', titulo: 'PREÇO MÉDIO', alinhamento: 'right', essencial: false,
      render: (a) => a.precoMedio == null
        ? <Traco titulo={a.motivo} />
        : <span style={{ fontFamily: fonte.dado }}>{brl(a.precoMedio)}</span> },
    { chave: 'atual', titulo: 'VALOR HOJE', alinhamento: 'right',
      render: (a) => a.atual == null
        ? <Traco titulo={a.motivo} />
        : <span style={{ fontFamily: fonte.dado }}>{brl(a.atual)}</span> },
    { chave: 'pct', titulo: 'RETORNO', alinhamento: 'right',
      render: (a) => {
        // Sem confiança, sem percentual — e o motivo viaja no title.
        if (!a.confiavel || a.percentual == null) return <Traco titulo={a.motivo} />;
        const positivo = a.percentual >= 0;
        return (
          <span style={{ fontFamily: fonte.dado, fontWeight: 600,
                         color: positivo ? cor.positivo : cor.negativo }}>
            {positivo ? '▲' : '▼'} {pct(a.percentual)}
          </span>
        );
      } },
  ];

  const semRetorno = dados.porAtivo.filter((a) => !a.confiavel).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <PatrimonioHero
        valor={brl(dados.atual)}
        variacao={dados.percentual != null ? pct(dados.percentual) : null}
        legenda={
          `investido ${brl(dados.investido)} · resultado ${brl(dados.resultado)} · ` +
          `sobre ${cobertura.posicoesComCusto} de ${cobertura.posicoesTotal} posições`
        }
        rotuloPeriodo="DESDE O INÍCIO"
        retorno={dados.percentual != null ? pct(dados.percentual) : null}
        motivoSemRetorno="sem preço médio"
        largura={largura}
      />

      {estado === 'parcial' && (
        <div style={{
          borderRadius: 14, padding: '13px 16px',
          border: `1px solid ${cor.atencao}33`, background: `${cor.atencao}14`,
          fontSize: 13, color: cor.textoMedio, lineHeight: 1.55,
        }}>
          <strong style={{ color: cor.atencao, fontFamily: fonte.dado, fontSize: 10,
                           letterSpacing: '0.14em', display: 'block', marginBottom: 5 }}>
            COBERTURA PARCIAL
          </strong>
          Este retorno cobre <strong style={{ color: cor.textoForte }}>
          {cobertura.pct.toFixed(0)}%</strong> da sua carteira —
          {' '}{cobertura.posicoesComCusto} de {cobertura.posicoesTotal} posições têm
          histórico de compra. As demais aparecem na lista sem percentual, com o motivo.
        </div>
      )}

      {/* As três parcelas separadas. Somar apaga informação que muda decisão. */}
      <div style={{ display: 'grid', gap: 14,
                    gridTemplateColumns: largura >= 900 ? 'repeat(3,1fr)' : '1fr' }}>
        <KpiCard label="VALORIZAÇÃO" valor={brl(dados.valorizacao)}
          corValor={dados.valorizacao >= 0 ? cor.positivo : cor.negativo}
          seta={dados.valorizacao >= 0 ? '▲' : '▼'}
          corDelta={dados.valorizacao >= 0 ? cor.positivo : cor.negativo}
          sub="posições em carteira" destaque />
        <KpiCard label="RESULTADO REALIZADO" valor={brl(dados.realizado)}
          corValor={dados.realizado >= 0 ? cor.positivo : cor.negativo}
          sub="vendas concluídas" />
        <KpiCard label="PROVENTOS RECEBIDOS" valor={brl(dados.proventos)}
          corValor={cor.violeta}
          delta={`${dados.proventosEventos}`}
          corDelta={cor.textoFraco}
          sub="dividendos e JCP" />
      </div>

      <DataTable
        colunas={colunas}
        linhas={dados.porAtivo}
        estreito={largura < 760}
        total={{
          rotulo: 'TOTAL COM PREÇO MÉDIO',
          valor: brl(dados.atual),
          fracao: `${cobertura.posicoesComCusto} de ${cobertura.posicoesTotal}`,
        }}
        vazio="Nenhuma posição na carteira ainda."
      />

      {semRetorno > 0 && (
        <p style={{ fontSize: 12, color: cor.textoFraco, lineHeight: 1.6 }}>
          <span style={{ fontFamily: fonte.dado, color: cor.textoMinimo }}>—</span>
          {' '}significa que não temos base para calcular, não que o valor seja zero.
          {' '}{semRetorno} {semRetorno === 1 ? 'ativo está' : 'ativos estão'} nessa situação:
          renda fixa de balcão não tem cotação por contrato com a B3, e posição cuja
          quantidade não fecha com a custódia fica sem percentual até reconciliar.
        </p>
      )}
    </div>
  );
}

function Aviso({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div style={{
      padding: '34px 20px', textAlign: 'center', borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.05)', background: cor.superficie,
    }}>
      <strong style={{ display: 'block', color: cor.textoForte,
                       fontSize: 15, marginBottom: 7 }}>{titulo}</strong>
      <span style={{ color: cor.textoFraco, fontSize: 13.5, lineHeight: 1.6 }}>{texto}</span>
    </div>
  );
}
