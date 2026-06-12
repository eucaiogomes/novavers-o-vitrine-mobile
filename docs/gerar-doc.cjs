const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, TableOfContents, HeadingLevel, BorderStyle,
  WidthType, ShadingType, PageBreak, Footer, PageNumber,
} = require('docx');

// ── Helpers ────────────────────────────────────────────────
const CONTENT_W = 9026; // A4 com margens de 1"

const h1 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(t)] });
const h2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(t)] });
const h3 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun(t)] });
const p = (t, opts = {}) => new Paragraph({
  spacing: { after: 120 },
  children: [new TextRun({ text: t, ...opts })],
});
const pRuns = (runs) => new Paragraph({ spacing: { after: 120 }, children: runs });
const bullet = (t) => new Paragraph({
  numbering: { reference: 'bullets', level: 0 },
  spacing: { after: 60 },
  children: [new TextRun(t)],
});
const bulletBold = (label, rest) => new Paragraph({
  numbering: { reference: 'bullets', level: 0 },
  spacing: { after: 60 },
  children: [new TextRun({ text: label, bold: true }), new TextRun(rest)],
});
const pageBreak = () => new Paragraph({ children: [new PageBreak()] });

const dashBorder = { style: BorderStyle.DASHED, size: 6, color: 'AAAAAA' };
const printPH = (desc) => new Table({
  width: { size: CONTENT_W, type: WidthType.DXA },
  columnWidths: [CONTENT_W],
  rows: [new TableRow({
    children: [new TableCell({
      borders: { top: dashBorder, bottom: dashBorder, left: dashBorder, right: dashBorder },
      width: { size: CONTENT_W, type: WidthType.DXA },
      shading: { fill: 'F5F5F5', type: ShadingType.CLEAR },
      margins: { top: 400, bottom: 400, left: 120, right: 120 },
      children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: `ESPACO PARA PRINT — ${desc}`, italics: true, color: '888888', size: 20 })],
      })],
    })],
  })],
});

const cellBorder = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' };
const borders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };
const margins = { top: 80, bottom: 80, left: 120, right: 120 };

function makeTable(headers, rows, widths) {
  const total = widths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: widths,
    rows: [
      new TableRow({
        tableHeader: true,
        children: headers.map((htext, i) => new TableCell({
          borders, margins,
          width: { size: widths[i], type: WidthType.DXA },
          shading: { fill: 'EAEAEA', type: ShadingType.CLEAR },
          children: [new Paragraph({ children: [new TextRun({ text: htext, bold: true, size: 20 })] })],
        })),
      }),
      ...rows.map(cells => new TableRow({
        children: cells.map((c, i) => {
          // célula pode ser string ou { text, fill, color }
          const isObj = typeof c === 'object' && c !== null;
          const text = isObj ? c.text : c;
          return new TableCell({
            borders, margins,
            width: { size: widths[i], type: WidthType.DXA },
            shading: isObj && c.fill ? { fill: c.fill, type: ShadingType.CLEAR } : undefined,
            children: [new Paragraph({ children: [new TextRun({ text, size: 20, color: isObj && c.color ? c.color : undefined })] })],
          });
        }),
      })),
    ],
  });
}

const spacer = () => new Paragraph({ spacing: { after: 120 }, children: [] });

// ── Conteúdo ───────────────────────────────────────────────
const children = [];

// CAPA
children.push(
  new Paragraph({ spacing: { before: 3000 } }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'Vitrine Mobile Lector', bold: true, size: 56 })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { before: 200 },
    children: [new TextRun({ text: 'Documentacao completa de Design System', size: 32, color: '555555' })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { before: 200 },
    children: [new TextRun({ text: 'Componentes, cores, dimensoes, microinteracoes, tema por cliente e regras de comportamento', size: 22, color: '888888', italics: true })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { before: 2000 },
    children: [new TextRun({ text: 'Lector Tecnologia — Junho de 2026', size: 22, color: '888888' })],
  }),
  pageBreak(),
);

// SUMÁRIO
children.push(
  h1('Sumario'),
  new TableOfContents('Sumario', { hyperlink: true, headingStyleRange: '1-2' }),
  pageBreak(),
);

// ════════════════════ 1. VISÃO GERAL ════════════════════
children.push(
  h1('1. Visao geral'),
  p('Este documento descreve, em detalhes, a tela da vitrine mobile da Lector: cada componente, suas dimensoes, cores, estados, animacoes e as regras de comportamento. A ideia e simples: um dev que nunca viu o projeto consegue recriar tudo so lendo este material.'),
  p('O app e uma vitrine de conteudos (treinamentos, trilhas e certificados) com experiencia mobile no estilo iOS. As telas internas (perfil, chat, notificacoes, validar certificado) abrem em tela cheia deslizando da direita, mantendo a barra superior do app visivel, como num app nativo.'),
  h3('Stack tecnica'),
  bullet('React 19 + TypeScript + Vite'),
  bullet('TailwindCSS 4 (estilizacao por classes utilitarias)'),
  bullet('Motion / Framer Motion (animacoes com fisica de mola)'),
  bullet('TanStack Router (rotas da SPA)'),
  bullet('Lucide React (biblioteca de icones, traco fino)'),
  h3('Principios de design'),
  bulletBold('Sensacao iOS: ', 'fundo cinza-claro #F2F2F7, cards brancos agrupados, labels de secao em caixa alta, chevrons cinza #C7C7CC, transicoes com mola.'),
  bulletBold('Flat e limpo: ', 'sem sombras pesadas, sem gradientes chamativos nas telas internas. Cards brancos sobre fundo cinza ja criam a separacao visual.'),
  bulletBold('Toque em primeiro lugar: ', 'todo elemento interativo tem no minimo 44px de altura e feedback visual imediato no toque (active:).'),
  bulletBold('Uma so linguagem: ', 'todas as telas internas usam os mesmos blocos (label de secao + card branco + rows de 52px). O usuario nunca sente que mudou de app.'),
  printPH('Tela inicial da vitrine no mobile, visao geral'),
  pageBreak(),
);

