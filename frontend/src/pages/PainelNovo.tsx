import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PainelDesign } from '@/components/zurt/PainelDesign';
import {
  useDadosPainel, montarPropsPainel, montarBuckets,
  montarClasses, montarKpis,
} from '@/hooks/usePainel';

/**
 * PainelNovo — o design do Claude Design ligado no dado real.
 *
 * O componente visual (PainelDesign) é GERADO por conversor a partir do
 * markup original; nada nele é escrito à mão. Esta página só monta as props.
 * Se o design mudar, roda o conversor e esta página continua valendo.
 */
export default function PainelNovo() {
  const nav = useNavigate();
  const { dados, carregando } = useDadosPainel();
  const [largura, setLargura] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth : 1280);

  React.useEffect(() => {
    const f = () => setLargura(window.innerWidth);
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, []);

  if (carregando) {
    return <div style={{ height: 320, borderRadius: 24, background: '#0b0e14' }} />;
  }

  const base = montarPropsPainel(dados, largura);

  return (
    <PainelDesign
      {...base}
      buckets={montarBuckets(dados?.patrimonio)}
      classes={montarClasses(dados?.patrimonio)}
      kpis={montarKpis(dados?.patrimonio, dados?.rentabilidade)}
      conexoes={[]}
      conexoesTitle=""
      movs={[]}
      insight=""
      goConexoes={() => nav('/app/connections')}
      goMov={() => nav('/app/transactions')}
      goPatrimonio={() => nav('/app/investments')}
    />
  );
}
