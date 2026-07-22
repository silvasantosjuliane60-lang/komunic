import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function MundoLibrasIndex() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mundo de Libras</Text>
      <Text style={styles.subtitle}>Escolha como você quer se divertir hoje!</Text>

      <View style={styles.cardsContainer}>
        {/* Cartão de Aprender */}
        <TouchableOpacity style={styles.card} onPress={() => router.push('/games/mundo_libras/aprender')}>
          <LinearGradient colors={['#4CAF50', '#2E7D32']} style={styles.cardGradient}>
            <Ionicons name="book" size={80} color="#fff" />
            <Text style={styles.cardTitle}>Aprender</Text>
            <Text style={styles.cardDesc}>Descubra novos sinais e palavras</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Cartão de Desafio */}
        <TouchableOpacity style={styles.card} onPress={() => router.push('/games/mundo_libras/desafio')}>
          <LinearGradient colors={['#FF9800', '#E65100']} style={styles.cardGradient}>
            <Ionicons name="trophy" size={80} color="#fff" />
            <Text style={styles.cardTitle}>Desafio</Text>
            <Text style={styles.cardDesc}>Teste seus conhecimentos em um Quiz</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    color: '#1E88E5',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
  },
  card: {
    width: 300,
    height: 250,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  cardGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cardTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 20,
  },
  cardDesc: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
    marginTop: 10,
    opacity: 0.9,
  }
});
