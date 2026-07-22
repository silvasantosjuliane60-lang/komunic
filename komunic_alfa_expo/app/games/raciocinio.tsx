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
import { LOGIC_GAMES_DATA, LogicGameData } from '../../constants/LogicGameData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function RaciocinioGame() {
  const router = useRouter();
  const { track } = useLocalSearchParams<{ track: string }>();
  const trackId = track || '1';
  
  const { playSuccess, playError, speakText, stopSpeech } = useAudio();
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  // New state for tracking the current challenge index
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Get the array of games for the current track
  const gamesList = LOGIC_GAMES_DATA[trackId] || LOGIC_GAMES_DATA['1'];
  
  // To handle shadowMatch shuffle, we keep track of the game data in state
  const [gameData, setGameData] = useState<LogicGameData>(gamesList[0]);

  useEffect(() => {
    loadCurrentGame();
  }, [currentQuestionIndex, trackId]);

  const loadCurrentGame = () => {
    const initialGameData = gamesList[currentQuestionIndex];

    if (initialGameData.gameType === 'shadowMatch') {
      // Shuffle options and pick the first one as the animal to guess
      const shuffledOptions = [...initialGameData.options].sort(() => 0.5 - Math.random());
      const randomAnimal = shuffledOptions[0];

      setGameData({
        ...initialGameData,
        items: [randomAnimal],
        correctAnswer: randomAnimal,
      });
    } else {
      setGameData(initialGameData);
    }
  };

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
          alert('PARABÉNS! Raciocínio afiado!');
          router.back();
        } else {
          // Go to next challenge
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

    if (gameData.gameType === 'oddOneOut') {
      return (
        <View style={styles.oddOneOutVisual}>
          <Ionicons name="search" size={80} color="rgba(255,255,255,0.7)" />
        </View>
      );
    }

    if (gameData.gameType === 'shadowMatch') {
      return (
        <View style={styles.shadowVisualizerContainer}>
          <Text style={styles.shadowText}>
            {gameData.items[0]}
          </Text>
        </View>
      );
    }

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
          colors={['#FFC312', '#F79F1F', '#EE5A24']}
          style={gameStyles.hud}
        >
          <TouchableOpacity onPress={() => router.back()} style={gameStyles.hudBackBtn}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>

          <View style={gameStyles.hudCenter}>
            <Text style={gameStyles.hudTitle}>🧠 DESAFIO LÓGICO</Text>
            <View style={gameStyles.hudBadge}>
              <Ionicons name="bulb" size={14} color="#FFEB3B" />
              <Text style={gameStyles.hudBadgeText}>TRILHA {trackId} - {currentQuestionIndex + 1}/{gamesList.length}</Text>
            </View>
          </View>

          <GameInfoButton gameKey="raciocinio" style={null} />
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.instructionContainer}>
            <Text style={styles.instructionText}>{gameData.instruction}</Text>
            <TouchableOpacity onPress={() => speakText(gameData.instruction)} style={styles.audioButton}>
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
              
              let bgColor = Colors.blueButtonGradient[1];
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
              style={styles.retryButton}
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
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 20,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: Colors.blueButtonGradient[1],
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
    color: Colors.blueButtonGradient[1],
    textAlign: 'center',
  },
  audioButton: {
    backgroundColor: Colors.orangeButtonGradient[0],
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
    gap: 15,
  },
  sequenceBox: {
    width: 70,
    height: 70,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#4CAF50',
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
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
  },
  sequenceTextQuestion: {
    color: '#757575',
  },
  oddOneOutVisual: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadowVisualizerContainer: {
    width: 150,
    height: 150,
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  shadowText: {
    fontSize: 100,
    color: 'rgba(0,0,0,0.05)', 
    textShadowColor: 'black',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
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
    backgroundColor: Colors.orangeButtonGradient[1],
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
