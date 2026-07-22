// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { useAudio } from '../../hooks/useAudio';
import LibrasSign from '../../components/LibrasSign';
import { gameStyles, OPTION_GRADIENTS, GAME_COLORS } from '../../constants/GameStyles';
import { GameInfoButton } from '../../components/GameIntro';

// Banco de dados: 3 Níveis x 3 Fases
const GAME_DATA = [
  // Nível 1: Vogais
  [
    { id: 1, word: 'ABELHA',   image: '🐝', correctAnswer: 'A', options: ['E', 'A', 'I'] },
    { id: 2, word: 'ELEFANTE', image: '🐘', correctAnswer: 'E', options: ['A', 'O', 'E'] },
    { id: 3, word: 'URSO',     image: '🐻', correctAnswer: 'U', options: ['U', 'I', 'O'] },
  ],
  // Nível 2: Consoantes Simples
  [
    { id: 4, word: 'BOLO',   image: '🎂', correctAnswer: 'B', options: ['A', 'B', 'C'] },
    { id: 5, word: 'MACACO', image: '🐒', correctAnswer: 'M', options: ['N', 'M', 'P'] },
    { id: 6, word: 'PATO',   image: '🦆', correctAnswer: 'P', options: ['B', 'P', 'T'] },
  ],
  // Nível 3: Consoantes Mistas
  [
    { id: 7, word: 'GATO', image: '🐱', correctAnswer: 'G', options: ['M', 'G', 'F'] },
    { id: 8, word: 'SOL',  image: '☀️', correctAnswer: 'S', options: ['S', 'P', 'C'] },
    { id: 9, word: 'FLOR', image: '🌸', correctAnswer: 'F', options: ['V', 'F', 'L'] },
  ],
];

const LEVEL_NAMES = ['🌟 Iniciante', '🚀 Médio', '🏆 Avançado'];

// Botão de resposta colorido e divertido
const AnswerButton = ({ letter, gradient, onPress, disabled }) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={onPress}
    style={gameStyles.answerBtnOuter}
    disabled={disabled}
  >
    <LinearGradient colors={gradient} style={gameStyles.answerBtnGradient}>
      <View style={gameStyles.answerBtnGloss} />
      <Text style={gameStyles.answerBtnText}>{letter}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