// ════════════════════ 2. FUNDAMENTOS ════════════════════
children.push(
  h1('2. Fundamentos (design tokens)'),
  h2('2.1 Cores base'),
  p('As cores ficam definidas como variaveis CSS no arquivo src/index.css e viram classes do Tailwind (ex.: bg-brand-primary). Isso e o que permite trocar o tema por cliente — veja a secao 3.'),
  makeTable(
    ['Token', 'Valor (Lector)', 'Uso', 'Amostra'],
    [
      ['--theme-primary / brand-primary', '#FF7A1A', 'Cor de destaque: botoes, itens ativos, badges, links de voltar', { text: '', fill: 'FF7A1A' }],
      ['--brand-color-dark', '#F2680D', 'Hover/pressionado da cor primaria', { text: '', fill: 'F2680D' }],
      ['--theme-secondary / navy-900', '#041433', 'Azul institucional: rodape, banners hero', { text: '', fill: '041433' }],
      ['navy-800', '#08204D', 'Segundo tom do rodape (gradiente)', { text: '', fill: '08204D' }],
      ['--theme-accent / blue-500', '#2563EB', 'Destaques secundarios', { text: '', fill: '2563EB' }],
      ['Fundo das telas iOS', '#F2F2F7', 'Fundo de todas as telas internas mobile', { text: '', fill: 'F2F2F7' }],
      ['Fundo geral do site', '#F7F9FC', 'Fundo da vitrine (body)', { text: '', fill: 'F7F9FC' }],
      ['Cards', '#FFFFFF', 'Cards agrupados, navbar, sidebar', { text: '', fill: 'FFFFFF' }],
      ['Chevron iOS', '#C7C7CC', 'Setas indicadoras de navegacao nas rows', { text: '', fill: 'C7C7CC' }],
      ['Divisor de rows', 'gray-100 (#F3F4F6)', 'Linha de 1px entre rows de um card', { text: '', fill: 'F3F4F6' }],
    ],
    [2700, 1800, 3326, 1200],
  ),
  spacer(),
  h3('Cores semanticas (nunca mudam com o tema)'),
  makeTable(
    ['Significado', 'Cores', 'Onde aparece'],
    [
      ['Sucesso / valido / online', 'emerald-500 #10B981, emerald-50 fundo, emerald-600 texto', 'Certificado valido, bolinha de online no chat, aproveitamento'],
      ['Erro / sair', 'red-500 #EF4444, red-100 fundo', 'Codigo nao encontrado, botao Sair'],
      ['Conquista / pontos', 'amber-400 #FBBF24', 'Medalha de pontos, notificacao de conquista'],
      ['Informacao', 'blue-600 + blue-50', 'Notificacao de calendario'],
    ],
    [2200, 3400, 3426],
  ),
  spacer(),
  h2('2.2 Tipografia'),
  p('Fonte do corpo: Inter (Google Fonts). Fonte display (titulos grandes de marketing): Outfit. Nas telas mobile internas usamos so a Inter.'),
  makeTable(
    ['Tamanho', 'Peso', 'Uso'],
    [
      ['28px', 'bold (700)', 'Titulo grande de tela (ex.: "Chat")'],
      ['17px', 'semibold (600)', 'Titulo centralizado do header iOS, nome no card de usuario'],
      ['16px', 'semibold', 'Titulos de cards de resultado'],
      ['15px', 'regular / medium / semibold', 'Texto das rows, mensagens do chat, inputs. Semibold para acoes em destaque'],
      ['14px', 'medium (500)', 'Subcategorias e vitrines na sidebar'],
      ['13px', 'regular', 'Labels de secao (CAIXA ALTA + tracking-wide), descricoes, previews de chat'],
      ['12px', 'regular', 'Subtitulos de rows, horarios, contador de caracteres'],
      ['11px', 'semibold', 'Badges numericos (nao lidas, contadores), nome do autor no chat em grupo'],
      ['10px', 'regular', 'Hora dentro da bolha de mensagem'],
    ],
    [1500, 2600, 4926],
  ),
  spacer(),
  p('Regra dos labels de secao: sempre 13px, cor gray-500, CAIXA ALTA, tracking-wide, padding horizontal de 16px e margem inferior de 4px antes do card.'),
  h2('2.3 Espacamento, raios e dimensoes padrao'),
  makeTable(
    ['Token', 'Valor', 'Uso'],
    [
      ['Margem lateral das telas', '16px (mx-4)', 'Cards e labels respiram 16px das bordas'],
      ['Row padrao', 'min-height 52px', 'Altura minima de toda linha tocavel em cards'],
      ['Row com subtitulo', 'min-height 62px', 'Linhas de 2 andares (ex.: trocar portal, idioma)'],
      ['Raio dos cards', '16px (rounded-2xl)', 'Todos os cards agrupados'],
      ['Raio de rows internas', '12px (rounded-xl)', 'Botoes da sidebar, inputs'],
      ['Avatar de usuario (card perfil)', '56px (w-14)', 'Card de identidade'],
      ['Avatar do chat (lista)', '48px (w-12)', 'Lista de conversas e usuarios'],
      ['Avatar do chat (header conversa)', '36px (w-9)', 'Cabecalho da conversa aberta'],
      ['Icone de row', '18px, cor gray-400', 'Icone a esquerda das rows'],
      ['Chevron de row', '16px (h-4), cor #C7C7CC', 'Seta a direita das rows'],
      ['Divisor entre rows', '1px gray-100, com recuo a esquerda', 'Recuo de 46px (perfil), 68px (notificacoes), 76px (chat) para alinhar com o texto'],
      ['Barra superior (navbar)', 'altura 56px (h-14)', 'Fixa no topo, z-50'],
      ['Header iOS interno', 'altura 44px (h-11)', 'Header branco com titulo centralizado'],
    ],
    [3000, 2400, 3626],
  ),
  spacer(),
  h2('2.4 Sombras'),
  p('Nas telas mobile internas: nenhuma sombra — cards brancos flat sobre fundo cinza. Na vitrine (cards de conteudo desktop) existem dois tokens suaves:'),
  bullet('--shadow-subtle: 0 4px 12px rgba(4,20,51,0.06) — estado de repouso'),
  bullet('--shadow-hover: 0 10px 28px rgba(4,20,51,0.14) — hover de cards de conteudo'),
  h2('2.5 Icones'),
  p('Biblioteca unica: Lucide React. Traco fino, consistente. Nunca usar emoji como icone. Tamanhos: 18px em rows, 20px em botoes da navbar, 16px em chevrons. Cor padrao gray-400 quando neutro; brand-primary quando ativo; vermelho so em acoes destrutivas.'),
  printPH('Paleta de cores e exemplos de tipografia lado a lado'),
  pageBreak(),
);

