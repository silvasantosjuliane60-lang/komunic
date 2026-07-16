// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, PanResponder, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAudio } from '../../hooks/useAudio';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import LibrasSign from '../../components/LibrasSign';
import { LinearGradient } from 'expo-linear-gradient';
import { gameStyles } from '../../constants/GameStyles';
import { GameInfoButton } from '../../components/GameIntro';

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
const VIBRANT_COLORS = ['#FF5252', '#4CAF50', '#2196F3', '#FBC02D', '#9C27B0', '#FF9800', '#E91E63', '#00BCD4'];

// Assinaturas de grade (3x5) para validação.
// A grade tem células numeradas de 0 a 14:
// [ 0,  1,  2]
// [ 3,  4,  5]
// [ 6,  7,  8]
// [ 9, 10, 11]
// [12, 13, 14]
const LETTER_SIGNATURES: Record<string, number[]> = {
  A: [1, 3, 4, 5, 6, 8, 9, 11, 12, 14],
  B: [0, 1, 2, 3, 5, 6, 7, 8, 9, 11, 12, 13, 14],
  C: [1, 2, 3, 6, 9, 13, 14],
  D: [0, 1, 2, 3, 5, 6, 8, 9, 11, 12, 13, 14],
  E: [0, 1, 2, 3, 6, 7, 8, 9, 12, 13, 14],
  F: [0, 1, 2, 3, 6, 7, 8, 9, 12],
  G: [1, 2, 3, 6, 9, 11, 13, 14],
  H: [0, 2, 3, 5, 6, 7, 8, 9, 11, 12, 14],
  I: [1, 4, 7, 10, 13],
  J: [2, 5, 8, 11, 12, 13],
  K: [0, 2, 3, 4, 6, 7, 9, 10, 12, 14],
  L: [0, 3, 6, 9, 12, 13, 14],
  M: [0, 1, 2, 3, 4, 5, 6, 8, 9, 11, 12, 14],
  N: [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14],
  O: [1, 3, 5, 6, 8, 9, 11, 13],
  P: [0, 1, 2, 3, 5, 6, 7, 8, 9, 12],
  Q: [1, 3, 5, 6, 8, 9, 11, 13, 14],
  R: [0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 12, 14],
  S: [1, 2, 3, 7, 11, 12, 13],
  T: [0, 1, 2, 4, 7, 10, 13],
  U: [0, 2, 3, 5, 6, 8, 9, 11, 13],
  V: [0, 2, 3, 5, 6, 8, 10, 13],
  W: [0, 2, 3, 5, 6, 8, 9, 10, 11, 12, 14],
  X: [0, 2, 4, 7, 10, 12, 14],
  Y: [0, 2, 3, 5, 7, 10, 13],
  Z: [0, 1, 2, 5, 7, 9, 12, 13, 14],
};

