import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAudio } from '../../hooks/useAudio';
import { Colors } from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { gameStyles } from '../../constants/GameStyles';
import { GameInfoButton } from '../../components/GameIntro';
import { MathGameData, MATH_GAMES_DATA } from '../../constants/MathGameData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function MatematicaGame() {
  const router = useRouter();
  const { track } = useLocalSearchParams<{ track: string }>();
  const trackId = track || '1';
  
  const { playSuccess, playError, speakText, stopSpeech } = useAudio();
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const gamesList = MATH_GAMES_DATA[trackId] || MATH_GAMES_DATA['1'];
  
  const [gameData, setGameData] = useState<MathGameData>(gamesList[0]);

  useEffect(() => {
    setGameData(gamesList[currentQuestionIndex]);
  }, [currentQuestionIndex, trackId]);

  useEffect(() => {
    if (!gameData) return;
    const timer = setTimeout(() => {
      stopSpeech();
      speakText(gameData.instruction);
    }, 800);
    return () => clearTimeout(timer);
  }, [gameData]);

  const checkAnswer = (option: string) => {
    if (hasAnswered || !gameData) return;
    
    setHasAnswered(true);
    setSelectedOption(option);
    
    if (option === gameData.correctAnswer) {
      setIsCorrect(true);
      playSuccess();
      setTimeout(() => {
        const isLastQuestion = currentQuestionIndex === gamesList.length - 1;
        if (isLastQuestion) {
          alert('PARABÉNS! Gênio da Matemática!');
          router.back();
        } else {
          setCurrentQuestionIndex(prev => prev + 1);
          setHasAnswered(false);
          setSelectedOption(null);
          setIsCorrect(false);
        }
      }, 1500);
    } else {
      setIsCorrect(false);
      playError();
    }
  };

  const renderVisualizer = () => {
    if (!gameData) return null;

    if (gameData.gameType === 'counting') {
      return (
        <View style={styles.countingContainer}>
          {gameData.items.map((item, index) => (
            <Text key={index} style={styles.countingItem}>{item}</Text>
          ))}
        </View>
      );
    }

    // 3 itens com tamanhos diferentes (ex: 3 copos de leite)
    if (gameData.gameType === 'sizeThree') {
      const threeItems = gameData.threeItems || [];
      const sizes = gameData.itemSizes || [40, 60, 90];
      const labels = ['1', '2', '3'];
      return (
        <View style={styles.sizeThreeWrapper}>
          {threeItems.map((item, i) => (
            <View key={i} style={styles.sizeThreeItem}>
              {/* Rótulo numérico */}
              <View style={styles.sizeThreeLabel}>
                <Text style={styles.sizeLabelText}>{labels[i]}</Text>
              </View>
              {/* O copo em tamanhos crescentes */}
              <Text style={{ fontSize: sizes[i], lineHeight: sizes[i] * 1.2 }}>{item}</Text>
            </View>
          ))}
        </View>
      );
    }

    if (gameData.gameType === 'size' || gameData.gameType === 'comparison') {
      const left = gameData.leftItems || [];
      const right = gameData.rightItems || [];
      // For size: show single emoji but at different font sizes to convey bigness
      const leftFontSize = gameData.gameType === 'size' ? 90 : 45;
      const rightFontSize = gameData.gameType === 'size' ? 55 : 45;

      return (
        <View style={styles.comparisonWrapper}>
          {/* LEFT SIDE */}
          <View style={styles.comparisonSide}>
            <View style={styles.comparisonItemsBox}>
              {left.map((item, i) => (
                <Text key={i} style={[styles.comparisonItem, { fontSize: leftFontSize }]}>{item}</Text>
              ))}
            </View>
          </View>

          {/* VS */}
          <View style={styles.vsCircle}>
            <Text style={styles.vsText}>VS</Text>
          </View>

          {/* RIGHT SIDE */}
          <View style={styles.comparisonSide}>
            <View style={styles.comparisonItemsBox}>
              {right.map((item, i) => (
                <Text key={i} style={[styles.comparisonItem, { fontSize: rightFontSize }]}>{item}</Text>
              ))}
            </View>
          </View>
        </View>
      );
    }

    // Default: Sequence visualizer
    return (
      <View style={styles.sequenceContainer}>
        {gameData.items.map((item, index) => {
          const isQuestionMark = item === '?';
          return (
            <View key={index} style={[styles.sequenceBox, isQuestionMark && styles.sequenceBoxQuestion]}>
              <Text style={[styles.sequenceText, isQuestionMark && styles.sequenceTextQuestion]}>
                {isQuestionMark && isCorrect ? gameData.correctAnswer : item}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  if (!gameData) return null;

  return (
    <ImageBackground source={require('../../assets/images/bg_escola.jpg')} style={styles.background} blurRadius={3}>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <LinearGradient
          colors={['#009432', '#12CBC4', '#4D96FF']}
          style={gameStyles.hud}
        >
          <TouchableOpacity onPress={() => router.back()} style={gameStyles.hudBackBtn}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>

          <View style={gameStyles.hudCenter}>
            <Text style={gameStyles.hudTitle}>🧮 DESAFIO MATEMÁTICO</Text>
            <View style={gameStyles.hudBadge}>
              <Ionicons name="calculator" size={14} color="#FFF" />
              <Text style={[gameStyles.hudBadgeText, { color: '#FFF' }]}>TRILHA {trackId} - {currentQuestionIndex + 1}/{gamesList.length}</Text>
            </View>
          </View>
        </LinearGradient>

          <GameInfoButton gameKey="matematica" style={null} />

        <View style={styles.content}>
          <View style={[styles.instructionContainer, { borderColor: '#12CBC4' }]}>
            <Text style={[styles.instructionText, { color: '#009432' }]}>{gameData.instruction}</Text>
            <TouchableOpacity onPress={() => speakText(gameData.instruction)} style={[styles.audioButton, { backgroundColor: '#12CBC4' }]}>
              <Ionicons name="volume-medium" size={32} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.visualArea}>
            {renderVisualizer()}
          </View>

          <View style={styles.optionsContainer}>
            {gameData.options.map((option, idx) => {
              const isSelected = selectedOption === option;
              const isThisCorrect = option === gameData.correctAnswer;
              
              let bgColor = '#4D96FF';
              if (hasAnswered && isSelected) {
                bgColor = isThisCorrect ? '#4CAF50' : '#F44336';
              } else if (hasAnswered && isThisCorrect) {
                bgColor = '#4CAF50';
              } else if (hasAnswered) {
                bgColor = '#9E9E9E';
              }

              return (
                <TouchableOpacity 
                  key={idx} 
                  style={[styles.optionButton, { backgroundColor: bgColor }]}
                  onPress={() => checkAnswer(option)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {hasAnswered && !isCorrect && (
            <TouchableOpacity 
              style={[styles.retryButton, { backgroundColor: '#F44336' }]}
              onPress={() => {
                setHasAnswered(false);
                setSelectedOption(null);
                setIsCorrect(false);
              }}
            >
              <Ionicons name="refresh" size={24} color="#FFF" />
              <Text style={styles.retryText}>TENTAR NOVAMENTE</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  instructionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 20,
    borderRadius: 20,
    borderWidth: 3,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    maxWidth: SCREEN_WIDTH * 0.9,
  },
  instructionText: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  audioButton: {
    padding: 10,
    borderRadius: 50,
    marginLeft: 15,
  },
  visualArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  sequenceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },
  sequenceBox: {
    width: 75,
    height: 75,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#009432',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  sequenceBoxQuestion: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderColor: '#9E9E9E',
    borderStyle: 'dashed',
  },
  sequenceText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#333',
  },
  sequenceTextQuestion: {
    color: '#757575',
  },
  countingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    maxWidth: SCREEN_WIDTH * 0.8,
  },
  countingItem: {
    fontSize: 50,
  },
  sizeThreeWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    width: '100%',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  sizeThreeItem: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  sizeThreeLabel: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#009432',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  sizeLabelText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  comparisonWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 10,
  },
  comparisonSide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 20,
    padding: 12,
    minHeight: 130,
  },
  comparisonItemsBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  comparisonItem: {
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  vsCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EE5A24',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 60,
  },
  optionButton: {
    minWidth: 80,
    height: 80,
    paddingHorizontal: 15,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  optionText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  retryButton: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  retryText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
