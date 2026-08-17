import React from 'react';
import { cor, fonte } from '@/design/tokens';

/**
 * StatusPill — contrato do UI kit: 9px, tracking .1em,
 * fundo 15–18% e borda 25% da cor.
 *
 * Os quatro estados de origem de dado são os medidos em produção, não
 * inventados: ativo, expirado (consentimento B3 vence anualmente),
 * erro (chave revogada, 401 na fatura) e nunca conectado.
 */
export type StatusOrigem = 'ativo' | 'expirado' | 'erro' | 'nunca' | 'sincronizando';

const ESTILO: Record<StatusOrigem, { rotulo: string; cor: string }> = {
  ativo:         { rotulo: 'ATIVO',         cor: cor.positivo },
  expirado:      { rotulo: 'EXPIRADO',      cor: cor.atencao },
  erro:          { rotulo: 'ERRO',          cor: cor.negativo },
  nunca:         { rotulo: 'CONECTAR',      cor: cor.textoFraco },
  sincronizando: { rotulo: 'SINCRONIZANDO', cor: cor.acento },
};

export function StatusPill({ status, rotulo }: { status: StatusOrigem; rotulo?: string }) {
  const e = ESTILO[status];
  return (
    <span style={{
      fontFamily: fonte.dado, fontSize: 9, fontWeight: 700,
      letterSpacing: '0.1em', color: e.cor,
      background: `${e.cor}26`,           // ~15%
      border: `1px solid ${e.cor}40`,     // ~25%
      padding: '3px 7px', borderRadius: 5,
      whiteSpace: 'nowrap',
    }}>
      {rotulo ?? e.rotulo}
    </span>
  );
}

/**
 * AssessorBadge — sigla de instituição. Mono 10px, radius 6, borda da cor.
 *
 * ⚠️ Para a B3 existem DUAS siglas por decisão de contrato: `B³` é o lockup
 * de marca, exigido na tela de Conexões pelo Manual Técnico (item 9), e `B3`
 * é o rótulo neutro. A marca NÃO pode aparecer em tela que apresente
 * recomendação de investimento — logo, Painel e Patrimônio usam a neutra.
 */
export function AssessorBadge({ sigla, corSigla = cor.textoFraco }:
  { sigla: string; corSigla?: string }) {
  return (
    <span style={{
      fontFamily: fonte.dado, fontSize: 10, fontWeight: 700,
      color: corSigla, border: `1px solid ${corSigla}40`,
      borderRadius: 6, padding: '4px 6px', lineHeight: 1,
      display: 'inline-block', minWidth: 34, textAlign: 'center',
    }}>
      {sigla}
    </span>
  );
}
