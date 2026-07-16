// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAudio } from '../../hooks/useAudio';
import { gameStyles, OPTION_GRADIENTS } from '../../constants/GameStyles';

const QUESTIONS = [
  { id: 1, image: '👧🥛', sentenceParts: ['A MENINA', '___', 'O LEITE'], options: ['BEBEU', 'CORREU', 'PULOU'], correct: 'BEBEU' },
  { id: 2, image: '👦⚽', sentenceParts: ['O MENINO', '___', 'A BOLA'], options: ['COMEU', 'CHUTOU', 'DORMIU'], correct: 'CHUTOU' },
  { id: 3, image: '🐶🦴', sentenceParts: ['O CACHORRO', 'ROEU O', '___'], options: ['GATO', 'OSSO', 'CARRO'], correct: 'OSSO' },
  { id: 4, image: '👨‍🍳🍲', sentenceParts: ['O PAI', 'FEZ A', '___'], options: ['SOPA', 'MESA', 'ROUPA'], correct: 'SOPA' },
  { id: 5, image: '🐈🐭', sentenceParts: ['O GATO', 'VIU O', '___'], options: ['PATO', 'RATO', 'MATO'], correct: 'RATO' },
  { id: 6, image: '🦜🌳', sentenceParts: ['O PÁSSARO', 'VOOU NA', '___'], options: ['CASA', 'ÁRVORE', 'ÁGUA'], correct: 'ÁRVORE' },
];

const AnswerButton = ({ text, gradient, onPress, disabled }) => (
  <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={gameStyles.answerBtnOuter} disabled={disabled}>
    <LinearGradient colors={gradient} style={[gameStyles.answerBtnGradient, styles.wideBtn]}>
      <View style={gameStyles.answerBtnGloss} />
      <Text style={gameStyles.answerBtnTextSmall}>{text}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

export default function FrasesGame() {
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const { playSuccess, playError, speakText } = useAudio();
  const question = QUESTIONS[currentIdx];

  useEffect(() => {
    const timer = setTimeout(() => {
      const fullSentence = question.sentenceParts.join(' ');
      speakText(`Complete a frase: ${fullSentence.replace('___', 'lacuna')}`);
    }, 800);
    return () => clearTimeout(timer);
  }, [currentIdx]);

  const handleAnswer = (word) => {
    if (word === question.correct) {
      setFeedback('correct');
      playSuccess();
      setScore(s => s + 25);
      setTimeout(() => {
        if (currentIdx < QUESTIONS.length - 1) {
          setCurrentIdx(currentIdx + 1);
          setFeedback(null);
        } else {
          speakText(`Parabéns! Você completou a Vila das Frases!`);
          Alert.alert('📚 PARABÉNS!', `Vila das Frases concluída!\n${score + 25} pontos!`, [
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
        <LinearGradient colors={['#EE5A24', '#C44569', '#8E44AD']} style={gameStyles.hud}>
        <TouchableOpacity onPress={() => router.push('/')} style={gameStyles.hudBackBtn}>
          <Ionicons name="arrow-back" size={26} color="#FFF" />
        </TouchableOpacity>
        <View style={gameStyles.hudCenter}>
          <Text style={gameStyles.hudTitle}>📚 VILA DAS FRASES</Text>
          <View style={gameStyles.hudBadge}>
            <Text style={gameStyles.hudBadgeText}>Frase {currentIdx + 1} de {QUESTIONS.length}</Text>
          </View>
          <View style={gameStyles.progressContainer}>
            {QUESTIONS.map((_, i) => (
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

      <View style={gameStyles.gameArea}>
        {/* Instrução */}
        <View style={gameStyles.instructionCard}>
          <Text style={{ fontSize: 28 }}>{question.image}</Text>
          <Text style={gameStyles.instructionText}>Complete a frase:</Text>
        </View>

        {/* Frase */}
        <View style={styles.phraseBox}>
          {question.sentenceParts.map((part, i) => (
            <Text key={i} style={part === '___' ? styles.missingPart : styles.phrasePart}>
              {part}{i < question.sentenceParts.length - 1 ? ' ' : ''}
            </Text>
          ))}
        </View>

        {/* Feedback */}
        <View style={gameStyles.feedbackArea}>
          {feedback === 'correct' && <Text style={gameStyles.feedbackCorrect}>✨ CORRETO! ✨</Text>}
          {feedback === 'wrong' && <Text style={gameStyles.feedbackWrong}>🤔 Pense bem!</Text>}
        </View>

        {/* Botões */}
        <View style={gameStyles.optionsRow}>
          {question.options.map((opt, i) => (
            <AnswerButton key={i} text={opt} gradient={OPTION_GRADIENTS[i % OPTION_GRADIENTS.length]} onPress={() => handleAnswer(opt)} disabled={feedback === 'correct'} />
          ))}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  phraseBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 4,
    borderColor: '#EE5A24',
    marginBottom: 12,
    maxWidth: '95%',
    gap: 6,
    shadowColor: '#EE5A24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  phrasePart: {
    fontSize: 26,
    fontWeight: '900',
    color: '#2C2C54',
  },
  missingPart: {
    fontSize: 30,
    fontWeight: '900',
    color: '#EE5A24',
    textDecorationLine: 'underline',
  },
  wideBtn: {
    width: 140,
    height: 65,
    borderRadius: 18,
  },
});
