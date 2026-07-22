// @ts-nocheck
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function LoginSelectionScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Quem é você?</Text>
        
        <TouchableOpacity style={styles.card} onPress={() => router.push('/map')}>
          <View style={[styles.iconContainer, { backgroundColor: '#FFB74D20' }]}>
            <Ionicons name="happy" size={40} color="#FFB74D" />
          </View>
          <Text style={styles.cardText}>Sou Criança</Text>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => router.push('/teacher_panel')}>
          <View style={[styles.iconContainer, { backgroundColor: '#4CAF5020' }]}>
            <Ionicons name="school" size={40} color="#4CAF50" />
          </View>
          <Text style={styles.cardText}>Sou Professor(a)</Text>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <View style={[styles.iconContainer, { backgroundColor: '#2196F320' }]}>
            <Ionicons name="people" size={40} color="#2196F3" />
          </View>
          <Text style={styles.cardText}>Sou da Família</Text>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6C63FF',
    textAlign: 'center',
    marginBottom: 50,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#eee',
    elevation: 2,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  cardText: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D3142',
  }
});
