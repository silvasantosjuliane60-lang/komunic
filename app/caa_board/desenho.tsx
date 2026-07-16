// @ts-nocheck
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  PanResponder,
  Dimensions,
  StatusBar,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { Colors } from '../../constants/Colors';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// ─── ALFABETO COM CORES VIBRANTES ───────────────────────────────────────────
const ALPHABET_COLORS = [
  '#FF1744', '#FF9100', '#FFEA00', '#00E676', '#2979FF',
  '#D500F9', '#FF4081', '#00BCD4', '#FF6D00', '#76FF03',
  '#651FFF', '#F50057', '#00E5FF', '#FF3D00', '#AEEA00',
  '#304FFE', '#C51162', '#1DE9B6', '#DD2C00', '#64DD17',
  '#6200EA', '#FF1744', '#00B8D4', '#FF6F00', '#00C853',
  '#AA00FF',
];
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// ─── PALETA DE CORES ────────────────────────────────────────────────────────
const COLOR_PALETTE = [
  { name: 'Preto', color: '#1A1A2E' },
  { name: 'Vermelho', color: '#FF1744' },
  { name: 'Laranja', color: '#FF9100' },
  { name: 'Amarelo', color: '#FFEA00' },
  { name: 'Verde', color: '#00E676' },
  { name: 'Azul', color: '#2979FF' },
  { name: 'Roxo', color: '#D500F9' },
  { name: 'Rosa', color: '#FF4081' },
  { name: 'Marrom', color: '#795548' },
  { name: 'Branco', color: '#FFFFFF' },
];

// ─── ESPESSURA DO TRAÇO ─────────────────────────────────────────────────────
const BRUSH_SIZES = [
  { label: 'Fina', size: 4 },
  { label: 'Média', size: 10 },
  { label: 'Grossa', size: 20 },
  { label: 'Bem Grossa', size: 35 },
];

// ─── FUNDOS DE PAPEL ────────────────────────────────────────────────────────
const PAPER_BACKGROUNDS = [
  { name: 'Branco', color: '#FFFFFF', icon: 'document-outline' },
  { name: 'Creme', color: '#FFF8E1', icon: 'sunny-outline' },
  { name: 'Azul', color: '#E3F2FD', icon: 'water-outline' },
  { name: 'Verde', color: '#E8F5E9', icon: 'leaf-outline' },
  { name: 'Rosa', color: '#FCE4EC', icon: 'heart-outline' },
  { name: 'Lousa', color: '#263238', icon: 'school-outline' },
];

// ─── DESENHOS PARA ESPELHAR (modelos com emoji + guia em pontilhado) ────────
const DRAWING_TEMPLATES = [
  { id: 'autoretrato', emoji: '🧑', name: 'Auto-Retrato', category: 'especial' },
  { id: 'sol', emoji: '☀️', name: 'Sol', category: 'natureza' },
  { id: 'coracao', emoji: '❤️', name: 'Coração', category: 'formas' },
  { id: 'estrela', emoji: '⭐', name: 'Estrela', category: 'formas' },
  { id: 'casa', emoji: '🏠', name: 'Casa', category: 'objetos' },
  { id: 'flor', emoji: '🌸', name: 'Flor', category: 'natureza' },
  { id: 'arvore', emoji: '🌳', name: 'Árvore', category: 'natureza' },
  { id: 'gato', emoji: '🐱', name: 'Gato', category: 'animais' },
  { id: 'cachorro', emoji: '🐶', name: 'Cachorro', category: 'animais' },
  { id: 'borboleta', emoji: '🦋', name: 'Borboleta', category: 'animais' },
  { id: 'peixe', emoji: '🐟', name: 'Peixe', category: 'animais' },
  { id: 'lua', emoji: '🌙', name: 'Lua', category: 'natureza' },
  { id: 'nuvem', emoji: '☁️', name: 'Nuvem', category: 'natureza' },
  { id: 'carro', emoji: '🚗', name: 'Carro', category: 'objetos' },
  { id: 'foguete', emoji: '🚀', name: 'Foguete', category: 'objetos' },
  { id: 'arcoiris', emoji: '🌈', name: 'Arco-Íris', category: 'natureza' },
  { id: 'bolo', emoji: '🎂', name: 'Bolo', category: 'objetos' },
  { id: 'passaro', emoji: '🐦', name: 'Pássaro', category: 'animais' },
  { id: 'dinossauro', emoji: '🦕', name: 'Dino', category: 'animais' },
  { id: 'melancia', emoji: '🍉', name: 'Melancia', category: 'objetos' },
  { id: 'unicornio', emoji: '🦄', name: 'Unicórnio', category: 'animais' },
  // Alfabeto completo
  ...ALPHABET.map((letter, i) => ({
    id: `letra_${letter}`,
    emoji: letter,
    name: letter,
    category: 'alfabeto',
    letterColor: ALPHABET_COLORS[i],
  })),
];

