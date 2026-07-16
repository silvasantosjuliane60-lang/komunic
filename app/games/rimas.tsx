// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAudio } from '../../hooks/useAudio';
import { gameStyles, OPTION_GRADIENTS } from '../../constants/GameStyles';
import Animated, {
  useSharedValue, useAnimatedStyle, withSequence, withTiming, withRepeat
} from 'react-native-reanimated';

const ROUNDS = [
  { word: 'GATO',    emoji: '🐱', options: [{ word: 'PATO', emoji: '🦆' }, { word: 'CÃO', emoji: '🐶' }, { word: 'MACACO', emoji: '🐒' }], correct: 'PATO' },
  { word: 'MÃO',    emoji: '✋', options: [{ word: 'PÃO', emoji: '🍞' }, { word: 'BOLA', emoji: '⚽' }, { word: 'CARRO', emoji: '🚗' }], correct: 'PÃO' },
  { word: 'FOGUETE', emoji: '🚀', options: [{ word: 'MESA', emoji: '🪑' }, { word: 'SORVETE', emoji: '🍦' }, { word: 'CASA', emoji: '🏠' }], correct: 'SORVETE' },
  { word: 'AVIÃO',   emoji: '✈️', options: [{ word: 'LEÃO', emoji: '🦁' }, { word: 'FLOR', emoji: '🌸' }, { word: 'LIVRO', emoji: '📖' }], correct: 'LEÃO' },
];

const ShakeOption = ({ children, isError, onAnimationComplete }) => {
  const shake = useSharedValue(0);
  useEffect(() => {
    if (isError) {
      shake.value = withSequence(
        withTiming(12, { duration: 50 }), withTiming(-12, { duration: 50 }),
        withTiming(12, { duration: 50 }), withTiming(0, { duration: 50 })
      );
      setTimeout(onAnimationComplete, 300);
    }
  }, [isError]);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shake.value }] }));
  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};

const PulsingTarget = ({ children }) => {
  const scale = useSharedValue(1);
  useEffect(() => {
    scale.value = withRepeat(
      withSequence(withTiming(1.06, { duration: 700 }), withTiming(1, { duration: 700 })),
      -1, true
    );
  }, []);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};

export default function OficinaDeRimas() {
  const router = useRouter();
  const { playSuccess, playError, speakText, stopSpeech } = useAudio();
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [errorIndex, setErrorIndex] = useState(-1);

  const round = ROUNDS[currentRound];

  useEffect(() => {
    const timer = setTimeout(() => {
      stopSpeech();
      speakText(`O que rima com ${round.word}?`);
    }, 800);
    return () => clearTimeout(timer);
  }, [currentRound]);

  const handlePress = (option, index) => {
    if (option.word === round.correct) {
      playSuccess();
      setScore(s => s + 10);
      if (currentRound < ROUNDS.length - 1) {
        setTimeout(() => setCurrentRound(r => r + 1), 800);
      } else {
        speakText(`Parabéns! Você terminou a Oficina de Rimas!`);
        Alert.alert('🎵 PARABÉNS!', `Oficina de Rimas concluída!\n${score + 10} pontos!`, [
          { text: 'Voltar ao Mapa', onPress: () => router.push('/') },
        ]);
      }
    } else {
      playError();
      setErrorIndex(index);
    }
  };

  return (
    <ImageBackground source={require('../../assets/images/bg_escola.jpg')} style={gameStyles.background} resizeMode="cover" blurRadius={3}>
      <StatusBar hidden />

      {/* HUD */}
      <SafeAreaView edges={["top"]}>
        <LinearGradient colors={['#12CBC4', '#1289A7', '#4D96FF']} style={gameStyles.hud}>
        <TouchableOpacity onPress={() => router.push('/')} style={gameStyles.hudBackBtn}>
          <Ionicons name="arrow-back" size={26} color="#FFF" />
        </TouchableOpacity>
        <View style={gameStyles.hudCenter}>
          <Text style={gameStyles.hudTitle}>🎵 OFICINA DE RIMAS</Text>
          <View style={gameStyles.hudBadge}>
            <Text style={gameStyles.hudBadgeText}>Rodada {currentRound + 1} de {ROUNDS.length}</Text>
          </View>
          <View style={gameStyles.progressContainer}>
            {ROUNDS.map((_, i) => (
              <View key={i} style={[gameStyles.progressDot, i < currentRound && gameStyles.progressDotDone, i === currentRound && gameStyles.progressDotActive]} />
            ))}
          </View>
        </View>
        <View style={gameStyles.hudScore}>
          <Text style={gameStyles.hudScoreLabel}>PONTOS</Text>
          <Text style={gameStyles.hudScoreValue}>{score}</Text>
        </View>
        </LinearGradient>
      </SafeAreaView>

      <View style={gameStyles.gameArea}>
        {/* Instrução */}
        <View style={gameStyles.instructionCard}>
          <FontAwesome5 name="music" size={22} color="#12CBC4" />
          <Text style={gameStyles.instructionText}>O que rima com...</Text>
        </View>

        {/* Palavra alvo com animação de pulso */}
        <PulsingTarget>
          <View style={styles.targetBox}>
            <Text style={styles.targetEmoji}>{round.emoji}</Text>
            <Text style={styles.targetWord}>{round.word}</Text>
          </View>
        </PulsingTarget>

        {/* Grade de opções */}
        <View style={styles.optionsGrid}>
          {round.options.map((opt, idx) => (
            <ShakeOption key={idx} isError={errorIndex === idx} onAnimationComplete={() => setErrorIndex(-1)}>
              <TouchableOpacity onPress={() => handlePress(opt, idx)} style={gameStyles.answerBtnOuter}>
                <LinearGradient colors={OPTION_GRADIENTS[idx % OPTION_GRADIENTS.length]} style={styles.optionGradient}>
                  <View style={gameStyles.answerBtnGloss} />
                  <Text style={styles.optionEmoji}>{opt.emoji}</Text>
                  <Text style={styles.optionWord}>{opt.word}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </ShakeOption>
          ))}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  targetBox: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 30,
    paddingHorizontal: 50,
    paddingVertical: 20,
    borderWidth: 5,
    borderColor: '#12CBC4',
    marginBottom: 20,
    shadowColor: '#12CBC4',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 12,
  },
  targetEmoji: { fontSize: 80, marginBottom: 5 },
  targetWord: { fontSize: 36, fontWeight: '900', color: '#12CBC4', letterSpacing: 4 },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    maxWidth: 600,
    paddingHorizontal: 10,
  },
  optionGradient: {
    width: 140,
    height: 140,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.8)',
    overflow: 'hidden',
    gap: 5,
  },
  optionEmoji: { fontSize: 60 },
  optionWord: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    textAlign: 'center',
  },
});
