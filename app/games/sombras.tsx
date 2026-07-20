// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAudio } from '../../hooks/useAudio';
import { gameStyles, OPTION_GRADIENTS } from '../../constants/GameStyles';

// Usando emojis como "sombras" (mostrar emoji escuro vs colorido)
const ROUNDS = [
  { label: 'Cachorro', shadowIcon: 'dog', options: [{ emoji: '🐱', label: 'Gato' }, { emoji: '🐶', label: 'Cachorro' }, { emoji: '🐴', label: 'Cavalo' }, { emoji: '🦊', label: 'Raposa' }], correct: 'Cachorro' },
  { label: 'Carro',    shadowIcon: 'car-side', options: [{ emoji: '🚗', label: 'Carro' }, { emoji: '🚌', label: 'Ônibus' }, { emoji: '🚛', label: 'Caminhão' }, { emoji: '🚲', label: 'Bicicleta' }], correct: 'Carro' },
  { label: 'Maçã',     shadowIcon: 'apple-alt', options: [{ emoji: '🥕', label: 'Cenoura' }, { emoji: '🍎', label: 'Maçã' }, { emoji: '🍋', label: 'Limão' }, { emoji: '🌶️', label: 'Pimenta' }], correct: 'Maçã' },
];

export default function SombrasGame() {
  const router = useRouter();
  const { playSuccess, playError, speakText, stopSpeech } = useAudio();
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);

  const round = ROUNDS[currentRound];

  useEffect(() => {
    const timer = setTimeout(() => {
      stopSpeech();
      speakText(`Encontre a sombra de: ${round.label}!`);
    }, 800);
    return () => clearTimeout(timer);
  }, [currentRound]);

  const handlePress = (option) => {
    if (option.label === round.correct) {
      playSuccess();
      setScore(s => s + 10);
      if (currentRound < ROUNDS.length - 1) {
        setCurrentRound(r => r + 1);
      } else {
        speakText(`Parabéns! Você encontrou todas as sombras!`);
        Alert.alert('👤 CAMPEÃO!', `Você encontrou todas as sombras!\n${score + 10} pontos!`, [
          { text: 'Voltar ao Mapa', onPress: () => router.push('/') },
        ]);
      }
    } else {
      playError();
    }
  };

  return (
    <ImageBackground source={require('../../assets/images/bg_escola.jpg')} style={gameStyles.background} blurRadius={3}>
      <StatusBar hidden />

      {/* HUD */}
      <SafeAreaView edges={["top"]}>
        <LinearGradient colors={['#2C2C54', '#474787', '#9C27B0']} style={gameStyles.hud}>
        <TouchableOpacity onPress={() => router.push('/')} style={gameStyles.hudBackBtn}>
          <Ionicons name="arrow-back" size={26} color="#FFF" />
        </TouchableOpacity>
        <View style={gameStyles.hudCenter}>
          <Text style={gameStyles.hudTitle}>👤 JOGO DAS SOMBRAS</Text>
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
          <FontAwesome5 name="search" size={22} color="#474787" />
          <Text style={gameStyles.instructionText}>Encontre a sombra correta!</Text>
        </View>

        {/* Sombra - Ícone escuro */}
        <View style={styles.shadowBox}>
          <FontAwesome5 name={round.shadowIcon} size={80} color="#111" style={styles.shadowIconStyle} />
          <Text style={styles.shadowLabel}>???</Text>
        </View>

        {/* Grid de opções */}
        <View style={styles.optionsGrid}>
          {round.options.map((opt, idx) => (
            <TouchableOpacity key={idx} onPress={() => handlePress(opt)} style={gameStyles.answerBtnOuter}>
              <LinearGradient colors={OPTION_GRADIENTS[idx % OPTION_GRADIENTS.length]} style={styles.optionGradient}>
                <View style={gameStyles.answerBtnGloss} />
                <Text style={styles.optionEmoji}>{opt.emoji}</Text>
                <Text style={styles.optionLabel}>{opt.label}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  shadowBox: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 5,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 15,
  },
  shadowIconStyle: { opacity: 0.9, marginBottom: 10 },
  shadowLabel: { fontSize: 22, fontWeight: '900', color: 'rgba(255,255,255,0.6)' },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    maxWidth: 600,
    paddingHorizontal: 10,
  },
  optionGradient: {
    width: 120,
    height: 120,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.8)',
    overflow: 'hidden',
    gap: 4,
  },
  optionEmoji: { fontSize: 55 },
  optionLabel: { fontSize: 12, fontWeight: 'bold', color: '#FFF', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 },
});
