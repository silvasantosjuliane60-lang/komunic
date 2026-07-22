// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAudio } from '../../hooks/useAudio';
import { gameStyles, OPTION_GRADIENTS } from '../../constants/GameStyles';
import { GameInfoButton } from '../../components/GameIntro';

const STORY_LEVELS = [
  {
    id: 1,
    title: 'Nível 1: O Mapa Mágico',
    pages: [
      {
        id: 1,
        title: 'O Mapa Brilhante',
        description: 'Kadu encontrou um mapa brilhante e seguiu as letras até a floresta encantada.',
        image: '🗺️',
        speak: 'Kadu encontrou um mapa brilhante e seguiu as letras até a floresta encantada.',
      },
      {
        id: 2,
        title: 'A Floresta das Letras',
        description: 'As árvores sussurravam sons e cada trilha revelava uma nova palavra.',
        image: '🌳',
        speak: 'As árvores sussurravam sons e cada trilha revelava uma nova palavra.',
      },
      {
        id: 3,
        title: 'O Segredo do Tesouro',
        description: 'No final do caminho, Kadu encontrou um tesouro de letras brilhantes.',
        image: '💎',
        speak: 'No final do caminho, Kadu encontrou um tesouro de letras brilhantes.',
      },
    ],
  },
  {
    id: 2,
    title: 'Nível 2: O Sapo Samuca',
    pages: [
      {
        id: 1,
        title: 'O Lago Cantante',
        description: 'No lago das letras, Samuca cantou versos que fizeram as palavras dançar.',
        image: '🐸',
        speak: 'No lago das letras, Samuca cantou versos que fizeram as palavras dançar.',
      },
      {
        id: 2,
        title: 'Os Versos Mágicos',
        description: 'Cada verso brilhava como estrelas e ajudava Kadu a formar frases lindas.',
        image: '🎶',
        speak: 'Cada verso brilhava como estrelas e ajudava Kadu a formar frases lindas.',
      },
      {
        id: 3,
        title: 'A Canção das Palavras',
        description: 'Samuca ensinou que ler é como cantar e cada palavra tem seu ritmo.',
        image: '✨',
        speak: 'Samuca ensinou que ler é como cantar e cada palavra tem seu ritmo.',
      },
    ],
  },
  {
    id: 3,
    title: 'Nível 3: As Letras Brilhantes',
    pages: [
      {
        id: 1,
        title: 'As Letras no Céu',
        description: 'As letras brilharam no céu e Kadu começou a reconhecer cada forma.',
        image: '🌟',
        speak: 'As letras brilharam no céu e Kadu começou a reconhecer cada forma.',
      },
      {
        id: 2,
        title: 'A Biblioteca de Sonhos',
        description: 'Uma biblioteca encantada abriu portas para histórias coloridas e amigos novos.',
        image: '📚',
        speak: 'Uma biblioteca encantada abriu portas para histórias coloridas e amigos novos.',
      },
      {
        id: 3,
        title: 'O Leitor Feliz',
        description: 'No final, Kadu virou um leitor feliz e descobriu que ler é uma grande aventura.',
        image: '😊',
        speak: 'No final, Kadu virou um leitor feliz e descobriu que ler é uma grande aventura.',
      },
    ],
  },
];