// ════════════════════ 3. TEMA POR CLIENTE ════════════════════
children.push(
  h1('3. Tema por cliente (white-label)'),
  p('O app e multi-cliente. A Lector usa laranja + azul institucional, mas cada cliente configura as proprias cores num painel de temas (ex.: MPSP e ESMP usam vermelho). O app inteiro se adapta sozinho porque NENHUM componente usa cor de marca chumbada no codigo — tudo passa pelas variaveis CSS.'),
  h3('Como funciona tecnicamente'),
  bullet('As variaveis ficam em :root no src/index.css (--theme-primary, --theme-secondary, --theme-accent, --brand-color-dark).'),
  bullet('O Tailwind expoe essas variaveis como classes: bg-brand-primary, text-brand-primary, border-brand-primary etc.'),
  bullet('Para trocar o tema, basta sobrescrever as variaveis (ex.: injetando um style com os valores do cliente vindos da API). Nada mais muda no codigo.'),
  bullet('A logo tambem e por cliente: o componente recebe a URL da logo do portal e substitui a logo Lector na navbar e na sidebar.'),
  h3('Mapeamento: painel de configuracao do cliente → tokens do app'),
  makeTable(
    ['Campo no painel do cliente', 'Token no app', 'Exemplo MPSP'],
    [
      ['Cor dos destaques da barra superior', '--theme-primary (brand-primary)', '#C40008'],
      ['Cor dos botoes', '--theme-primary', '#C40008'],
      ['Cor dos botoes (hover)', '--brand-color-dark', '#96050F'],
      ['Cor da barra superior', '--theme-secondary (institucional)', '#EB2E2E'],
      ['Cor dos botoes alternativos', '--theme-accent', '#212125'],
      ['Cor da fonte / fonte (hover)', 'Texto sobre areas institucionais', '#B9BDC1 / #212125'],
      ['Miniatura da imagem do portal', 'Logo exibida na navbar e sidebar', 'Logo do cliente'],
    ],
    [3300, 3300, 2426],
  ),
  spacer(),
  h3('O que muda quando o tema muda'),
  p('Tudo que hoje aparece em laranja passa para a cor primaria do cliente:'),
  bullet('Item ativo na sidebar (bolinha, barra lateral de 3px, fundo com 10% de opacidade, check)'),
  bullet('Links "Voltar" dos headers iOS e botoes de acao em texto'),
  bullet('Badges de nao lidas (perfil, chat, sino de notificacoes)'),
  bullet('Bolhas das mensagens enviadas no chat e botao de enviar'),
  bullet('Acordeoes: item selecionado (perfil, idioma, portal), fundo com 4% de opacidade'),
  bullet('Rotulo do perfil ("Aluno") no card de usuario'),
  bullet('Spinner de carregamento do validar certificado'),
  bullet('Underline da tab ativa no desktop'),
  h3('O que NAO muda nunca'),
  bullet('Cinzas e fundos neutros (#F2F2F7, branco, gray-100...): a estrutura e sempre a mesma'),
  bullet('Cores semanticas: verde de sucesso/online, vermelho de erro/sair, ambar de conquista'),
  bullet('Chevron #C7C7CC e divisores'),
  bullet('Tipografia, espacamentos, raios e animacoes'),
  p('Regra de ouro: cor de marca comunica selecao e acao; cor semantica comunica estado. Nunca misturar as duas funcoes.'),
  printPH('Painel de configuracao de tema do cliente (ex.: MPSP em vermelho)'),
  printPH('Mesma tela do app com tema Lector (laranja) e com tema de cliente (vermelho), lado a lado'),
  pageBreak(),
);

// ════════════════════ 4. BARRA SUPERIOR ════════════════════
children.push(
  h1('4. Barra superior (Topbar)'),
  p('Barra fixa no topo, presente em todas as telas. E o "porto seguro" da navegacao: mesmo com uma tela interna aberta (chat, certificado, notificacoes), ela continua visivel e funcional.'),
  h3('Anatomia (mobile)'),
  makeTable(
    ['Elemento', 'Especificacao', 'Comportamento'],
    [
      ['Container', 'Altura 56px, fundo branco, borda inferior gray-100, fixed, z-50', 'Sempre visivel'],
      ['Hamburger (esq.)', 'Icone Menu 20px, area de toque com padding 8px, gray-500', 'Abre a sidebar de vitrines. Fecha qualquer tela interna aberta'],
      ['Logo (centro)', 'Altura 28px, centralizada de forma absoluta', 'Volta para a vitrine (aba Explorar) e fecha telas internas'],
      ['Busca (dir.)', 'Icone Search 20px, gray-400', 'Abre overlay de busca sobre a navbar'],
      ['Avatar (dir.)', '32px redondo, active:scale-95', 'Abre o menu de perfil em tela cheia'],
    ],
    [2200, 3400, 3426],
  ),
  spacer(),
  h3('Anatomia (desktop, >= 1024px)'),
  bullet('Logo a esquerda em fluxo normal; tabs Explorar / Social / Minha Area com underline brand-primary de 2px na ativa'),
  bullet('Mega menu abre no hover da tab Explorar'),
  bullet('Barra de busca central com sugestoes em dropdown (max. 5 resultados)'),
  bullet('Sino de notificacoes com bolinha vermelha, globo de idioma, divisor vertical, avatar 28px com nome'),
  bullet('Clique no avatar abre dropdown (nao a tela cheia)'),
  h3('Estados e microinteracoes'),
  makeTable(
    ['Elemento', 'Hover (desktop)', 'Active (toque)'],
    [
      ['Hamburger', 'bg-gray-100', 'bg-gray-200, transicao 150ms'],
      ['Busca', 'bg-gray-100 + texto gray-700', 'bg-gray-200, 150ms'],
      ['Avatar', 'bg-gray-100', 'scale 0.95, 150ms'],
      ['Tabs desktop', 'texto gray-800', 'underline anima na troca'],
    ],
    [2200, 3400, 3426],
  ),
  spacer(),
  h3('Regras'),
  bullet('Em telas < 1024px (lg), o clique no avatar abre a ProfileScreen; em >= 1024px abre o dropdown. A checagem e por window.innerWidth.'),
  bullet('Hamburger, logo e avatar SEMPRE fecham as telas internas abertas antes de executar a propria acao. Isso evita telas empilhadas.'),
  printPH('Navbar mobile com hamburger, logo central, busca e avatar'),
  pageBreak(),
);

