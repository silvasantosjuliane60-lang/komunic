export type MathGameType = 'sequence' | 'comparison' | 'counting' | 'size' | 'sizeThree';

export type MathGameData = {
  instruction: string;
  gameType: MathGameType;
  items: string[];       // Para sequence e counting
  leftItems?: string[];  // Para comparison/size - lado esquerdo
  rightItems?: string[]; // Para comparison/size - lado direito
  threeItems?: string[]; // Para sizeThree - 3 itens com tamanhos diferentes
  itemSizes?: number[];  // Para sizeThree - tamanho de fonte de cada item
  options: string[];
  correctAnswer: string;
};

// 40 desafios por 8 trilhas (5 por trilha)
// TRILHA 1: Para não-leitores! Só visual, sem texto nas perguntas.
export const MATH_GAMES_DATA: Record<string, MathGameData[]> = {
  '1': [
    // 1 - Sequência numérica simples (números são visuais para não-leitores)
    {
      instruction: 'Qual número vem depois?',
      gameType: 'sequence',
      items: ['1️⃣', '2️⃣', '3️⃣', '?'],
      options: ['4', '5', '6'],
      correctAnswer: '4',
    },
    // 2 - Qual copo tem mais leite (3 copos com tamanhos diferentes)
    {
      instruction: 'Qual copo tem mais leite?',
      gameType: 'sizeThree',
      items: [],
      threeItems: ['🥛', '🥛', '🥛'],
      itemSizes: [38, 62, 95],
      options: ['1', '2', '3'],
      correctAnswer: '3',
    },
    // 3 - Comparação de TAMANHO (animais do mesmo tipo, tamanhos claramente diferentes)
    {
      instruction: 'Qual carro é MAIOR?',
      gameType: 'size',
      items: [],
      leftItems: ['🚌'],    // ônibus = grande
      rightItems: ['🚗'],   // carro = pequeno
      options: ['🚌', '🚗'],
      correctAnswer: '🚌',
    },
    // 4 - Antecessor (número de antes)
    {
      instruction: 'Qual número vem ANTES?',
      gameType: 'sequence',
      items: ['?', '▶️', '5️⃣'],
      options: ['3', '4', '6'],
      correctAnswer: '4',
    },
    // 5 - Contagem simples (até 3, para não-leitores)
    {
      instruction: 'Quantas estrelas tem?',
      gameType: 'counting',
      items: ['⭐', '⭐', '⭐'],
      options: ['2', '3', '4'],
      correctAnswer: '3',
    },
  ],

  '2': [
    {
      instruction: 'Qual número vem depois do 4?',
      gameType: 'sequence',
      items: ['2️⃣', '3️⃣', '4️⃣', '?'],
      options: ['4', '5', '6'],
      correctAnswer: '5',
    },
    {
      instruction: 'Qual prato tem MAIS comida?',
      gameType: 'comparison',
      items: [],
      leftItems: ['🍎', '🍎', '🍎', '🍎'],
      rightItems: ['🍎', '🍎'],
      options: ['⬅️ Esquerda', '➡️ Direita'],
      correctAnswer: '⬅️ Esquerda',
    },
    {
      instruction: 'Qual animal é MENOR?',
      gameType: 'size',
      items: [],
      leftItems: ['🐘'],
      rightItems: ['🐭'],
      options: ['🐘', '🐭'],
      correctAnswer: '🐭',
    },
    {
      instruction: 'Qual o número antes do 8?',
      gameType: 'sequence',
      items: ['?', '▶️', '8️⃣'],
      options: ['6', '7', '9'],
      correctAnswer: '7',
    },
    {
      instruction: 'Quantos cachorros tem?',
      gameType: 'counting',
      items: ['🐶', '🐶', '🐶', '🐶'],
      options: ['3', '4', '5'],
      correctAnswer: '4',
    },
  ],

  '3': [
    {
      instruction: 'Qual o sucessor do 15?',
      gameType: 'sequence',
      items: ['13', '14', '15', '?'],
      options: ['14', '16', '17'],
      correctAnswer: '16',
    },
    {
      instruction: 'Qual copo tem MAIS suco?',
      gameType: 'comparison',
      items: [],
      leftItems: ['🧃'],
      rightItems: ['🧃', '🧃', '🧃', '🧃'],
      options: ['⬅️ Esquerda', '➡️ Direita'],
      correctAnswer: '➡️ Direita',
    },
    {
      instruction: 'Qual prédio é mais ALTO?',
      gameType: 'size',
      items: [],
      leftItems: ['🏢'],
      rightItems: ['🏠'],
      options: ['🏢', '🏠'],
      correctAnswer: '🏢',
    },
    {
      instruction: 'Qual o antecessor do 20?',
      gameType: 'sequence',
      items: ['?', '▶️', '20'],
      options: ['18', '19', '21'],
      correctAnswer: '19',
    },
    {
      instruction: 'Quantas estrelas estão brilhando?',
      gameType: 'counting',
      items: ['⭐', '⭐', '⭐', '⭐', '⭐'],
      options: ['4', '5', '6'],
      correctAnswer: '5',
    },
  ],

  '4': [
    {
      instruction: 'Qual número vem depois do 39?',
      gameType: 'sequence',
      items: ['37', '38', '39', '?'],
      options: ['38', '40', '41'],
      correctAnswer: '40',
    },
    {
      instruction: 'Qual árvore é MAIOR?',
      gameType: 'size',
      items: [],
      leftItems: ['🌳'],
      rightItems: ['🌱'],
      options: ['🌳', '🌱'],
      correctAnswer: '🌳',
    },
    {
      instruction: 'Qual grupo tem MAIS flores?',
      gameType: 'comparison',
      items: [],
      leftItems: ['🌸', '🌸'],
      rightItems: ['🌸', '🌸', '🌸', '🌸', '🌸'],
      options: ['⬅️ Esquerda', '➡️ Direita'],
      correctAnswer: '➡️ Direita',
    },
    {
      instruction: 'Qual o antecessor do 50?',
      gameType: 'sequence',
      items: ['?', '▶️', '50'],
      options: ['48', '49', '51'],
      correctAnswer: '49',
    },
    {
      instruction: 'Conte os corações!',
      gameType: 'counting',
      items: ['❤️', '❤️', '❤️', '❤️', '❤️', '❤️'],
      options: ['5', '6', '7'],
      correctAnswer: '6',
    },
  ],

  '5': [
    {
      instruction: 'Qual o sucessor do 99?',
      gameType: 'sequence',
      items: ['97', '98', '99', '?'],
      options: ['98', '100', '101'],
      correctAnswer: '100',
    },
    {
      instruction: 'Qual grupo tem MENOS bolas?',
      gameType: 'comparison',
      items: [],
      leftItems: ['⚽', '⚽', '⚽'],
      rightItems: ['⚽'],
      options: ['⬅️ Esquerda', '➡️ Direita'],
      correctAnswer: '➡️ Direita',
    },
    {
      instruction: 'Qual é o animal MAIOR?',
      gameType: 'size',
      items: [],
      leftItems: ['🐋'],
      rightItems: ['🐟'],
      options: ['🐋', '🐟'],
      correctAnswer: '🐋',
    },
    {
      instruction: 'Qual o antecessor do 10?',
      gameType: 'sequence',
      items: ['?', '▶️', '10'],
      options: ['8', '9', '11'],
      correctAnswer: '9',
    },
    {
      instruction: 'Quantas luas você vê?',
      gameType: 'counting',
      items: ['🌙', '🌙', '🌙', '🌙', '🌙', '🌙', '🌙'],
      options: ['6', '7', '8'],
      correctAnswer: '7',
    },
  ],

  '6': [
    {
      instruction: '2, 4, 6, ...?',
      gameType: 'sequence',
      items: ['2', '4', '6', '?'],
      options: ['7', '8', '9'],
      correctAnswer: '8',
    },
    {
      instruction: 'Qual é o maior planeta?',
      gameType: 'size',
      items: [],
      leftItems: ['🪐'],
      rightItems: ['🌍'],
      options: ['🪐', '🌍'],
      correctAnswer: '🪐',
    },
    {
      instruction: 'Qual lado tem MAIS presentes?',
      gameType: 'comparison',
      items: [],
      leftItems: ['🎁', '🎁'],
      rightItems: ['🎁', '🎁', '🎁', '🎁', '🎁'],
      options: ['⬅️ Esquerda', '➡️ Direita'],
      correctAnswer: '➡️ Direita',
    },
    {
      instruction: 'Qual o antecessor do 100?',
      gameType: 'sequence',
      items: ['?', '▶️', '100'],
      options: ['98', '99', '101'],
      correctAnswer: '99',
    },
    {
      instruction: 'Quantos presentes?',
      gameType: 'counting',
      items: ['🎁', '🎁', '🎁', '🎁', '🎁', '🎁', '🎁', '🎁'],
      options: ['7', '8', '9'],
      correctAnswer: '8',
    },
  ],

  '7': [
    {
      instruction: '10, 20, 30, ...?',
      gameType: 'sequence',
      items: ['10', '20', '30', '?'],
      options: ['40', '50', '60'],
      correctAnswer: '40',
    },
    {
      instruction: 'Qual livro é mais GROSSO?',
      gameType: 'size',
      items: [],
      leftItems: ['📚'],
      rightItems: ['📖'],
      options: ['📚', '📖'],
      correctAnswer: '📚',
    },
    {
      instruction: 'Qual grupo tem MAIS flores?',
      gameType: 'comparison',
      items: [],
      leftItems: ['🌻', '🌻', '🌻', '🌻', '🌻', '🌻'],
      rightItems: ['🌻', '🌻', '🌻'],
      options: ['⬅️ Esquerda', '➡️ Direita'],
      correctAnswer: '⬅️ Esquerda',
    },
    {
      instruction: 'Qual o antecessor do 30?',
      gameType: 'sequence',
      items: ['?', '▶️', '30'],
      options: ['27', '28', '29'],
      correctAnswer: '29',
    },
    {
      instruction: 'Quantas flores?',
      gameType: 'counting',
      items: ['🌻', '🌻', '🌻', '🌻', '🌻', '🌻', '🌻', '🌻', '🌻'],
      options: ['8', '9', '10'],
      correctAnswer: '9',
    },
  ],

  '8': [
    {
      instruction: 'Qual a metade de 10?',
      gameType: 'sequence',
      items: ['10', '÷', '2', '=', '?'],
      options: ['4', '5', '6'],
      correctAnswer: '5',
    },
    {
      instruction: 'Qual barco é MAIOR?',
      gameType: 'size',
      items: [],
      leftItems: ['🚢'],
      rightItems: ['⛵'],
      options: ['🚢', '⛵'],
      correctAnswer: '🚢',
    },
    {
      instruction: 'Qual lado tem MAIS diamantes?',
      gameType: 'comparison',
      items: [],
      leftItems: ['💎', '💎'],
      rightItems: ['💎', '💎', '💎', '💎', '💎', '💎', '💎'],
      options: ['⬅️ Esquerda', '➡️ Direita'],
      correctAnswer: '➡️ Direita',
    },
    {
      instruction: 'Qual o dobro de 5?',
      gameType: 'sequence',
      items: ['5', 'x', '2', '=', '?'],
      options: ['9', '10', '15'],
      correctAnswer: '10',
    },
    {
      instruction: 'Conte os diamantes!',
      gameType: 'counting',
      items: ['💎', '💎', '💎', '💎', '💎', '💎', '💎', '💎', '💎', '💎'],
      options: ['9', '10', '11'],
      correctAnswer: '10',
    },
  ],
};