export default function BibliotecaGame() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [score, setScore] = useState(0);

  const { playSuccess, playCoin, speakText, stopSpeech } = useAudio();
  const activeLevel = STORY_LEVELS.find((level) => level.id === selectedLevel) ?? null;
  const activePage = activeLevel?.pages[currentPage] ?? null;

  useEffect(() => {
    if (!activePage) return;
    const timer = setTimeout(() => {
      stopSpeech();
      speakText(activePage.speak);
    }, 800);
    return () => {
      clearTimeout(timer);
      stopSpeech();
    };
  }, [activePage]);

  const handleSelectLevel = (levelId: number) => {
    setSelectedLevel(levelId);
    setCurrentPage(0);
    setScore(20);
  };

  const handleNextPage = () => {
    if (!activeLevel) return;
    if (currentPage < activeLevel.pages.length - 1) {
      playCoin();
      setCurrentPage((prev) => prev + 1);
      setScore((prev) => prev + 20);
      return;
    }

    playSuccess();
    setScore((prev) => prev + 80);
    setSelectedLevel(null);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
      return;
    }
    setSelectedLevel(null);
  };

  const handleBack = () => {
    if (selectedLevel) {
      setSelectedLevel(null);
      return;
    }
    router.push('/');
  };

  return (
    <ImageBackground source={require('../../assets/images/bg_escola.jpg')} style={gameStyles.background} resizeMode="cover" blurRadius={4}>
      <StatusBar hidden={true} />

      <SafeAreaView edges={["top"]}>
        <LinearGradient colors={['#009432', '#12CBC4', '#4D96FF']} style={gameStyles.hud}>
          <TouchableOpacity onPress={handleBack} style={gameStyles.hudBackBtn}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>

          <View style={gameStyles.hudCenter}>
            <Text style={gameStyles.hudTitle}>📚 BIBLIOTECA ENCANTADA</Text>
            <View style={gameStyles.hudBadge}>
              <Text style={gameStyles.hudBadgeText}>
                {selectedLevel ? activeLevel?.title : 'Escolha um nível de história'}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <GameInfoButton gameKey="biblioteca" />
            <View style={gameStyles.hudScore}>
              <Text style={gameStyles.hudScoreLabel}>MOEDAS</Text>
              <Text style={gameStyles.hudScoreValue}>{score}</Text>
            </View>
          </View>
        </LinearGradient>
      </SafeAreaView>

      {selectedLevel === null ? (
        <View style={gameStyles.gameArea}>
          <Text style={styles.selectionTitle}>Trilha dos Mestres</Text>
          <Text style={styles.selectionSubtitle}>Selecione uma história para ler em uma página.</Text>
          <View style={styles.levelGrid}>
            {STORY_LEVELS.map((level) => (
              <TouchableOpacity
                key={level.id}
                activeOpacity={0.85}
                onPress={() => handleSelectLevel(level.id)}
                style={styles.levelCard}
              >
                <Text style={styles.levelEmoji}>{level.image}</Text>
                <Text style={styles.levelTitle}>{level.title}</Text>
                <Text style={styles.levelDescription}>{level.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <View style={[gameStyles.gameArea, styles.bookArea]}>
          <View style={styles.bookShell}>
            <View style={styles.bookSpine} />
            <View style={styles.bookPage}>
              <View style={styles.pageHeaderContainer}>
                <View style={styles.headerLine} />
                <View style={styles.headerCenter}>
                  <Text style={styles.pageHeaderEmoji}>{activePage?.image}</Text>
                  <Text style={styles.pageHeader}>{activePage?.title}</Text>
                </View>
                <View style={styles.headerLine} />
              </View>
              <View style={styles.illustrationCard}>
                <View style={styles.illustrationTop}>
                  <Text style={styles.illustrationBadge}>📖</Text>
                  <Text style={styles.illustrationLabel}>Ilustração</Text>
                  <Text style={styles.illustrationBadge}>✨</Text>
                </View>
                <Text style={styles.illustrationEmoji}>{activePage?.image}</Text>
                <Text style={styles.illustrationCaption}>Gravura da história</Text>
              </View>
              <View style={styles.pageContent}>
                <Text style={styles.storyText}>{activePage?.description}</Text>
              </View>
              <Text style={styles.pageNumber}>
                Página {currentPage + 1} de {activeLevel?.pages.length}
              </Text>
              <View style={styles.pageFooter}>
                <Text style={styles.pageFooterText}>Biblioteca Encantada</Text>
              </View>
            </View>
          </View>

          <View style={styles.navigationRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={currentPage === 0 ? () => setSelectedLevel(null) : handlePrevPage}
              style={styles.smallArrowButton}
            >
              <Ionicons name="arrow-back" size={18} color="white" />
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.8} onPress={handleNextPage} style={[styles.smallArrowButton, styles.completeArrowButton]}>
              <Ionicons name="arrow-forward" size={18} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  selectionTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFE066',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  selectionSubtitle: {
    fontSize: 16,
    color: '#FFF3C4',
    textAlign: 'center',
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  levelGrid: {
    width: '100%',
    flexDirection: 'column',
    gap: 16,
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  levelCard: {
    backgroundColor: '#FFF5E6',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FFD067',
  },
  levelEmoji: {
    fontSize: 44,
    textAlign: 'center',
    marginBottom: 12,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#7A4F2A',
    textAlign: 'center',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  levelDescription: {
    fontSize: 14,
    color: '#5E4B3C',
    textAlign: 'center',
    lineHeight: 22,
  },
  bookArea: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  bookShell: {
    width: '90%',
    maxWidth: 420,
    backgroundColor: '#F6E7D7',
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#C9A78D',
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 10,
  },
  bookSpine: {
    position: 'absolute',
    left: 10,
    top: 14,
    bottom: 14,
    width: 12,
    backgroundColor: '#D3B69F',
    borderRadius: 8,
  },
  bookPage: {
    backgroundColor: '#FFF9F0',
    borderRadius: 20,
    padding: 20,
    overflow: 'hidden',
  },
  pageHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#FFF5E6',
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(140, 94, 60, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  headerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(140, 94, 60, 0.4)',
  },
  headerCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  pageHeaderEmoji: {
    fontSize: 26,
    marginBottom: 2,
  },
  pageHeader: {
    fontSize: 16,
    fontWeight: '900',
    color: '#8C5E3C',
    textTransform: 'uppercase',
    textAlign: 'center',
    letterSpacing: 1.5,
    lineHeight: 22,
  },
  illustrationCard: {
    backgroundColor: '#FFF2DF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#FFD8A8',
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  illustrationTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  illustrationBadge: {
    fontSize: 18,
  },
  illustrationLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8C5E3C',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  illustrationEmoji: {
    fontSize: 70,
    marginBottom: 10,
  },
  illustrationCaption: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8C5E3C',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  pageContent: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(200, 150, 80, 0.18)',
  },
  emojiText: {
    fontSize: 62,
    marginBottom: 12,
    textAlign: 'center',
  },
  storyText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3A2B1B',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 32,
  },
  pageNumber: {
    fontSize: 14,
    color: '#8C5E3C',
    fontWeight: '700',
    textAlign: 'center',
  },
  pageFooter: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(200, 150, 80, 0.2)',
  },
  pageFooterText: {
    fontSize: 12,
    color: '#A17F61',
    textTransform: 'uppercase',
    textAlign: 'center',
    letterSpacing: 1,
  },
  navigationRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  smallArrowButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#8C5E3C',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#C9A78D',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  completeArrowButton: {
    backgroundColor: '#C9A78D',
    borderColor: '#DCC2A2',
  },
});
