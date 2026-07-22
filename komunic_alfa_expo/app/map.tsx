// @ts-nocheck
import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { useRouter } from 'expo-router';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { TRACKS } from '../constants/TrackData';

const TrackCard = ({ track, onPress }) => (
  <TouchableOpacity activeOpacity={0.85} style={styles.trackCardContainer} onPress={onPress}>
    <LinearGradient colors={track.color} style={styles.trackCard}>
      <View style={styles.glossyHighlight} />
      <Text style={styles.trackCardEmoji}>{track.games[0]?.emoji || '🗺️'}</Text>
      <Text style={styles.trackCardTitle}>{track.title}</Text>
      <Text style={styles.trackCardSubtitle}>{track.subtitle}</Text>
      <Text style={styles.trackCardMeta}>{track.games.length} jogos nesta trilha</Text>
    </LinearGradient>
  </TouchableOpacity>
);

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
      <SafeAreaView edges={["top"]} style={styles.hud}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back-circle" size={40} color="white" />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>🗺️ O MAPA MÁGICO</Text>
        </View>

        <View style={styles.rightHudGroup}>
          <TouchableOpacity onPress={toggleLibras} style={[styles.librasBtn, isLibrasActive && styles.librasBtnActive]}>
            <FontAwesome5 name="sign-language" size={24} color={isLibrasActive ? '#FFF' : '#666'} />
          </TouchableOpacity>

          <View style={styles.scoreBoard}>
            <FontAwesome5 name="coins" size={20} color={Colors.coinGold} />
            <Text style={styles.scoreText}> 140</Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* CASTELO DE LIBRAS (DESTAQUE) */}
        <View style={styles.trackCardWrapper}>
          <TouchableOpacity activeOpacity={0.85} style={styles.trackCardContainer} onPress={() => router.push('/games/mundo_libras')}>
            <LinearGradient colors={['#1E88E5', '#1565C0']} style={[styles.trackCard, { minHeight: 200, borderWidth: 4, borderColor: '#FFD700' }]}>
              <View style={styles.glossyHighlight} />
              <Text style={{fontSize: 50, textAlign: 'center'}}>🧏‍♀️</Text>
              <Text style={{fontSize: 26, fontWeight: '900', color: '#FFF', marginTop: 10, textAlign: 'center', textShadowColor: 'rgba(0, 0, 0, 0.5)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3}}>
                MUNDO DE LIBRAS
              </Text>
              <Text style={styles.trackCardSubtitle}>O jogo especial de acessibilidade com dicionário e quiz!</Text>
              <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 15}}>
                <Ionicons name="star" size={24} color="#FFD700" />
                <Ionicons name="star" size={24} color="#FFD700" />
                <Ionicons name="star" size={24} color="#FFD700" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {TRACKS.map((track) => (
          <View key={track.id} style={styles.trackCardWrapper}>
            <TrackCard track={track} onPress={() => router.push(`/tracks/${track.id}`)} />
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8,
  },
  titleContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: Colors.playButtonGradient[1],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.textDark,
    letterSpacing: 1,
  },
  rightHudGroup: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
  },
  scoreBoard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(25, 118, 210, 0.9)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#64B5F6',
  },
  scoreText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    paddingBottom: 50,
  },
  trackCardWrapper: {
    marginBottom: 24,
  },
  trackCardContainer: {
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  trackCard: {
    padding: 20,
    borderRadius: 28,
    minHeight: 180,
    justifyContent: 'space-between',
  },
  glossyHighlight: {
    position: 'absolute',
    top: 12,
    left: '10%',
    right: '10%',
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 18,
  },
  trackCardEmoji: {
    fontSize: 36,
    textAlign: 'center',
  },
  trackCardTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFF',
    marginTop: 10,
    textAlign: 'center',
  },
  trackCardSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.92)',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  trackCardMeta: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 12,
  },
  librasBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  librasBtnActive: {
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
});
