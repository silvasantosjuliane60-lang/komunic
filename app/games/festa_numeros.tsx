import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Animated, Easing, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAudio } from '../../hooks/useAudio';
import { Colors } from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { gameStyles } from '../../constants/GameStyles';
import { GameInfoButton } from '../../components/GameIntro';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const LEVELS = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
  ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1'],
];

const BALLOON_COLORS: ReadonlyArray<readonly [string, string]> = [
  ['#FF5252', '#D32F2F'],
  ['#4CAF50', '#2E7D32'],
  ['#2196F3', '#1565C0'],
  ['#FFEB3B', '#FBC02D'],
  ['#9C27B0', '#6A1B9A'],
  ['#FF9800', '#EF6C00'],
];

type BalloonProps = {
  id: number;
  num: string;
  left: number;
  color: readonly [string, string];
  onPop: (id: number, num: string | false, left?: number) => void;
  isTarget: boolean;
};

type FlyingNumberProps = {
  id: string;
  num: string;
  startX: number;
  startY: number;
  destX: number;
  destY: number;
  onComplete: (id: string, num: string) => void;
};

type SlotLayout = { x: number; y: number; width: number; height: number };

type BalloonItem = { id: number; num: string; left: number; color: readonly [string, string]; isTarget: boolean };

type FlyingItem = { id: string; num: string; startX: number; startY: number; destX: number; destY: number };

const Balloon = ({ id, num, left, color, onPop, isTarget }: BalloonProps) => {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT + 100)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const [popped, setPopped] = useState(false);

  useEffect(() => {
    // Balões sobem mais rápido para trabalhar tempo e reflexo
    const duration = 3000 + Math.random() * 2000;
    Animated.timing(translateY, {
      toValue: -200,
      duration,
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
      onPop(id, num, left);
    });
  };

  const knotColor = color[0];

  return (
    <Animated.View style={[styles.balloonContainer, { transform: [{ translateY }], opacity }]}> 
      <TouchableOpacity activeOpacity={0.9} onPress={handlePress} disabled={popped}>
        <LinearGradient colors={color} style={styles.balloon}>
          <View style={styles.balloonGloss} />
          <Text style={styles.balloonText}>{num}</Text>
        </LinearGradient>
        <View style={[styles.balloonKnot, { borderBottomColor: knotColor }]} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const FlyingNumber = ({ id, num, startX, startY, destX, destY, onComplete }: FlyingNumberProps) => {
  const position = useRef(new Animated.ValueXY({ x: startX, y: startY })).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(position, {
        toValue: { x: destX, y: destY },
        duration: 700,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 700,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onComplete(id, num);
    });
  }, []);

  return (
    <Animated.View style={[styles.flyingNumber, { transform: [{ translateX: position.x }, { translateY: position.y }], opacity }]}> 
      <Text style={styles.flyingNumberText}>{num}</Text>
    </Animated.View>
  );
};

