import React from 'react';
import { cor, fonte } from '@/design/tokens';

/**
 * DataTable — contrato do UI kit, com um desvio deliberado.
 *
 * Do kit: header fundo rgba(255,255,255,0.02), 9px/.12em; linhas com
 * divisória rgba(255,255,255,0.03) e padding 10×14; total row com fundo
 * sky 4% e borda superior 2px sky 20%.
 *
 * DESVIO: o kit renderiza <table> com colunas fixas. Aqui é grid CSS porque
 * a tabela precisa recolher de 5 para 3 colunas no mobile, o que a tabela do
 * kit não faz.
 *
 * REGRA DE DADO: célula com `null` renderiza "—", nunca "0" nem vazio. Um
 * traço com legenda explicando o motivo é informação; zero é mentira. Em
 * produção, 11 de 25 posições da B3 são renda fixa de balcão e NUNCA terão
 * cotação — por contrato, não por falha.
 */
export interface Coluna<T> {
  chave: string;
  titulo: string;
  /** Colunas com `essencial: false` somem abaixo de 760px. */
  essencial?: boolean;
  alinhamento?: 'left' | 'right';
  render: (linha: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  colunas: Coluna<T>[];
  linhas: T[];
  /** Linha de total, opcional. Ex.: "12 de 15 com cotação". */
  total?: { rotulo: string; valor: React.ReactNode; fracao?: string };
  vazio?: React.ReactNode;
  estreito?: boolean;
}

/** Célula ausente. Nunca "0", nunca vazio — "—" com significado. */
export function Traco({ titulo }: { titulo?: string }) {
  return (
    <span title={titulo} style={{ color: cor.textoMinimo, fontFamily: fonte.dado }}>
      —
    </span>
  );
}

export function DataTable<T>({ colunas, linhas, total, vazio, estreito = false }: DataTableProps<T>) {
  const cols = estreito ? colunas.filter((c) => c.essencial !== false) : colunas;
  const grid = cols.map((c) => (c.alinhamento === 'right' ? 'minmax(80px,auto)' : '1fr')).join(' ');

  if (!linhas.length) {
    return (
      <div style={{ padding: '30px 16px', textAlign: 'center',
                    color: cor.textoFraco, fontSize: 13.5,
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: 14, background: cor.superficie }}>
        {vazio ?? 'Nada aqui ainda.'}
      </div>
    );
  }

  return (
    <div style={{ border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: 14, overflow: 'hidden' }}>
      {/* header */}
      <div style={{ display: 'grid', gridTemplateColumns: grid,
                    background: 'rgba(255,255,255,0.02)' }}>
        {cols.map((c) => (
          <div key={c.chave} style={{
            fontFamily: fonte.dado, fontSize: 9, fontWeight: 700,
            letterSpacing: '0.12em', color: cor.textoMinimo,
            padding: '10px 14px',
            textAlign: c.alinhamento ?? 'left',
          }}>{c.titulo}</div>
        ))}
      </div>

      {/* linhas */}
      {linhas.map((l, i) => (
        <div key={i} style={{
          display: 'grid', gridTemplateColumns: grid,
          borderTop: '1px solid rgba(255,255,255,0.03)',
          background: cor.superficie,
        }}>
          {cols.map((c) => (
            <div key={c.chave} style={{
              padding: '10px 14px', fontSize: 13,
              color: cor.textoForte,
              textAlign: c.alinhamento ?? 'left',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{c.render(l)}</div>
          ))}
        </div>
      ))}

      {/* total — fração declara sobre quantos itens o total foi somado */}
      {total && (
        <div style={{
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
          gap: 12, padding: '11px 14px',
          background: `${cor.acento}0A`,
          borderTop: `2px solid ${cor.acento}33`,
        }}>
          <span style={{ fontFamily: fonte.dado, fontSize: 9, fontWeight: 700,
                         letterSpacing: '0.12em', color: cor.textoMinimo }}>
            {total.rotulo}
          </span>
          <span style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            {total.fracao && (
              <span style={{ fontFamily: fonte.dado, fontSize: 10, color: cor.textoFraco }}>
                {total.fracao}
              </span>
            )}
            <span style={{ fontFamily: fonte.dado, fontSize: 15,
                           fontWeight: 600, color: cor.texto }}>
              {total.valor}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}
