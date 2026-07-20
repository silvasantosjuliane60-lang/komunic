// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAudio } from '../../hooks/useAudio';
import { gameStyles } from '../../constants/GameStyles';

const CARDS_DATA = ['🐶', '🐱', '🐭', '🐰', '🦊', '🐻'];

export default function MemoriaGame() {
  const router = useRouter();
  const { level } = useLocalSearchParams();
  const gameLevel = Number(level) || 1;

  const { playSuccess, playError, speakText, stopSpeech } = useAudio();
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    initializeGame();
  }, [gameLevel]);

  const initializeGame = () => {
    // Definir quantos pares baseado no nível
    const numPairs = gameLevel === 1 ? 2 : gameLevel === 2 ? 3 : 4;
    const selectedEmojis = [...CARDS_DATA].sort(() => Math.random() - 0.5).slice(0, numPairs);
    
    // Duplicar e embaralhar
    const deck = [...selectedEmojis, ...selectedEmojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, idx) => ({ id: idx, emoji }));
    setCards(deck);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setScore(0);

    setTimeout(() => {
      stopSpeech();
      speakText('Encontre os pares iguais!');
    }, 800);
  };

  const handleCardPress = (index) => {
    if (flippedIndices.length === 2 || flippedIndices.includes(index) || matchedPairs.includes(index)) {
      return;
    }

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const [firstIndex, secondIndex] = newFlipped;
      if (cards[firstIndex].emoji === cards[secondIndex].emoji) {
        // Match!
        setTimeout(() => {
          setMatchedPairs(prev => [...prev, firstIndex, secondIndex]);
          setFlippedIndices([]);
          setScore(s => s + 10);
          playSuccess();
          
          if (matchedPairs.length + 2 === cards.length) {
            speakText('Parabéns! Você encontrou todos os pares!');
            Alert.alert('🏆 VENCEU!', 'Você completou o jogo da memória!', [
              { text: 'Jogar Novamente', onPress: initializeGame },
              { text: 'Sair', onPress: () => router.push('/') }
            ]);
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setFlippedIndices([]);
          playError();
        }, 1000);
      }
    }
  };

  return (
    <ImageBackground source={require('../../assets/images/bg_escola.jpg')} style={gameStyles.background} blurRadius={3}>
      <StatusBar hidden />
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <LinearGradient colors={['#FF9800', '#F57C00', '#E65100']} style={gameStyles.hud}>
          <TouchableOpacity onPress={() => router.push('/')} style={gameStyles.hudBackBtn}>
            <Ionicons name="arrow-back" size={26} color="#FFF" />
          </TouchableOpacity>
          <View style={gameStyles.hudCenter}>
            <Text style={gameStyles.hudTitle}>🎴 JOGO DA MEMÓRIA</Text>
            <View style={gameStyles.hudBadge}>
              <Text style={gameStyles.hudBadgeText}>NÍVEL {gameLevel}</Text>
            </View>
          </View>
          <View style={gameStyles.hudScore}>
            <Text style={gameStyles.hudScoreLabel}>PONTOS</Text>
            <Text style={gameStyles.hudScoreValue}>{score}</Text>
          </View>
        </LinearGradient>

        <View style={styles.board}>
          {cards.map((card, index) => {
            const isFlipped = flippedIndices.includes(index) || matchedPairs.includes(index);
            const isMatched = matchedPairs.includes(index);
            return (
              <TouchableOpacity
                key={card.id}
                style={[styles.card, isMatched && styles.cardMatched]}
                onPress={() => handleCardPress(index)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={isFlipped ? ['#FFF', '#F5F5F5'] : ['#2196F3', '#1976D2']}
                  style={styles.cardGradient}
                >
                  <Text style={[styles.cardEmoji, { opacity: isFlipped ? 1 : 0 }]}>
                    {card.emoji}
                  </Text>
                  {!isFlipped && <Ionicons name="help-circle" size={40} color="rgba(255,255,255,0.5)" style={styles.cardBackIcon} />}
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  board: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    gap: 12,
    padding: 20,
  },
  card: {
    width: '28%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    marginBottom: 10,
  },
  cardMatched: {
    opacity: 0.6,
  },
  cardGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.8)',
    borderRadius: 16,
  },
  cardEmoji: {
    fontSize: 55,
  },
  cardBackIcon: {
    position: 'absolute',
  }
});