// ════════════════════ 5. BUSCA MOBILE ════════════════════
children.push(
  h1('5. Busca mobile (overlay)'),
  p('Tocando na lupa, um overlay branco cobre a navbar inteira com um campo de busca focado automaticamente.'),
  h3('Anatomia'),
  bullet('Overlay: absolute cobrindo a navbar, fundo branco, fade-in de 150ms'),
  bullet('Botao X a esquerda (20px, gray-500) fecha e limpa a busca'),
  bullet('Input: fundo gray-100/80, borda transparente, rounded-full, texto 14px; no foco vira fundo branco com anel brand-primary a 20%'),
  bullet('Sugestoes: dropdown branco rounded-2xl com sombra, ate 5 itens com thumbnail 40px, titulo em ate 1 linha e tipo (TREINAMENTO/TRILHA) em 10px caixa alta'),
  h3('Logica'),
  bullet('A busca dispara com 2+ caracteres; filtra por titulo e descricao'),
  bullet('Palavras-chave "treinamento"/"curso" filtram so cursos; "trilha" filtra so trilhas'),
  bullet('Clique fora do overlay fecha e limpa tudo'),
  printPH('Overlay de busca aberto com sugestoes'),
  pageBreak(),
);

// ════════════════════ 6. SIDEBAR ════════════════════
children.push(
  h1('6. Sidebar de vitrines'),
  p('Painel lateral esquerdo para trocar de vitrine. Estrutura em arvore com acordeoes que abrem no proprio lugar (sem trocar de tela): Categoria > Subcategoria > Vitrine.'),
  h3('Container'),
  makeTable(
    ['Propriedade', 'Valor'],
    [
      ['Largura', '288px (w-72)'],
      ['Fundo', 'Branco, borda direita gray-100'],
      ['Camada', 'z-60 (backdrop em z-55)'],
      ['Backdrop', 'Preto 40% + blur leve; clique fecha'],
      ['Animacao de abrir/fechar', 'Desliza no eixo X com mola: damping 30, stiffness 300'],
      ['Header', 'Altura 56px: logo (28px, clique volta ao Explorar) + botao X de 36px em circulo gray-100, active:scale-95'],
    ],
    [3200, 5826],
  ),
  spacer(),
  h3('Hierarquia de niveis'),
  makeTable(
    ['Nivel', 'Altura', 'Fonte', 'Extras'],
    [
      ['Label "VITRINES"', '-', '13px gray-500 CAIXA ALTA', 'Mesmo padrao dos labels de secao do perfil'],
      ['Categoria', 'min. 48px', '15px semibold', 'Pill contador 22x20px (11px) + chevron 16px #C7C7CC que gira 90 graus'],
      ['Subcategoria', 'min. 44px', '14px medium', 'Pill 20x18px (10px) + chevron 14px'],
      ['Vitrine (folha)', 'min. 44px', '14px medium', 'Bolinha 8px + nome + check quando ativa'],
    ],
    [1900, 1400, 2300, 3426],
  ),
  spacer(),
  h3('Estados'),
  makeTable(
    ['Estado', 'Visual'],
    [
      ['Categoria fechada que CONTEM a vitrine ativa', 'Texto brand-primary + fundo brand-primary a 5% + pill colorida'],
      ['Categoria aberta', 'Texto gray-900 + fundo gray-50'],
      ['Vitrine ativa', 'Fundo brand-primary a 10%, texto brand-primary, bolinha colorida, barra de 3px na borda esquerda, check de 16px'],
      ['Vitrine inativa', 'Texto gray-500, bolinha gray-300'],
      ['Toque (qualquer nivel)', 'active:bg-gray-100 (ou tint da marca quando ja destacado)'],
    ],
    [4200, 4826],
  ),
  spacer(),
  h3('Microinteracoes e logica'),
  bullet('Expansao do acordeao: altura anima de 0 a auto em 220ms ease-out (subniveis em 180ms)'),
  bullet('Chevron gira 0 → 90 graus em 180ms junto com a expansao'),
  bullet('Linha-guia vertical de 1px gray-100 nos niveis expandidos (recuo de 14px + padding 6px) para leitura da arvore'),
  bullet('Apenas UMA categoria aberta por vez; abrir outra fecha a anterior (e fecha o subnivel aberto)'),
  bullet('Ao abrir a sidebar, a categoria que contem a vitrine ativa ja vem expandida automaticamente'),
  bullet('Selecionar uma vitrine fecha a sidebar inteira'),
  bullet('Fechar: deslizar para a esquerda (swipe > 60px), tecla Escape, clique no backdrop ou no X'),
  bullet('Se a janela passar de 1024px, a sidebar fecha sozinha (em desktop nao existe)'),
  printPH('Sidebar fechada, com categoria expandida e com vitrine ativa selecionada (3 prints)'),
  pageBreak(),
);

