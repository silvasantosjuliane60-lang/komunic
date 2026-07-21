// @ts-nocheck
import { Colors } from './Colors';

export const TRACKS = [
  {
    id: 1,
    title: 'TRILHA 1: EXPLORADORES (Não-Leitores)',
    subtitle: 'Foco na visão, escuta e lógica! Sem precisar ler.',
    color: ['#4CAF50', '#2E7D32'],
    games: [
      { id: 9, path: '/games/sombras', title: 'JOGO DAS SOMBRAS', color: ['#424242', '#212121'], stars: 0, emoji: '👤' },
      { id: 7, path: '/games/formas', title: 'CASTELO DAS FORMAS', color: ['#FF9800', '#F57C00'], stars: 0, emoji: '🔺' },
      { id: 16, path: '/games/fonico', title: 'ALFABETO FONÊMICO', color: ['#8A2387', '#E94057'], stars: 0, emoji: '🔤' },
      { id: 11, path: '/games/intruso', title: 'DESAFIO DO INTRUSO', color: ['#9C27B0', '#6A1B9A'], stars: 0, emoji: '🕵️' },
      { id: 13, path: '/games/traco?mode=guiada', title: 'DESCOBRINDO AS LETRAS', color: ['#4CAF50', '#1B5E20'], stars: 0, emoji: '✍️' },
      { id: 14, path: '/games/traco?mode=livre', title: 'ESCREVENDO SOZINHO', color: ['#2196F3', '#0D47A1'], stars: 0, emoji: '📝' },
      { id: 17, path: '/games/raciocinio?track=1', title: 'DESAFIO LÓGICO 1', color: ['#3F51B5', '#1A237E'], stars: 0, emoji: '🧠' },
      { id: 21, path: '/games/matematica?track=1', title: 'DESAFIO MATEMÁTICO 1', color: ['#009432', '#12CBC4'], stars: 0, emoji: '🧮' },
      { id: 25, path: '/games/memoria?level=1', title: 'JOGO DA MEMÓRIA 1', color: ['#FF9800', '#F57C00'], stars: 0, emoji: '🎴' },
      { id: 26, path: '/games/cores?level=1', title: 'CAÇADOR DE CORES 1', color: ['#9C27B0', '#6A1B9A'], stars: 0, emoji: '🎨' },
      { id: 27, path: '/games/quebra_cabeca?level=1', title: 'QUEBRA-CABEÇA 1', color: ['#4CAF50', '#2E7D32'], stars: 0, emoji: '🧩' },
    ],
  },
  {
    id: 2,
    title: 'TRILHA 2: CURIOSOS (Primeiros Passos)',
    subtitle: 'Ouvindo os sons, rimando e conhecendo as letras.',
    color: ['#00BCD4', '#0097A7'],
    games: [
      { id: 8, path: '/games/fonico', title: 'LABORATÓRIO DOS SONS', color: ['#8A2387', '#E94057'], stars: 0, emoji: '🎵' },
      { id: 10, path: '/games/rimas', title: 'OFICINA DE RIMAS', color: ['#E91E63', '#C2185B'], stars: 0, emoji: '🛠️' },
      { id: 1, path: '/games/letras', title: 'VILA DAS LETRAS', color: Colors.blueButtonGradient, stars: 3, emoji: '🔤' },
      { id: 2, path: '/games/vogais', title: 'JARDIM DAS VOGAIS', color: Colors.playButtonGradient, stars: 2, emoji: '🌷' },
      { id: 18, path: '/games/raciocinio?track=2', title: 'DESAFIO LÓGICO 2', color: ['#3F51B5', '#1A237E'], stars: 0, emoji: '🧠' },
      { id: 22, path: '/games/matematica?track=2', title: 'DESAFIO MATEMÁTICO 2', color: ['#009432', '#12CBC4'], stars: 0, emoji: '🧮' },
      { id: 28, path: '/games/memoria?level=2', title: 'JOGO DA MEMÓRIA 2', color: ['#FF9800', '#F57C00'], stars: 0, emoji: '🎴' },
      { id: 29, path: '/games/cores?level=2', title: 'CAÇADOR DE CORES 2', color: ['#9C27B0', '#6A1B9A'], stars: 0, emoji: '🎨' },
      { id: 30, path: '/games/quebra_cabeca?level=2', title: 'QUEBRA-CABEÇA 2', color: ['#4CAF50', '#2E7D32'], stars: 0, emoji: '🧩' },
    ],
  },
  {
    id: 3,
    title: 'TRILHA 3: CONSTRUTORES (Formando Palavras)',
    subtitle: 'Juntando pedacinhos para formar palavras inteiras.',
    color: ['#FF9800', '#E65100'],
    games: [
      { id: 3, path: '/games/silabas', title: 'VALE DAS SÍLABAS', color: Colors.orangeButtonGradient, stars: 1, emoji: '🧩' },
      { id: 4, path: '/games/palavras', title: 'FLORESTA DAS PALAVRAS', color: Colors.purpleButtonGradient, stars: 0, emoji: '🌲' },
      { id: 19, path: '/games/raciocinio?track=3', title: 'DESAFIO LÓGICO 3', color: ['#3F51B5', '#1A237E'], stars: 0, emoji: '🧠' },
      { id: 23, path: '/games/matematica?track=3', title: 'DESAFIO MATEMÁTICO 3', color: ['#009432', '#12CBC4'], stars: 0, emoji: '🧮' },
      { id: 31, path: '/games/memoria?level=3', title: 'JOGO DA MEMÓRIA 3', color: ['#FF9800', '#F57C00'], stars: 0, emoji: '🎴' },
      { id: 32, path: '/games/cores?level=3', title: 'CAÇADOR DE CORES 3', color: ['#9C27B0', '#6A1B9A'], stars: 0, emoji: '🎨' },
      { id: 33, path: '/games/quebra_cabeca?level=3', title: 'QUEBRA-CABEÇA 3', color: ['#4CAF50', '#2E7D32'], stars: 0, emoji: '🧩' },
    ],
  },
  {
    id: 4,
    title: 'TRILHA 4: MESTRES (Leitura Fluente)',
    subtitle: 'Lendo frases e histórias de forma independente!',
    color: ['#F44336', '#C62828'],
    games: [
      { id: 5, path: '/games/frases', title: 'VILA DAS FRASES', color: Colors.redButtonGradient, stars: 0, emoji: '💬' },
      { id: 6, path: '/games/biblioteca', title: 'BIBLIOTECA ENCANTADA', color: Colors.blueButtonGradient, stars: 0, emoji: '📚' },
      { id: 20, path: '/games/raciocinio?track=4', title: 'DESAFIO LÓGICO 4', color: ['#3F51B5', '#1A237E'], stars: 0, emoji: '🧠' },
      { id: 24, path: '/games/matematica?track=4', title: 'DESAFIO MATEMÁTICO 4', color: ['#009432', '#12CBC4'], stars: 0, emoji: '🧮' },
    ],
  },
];
