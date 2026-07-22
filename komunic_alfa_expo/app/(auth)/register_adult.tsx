import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function RegisterAdultScreen() {
  const router = useRouter();
  const { registerAdult } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      return Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
    }
    
    await registerAdult(name, email, password);
    router.replace('/'); // Vai para a tela inicial
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
          <View style={styles.headerIcon}>
            <Ionicons name="people" size={40} color="#FFF" />
          </View>
          <Text style={styles.title}>Acesso Adulto</Text>
          <Text style={styles.subtitle}>Para pais e professores</Text>
          
          <Text style={styles.label}>Nome Completo</Text>
          <TextInput 
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Seu nome"
          />

          <Text style={styles.label}>E-mail</Text>
          <TextInput 
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="seu@email.com"
          />

          <Text style={styles.label}>Senha Segura</Text>
          <TextInput 
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="********"
          />

          <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
            <LinearGradient colors={['#1E88E5', '#1565C0']} style={styles.registerGradient}>
              <Text style={styles.registerBtnText}>CRIAR CONTA</Text>
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
  card: { width: '90%', backgroundColor: '#FFF', borderRadius: 30, padding: 30, shadowColor: '#000', shadowOffset: {width: 0, height: 10}, shadowOpacity: 0.3, shadowRadius: 10, elevation: 10, alignItems: 'center', paddingTop: 50 },
  headerIcon: { position: 'absolute', top: -30, backgroundColor: '#1E88E5', width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#FFF' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 30 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#555', alignSelf: 'flex-start', marginBottom: 5 },
  input: { width: '100%', backgroundColor: '#F9F9F9', borderRadius: 10, padding: 15, fontSize: 16, color: '#333', borderWidth: 1, borderColor: '#DDD', marginBottom: 20 },
  registerBtn: { width: '100%', borderRadius: 25, overflow: 'hidden', marginTop: 10 },
  registerGradient: { paddingVertical: 15, alignItems: 'center' },
  registerBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});
