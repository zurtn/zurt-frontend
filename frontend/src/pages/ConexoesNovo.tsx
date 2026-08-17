import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ConexoesDesign } from '@/components/zurt/ConexoesDesign';
import { usarApi, useLargura, grades } from '@/hooks/useHub';

/**
 * ConexoesNovo — tela do funil. 18 de 24 clientes travam aqui sem conectar
 * nenhuma origem, entao os quatro estados precisam ser honestos:
 * ativo · expirado · erro · nunca conectado.
 */
export default function ConexoesNovo() {
  const nav = useNavigate();
  const largura = useLargura();
  const { dados, carregando } = usarApi<any>('/api/connections');

  if (carregando) {
    return <div style={{ height: 260, borderRadius: 20, background: '#0b0e14' }} />;
  }

  const lista: any[] = Array.isArray(dados) ? dados
    : Array.isArray(dados?.connections) ? dados.connections : [];

  // Origens fixas do produto. Cada uma existe sempre — o que muda e o estado.
  // "Ativos manuais" fica como nunca conectado porque o cadastro de bens nao
  // esta confirmado no produto: prometer origem que nao existe e pior que
  // mostrar a lacuna.
  const pluggy = lista.filter((c) => (c.status || '').toUpperCase() === 'UPDATED');
  const comErro = lista.filter((c) => /ERROR|LOGIN/i.test(c.status || ''));

  const origens = [
    { key: 'of', label: 'Open Finance', sigla: 'OF', siglaNeutra: 'OF',
      status: pluggy.length ? 'ativo' : comErro.length ? 'erro' : 'nunca',
      statusLabel: pluggy.length ? 'ATIVO' : comErro.length ? 'ERRO' : 'CONECTAR',
      meta: pluggy.length ? `${pluggy.length} instituição${pluggy.length > 1 ? 'es' : ''} conectada${pluggy.length > 1 ? 's' : ''}`
                          : 'Nenhuma instituição conectada',
      cor: pluggy.length ? '#34d399' : comErro.length ? '#f87171' : '#71717a' },
    { key: 'b3', label: 'B3 — Área do Investidor', sigla: 'B³', siglaNeutra: 'B3',
      status: 'nunca', statusLabel: 'CONECTAR', meta: 'Conta B3 não vinculada',
      cor: '#71717a' },
    { key: 'cripto', label: 'Exchanges de cripto', sigla: 'FOX', siglaNeutra: 'FOX',
      status: 'nunca', statusLabel: 'CONECTAR', meta: 'Nenhuma exchange conectada',
      cor: '#71717a' },
    { key: 'manual', label: 'Ativos manuais', sigla: 'MAN', siglaNeutra: 'MAN',
      status: 'nunca', statusLabel: 'CADASTRAR', meta: 'Nenhum bem declarado',
      cor: '#71717a' },
  ];

  const conectadas = origens.filter((o) => o.status === 'ativo').length;
  const quebradas = origens.filter((o) => o.status === 'erro' || o.status === 'expirado').length;
  const faltando = origens.filter((o) => o.status === 'nunca').length;

  return (
    <ConexoesDesign
      cxGrid={grades(largura).cxGrid}
      lowGrid={grades(largura).lowGrid}
      origens={origens}
      cxResumo={`Conectado ${conectadas} · Quebrou ${quebradas} · Falta ${faltando}`}
      cxHeadline={conectadas === 0
        ? 'Conecte uma origem e seu patrimônio aparece pronto — não digitado.'
        : 'Suas origens de dado'}
      cxSub={conectadas === 0
        ? 'Leva cerca de dois minutos. A ZURT lê saldo, posição e provento; nunca movimenta dinheiro e nunca pede sua senha de banco.'
        : `${conectadas} de ${origens.length} origens ativas`}
      cxGanhos={[
        { titulo: 'Patrimônio pronto', texto: 'Saldo, posição e provento sem digitar nada.' },
        { titulo: 'Somente leitura', texto: 'A ZURT nunca movimenta dinheiro.' },
        { titulo: 'Revogável', texto: 'Você desliga o consentimento quando quiser.' },
      ]}
    />
  );
}
