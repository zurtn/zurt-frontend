import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MovimentacoesDesign } from '@/components/zurt/MovimentacoesDesign';
import { usarApi, useLargura, grades, fmtBRL } from '@/hooks/useHub';

/**
 * MovimentacoesNovo — extrato consolidado.
 *
 * DUAS NATUREZAS numa linha do tempo so (decisao do design):
 *   dinheiro  — 6.736 transacoes bancarias medidas em producao
 *   carteira  — 1.627 eventos de investimento (dividendo, JCP, grupamento)
 * Evento de carteira nao entra no saldo do dia; aparece com trilho violeta.
 *
 * Transferencia entre contas proprias (734 registros) fica FORA de entradas e
 * saidas — senao o extrato mostra R$ 25 mil de "gasto" que nunca saiu do
 * patrimonio do cliente.
 *
 * Categoria da Pluggy vem em INGLES; traduzimos na exibicao e mantemos o
 * rotulo original embaixo, para o cliente poder conferir com o banco.
 */
const CAT_PT: Record<string, string> = {
  'Taxi and ride-hailing': 'Transporte por app',
  'Eating out': 'Alimentação fora',
  'Groceries': 'Mercado',
  'Same person transfer': 'Transferência entre contas',
  'Proceeds interests and dividends': 'Proventos',
  'Income': 'Receita',
  'Transfers': 'Transferências',
  'Shopping': 'Compras',
  'Services': 'Serviços',
  'Bills and utilities': 'Contas e serviços',
};

export default function MovimentacoesNovo() {
  const nav = useNavigate();
  const largura = useLargura();
  const { dados, carregando } = usarApi<any>('/api/finance/transactions?limit=60');

  if (carregando) {
    return <div style={{ height: 260, borderRadius: 20, background: '#0b0e14' }} />;
  }

  const brutas: any[] = Array.isArray(dados) ? dados
    : Array.isArray(dados?.transactions) ? dados.transactions : [];

  const movs = brutas.map((t: any) => {
    const catOrig = t.category ?? '';
    const transfInterna = catOrig === 'Same person transfer';
    const v = Number(t.amount) || 0;
    return {
      data: String(t.date ?? '').slice(0, 10).split('-').reverse().slice(0, 2).join('/'),
      descricao: t.description ?? '—',
      categoria: CAT_PT[catOrig] ?? catOrig ?? '—',
      categoriaOriginal: catOrig,
      valor: fmtBRL(Math.abs(v)),
      // Transferencia interna: cinza, fora de entrada e saida.
      cor: transfInterna ? '#71717a' : v >= 0 ? '#34d399' : '#e4e4e7',
      tipo: transfInterna ? 'interna' : v >= 0 ? 'entrada' : 'saida',
      carteira: false,
    };
  });

  const dinheiro = movs.filter((m) => !m.carteira).length;
  const internas = movs.filter((m) => m.tipo === 'interna').length;
  // Transferencia interna FICA DE FORA de entradas e saidas: senao o extrato
  // mostra "gasto" de dinheiro que nunca saiu do patrimonio do cliente.
  const entradas = brutas.reduce((s: number, t: any) =>
    t.category !== 'Same person transfer' && Number(t.amount) > 0
      ? s + Number(t.amount) : s, 0);
  const saidas = brutas.reduce((s: number, t: any) =>
    t.category !== 'Same person transfer' && Number(t.amount) < 0
      ? s + Math.abs(Number(t.amount)) : s, 0);

  // Agrupa por dia — o subtotal do dia soma so dinheiro.
  const porDia = new Map<string, any[]>();
  for (const m of movs) {
    const arr = porDia.get(m.data) ?? [];
    arr.push(m);
    porDia.set(m.data, arr);
  }
  const dias = [...porDia.entries()].map(([data, itens]) => ({ data, itens }));

  return (
    <MovimentacoesDesign
      midCols={largura >= 900 ? '1.2fr 1fr' : '1fr'}
      movKpiGrid={largura >= 1200 ? 'repeat(4,1fr)' : largura >= 900 ? 'repeat(2,1fr)' : '1fr'}
      movCols={largura >= 760 ? '.7fr 2fr 1fr 1fr' : '.8fr 2fr 1fr'}
      movComDados={movs.length > 0}
      movVazio={movs.length === 0}
      movTitulo={`${movs.length} ${movs.length === 1 ? 'lançamento' : 'lançamentos'}`}
      movFiltrado={movs}
      movResultado={movs.length > 0}
      movSemResultado={movs.length === 0}
      dias={dias}
      lentes={[
        { label: 'Tudo', n: movs.length },
        { label: 'Dinheiro', n: dinheiro },
        // Evento de carteira ainda nao entra nesta tela: o pareamento de
        // proventos (B3 x banco) nao foi implementado no backend. Mostrar
        // agora duplicaria dividendo para quem tem as duas origens.
        { label: 'Carteira', n: 0 },
      ]}
      movKpis={[
        { label: 'ENTRADAS NESTA PÁGINA', value: fmtBRL(entradas), color: '#34d399' },
        { label: 'SAÍDAS NESTA PÁGINA', value: fmtBRL(saidas), color: '#f87171' },
        { label: 'SALDO DOS FILTROS ATUAIS', value: fmtBRL(entradas - saidas), color: '#38bdf8' },
        { label: 'TRANSFERÊNCIAS INTERNAS', value: String(internas), color: '#71717a' },
      ]}
      catsOpt={[...new Set(movs.map((m) => m.categoria))].map((c) => ({ label: c }))}
      contasOpt={[]}
      faixas={[]}
      movQ="" movCat="" movConta=""
      onMovQ={() => {}} onMovCat={() => {}} onMovConta={() => {}}
      limparMov={() => {}}
      movPaginacao={`${movs.length} de ${movs.length}`}
      goConexoes={() => nav('/app/connections')}
    />
  );
}