// ════════════════════ 7. MENU DE PERFIL ════════════════════
children.push(
  h1('7. Menu de perfil (ProfileScreen)'),
  p('Tela cheia que abre ao tocar no avatar. E o centro de conta do usuario: identidade, troca de portal, atalho de chat, areas pessoais e configuracoes. Estilo iOS Ajustes: fundo #F2F2F7, secoes com label, cards brancos com rows.'),
  h3('Comportamento de abertura'),
  bullet('Desliza da direita para a esquerda cobrindo a tela inteira (z-90), com mola: damping 28, stiffness 280'),
  bullet('Enquanto aberta, o scroll do body fica travado'),
  bullet('Fecha com: botao Voltar, tecla Escape ou swipe da esquerda para a direita (> 60px)'),
  h3('Header iOS'),
  bullet('Altura 44px, fundo branco, borda inferior gray-200'),
  bullet('Esquerda: ChevronLeft 20px + "Voltar" 17px, ambos brand-primary'),
  bullet('Centro: titulo "Perfil" 17px semibold gray-900'),
  bullet('Direita: sino (Bell 20px) com badge brand-primary mostrando o total de nao lidas; area de toque 44x44px; abre a tela de Notificacoes'),
  h3('Card de identidade'),
  bullet('Card branco rounded-2xl, padding 16px, logo abaixo do header'),
  bullet('Avatar 56px redondo + nome 17px semibold + e-mail 13px gray-500 truncado'),
  bullet('Perfil atual ("Aluno") em 13px semibold brand-primary logo abaixo do e-mail'),
  bullet('A direita: medalha Award 20px ambar + pontos do usuario em 12px semibold ("1.324 pts")'),
  h3('Secao PORTAL (troca de portal/cliente)'),
  p('Primeira secao abaixo do card — troca de contexto e a decisao mais importante da tela. Padrao acordeao:'),
  bullet('Row fechada (min. 62px): quadrado 36px rounded-xl com as INICIAIS do portal na cor dele + nome do portal 15px medium + hint "Toque para trocar de portal" 12px gray-400 + chevron que gira 90 graus'),
  bullet('Lista aberta: rows de 52px, sigla 32px rounded-lg, nome 15px; o ativo ganha texto brand-primary, fundo brand-primary a 4% e check com traco grosso (strokeWidth 3)'),
  bullet('Selecionar fecha o acordeao sozinho e atualiza a row'),
  makeTable(
    ['Portal', 'Sigla', 'Cor da sigla'],
    [
      ['Lector Suporte', 'LS', 'laranja (orange-50 fundo / orange-600 texto)'],
      ['ESMP', 'ES', 'azul (blue-50 / blue-600)'],
      ['CIGAM', 'CG', 'roxo (purple-50 / purple-600)'],
      ['Unimed Volta Redonda', 'UV', 'verde (emerald-50 / emerald-600)'],
      ['Sicoob', 'SI', 'teal (teal-50 / teal-600)'],
      ['Grupo Digicon', 'GD', 'cinza (slate-100 / slate-600)'],
    ],
    [3200, 1200, 4626],
  ),
  spacer(),
  h3('Demais secoes (na ordem)'),
  bullet('Atalho: row "Chat" (icone MessageSquare) — abre a tela de chat'),
  bullet('MINHA AREA: Meus Treinamentos, Minhas Trilhas, Minhas Habilidades, Meus Certificados, Meu Calendario, Minhas Compras (esta navega para a pagina de compras e fecha o perfil)'),
  bullet('CONTA: Selecionar perfil (acordeao Aluno/Administrador, mesmo padrao do portal), Alterar idioma (acordeao com Portugues/English/Espanol, trigger de 2 andares mostrando o idioma atual), Instalar app'),
  bullet('SUPORTE: Validar certificado (abre a tela de validacao), Ver glossario'),
  bullet('Sair: row vermelha (texto red-500, icone red-400), sem chevron'),
  h3('Anatomia da row padrao (ProfileRow)'),
  bullet('Altura minima 52px, padding horizontal 16px, gap 12px'),
  bullet('Icone 18px gray-400 + label 15px gray-900 + (valor opcional 15px gray-400) + chevron 16px #C7C7CC'),
  bullet('Toque: active:bg-gray-100'),
  bullet('Divisor entre rows: 1px gray-100 com recuo de 46px (alinha com o texto, nao com o icone — detalhe classico do iOS)'),
  printPH('Menu de perfil completo (scroll inteiro em 2 prints)'),
  printPH('Acordeao de portal aberto + acordeao de idioma aberto'),
  pageBreak(),
);

// ════════════════════ 8. NOTIFICAÇÕES ════════════════════
children.push(
  h1('8. Notificacoes (NotificationsScreen)'),
  p('Abre pelo sino no header do perfil. Ocupa a tela abaixo da navbar (top-14, z-95) e desliza da direita com a mesma mola das outras telas.'),
  h3('Header'),
  bullet('Mesmo header iOS de 44px: "Voltar" a esquerda (brand-primary), titulo "Notificacoes" centralizado'),
  h3('Agrupamento'),
  bullet('Grupo "HOJE": notificacoes nao lidas'),
  bullet('Grupo "ANTERIORES": notificacoes ja lidas'),
  bullet('Grupos vazios nao aparecem'),
  h3('Anatomia da notificacao (row em card agrupado)'),
  bullet('Card branco rounded-2xl com divisores de recuo 68px'),
  bullet('Icone em circulo de 40px com cor por tipo (tone)'),
  bullet('Titulo 15px: semibold se nao lida, medium se lida'),
  bullet('Horario 12px gray-400 alinhado a direita do titulo'),
  bullet('Descricao 13px gray-500 em ate 2 linhas'),
  bullet('Coluna direita: bolinha 8px brand-primary (so nao lidas) + chevron #C7C7CC'),
  bullet('Toque: active:bg-gray-100'),
  makeTable(
    ['Tone', 'Fundo', 'Icone', 'Exemplo de uso'],
    [
      ['primary', 'brand-primary 10%', 'brand-primary', 'Novo treinamento disponivel (icone Play)'],
      ['emerald', 'emerald-50', 'emerald-600', 'Certificado validado (CheckCircle)'],
      ['blue', 'blue-50', 'blue-600', 'Lembrete de calendario (Calendar)'],
      ['amber', 'amber-50', 'amber-500', 'Conquista / pontos (Award)'],
    ],
    [1600, 2300, 2300, 2826],
  ),
  spacer(),
  printPH('Tela de notificacoes com grupos Hoje e Anteriores'),
  pageBreak(),
);

