// @ts-nocheck
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { useAudio } from '../../hooks/useAudio';

export default function CAAHub() {
  const router = useRouter();
  const { isLibrasActive, toggleLibras } = useAccessibility();
  const { playSuccess } = useAudio();

  const handleNavigate = (route) => {
    router.push(route);
  };

  return (
    <ImageBackground
      source={require('../../assets/images/bg_escola.jpg')}
      style={styles.background}
      resizeMode="cover"
      blurRadius={3}
    >
      <StatusBar hidden={true} />

      {/* ================= BARRA SUPERIOR ================= */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back-circle" size={40} color="white" />
        </TouchableOpacity>

        <View style={styles.titleBadge}>
          <LinearGradient colors={['#FF6F00', '#FF8F00', '#FFA000']} style={styles.titleGradient}>
            <Text style={styles.titleEmoji}>🌟</Text>
            <Text style={styles.titleText}>COMUNICAÇÃO ALTERNATIVA</Text>
            <Text style={styles.titleEmoji}>🌟</Text>
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

      {/* ================= CONTEÚDO PRINCIPAL ================= */}
      <View style={styles.mainContent}>
        
        <Text style={styles.questionText}>O que você quer fazer hoje?</Text>

        <View style={styles.cardsContainer}>
          {/* Card: Prancha de Comunicação */}
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => handleNavigate('/caa_board/prancha')}
          >
            <LinearGradient colors={['#E91E63', '#C2185B']} style={styles.cardGradient}>
              <View style={styles.iconContainer}>
                <Text style={styles.cardEmoji}>💬</Text>
              </View>
              <Text style={styles.cardTitle}>Falar</Text>
              <Text style={styles.cardDesc}>Prancha de Comunicação</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Card: Folha Mágica (Desenho) */}
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => handleNavigate('/caa_board/desenho')}
          >
            <LinearGradient colors={['#4CAF50', '#2E7D32']} style={styles.cardGradient}>
              <View style={styles.iconContainer}>
                <Text style={styles.cardEmoji}>🎨</Text>
              </View>
              <Text style={styles.cardTitle}>Desenhar</Text>
              <Text style={styles.cardDesc}>Folha Mágica de Artes</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

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
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
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
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.7)',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 8,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
  titleEmoji: {
    fontSize: 24,
  },
  librasBtn: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  librasBtnActive: {
    backgroundColor: 'rgba(255,255,255,0.4)',
  },

  // ─── CONTEÚDO PRINCIPAL ──────────────────────────────────
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  questionText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFF',
    marginBottom: 40,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  cardsContainer: {
    flexDirection: 'row',
    gap: 40,
  },
  card: {
    width: 250,
    height: 300,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 15,
  },
  cardGradient: {
    flex: 1,
    borderRadius: 30,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  iconContainer: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  cardEmoji: {
    fontSize: 70,
  },
  cardTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFF',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
  cardDesc: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginTop: 10,
    textAlign: 'center',
  },
});
