// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAudio } from '../../hooks/useAudio';
import { gameStyles, OPTION_GRADIENTS } from '../../constants/GameStyles';
import { GameInfoButton } from '../../components/GameIntro';

const STORY_PAGES = [
  { id: 1, text: "ERA UMA VEZ UM MENINO CHAMADO KADU.", image: "👦", speak: "Era uma vez um menino chamado Kadu." },
  { id: 2, text: "ELE ADORAVA BRINCAR COM SEU CACHORRO REX.", image: "🐶", speak: "Ele adorava brincar com seu cachorro Rex." },
  { id: 3, text: "UM DIA, ELES ACHARAM UM MAPA MÁGICO...", image: "🗺️", speak: "Um dia, eles acharam um mapa mágico." },
  { id: 4, text: "E FORAM PARAR NO MUNDO DAS LETRAS!", image: "✨", speak: "E foram parar no mundo das letras!" },
  { id: 5, text: "LÁ, ELES CONHECERAM O SAPO SAMUCA.", image: "🐸", speak: "Lá, eles conheceram o sapo Samuca." },
  { id: 6, text: "JUNTOS, ELES APRENDERAM A LER E ESCREVER.", image: "✏️", speak: "Juntos, eles aprenderam a ler e escrever." },
  { id: 7, text: "E VIVERAM FELIZES PARA SEMPRE!", image: "💖", speak: "E viveram felizes para sempre!" },
];

export default function BibliotecaGame() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [score, setScore] = useState(0);

  const { playSuccess, playCoin, speakText, stopSpeech } = useAudio();
  const page = STORY_PAGES[currentPage];

  useEffect(() => {
    const timer = setTimeout(() => {
      stopSpeech();
      speakText(page.speak);
    }, 800);
    return () => clearTimeout(timer);
  }, [currentPage]);

  const handleNextPage = () => {
    playCoin();
    if (currentPage < STORY_PAGES.length - 1) {
      setCurrentPage(currentPage + 1);
      setScore(s => s + 5);
    } else {
      playSuccess();
      Alert.alert(
        "FIM DA HISTÓRIA!",
        `Você leu o livro inteiro e ganhou ${score + 50} moedas!`,
        [{ text: "Voltar ao Mapa", onPress: () => router.push('/') }]
      );
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <ImageBackground source={require('../../assets/images/bg_escola.jpg')} style={gameStyles.background} resizeMode="cover" blurRadius={4}>
      <StatusBar hidden={true} />

      {/* ─── HUD ─── */}
      <LinearGradient colors={['#009432', '#12CBC4', '#4D96FF']} style={gameStyles.hud}>
        <TouchableOpacity onPress={() => router.push('/')} style={gameStyles.hudBackBtn}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>

        <View style={gameStyles.hudCenter}>
          <Text style={gameStyles.hudTitle}>📖 A HISTÓRIA DE KADU</Text>
          <View style={gameStyles.hudBadge}>
            <Text style={gameStyles.hudBadgeText}>Página {currentPage + 1} de {STORY_PAGES.length}</Text>
          </View>
          {/* Progress dots */}
          <View style={gameStyles.progressContainer}>
            {STORY_PAGES.map((_, i) => (
              <View
                key={i}
                style={[
                  gameStyles.progressDot,
                  i < currentPage && gameStyles.progressDotDone,
                  i === currentPage && gameStyles.progressDotActive,
                ]}
              />
            ))}
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

      {/* ─── GAME AREA ─── */}
      <View style={gameStyles.gameArea}>
        <View style={styles.bookContainer}>
          <View style={styles.imageBox}>
            <Text style={styles.emojiText}>{page.image}</Text>
          </View>
          <Text style={styles.storyText}>{page.text}</Text>
          <Text style={styles.pageNumber}>Página {currentPage + 1} de {STORY_PAGES.length}</Text>
        </View>

        {/* ─── NAVIGATION BUTTONS ─── */}
        <View style={{ flexDirection: 'row', gap: 20 }}>
          {currentPage > 0 && (
            <TouchableOpacity activeOpacity={0.8} onPress={handlePrevPage} style={gameStyles.answerBtnOuter}>
              <LinearGradient colors={OPTION_GRADIENTS[4]} style={[gameStyles.answerBtnGradient, { flexDirection: 'row', paddingHorizontal: 30 }]}>
                <View style={gameStyles.answerBtnGloss} />
                <Ionicons name="arrow-back" size={24} color="white" style={{ marginRight: 10 }} />
                <Text style={gameStyles.answerBtnTextSmall}>VOLTAR</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          <TouchableOpacity activeOpacity={0.8} onPress={handleNextPage} style={gameStyles.answerBtnOuter}>
            <LinearGradient colors={OPTION_GRADIENTS[2]} style={[gameStyles.answerBtnGradient, { flexDirection: 'row', paddingHorizontal: 30 }]}>
              <View style={gameStyles.answerBtnGloss} />
              <Text style={gameStyles.answerBtnTextSmall}>{currentPage === STORY_PAGES.length - 1 ? "TERMINAR" : "PRÓXIMA PÁGINA"}</Text>
              <Ionicons name="arrow-forward" size={24} color="white" style={{ marginLeft: 10 }} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bookContainer: {
    width: '60%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: '#12CBC4',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8,
  },
  imageBox: { marginBottom: 15 },
  emojiText: { fontSize: 80 },
  storyText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C2C54',
    textAlign: 'center',
    marginBottom: 15,
  },
  pageNumber: { fontSize: 14, color: '#888', fontWeight: 'bold' },
  navBtnWide: {
    flexDirection: 'row',
    width: 160,
    height: 60,
  },
});