// ════════════════════ 9. CHAT ════════════════════
children.push(
  h1('9. Chat (ChatScreen)'),
  p('Tela de mensagens com duas visoes: a lista de conversas e a conversa aberta. A navegacao entre elas e um "push" estilo iOS: a lista desliza um pouco para a esquerda (-30%) enquanto a conversa entra da direita (100% → 0), ambas com mola damping 28 / stiffness 280.'),
  h2('9.1 Lista de conversas'),
  h3('Topo'),
  bullet('Titulo grande "Chat" 28px bold + botao redondo branco de 36px com Plus brand-primary (atalho para a aba Usuarios)'),
  bullet('Segmented control iOS: container gray-200/70 rounded-lg com padding 2px; segmentos de 32px de altura, 13px semibold; o ativo ganha fundo branco + sombra leve, o inativo fica gray-500'),
  bullet('Busca: input branco rounded-xl de 40px com icone Search 16px; placeholder muda conforme a aba ("Buscar conversa" / "Buscar usuario")'),
  h3('Row de conversa'),
  makeTable(
    ['Elemento', 'Especificacao'],
    [
      ['Avatar', '48px redondo; grupos usam circulo brand-primary 10% com icone Users'],
      ['Bolinha online', '12px emerald-500 com anel branco de 2px, canto inferior direito do avatar'],
      ['Nome', '15px; semibold se ha nao lidas, medium se nao'],
      ['Preview', '13px truncado; prefixo "Voce: " nas suas mensagens; "Anexo · nome" para arquivos; gray-700 medium quando ha nao lidas'],
      ['Hora', '12px; brand-primary semibold quando ha nao lidas, gray-400 normal'],
      ['Badge', 'Pill brand-primary min. 18px, numero 11px semibold branco'],
      ['Divisor', '1px gray-100 com recuo de 76px'],
    ],
    [2200, 6826],
  ),
  spacer(),
  h3('Aba Usuarios'),
  bullet('Label "DISPONIVEIS" + card com rows: avatar 48px + nome 15px + cargo 13px + icone MessageSquare gray-300'),
  bullet('Tocar num usuario abre a conversa direto (cria uma vazia se nao existir)'),
  h2('9.2 Conversa aberta'),
  h3('Header (52px, branco, borda inferior)'),
  bullet('ChevronLeft 24px brand-primary volta para a lista (zera o contador de nao lidas da conversa)'),
  bullet('Avatar 36px + nome 15px semibold + status 11px: "Online agora" em verde, cargo em cinza, ou lista de membros no grupo'),
  bullet('MoreHorizontal 20px gray-400 a direita (menu futuro)'),
  h3('Area de mensagens'),
  bullet('Pill de data centralizada ("Hoje"): 11px gray-500 sobre gray-200/70 rounded-full'),
  bullet('Bolha: largura max. 78%, padding 14x8px, texto 15px'),
  bullet('Enviada: fundo brand-primary, texto branco, rounded-2xl com canto inferior DIREITO de 6px (rounded-br-md)'),
  bullet('Recebida: fundo branco, texto gray-900, canto inferior ESQUERDO de 6px'),
  bullet('Espacamento: 4px entre bolhas do mesmo lado, 10px quando troca de lado'),
  bullet('Hora 10px dentro da bolha (branco 70% ou gray-400) + CheckCheck 12px nas enviadas (confirmacao de leitura)'),
  bullet('Grupos: nome do autor 11px semibold acima da primeira bolha de cada sequencia, com cor propria por pessoa (azul, rosa, roxo, teal)'),
  bullet('Anexo: bolha com quadrado 36px rounded-xl (Paperclip) + nome do arquivo 14px + tamanho 11px'),
  bullet('Auto-scroll para a ultima mensagem ao abrir e ao enviar'),
  h3('Barra de envio'),
  bullet('Fundo branco com borda superior, padding 12x10px'),
  bullet('Botao Paperclip 36px gray-400 (anexos)'),
  bullet('Input: gray-100 rounded-full, 36px de altura, 15px; Enter envia'),
  bullet('Botao enviar: circulo 36px brand-primary com icone Send branco 16px; desabilitado a 40% quando vazio; whileTap scale 0.9 com mola stiffness 400'),
  h3('Logica'),
  bullet('Abrir uma conversa zera as nao lidas dela'),
  bullet('O preview e a hora da lista vem SEMPRE da ultima mensagem real (atualiza ao enviar)'),
  bullet('Fechar o chat (pela navbar) reseta: volta para a lista, aba Conversas, busca limpa'),
  printPH('Lista de conversas + aba Usuarios'),
  printPH('Conversa aberta com bolhas, anexo e grupo com autores coloridos'),
  pageBreak(),
);

// ════════════════════ 10. CERTIFICADO ════════════════════
children.push(
  h1('10. Validar certificado (CertificadoScreen)'),
  p('Tela para conferir a autenticidade de um certificado pelo codigo. Abre pela row "Validar certificado" no perfil; ocupa a area abaixo da navbar (top-14, z-95). Em modo demonstracao, ja abre com um resultado valido preenchido.'),
  h3('Secao CODIGO DO CERTIFICADO'),
  bullet('Card com input de 52px, texto 15px, ate 32 caracteres (convertidos para maiusculas automaticamente)'),
  bullet('Placeholder: "Ex: A1B2-C3D4-E5F6..."'),
  bullet('Botao de limpar: circulo 20px gray-300 com X branco, aparece so com texto digitado'),
  bullet('Abaixo do card: contador "N/32 caracteres" em 12px gray-400'),
  bullet('Row de acao "Verificar autenticidade": icone Shield 18px gray-400 + texto 15px semibold brand-primary + chevron; desabilitada a 40% sem codigo'),
  bullet('Durante a verificacao (1,4s): spinner de 18px girando (borda gray-300 com topo brand-primary, 750ms por volta) + texto "Verificando..." gray-400'),
  h3('Resultado valido'),
  bullet('Entra com mola (y: 16 → 0) apos a verificacao'),
  bullet('Header da secao: label "INFORMACOES DO CERTIFICADO" + badge pill "Valido" (emerald-50 fundo, emerald-600 texto, check 12px)'),
  bullet('Card 1 — Informacoes: Usuario, Treinamento, Turma, Data de conclusao (label 13px gray-400 com largura fixa de 128px + valor 13px medium alinhado a direita)'),
  bullet('Card 2 — DETALHES: Data e Conteudo programatico; Aproveitamento em emerald-600 semibold ("100,00%") com o nome do curso abaixo em 12px gray-400'),
  bullet('Card 3 — Acoes: rows "Salvar certificado" (Download) e "Imprimir certificado" (Printer), padrao de row iOS'),
  h3('Resultado invalido'),
  bullet('Card com circulo 28px red-100 + AlertCircle red-500, titulo "Codigo nao encontrado" 15px semibold red-500 e dica "Verifique o codigo e tente novamente" 12px gray-400'),
  h3('Rodape institucional (dentro do scroll)'),
  bullet('Gradiente vertical #041433 → #08204D, texto branco, padding 24x32px'),
  bullet('Quadrado branco 32px com "L" + "LECTOR" em bold tracking-wider'),
  bullet('Tagline 12px gray-400, divisor branco 10%, copyright 11px e idioma com icone Globe'),
  h3('Logica (demo)'),
  bullet('Mock: codigo com 8+ caracteres = valido; menos = invalido; 1,4s de loading simulado'),
  bullet('Digitar invalida o resultado atual (volta ao estado padrao); fechar a tela reseta tudo'),
  printPH('Tela completa: input + resultado valido + acoes + rodape azul'),
  printPH('Estado de erro (codigo nao encontrado)'),
  pageBreak(),
);

