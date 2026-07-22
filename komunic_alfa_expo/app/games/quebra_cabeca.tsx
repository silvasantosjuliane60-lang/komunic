// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAudio } from '../../hooks/useAudio';
import { gameStyles } from '../../constants/GameStyles';

const ANIMALS = [
  { name: 'CACHORRO', top: '🐶', bottom: '🐕' },
  { name: 'GATO', top: '🐱', bottom: '🐈' },
  { name: 'PORCO', top: '🐷', bottom: '🐖' },
  { name: 'CAVALO', top: '🐴', bottom: '🐎' },
  { name: 'MACACO', top: '🐵', bottom: '🐒' },
  { name: 'LEÃO', top: '🦁', bottom: '🐅' },
];

const generateRounds = (level: number) => {
  const numOptions = level === 1 ? 2 : level === 2 ? 3 : 4;
  return ANIMALS.slice(0, 4).map(target => {
    const others = ANIMALS.filter(a => a.name !== target.name)
      .sort(() => Math.random() - 0.5)
      .slice(0, numOptions - 1);
    
    const options = [target.bottom, ...others.map(o => o.bottom)].sort(() => Math.random() - 0.5);
    
    return {
      animalName: target.name,
      topHalf: target.top,
      bottomOptions: options,
      correctBottom: target.bottom
    };
  });
};

export default function QuebraCabecaGame() {
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
      speakText(`Complete o corpo do ${round.animalName}!`);
    }, 800);
    return () => clearTimeout(timer);
  }, [currentRound, round]);

  const handlePress = (option) => {
    if (option === round.correctBottom) {
      playSuccess();
      setScore(s => s + 10);
      if (currentRound < rounds.length - 1) {
        setTimeout(() => setCurrentRound(r => r + 1), 1000);
      } else {
        setTimeout(() => {
          speakText('Parabéns! Você completou todos os animais!');
          Alert.alert('🧩 CAMPEÃO!', 'Você montou todos os quebra-cabeças!', [
            { text: 'Voltar ao Mapa', onPress: () => router.push('/') },
          ]);
        }, 500);
      }
    } else {
      playError();
    }
  };

  return (
    <ImageBackground source={require('../../assets/images/bg_escola.jpg')} style={gameStyles.background} blurRadius={3}>
      <StatusBar hidden />
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <LinearGradient colors={['#4CAF50', '#2E7D32', '#1B5E20']} style={gameStyles.hud}>
          <TouchableOpacity onPress={() => router.push('/')} style={gameStyles.hudBackBtn}>
            <Ionicons name="arrow-back" size={26} color="#FFF" />
          </TouchableOpacity>
          <View style={gameStyles.hudCenter}>
            <Text style={gameStyles.hudTitle}>🧩 QUEBRA-CABEÇA</Text>
            <View style={gameStyles.hudBadge}>
              <Text style={gameStyles.hudBadgeText}>NÍVEL {gameLevel} - Animal {currentRound + 1} de {rounds.length}</Text>
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
              <Text style={styles.instructionText}>Qual é o corpo correto do {round.animalName}?</Text>
            </View>

            <View style={styles.puzzleArea}>
              <View style={styles.puzzleTop}>
                <Text style={styles.puzzleEmoji}>{round.topHalf}</Text>
              </View>
              <View style={styles.puzzleBottomPlaceholder}>
                <Text style={styles.placeholderText}>?</Text>
              </View>
            </View>

            <View style={styles.optionsGrid}>
              {round.bottomOptions.map((opt, idx) => (
                <TouchableOpacity key={idx} onPress={() => handlePress(opt)} style={styles.optionButtonOuter} activeOpacity={0.8}>
                  <LinearGradient colors={['#E0F7FA', '#B2EBF2']} style={styles.optionButtonInner}>
                    <Text style={styles.optionEmoji}>{opt}</Text>
                  </LinearGradient>
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
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 3,
    borderColor: '#4CAF50',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  instructionText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  puzzleArea: {
    alignItems: 'center',
    marginBottom: 40,
  },
  puzzleTop: {
    width: 140,
    height: 100,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#CCC',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  puzzleBottomPlaceholder: {
    width: 140,
    height: 100,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#CCC',
    borderStyle: 'dashed',
  },
  puzzleEmoji: {
    fontSize: 70,
  },
  placeholderText: {
    fontSize: 50,
    color: '#999',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
  },
  optionButtonOuter: {
    width: 100,
    height: 100,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    backgroundColor: '#FFF',
  },
  optionButtonInner: {
    flex: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#4CAF50',
  },
  optionEmoji: {
    fontSize: 60,
  }
});
