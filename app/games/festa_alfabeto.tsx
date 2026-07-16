// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Animated, Easing, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAudio } from '../../hooks/useAudio';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { LIBRAS_DICTIONARY } from '../../components/LibrasSign';
import { Colors } from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { gameStyles } from '../../constants/GameStyles';
import { GameInfoButton } from '../../components/GameIntro';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const LEVELS = [
  ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'],
  ['N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
];

const BALLOON_COLORS = [
  ['#FF5252', '#D32F2F'],
  ['#4CAF50', '#2E7D32'],
  ['#2196F3', '#1565C0'],
  ['#FFEB3B', '#FBC02D'],
  ['#9C27B0', '#6A1B9A'],
  ['#FF9800', '#EF6C00'],
];

// Componente para animar um balão flutuando
const Balloon = ({ id, letter, color, onPop, isTarget, isLibrasActive }) => {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT + 100)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const [popped, setPopped] = useState(false);

  useEffect(() => {
    // Sobe o balão
    const duration = isTarget ? 7000 + Math.random() * 2000 : 5000 + Math.random() * 3000;
    Animated.timing(translateY, {
      toValue: -200,
      duration: duration,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && !popped) {
        onPop(id, false); // Acabou o tempo e não foi estourado
      }
    });
  }, []);

  const handlePress = () => {
    if (popped) return;
    setPopped(true);
    
    // Animação de estouro
    Animated.timing(opacity, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      onPop(id, letter);
    });
  };

  if (popped) return null;

  // Usa a cor base do gradiente para o nó do balão
  const knotColor = color[0];

  return (
    <Animated.View style={[styles.balloonContainer, { transform: [{ translateY }], opacity }]}>
      <TouchableOpacity activeOpacity={0.9} onPress={handlePress}>
        <LinearGradient colors={color} style={styles.balloon}>
           <View style={styles.balloonGloss} />
           <Text style={styles.balloonText}>{letter}</Text>
           {isLibrasActive && <Text style={styles.balloonLibrasEmoji}>{LIBRAS_DICTIONARY[letter] || '🧏‍♀️'}</Text>}
        </LinearGradient>
        {/* Nó do balão */}
        <View style={[styles.balloonKnot, { borderBottomColor: knotColor }]} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function FestaAlfabetoGame() {
  const router = useRouter();
  const { playSuccess, playError, speakText, stopSpeech } = useAudio();
  const { isLibrasActive } = useAccessibility();
  
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [collected, setCollected] = useState<string[]>([]);
  const [balloons, setBalloons] = useState<any[]>([]);

  const targets = LEVELS[currentLevel];
  const nextBalloonId = useRef(0);
  const spawnTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      stopSpeech();
      speakText('Estoure os balões para pegar as letras que faltam!');
    }, 1000);
    return () => clearTimeout(timer);
  }, [currentLevel]);

  // Spawner de balões
  useEffect(() => {
    spawnTimer.current = setInterval(() => {
      spawnBalloon();
    }, 700); // Mais balões aparecendo rápido (era 1200)

    return () => {
      if (spawnTimer.current) clearInterval(spawnTimer.current);
    };
  }, [currentLevel, collected]);

  const spawnBalloon = () => {
    // Escolhe se vai spawnar uma letra que falta ou uma letra aleatória
    const missingTargets = targets.filter(t => !collected.includes(t));
    if (missingTargets.length === 0) return;

    const isTarget = Math.random() > 0.25; // 75% de chance de ser uma letra útil
    let letter = '';
    
    if (isTarget) {
      letter = missingTargets[Math.floor(Math.random() * missingTargets.length)];
    } else {
      // Letra aleatória que não está nos missingTargets
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
      letter = alphabet[Math.floor(Math.random() * alphabet.length)];
    }

    const color = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
    const leftPos = 20 + Math.random() * (SCREEN_WIDTH - 120); // Posição horizontal aleatória (mantendo margem)

    const newBalloon = {
      id: nextBalloonId.current++,
      letter,
      color,
      isTarget,
      left: leftPos,
    };

    setBalloons(prev => [...prev, newBalloon]);
  };

  const handlePop = (id, letter) => {
    setBalloons(prev => prev.filter(b => b.id !== id));

    if (!letter) return; // Só sumiu da tela por passar do limite

    const missingTargets = targets.filter(t => !collected.includes(t));
    
    if (missingTargets.includes(letter)) {
      playSuccess();
      setScore(s => s + 10);
      const newCollected = [...collected, letter];
      setCollected(newCollected);
      
      // Checa se completou o level
      if (newCollected.length === targets.length) {
        setTimeout(() => {
          if (currentLevel < LEVELS.length - 1) {
            setCurrentLevel(c => c + 1);
            setCollected([]);
            setBalloons([]);
          } else {
            alert('PARABÉNS! VOCÊ COMPLETOU TODO O ALFABETO!');
            router.back();
          }
        }, 1500);
      }
    } else {
      playError();
    }
  };

  return (
    <ImageBackground source={require('../../assets/images/bg_escola.jpg')} style={styles.background} blurRadius={3}>

      {/* ─── HUD (position absolute, zIndex 100) ─── */}
      <SafeAreaView edges={["top"]}>
        <LinearGradient
          colors={['#FF6B6B', '#EE5A24', '#FFC312']}
          style={[gameStyles.hud, styles.hudAbsolute]}
        >
        <TouchableOpacity onPress={() => router.back()} style={gameStyles.hudBackBtn}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>

        <View style={gameStyles.hudCenter}>
          <Text style={gameStyles.hudTitle}>🎈 FESTA DO ALFABETO</Text>
          <View style={gameStyles.hudBadge}>
            <Ionicons name="layers" size={14} color="#FFEB3B" />
            <Text style={gameStyles.hudBadgeText}>NÍVEL {currentLevel + 1}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <GameInfoButton gameKey="fonico" style={{ marginRight: 8 }} />
          <View style={gameStyles.hudScore}>
            <Text style={gameStyles.hudScoreLabel}>PONTOS</Text>
            <Text style={gameStyles.hudScoreValue}>{score}</Text>
          </View>
        </View>
        </LinearGradient>
      </SafeAreaView>

      {/* PAINEL DE LETRAS */}
      <View style={styles.panelContainer}>
        <View style={styles.lettersRow}>
          {targets.map((target, idx) => {
            const isCollected = collected.includes(target);
            return (
              <View key={idx} style={[styles.targetSlot, isCollected && styles.targetSlotCollected]}>
                <Text style={[styles.targetLetter, isCollected && styles.targetLetterCollected]}>
                  {isCollected ? target : '?'}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* ÁREA DE BALÕES */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
        {balloons.map(b => (
          <View key={b.id} style={{ position: 'absolute', left: b.left, bottom: -100 }} pointerEvents="box-none">
            <Balloon
              id={b.id}
              letter={b.letter}
              color={b.color}
              isTarget={b.isTarget}
              isLibrasActive={isLibrasActive}
              onPop={handlePop}
            />
          </View>
        ))}
      </View>

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  hudAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  panelContainer: { marginTop: 110, alignItems: 'center', zIndex: 50 },
  lettersRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.9)', padding: 10, borderRadius: 20, borderWidth: 4, borderColor: Colors.blueButtonGradient[1], shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 5, elevation: 10, marginHorizontal: 15 },
  targetSlot: { width: 45, height: 45, backgroundColor: '#E0E0E0', borderRadius: 12, borderWidth: 3, borderColor: '#BDBDBD', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  targetSlotCollected: { backgroundColor: Colors.playButtonGradient[1], borderColor: '#FFF', borderStyle: 'solid' },
  targetLetter: { fontSize: 24, fontWeight: '900', color: '#9E9E9E' },
  targetLetterCollected: { color: '#FFF', textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 2 },
  balloonContainer: { alignItems: 'center' },
  balloon: { width: 80, height: 100, borderRadius: 40, borderBottomLeftRadius: 35, borderBottomRightRadius: 35, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 5, elevation: 5 },
  balloonGloss: { position: 'absolute', top: 10, left: 15, width: 20, height: 30, backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 10, transform: [{ rotate: '-30deg' }] },
  balloonText: { fontSize: 45, fontWeight: '900', color: '#FFF', textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: {width: 2, height: 2}, textShadowRadius: 3 },
  balloonLibrasEmoji: { fontSize: 25, marginTop: -5, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 2 },
  balloonKnot: { width: 10, height: 15, borderBottomWidth: 15, borderLeftWidth: 10, borderLeftColor: 'transparent', borderRightWidth: 10, borderRightColor: 'transparent', marginTop: -2 }
});
