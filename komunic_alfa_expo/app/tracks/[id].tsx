// @ts-nocheck
import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { TRACKS } from '../../constants/TrackData';
import { Colors } from '../../constants/Colors';
import { gameStyles } from '../../constants/GameStyles';
import { GameInfoButton } from '../../components/GameIntro';
import { useAccessibility } from '../../contexts/AccessibilityContext';

const TrackGameCard = ({ game, onPress }) => (
  <TouchableOpacity activeOpacity={0.85} style={styles.gameCard} onPress={onPress}>
    <LinearGradient colors={game.color} style={styles.gameCardGradient}>
      <View style={styles.glossyHighlight} />
      <Text style={styles.gameEmoji}>{game.emoji}</Text>
      <Text style={styles.gameTitle}>{game.title}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

export default function TrackPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { isLibrasActive } = useAccessibility();

  const trackId = Number(id);
  const track = TRACKS.find((item) => item.id === trackId);

  if (!track) {
    return (
      <ImageBackground source={require('../../assets/images/bg_escola.jpg')} style={gameStyles.background} resizeMode="cover" blurRadius={4}>
        <StatusBar hidden />
        <SafeAreaView edges={["top"]} style={styles.errorWrapper}>
          <Text style={styles.errorText}>Trilha não encontrada.</Text>
          <TouchableOpacity style={styles.errorButton} onPress={() => router.push('/map')}>
            <Text style={styles.errorButtonText}>Voltar ao mapa</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={require('../../assets/images/bg_escola.jpg')} style={gameStyles.background} resizeMode="cover" blurRadius={4}>
      <StatusBar hidden />
      <SafeAreaView edges={["top"]} style={styles.container}>
        <LinearGradient colors={track.color} style={gameStyles.hud}>
          <TouchableOpacity onPress={() => router.push('/map')} style={gameStyles.hudBackBtn}>
            <Ionicons name="arrow-back" size={26} color="#FFF" />
          </TouchableOpacity>
          <View style={gameStyles.hudCenter}>
            <Text style={gameStyles.hudTitle}>{track.title}</Text>
            <View style={gameStyles.hudBadge}>
              <Text style={gameStyles.hudBadgeText}>{track.subtitle}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <GameInfoButton gameKey="fonico" style={{ marginRight: 8 }} />
          </View>
        </LinearGradient>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.trackInfoBox}>
            <Text style={styles.trackInfoTitle}>Jogos desta trilha</Text>
            <Text style={styles.trackInfoSubtitle}>Selecione um jogo para começar.</Text>
          </View>

          <View style={styles.gamesGrid}>
            {track.games.map((game) => (
              <TrackGameCard
                key={game.id}
                game={game}
                onPress={() => router.push(game.path as any)}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  trackInfoBox: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 22,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.85)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  trackInfoTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#2C2C54',
    marginBottom: 8,
  },
  trackInfoSubtitle: {
    fontSize: 14,
    color: '#4D4D4D',
    lineHeight: 20,
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  gameCard: {
    width: '48%',
    minHeight: 140,
    marginBottom: 12,
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  gameCardGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  gameEmoji: {
    fontSize: 32,
    textAlign: 'center',
  },
  gameTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFF',
    textAlign: 'center',
    marginTop: 12,
  },
  errorWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFF',
    marginBottom: 16,
  },
  errorButton: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  errorButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C2C54',
  },
});