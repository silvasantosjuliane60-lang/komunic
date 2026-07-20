// @ts-nocheck
/**
 * GameStyles.ts - Sistema de Design Compartilhado para Todos os Jogos
 * Design alegre, colorido e infantil - Komunic Alfa
 */
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// ────────────────────────────────────────────────
// PALETA DE CORES ALEGRES
// ────────────────────────────────────────────────
export const GAME_COLORS = {
  // Botões de resposta - arco-íris
  btn1: ['#FF6B6B', '#EE5A24'],   // Vermelho coral
  btn2: ['#FFC312', '#F79F1F'],   // Amarelo sol
  btn3: ['#12CBC4', '#009432'],   // Verde água
  btn4: ['#C44569', '#833471'],   // Rosa lilás
  btn5: ['#FDA7DF', '#D980FA'],   // Rosa chiclete

  // Gradientes de fundo dos cards
  cardGreen:  ['#6BCB77', '#4D9A5C'],
  cardBlue:   ['#4D96FF', '#2D6ECC'],
  cardOrange: ['#FFB347', '#E07A00'],
  cardPink:   ['#FF82A9', '#D94F78'],
  cardPurple: ['#B983FF', '#8649CB'],

  // HUD / Barra superior
  hudGradient: ['#FF6B6B', '#C44569', '#8E44AD'],

  // Indicadores de nível/fase
  levelBadge: ['#FFC312', '#F79F1F'],

  // Feedback
  correct: '#6BCB77',
  wrong: '#FF6B6B',
};

// Gradientes rotativos para os botões de resposta
export const OPTION_GRADIENTS = [
  ['#FF6B6B', '#EE5A24'],
  ['#FFC312', '#F79F1F'],
  ['#12CBC4', '#009432'],
  ['#C44569', '#833471'],
  ['#FDA7DF', '#D980FA'],
];

// ────────────────────────────────────────────────
// ESTILOS COMPARTILHADOS DOS JOGOS
// ────────────────────────────────────────────────
export const gameStyles = StyleSheet.create({
  // ─── Fundo ────────────────────────────────────
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  // ─── Barra superior (HUD) ─────────────────────
  hud: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingTop: 40,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(255,255,255,0.25)',
  },
  hudBackBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  hudCenter: {
    alignItems: 'center',
    flex: 1,
  },
  hudTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  hudBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  hudBadgeText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFEB3B',
    textTransform: 'uppercase',
  },
  hudScore: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,215,0,0.25)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 2,
    borderColor: 'rgba(255,215,0,0.5)',
  },
  hudScoreLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFEB3B',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  hudScoreValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFF',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  // ─── Área principal do jogo ───────────────────
  gameArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingBottom: 20,
  },

  // ─── Card de instrução ────────────────────────
  instructionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: '#FFC312',
    marginBottom: 18,
    maxWidth: '95%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    gap: 10,
  },
  instructionText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#2C2C54',
    textAlign: 'center',
    flexShrink: 1,
  },

  // ─── Caixa de imagem/emoji ────────────────────
  imageBox: {
    width: 190,
    height: 190,
    borderRadius: 100,
    backgroundColor: '#FFF',
    borderWidth: 6,
    borderColor: '#FF6B6B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 12,
  },
  imageBoxEmoji: {
    fontSize: 105,
  },

  // ─── Área de palavra (ex: "P _ T O") ─────────
  wordDisplay: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 20,
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderWidth: 4,
    borderColor: '#12CBC4',
    marginBottom: 12,
    shadowColor: '#12CBC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  wordDisplayText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#2C2C54',
    letterSpacing: 10,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  wordMissingLetter: {
    color: '#FF6B6B',
  },

  // ─── Área de feedback ─────────────────────────
  feedbackArea: {
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  feedbackCorrect: {
    fontSize: 30,
    fontWeight: '900',
    color: '#6BCB77',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  feedbackWrong: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FF6B6B',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },

  // ─── Linha de opções/botões ───────────────────
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 14,
    paddingHorizontal: 10,
  },

  // ─── Botão de resposta 3D ─────────────────────
  answerBtnOuter: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
    borderRadius: 22,
  },
  answerBtnGradient: {
    width: 90,
    height: 90,
    borderRadius: 22,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  answerBtnGloss: {
    position: 'absolute',
    top: 3,
    left: '10%',
    right: '10%',
    height: '30%',
    backgroundColor: 'rgba(255,255,255,0.45)',
    borderRadius: 10,
  },
  answerBtnText: {
    color: '#FFF',
    fontSize: 48,
    fontWeight: '900',
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  answerBtnTextSmall: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '900',
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    textAlign: 'center',
  },

  // ─── Botão de resposta LARGO (para palavras) ──
  answerBtnWide: {
    width: 160,
    height: 70,
  },
  answerBtnExtraWide: {
    width: 200,
    height: 70,
  },

  // ─── Tela de nível superado ───────────────────
  levelUpOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  levelUpStars: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  levelUpTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFF',
    textShadowColor: '#FFC312',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    textAlign: 'center',
  },
  levelUpSubtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFEB3B',
    textAlign: 'center',
  },
  levelUpEmoji: {
    fontSize: 80,
  },

  // ─── Progress bar de fases ────────────────────
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  progressDotActive: {
    backgroundColor: '#FFEB3B',
    borderColor: '#FFF',
  },
  progressDotDone: {
    backgroundColor: '#6BCB77',
    borderColor: '#FFF',
  },
});
