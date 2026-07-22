// @ts-nocheck
import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ScrollView, Dimensions, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { useRouter } from 'expo-router';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useAudio } from '../hooks/useAudio';

const { width, height } = Dimensions.get('window');

// Componente: Botão 3D Glossy genérico
const GlossyButton = ({ colors, iconName, label, onPress, size = 'normal' }) => {
  const isLarge = size === 'large';
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.buttonContainer}>
      <LinearGradient colors={colors} style={[styles.glossyButton, isLarge && styles.glossyButtonLarge, !label && styles.glossyIconButton]}>
        <View style={styles.glossyHighlight} />
        {iconName && <FontAwesome5 name={iconName} size={isLarge ? 32 : (!label ? 24 : 20)} color={Colors.textLight} style={[styles.btnIcon, !label && { marginRight: 0 }]} />}
        {label && <Text style={[styles.btnText, isLarge && styles.btnTextLarge]}>{label}</Text>}
      </LinearGradient>
    </TouchableOpacity>
  );
};



export default function HomeLandscape() {
  const router = useRouter();
  const { isLibrasActive, toggleLibras } = useAccessibility();
  const { playSuccess } = useAudio();

  return (
    <ImageBackground 
      source={require('../assets/images/bg_escola.jpg')} 
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar hidden={true} />
      
      {/* ================= TOPO (HUD) ================= */}
      <SafeAreaView edges={["top"]} style={styles.header}>
        {/* Esquerda: Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
             <Ionicons name="hardware-chip" size={30} color={Colors.blueButtonGradient[1]} />
          </View>
          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>Olá! Eu sou o Komu! Vamos aprender brincando?</Text>
          </View>
        </View>

        {/* Centro: Título Principal */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>VAMOS APRENDER</Text>
          <Text style={styles.subtitleText}>BRINCANDO!</Text>
        </View>

        {/* Direita: Status e Perfil */}
        <View style={styles.statusContainer}>
          <TouchableOpacity onPress={toggleLibras} style={[styles.librasBtn, isLibrasActive && styles.librasBtnActive]}>
             <FontAwesome5 name="sign-language" size={30} color={isLibrasActive ? "#FFF" : "#666"} />
          </TouchableOpacity>
          <View style={styles.scoreBoard}>
            <View style={styles.scoreItem}>
              <Ionicons name="star" size={20} color={Colors.starYellow} />
              <Text style={styles.scoreText}>1250</Text>
            </View>
            <View style={styles.scoreItem}>
              <FontAwesome5 name="coins" size={18} color={Colors.coinGold} />
              <Text style={styles.scoreText}> 350</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/auth/select')}>
            <Ionicons name="person-circle" size={40} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* ================= CORPO PRINCIPAL ================= */}
      <View style={styles.mainBody}>
        
        {/* Menu Esquerdo */}
        <View style={styles.leftMenu}>
          <GlossyButton colors={Colors.blueButtonGradient} iconName="volume-up" />
          <GlossyButton colors={Colors.playButtonGradient} iconName="sign-language" />
          <GlossyButton colors={Colors.purpleButtonGradient} iconName="comments" onPress={() => router.push('/caa_board')} />
        </View>

        {/* Botão Central Gigante */}
         <View style={styles.centerContainer}>
           <GlossyButton 
             colors={Colors.playButtonGradient} 
             iconName="play" 
             label="COMEÇAR A AVENTURA!"
             onPress={() => router.push('/map')}
           />
        </View>

        {/* Menu Direito */}
        <View style={styles.rightMenu}>
          <View style={styles.woodenSign}>
            <Text style={styles.woodenText}>JUNTOS APRENDEMOS,{"\n"}CRESCEMOS E{"\n"}NOS COMUNICAMOS!</Text>
            <Ionicons name="heart" size={24} color={Colors.purpleButtonGradient[1]} style={{marginTop: 5}}/>
          </View>
          <GlossyButton colors={['#FF6B6B', '#EE5A24']} iconName="gift" label="BÔNUS" onPress={() => router.push('/bonus')} />
          <GlossyButton colors={Colors.orangeButtonGradient} iconName="shopping-cart" label="LOJA KOMUNIC" />
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
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    alignItems: 'flex-start',
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 60, height: 60,
    backgroundColor: 'white',
    borderRadius: 30,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 3, borderColor: '#03A9F4',
    zIndex: 2,
  },
  speechBubble: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 10,
    borderRadius: 15,
    marginLeft: -15,
    paddingLeft: 25,
    maxWidth: 180,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 5, elevation: 8,
  },
  speechText: {
    fontSize: 12, fontWeight: 'bold', color: Colors.textDark,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  titleText: {
    fontSize: 24, fontWeight: '900', color: '#FFF',
    textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: {width: 2, height: 2}, textShadowRadius: 3,
    letterSpacing: 2,
  },
  subtitleText: {
    fontSize: 32, fontWeight: '900', color: '#FFEB3B',
    textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: {width: 2, height: 2}, textShadowRadius: 3,
    letterSpacing: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  scoreBoard: {
    backgroundColor: 'rgba(25, 118, 210, 0.9)',
    padding: 8, borderRadius: 15,
    borderWidth: 2, borderColor: '#64B5F6',
  },
  scoreItem: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
  },
  scoreText: {
    color: '#FFF', fontWeight: 'bold', fontSize: 16,
  },
  iconBtn: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 25, padding: 2,
  },
  
  // Corpo Principal
  mainBody: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  leftMenu: {
    gap: 12,
  },
  rightMenu: {
    gap: 12,
    alignItems: 'flex-end',
  },
  centerContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
    paddingBottom: 20,
  },
  buttonContainer: {
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  glossyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    overflow: 'hidden',
  },
  glossyButtonLarge: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  glossyIconButton: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glossyHighlight: {
    position: 'absolute',
    top: 2,
    left: '5%',
    right: '5%',
    height: '40%',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 15,
  },
  btnIcon: {
    marginRight: 10,
  },
  btnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  btnTextLarge: {
    fontSize: 22, textTransform: 'uppercase', letterSpacing: 1,
  },

  // Placa de Madeira
  woodenSign: {
    backgroundColor: '#D7CCC8',
    padding: 15, borderRadius: 10,
    borderWidth: 3, borderColor: '#8D6E63',
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 5, elevation: 8,
  },
  woodenText: {
    color: '#4E342E', fontWeight: 'bold', fontSize: 11, textAlign: 'center',
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