export default function VilaDasLetrasGame() {
  const router = useRouter();

  const [currentLevel, setCurrentLevel] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [hasPlayedWelcome, setHasPlayedWelcome] = useState(false);

  const { isLibrasActive } = useAccessibility();
  const { playSuccess, playError, playPhoneme, speakText, stopSpeech } = useAudio();

  const levelData = GAME_DATA[currentLevel][currentStage];

  const playIntro = () => {
    if (showLevelUp) return;
    stopSpeech();
    if (!hasPlayedWelcome) {
      speakText(`Esse é o Vila das Letras! A palavra ${levelData.word} começa com qual letra?`);
      setHasPlayedWelcome(true);
    } else {
      speakText(`A palavra ${levelData.word} começa com qual letra?`);
    }
  };

  useEffect(() => {
    if (showLevelUp) return;
    const timer = setTimeout(() => playIntro(), 800);
    return () => { clearTimeout(timer); stopSpeech(); };
  }, [currentStage, currentLevel, showLevelUp]);

  const handleAnswer = (letter) => {
    stopSpeech();
    playPhoneme(letter);
    if (letter === levelData.correctAnswer) {
      setFeedback('correct');
      playSuccess();
      setScore(s => s + 10);
      setTimeout(() => handleNext(), 1500);
    } else {
      setFeedback('wrong');
      playError();
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  const handleNext = () => {
    if (currentStage < 2) {
      setCurrentStage(currentStage + 1);
      setFeedback(null);
    } else if (currentLevel < 2) {
      setShowLevelUp(true);
      playSuccess();
      speakText('Arrasou! Você subiu de nível!');
      setTimeout(() => {
        setShowLevelUp(false);
        setCurrentLevel(currentLevel + 1);
        setCurrentStage(0);
        setFeedback(null);
      }, 3000);
    } else {
      speakText(`Parabéns! Você completou a Vila das Letras com ${score + 10} pontos!`);
      Alert.alert('🏆 PARABÉNS!', `Você completou a Vila das Letras!\nGanhou ${score + 10} pontos!`, [
        { text: 'Voltar ao Mapa', onPress: () => router.push('/') },
      ]);
    }
  };

  // ── Tela de Level Up ──────────────────────────
  if (showLevelUp) {
    return (
      <ImageBackground
        source={require('../../assets/images/bg_escola.jpg')}
        style={gameStyles.background}
        resizeMode="cover"
        blurRadius={6}
      >
        <StatusBar hidden />
        <View style={gameStyles.levelUpOverlay}>
          <Text style={gameStyles.levelUpEmoji}>🌟</Text>
          <Text style={gameStyles.levelUpTitle}>NÍVEL {currentLevel + 1} CONCLUÍDO!</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginVertical: 10 }}>
            {['⭐', '⭐', '⭐'].map((s, i) => (
              <Text key={i} style={{ fontSize: 40 }}>{s}</Text>
            ))}
          </View>
          <Text style={gameStyles.levelUpSubtitle}>Próximo: {LEVEL_NAMES[currentLevel + 1]}</Text>
        </View>
      </ImageBackground>
    );
  }

  // ── Tela principal do jogo ─────────────────────
  return (
    <ImageBackground
      source={require('../../assets/images/bg_escola.jpg')}
      style={gameStyles.background}
      resizeMode="cover"
      blurRadius={3}
    >
      <StatusBar hidden />

      {/* ═══ HUD superior ═══ */}
      <SafeAreaView edges={["top"]}>
        <LinearGradient colors={['#8E44AD', '#C44569', '#FF6B6B']} style={gameStyles.hud}>
        <TouchableOpacity onPress={() => router.push('/')} style={gameStyles.hudBackBtn}>
          <Ionicons name="arrow-back" size={26} color="#FFF" />
        </TouchableOpacity>

        <View style={gameStyles.hudCenter}>
          <Text style={gameStyles.hudTitle}>🔤 VILA DAS LETRAS</Text>
          <View style={gameStyles.hudBadge}>
            <Text style={gameStyles.hudBadgeText}>{LEVEL_NAMES[currentLevel]}</Text>
          </View>
          {/* Bolinhas de progresso das fases */}
          <View style={gameStyles.progressContainer}>
            {[0, 1, 2].map(i => (
              <View
                key={i}
                style={[
                  gameStyles.progressDot,
                  i < currentStage && gameStyles.progressDotDone,
                  i === currentStage && gameStyles.progressDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <GameInfoButton gameKey="letras" />
          <View style={gameStyles.hudScore}>
            <Text style={gameStyles.hudScoreLabel}>PONTOS</Text>
            <Text style={gameStyles.hudScoreValue}>{score}</Text>
          </View>
        </View>
        </LinearGradient>
      </SafeAreaView>

      {/* Libras */}
      {isLibrasActive && <LibrasSign text={levelData.correctAnswer} />}

      {/* ═══ Área do Jogo ═══ */}
      <View style={gameStyles.gameArea}>

        {/* Card de instrução */}
        <TouchableOpacity style={gameStyles.instructionCard} onPress={playIntro} activeOpacity={0.8}>
          <FontAwesome5 name="volume-up" size={22} color="#FF6B6B" />
          <Text style={gameStyles.instructionText}>
            A palavra {levelData.word} começa com qual letra?
          </Text>
        </TouchableOpacity>

        {/* Emoji gigante */}
        <View style={gameStyles.imageBox}>
          <Text style={gameStyles.imageBoxEmoji}>{levelData.image}</Text>
        </View>

        {/* Feedback */}
        <View style={gameStyles.feedbackArea}>
          {feedback === 'correct' && (
            <Text style={gameStyles.feedbackCorrect}>✨ MUITO BEM! ✨</Text>
          )}
          {feedback === 'wrong' && (
            <Text style={gameStyles.feedbackWrong}>😅 Tente outra vez!</Text>
          )}
        </View>

        {/* Botões de resposta */}
        <View style={gameStyles.optionsRow}>
          {levelData.options.map((letter, i) => (
            <AnswerButton
              key={i}
              letter={letter}
              gradient={OPTION_GRADIENTS[i % OPTION_GRADIENTS.length]}
              onPress={() => handleAnswer(letter)}
              disabled={feedback === 'correct'}
            />
          ))}
        </View>

      </View>
    </ImageBackground>
  );
}
