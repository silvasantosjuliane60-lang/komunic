import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import { LIBRAS_CATEGORIES, LIBRAS_ITEMS } from '../../../constants/LibrasData';

export default function ModoAprender() {
  const [activeCategory, setActiveCategory] = useState(LIBRAS_CATEGORIES[0]);
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
      {/* TABS DE CATEGORIAS */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
          {LIBRAS_CATEGORIES.map((cat) => {
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
          {LIBRAS_ITEMS[activeCategory.id as keyof typeof LIBRAS_ITEMS].map((item: any) => (
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
              <Ionicons name="close-circle" size={50} color="#FF3B30" />
            </TouchableOpacity>

            {selectedItem && (
              <>
                <Text style={styles.modalEmoji}>{(selectedItem as any).emoji}</Text>
                <Text style={styles.modalTitle}>{(selectedItem as any).word}</Text>
                
                <View style={styles.signDisplay}>
                  <Text style={styles.signDisplayEmoji}>🤟 {(selectedItem as any).emoji}</Text>
                  <Text style={styles.signDisplayText}>Sinal de {(selectedItem as any).word}</Text>
                  <Text style={styles.signDisplaySub}>[ Imagem/Vídeo em Breve ]</Text>
                </View>

                <TouchableOpacity 
                  style={styles.soundButton}
                  onPress={() => Speech.speak((selectedItem as any).word, { language: 'pt-BR', rate: 0.8 })}
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
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  tabContainer: { backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E0E0E0', paddingVertical: 10 },
  tabScroll: { paddingHorizontal: 10 },
  tab: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F0F0', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 25, marginRight: 10, borderWidth: 2, borderColor: 'transparent' },
  tabText: { marginLeft: 8, fontWeight: 'bold', color: '#666' },
  tabTextActive: { color: '#FFF' },
  gridContainer: { padding: 20, paddingBottom: 50 },
  categoryTitle: { fontSize: 24, fontWeight: '900', marginBottom: 20, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: '48%', aspectRatio: 1, marginBottom: 15, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5, overflow: 'hidden' },
  cardGradient: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10 },
  cardEmoji: { fontSize: 50, marginBottom: 10 },
  cardTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 16, textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFF', width: '100%', borderRadius: 30, padding: 30, alignItems: 'center', position: 'relative' },
  closeButton: { position: 'absolute', top: -20, right: -15, backgroundColor: '#FFF', borderRadius: 30 },
  modalEmoji: { fontSize: 80, marginTop: 10 },
  modalTitle: { fontSize: 36, fontWeight: '900', color: '#333', marginVertical: 10, textAlign: 'center' },
  signDisplay: { width: '100%', paddingVertical: 40, backgroundColor: '#E3F2FD', borderRadius: 20, borderWidth: 2, borderColor: '#64B5F6', justifyContent: 'center', alignItems: 'center', marginVertical: 20 },
  signDisplayEmoji: { fontSize: 80, marginBottom: 10 },
  signDisplayText: { color: '#1565C0', fontWeight: '900', fontSize: 20, textAlign: 'center', paddingHorizontal: 20 },
  signDisplaySub: { color: '#64B5F6', fontWeight: 'bold', marginTop: 10 },
  soundButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#4CAF50', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 },
  soundButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 18, marginLeft: 10 }
});
