/**
 * Design tokens da repaginação ZURT — extraídos do design, não transcritos.
 *
 * Origem: `site-novo/Hub ZURT/ZURT Web (standalone).html`, desempacotado e
 * medido em 28/07/2026. Os valores abaixo são os que MAIS aparecem no markup,
 * com a contagem de uso ao lado — não são escolha minha.
 *
 * Regra: nenhum hex solto em componente. Se uma cor não está aqui, ela não
 * existe no sistema. Foi assim que a base acumulou quatro preços diferentes
 * hardcoded (79,90 → 49,90 → 16,90 → 24,90) antes de alguém centralizar.
 */

export const cor = {
  // superfícies — do mais escuro ao mais claro
  fundo:         '#07090e',  // x17  fundo da aplicação
  fundoPoco:     '#050810',  // x4   dentro de capa/thumbnail
  superficie:    '#0b0e14',  // x3   card sobre o fundo
  superficieAlt: '#0d1018',  // x3
  borda:         '#3f3f46',  // x20  divisória forte

  // texto — hierarquia de 5 níveis
  texto:        '#f4f4f5',   // x26  título e valor grande
  textoForte:   '#e4e4e7',   // x53  corpo principal
  textoMedio:   '#a1a1aa',   // x41  descrição
  textoFraco:   '#71717a',   // x63  meta e legenda
  textoMinimo:  '#52525b',   // x90  eyebrow mono — a cor MAIS usada do sistema

  // acento — o azul é a identidade
  acento:       '#38bdf8',   // x57  ação primária, links, destaque
  acentoFundo:  '#06b6d4',   // x12  fim do gradiente do botão
  acentoClaro:  '#22d3ee',   // x7   logo, tema macro
  acentoPalido: '#e0f2fe',   // x1

  // semântica
  positivo:     '#34d399',   // x30  alta, ativo, sucesso
  negativo:     '#f87171',   // x11  baixa, erro
  atencao:      '#fbbf24',   // x14  expirado, pendência
  violeta:      '#a78bfa',   // x14  evento de carteira, internacional
  cripto:       '#7c8aff',   // x1
} as const;

/** Temas por categoria de conteúdo. */
export const tema = {
  macro:  { rotulo: 'MACRO',         cor: '#22d3ee' },
  rf:     { rotulo: 'RENDA FIXA',    cor: '#38bdf8' },
  bolsa:  { rotulo: 'BOLSA',         cor: '#34d399' },
  cambio: { rotulo: 'CÂMBIO',        cor: '#fbbf24' },
  intl:   { rotulo: 'INTERNACIONAL', cor: '#a78bfa' },
  cripto: { rotulo: 'CRIPTO',        cor: '#7c8aff' },
} as const;

/**
 * Tipografia. Duas famílias, e a proporção diz o que o produto é:
 * JetBrains Mono aparece 161 vezes no design contra 15 de Outfit — é
 * interface de terminal financeiro, não de app de consumo. Mono para todo
 * dado, rótulo e eyebrow; Outfit só para título e texto corrido.
 */
export const fonte = {
  dado:  "'JetBrains Mono', ui-monospace, monospace",
  ui:    "'Outfit', system-ui, -apple-system, sans-serif",
} as const;

/**
 * Escala medida no design. Os tamanhos abaixo de 12px são quase todos mono
 * com letter-spacing largo — é rótulo, não texto para ler.
 */
export const texto = {
  heroXl:  52,   // patrimônio no hero, largura ≥1200
  heroLg:  48,
  heroMd:  36,   // 900–1200  (regra de colapso do design)
  heroSm:  28,   // <900      — nunca quebra em duas linhas
  titulo:  26,
  h2:      22,
  h3:      19,
  valor:   17,
  corpo:   15,
  corpoSm: 13,
  meta:    12,
  rotulo:  11,
  eyebrow:  9,   // x52 — mono, tracking 0.18–0.22em
} as const;

/** Raios. O 24 é do hero (convenção BtgHero), 9999 é pill. */
export const raio = {
  pill:    9999,  // x19
  hero:    24,
  card:    18,    // x10
  bloco:   16,    // x13
  campo:   11,    // x14
  botao:   10,    // x19
  chip:     6,
} as const;

/**
 * Colapso. Medir a LARGURA, não presumir dispositivo — foi o erro da
 * primeira tentativa do Radar, desenhada como moldura de 402px.
 */
export const quebra = {
  amplo:   1200,  // hero 2 colunas + 4 KPIs
  medio:    900,  // hero empilhado + 2 KPIs
  estreito: 760,  // sidebar sai, entra tab bar inferior
} as const;