export default function TracoGame() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { playSuccess, playError, speakText, stopSpeech } = useAudio();
  const { isLibrasActive } = useAccessibility();
  
  const mode = params.mode || 'guiada'; 
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0); 
  const [paths, setPaths] = useState<any[]>([]); 
  const [currentPath, setCurrentPath] = useState<any[]>([]);
  const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });

  const letter = ALPHABET[currentLetterIndex];
  const themeColor = VIBRANT_COLORS[currentLetterIndex % VIBRANT_COLORS.length];

  useEffect(() => {
    stopSpeech();
    const timer = setTimeout(() => {
      if (mode === 'guiada') {
        speakText(`Passe o dedo sobre a letra.`);
      } else {
        speakText(`Agora, tente escrever sozinho a letra ${letter}.`);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [currentLetterIndex, mode]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentPath([{ x: locationX, y: locationY }]);
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentPath(prev => [...prev, { x: locationX, y: locationY }]);
      },
      onPanResponderRelease: () => {
        setCurrentPath(current => {
          if (current.length > 0) {
            setPaths(prev => [...prev, current]);
          }
          return [];
        });
      }
    })
  ).current;

  const handleClear = () => {
    setPaths([]);
    setCurrentPath([]);
  };

  const validateDrawing = () => {
    const allPaths = [...paths, currentPath];
    const allPoints = allPaths.flat();
    if (allPoints.length < 5) return false;

    // Acha a "caixa" (bounding box) exata do desenho da criança
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    allPoints.forEach(p => {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    });

    const drawnWidth = maxX - minX;
    const drawnHeight = maxY - minY;
    
    // Desenhos muito pequenos (só um pinguinho) falham automaticamente
    if (drawnWidth < 20 && drawnHeight < 20) return false;

    // A grade 3x5 agora é moldada EXATAMENTE no tamanho do desenho da criança
    const cellW = (drawnWidth || 1) / 3;
    const cellH = (drawnHeight || 1) / 5;
    
    const touchedCells = new Set<number>();
    allPoints.forEach(p => {
      let col = Math.floor((p.x - minX) / cellW);
      let row = Math.floor((p.y - minY) / cellH);
      
      if (col < 0) col = 0; if (col > 2) col = 2;
      if (row < 0) row = 0; if (row > 4) row = 4;
      
      touchedCells.add(row * 3 + col);
    });

    const expected = LETTER_SIGNATURES[letter] || [];
    if (expected.length === 0) return true; 

    let hits = 0;
    expected.forEach(c => {
      if (touchedCells.has(c)) hits++;
    });

    // 40% de match exigido
    const matchPercentage = hits / expected.length;
    return matchPercentage >= 0.40;
  };

  const handlePronto = () => {
    if (paths.length === 0 && currentPath.length === 0) {
      alert('Você precisa desenhar a letra primeiro!');
      return;
    }

    const isCorrect = validateDrawing();

    if (isCorrect) {
      playSuccess();
      
      if (currentLetterIndex < ALPHABET.length - 1) {
        setCurrentLetterIndex(c => c + 1);
        handleClear();
      } else {
        alert('Parabéns! Você completou todas as letras desta fase!');
        router.back();
      }
    } else {
      playError();
      speakText('Ops! Tente desenhar de novo com bastante capricho!');
      handleClear();
    }
  };

  const renderDots = () => {
    const allPaths = [...paths, currentPath];
    return allPaths.map((path, pathIdx) => (
      path.map((point, ptIdx) => {
        if (ptIdx % 2 !== 0 && ptIdx !== path.length -1 && ptIdx !== 0) return null;
        return (
          <View
            key={`${pathIdx}-${ptIdx}`}
            style={{
              position: 'absolute',
              left: point.x - 15,
              top: point.y - 15,
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor: themeColor,
            }}
            pointerEvents="none"
          />
        );
      })
    ));
  };

  return (
    <ImageBackground source={require('../../assets/images/bg_escola.jpg')} style={styles.background} blurRadius={3}>

      {/* ─── HUD (position absolute, zIndex 10) ─── */}
      <LinearGradient
        colors={['#FF82A9', '#C44569', '#8E44AD']}
        style={[gameStyles.hud, styles.hudAbsolute]}
      >
        <TouchableOpacity onPress={() => router.back()} style={gameStyles.hudBackBtn}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>

        <View style={gameStyles.hudCenter}>
          <Text style={gameStyles.hudTitle}>
            {mode === 'guiada' ? '✍️ DESCOBRINDO AS LETRAS' : '📝 ESCREVENDO SOZINHO'}
          </Text>
          <View style={gameStyles.hudBadge}>
            <Ionicons name="pencil" size={14} color="#FFEB3B" />
            <Text style={gameStyles.hudBadgeText}>
              {mode === 'guiada' ? 'CONTORNO' : 'SOZINHO'} • {letter}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <GameInfoButton gameKey="traco" style={{ marginRight: 8 }} />
          <View style={gameStyles.hudScore}>
            <Text style={gameStyles.hudScoreLabel}>LETRA</Text>
            <Text style={gameStyles.hudScoreValue}>{currentLetterIndex + 1}/{ALPHABET.length}</Text>
          </View>
        </View>
      </LinearGradient>

      {isLibrasActive && <LibrasSign text={letter} size="small" />}

      <View style={styles.boardContainer}>
        {/* Lousa */}
        <View 
          style={[styles.board, { borderColor: themeColor }]}
          {...panResponder.panHandlers}
          onLayout={(event) => {
            const { width, height } = event.nativeEvent.layout;
            setBoardSize({ width, height });
          }}
        >
          {mode === 'guiada' && (
            <Text style={[styles.watermarkLetter, { color: themeColor }]} pointerEvents="none">{letter}</Text>
          )}
          
          {mode === 'livre' && (
            <View style={styles.reminderBox} pointerEvents="none">
              <Text style={styles.reminderText}>{letter}</Text>
            </View>
          )}

          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {renderDots()}
          </View>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={handleClear} style={[styles.controlBtn, { backgroundColor: '#FF5252' }]}>
          <Ionicons name="trash" size={24} color="white" />
          <Text style={styles.controlText}>Limpar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handlePronto} style={[styles.controlBtn, { backgroundColor: '#4CAF50' }]}>
          <Ionicons name="checkmark-circle" size={24} color="white" />
          <Text style={styles.controlText}>Pronto!</Text>
        </TouchableOpacity>
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
    zIndex: 10,
  },

  boardContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 110, paddingBottom: 70 },
  board: { 
    width: '95%', 
    height: '100%', 
    backgroundColor: 'rgba(255,255,255,0.95)', 
    borderRadius: 20, 
    borderWidth: 5, 
    borderColor: '#424242',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 10, elevation: 10
  },
  
  watermarkLetter: {
    fontSize: 220,
    lineHeight: 260,
    fontWeight: 'bold',
    textAlign: 'center',
    position: 'absolute',
    opacity: 0.25,
  },
  reminderBox: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 80,
    height: 80,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#CCC',
    borderStyle: 'dashed',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5
  },
  reminderText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#999'
  },
  
  controls: {
    position: 'absolute',
    bottom: 15,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20
  },
  controlBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#FFF',
    shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 5, elevation: 8,
    gap: 8
  },
  controlText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold'
  }
});