export default function FestaNumerosGame() {
  const router = useRouter();
  const { playSuccess, playError, speakText, stopSpeech } = useAudio();

  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [collected, setCollected] = useState<string[]>([]);
  const [balloons, setBalloons] = useState<BalloonItem[]>([]);
  const [flyingNumbers, setFlyingNumbers] = useState<FlyingItem[]>([]);
  const [panelLayout, setPanelLayout] = useState<{ x: number; y: number } | null>(null);
  const [slotLayouts, setSlotLayouts] = useState<Array<SlotLayout | null>>([]);

  const targets = LEVELS[currentLevel];
  const nextBalloonId = useRef(0);
  const spawnTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const uncollected = targets.filter(t => !collected.includes(t));

  useEffect(() => {
    const timer = setTimeout(() => {
      stopSpeech();
      if (currentLevel === 0) {
        speakText('Estoure todos os balões para completar a sequência! Você pode escolher qualquer ordem, mas seja rápido!');
      } else {
        speakText('Agora complete a sequência decrescente! Encontre os números e estoure os balões o mais rápido que puder!');
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [currentLevel]);

  useEffect(() => {
    spawnTimer.current = setInterval(() => {
      spawnBalloon();
    }, 600); // Geração mais rápida para focar em tempo e percepção visual

    return () => {
      if (spawnTimer.current) clearInterval(spawnTimer.current);
    };
  }, [currentLevel, collected]);

  useEffect(() => {
    setSlotLayouts(Array(targets.length).fill(null));
  }, [currentLevel, targets.length]);

  const spawnBalloon = () => {
    if (uncollected.length === 0) return;

    const isTarget = Math.random() > 0.4; // Aumentar chance de vir número que falta
    const num = isTarget ? uncollected[Math.floor(Math.random() * uncollected.length)] : Math.floor(Math.random() * 10 + 1).toString();
    const color = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
    const leftPos = 20 + Math.random() * (SCREEN_WIDTH - 120);

    const newBalloon = {
      id: nextBalloonId.current++,
      num,
      color,
      isTarget: uncollected.includes(num),
      left: leftPos,
    };

    setBalloons(prev => [...prev, newBalloon]);
  };

  const handlePop = (id: number, num: string | false, left?: number) => {
    setBalloons(prev => prev.filter(b => b.id !== id));
    if (!num) return;

    speakText(`${num}`);

    setCollected(prev => {
      // Nova lógica: Sucesso se for um número que pertence à trilha e ainda não foi coletado
      if (targets.includes(num) && !prev.includes(num)) {
        playSuccess();
        const destIndex = targets.indexOf(num);
        const slotLayout = slotLayouts[destIndex];
        const destX = panelLayout && slotLayout ? panelLayout.x + slotLayout.x + slotLayout.width / 2 - 20 : (left ?? 0);
        const destY = panelLayout && slotLayout ? panelLayout.y + slotLayout.y + slotLayout.height / 2 - 20 : 120;
        
        setScore(s => s + 10);
        setFlyingNumbers(fn => [
          ...fn,
          { id: `fly-${id}`, num, startX: left ?? 0, startY: SCREEN_HEIGHT - 140, destX, destY },
        ]);

        return [...prev, num];
      } else {
        playError();
        return prev;
      }
    });
  };

  useEffect(() => {
    if (targets.length > 0 && collected.length === targets.length) {
      const t = setTimeout(() => {
        if (currentLevel < LEVELS.length - 1) {
          setCurrentLevel(c => c + 1);
          setCollected([]);
          setBalloons([]);
        } else {
          alert('PARABÉNS! VOCÊ CONSEGUIU CONTAR TUDO!');
          router.back();
        }
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [collected.length, targets.length, currentLevel, router]);

  const handleFlyingComplete = (id: string) => {
    setFlyingNumbers(prev => prev.filter(item => item.id !== id));
  };

  return (
    <ImageBackground source={require('../../assets/images/bg_escola.jpg')} style={styles.background} blurRadius={3}>
      <SafeAreaView edges={["top"]}>
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
      </SafeAreaView>

      <View style={styles.panelContainer} onLayout={(event) => {
        const { x, y } = event.nativeEvent.layout;
        setPanelLayout({ x, y });
      }}>
        <View style={styles.numbersRow}>
          {targets.map((target, idx) => {
            const isCollected = collected.includes(target);
            // Removido o destaque (highlight) pois não há mais uma ordem estrita
            return (
              <View
                key={idx}
                style={[
                  styles.targetSlot,
                  isCollected && styles.targetSlotCollected,
                ]}
                onLayout={(event) => {
                  const { x, y, width, height } = event.nativeEvent.layout;
                  setSlotLayouts(prev => {
                    const next = [...prev];
                    next[idx] = { x, y, width, height };
                    return next;
                  });
                }}
              >
                <Text style={[
                  styles.targetNumber,
                  isCollected && styles.targetNumberCollected,
                ]}>
                  {isCollected ? target : '?'}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
        {balloons.map(b => (
          <View key={b.id} style={{ position: 'absolute', left: b.left, bottom: -100 }} pointerEvents="box-none">
            <Balloon
              id={b.id}
              num={b.num}
              left={b.left}
              color={b.color}
              isTarget={b.isTarget}
              onPop={handlePop}
            />
          </View>
        ))}
        {flyingNumbers.map(item => (
          <FlyingNumber
            key={item.id}
            id={item.id}
            num={item.num}
            startX={item.startX}
            startY={item.startY}
            destX={item.destX}
            destY={item.destY}
            onComplete={handleFlyingComplete}
          />
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
  balloonKnot: { width: 10, height: 15, borderBottomWidth: 15, borderLeftWidth: 10, borderLeftColor: 'transparent', borderRightWidth: 10, borderRightColor: 'transparent', marginTop: -2 },
  flyingNumber: { position: 'absolute', width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  flyingNumberText: { fontSize: 28, fontWeight: '900', color: Colors.orangeButtonGradient[1] },
});
