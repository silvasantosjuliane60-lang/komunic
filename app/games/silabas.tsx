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
  { id: 1, word: 'Vaca',    image: '🐄', parts: ['VA', '__'],       options: ['CA', 'TO', 'MA'], correct: 'CA' },
  { id: 2, word: 'Sapo',   image: '🐸', parts: ['SA', '__'],       options: ['PO', 'LA', 'BO'], correct: 'PO' },
  { id: 3, word: 'Macaco', image: '🐒', parts: ['MA', 'CA', '__'], options: ['CO', 'TO', 'BO'], correct: 'CO' },
  { id: 4, word: 'Banana', image: '🍌', parts: ['BA', 'NA', '__'], options: ['MA', 'NA', 'TA'], correct: 'NA' },
  { id: 5, word: 'Peixe',  image: '🐟', parts: ['PEI', '__'],      options: ['XE', 'TO', 'LA'], correct: 'XE' },
  { id: 6, word: 'Bicicleta', image: '🚲', parts: ['BI', 'CI', 'CLE', '__'], options: ['MA', 'TA', 'LA'], correct: 'TA' },
];

const AnswerButton = ({ text, gradient, onPress, disabled }) => (
  <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={gameStyles.answerBtnOuter} disabled={disabled}>
    <LinearGradient colors={gradient} style={[gameStyles.answerBtnGradient, styles.sylBtn]}>
      <View style={gameStyles.answerBtnGloss} />
      <Text style={styles.sylText}>{text}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

export default function SilabasGame() {
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [selectedSyllable, setSelectedSyllable] = useState(null);

  const { playSuccess, playError, speakText, stopSpeech, playPhoneme } = useAudio();
  const question = QUESTIONS[currentIdx];

  const playIntro = () => {
    stopSpeech();
    speakText(`Qual o pedacinho que falta na palavra ${question.word}?`);
  };

  useEffect(() => {
    const timer = setTimeout(() => playIntro(), 800);
    return () => { clearTimeout(timer); stopSpeech(); };
  }, [currentIdx]);

  const handleAnswer = (syllable) => {
    stopSpeech();
    playPhoneme(syllable, `Sílaba ${syllable}`);
    setSelectedSyllable(syllable);

    if (syllable === question.correct) {
      setFeedback('correct');
      playSuccess();
      setScore(s => s + 15);
      setTimeout(() => {
        if (currentIdx < QUESTIONS.length - 1) {
          setCurrentIdx(currentIdx + 1);
          setFeedback(null);
          setSelectedSyllable(null);
        } else {
          speakText(`Parabéns! Você completou o Vale das Sílabas!`);
          Alert.alert('🎉 PARABÉNS!', `Vale das Sílabas concluído!\n${score + 15} pontos!`, [
            { text: 'Voltar ao Mapa', onPress: () => router.push('/') },
          ]);
        }
      }, 1500);
    } else {
      setFeedback('wrong');
      playError();
      setTimeout(() => { setFeedback(null); setSelectedSyllable(null); }, 1000);
    }
  };

  return (
    <ImageBackground source={require('../../assets/images/bg_escola.jpg')} style={gameStyles.background} resizeMode="cover" blurRadius={3}>
      <StatusBar hidden />

      {/* HUD */}
      <SafeAreaView edges={["top"]}>
        <LinearGradient colors={['#FFC312', '#F79F1F', '#EE5A24']} style={gameStyles.hud}>
        <TouchableOpacity onPress={() => router.push('/')} style={gameStyles.hudBackBtn}>
          <Ionicons name="arrow-back" size={26} color="#FFF" />
        </TouchableOpacity>
        <View style={gameStyles.hudCenter}>
          <Text style={gameStyles.hudTitle}>🧩 VALE DAS SÍLABAS</Text>
          <View style={gameStyles.hudBadge}>
            <Text style={gameStyles.hudBadgeText}>Palavra {currentIdx + 1} de {QUESTIONS.length}</Text>
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
        <TouchableOpacity style={gameStyles.instructionCard} onPress={playIntro} activeOpacity={0.8}>
          <FontAwesome5 name="volume-up" size={22} color="#F79F1F" />
          <Text style={gameStyles.instructionText}>Qual pedacinho falta?</Text>
        </TouchableOpacity>

        {/* Emoji */}
        <View style={[gameStyles.imageBox, { borderColor: '#F79F1F', width: 150, height: 150 }]}>
          <Text style={{ fontSize: 90 }}>{question.image}</Text>
        </View>

        {/* Palavra com sílabas */}
        <View style={styles.wordRow}>
          {question.parts.map((part, index) => {
            const isMissing = part === '__';
            let displayText = part;
            let partStyle = styles.syllablePart;
            if (isMissing) {
              if (feedback === 'correct') { displayText = question.correct; partStyle = styles.syllableCorrect; }
              else if (feedback === 'wrong') { displayText = selectedSyllable || '_'; partStyle = styles.syllableWrong; }
              else { displayText = '?'; partStyle = styles.syllableMissing; }
            }
            return (
              <View key={index} style={styles.syllableBox}>
                <Text style={partStyle}>{displayText}</Text>
              </View>
            );
          })}
        </View>

        {/* Feedback */}
        <View style={gameStyles.feedbackArea}>
          {feedback === 'correct' && <Text style={gameStyles.feedbackCorrect}>✨ ARRASOU! ✨</Text>}
          {feedback === 'wrong' && <Text style={gameStyles.feedbackWrong}>😅 Quase!</Text>}
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
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  syllableBox: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  syllablePart: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  syllableMissing: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFC312',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  syllableCorrect: {
    fontSize: 36,
    fontWeight: '900',
    color: '#6BCB77',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  syllableWrong: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FF6B6B',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  sylBtn: {
    width: 110,
    height: 70,
    borderRadius: 18,
  },
  sylText: {
    color: '#FFF',
    fontSize: 30,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
});
