// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, StatusBar, Alert } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAudio } from '../../hooks/useAudio';
import { gameStyles, OPTION_GRADIENTS } from '../../constants/GameStyles';

const ROUNDS = [
  { theme: 'Qual não é uma FRUTA? 🍎', items: [{ emoji: '🍎', intruder: false }, { emoji: '🍋', intruder: false }, { emoji: '🥕', intruder: true }, { emoji: '🍇', intruder: false }] },
  { theme: 'Qual não é um ANIMAL? 🐶', items: [{ emoji: '🐶', intruder: false }, { emoji: '🐱', intruder: false }, { emoji: '🚗', intruder: true }, { emoji: '🐰', intruder: false }] },
  { theme: 'Qual não é um ESPORTE? ⚽', items: [{ emoji: '⚽', intruder: false }, { emoji: '🏀', intruder: false }, { emoji: '🥪', intruder: true }, { emoji: '🏐', intruder: false }] },
  { theme: 'Qual não é uma ROUPA? 👕', items: [{ emoji: '👕', intruder: false }, { emoji: '👗', intruder: false }, { emoji: '🎸', intruder: true }, { emoji: '👖', intruder: false }] },
];

export default function IntrusoGame() {
  const router = useRouter();
  const { playSuccess, playError, speakText, stopSpeech } = useAudio();
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);

  const round = ROUNDS[currentRound];

  useEffect(() => {
    const timer = setTimeout(() => {
      stopSpeech();
      speakText(round.theme.replace(/[^\w\s]/gi, ''));
    }, 800);
    return () => clearTimeout(timer);
  }, [currentRound]);

  const handlePress = (item) => {
    if (item.intruder) {
      playSuccess();
      setScore(s => s + 10);
      if (currentRound < ROUNDS.length - 1) {
        setCurrentRound(r => r + 1);
      } else {
        speakText(`Parabéns! Você encontrou todos os intrusos com ${score + 10} pontos!`);
        Alert.alert('🕵️ DETETIVE MASTER!', `Você encontrou todos os intrusos!\n${score + 10} pontos!`, [
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
      <LinearGradient colors={['#C44569', '#8E44AD', '#4D96FF']} style={gameStyles.hud}>
        <TouchableOpacity onPress={() => router.push('/')} style={gameStyles.hudBackBtn}>
          <Ionicons name="arrow-back" size={26} color="#FFF" />
        </TouchableOpacity>
        <View style={gameStyles.hudCenter}>
          <Text style={gameStyles.hudTitle}>🕵️ DESAFIO DO INTRUSO</Text>
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

      <View style={gameStyles.gameArea}>
        {/* Instrução */}
        <View style={gameStyles.instructionCard}>
          <FontAwesome5 name="search" size={22} color="#C44569" />
          <Text style={gameStyles.instructionText}>{round.theme}</Text>
        </View>

        {/* Grid de opções */}
        <View style={styles.optionsGrid}>
          {round.items.map((item, idx) => (
            <TouchableOpacity key={idx} onPress={() => handlePress(item)} style={gameStyles.answerBtnOuter}>
              <LinearGradient colors={OPTION_GRADIENTS[idx % OPTION_GRADIENTS.length]} style={styles.optionGradient}>
                <View style={gameStyles.answerBtnGloss} />
                <Text style={styles.optionEmoji}>{item.emoji}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    maxWidth: 600,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  optionGradient: {
    width: 130,
    height: 130,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.8)',
    overflow: 'hidden',
  },
  optionEmoji: {
    fontSize: 75,
  },
});
