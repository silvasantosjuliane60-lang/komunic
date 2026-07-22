import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import { LIBRAS_ITEMS } from '../../../constants/LibrasData';

// Pega todos os itens e embaralha
const allItems = Object.values(LIBRAS_ITEMS).flat();

const shuffle = (array: any[]) => [...array].sort(() => 0.5 - Math.random());

export default function ModoDesafio() {
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [options, setOptions] = useState<any[]>([]);
  const [score, setScore] = useState(0);

  const generateQuestion = () => {
    const shuffled = shuffle(allItems);
    const correct = shuffled[0];
    const wrongs = shuffled.slice(1, 3);
    const questionOptions = shuffle([correct, ...wrongs]);
    
    setCurrentQuestion(correct);
    setOptions(questionOptions);
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const handleSelectOption = (opt: any) => {
    if (opt.id === currentQuestion.id) {
      Speech.speak("Muito bem!", { language: 'pt-BR' });
      setScore(s => s + 1);
      Alert.alert("Correto! 🎉", "Você acertou o sinal!", [
        { text: "Próximo", onPress: generateQuestion }
      ]);
    } else {
      Speech.speak("Tente novamente", { language: 'pt-BR' });
      Alert.alert("Ops!", "Tente novamente!");
    }
  };

  if (!currentQuestion) return null;

  return (
    <View style={styles.container}>
      
      <View style={styles.scoreBoard}>
        <Ionicons name="star" size={30} color="#FFC107" />
        <Text style={styles.scoreText}>Pontos: {score}</Text>
      </View>

      <Text style={styles.instruction}>O que significa esse sinal?</Text>

      <View style={styles.videoPlaceholder}>
        <Ionicons name="videocam" size={80} color="#999" />
        <Text style={styles.videoPlaceholderText}>VÍDEO DO SINAL AQUI</Text>
        <Text style={styles.videoPlaceholderSub}>({currentQuestion.id}.mp4)</Text>
      </View>

      <View style={styles.optionsContainer}>
        {options.map((opt) => (
          <TouchableOpacity 
            key={opt.id} 
            style={styles.optionButton}
            onPress={() => handleSelectOption(opt)}
          >
            <LinearGradient colors={['#FF9800', '#F57C00']} style={styles.optionGradient}>
              <Text style={styles.optionEmoji}>{opt.emoji}</Text>
              <Text style={styles.optionText}>{opt.word}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    padding: 20,
  },
  scoreBoard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#FF9800',
  },
  instruction: {
    fontSize: 24,
    fontWeight: '900',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  videoPlaceholder: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#FF9800',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  videoPlaceholderText: {
    color: '#666',
    fontWeight: 'bold',
    marginTop: 10,
    fontSize: 20,
  },
  videoPlaceholderSub: {
    color: '#999',
    marginTop: 5,
  },
  optionsContainer: {
    width: '100%',
    gap: 15,
  },
  optionButton: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  optionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  optionEmoji: {
    fontSize: 40,
    marginRight: 20,
  },
  optionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  }
});
