import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const AVATARS = ['🐶', '🐱', '🚀', '👑', '🦸‍♂️', '🦄'];
const ANIMALS = ['🐶', '🐱', '🐦', '🐟', '🐵', '🐸'];

export default function RegisterChildScreen() {
  const router = useRouter();
  const { registerChild } = useAuth();
  
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('🐶');
  const [secretPassword, setSecretPassword] = useState<string[]>([]);

  const toggleAnimal = (animal: string) => {
    if (secretPassword.length < 3) {
      setSecretPassword([...secretPassword, animal]);
    } else {
      setSecretPassword([animal]); // reseta se já tiver 3
    }
  };

  const handleRegister = async () => {
    if (!name.trim()) return Alert.alert('Ops!', 'Qual é o seu nome?');
    if (secretPassword.length < 3) return Alert.alert('Ops!', 'Escolha 3 bichinhos para a sua senha!');
    
    await registerChild(name, avatar, secretPassword.join(''));
    router.replace('/'); // Vai para o Mapa Mágico
  };

  return (
    <ImageBackground
      source={require('../../assets/images/bg_escola.jpg')}
      style={styles.background}
      blurRadius={10}
    >
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.overlay}>
        
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back-circle" size={50} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.title}>Novo Aventureiro!</Text>
          
          <Text style={styles.label}>Qual é o seu nome?</Text>
          <TextInput 
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Digite aqui..."
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Escolha seu Avatar</Text>
          <View style={styles.avatarGrid}>
            {AVATARS.map(emoji => (
              <TouchableOpacity key={emoji} onPress={() => setAvatar(emoji)} style={[styles.avatarBtn, avatar === emoji && styles.avatarBtnActive]}>
                <Text style={styles.avatarEmoji}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Crie sua Senha Secreta (3 bichinhos)</Text>
          <View style={styles.passwordDisplay}>
            {/* Mostra os bichinhos selecionados */}
            {[0, 1, 2].map(i => (
              <View key={i} style={styles.passwordSlot}>
                <Text style={styles.passwordSlotEmoji}>{secretPassword[i] || '❓'}</Text>
              </View>
            ))}
          </View>
          <View style={styles.animalGrid}>
            {ANIMALS.map(animal => (
              <TouchableOpacity key={animal} onPress={() => toggleAnimal(animal)} style={styles.animalBtn}>
                <Text style={styles.animalEmoji}>{animal}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
            <LinearGradient colors={['#4CAF50', '#2E7D32']} style={styles.registerGradient}>
              <Text style={styles.registerBtnText}>COMEÇAR A JOGAR!</Text>
            </LinearGradient>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  backBtn: { position: 'absolute', top: 40, left: 20 },
  card: { width: '90%', backgroundColor: '#FFF', borderRadius: 30, padding: 25, shadowColor: '#000', shadowOffset: {width: 0, height: 10}, shadowOpacity: 0.3, shadowRadius: 10, elevation: 10, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '900', color: '#1E88E5', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#555', alignSelf: 'flex-start', marginTop: 15, marginBottom: 5 },
  input: { width: '100%', backgroundColor: '#F0F0F0', borderRadius: 15, padding: 15, fontSize: 18, color: '#333', borderWidth: 2, borderColor: '#E0E0E0' },
  avatarGrid: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 10 },
  avatarBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: 'transparent' },
  avatarBtnActive: { borderColor: '#4CAF50', backgroundColor: '#E8F5E9' },
  avatarEmoji: { fontSize: 28 },
  passwordDisplay: { flexDirection: 'row', gap: 15, marginBottom: 15 },
  passwordSlot: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#2196F3' },
  passwordSlotEmoji: { fontSize: 30 },
  animalGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginBottom: 30 },
  animalBtn: { width: 45, height: 45, borderRadius: 10, backgroundColor: '#FFF3E0', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#FFB74D' },
  animalEmoji: { fontSize: 24 },
  registerBtn: { width: '100%', borderRadius: 25, overflow: 'hidden' },
  registerGradient: { paddingVertical: 15, alignItems: 'center' },
  registerBtnText: { color: '#FFF', fontSize: 20, fontWeight: '900' }
});
