// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAudio } from '../../hooks/useAudio';
import { gameStyles, OPTION_GRADIENTS, GAME_COLORS } from '../../constants/GameStyles';

const SHAPES = { SQUARE: '🟦', CIRCLE: '🔴', TRIANGLE: '🔺' };

const LEVELS = [
  { id: 1, title: 'TORRE PEQUENA',  emoji: '🏗️',  blueprint: [SHAPES.SQUARE, SHAPES.TRIANGLE] },
  { id: 2, title: 'BONECO DE NEVE', emoji: '⛄',   blueprint: [SHAPES.CIRCLE, SHAPES.CIRCLE] },
  { id: 3, title: 'FOGUETE',        emoji: '🚀',  blueprint: [SHAPES.SQUARE, SHAPES.CIRCLE, SHAPES.TRIANGLE] },
  { id: 4, title: 'CASA GRANDE',    emoji: '🏠',  blueprint: [SHAPES.SQUARE, SHAPES.SQUARE, SHAPES.TRIANGLE] },
  { id: 5, title: 'CARRO',          emoji: '🚗',  blueprint: [SHAPES.CIRCLE, SHAPES.SQUARE, SHAPES.CIRCLE] },
  { id: 6, title: 'CASTELO',        emoji: '🏰',  blueprint: [SHAPES.SQUARE, SHAPES.SQUARE, SHAPES.SQUARE, SHAPES.TRIANGLE, SHAPES.TRIANGLE] },
];

const SHAPE_GRADIENTS = {
  [SHAPES.SQUARE]:   ['#4D96FF', '#2D6ECC'],
  [SHAPES.CIRCLE]:   ['#FF6B6B', '#EE5A24'],
  [SHAPES.TRIANGLE]: ['#FFC312', '#F79F1F'],
};

const ShapeButton = ({ shape, onPress, disabled }) => (
  <TouchableOpacity activeOpacity={0.8} onPress={() => onPress(shape)} style={gameStyles.answerBtnOuter} disabled={disabled}>
    <LinearGradient colors={SHAPE_GRADIENTS[shape]} style={gameStyles.answerBtnGradient}>
      <View style={gameStyles.answerBtnGloss} />
      <Text style={{ fontSize: 45 }}>{shape}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

export default function FormasGame() {
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [stacked, setStacked] = useState([]);
  const [feedback, setFeedback] = useState(null);

  const { playSuccess, playError, speakText } = useAudio();
  const level = LEVELS[currentIdx];

  useEffect(() => {
    const timer = setTimeout(() => {
      speakText(`Vamos construir: ${level.title}! Escolha as formas na ordem certa!`);
    }, 800);
    return () => clearTimeout(timer);
  }, [currentIdx]);

  const handleShapePress = (shape) => {
    const targetShape = level.blueprint[stacked.length];
    if (shape === targetShape) {
      setFeedback('correct');
      playSuccess();
      const newStacked = [...stacked, shape];
      setStacked(newStacked);
      setScore(s => s + 5);

      if (newStacked.length === level.blueprint.length) {
        setTimeout(() => {
          if (currentIdx < LEVELS.length - 1) {
            setCurrentIdx(currentIdx + 1);
            setStacked([]);
            setFeedback(null);
          } else {
            speakText(`Parabéns! Você é um construtor mestre!`);
            Alert.alert('🏆 CONSTRUTOR MESTRE!', `Você construiu tudo!\n${score + 20} pontos!`, [
              { text: 'Voltar ao Mapa', onPress: () => router.push('/') },
            ]);
          }
        }, 1500);
      } else {
        setTimeout(() => setFeedback(null), 500);
      }
    } else {
      setFeedback('wrong');
      playError();
      setTimeout(() => setFeedback(null), 800);
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
          <Text style={gameStyles.hudTitle}>🏗️ CONSTRUTOR DE FORMAS</Text>
          <View style={gameStyles.hudBadge}>
            <Text style={gameStyles.hudBadgeText}>{level.emoji} {level.title}</Text>
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

      <View style={gameStyles.gameArea}>
        {/* Instrução */}
        <View style={gameStyles.instructionCard}>
          <Text style={{ fontSize: 28 }}>{level.emoji}</Text>
          <Text style={gameStyles.instructionText}>Monte: {level.title}!</Text>
        </View>

        {/* Zona de construção */}
        <View style={styles.constructionZone}>
          {[...level.blueprint].reverse().map((targetShape, reverseIdx) => {
            const realIdx = level.blueprint.length - 1 - reverseIdx;
            const isBuilt = realIdx < stacked.length;
            return (
              <View key={realIdx} style={[styles.blockContainer, !isBuilt && { opacity: 0.25 }]}>
                <Text style={{ fontSize: 70 }}>{targetShape}</Text>
              </View>
            );
          })}
        </View>

        {/* Feedback */}
        <View style={gameStyles.feedbackArea}>
          {feedback === 'correct' && <Text style={gameStyles.feedbackCorrect}>✨ ENCAIXOU! ✨</Text>}
          {feedback === 'wrong' && <Text style={gameStyles.feedbackWrong}>⚠️ Forma errada!</Text>}
        </View>

        {/* Botões de formas */}
        <View style={gameStyles.optionsRow}>
          <ShapeButton shape={SHAPES.SQUARE}   onPress={handleShapePress} disabled={feedback === 'correct' && stacked.length === level.blueprint.length} />
          <ShapeButton shape={SHAPES.CIRCLE}   onPress={handleShapePress} disabled={feedback === 'correct' && stacked.length === level.blueprint.length} />
          <ShapeButton shape={SHAPES.TRIANGLE} onPress={handleShapePress} disabled={feedback === 'correct' && stacked.length === level.blueprint.length} />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  constructionZone: {
    height: 240,
    width: 160,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderBottomWidth: 6,
    borderBottomColor: '#795548',
    borderRadius: 15,
    paddingBottom: 5,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  blockContainer: { marginVertical: -5 },
});
