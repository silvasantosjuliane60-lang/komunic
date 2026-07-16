// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAudio } from '../../hooks/useAudio';
import { gameStyles, OPTION_GRADIENTS } from '../../constants/GameStyles';

const QUESTIONS = [
  { id: 1, word: 'MACACO', article: 'o', options: [{ id: 'a', img: '🐶' }, { id: 'b', img: '🐒' }, { id: 'c', img: '🐱' }], correct: 'b' },
  { id: 2, word: 'AVIÃO',  article: 'o', options: [{ id: 'a', img: '✈️' }, { id: 'b', img: '🚗' }, { id: 'c', img: '⛵' }], correct: 'a' },
  { id: 3, word: 'BOLA',   article: 'a', options: [{ id: 'a', img: '🍎' }, { id: 'b', img: '🎈' }, { id: 'c', img: '⚽' }], correct: 'c' },
  { id: 4, word: 'SAPATO', article: 'o', options: [{ id: 'a', img: '👞' }, { id: 'b', img: '👒' }, { id: 'c', img: '👖' }], correct: 'a' },
  { id: 5, word: 'CASA',   article: 'a', options: [{ id: 'a', img: '⛺' }, { id: 'b', img: '🏠' }, { id: 'c', img: '🏰' }], correct: 'b' },
  { id: 6, word: 'SOL',    article: 'o', options: [{ id: 'a', img: '🌧️' }, { id: 'b', img: '🌙' }, { id: 'c', img: '☀️' }], correct: 'c' },
];

const AnswerButton = ({ text, gradient, onPress, disabled }) => (
  <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={gameStyles.answerBtnOuter} disabled={disabled}>
    <LinearGradient colors={gradient} style={gameStyles.answerBtnGradient}>
      <View style={gameStyles.answerBtnGloss} />
      <Text style={{ fontSize: 55 }}>{text}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

export default function PalavrasGame() {
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const { playSuccess, playError, speakText, stopSpeech } = useAudio();
  const question = QUESTIONS[currentIdx];

  useEffect(() => {
    const timer = setTimeout(() => {
      stopSpeech();
      speakText(`Ache ${question.article} ${question.word}`);
    }, 800);
    return () => clearTimeout(timer);
  }, [currentIdx]);

  const handleAnswer = (optionId) => {
    if (optionId === question.correct) {
      setFeedback('correct');
      playSuccess();
      setScore(s => s + 20);
      setTimeout(() => {
        if (currentIdx < QUESTIONS.length - 1) {
          setCurrentIdx(currentIdx + 1);
          setFeedback(null);
        } else {
          speakText(`Parabéns! Você completou a Floresta das Palavras!`);
          Alert.alert('🌳 PARABÉNS!', `Floresta das Palavras concluída!\n${score + 20} pontos!`, [
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
      <LinearGradient colors={['#B983FF', '#8649CB', '#4D96FF']} style={gameStyles.hud}>
        <TouchableOpacity onPress={() => router.push('/')} style={gameStyles.hudBackBtn}>
          <Ionicons name="arrow-back" size={26} color="#FFF" />
        </TouchableOpacity>
        <View style={gameStyles.hudCenter}>
          <Text style={gameStyles.hudTitle}>🌳 FLORESTA DAS PALAVRAS</Text>
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

      <View style={gameStyles.gameArea}>
        {/* Instrução */}
        <View style={gameStyles.instructionCard}>
          <FontAwesome5 name="volume-up" size={22} color="#8649CB" />
          <Text style={gameStyles.instructionText}>Qual imagem é: {question.word}?</Text>
        </View>

        {/* Palavra em destaque */}
        <View style={gameStyles.wordDisplay}>
          <Text style={[gameStyles.wordDisplayText, { letterSpacing: 6, color: '#8649CB' }]}>{question.word}</Text>
        </View>

        {/* Feedback */}
        <View style={gameStyles.feedbackArea}>
          {feedback === 'correct' && <Text style={gameStyles.feedbackCorrect}>✨ ACERTOU! ✨</Text>}
          {feedback === 'wrong' && <Text style={gameStyles.feedbackWrong}>😅 Leia devagar!</Text>}
        </View>

        {/* Botões */}
        <View style={gameStyles.optionsRow}>
          {question.options.map((opt, i) => (
            <AnswerButton key={i} text={opt.img} gradient={OPTION_GRADIENTS[i % OPTION_GRADIENTS.length]} onPress={() => handleAnswer(opt.id)} disabled={feedback === 'correct'} />
          ))}
        </View>
      </View>
    </ImageBackground>
  );
}
