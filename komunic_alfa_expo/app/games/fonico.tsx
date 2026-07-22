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

const PHONEMIC_ALPHABET = [
  { letter: 'A' },   { letter: 'B' }, { letter: 'C' },
  { letter: 'D' },  { letter: 'E' }, { letter: 'F' },
  { letter: 'G' },  { letter: 'H' }, { letter: 'I' },
  { letter: 'J' },{ letter: 'K' }, { letter: 'L' },
  { letter: 'M' }, { letter: 'N' }, { letter: 'O' },
  { letter: 'P' },  { letter: 'Q' }, { letter: 'R' },
  { letter: 'S' },{ letter: 'T' }, { letter: 'U' },
  { letter: 'V' },  { letter: 'W' },{ letter: 'X' },
  { letter: 'Y' },{ letter: 'Z' },
];

const SYLLABLE_FAMILIES = [
  { title: 'BA / BE / BI / BO / BU', syllables: ['BA', 'BE', 'BI', 'BO', 'BU'] },
  { title: 'CA / CE / CI / CO / CU', syllables: ['CA', 'CE', 'CI', 'CO', 'CU'] },
  { title: 'DA / DE / DI / DO / DU', syllables: ['DA', 'DE', 'DI', 'DO', 'DU'] },
  { title: 'FA / FE / FI / FO / FU', syllables: ['FA', 'FE', 'FI', 'FO', 'FU'] },
  { title: 'GA / GE / GI / GO / GU', syllables: ['GA', 'GE', 'GI', 'GO', 'GU'] },
  { title: 'LA / LE / LI / LO / LU', syllables: ['LA', 'LE', 'LI', 'LO', 'LU'] },
  { title: 'MA / ME / MI / MO / MU', syllables: ['MA', 'ME', 'MI', 'MO', 'MU'] },
  { title: 'NA / NE / NI / NO / NU', syllables: ['NA', 'NE', 'NI', 'NO', 'NU'] },
  { title: 'PA / PE / PI / PO / PU', syllables: ['PA', 'PE', 'PI', 'PO', 'PU'] },
  { title: 'SA / SE / SI / SO / SU', syllables: ['SA', 'SE', 'SI', 'SO', 'SU'] },
  { title: 'TA / TE / TI / TO / TU', syllables: ['TA', 'TE', 'TI', 'TO', 'TU'] },
  { title: 'VA / VE / VI / VO / VU', syllables: ['VA', 'VE', 'VI', 'VO', 'VU'] },
];

const LetterButton = ({ letter, onPress, index, isActive }) => {
  const allGradients = [
    ['#4D96FF', '#2D6ECC'], ['#B983FF', '#8649CB'], ['#FF6B6B', '#EE5A24'],
    ['#FFC312', '#F79F1F'], ['#12CBC4', '#009432'], ['#6BCB77', '#4D9A5C'],
    ['#FF82A9', '#D94F78'], ['#FFB347', '#E07A00'], ['#FDA7DF', '#D980FA'],
  ];
  const colorGradient = allGradients[index % allGradients.length];

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={[styles.letterBtnContainer, isActive && styles.letterBtnActive]}>
      <LinearGradient colors={colorGradient} style={styles.letterBtn}>
        <View style={styles.glossyHighlight} />
        <Text style={styles.letterBtnText}>{letter}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const SoundButton = ({ text, onPress, index, isActive }) => {
  const allGradients = [
    ['#FF6B6B', '#EE5A24'], ['#FFC312', '#F79F1F'], ['#12CBC4', '#009432'],
    ['#C44569', '#833471'], ['#FDA7DF', '#D980FA'], ['#4D96FF', '#2D6ECC'],
    ['#B983FF', '#8649CB'], ['#6BCB77', '#4D9A5C'], ['#FF82A9', '#D94F78'],
    ['#FFB347', '#E07A00'],
  ];
  const colorGradient = allGradients[index % allGradients.length];
  
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={[styles.syllableBtnContainer, isActive && styles.syllableBtnActive]}>
      <LinearGradient colors={colorGradient} style={styles.syllableBtn}>
        <Text style={styles.syllableBtnText}>{text}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default function FonicoGame() {
  const router = useRouter();
  const { isLibrasActive } = useAccessibility();
  const { playPhoneme } = useAudio();
  const [activeLetter, setActiveLetter] = React.useState<string | null>(null);
  const [activeSyllable, setActiveSyllable] = React.useState<string | null>(null);

  const handlePress = (letter) => {
    setActiveLetter(letter);
    setActiveSyllable(null);
    playPhoneme(letter);
    setTimeout(() => {
      setActiveLetter(null);
    }, 1500);
  };

  const handleSyllablePress = (syllable) => {
    setActiveSyllable(syllable);
    setActiveLetter(null);
    playPhoneme(syllable);
    setTimeout(() => {
      setActiveSyllable(null);
    }, 1500);
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
        <Text style={styles.instructionText}>🎵 Toque em uma letra ou família silábica para ouvir o som!</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollArea} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {PHONEMIC_ALPHABET.map((item, index) => (
             <LetterButton 
               key={item.letter} 
               letter={item.letter} 
               index={index}
               isActive={activeLetter === item.letter}
               onPress={() => handlePress(item.letter)}
             />
          ))}
        </View>

        <View style={styles.familySection}>
          <Text style={styles.familyHeading}>Famílias silábicas</Text>
          {SYLLABLE_FAMILIES.map((family, familyIndex) => (
            <View key={family.title} style={styles.familyCard}>
              <Text style={styles.familyTitle}>{family.title}</Text>
              <View style={styles.familyRow}>
                {family.syllables.map((syllable, index) => (
                  <SoundButton
                    key={syllable}
                    text={syllable}
                    index={index + familyIndex * 5}
                    isActive={activeSyllable === syllable}
                    onPress={() => handleSyllablePress(syllable)}
                  />
                ))}
              </View>
            </View>
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
  letterBtnActive: { borderWidth: 4, borderColor: '#FFF' },
  letterBtn: { width: btnSize, height: btnSize, borderRadius: 12, borderWidth: 2, borderColor: 'rgba(255,255,255,0.8)', alignItems: 'center', justifyContent: 'center' },
  glossyHighlight: { position: 'absolute', top: 2, left: '10%', right: '10%', height: '30%', backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 10 },
  letterBtnText: { color: '#FFF', fontSize: btnSize * 0.35, fontWeight: 'bold', textTransform: 'uppercase', textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 2 },
  phonemeText: { color: 'rgba(255,255,255,0.9)', fontSize: btnSize * 0.16, marginTop: 4, textAlign: 'center', fontWeight: '700' },
  familySection: { marginTop: 24 },
  familyHeading: { fontSize: 18, fontWeight: '900', color: '#FFF', textAlign: 'center', marginBottom: 12 },
  familyCard: { marginBottom: 18, padding: 14, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  familyTitle: { color: '#FFF', fontSize: 14, fontWeight: '700', marginBottom: 10, textAlign: 'center' },
  familyRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  syllableBtnContainer: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 5, elevation: 6 },
  syllableBtn: { minWidth: (width - 90) / 5, paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  syllableBtnText: { color: '#FFF', fontSize: 14, fontWeight: '900', textTransform: 'uppercase' },
  syllableBtnActive: { borderWidth: 4, borderColor: '#FFF' }
});

