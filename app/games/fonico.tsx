// @ts-nocheck
import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, StatusBar, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAudio } from '../../hooks/useAudio';
import LibrasSign from '../../components/LibrasSign';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { gameStyles, OPTION_GRADIENTS } from '../../constants/GameStyles';
import { Colors } from '../../constants/Colors';
import { GameInfoButton } from '../../components/GameIntro';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const LetterButton = ({ letter, onPress, index, isActive }) => {
  const allGradients = [
    ['#FF6B6B', '#EE5A24'], ['#FFC312', '#F79F1F'], ['#12CBC4', '#009432'],
    ['#C44569', '#833471'], ['#FDA7DF', '#D980FA'], ['#4D96FF', '#2D6ECC'],
    ['#B983FF', '#8649CB'], ['#6BCB77', '#4D9A5C'], ['#FF82A9', '#D94F78'],
    ['#FFB347', '#E07A00'],
  ];
  const colorGradient = allGradients[index % allGradients.length];
  
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.letterBtnContainer}>
      <LinearGradient colors={colorGradient} style={styles.letterBtn}>
        <View style={styles.glossyHighlight} />
        <Text style={styles.letterBtnText}>{letter}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default function FonicoGame() {
  const router = useRouter();
  const { isLibrasActive } = useAccessibility();
  const { playPhoneme } = useAudio();
  const [activeLetter, setActiveLetter] = React.useState(null);

  const handlePress = (letter) => {
    setActiveLetter(letter);
    playPhoneme(letter, '');
    setTimeout(() => setActiveLetter(null), 1500);
  };

  return (
    <ImageBackground source={require('../../assets/images/bg_escola.jpg')} style={gameStyles.background} resizeMode="cover" blurRadius={4}>
      <StatusBar hidden />

      {/* HUD */}
      <SafeAreaView edges={["top"]}>
        <LinearGradient colors={['#B983FF', '#8649CB', '#FF82A9']} style={gameStyles.hud}>
        <TouchableOpacity onPress={() => router.push('/')} style={gameStyles.hudBackBtn}>
          <Ionicons name="arrow-back" size={26} color="#FFF" />
        </TouchableOpacity>
        <View style={gameStyles.hudCenter}>
          <Text style={gameStyles.hudTitle}>🎤 LABORATÓRIO DOS SONS</Text>
          <View style={gameStyles.hudBadge}>
            <Text style={gameStyles.hudBadgeText}>Toque para ouvir!</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <GameInfoButton gameKey="fonico" style={{ marginRight: 8 }} />
        </View>
        </LinearGradient>
      </SafeAreaView>

      {isLibrasActive && activeLetter && <LibrasSign text={activeLetter} />}

      <View style={styles.instructionContainer}>
        <Text style={styles.instructionText}>🎵 Toque em uma letra para ouvir seu som!</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollArea} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {ALPHABET.map((letter, index) => (
             <LetterButton 
               key={letter} 
               letter={letter} 
               index={index}
               onPress={() => handlePress(letter)}
             />
          ))}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const { width } = Dimensions.get('window');
// Calculate button size dynamically based on screen width (6 columns for even smaller buttons)
const btnSize = (width - 90) / 6; 

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%' },
  hud: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 30, alignItems: 'center' },
  backBtn: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 5, elevation: 8 },
  titleContainer: { backgroundColor: 'rgba(25, 118, 210, 0.9)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, borderWidth: 2, borderColor: '#64B5F6' },
  titleText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  
  instructionContainer: { alignSelf: 'center', backgroundColor: 'rgba(255, 255, 255, 0.95)', paddingVertical: 4, paddingHorizontal: 15, borderRadius: 15, borderWidth: 2, borderColor: Colors.purpleButtonGradient[1], marginBottom: 15, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3, elevation: 3 },
  instructionText: { fontSize: 12, fontWeight: '900', color: Colors.textDark, textAlign: 'center' },
  
  scrollArea: { paddingHorizontal: 5, paddingBottom: 40 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  
  letterBtnContainer: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 5, elevation: 6 },
  letterBtn: { width: btnSize, height: btnSize, borderRadius: 12, borderWidth: 2, borderColor: 'rgba(255,255,255,0.8)', alignItems: 'center', justifyContent: 'center' },
  glossyHighlight: { position: 'absolute', top: 2, left: '10%', right: '10%', height: '30%', backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 10 },
  letterBtnText: { color: '#FFF', fontSize: btnSize * 0.35, fontWeight: 'bold', textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 2 }
});

