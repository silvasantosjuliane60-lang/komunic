// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Animated, Easing, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAudio } from '../../hooks/useAudio';
import { Colors } from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { gameStyles } from '../../constants/GameStyles';
import { GameInfoButton } from '../../components/GameIntro';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const LEVELS = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], // Crescente
  ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1'], // Decrescente
];

const BALLOON_COLORS = [
  ['#FF5252', '#D32F2F'],
  ['#4CAF50', '#2E7D32'],
  ['#2196F3', '#1565C0'],
  ['#FFEB3B', '#FBC02D'],
  ['#9C27B0', '#6A1B9A'],
  ['#FF9800', '#EF6C00'],
];

const Balloon = ({ id, num, color, onPop, isTarget }) => {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT + 100)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const [popped, setPopped] = useState(false);

  useEffect(() => {
    const duration = isTarget ? 7000 + Math.random() * 2000 : 5000 + Math.random() * 3000;
    Animated.timing(translateY, {
      toValue: -200,
      duration: duration,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && !popped) {
        onPop(id, false);
      }
    });
  }, []);

  const handlePress = () => {
    if (popped) return;
    setPopped(true);
    
    Animated.timing(opacity, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      onPop(id, num);
    });
  };

  if (popped) return null;

  const knotColor = color[0];

  return (
    <Animated.View style={[styles.balloonContainer, { transform: [{ translateY }], opacity }]}>
      <TouchableOpacity activeOpacity={0.9} onPress={handlePress}>
        <LinearGradient colors={color} style={styles.balloon}>
           <View style={styles.balloonGloss} />
           <Text style={styles.balloonText}>{num}</Text>
        </LinearGradient>
        <View style={[styles.balloonKnot, { borderBottomColor: knotColor }]} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function FestaNumerosGame() {
  const router = useRouter();
  const { playSuccess, playError, speakText, stopSpeech } = useAudio();
  
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [collected, setCollected] = useState<string[]>([]);
  const [balloons, setBalloons] = useState<any[]>([]);

  const targets = LEVELS[currentLevel];
  const nextBalloonId = useRef(0);
  const spawnTimer = useRef<NodeJS.Timeout | null>(null);

  // O PRÓXIMO número que a criança OBRIGATORIAMENTE tem que estourar
  const nextTarget = targets[collected.length];

  useEffect(() => {
    const timer = setTimeout(() => {
      stopSpeech();
      if (currentLevel === 0) {
        speakText('Estoure os balões na ordem crescente! Do menor para o maior.');
      } else {
        speakText('Agora estoure na ordem decrescente! Do maior para o menor.');
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [currentLevel]);

  useEffect(() => {
    spawnTimer.current = setInterval(() => {
      spawnBalloon();
    }, 800); // 0.8s entre cada balão

    return () => {
      if (spawnTimer.current) clearInterval(spawnTimer.current);
    };
  }, [currentLevel, collected]);

  const spawnBalloon = () => {
    if (collected.length >= targets.length) return;

    // 40% de chance de spawnar o alvo EXATO que precisamos agora
    const isTarget = Math.random() > 0.6; 
    let num = '';
    
    if (isTarget) {
      num = nextTarget;
    } else {
      // Número aleatório entre 1 e 10
      num = Math.floor(Math.random() * 10 + 1).toString();
    }

    const color = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
    const leftPos = 20 + Math.random() * (SCREEN_WIDTH - 120);

    const newBalloon = {
      id: nextBalloonId.current++,
      num,
      color,
      isTarget: num === nextTarget,
      left: leftPos,
    };

    setBalloons(prev => [...prev, newBalloon]);
  };

  const handlePop = (id, num) => {
    setBalloons(prev => prev.filter(b => b.id !== id));

    if (!num) return; // Sumiu da tela

    // Falar o número que estourou
    speakText(num.toString());

    if (num === nextTarget) {
      playSuccess();
      setScore(s => s + 10);
      const newCollected = [...collected, num];
      setCollected(newCollected);
      
      if (newCollected.length === targets.length) {
        setTimeout(() => {
          if (currentLevel < LEVELS.length - 1) {
            setCurrentLevel(c => c + 1);
            setCollected([]);
            setBalloons([]);
          } else {
            alert('PARABÉNS! VOCÊ CONSEGUIU CONTAR TUDO!');
            router.back();
          }
        }, 1500);
      }
    } else {
      // Estourou errado, a usuária disse "não tem erro", então não diminui ponto.
      // Pode tocar o som de erro ou não, mas ajuda a criança a saber que não é aquele.
      playError();
    }
  };

  return (
    <ImageBackground source={require('../../assets/images/bg_escola.jpg')} style={styles.background} blurRadius={3}>

      {/* ─── HUD (position absolute, zIndex 100) ─── */}
      <LinearGradient
        colors={['#FFC312', '#F79F1F', '#EE5A24']}
        style={[gameStyles.hud, styles.hudAbsolute]}
      >
        <TouchableOpacity onPress={() => router.back()} style={gameStyles.hudBackBtn}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>

        <View style={gameStyles.hudCenter}>
          <Text style={gameStyles.hudTitle}>🎈 FESTA DOS NÚMEROS</Text>
          <View style={gameStyles.hudBadge}>
            <Ionicons name="layers" size={14} color="#FFEB3B" />
            <Text style={gameStyles.hudBadgeText}>{currentLevel === 0 ? 'CRESCENTE' : 'DECRESCENTE'}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <GameInfoButton gameKey="festa_numeros" style={{ marginRight: 8 }} />
          <View style={gameStyles.hudScore}>
            <Text style={gameStyles.hudScoreLabel}>PONTOS</Text>
            <Text style={gameStyles.hudScoreValue}>{score}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* PAINEL DE NÚMEROS */}
      <View style={styles.panelContainer}>
        <View style={styles.numbersRow}>
          {targets.map((target, idx) => {
            const isCollected = collected.includes(target);
            const isCurrentTarget = target === nextTarget;
            return (
              <View key={idx} style={[
                styles.targetSlot, 
                isCollected && styles.targetSlotCollected,
                isCurrentTarget && styles.targetSlotHighlight // Brilha o que precisa pegar
              ]}>
                <Text style={[
                  styles.targetNumber, 
                  isCollected && styles.targetNumberCollected,
                  isCurrentTarget && styles.targetNumberHighlight
                ]}>
                  {target}
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
              num={b.num}
              color={b.color}
              isTarget={b.isTarget}
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
  numbersRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.9)', padding: 10, borderRadius: 20, borderWidth: 4, borderColor: Colors.orangeButtonGradient[1], shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 5, elevation: 10, marginHorizontal: 15 },
  targetSlot: { width: 45, height: 45, backgroundColor: '#E0E0E0', borderRadius: 12, borderWidth: 3, borderColor: '#BDBDBD', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  targetSlotCollected: { backgroundColor: Colors.playButtonGradient[1], borderColor: '#FFF', borderStyle: 'solid' },
  targetSlotHighlight: { borderColor: Colors.starYellow, borderWidth: 4, borderStyle: 'solid', transform: [{ scale: 1.1 }] },
  targetNumber: { fontSize: 24, fontWeight: '900', color: '#9E9E9E' },
  targetNumberCollected: { color: '#FFF', textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 2 },
  targetNumberHighlight: { color: Colors.starYellow },
  balloonContainer: { alignItems: 'center' },
  balloon: { width: 80, height: 100, borderRadius: 40, borderBottomLeftRadius: 35, borderBottomRightRadius: 35, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 5, elevation: 5 },
  balloonGloss: { position: 'absolute', top: 10, left: 15, width: 20, height: 30, backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 10, transform: [{ rotate: '-30deg' }] },
  balloonText: { fontSize: 45, fontWeight: '900', color: '#FFF', textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: {width: 2, height: 2}, textShadowRadius: 3 },
  balloonKnot: { width: 10, height: 15, borderBottomWidth: 15, borderLeftWidth: 10, borderLeftColor: 'transparent', borderRightWidth: 10, borderRightColor: 'transparent', marginTop: -2 }
});
