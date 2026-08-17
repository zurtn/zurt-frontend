import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AnaliseDesign } from '@/components/zurt/AnaliseDesign';
import { usarApi, useLargura, grades } from '@/hooks/useHub';

/**
 * AnaliseNovo — relatorio sob demanda, historico e Radar Semanal.
 *
 * O Radar ja existe em producao (/api/radar/editions) e ate agora NADA na
 * plataforma levava ate ele. Esta tela e a primeira entrada.
 *
 * CVM 179: o aviso de que o conteudo nao e recomendacao de investimento vem
 * do design em barra propria, nao em letra miuda — e obrigatorio.
 */
export default function AnaliseNovo() {
  const nav = useNavigate();
  const largura = useLargura();
  const radar = usarApi<any>('/api/radar/editions');
  const rel = usarApi<any>('/api/reports');

  if (radar.carregando) {
    return <div style={{ height: 240, borderRadius: 20, background: '#0b0e14' }} />;
  }

  const edicoes: any[] = radar.dados?.edicoes ?? [];
  const destaque = edicoes[0] ?? null;
  const anteriores = edicoes.slice(1, 4);
  const historico: any[] = Array.isArray(rel.dados) ? rel.dados
    : Array.isArray(rel.dados?.reports) ? rel.dados.reports : [];

  return (
    <AnaliseDesign
      lowGrid={grades(largura).lowGrid}
      radarAnteriores={anteriores.map((e: any) => ({
        titulo: e.tema || e.titulo || 'Radar Semanal',
        data: e.data, url: e.url,
      }))}
      relBase={destaque
        ? (destaque.tema || destaque.titulo || 'Radar Semanal')
        : 'Nenhuma edição publicada ainda'}
      relTempo={destaque?.paginas ? `${destaque.paginas} páginas` : ''}
      relDisponivel={!!destaque}
      relIndisponivel={!destaque}
      relBlocos={[
        { label: 'Composição do patrimônio', ligado: true },
        { label: 'Rentabilidade por ativo', ligado: true },
        { label: 'Proventos recebidos', ligado: true },
        // Extrato completo vem DESMARCADO: 6.736 lançamentos viram 14 páginas
        // que quase ninguém lê. Decisão do design, não minha.
        { label: 'Extrato completo (14 páginas)', ligado: false },
      ]}
      historico={historico}
      histTemItens={historico.length > 0}
      histVazio={historico.length === 0}
      histTitulo={historico.length
        ? `${historico.length} ${historico.length === 1 ? 'relatório' : 'relatórios'}`
        : 'Nenhum relatório gerado ainda'}
      histCols={largura >= 760 ? '1.6fr 1fr .8fr' : '1fr .9fr'}
      goConexoes={() => nav('/app/connections')}
    />
  );
}
