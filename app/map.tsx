// @ts-nocheck
import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { useRouter } from 'expo-router';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useAudio } from '../hooks/useAudio';

const TRACKS = [
  {
    id: 1,
    title: 'TRILHA 1: EXPLORADORES (Não-Leitores)',
    subtitle: 'Foco na visão, escuta e lógica! Sem precisar ler.',
    color: ['#4CAF50', '#2E7D32'],
    games: [
      { id: 15, path: '/games/festa_numeros', title: 'FESTA DOS NÚMEROS', color: ['#FF9800', '#EF6C00'], stars: 0, emoji: '🔢' },
      { id: 9, path: '/games/sombras', title: 'JOGO DAS SOMBRAS', color: ['#424242', '#212121'], stars: 0, emoji: '👤' },
      { id: 7, path: '/games/formas', title: 'CASTELO DAS FORMAS', color: ['#FF9800', '#F57C00'], stars: 0, emoji: '🔺' },
      { id: 11, path: '/games/intruso', title: 'DESAFIO DO INTRUSO', color: ['#9C27B0', '#6A1B9A'], stars: 0, emoji: '🕵️' },
      { id: 13, path: '/games/traco?mode=guiada', title: 'DESCOBRINDO AS LETRAS', color: ['#4CAF50', '#1B5E20'], stars: 0, emoji: '✍️' },
      { id: 14, path: '/games/traco?mode=livre', title: 'ESCREVENDO SOZINHO', color: ['#2196F3', '#0D47A1'], stars: 0, emoji: '📝' },
    ]
  },
  {
    id: 2,
    title: 'TRILHA 2: CURIOSOS (Primeiros Passos)',
    subtitle: 'Ouvindo os sons, rimando e conhecendo as letras.',
    color: ['#00BCD4', '#0097A7'],
    games: [
      { id: 8, path: '/games/fonico', title: 'LABORATÓRIO DOS SONS', color: ['#8A2387', '#E94057'], stars: 0, emoji: '🎵' },
      { id: 10, path: '/games/rimas', title: 'OFICINA DE RIMAS', color: ['#E91E63', '#C2185B'], stars: 0, emoji: '🛠️' },
      { id: 1, path: '/games/letras', title: 'VILA DAS LETRAS', color: Colors.blueButtonGradient, stars: 3, emoji: '🔤' },
      { id: 12, path: '/games/festa_alfabeto', title: 'FESTA DO ALFABETO', color: ['#FF5252', '#D32F2F'], stars: 0, emoji: '🎈' },
      { id: 2, path: '/games/vogais', title: 'JARDIM DAS VOGAIS', color: Colors.playButtonGradient, stars: 2, emoji: '🌷' },
    ]
  },
  {
    id: 3,
    title: 'TRILHA 3: CONSTRUTORES (Formando Palavras)',
    subtitle: 'Juntando pedacinhos para formar palavras inteiras.',
    color: ['#FF9800', '#E65100'],
    games: [
      { id: 3, path: '/games/silabas', title: 'VALE DAS SÍLABAS', color: Colors.orangeButtonGradient, stars: 1, emoji: '🧩' },
      { id: 4, path: '/games/palavras', title: 'FLORESTA DAS PALAVRAS', color: Colors.purpleButtonGradient, stars: 0, emoji: '🌲' },
    ]
  },
  {
    id: 4,
    title: 'TRILHA 4: MESTRES (Leitura Fluente)',
    subtitle: 'Lendo frases e histórias de forma independente!',
    color: ['#F44336', '#C62828'],
    games: [
      { id: 5, path: '/games/frases', title: 'VILA DAS FRASES', color: Colors.redButtonGradient, stars: 0, emoji: '💬' },
      { id: 6, path: '/games/biblioteca', title: 'BIBLIOTECA ENCANTADA', color: Colors.blueButtonGradient, stars: 0, emoji: '📚' },
    ]
  }
];