// ════════════════════ 11. RODAPÉ ════════════════════
children.push(
  h1('11. Rodape institucional (Footer da vitrine)'),
  p('No fim da vitrine principal. Mesmo gradiente azul institucional (#041433 → #08204D).'),
  bullet('4 colunas no desktop (empilha no mobile): marca + redes sociais, Plataforma, Legal, Newsletter'),
  bullet('Links gray-400 com hover para branco'),
  bullet('Newsletter: input translucido branco 5% + botao brand-primary'),
  bullet('Barra final: copyright e idioma em 12px gray-500'),
  printPH('Rodape completo da vitrine'),
  pageBreak(),
);

// ════════════════════ 12. ANIMAÇÕES ════════════════════
children.push(
  h1('12. Animacoes e microinteracoes (tabela mestre)'),
  p('Todas as animacoes do app em um lugar so. Regra geral: transicoes de 150 a 300ms; molas para entradas de tela; nada decorativo.'),
  makeTable(
    ['O que', 'Tipo', 'Valores'],
    [
      ['Telas internas (perfil, chat, notificacoes, certificado)', 'Mola (spring), eixo X', 'damping 28, stiffness 280; entra de x:100%, sai para x:100%'],
      ['Sidebar', 'Mola, eixo X', 'damping 30, stiffness 300; entra de x:-100%'],
      ['Backdrop da sidebar', 'Fade', '200ms'],
      ['Push interno do chat (lista ↔ conversa)', 'Mola dupla', 'Lista: x 0 ↔ -30% com fade leve; conversa: x 100% ↔ 0'],
      ['Acordeoes (sidebar, perfil, portal, idioma)', 'Altura', '0 → auto, 220ms ease-out (subniveis 180ms)'],
      ['Chevron de acordeao', 'Rotacao', '0 → 90 graus, 180ms (subniveis 150ms)'],
      ['Toque em rows', 'Cor de fundo', 'active:bg-gray-100, transition-colors 150ms'],
      ['Botao enviar (chat)', 'Escala no toque', 'whileTap scale 0.9, mola stiffness 400 damping 20'],
      ['Botoes de acao (CTA)', 'Escala no toque', 'whileTap scale 0.97'],
      ['Avatar da navbar', 'Escala no toque', 'active:scale-95, 150ms'],
      ['Spinner de loading', 'Rotacao continua', '360 graus em 750ms, linear, infinito'],
      ['Cards de resultado (certificado, notificacoes)', 'Entrada', 'opacity 0→1 + y 16→0, mola damping 26 stiffness 300'],
      ['Overlay de busca', 'Fade', '150ms'],
      ['Underline da tab desktop', 'Posicao', 'Acompanha a tab ativa'],
    ],
    [3400, 2000, 3626],
  ),
  spacer(),
  h3('Regras de toque (CSS global)'),
  bullet('-webkit-tap-highlight-color: transparent em todos os botoes e links — o flash nativo do navegador e desligado; o feedback vem dos estados active: desenhados'),
  bullet('touch-action: manipulation — elimina o atraso de 300ms do toque em navegadores mobile'),
  pageBreak(),
);

// ════════════════════ 13. ACESSIBILIDADE ════════════════════
children.push(
  h1('13. Toque e acessibilidade'),
  bullet('Alvo de toque minimo: 44x44px (Apple HIG). Rows de cards tem 52px; categorias da sidebar 48px; subniveis 44px'),
  bullet('Todo elemento interativo tem feedback visivel em ate 100ms (estados active:)'),
  bullet('Estado nunca e comunicado SO por cor: item ativo tem cor + check; notificacao nao lida tem bolinha + peso de fonte; certificado valido tem badge com icone'),
  bullet('Botoes so de icone levam aria-label (ex.: sino com contagem de nao lidas)'),
  bullet('Acordeoes de selecao usam aria-pressed no item ativo'),
  bullet('Escape fecha sidebar e telas internas; swipe lateral tambem (consistente com o gesto de voltar do iOS)'),
  bullet('Contraste: textos principais gray-900 sobre branco; secundarios gray-500 no minimo; texto branco apenas sobre cores escuras ou de marca'),
  bullet('Inputs com altura >= 40px e fonte >= 15px (evita zoom automatico do iOS)'),
  pageBreak(),
);

