// @ts-nocheck
/**
 * GameData.ts — Dados Pedagógicos de cada jogo do Komunic Alfa
 * Estrutura baseada no Documento Técnico Pedagógico (BNCC, PNE, ODS 4)
 */

export interface GameMetadata {
  id: string;
  titulo: string;
  emoji: string;
  categoria: string;
  modulo: string;
  nivel: number;
  idade: string;
  bncc: string[];
  competencias: { emoji: string; label: string; color: string }[];
  objetivo: string;
  descricao: string;
  pontuacao: number;
  recompensa: string;
  audio: boolean;
  animacao: boolean;
  inclusao: string;
  hudColor: string[];
}

export const GAME_METADATA: Record<string, GameMetadata> = {

  letras: {
    id: 'KMK-0001',
    titulo: 'Vila das Letras',
    emoji: '🔤',
    categoria: 'Consciência Fonológica',
    modulo: 'Alfabetização',
    nivel: 1,
    idade: '4–6 anos',
    bncc: ['EI03EF03', 'EI03EF09'],
    objetivo: 'Identificar a letra inicial de palavras simples',
    descricao: 'A criança ouve e vê uma palavra com imagem e escolhe com qual letra ela começa!',
    competencias: [
      { emoji: '🗣️', label: 'Linguagem Oral',       color: '#FF6B6B' },
      { emoji: '👁️', label: 'Percepção Visual',     color: '#4D96FF' },
      { emoji: '🧠', label: 'Memória',               color: '#B983FF' },
      { emoji: '⚡', label: 'Atenção',               color: '#FFC312' },
      { emoji: '🔤', label: 'Consciência Fonológica', color: '#12CBC4' },
    ],
    pontuacao: 10,
    recompensa: '⭐ Estrela',
    audio: true,
    animacao: true,
    inclusao: 'Suporte a Libras e áudio descritivo',
    hudColor: ['#8E44AD', '#C44569', '#FF6B6B'],
  },

  vogais: {
    id: 'KMK-0002',
    titulo: 'Jardim das Vogais',
    emoji: '🌺',
    categoria: 'Consciência Fonológica',
    modulo: 'Alfabetização',
    nivel: 1,
    idade: '4–5 anos',
    bncc: ['EI03EF03', 'EI03EF07'],
    objetivo: 'Completar palavras com a vogal que falta',
    descricao: 'A criança vê uma imagem e uma palavra incompleta e escolhe a vogal correta para completá-la!',
    competencias: [
      { emoji: '🌺', label: 'Consciência Fonológica', color: '#12CBC4' },
      { emoji: '👁️', label: 'Percepção Visual',       color: '#4D96FF' },
      { emoji: '🧠', label: 'Memória',                 color: '#B983FF' },
      { emoji: '✍️', label: 'Pré-Escrita',             color: '#6BCB77' },
    ],
    pontuacao: 10,
    recompensa: '🌸 Flor',
    audio: true,
    animacao: true,
    inclusao: 'Suporte a Libras e narração em áudio',
    hudColor: ['#009432', '#12CBC4', '#4D96FF'],
  },

  silabas: {
    id: 'KMK-0003',
    titulo: 'Vale das Sílabas',
    emoji: '🧩',
    categoria: 'Consciência Silábica',
    modulo: 'Alfabetização',
    nivel: 2,
    idade: '5–7 anos',
    bncc: ['EI03EF04', 'EI03EF09'],
    objetivo: 'Identificar e completar sílabas faltantes em palavras',
    descricao: 'A criança divide palavras em pedacinhos (sílabas) e escolhe o pedaço que está faltando!',
    competencias: [
      { emoji: '🧩', label: 'Consciência Silábica',  color: '#FFC312' },
      { emoji: '🗣️', label: 'Linguagem Oral',         color: '#FF6B6B' },
      { emoji: '🧠', label: 'Memória',                color: '#B983FF' },
      { emoji: '⚡', label: 'Atenção',                color: '#4D96FF' },
      { emoji: '🎵', label: 'Ritmo e Cadência',       color: '#12CBC4' },
    ],
    pontuacao: 15,
    recompensa: '🏅 Medalha',
    audio: true,
    animacao: true,
    inclusao: 'Narração de cada sílaba com áudio',
    hudColor: ['#FFC312', '#F79F1F', '#EE5A24'],
  },

  rimas: {
    id: 'KMK-0004',
    titulo: 'Oficina de Rimas',
    emoji: '🎵',
    categoria: 'Consciência Fonológica',
    modulo: 'Alfabetização',
    nivel: 2,
    idade: '4–6 anos',
    bncc: ['EI03EF05', 'EI03EF06'],
    objetivo: 'Identificar palavras que rimam',
    descricao: 'A criança ouve uma palavra e escolhe outra que termina com o mesmo som — isso é rima!',
    competencias: [
      { emoji: '🎵', label: 'Ritmo e Rima',           color: '#12CBC4' },
      { emoji: '🗣️', label: 'Linguagem Oral',          color: '#FF6B6B' },
      { emoji: '👂', label: 'Percepção Auditiva',      color: '#6BCB77' },
      { emoji: '🧠', label: 'Memória',                 color: '#B983FF' },
      { emoji: '🎨', label: 'Criatividade',            color: '#FFC312' },
    ],
    pontuacao: 10,
    recompensa: '🎶 Nota Musical',
    audio: true,
    animacao: true,
    inclusao: 'Animação visual e reforço sonoro',
    hudColor: ['#12CBC4', '#1289A7', '#4D96FF'],
  },

  palavras: {
    id: 'KMK-0005',
    titulo: 'Floresta das Palavras',
    emoji: '🌳',
    categoria: 'Leitura Inicial',
    modulo: 'Alfabetização',
    nivel: 2,
    idade: '5–7 anos',
    bncc: ['EI03EF08', 'EI03EF09'],
    objetivo: 'Associar palavras escritas às imagens correspondentes',
    descricao: 'A criança lê uma palavra e escolhe a imagem certa entre três opções!',
    competencias: [
      { emoji: '📖', label: 'Leitura Inicial',         color: '#B983FF' },
      { emoji: '👁️', label: 'Percepção Visual',        color: '#4D96FF' },
      { emoji: '🧠', label: 'Memória',                  color: '#FFC312' },
      { emoji: '💭', label: 'Pensamento Lógico',        color: '#6BCB77' },
    ],
    pontuacao: 20,
    recompensa: '📚 Livro',
    audio: true,
    animacao: true,
    inclusao: 'Áudio da palavra e suporte a Libras',
    hudColor: ['#B983FF', '#8649CB', '#4D96FF'],
  },

  frases: {
    id: 'KMK-0006',
    titulo: 'Vila das Frases',
    emoji: '📚',
    categoria: 'Compreensão de Leitura',
    modulo: 'Letramento',
    nivel: 3,
    idade: '6–8 anos',
    bncc: ['EF01LP08', 'EF01LP09'],
    objetivo: 'Completar frases simples com a palavra correta',
    descricao: 'A criança lê uma frase com uma lacuna e escolhe a palavra que faz sentido para completá-la!',
    competencias: [
      { emoji: '📝', label: 'Compreensão Textual',     color: '#EE5A24' },
      { emoji: '🗣️', label: 'Linguagem Oral',           color: '#FF6B6B' },
      { emoji: '💭', label: 'Pensamento Lógico',        color: '#6BCB77' },
      { emoji: '🧠', label: 'Memória',                  color: '#B983FF' },
      { emoji: '⚡', label: 'Atenção',                  color: '#FFC312' },
    ],
    pontuacao: 25,
    recompensa: '🏆 Troféu',
    audio: true,
    animacao: true,
    inclusao: 'Leitura em voz alta com destaque visual',
    hudColor: ['#EE5A24', '#C44569', '#8E44AD'],
  },

  formas: {
    id: 'KMK-0007',
    titulo: 'Construtor de Formas',
    emoji: '🏗️',
    categoria: 'Raciocínio Lógico',
    modulo: 'Matemática Lúdica',
    nivel: 1,
    idade: '3–5 anos',
    bncc: ['EI03ET03', 'EI03ET04'],
    objetivo: 'Identificar e ordenar formas geométricas em sequência',
    descricao: 'A criança monta construções seguindo a ordem das formas geométricas mostradas!',
    competencias: [
      { emoji: '📐', label: 'Geometria',               color: '#FFC312' },
      { emoji: '💭', label: 'Pensamento Lógico',       color: '#6BCB77' },
      { emoji: '🎯', label: 'Coordenação',             color: '#4D96FF' },
      { emoji: '⚡', label: 'Atenção',                 color: '#FF6B6B' },
      { emoji: '🔁', label: 'Sequenciamento',          color: '#B983FF' },
    ],
    pontuacao: 5,
    recompensa: '🏗️ Construção',
    audio: true,
    animacao: true,
    inclusao: 'Áudio descritivo de cada forma',
    hudColor: ['#FFC312', '#F79F1F', '#EE5A24'],
  },

  intruso: {
    id: 'KMK-0008',
    titulo: 'Desafio do Intruso',
    emoji: '🕵️',
    categoria: 'Categorização',
    modulo: 'Raciocínio e Lógica',
    nivel: 2,
    idade: '4–7 anos',
    bncc: ['EI03ET02', 'EI03CG05'],
    objetivo: 'Identificar o elemento que não pertence a um grupo',
    descricao: 'A criança olha para 4 imagens e descobre qual não combina com as outras!',
    competencias: [
      { emoji: '🔍', label: 'Pensamento Crítico',      color: '#C44569' },
      { emoji: '💭', label: 'Categorização',           color: '#833471' },
      { emoji: '👁️', label: 'Percepção Visual',        color: '#4D96FF' },
      { emoji: '⚡', label: 'Atenção',                 color: '#FFC312' },
      { emoji: '🧠', label: 'Memória',                 color: '#B983FF' },
    ],
    pontuacao: 10,
    recompensa: '🔍 Lupa',
    audio: true,
    animacao: true,
    inclusao: 'Narração de cada item e feedback sonoro',
    hudColor: ['#C44569', '#8E44AD', '#4D96FF'],
  },

  sombras: {
    id: 'KMK-0009',
    titulo: 'Jogo das Sombras',
    emoji: '👤',
    categoria: 'Percepção Visual',
    modulo: 'Cognição e Criatividade',
    nivel: 1,
    idade: '3–6 anos',
    bncc: ['EI03CG02', 'EI03ET01'],
    objetivo: 'Associar sombras/silhuetas às figuras correspondentes',
    descricao: 'A criança vê uma sombra misteriosa e escolhe qual objeto ou animal ela representa!',
    competencias: [
      { emoji: '👁️', label: 'Percepção Visual',        color: '#4D96FF' },
      { emoji: '🔍', label: 'Atenção aos Detalhes',    color: '#474787' },
      { emoji: '🧠', label: 'Memória Visual',           color: '#B983FF' },
      { emoji: '💭', label: 'Raciocínio Espacial',     color: '#6BCB77' },
    ],
    pontuacao: 10,
    recompensa: '🌟 Estrela Dourada',
    audio: true,
    animacao: true,
    inclusao: 'Narração descritiva e contraste visual alto',
    hudColor: ['#2C2C54', '#474787', '#9C27B0'],
  },

  fonico: {
    id: 'KMK-0010',
    titulo: 'Laboratório dos Sons',
    emoji: '🎤',
    categoria: 'Consciência Fonológica',
    modulo: 'Alfabetização',
    nivel: 1,
    idade: '3–7 anos',
    bncc: ['EI03EF01', 'EI03EF03'],
    objetivo: 'Explorar e memorizar o som de cada letra do alfabeto',
    descricao: 'A criança toca em qualquer letra e ouve o som que ela faz — aprendendo de forma livre e lúdica!',
    competencias: [
      { emoji: '👂', label: 'Percepção Auditiva',      color: '#6BCB77' },
      { emoji: '🎵', label: 'Consciência Fonológica',  color: '#12CBC4' },
      { emoji: '🗣️', label: 'Linguagem Oral',          color: '#FF6B6B' },
      { emoji: '🎨', label: 'Exploração Livre',        color: '#FFC312' },
      { emoji: '🧠', label: 'Memória',                 color: '#B983FF' },
    ],
    pontuacao: 0,
    recompensa: '🎤 Microfone',
    audio: true,
    animacao: true,
    inclusao: 'Suporte a Libras com sinal de cada letra',
    hudColor: ['#B983FF', '#8649CB', '#FF82A9'],
  },

  biblioteca: {
    id: 'KMK-0011',
    titulo: 'A História de Kadu',
    emoji: '📖',
    categoria: 'Letramento Literário',
    modulo: 'Leitura e Literatura',
    nivel: 1,
    idade: '4–8 anos',
    bncc: ['EI03EF07', 'EF01LP27'],
    objetivo: 'Desenvolver o prazer pela leitura e o letramento literário',
    descricao: 'A criança "lê" uma história em páginas ilustradas com emojis, desenvolvendo o amor pelos livros!',
    competencias: [
      { emoji: '📖', label: 'Letramento Literário',    color: '#009432' },
      { emoji: '🧠', label: 'Imaginação',              color: '#B983FF' },
      { emoji: '💭', label: 'Compreensão',             color: '#4D96FF' },
      { emoji: '🗣️', label: 'Vocabulário',             color: '#FF6B6B' },
      { emoji: '❤️', label: 'Vínculo Afetivo',         color: '#C44569' },
    ],
    pontuacao: 5,
    recompensa: '📚 Biblioteca',
    audio: true,
    animacao: false,
    inclusao: 'Leitura em voz alta de cada página',
    hudColor: ['#009432', '#12CBC4', '#4D96FF'],
  },

};
