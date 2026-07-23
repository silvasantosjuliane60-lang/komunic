import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, Modal, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

const ANIMALS = ['🐶', '🐱', '🐦', '🐟', '🐵', '🐸'];

export default function LoginScreen() {
  const router = useRouter();
  const { usersList, login, isLoading } = useAuth();
  
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [typedPassword, setTypedPassword] = useState<string[]>([]);

  const openChildModal = (id: string) => {
    setSelectedChildId(id);
    setTypedPassword([]);
  };

  const handleAnimalPress = (animal: string) => {
    if (typedPassword.length < 3) {
      const newPass = [...typedPassword, animal];
      setTypedPassword(newPass);
      
      // Auto-submit se digitou 3
      if (newPass.length === 3) {
        attemptLogin(selectedChildId!, newPass.join(''));
      }
    }
  };

  const attemptLogin = async (id: string, secret: string) => {
    const success = await login(id, secret);
    if (success) {
      setSelectedChildId(null);
      router.replace('/');
    } else {
      Alert.alert('Ops!', 'Senha incorreta. Tente novamente!');
      setTypedPassword([]);
    }
  };

  if (isLoading) return null;

  return (
    <ImageBackground
      source={require('../../assets/images/bg_escola.jpg')}
      style={styles.background}
      blurRadius={3}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Quem está jogando?</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.profilesContainer}>
            {usersList.filter(u => u.role === 'crianca').map(child => (
              <TouchableOpacity key={child.id} style={styles.profileCard} onPress={() => openChildModal(child.id)}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarEmoji}>{child.avatar}</Text>
                </View>
                <Text style={styles.profileName}>{child.name}</Text>
              </TouchableOpacity>
            ))}

            {/* BOTAO NOVO PERFIL CRIANCA */}
            <TouchableOpacity style={styles.profileCard} onPress={() => router.push('/(auth)/register_child')}>
              <View style={[styles.avatarCircle, { backgroundColor: 'rgba(255,255,255,0.5)', borderWidth: 3, borderColor: '#fff', borderStyle: 'dashed' }]}>
                <Ionicons name="add" size={50} color="#fff" />
              </View>
              <Text style={styles.profileName}>Nova Criança</Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.adultSection}>
            <TouchableOpacity style={styles.adultBtn} onPress={() => router.push('/(auth)/register_adult')}>
              <Ionicons name="people" size={24} color="#FFF" />
              <Text style={styles.adultBtnText}>Acesso Pais e Professores</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modal de Senha da Criança */}
        <Modal visible={!!selectedChildId} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedChildId(null)}>
                <Ionicons name="close-circle" size={40} color="#FF3B30" />
              </TouchableOpacity>
              
              <Text style={styles.modalTitle}>Qual é a sua senha?</Text>
              
              <View style={styles.passwordDisplay}>
                {[0, 1, 2].map(i => (
                  <View key={i} style={styles.passwordSlot}>
                    <Text style={styles.passwordSlotEmoji}>{typedPassword[i] || '❓'}</Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.animalGrid}>
                {ANIMALS.map(animal => (
                  <TouchableOpacity key={animal} onPress={() => handleAnimalPress(animal)} style={styles.animalBtn}>
                    <Text style={styles.animalEmoji}>{animal}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              
            </View>
          </View>
        </Modal>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  container: { width: '90%', alignItems: 'center' },
  title: { fontSize: 40, fontWeight: '900', color: '#FFF', marginBottom: 40, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 5 },
  profilesContainer: { paddingVertical: 20, gap: 30, paddingHorizontal: 20 },
  profileCard: { alignItems: 'center', width: 140 },
  avatarCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8, marginBottom: 15 },
  avatarEmoji: { fontSize: 60 },
  profileName: { fontSize: 24, fontWeight: 'bold', color: '#FFF', textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3 },
  adultSection: { marginTop: 60, width: '100%', alignItems: 'center' },
  adultBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 30, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  adultBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { width: '90%', backgroundColor: '#FFF', borderRadius: 30, padding: 30, alignItems: 'center', position: 'relative' },
  closeBtn: { position: 'absolute', top: -15, right: -15, backgroundColor: '#FFF', borderRadius: 20 },
  modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  passwordDisplay: { flexDirection: 'row', gap: 15, marginBottom: 25 },
  passwordSlot: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#2196F3' },
  passwordSlotEmoji: { fontSize: 35 },
  animalGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 15 },
  animalBtn: { width: 60, height: 60, borderRadius: 15, backgroundColor: '#FFF3E0', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFB74D' },
  animalEmoji: { fontSize: 35 }
});
