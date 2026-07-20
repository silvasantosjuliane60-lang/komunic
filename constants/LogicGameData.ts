export type LogicGameType = 'sequence' | 'oddOneOut' | 'association' | 'shadowMatch';

export type LogicGameData = {
  instruction: string;
  gameType: LogicGameType;
  items: string[]; // For sequence, oddOneOut, etc.
  options: string[]; // Choices shown to the user
  correctAnswer: string;
};

// 40 challenges across 8 tracks (5 per track)
export const LOGIC_GAMES_DATA: Record<string, LogicGameData[]> = {
  '1': [
    { instruction: 'De qual animal é essa sombra?', gameType: 'shadowMatch', items: ['🐍'], options: ['🐦', '🐄', '🐍', '🦔', '🐖'], correctAnswer: '🐍' },
    { instruction: 'Qual letra completa a sequência?', gameType: 'sequence', items: ['A', 'B', 'C', '?'], options: ['D', 'E', 'F'], correctAnswer: 'D' },
    { instruction: 'Qual não é uma letra?', gameType: 'oddOneOut', items: ['A', 'B', '1', 'C'], options: ['A', 'B', '1', 'C'], correctAnswer: '1' },
    { instruction: 'A de 🍎, C de...', gameType: 'association', items: ['🍎', 'A', '?', 'C'], options: ['🐶', '🚗', '🎈'], correctAnswer: '🐶' },
    { instruction: 'De quem é essa sombra?', gameType: 'shadowMatch', items: ['🚗'], options: ['🎈', '🚗', '✈️', '🚲'], correctAnswer: '🚗' },
  ],
  '2': [
    { instruction: 'Qual vogal está faltando?', gameType: 'sequence', items: ['A', 'E', '?', 'O', 'U'], options: ['I', 'B', 'P'], correctAnswer: 'I' },
    { instruction: 'Qual não é uma vogal?', gameType: 'oddOneOut', items: ['A', 'E', 'Z', 'O', 'U'], options: ['A', 'E', 'Z', 'O'], correctAnswer: 'Z' },
    { instruction: 'E de Elefante, U de...', gameType: 'association', items: ['🐘', 'E', '?', 'U'], options: ['🍇', '🏠', '🍎'], correctAnswer: '🍇' },
    { instruction: 'Complete a ordem das vogais.', gameType: 'sequence', items: ['A', '?', 'I', 'O', 'U'], options: ['E', 'M', 'T'], correctAnswer: 'E' },
    { instruction: 'Sombra da fruta com U?', gameType: 'shadowMatch', items: ['🍇'], options: ['🍎', '🍌', '🍇', '🍉'], correctAnswer: '🍇' },
  ],
  '3': [
    { instruction: 'Qual sílaba NÃO começa com B?', gameType: 'oddOneOut', items: ['BA', 'BE', 'BI', 'ZU', 'BU'], options: ['BA', 'BE', 'BI', 'ZU', 'BU'], correctAnswer: 'ZU' },
    { instruction: 'BA, BE, BI, BO, ...', gameType: 'sequence', items: ['BA', 'BE', 'BI', 'BO', '?'], options: ['BU', 'CA', 'DA'], correctAnswer: 'BU' },
    { instruction: 'BA de Banana, CA de...', gameType: 'association', items: ['🍌', 'BA', '?', 'CA'], options: ['🏠', '🚗', '🐶'], correctAnswer: '🏠' },
    { instruction: 'Qual não pertence ao C?', gameType: 'oddOneOut', items: ['CA', 'CE', 'MA', 'CO', 'CU'], options: ['CA', 'CE', 'MA', 'CO'], correctAnswer: 'MA' },
    { instruction: 'Sombra do objeto com CA?', gameType: 'shadowMatch', items: ['🏠'], options: ['🏠', '🐘', '🍌', '🍇'], correctAnswer: '🏠' },
  ],
  '4': [
    { instruction: 'Cachorro gosta de osso. O Gato gosta de...?', gameType: 'association', items: ['🐶', '🦴', '🐱', '?'], options: ['🥕', '🐟', '🍎'], correctAnswer: '🐟' },
    { instruction: 'Qual não é um animal?', gameType: 'oddOneOut', items: ['GATO', 'CÃO', 'MESA', 'PATO'], options: ['GATO', 'CÃO', 'MESA', 'PATO'], correctAnswer: 'MESA' },
    { instruction: 'De qual animal é essa sombra?', gameType: 'shadowMatch', items: ['🐈'], options: ['🐕', '🐈', '🐘', '🐒'], correctAnswer: '🐈' },
    { instruction: 'MACA_O', gameType: 'sequence', items: ['MA', 'CA', '?'], options: ['CO', 'DO', 'PO'], correctAnswer: 'CO' },
    { instruction: 'Dia de Sol, Noite de...', gameType: 'association', items: ['☀️', 'DIA', '?', 'NOITE'], options: ['🌙', '🌧️', '🌪️'], correctAnswer: '🌙' },
  ],
  '5': [
    { instruction: 'Qual palavra completa a frase: "O macaco come ___"?', gameType: 'association', items: ['O', 'macaco', 'come', '?'], options: ['pedra', 'banana', 'carro'], correctAnswer: 'banana' },
    { instruction: '"A formiga é ___"', gameType: 'association', items: ['A', 'formiga', 'é', '?'], options: ['gigante', 'pequena', 'azul'], correctAnswer: 'pequena' },
    { instruction: 'Qual não faz sentido na frase: "O pássaro ___ no céu"?', gameType: 'oddOneOut', items: ['VOA', 'CANTA', 'NADA', 'PLANEA'], options: ['VOA', 'CANTA', 'NADA'], correctAnswer: 'NADA' },
    { instruction: 'O animal que voa no céu.', gameType: 'shadowMatch', items: ['🐦'], options: ['🐄', '🐦', '🐍', '🐖'], correctAnswer: '🐦' },
    { instruction: 'Eu bebo ___', gameType: 'association', items: ['Eu', 'bebo', '?'], options: ['água', 'pão', 'carro'], correctAnswer: 'água' },
  ],
  '6': [
    { instruction: 'Cai em pé e corre deitada. O que é?', gameType: 'association', items: ['🌧️', '🤔', '🏃'], options: ['Chuva', 'Cobra', 'Rio'], correctAnswer: 'Chuva' },
    { instruction: 'Tem coroa mas não é rei.', gameType: 'association', items: ['👑', '🤔', '🍍'], options: ['Abacaxi', 'Leão', 'Ouro'], correctAnswer: 'Abacaxi' },
    { instruction: 'Sombra da resposta: Tem escamas e não é peixe.', gameType: 'shadowMatch', items: ['🐍'], options: ['🐍', '🐟', '🐦', '🐄'], correctAnswer: '🐍' },
    { instruction: 'O que não se encontra em um livro?', gameType: 'oddOneOut', items: ['Páginas', 'Letras', 'Areia', 'Capa'], options: ['Páginas', 'Letras', 'Areia', 'Capa'], correctAnswer: 'Areia' },
    { instruction: 'Início, Meio, ___', gameType: 'sequence', items: ['Início', 'Meio', '?'], options: ['Fim', 'Antes', 'Nunca'], correctAnswer: 'Fim' },
  ],
  '7': [
    { instruction: 'Sol é para o Dia, assim como a Lua é para a...', gameType: 'association', items: ['Sol', 'Dia', 'Lua', '?'], options: ['Noite', 'Estrela', 'Nuvem'], correctAnswer: 'Noite' },
    { instruction: 'Pássaro é para o Céu, Peixe é para a...', gameType: 'association', items: ['🐦', 'Céu', '🐟', '?'], options: ['Água', 'Terra', 'Fogo'], correctAnswer: 'Água' },
    { instruction: 'O que não pertence ao espaço?', gameType: 'oddOneOut', items: ['Estrela', 'Planeta', 'Cometa', 'Árvore'], options: ['Estrela', 'Planeta', 'Cometa', 'Árvore'], correctAnswer: 'Árvore' },
    { instruction: 'Qual é a sombra de um foguete?', gameType: 'shadowMatch', items: ['🚀'], options: ['🚀', '🛸', '🛰️', '🌎'], correctAnswer: '🚀' },
    { instruction: 'Pequeno, Médio, ___', gameType: 'sequence', items: ['Pequeno', 'Médio', '?'], options: ['Grande', 'Muito', 'Longe'], correctAnswer: 'Grande' },
  ],
  '8': [
    { instruction: 'Qual é o próximo padrão?', gameType: 'sequence', items: ['A1', 'B2', 'C3', '?'], options: ['D4', 'C4', 'E5'], correctAnswer: 'D4' },
    { instruction: 'Complete: 2, 4, 6, ___', gameType: 'sequence', items: ['2', '4', '6', '?'], options: ['7', '8', '9'], correctAnswer: '8' },
    { instruction: 'Qual destes não é uma fruta?', gameType: 'oddOneOut', items: ['Maçã', 'Banana', 'Lápis', 'Uva'], options: ['Maçã', 'Banana', 'Lápis', 'Uva'], correctAnswer: 'Lápis' },
    { instruction: 'De quem é a coroa?', gameType: 'shadowMatch', items: ['👑'], options: ['👑', '💍', '💎', '🏅'], correctAnswer: '👑' },
    { instruction: 'Para frente, para trás, para cima, para ___', gameType: 'association', items: ['Cima', '?'], options: ['Lado', 'Baixo', 'Dentro'], correctAnswer: 'Baixo' },
  ],
};
