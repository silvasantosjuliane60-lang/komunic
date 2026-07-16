// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  StatusBar,
  ScrollView,
  Platform,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { useAudio } from '../../hooks/useAudio';

const CATEGORIES = [
  { id: 'emocoes', name: 'Emoções', emoji: '😀', color: '#FF9800' },
  { id: 'alimentos', name: 'Alimentos', emoji: '🍎', color: '#4CAF50' },
  { id: 'higiene', name: 'Higiene', emoji: '🧼', color: '#00BCD4' },
  { id: 'saude', name: 'Dores e Saúde', emoji: '🤕', color: '#F44336' },
  { id: 'acoes', name: 'Ações', emoji: '🏃', color: '#9C27B0' },
  { id: 'pessoas', name: 'Pessoas', emoji: '👨‍👩‍👧', color: '#E91E63' },
  { id: 'lugares', name: 'Lugares', emoji: '📍', color: '#3F51B5' },
  { id: 'objetos', name: 'Objetos', emoji: '🎒', color: '#795548' },
];

const PICTOGRAMS = {
  emocoes: [
    { id: 'feliz', name: 'Feliz', emoji: '😊' },
    { id: 'triste', name: 'Triste', emoji: '😢' },
    { id: 'raiva', name: 'Com Raiva', emoji: '😠' },
    { id: 'medo', name: 'Com Medo', emoji: '😨' },
    { id: 'cansado', name: 'Cansado', emoji: '😴' },
    { id: 'surpreso', name: 'Surpreso', emoji: '😲' },
    { id: 'animado', name: 'Animado', emoji: '🤩' },
    { id: 'calmo', name: 'Calmo', emoji: '😌' },
    { id: 'envergonhado', name: 'Envergonhado', emoji: '😳' },
    { id: 'apaixonado', name: 'Apaixonado', emoji: '🥰' },
  ],
  alimentos: [
    { id: 'agua', name: 'Água', emoji: '💧' },
    { id: 'leite', name: 'Leite', emoji: '🥛' },
    { id: 'suco', name: 'Suco', emoji: '🧃' },
    { id: 'pao', name: 'Pão', emoji: '🍞' },
    { id: 'arroz', name: 'Arroz', emoji: '🍚' },
    { id: 'feijao', name: 'Feijão', emoji: '🫘' },
    { id: 'fruta', name: 'Fruta', emoji: '🍎' },
    { id: 'carne', name: 'Carne', emoji: '🥩' },
    { id: 'macarrao', name: 'Macarrão', emoji: '🍝' },
    { id: 'biscoito', name: 'Biscoito', emoji: '🍪' },
    { id: 'iogurte', name: 'Iogurte', emoji: '🥣' },
    { id: 'ovo', name: 'Ovo', emoji: '🥚' },
    { id: 'bolo', name: 'Bolo', emoji: '🎂' },
    { id: 'sorvete', name: 'Sorvete', emoji: '🍦' },
  ],
  higiene: [
    { id: 'escovar_dentes', name: 'Escovar Dentes', emoji: '🪥' },
    { id: 'tomar_banho', name: 'Tomar Banho', emoji: '🚿' },
    { id: 'lavar_maos', name: 'Lavar Mãos', emoji: '🧼' },
    { id: 'ir_banheiro', name: 'Ir ao Banheiro', emoji: '🚽' },
    { id: 'pentear_cabelo', name: 'Pentear Cabelo', emoji: '💇' },
    { id: 'trocar_roupa', name: 'Trocar Roupa', emoji: '👕' },
    { id: 'cortar_unha', name: 'Cortar Unha', emoji: '💅' },
    { id: 'passar_desodorante', name: 'Passar Desodorante', emoji: '🧴' },
  ],
  saude: [
    { id: 'dor_cabeca', name: 'Dor de Cabeça', emoji: '🤕' },
    { id: 'dor_barriga', name: 'Dor de Barriga', emoji: '😣' },
    { id: 'dor_dente', name: 'Dor de Dente', emoji: '🦷' },
    { id: 'febre', name: 'Febre', emoji: '🤒' },
    { id: 'enjoo', name: 'Enjoo', emoji: '🤢' },
    { id: 'machucado', name: 'Machucado', emoji: '🩹' },
    { id: 'tontura', name: 'Tontura', emoji: '😵' },
    { id: 'alergia', name: 'Alergia', emoji: '🤧' },
  ],
  acoes: [
    { id: 'quero', name: 'Quero', emoji: '👍' },
    { id: 'nao_quero', name: 'Não Quero', emoji: '👎' },
    { id: 'sim', name: 'Sim', emoji: '✅' },
    { id: 'nao', name: 'Não', emoji: '❌' },
    { id: 'ajuda', name: 'Ajuda', emoji: '🆘' },
    { id: 'brincar', name: 'Brincar', emoji: '🎮' },
    { id: 'comer', name: 'Comer', emoji: '🍽️' },
    { id: 'beber', name: 'Beber', emoji: '🥤' },
    { id: 'dormir', name: 'Dormir', emoji: '😴' },
    { id: 'ir', name: 'Ir', emoji: '🚶' },
    { id: 'parar', name: 'Parar', emoji: '🛑' },
    { id: 'esperar', name: 'Esperar', emoji: '⏳' },
  ],
  pessoas: [
    { id: 'mamae', name: 'Mamãe', emoji: '👩' },
    { id: 'papai', name: 'Papai', emoji: '👨' },
    { id: 'professor', name: 'Professor(a)', emoji: '👩‍🏫' },
    { id: 'amigo', name: 'Amigo(a)', emoji: '🧒' },
    { id: 'irmao', name: 'Irmão/Irmã', emoji: '👦' },
    { id: 'vovo_m', name: 'Vovó', emoji: '👵' },
    { id: 'vovo_h', name: 'Vovô', emoji: '👴' },
    { id: 'medico', name: 'Médico(a)', emoji: '👨‍⚕️' },
  ],
  lugares: [
    { id: 'casa', name: 'Casa', emoji: '🏠' },
    { id: 'escola', name: 'Escola', emoji: '🏫' },
    { id: 'parque', name: 'Parque', emoji: '🌳' },
    { id: 'banheiro', name: 'Banheiro', emoji: '🚻' },
    { id: 'cozinha', name: 'Cozinha', emoji: '🍳' },
    { id: 'quarto', name: 'Quarto', emoji: '🛏️' },
    { id: 'hospital', name: 'Hospital', emoji: '🏥' },
    { id: 'loja', name: 'Loja', emoji: '🛒' },
  ],
  objetos: [
    { id: 'brinquedo', name: 'Brinquedo', emoji: '🧸' },
    { id: 'livro', name: 'Livro', emoji: '📖' },
    { id: 'celular', name: 'Celular', emoji: '📱' },
    { id: 'tv', name: 'TV', emoji: '📺' },
    { id: 'bola', name: 'Bola', emoji: '⚽' },
    { id: 'caderno', name: 'Caderno', emoji: '📓' },
    { id: 'mochila', name: 'Mochila', emoji: '🎒' },
    { id: 'copo', name: 'Copo', emoji: '🥤' },
    { id: 'prato', name: 'Prato', emoji: '🍽️' },
    { id: 'remedio', name: 'Remédio', emoji: '💊' },
  ],
};