// ════════════════════ 14. RESPONSIVIDADE ════════════════════
children.push(
  h1('14. Responsividade e camadas'),
  h3('Breakpoint principal'),
  bullet('lg = 1024px. Abaixo: experiencia mobile (hamburger, telas cheias, busca em overlay). Acima: tabs, mega menu, dropdowns'),
  bullet('Telas internas mobile levam lg:hidden — em desktop elas simplesmente nao existem'),
  bullet('A sidebar fecha sozinha se a janela crescer alem de 1024px'),
  h3('Pilha de camadas (z-index)'),
  makeTable(
    ['Camada', 'z-index', 'Observacao'],
    [
      ['Navbar (Topbar)', '50', 'Sempre visivel'],
      ['Backdrop da sidebar', '55', 'Sobre a navbar'],
      ['Sidebar', '60', ''],
      ['Menu de perfil', '90', 'Cobre a tela inteira (inclusive navbar)'],
      ['Chat / Notificacoes / Certificado', '95', 'Comecam abaixo da navbar (top-14) — a navbar continua clicavel'],
    ],
    [3200, 1400, 4426],
  ),
  spacer(),
  h3('Posicionamento das telas internas'),
  bullet('ProfileScreen: fixed inset-0 (cobre tudo, tem header proprio com Voltar)'),
  bullet('Chat, Notificacoes e Certificado: fixed top-14 (deixam a navbar visivel — hamburger, logo e avatar continuam funcionando como navegacao global)'),
  h3('Armadilha conhecida (importante!)'),
  p('Nunca renderizar uma tela fixed dentro de um elemento com transform (ex.: dentro de um motion.div animado): o fixed passa a se posicionar em relacao ao elemento transformado, nao a janela. Por isso TODAS as telas internas sao renderizadas no nivel do Topbar, como irmas do header, nunca aninhadas.'),
  p('Pelo mesmo motivo, componentes nunca sao definidos DENTRO de outro componente (o React recria o tipo a cada render e desmonta a arvore — ja causou travamento de inputs no projeto). Todo componente vive no nivel do modulo e recebe estado por props.'),
  pageBreak(),
);

// ════════════════════ 15. NAVEGAÇÃO E ESTADOS ════════════════════
children.push(
  h1('15. Navegacao e regras de estado'),
  p('O Topbar e o dono dos estados das telas internas. Sao quatro booleans: isProfileScreenOpen, isChatOpen, isNotificationsOpen, isCertificadoOpen.'),
  h3('Fluxos de abertura'),
  bullet('Avatar → abre Perfil'),
  bullet('Perfil → row Chat → fecha Perfil e abre Chat'),
  bullet('Perfil → sino → fecha Perfil e abre Notificacoes'),
  bullet('Perfil → Validar certificado → fecha Perfil e abre Certificado'),
  h3('Regras de exclusividade'),
  bullet('Apenas UMA tela interna aberta por vez. Abrir uma fecha a anterior'),
  bullet('Hamburger, logo e avatar fecham TODAS as telas internas antes de agir'),
  bullet('Fechar uma tela sempre reseta o estado interno dela (busca, codigo digitado, conversa aberta...)'),
  h3('Rotas da SPA'),
  makeTable(
    ['Rota', 'Pagina'],
    [
      ['/', 'Vitrine principal (App)'],
      ['/treinamento/:id', 'Tela de treinamento'],
      ['/trilha e /trilha/:id', 'Tela de trilha'],
      ['/trilha/finalizar2', 'Finalizacao de trilha'],
      ['/showcase', 'Showcase de componentes'],
    ],
    [3600, 5426],
  ),
  spacer(),
  p('Na Vercel, todas as rotas reescrevem para index.html (vercel.json) — sem isso, abrir uma rota direto pela URL daria 404.'),
  pageBreak(),
);

// ════════════════════ 16. CHECKLIST ════════════════════
children.push(
  h1('16. Checklist para criar uma tela nova'),
  p('Use esta lista sempre que for adicionar uma tela interna nova ao app:'),
  bullet('Fundo #F2F2F7, conteudo com margem lateral de 16px'),
  bullet('Componente definido no nivel do modulo (nunca dentro de outro componente)'),
  bullet('Renderizada como irma do header no Topbar, com estado proprio (isXOpen)'),
  bullet('fixed top-14 + z-95 se a navbar deve continuar visivel; fixed inset-0 + z-90 com header proprio se cobre tudo'),
  bullet('Entrada/saida com mola damping 28 / stiffness 280 no eixo X'),
  bullet('Secoes: label 13px gray-500 CAIXA ALTA + card branco rounded-2xl'),
  bullet('Rows de 52px (62px com subtitulo), icone 18px gray-400, texto 15px, chevron #C7C7CC, divisor gray-100 com recuo'),
  bullet('Estados active: em tudo que e tocavel; alvo minimo de 44px'),
  bullet('Cor de marca SEMPRE via brand-primary (nunca hex chumbado) para o tema por cliente funcionar'),
  bullet('Hamburger, logo e avatar do Topbar precisam fechar a tela nova tambem'),
  bullet('Fechar reseta o estado interno; Escape e swipe funcionam'),
  bullet('Rodar npm run build antes de subir'),
);

// ── Pós-processamento: parágrafo entre tabelas adjacentes ──
const finalChildren = [];
for (let i = 0; i < children.length; i++) {
  finalChildren.push(children[i]);
  if (children[i] instanceof Table && children[i + 1] instanceof Table) {
    finalChildren.push(spacer());
  }
}

// ── Documento ──────────────────────────────────────────────
const doc = new Document({
  styles: {
    default: { document: { run: { font: 'Arial', size: 22 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 34, bold: true, font: 'Arial', color: '041433' },
        paragraph: { spacing: { before: 280, after: 200 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 28, bold: true, font: 'Arial', color: '08204D' },
        paragraph: { spacing: { before: 220, after: 160 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 24, bold: true, font: 'Arial', color: '333333' },
        paragraph: { spacing: { before: 180, after: 120 }, outlineLevel: 2 } },
    ],
  },
  numbering: {
    config: [
      { reference: 'bullets',
        levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 }, // A4
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: 'Vitrine Mobile Lector — Design System    |    Pagina ', size: 18, color: '888888' }),
            new TextRun({ children: [PageNumber.CURRENT], size: 18, color: '888888' }),
          ],
        })],
      }),
    },
    children: finalChildren,
  }],
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('docs/Design-System-Vitrine-Mobile-Lector.docx', buffer);
  console.log('OK: docs/Design-System-Vitrine-Mobile-Lector.docx');
});