// ─── COMPONENTE: Guia de Auto-Retrato (contorno de rosto) ───────────────────
const FaceOutlineGuide = ({ isDark }) => {
  const guideColor = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.10)';
  const guideColorStrong = isDark ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.13)';
  const dashedBorder = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.07)';
  return (
    <View style={faceStyles.container}>
      {/* Título */}
      <Text style={[faceStyles.title, isDark && { color: 'rgba(255,255,255,0.20)' }]}>
        🎨 Desenhe seu rosto!
      </Text>

      {/* Cabelo (topo) */}
      <View style={[faceStyles.hair, { borderColor: guideColor }]} />

      {/* Cabeça (oval) */}
      <View style={[faceStyles.head, { borderColor: guideColorStrong }]}>

        {/* Orelha esquerda */}
        <View style={[faceStyles.earLeft, { borderColor: guideColor }]} />
        {/* Orelha direita */}
        <View style={[faceStyles.earRight, { borderColor: guideColor }]} />

        {/* Sobrancelha esquerda */}
        <View style={[faceStyles.browLeft, { backgroundColor: guideColor }]} />
        {/* Sobrancelha direita */}
        <View style={[faceStyles.browRight, { backgroundColor: guideColor }]} />

        {/* Olho esquerdo */}
        <View style={[faceStyles.eyeLeft, { borderColor: guideColorStrong }]}>
          <View style={[faceStyles.pupil, { backgroundColor: guideColor }]} />
        </View>
        {/* Olho direito */}
        <View style={[faceStyles.eyeRight, { borderColor: guideColorStrong }]}>
          <View style={[faceStyles.pupil, { backgroundColor: guideColor }]} />
        </View>

        {/* Nariz */}
        <View style={[faceStyles.nose, { borderColor: guideColor }]} />

        {/* Boca (sorriso) */}
        <View style={[faceStyles.mouth, { borderColor: guideColorStrong }]} />

        {/* Bochechas */}
        <View style={[faceStyles.cheekLeft, { backgroundColor: isDark ? 'rgba(255,150,150,0.08)' : 'rgba(255,150,150,0.08)' }]} />
        <View style={[faceStyles.cheekRight, { backgroundColor: isDark ? 'rgba(255,150,150,0.08)' : 'rgba(255,150,150,0.08)' }]} />
      </View>

      {/* Pescoço */}
      <View style={[faceStyles.neck, { borderColor: guideColor }]} />

      {/* Instrução */}
      <View style={[faceStyles.instructionBadge, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(233,30,99,0.06)' }]}>
        <Text style={[faceStyles.instruction, isDark && { color: 'rgba(255,255,255,0.20)' }]}>
          ✏️ Passe o dedo por cima do contorno!
        </Text>
      </View>
    </View>
  );
};

const faceStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgba(0,0,0,0.12)',
    marginBottom: 8,
    letterSpacing: 1,
  },
  hair: {
    width: 160,
    height: 40,
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
    borderWidth: 2.5,
    borderBottomWidth: 0,
    borderStyle: 'dashed',
    marginBottom: -5,
  },
  head: {
    width: 160,
    height: 190,
    borderRadius: 80,
    borderWidth: 2.5,
    borderStyle: 'dashed',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  earLeft: {
    position: 'absolute',
    left: -15,
    top: 60,
    width: 22,
    height: 35,
    borderRadius: 11,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  earRight: {
    position: 'absolute',
    right: -15,
    top: 60,
    width: 22,
    height: 35,
    borderRadius: 11,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  browLeft: {
    position: 'absolute',
    left: 30,
    top: 48,
    width: 30,
    height: 3,
    borderRadius: 2,
  },
  browRight: {
    position: 'absolute',
    right: 30,
    top: 48,
    width: 30,
    height: 3,
    borderRadius: 2,
  },
  eyeLeft: {
    position: 'absolute',
    left: 30,
    top: 60,
    width: 30,
    height: 22,
    borderRadius: 15,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeRight: {
    position: 'absolute',
    right: 30,
    top: 60,
    width: 30,
    height: 22,
    borderRadius: 15,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pupil: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  nose: {
    position: 'absolute',
    top: 95,
    width: 18,
    height: 22,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 2,
    borderTopWidth: 0,
    borderStyle: 'dashed',
  },
  mouth: {
    position: 'absolute',
    bottom: 35,
    width: 50,
    height: 22,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    borderWidth: 2,
    borderTopWidth: 0,
    borderStyle: 'dashed',
  },
  cheekLeft: {
    position: 'absolute',
    left: 15,
    bottom: 45,
    width: 22,
    height: 16,
    borderRadius: 10,
  },
  cheekRight: {
    position: 'absolute',
    right: 15,
    bottom: 45,
    width: 22,
    height: 16,
    borderRadius: 10,
  },
  neck: {
    width: 40,
    height: 20,
    borderWidth: 2,
    borderTopWidth: 0,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderStyle: 'dashed',
    marginTop: -3,
  },
  instructionBadge: {
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 15,
  },
  instruction: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'rgba(0,0,0,0.12)',
    letterSpacing: 0.5,
  },
});

// ─── EMOJIS DECORATIVOS (canto do papel) ────────────────────────────────────
const CORNER_DECORATIONS = ['✨', '🌟', '💫', '🎨', '🖍️', '✏️', '🎪', '🎠'];

export default function CAABoard() {
  const router = useRouter();
  const { isLibrasActive, toggleLibras } = useAccessibility();

  // Estado da ferramenta atual
  const [selectedColor, setSelectedColor] = useState('#1A1A2E');
  const [brushSize, setBrushSize] = useState(10);
  const [isEraser, setIsEraser] = useState(false);
  const [paperBg, setPaperBg] = useState('#FFFFFF');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBrushPicker, setShowBrushPicker] = useState(false);
  const [showPaperPicker, setShowPaperPicker] = useState(false);
  const [showDrawingPicker, setShowDrawingPicker] = useState(false);
  const [showAlphabetPicker, setShowAlphabetPicker] = useState(false);

  // Estado do desenho
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [undoStack, setUndoStack] = useState([]);

  // Desenho modelo selecionado (exibido como marca d'água no canvas)
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Ref para tamanho do canvas
  const canvasRef = useRef({ x: 0, y: 0, width: 0, height: 0 });

  // Cor efetiva (borracha usa cor do papel)
  const effectiveColor = isEraser ? paperBg : selectedColor;
  const effectiveBrush = isEraser ? brushSize * 3 : brushSize;

  // Refs para valores dinâmicos (PanResponder captura closures estáticas)
  const effectiveColorRef = useRef(effectiveColor);
  const effectiveBrushRef = useRef(effectiveBrush);
  effectiveColorRef.current = effectiveColor;
  effectiveBrushRef.current = effectiveBrush;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { pageX, pageY } = evt.nativeEvent;
        setCurrentPath([{ x: pageX, y: pageY }]);
      },
      onPanResponderMove: (evt) => {
        const { pageX, pageY } = evt.nativeEvent;
        setCurrentPath((prev) => [...prev, { x: pageX, y: pageY }]);
      },
      onPanResponderRelease: () => {
        setCurrentPath((current) => {
          if (current.length > 0) {
            setPaths((prev) => {
              const newPaths = [...prev, {
                points: current,
                color: effectiveColorRef.current,
                size: effectiveBrushRef.current,
              }];
              return newPaths;
            });
            setUndoStack([]);
          }
          return [];
        });
      },
    })
  ).current;

  // Ações
  const handleClear = () => {
    setUndoStack([...paths]);
    setPaths([]);
    setCurrentPath([]);
  };

  const handleUndo = () => {
    if (paths.length > 0) {
      const newPaths = [...paths];
      const removed = newPaths.pop();
      setPaths(newPaths);
      setUndoStack((prev) => [...prev, removed]);
    }
  };

  const handleRedo = () => {
    if (undoStack.length > 0) {
      const newStack = [...undoStack];
      const restored = newStack.pop();
      setUndoStack(newStack);
      setPaths((prev) => [...prev, restored]);
    }
  };

  const toggleEraser = () => {
    setIsEraser(!isEraser);
    closeAllPopovers();
  };

  const closeAllPopovers = () => {
    setShowColorPicker(false);
    setShowBrushPicker(false);
    setShowPaperPicker(false);
    setShowDrawingPicker(false);
    setShowAlphabetPicker(false);
  };

  // Renderizar pontos do desenho
  const renderDots = () => {
    const allPaths = [...paths.map((p) => ({
      points: p.points,
      color: p.color,
      size: p.size,
    }))];

    if (currentPath.length > 0) {
      allPaths.push({
        points: currentPath,
        color: effectiveColor,
        size: effectiveBrush,
      });
    }

    return allPaths.map((pathData, pathIdx) =>
      pathData.points.map((point, ptIdx) => {
        if (ptIdx % 2 !== 0 && ptIdx !== pathData.points.length - 1 && ptIdx !== 0) return null;
        const dotSize = pathData.size;
        return (
          <View
            key={`${pathIdx}-${ptIdx}`}
            style={{
              position: 'absolute',
              left: point.x - dotSize / 2,
              top: point.y - dotSize / 2,
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: pathData.color,
            }}
            pointerEvents="none"
          />
        );
      })
    );
  };

  const isDarkPaper = paperBg === '#263238';

  return (
    <ImageBackground
      source={require('../../assets/images/bg_escola.jpg')}
      style={styles.background}
      resizeMode="cover"
      blurRadius={5}
    >
      <StatusBar hidden={true} />

      {/* ================= BARRA SUPERIOR ================= */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back-circle" size={40} color="white" />
        </TouchableOpacity>

        <View style={styles.titleBadge}>
          <LinearGradient colors={['#FF6F00', '#FF8F00', '#FFA000']} style={styles.titleGradient}>
            <Text style={styles.titleEmoji}>🎨</Text>
            <Text style={styles.titleText}>MINHA FOLHA MÁGICA</Text>
            <Text style={styles.titleEmoji}>✨</Text>
          </LinearGradient>
        </View>

        <TouchableOpacity
          onPress={toggleLibras}
          style={[styles.librasBtn, isLibrasActive && styles.librasBtnActive]}
        >
          <FontAwesome5
            name="sign-language"
            size={22}
            color={isLibrasActive ? '#FFF' : '#666'}
          />
        </TouchableOpacity>
      </View>

      {/* ================= ALFABETO COLORIDO PERMANENTE ================= */}
      <View style={styles.alphabetBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.alphabetScroll}>
          {ALPHABET.map((letter, index) => (
            <View key={letter} style={styles.alphabetLetterContainer}>
              <Text
                style={[
                  styles.alphabetLetter,
                  { color: ALPHABET_COLORS[index] },
                  index % 2 === 0 && { transform: [{ rotate: '-5deg' }] },
                  index % 3 === 0 && { transform: [{ rotate: '5deg' }] },
                ]}
              >
                {letter}
              </Text>
              <Text style={[styles.alphabetLetterSmall, { color: ALPHABET_COLORS[index] }]}>
                {letter.toLowerCase()}
              </Text>
            </View>
          ))}
          {/* Emojis decorativos no final */}
          {['🌈', '⭐', '🎉'].map((e, i) => (
            <Text key={i} style={styles.alphabetDecor}>{e}</Text>
          ))}
        </ScrollView>
      </View>

      {/* ================= ÁREA PRINCIPAL ================= */}
      <View style={styles.mainArea}>
        {/* BARRA DE FERRAMENTAS ESQUERDA */}
        <View style={styles.leftToolbar}>
          {/* Lápis */}
          <TouchableOpacity
            onPress={() => { setIsEraser(false); closeAllPopovers(); }}
            style={[styles.toolBtn, !isEraser && styles.toolBtnActive]}
          >
            <LinearGradient
              colors={!isEraser ? ['#4FC3F7', '#0288D1'] : ['#B0BEC5', '#78909C']}
              style={styles.toolBtnGradient}
            >
              <MaterialCommunityIcons name="pencil" size={26} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>

          {/* Borracha */}
          <TouchableOpacity
            onPress={toggleEraser}
            style={[styles.toolBtn, isEraser && styles.toolBtnActive]}
          >
            <LinearGradient
              colors={isEraser ? ['#FF7043', '#E64A19'] : ['#B0BEC5', '#78909C']}
              style={styles.toolBtnGradient}
            >
              <MaterialCommunityIcons name="eraser" size={26} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.toolSeparator} />

          {/* Cor */}
          <TouchableOpacity
            onPress={() => {
              setShowColorPicker(!showColorPicker);
              setShowBrushPicker(false);
              setShowPaperPicker(false);
              setShowDrawingPicker(false);
              setShowAlphabetPicker(false);
            }}
            style={styles.toolBtn}
          >
            <View style={[styles.colorPreview, { backgroundColor: selectedColor }]}>
              <Ionicons name="color-palette" size={18} color={selectedColor === '#1A1A2E' ? '#FFF' : '#333'} />
            </View>
          </TouchableOpacity>

          {/* Espessura */}
          <TouchableOpacity
            onPress={() => {
              setShowBrushPicker(!showBrushPicker);
              setShowColorPicker(false);
              setShowPaperPicker(false);
              setShowDrawingPicker(false);
              setShowAlphabetPicker(false);
            }}
            style={styles.toolBtn}
          >
            <LinearGradient colors={['#AB47BC', '#7B1FA2']} style={styles.toolBtnGradient}>
              <View style={[styles.brushPreviewDot, { width: Math.min(brushSize + 6, 28), height: Math.min(brushSize + 6, 28), borderRadius: Math.min(brushSize + 6, 28) / 2 }]} />
            </LinearGradient>
          </TouchableOpacity>

          {/* Papel */}
          <TouchableOpacity
            onPress={() => {
              setShowPaperPicker(!showPaperPicker);
              setShowColorPicker(false);
              setShowBrushPicker(false);
              setShowDrawingPicker(false);
              setShowAlphabetPicker(false);
            }}
            style={styles.toolBtn}
          >
            <LinearGradient colors={['#FFA726', '#F57C00']} style={styles.toolBtnGradient}>
              <Ionicons name="document" size={22} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.toolSeparator} />

          {/* 🖼️ Desenhos para espelhar */}
          <TouchableOpacity
            onPress={() => {
              setShowDrawingPicker(!showDrawingPicker);
              setShowColorPicker(false);
              setShowBrushPicker(false);
              setShowPaperPicker(false);
              setShowAlphabetPicker(false);
            }}
            style={[styles.toolBtn, selectedTemplate && selectedTemplate.category !== 'alfabeto' && styles.toolBtnTemplate]}
          >
            <LinearGradient colors={['#E91E63', '#C2185B']} style={styles.toolBtnGradient}>
              <Text style={{ fontSize: 22 }}>🖼️</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* 🔤 Letras do Alfabeto */}
          <TouchableOpacity
            onPress={() => {
              setShowAlphabetPicker(!showAlphabetPicker);
              setShowColorPicker(false);
              setShowBrushPicker(false);
              setShowPaperPicker(false);
              setShowDrawingPicker(false);
            }}
            style={[styles.toolBtn, selectedTemplate && selectedTemplate.category === 'alfabeto' && styles.toolBtnAlphabet]}
          >
            <LinearGradient colors={['#2979FF', '#1565C0']} style={styles.toolBtnGradient}>
              <Text style={{ fontSize: 18, fontWeight: '900', color: '#FFF' }}>Aa</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* ─── POPOVERS ─────────────────────────────────────── */}

        {/* Popover de cores */}
        {showColorPicker && (
          <View style={styles.popover}>
            <Text style={styles.popoverTitle}>🎨 Escolha a Cor</Text>
            <View style={styles.colorGrid}>
              {COLOR_PALETTE.map((c) => (
                <TouchableOpacity
                  key={c.color}
                  onPress={() => {
                    setSelectedColor(c.color);
                    setIsEraser(false);
                    setShowColorPicker(false);
                  }}
                  style={[
                    styles.colorOption,
                    { backgroundColor: c.color },
                    selectedColor === c.color && styles.colorOptionSelected,
                    c.color === '#FFFFFF' && { borderWidth: 2, borderColor: '#CCC' },
                  ]}
                >
                  {selectedColor === c.color && (
                    <Ionicons name="checkmark" size={18} color={c.color === '#FFEA00' || c.color === '#FFFFFF' ? '#333' : '#FFF'} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Popover de espessura */}
        {showBrushPicker && (
          <View style={styles.popover}>
            <Text style={styles.popoverTitle}>✏️ Tamanho do Pincel</Text>
            <View style={styles.brushGrid}>
              {BRUSH_SIZES.map((b) => (
                <TouchableOpacity
                  key={b.size}
                  onPress={() => {
                    setBrushSize(b.size);
                    setShowBrushPicker(false);
                  }}
                  style={[
                    styles.brushOption,
                    brushSize === b.size && styles.brushOptionSelected,
                  ]}
                >
                  <View
                    style={{
                      width: b.size + 6,
                      height: b.size + 6,
                      borderRadius: (b.size + 6) / 2,
                      backgroundColor: selectedColor,
                    }}
                  />
                  <Text style={styles.brushLabel}>{b.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Popover de papel */}
        {showPaperPicker && (
          <View style={styles.popover}>
            <Text style={styles.popoverTitle}>📄 Cor do Papel</Text>
            <View style={styles.paperGrid}>
              {PAPER_BACKGROUNDS.map((p) => (
                <TouchableOpacity
                  key={p.color}
                  onPress={() => {
                    setPaperBg(p.color);
                    setShowPaperPicker(false);
                  }}
                  style={[
                    styles.paperOption,
                    { backgroundColor: p.color },
                    paperBg === p.color && styles.paperOptionSelected,
                    p.color === '#FFFFFF' && { borderWidth: 2, borderColor: '#CCC' },
                  ]}
                >
                  <Ionicons name={p.icon} size={20} color={p.color === '#263238' ? '#FFF' : '#555'} />
                  <Text style={[styles.paperLabel, p.color === '#263238' && { color: '#FFF' }]}>{p.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Popover de desenhos para espelhar */}
        {showDrawingPicker && (
          <View style={[styles.popover, styles.drawingPopover]}>
            <Text style={styles.popoverTitle}>🖼️ Escolha um Desenho para Copiar</Text>
            <TouchableOpacity
              onPress={() => {
                setSelectedTemplate(null);
                setShowDrawingPicker(false);
              }}
              style={[styles.templateClearBtn, !selectedTemplate && { opacity: 0.4 }]}
            >
              <Ionicons name="close-circle" size={18} color="#FF5252" />
              <Text style={styles.templateClearText}>Remover Modelo</Text>
            </TouchableOpacity>
            <ScrollView style={{ maxHeight: 350 }} showsVerticalScrollIndicator={false}>
              {/* ⭐ ESPECIAL — Auto-Retrato */}
              <Text style={[styles.templateCategoryTitle, { color: '#E91E63', fontSize: 14 }]}>⭐ Especial</Text>
              <View style={styles.templateGrid}>
                {DRAWING_TEMPLATES.filter(t => t.category === 'especial').map((t) => (
                  <TouchableOpacity
                    key={t.id}
                    onPress={() => {
                      setSelectedTemplate(t);
                      setShowDrawingPicker(false);
                    }}
                    style={[
                      styles.templateOption,
                      styles.templateOptionSpecial,
                      selectedTemplate?.id === t.id && styles.templateOptionSelected,
                    ]}
                  >
                    <Text style={styles.templateEmoji}>{t.emoji}</Text>
                    <Text style={[styles.templateName, { color: '#E91E63' }]}>{t.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Animais */}
              <Text style={styles.templateCategoryTitle}>🐾 Animais</Text>
              <View style={styles.templateGrid}>
                {DRAWING_TEMPLATES.filter(t => t.category === 'animais').map((t) => (
                  <TouchableOpacity
                    key={t.id}
                    onPress={() => {
                      setSelectedTemplate(t);
                      setShowDrawingPicker(false);
                    }}
                    style={[
                      styles.templateOption,
                      selectedTemplate?.id === t.id && styles.templateOptionSelected,
                    ]}
                  >
                    <Text style={styles.templateEmoji}>{t.emoji}</Text>
                    <Text style={styles.templateName}>{t.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Natureza */}
              <Text style={styles.templateCategoryTitle}>🌿 Natureza</Text>
              <View style={styles.templateGrid}>
                {DRAWING_TEMPLATES.filter(t => t.category === 'natureza').map((t) => (
                  <TouchableOpacity
                    key={t.id}
                    onPress={() => {
                      setSelectedTemplate(t);
                      setShowDrawingPicker(false);
                    }}
                    style={[
                      styles.templateOption,
                      selectedTemplate?.id === t.id && styles.templateOptionSelected,
                    ]}
                  >
                    <Text style={styles.templateEmoji}>{t.emoji}</Text>
                    <Text style={styles.templateName}>{t.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Formas */}
              <Text style={styles.templateCategoryTitle}>🔺 Formas</Text>
              <View style={styles.templateGrid}>
                {DRAWING_TEMPLATES.filter(t => t.category === 'formas').map((t) => (
                  <TouchableOpacity
                    key={t.id}
                    onPress={() => {
                      setSelectedTemplate(t);
                      setShowDrawingPicker(false);
                    }}
                    style={[
                      styles.templateOption,
                      selectedTemplate?.id === t.id && styles.templateOptionSelected,
                    ]}
                  >
                    <Text style={styles.templateEmoji}>{t.emoji}</Text>
                    <Text style={styles.templateName}>{t.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Objetos */}
              <Text style={styles.templateCategoryTitle}>🎁 Objetos</Text>
              <View style={styles.templateGrid}>
                {DRAWING_TEMPLATES.filter(t => t.category === 'objetos').map((t) => (
                  <TouchableOpacity
                    key={t.id}
                    onPress={() => {
                      setSelectedTemplate(t);
                      setShowDrawingPicker(false);
                    }}
                    style={[
                      styles.templateOption,
                      selectedTemplate?.id === t.id && styles.templateOptionSelected,
                    ]}
                  >
                    <Text style={styles.templateEmoji}>{t.emoji}</Text>
                    <Text style={styles.templateName}>{t.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Popover do Alfabeto (separado) */}
        {showAlphabetPicker && (
          <View style={[styles.popover, styles.drawingPopover]}>
            <Text style={styles.popoverTitle}>🔤 Escolha uma Letra</Text>
            <TouchableOpacity
              onPress={() => {
                setSelectedTemplate(null);
                setShowAlphabetPicker(false);
              }}
              style={[styles.templateClearBtn, !selectedTemplate && { opacity: 0.4 }]}
            >
              <Ionicons name="close-circle" size={18} color="#FF5252" />
              <Text style={styles.templateClearText}>Remover Letra</Text>
            </TouchableOpacity>
            <View style={[styles.templateGrid, { gap: 6 }]}>
              {DRAWING_TEMPLATES.filter(t => t.category === 'alfabeto').map((t) => (
                <TouchableOpacity
                  key={t.id}
                  onPress={() => {
                    setSelectedTemplate(t);
                    setShowAlphabetPicker(false);
                  }}
                  style={[
                    styles.templateOptionLetter,
                    { borderColor: t.letterColor + '60' },
                    selectedTemplate?.id === t.id && styles.templateOptionSelected,
                  ]}
                >
                  <Text style={[styles.templateLetterText, { color: t.letterColor }]}>{t.emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}


        {/* ═══════════════ CANVAS DE DESENHO ═══════════════ */}
        <View style={[styles.canvasWrapper]}>
          {/* Decorações nos cantos do canvas */}
          <View style={styles.cornerTL} pointerEvents="none">
            <Text style={styles.cornerEmoji}>🌟</Text>
          </View>
          <View style={styles.cornerTR} pointerEvents="none">
            <Text style={styles.cornerEmoji}>✨</Text>
          </View>
          <View style={styles.cornerBL} pointerEvents="none">
            <Text style={styles.cornerEmoji}>🎨</Text>
          </View>
          <View style={styles.cornerBR} pointerEvents="none">
            <Text style={styles.cornerEmoji}>🖍️</Text>
          </View>

          <View
            style={[styles.canvas, { backgroundColor: paperBg }]}
            {...panResponder.panHandlers}
            onLayout={(event) => {
              const { x, y, width, height } = event.nativeEvent.layout;
              canvasRef.current = { x, y, width, height };
            }}
          >
            {/* Linhas guia sutis (papel pautado) */}
            {paperBg !== '#263238' && (
              <View style={styles.ruledLines} pointerEvents="none">
                {Array.from({ length: 12 }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.ruleLine,
                      { top: `${((i + 1) / 13) * 100}%` },
                    ]}
                  />
                ))}
              </View>
            )}

            {/* Modelo selecionado — BEM GRANDE para a criança traçar por cima */}
            {selectedTemplate && selectedTemplate.id === 'autoretrato' && (
              <FaceOutlineGuide isDark={isDarkPaper} />
            )}
            {selectedTemplate && selectedTemplate.category === 'alfabeto' && (
              <View style={styles.templateWatermark} pointerEvents="none">
                <View style={styles.letterTraceContainer}>
                  <Text style={[
                    styles.letterTraceText,
                    {
                      color: isDarkPaper
                        ? (selectedTemplate.letterColor || '#FFF') + '35'
                        : (selectedTemplate.letterColor || '#000') + '20',
                    }
                  ]}>{selectedTemplate.emoji}</Text>
                  <Text style={[
                    styles.letterTraceSmall,
                    {
                      color: isDarkPaper
                        ? (selectedTemplate.letterColor || '#FFF') + '30'
                        : (selectedTemplate.letterColor || '#000') + '18',
                    }
                  ]}>{selectedTemplate.emoji.toLowerCase()}</Text>
                </View>
                <View style={styles.templateWatermarkBadge}>
                  <Text style={[
                    styles.templateWatermarkLabel,
                    isDarkPaper && { color: 'rgba(255,255,255,0.25)' }
                  ]}>
                    ✏️ Passe o dedo na letra {selectedTemplate.emoji}!
                  </Text>
                </View>
              </View>
            )}
            {selectedTemplate && selectedTemplate.id !== 'autoretrato' && selectedTemplate.category !== 'alfabeto' && (
              <View style={styles.templateWatermark} pointerEvents="none">
                <Text style={[
                  styles.templateWatermarkEmoji,
                  isDarkPaper && { opacity: 0.3 }
                ]}>{selectedTemplate.emoji}</Text>
                <View style={styles.templateWatermarkBadge}>
                  <Text style={[
                    styles.templateWatermarkLabel,
                    isDarkPaper && { color: 'rgba(255,255,255,0.25)' }
                  ]}>
                    ✏️ Passe o dedo por cima!
                  </Text>
                </View>
              </View>
            )}

            {/* Marca d'água padrão quando vazio e sem template */}
            {!selectedTemplate && paths.length === 0 && currentPath.length === 0 && (
              <View style={styles.watermark} pointerEvents="none">
                <Text style={[styles.watermarkEmoji]}>✏️</Text>
                <Text style={[styles.watermarkText, isDarkPaper && { color: 'rgba(255,255,255,0.15)' }]}>
                  Desenhe aqui!
                </Text>
                <Text style={[styles.watermarkSubtext, isDarkPaper && { color: 'rgba(255,255,255,0.10)' }]}>
                  Use o dedo para criar
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* BARRA DE FERRAMENTAS DIREITA */}
        <View style={styles.rightToolbar}>
          {/* Desfazer */}
          <TouchableOpacity
            onPress={handleUndo}
            disabled={paths.length === 0}
            style={[styles.toolBtn, paths.length === 0 && styles.toolBtnDisabled]}
          >
            <LinearGradient
              colors={paths.length > 0 ? ['#66BB6A', '#388E3C'] : ['#9E9E9E', '#757575']}
              style={styles.toolBtnGradient}
            >
              <Ionicons name="arrow-undo" size={24} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>

          {/* Refazer */}
          <TouchableOpacity
            onPress={handleRedo}
            disabled={undoStack.length === 0}
            style={[styles.toolBtn, undoStack.length === 0 && styles.toolBtnDisabled]}
          >
            <LinearGradient
              colors={undoStack.length > 0 ? ['#42A5F5', '#1976D2'] : ['#9E9E9E', '#757575']}
              style={styles.toolBtnGradient}
            >
              <Ionicons name="arrow-redo" size={24} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.toolSeparator} />

          {/* Limpar tudo */}
          <TouchableOpacity
            onPress={handleClear}
            disabled={paths.length === 0 && currentPath.length === 0}
            style={[styles.toolBtn, paths.length === 0 && currentPath.length === 0 && styles.toolBtnDisabled]}
          >
            <LinearGradient
              colors={paths.length > 0 || currentPath.length > 0 ? ['#EF5350', '#C62828'] : ['#9E9E9E', '#757575']}
              style={styles.toolBtnGradient}
            >
              <Ionicons name="trash" size={24} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* ================= BARRA INFERIOR (emojis decorativos + status) ================= */}
      <View style={styles.bottomBar}>
        <LinearGradient colors={['#7B1FA2', '#E040FB']} style={styles.bottomGradient}>
          <Text style={styles.bottomDecorEmoji}>🌈</Text>
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, { backgroundColor: isEraser ? '#FF7043' : selectedColor }]} />
            <Text style={styles.statusText}>
              {isEraser ? '🧽 Borracha' : `🖊️ ${COLOR_PALETTE.find((c) => c.color === selectedColor)?.name || 'Cor'}`}
            </Text>
          </View>
          <Text style={styles.bottomSep}>•</Text>
          <View style={styles.statusItem}>
            <Text style={styles.statusText}>
              {BRUSH_SIZES.find((b) => b.size === brushSize)?.label || 'Média'}
            </Text>
          </View>
          <Text style={styles.bottomSep}>•</Text>
          <View style={styles.statusItem}>
            <Text style={styles.statusText}>
              {selectedTemplate ? `🖼️ ${selectedTemplate.name}` : '📋 Livre'}
            </Text>
          </View>
          <Text style={styles.bottomSep}>•</Text>
          <View style={styles.statusItem}>
            <Text style={styles.statusText}>{paths.length} traços</Text>
          </View>
          <Text style={styles.bottomDecorEmoji}>⭐</Text>
        </LinearGradient>
      </View>

      {/* Camada de Desenho (Tela Inteira) */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {renderDots()}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  // ─── BARRA SUPERIOR ──────────────────────────────────
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  backBtn: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  titleBadge: {
    flex: 1,
    marginHorizontal: 10,
  },
  titleGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.6)',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  titleText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
  titleEmoji: {
    fontSize: 20,
  },
  librasBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  librasBtnActive: {
    backgroundColor: 'rgba(255,255,255,0.4)',
  },

  // ─── ALFABETO COLORIDO ───────────────────────────────
  alphabetBar: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(255, 193, 7, 0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  alphabetScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 2,
  },
  alphabetLetterContainer: {
    alignItems: 'center',
    paddingHorizontal: 3,
    minWidth: 28,
  },
  alphabetLetter: {
    fontSize: 20,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  alphabetLetterSmall: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: -3,
    opacity: 0.7,
  },
  alphabetDecor: {
    fontSize: 20,
    marginLeft: 6,
  },

  // ─── ÁREA PRINCIPAL ──────────────────────────────────
  mainArea: {
    flex: 1,
    flexDirection: 'row',
    padding: 6,
    gap: 6,
  },

  // ─── TOOLBARS ────────────────────────────────────────
  leftToolbar: {
    width: 54,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    paddingVertical: 8,
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    zIndex: 5,
    borderWidth: 2,
    borderColor: 'rgba(255,193,7,0.3)',
  },
  rightToolbar: {
    width: 54,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    paddingVertical: 8,
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    zIndex: 5,
    borderWidth: 2,
    borderColor: 'rgba(255,193,7,0.3)',
  },
  toolBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  toolBtnActive: {
    borderWidth: 3,
    borderColor: '#FFEB3B',
  },
  toolBtnTemplate: {
    borderWidth: 3,
    borderColor: '#E91E63',
  },
  toolBtnAlphabet: {
    borderWidth: 3,
    borderColor: '#2979FF',
  },
  toolBtnDisabled: {
    opacity: 0.4,
  },
  toolBtnGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolSeparator: {
    width: 26,
    height: 2,
    backgroundColor: 'rgba(0,0,0,0.12)',
    borderRadius: 1,
    marginVertical: 1,
  },
  colorPreview: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  brushPreviewDot: {
    backgroundColor: '#FFF',
  },

  // ─── POPOVERS ────────────────────────────────────────
  popover: {
    position: 'absolute',
    left: 66,
    top: 5,
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderRadius: 18,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 15,
    zIndex: 100,
    borderWidth: 2,
    borderColor: 'rgba(255,193,7,0.4)',
    minWidth: 190,
  },
  drawingPopover: {
    minWidth: 260,
    maxHeight: 400,
  },
  popoverTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  colorOption: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: '#FFEB3B',
    transform: [{ scale: 1.15 }],
  },
  brushGrid: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  brushOption: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    gap: 5,
  },
  brushOptionSelected: {
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: '#2979FF',
  },
  brushLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#555',
  },
  paperGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  paperOption: {
    width: 58,
    height: 58,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    gap: 2,
  },
  paperOptionSelected: {
    borderWidth: 3,
    borderColor: '#FFEB3B',
    transform: [{ scale: 1.1 }],
  },
  paperLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#555',
  },

  // ─── TEMPLATE/DESENHOS POPOVER ───────────────────────
  templateClearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#FFF3F3',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  templateClearText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF5252',
  },
  templateCategoryTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 8,
    marginBottom: 6,
    paddingLeft: 4,
  },
  templateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 5,
  },
  templateOption: {
    width: 68,
    height: 68,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    gap: 2,
  },
  templateOptionSelected: {
    borderWidth: 3,
    borderColor: '#E91E63',
    backgroundColor: '#FCE4EC',
    transform: [{ scale: 1.08 }],
  },
  templateOptionSpecial: {
    backgroundColor: '#FFF3E0',
    borderWidth: 2,
    borderColor: '#FFB74D',
    width: 80,
    height: 78,
  },
  templateEmoji: {
    fontSize: 28,
  },
  templateName: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#666',
  },
  templateOptionLetter: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  templateLetterText: {
    fontSize: 22,
    fontWeight: '900',
  },
  letterTraceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  letterTraceText: {
    fontSize: 280,
    fontWeight: '900',
    lineHeight: 300,
    textShadowColor: 'rgba(0,0,0,0.03)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  letterTraceSmall: {
    fontSize: 140,
    fontWeight: '800',
    lineHeight: 160,
    marginBottom: 10,
  },

  // ─── CANVAS ──────────────────────────────────────────
  canvasWrapper: {
    flex: 1,
    position: 'relative',
  },
  canvas: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: 'rgba(255,193,7,0.5)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cornerTL: { position: 'absolute', top: -6, left: -6, zIndex: 10 },
  cornerTR: { position: 'absolute', top: -6, right: -6, zIndex: 10 },
  cornerBL: { position: 'absolute', bottom: -6, left: -6, zIndex: 10 },
  cornerBR: { position: 'absolute', bottom: -6, right: -6, zIndex: 10 },
  cornerEmoji: {
    fontSize: 18,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  ruledLines: {
    ...StyleSheet.absoluteFillObject,
  },
  ruleLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(173,216,230,0.25)',
  },

  // Modelo (marca d'água) para espelhar — BEM GRANDE
  templateWatermark: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  templateWatermarkEmoji: {
    fontSize: 260,
    opacity: 0.25,
    textShadowColor: 'rgba(0,0,0,0.08)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 5,
  },
  templateWatermarkBadge: {
    backgroundColor: 'rgba(233,30,99,0.08)',
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(233,30,99,0.12)',
  },
  templateWatermarkLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgba(0,0,0,0.15)',
    letterSpacing: 1,
  },

  // Marca d'água padrão
  watermark: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  watermarkEmoji: {
    fontSize: 60,
    opacity: 0.12,
  },
  watermarkText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'rgba(0,0,0,0.08)',
    letterSpacing: 1,
  },
  watermarkSubtext: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(0,0,0,0.05)',
  },

  // ─── BARRA INFERIOR ──────────────────────────────────
  bottomBar: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  bottomGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 15,
    gap: 8,
  },
  bottomDecorEmoji: {
    fontSize: 16,
  },
  bottomSep: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});
