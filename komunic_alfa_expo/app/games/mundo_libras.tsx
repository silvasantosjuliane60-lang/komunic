import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Pressable } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';

// --- DATABASE ---
const CATEGORIES = [
  { id: 'animais', title: 'ANIMAIS', icon: 'paw', color: ['#FF9800', '#E65100'] },
  { id: 'cores', title: 'CORES', icon: 'color-palette', color: ['#9C27B0', '#6A1B9A'] },
  { id: 'frutas', title: 'FRUTAS', icon: 'nutrition', color: ['#E91E63', '#C2185B'] },
  { id: 'objetos', title: 'OBJETOS', icon: 'cube', color: ['#03A9F4', '#0277BD'] },
  { id: 'dia_a_dia', title: 'DIA A DIA', icon: 'chatbubbles', color: ['#4CAF50', '#2E7D32'] },
  { id: 'alfabeto', title: 'ALFABETO', icon: 'text', color: ['#FFC107', '#FF8F00'] },
];

const ITEMS = {
  animais: [
    { id: 'cachorro', word: 'CACHORRO', emoji: '🐶' },
    { id: 'gato', word: 'GATO', emoji: '🐱' },
    { id: 'passaro', word: 'PÁSSARO', emoji: '🐦' },
    { id: 'peixe', word: 'PEIXE', emoji: '🐟' },
    { id: 'macaco', word: 'MACACO', emoji: '🐵' },
    { id: 'vaca', word: 'VACA', emoji: '🐮' },
  ],
  cores: [
    { id: 'azul', word: 'AZUL', emoji: '🟦' },
    { id: 'vermelho', word: 'VERMELHO', emoji: '🟥' },
    { id: 'amarelo', word: 'AMARELO', emoji: '🟨' },
    { id: 'verde', word: 'VERDE', emoji: '🟩' },
    { id: 'preto', word: 'PRETO', emoji: '⬛' },
    { id: 'branco', word: 'BRANCO', emoji: '⬜' },
  ],
  frutas: [
    { id: 'maca', word: 'MAÇÃ', emoji: '🍎' },
    { id: 'banana', word: 'BANANA', emoji: '🍌' },
    { id: 'laranja', word: 'LARANJA', emoji: '🍊' },
    { id: 'uva', word: 'UVA', emoji: '🍇' },
    { id: 'melancia', word: 'MELANCIA', emoji: '🍉' },
    { id: 'morango', word: 'MORANGO', emoji: '🍓' },
  ],
  objetos: [
    { id: 'bola', word: 'BOLA', emoji: '⚽' },
    { id: 'lapis', word: 'LÁPIS', emoji: '✏️' },
    { id: 'cadeira', word: 'CADEIRA', emoji: '🪑' },
    { id: 'carro', word: 'CARRO', emoji: '🚗' },
    { id: 'livro', word: 'LIVRO', emoji: '📖' },
    { id: 'mesa', word: 'MESA', emoji: '🪚' },
  ],
  dia_a_dia: [
    { id: 'beber_agua', word: 'BEBER ÁGUA', emoji: '💧' },
    { id: 'banheiro', word: 'BANHEIRO', emoji: '🚽' },
    { id: 'bom_dia', word: 'BOM DIA', emoji: '🌅' },
    { id: 'boa_noite', word: 'BOA NOITE', emoji: '🌃' },
    { id: 'tudo_bem', word: 'TUDO BEM?', emoji: '👍' },
    { id: 'obrigado', word: 'OBRIGADO', emoji: '🙏' },
  ],
  alfabeto: [
    { id: 'a', word: 'A', emoji: '🅰️' },
    { id: 'b', word: 'B', emoji: '🅱️' },
    { id: 'c', word: 'C', emoji: '©️' },
    { id: 'd', word: 'D', emoji: 'D' },
    { id: 'e', word: 'E', emoji: 'E' },
    { id: 'f', word: 'F', emoji: 'F' },
  ]
};

export default function MundoLibras() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [selectedItem, setSelectedItem] = useState(null);

  const handlePressItem = (item) => {
    setSelectedItem(item);
    Speech.speak(item.word, { language: 'pt-BR', rate: 0.8 });
  };

  const closeModal = () => {
    setSelectedItem(null);
    Speech.stop();
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Mundo de Libras',
          headerStyle: { backgroundColor: '#1E88E5' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />

      {/* TABS DE CATEGORIAS */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory.id === cat.id;
            return (
              <TouchableOpacity 
                key={cat.id} 
                style={[styles.tab, isActive && { backgroundColor: cat.color[0], borderColor: cat.color[1] }]}
                onPress={() => setActiveCategory(cat)}
              >
                <Ionicons name={cat.icon as any} size={24} color={isActive ? '#fff' : '#666'} />
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{cat.title}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* LISTA DE ITENS */}
      <ScrollView contentContainerStyle={styles.gridContainer}>
        <Text style={[styles.categoryTitle, { color: activeCategory.color[0] }]}>
          {activeCategory.title}
        </Text>
        
        <View style={styles.grid}>
          {ITEMS[activeCategory.id].map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.card}
              onPress={() => handlePressItem(item)}
            >
              <LinearGradient
                colors={activeCategory.color}
                style={styles.cardGradient}
              >
                <Text style={styles.cardEmoji}>{item.emoji}</Text>
                <Text style={styles.cardTitle}>{item.word}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* MODAL DE APRENDIZADO LIBRAS */}
      <Modal
        visible={!!selectedItem}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Ionicons name="close-circle" size={40} color="#FF3B30" />
            </TouchableOpacity>

            {selectedItem && (
              <>
                <Text style={styles.modalEmoji}>{selectedItem.emoji}</Text>
                <Text style={styles.modalTitle}>{selectedItem.word}</Text>
                
                <View style={styles.videoPlaceholder}>
                  <Ionicons name="videocam" size={60} color="#999" />
                  <Text style={styles.videoPlaceholderText}>ESPAÇO RESERVADO PARA VÍDEO LIBRAS</Text>
                  <Text style={styles.videoPlaceholderSub}>({selectedItem.id}.mp4)</Text>
                </View>

                <TouchableOpacity 
                  style={styles.soundButton}
                  onPress={() => Speech.speak(selectedItem.word, { language: 'pt-BR', rate: 0.8 })}
                >
                  <Ionicons name="volume-high" size={30} color="#fff" />
                  <Text style={styles.soundButtonText}>Ouvir Novamente</Text>
                </TouchableOpacity>
              </>
            )}

          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  tabContainer: {
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 10,
  },
  tabScroll: {
    paddingHorizontal: 10,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  tabText: {
    marginLeft: 8,
    fontWeight: 'bold',
    color: '#666',
  },
  tabTextActive: {
    color: '#FFF',
  },
  gridContainer: {
    padding: 20,
    paddingBottom: 50,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 20,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    aspectRatio: 1,
    marginBottom: 15,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    overflow: 'hidden',
  },
  cardGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  cardEmoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  cardTitle: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    width: '100%',
    borderRadius: 30,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: -15,
    right: -15,
    backgroundColor: '#FFF',
    borderRadius: 20,
  },
  modalEmoji: {
    fontSize: 70,
    marginTop: 10,
  },
  modalTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#333',
    marginVertical: 10,
    textAlign: 'center',
  },
  videoPlaceholder: {
    width: '100%',
    aspectRatio: 16/9,
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#CCC',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  videoPlaceholderText: {
    color: '#666',
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  videoPlaceholderSub: {
    color: '#999',
    marginTop: 5,
  },
  soundButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E88E5',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  soundButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10,
  }
});