export default function CAAPrancha() {
  const router = useRouter();
  const { isLibrasActive, toggleLibras } = useAccessibility();
  const { speakText } = useAudio();
  
  const [activeCategory, setActiveCategory] = useState(null);
  const [sentence, setSentence] = useState([]);
  const scrollViewRef = useRef(null);
  const dictationInputRef = useRef(null);
  const [isDictating, setIsDictating] = useState(false);

  // Auto-scroll sentence to the end when items are added
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [sentence]);

  const handlePictoTap = (picto) => {
    speakText(picto.name);
    setSentence([...sentence, picto]);
  };

  const handleRemoveFromSentence = (index) => {
    const newSentence = [...sentence];
    newSentence.splice(index, 1);
    setSentence(newSentence);
  };

  const processVoiceCommand = (text) => {
    const lowerText = text.toLowerCase().trim();
    
    // Remove acentos para facilitar
    const normalize = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const normalizedText = normalize(lowerText);

    // Verifica se é um comando para abrir categoria
    if (normalizedText.includes('abrir') || normalizedText.includes('abra') || normalizedText.includes('abre')) {
      const matchedCategory = CATEGORIES.find(c => {
        const catName = normalize(c.name.toLowerCase());
        if (catName === 'dores e saude' && (normalizedText.includes('dores') || normalizedText.includes('saude'))) return true;
        return normalizedText.includes(catName);
      });

      if (matchedCategory) {
        setActiveCategory(matchedCategory);
        speakText(matchedCategory.name); // Feedback de áudio
        return;
      }
    }

    // Se não for comando, apenas adiciona na barra de frases
    setSentence(prev => [...prev, { id: 'voice_' + Date.now(), name: text, emoji: '🗣️' }]);
  };

  const startDictation = () => {
    setIsDictating(true);
    if (Platform.OS === 'web') {
      if ('webkitSpeechRecognition' in window) {
        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = 'pt-BR';
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.onresult = (event) => {
          const text = event.results[0][0].transcript;
          if (text) {
             processVoiceCommand(text);
          }
          setIsDictating(false);
        };
        recognition.onerror = () => setIsDictating(false);
        recognition.onend = () => setIsDictating(false);
        recognition.start();
      } else {
        alert("Reconhecimento de voz não suportado neste navegador. Use o Google Chrome.");
        setIsDictating(false);
      }
    } else {
      // Focus hidden input to open keyboard (user can tap mic on keyboard)
      if (dictationInputRef.current) {
        dictationInputRef.current.focus();
      }
    }
  };

  const handleDictationSubmit = (e) => {
    const text = e.nativeEvent.text.trim();
    if (text) {
      processVoiceCommand(text);
    }
    setIsDictating(false);
    if (dictationInputRef.current) {
      dictationInputRef.current.clear();
      dictationInputRef.current.blur();
    }
  };

  const speakSentence = () => {
    if (sentence.length === 0) return;
    const fullText = sentence.map(p => p.name).join(', ');
    speakText(fullText);
  };

  const clearSentence = () => {
    setSentence([]);
  };

  return (
    <ImageBackground
      source={require('../../assets/images/bg_escola.jpg')}
      style={styles.background}
      resizeMode="cover"
      blurRadius={5}
    >
      <StatusBar hidden={true} />
      <TextInput
        ref={dictationInputRef}
        style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }}
        onSubmitEditing={handleDictationSubmit}
        returnKeyType="done"
      />

      {/* ================= BARRA SUPERIOR ================= */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back-circle" size={40} color="white" />
        </TouchableOpacity>

        <View style={styles.titleBadge}>
          <LinearGradient colors={['#FF6F00', '#FF8F00', '#FFA000']} style={styles.titleGradient}>
            <Text style={styles.titleEmoji}>💬</Text>
            <Text style={styles.titleText}>PRANCHA DE COMUNICAÇÃO</Text>
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

      {/* ================= BARRA DE SENTENÇA ================= */}
      <View style={styles.sentenceBarContainer}>
        <View style={styles.sentenceBar}>
          {sentence.length === 0 ? (
            <Text style={styles.emptySentenceText}>Toque nas figuras para formar frases...</Text>
          ) : (
            <ScrollView 
              ref={scrollViewRef}
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sentenceScroll}
            >
              {sentence.map((picto, index) => (
                <TouchableOpacity 
                  key={`${picto.id}-${index}`}
                  onPress={() => handleRemoveFromSentence(index)}
                  style={styles.sentenceItem}
                >
                  <Text style={styles.sentenceEmoji}>{picto.emoji}</Text>
                  <Text style={styles.sentenceLabel}>{picto.name}</Text>
                  <View style={styles.removeBadge}>
                    <Ionicons name="close" size={14} color="#FFF" />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
        
        {/* Controles da Sentença */}
        <View style={styles.sentenceControls}>
          <TouchableOpacity 
            style={styles.controlBtn} 
            onPress={startDictation}
          >
            <LinearGradient colors={isDictating ? ['#E91E63', '#C2185B'] : ['#2196F3', '#1976D2']} style={styles.controlGradient}>
              <Ionicons name="mic" size={24} color="#FFF" />
              <Text style={styles.controlBtnText}>{isDictating ? 'OUVINDO' : 'DITAR'}</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.controlBtn, sentence.length === 0 && styles.controlBtnDisabled]} 
            onPress={speakSentence}
            disabled={sentence.length === 0}
          >
            <LinearGradient colors={['#4CAF50', '#2E7D32']} style={styles.controlGradient}>
              <Ionicons name="volume-high" size={24} color="#FFF" />
              <Text style={styles.controlBtnText}>FALAR</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.controlBtn, sentence.length === 0 && styles.controlBtnDisabled]} 
            onPress={clearSentence}
            disabled={sentence.length === 0}
          >
            <LinearGradient colors={['#F44336', '#C62828']} style={styles.controlGradient}>
              <Ionicons name="trash" size={24} color="#FFF" />
              <Text style={styles.controlBtnText}>LIMPAR</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* ================= CONTEÚDO PRINCIPAL (CATEGORIAS / PICTOGRAMAS) ================= */}
      <View style={styles.mainContent}>
        {activeCategory ? (
          <View style={styles.pictogramView}>
            {/* Cabeçalho da Categoria */}
            <View style={[styles.categoryHeader, { backgroundColor: activeCategory.color }]}>
              <TouchableOpacity onPress={() => setActiveCategory(null)} style={styles.backToCategoriesBtn}>
                <Ionicons name="arrow-back" size={24} color="#FFF" />
                <Text style={styles.backToCategoriesText}>Voltar</Text>
              </TouchableOpacity>
              <Text style={styles.categoryTitleText}>
                {activeCategory.emoji} {activeCategory.name}
              </Text>
            </View>
            
            {/* Grid de Pictogramas */}
            <ScrollView contentContainerStyle={styles.pictogramGrid}>
              {PICTOGRAMS[activeCategory.id].map((picto) => (
                <TouchableOpacity 
                  key={picto.id}
                  style={[styles.pictoCard, { borderColor: activeCategory.color }]}
                  onPress={() => handlePictoTap(picto)}
                >
                  <Text style={styles.pictoEmoji}>{picto.emoji}</Text>
                  <Text style={styles.pictoName}>{picto.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.categoryGrid}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryCard, { backgroundColor: cat.color }]}
                onPress={() => setActiveCategory(cat)}
              >
                <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                <Text style={styles.categoryName}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

    </ImageBackground>
  );
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isTablet = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) > 500;

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

  // ─── BARRA DE SENTENÇA ──────────────────────────────────
  sentenceBarContainer: {
    flexDirection: 'row',
    padding: 10,
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderBottomWidth: 3,
    borderBottomColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    alignItems: 'center',
    height: 100,
  },
  sentenceBar: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    height: '100%',
    justifyContent: 'center',
  },
  emptySentenceText: {
    textAlign: 'center',
    color: '#9E9E9E',
    fontSize: 16,
    fontWeight: '600',
  },
  sentenceScroll: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
    gap: 8,
  },
  sentenceItem: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#4FC3F7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    minWidth: 70,
  },
  sentenceEmoji: {
    fontSize: 32,
  },
  sentenceLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
  },
  removeBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#F44336',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFF',
  },
  sentenceControls: {
    flexDirection: 'row',
    gap: 8,
    height: '100%',
  },
  controlBtn: {
    height: '100%',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  controlBtnDisabled: {
    opacity: 0.5,
  },
  controlGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    gap: 4,
  },
  controlBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // ─── CONTEÚDO PRINCIPAL ──────────────────────────────────
  mainContent: {
    flex: 1,
    padding: 10,
  },

  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: isTablet ? 15 : 10,
    paddingBottom: 20,
  },
  categoryCard: {
    width: isTablet ? 200 : '45%',
    height: isTablet ? 120 : 95,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  categoryEmoji: {
    fontSize: isTablet ? 55 : 35,
  },
  categoryName: {
    fontSize: isTablet ? 18 : 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 5,
  },

  // Pictogramas
  pictogramView: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backToCategoriesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  backToCategoriesText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  categoryTitleText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    marginRight: 40, // offset the back button to center text
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  pictogramGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: isTablet ? 12 : 8,
    padding: 15,
  },
  pictoCard: {
    width: isTablet ? 110 : 85,
    height: isTablet ? 120 : 95,
    backgroundColor: '#FFF',
    borderRadius: 15,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    padding: 5,
  },
  pictoEmoji: {
    fontSize: isTablet ? 55 : 35,
  },
  pictoName: {
    fontSize: isTablet ? 15 : 11,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 5,
  },
});
