// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAudio } from '../../hooks/useAudio';
import { gameStyles } from '../../constants/GameStyles';

const ALL_COLORS = [
  { name: 'VERMELHO', hex: '#F44336' },
  { name: 'AZUL', hex: '#2196F3' },
  { name: 'VERDE', hex: '#4CAF50' },
  { name: 'AMARELO', hex: '#FFEB3B' },
  { name: 'ROXO', hex: '#9C27B0' },
  { name: 'LARANJA', hex: '#FF9800' },
];

const generateRounds = (level: number) => {
  const numOptions = level === 1 ? 2 : level === 2 ? 4 : 6;
  return ALL_COLORS.slice(0, 4).map(target => {
    // Pick the target, plus (numOptions - 1) other random colors
    const others = ALL_COLORS.filter(c => c.hex !== target.hex)
      .sort(() => Math.random() - 0.5)
      .slice(0, numOptions - 1);
    
    const options = [target, ...others].sort(() => Math.random() - 0.5);
    
    return {
      targetColorName: target.name,
      targetColorHex: target.hex,
      colors: options.map(o => o.hex)
    };
  });
};

export default function CoresGame() {
  const router = useRouter();
  const { level } = useLocalSearchParams();
  const gameLevel = Number(level) || 1;

  const { playSuccess, playError, speakText, stopSpeech } = useAudio();
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [rounds, setRounds] = useState([]);

  useEffect(() => {
    setRounds(generateRounds(gameLevel));
  }, [gameLevel]);

  const round = rounds[currentRound];

  useEffect(() => {
    if (!round) return;
    const timer = setTimeout(() => {
      stopSpeech();
      speakText(`Encontre a cor ${round.targetColorName}!`);
    }, 800);
    return () => clearTimeout(timer);
  }, [currentRound, round]);

  const handlePress = (colorHex) => {
    if (colorHex === round.targetColorHex) {
      playSuccess();
      setScore(s => s + 10);
      if (currentRound < rounds.length - 1) {
        setCurrentRound(r => r + 1);
      } else {
        speakText('Parabéns! Você encontrou todas as cores!');
        Alert.alert('🎨 CAMPEÃO!', 'Você completou o Caçador de Cores!', [
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
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <LinearGradient colors={['#9C27B0', '#6A1B9A', '#4A148C']} style={gameStyles.hud}>
          <TouchableOpacity onPress={() => router.push('/')} style={gameStyles.hudBackBtn}>
            <Ionicons name="arrow-back" size={26} color="#FFF" />
          </TouchableOpacity>
          <View style={gameStyles.hudCenter}>
            <Text style={gameStyles.hudTitle}>🎨 CAÇADOR DE CORES</Text>
            <View style={gameStyles.hudBadge}>
              <Text style={gameStyles.hudBadgeText}>NÍVEL {gameLevel} - Rodada {currentRound + 1} de {rounds.length}</Text>
            </View>
          </View>
          <View style={gameStyles.hudScore}>
            <Text style={gameStyles.hudScoreLabel}>PONTOS</Text>
            <Text style={gameStyles.hudScoreValue}>{score}</Text>
          </View>
        </LinearGradient>

        {round && (
          <View style={styles.gameArea}>
            <View style={styles.instructionCard}>
              <Text style={styles.instructionText}>Encontre a cor:</Text>
              <Text style={[styles.targetColorText, { color: round.targetColorHex }]}>{round.targetColorName}</Text>
            </View>

            <View style={styles.optionsGrid}>
              {round.colors.map((colorHex, idx) => (
                <TouchableOpacity key={idx} onPress={() => handlePress(colorHex)} style={[styles.colorButtonOuter, gameLevel === 3 && { width: 90, height: 90 }]} activeOpacity={0.8}>
                  <View style={[styles.colorButtonInner, { backgroundColor: colorHex }]} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  gameArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  instructionCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 4,
    borderColor: '#9C27B0',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  instructionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  targetColorText: {
    fontSize: 40,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginTop: 10,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    maxWidth: 400,
  },
  colorButtonOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFF',
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  colorButtonInner: {
    flex: 1,
    borderRadius: 55,
  }
});