const LargeWorldNode = ({ title, colors, stars, onPress, emoji }) => {
  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.nodeContainer} onPress={onPress}>
      <LinearGradient colors={colors} style={styles.nodeBubble}>
        <View style={styles.glossyHighlight} />
        <Text style={styles.nodeEmoji}>{emoji}</Text>
        <Text style={styles.nodeTitle}>{title}</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3].map((s) => (
            <Ionicons key={s} name="star" size={20} color={s <= stars ? Colors.starYellow : 'rgba(0,0,0,0.3)'} />
          ))}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default function MapScreen() {
  const router = useRouter();
  const { isLibrasActive, toggleLibras } = useAccessibility();

  return (
    <ImageBackground 
      source={require('../assets/images/bg_escola.jpg')} 
      style={styles.background}
      resizeMode="cover"
      blurRadius={2}
    >
      <StatusBar hidden={true} />
      
      {/* ================= HUD SUPERIOR ================= */}
      <SafeAreaView edges={["top"]} style={styles.hud}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back-circle" size={40} color="white" />
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
           <Text style={styles.titleText}>🗺️ O MAPA MÁGICO</Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 15 }}>
          <TouchableOpacity onPress={toggleLibras} style={[styles.librasBtn, isLibrasActive && styles.librasBtnActive]}>
             <FontAwesome5 name="sign-language" size={24} color={isLibrasActive ? "#FFF" : "#666"} />
          </TouchableOpacity>

          <View style={styles.scoreBoard}>
             <FontAwesome5 name="coins" size={20} color={Colors.coinGold} />
             <Text style={styles.scoreText}> 140</Text>
          </View>
        </View>
      </SafeAreaView>

      {/* ================= MAPA DE FASES ================= */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {TRACKS.map((track) => (
          <View key={track.id} style={styles.trackContainer}>
            <LinearGradient colors={track.color} style={styles.trackHeader}>
              <Text style={styles.trackTitle}>{track.title}</Text>
              <Text style={styles.trackSubtitle}>{track.subtitle}</Text>
            </LinearGradient>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trackGamesRow}>
              {track.games.map((world) => (
                <LargeWorldNode 
                  key={world.id}
                  emoji={world.emoji}
                  title={world.title}
                  colors={world.color}
                  stars={world.stars}
                  onPress={() => router.push(world.path as any)}
                />
              ))}
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  hud: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  backBtn: {
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 5, elevation: 8,
  },
  titleContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20, paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 3, borderColor: Colors.playButtonGradient[1],
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 5, elevation: 8,
  },
  titleText: {
    fontSize: 18, fontWeight: '900', color: Colors.textDark, letterSpacing: 1,
  },
  scoreBoard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(25, 118, 210, 0.9)',
    paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20,
    borderWidth: 2, borderColor: '#64B5F6',
  },
  scoreText: {
    color: '#FFF', fontWeight: 'bold', fontSize: 18,
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    paddingBottom: 50,
  },
  trackContainer: {
    marginBottom: 40,
  },
  trackHeader: {
    padding: 15,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.8)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 5, elevation: 8,
  },
  trackTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  trackSubtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.9)',
    marginTop: 5,
  },
  trackGamesRow: {
    paddingHorizontal: 10,
    gap: 20,
  },
  nodeContainer: {
    width: 140, height: 140,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 5, elevation: 8,
  },
  nodeBubble: {
    flex: 1,
    borderRadius: 25,
    borderWidth: 4, borderColor: '#FFF',
    padding: 10,
    alignItems: 'center', justifyContent: 'space-between',
  },
  glossyHighlight: {
    position: 'absolute', top: 5, left: '10%', right: '10%', height: '30%',
    backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 15,
  },
  nodeEmoji: {
    fontSize: 45,
    textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: {width: 2, height: 2}, textShadowRadius: 3,
  },
  nodeTitle: {
    fontSize: 12, color: '#FFF', fontWeight: 'bold', textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: {width: 2, height: 2}, textShadowRadius: 3,
  },
  starsRow: {
    flexDirection: 'row', gap: 2,
  },
  librasBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  librasBtnActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  }
});
