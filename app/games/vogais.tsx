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

const LEVELS = [
  { id: 1, wordBase: 'P _ T O',   wordFull: 'P A T O',   missingVowel: 'A', image: '🦆', options: ['A', 'E', 'I', 'O', 'U'] },
  { id: 2, wordBase: 'L _ V R O', wordFull: 'L I V R O', missingVowel: 'I', image: '📚', options: ['A', 'E', 'I', 'O', 'U'] },
  { id: 3, wordBase: 'U R S _',   wordFull: 'U R S O',   missingVowel: 'O', image: '🐻', options: ['A', 'E', 'I', 'O', 'U'] },
  { id: 4, wordBase: 'B O L _',   wordFull: 'B O L A',   missingVowel: 'A', image: '⚽', options: ['A', 'E', 'I', 'O', 'U'] },
  { id: 5, wordBase: 'P _ I X E', wordFull: 'P E I X E', missingVowel: 'E', image: '🐟', options: ['A', 'E', 'I', 'O', 'U'] },
  { id: 6, wordBase: 'S _ P O',   wordFull: 'S A P O',   missingVowel: 'A', image: '🐸', options: ['A', 'E', 'I', 'O', 'U'] },
];

const AnswerButton = ({ text, gradient, onPress, disabled }) => (
  <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={gameStyles.answerBtnOuter} disabled={disabled}>
    <LinearGradient colors={gradient} style={gameStyles.answerBtnGradient}>
      <View style={gameStyles.answerBtnGloss} />
      <Text style={gameStyles.answerBtnText}>{text}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

export default function VogaisGame() {
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const { isLibrasActive } = useAccessibility();
  const { playSuccess, playError, speakText } = useAudio();

  const level = LEVELS[currentIdx];

  useEffect(() => {
    const timer = setTimeout(() => {
      speakText(`Qual é a vogal que falta em: ${level.wordFull}?`);
    }, 800);
    return () => clearTimeout(timer);
  }, [currentIdx]);

  const handleAnswer = (vowel) => {
    if (vowel === level.missingVowel) {
      setFeedback('correct');
      playSuccess();
      setScore(s => s + 10);
      setTimeout(() => {
        if (currentIdx < LEVELS.length - 1) {
          setCurrentIdx(currentIdx + 1);
          setFeedback(null);
        } else {
          speakText(`Parabéns! Você completou o jardim das vogais com ${score + 10} pontos!`);
          Alert.alert('🌺 MUITO BEM!', `Jardim das Vogais concluído!\n${score + 10} pontos!`, [
            { text: 'Voltar ao Mapa', onPress: () => router.push('/') },
          ]);
        }
      }, 1500);
    } else {
      setFeedback('wrong');
      playError();
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  return (
    <ImageBackground source={require('../../assets/images/bg_escola.jpg')} style={gameStyles.background} resizeMode="cover" blurRadius={3}>
      <StatusBar hidden />

      {/* HUD */}
      <SafeAreaView edges={["top"]}>
        <LinearGradient colors={['#009432', '#12CBC4', '#4D96FF']} style={gameStyles.hud}>
        <TouchableOpacity onPress={() => router.push('/')} style={gameStyles.hudBackBtn}>
          <Ionicons name="arrow-back" size={26} color="#FFF" />
        </TouchableOpacity>
        <View style={gameStyles.hudCenter}>
          <Text style={gameStyles.hudTitle}>🌺 JARDIM DAS VOGAIS</Text>
          <View style={gameStyles.hudBadge}>
            <Text style={gameStyles.hudBadgeText}>Palavra {currentIdx + 1} de {LEVELS.length}</Text>
          </View>
          <View style={gameStyles.progressContainer}>
            {LEVELS.map((_, i) => (
              <View key={i} style={[gameStyles.progressDot, i < currentIdx && gameStyles.progressDotDone, i === currentIdx && gameStyles.progressDotActive]} />
            ))}
          </View>
        </View>
        <View style={gameStyles.hudScore}>
          <Text style={gameStyles.hudScoreLabel}>PONTOS</Text>
          <Text style={gameStyles.hudScoreValue}>{score}</Text>
        </View>
        </LinearGradient>
      </SafeAreaView>

      {isLibrasActive && <LibrasSign text={level.missingVowel} />}

      <View style={gameStyles.gameArea}>
        {/* Instrução */}
        <View style={gameStyles.instructionCard}>
          <FontAwesome5 name="volume-up" size={22} color="#009432" />
          <Text style={gameStyles.instructionText}>Qual é a vogal que falta?</Text>
        </View>

        {/* Imagem */}
        <View style={[gameStyles.imageBox, { borderColor: '#12CBC4' }]}>
          <Text style={gameStyles.imageBoxEmoji}>{level.image}</Text>
        </View>

        {/* Palavra */}
        <View style={gameStyles.wordDisplay}>
          <Text style={gameStyles.wordDisplayText}>
            {feedback === 'correct' ? level.wordFull : level.wordBase}
          </Text>
        </View>

        {/* Feedback */}
        <View style={gameStyles.feedbackArea}>
          {feedback === 'correct' && <Text style={gameStyles.feedbackCorrect}>✨ CERTO! ✨</Text>}
          {feedback === 'wrong' && <Text style={gameStyles.feedbackWrong}>😅 Tente outra vez!</Text>}
        </View>

        {/* Botões */}
        <View style={gameStyles.optionsRow}>
          {level.options.map((opt, i) => (
            <AnswerButton key={i} text={opt} gradient={OPTION_GRADIENTS[i % OPTION_GRADIENTS.length]} onPress={() => handleAnswer(opt)} disabled={feedback === 'correct'} />
          ))}
        </View>
      </View>
    </ImageBackground>
  );
}
