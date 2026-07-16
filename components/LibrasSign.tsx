// @ts-nocheck
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Dicionário visual temporário: mapeia Letras para um emoji de mão ou texto indicativo
export const LIBRAS_DICTIONARY = {
  A: '✊', B: '✋', C: '🫴', D: '👆', E: '🤌',
  F: '👇', G: '🤏', H: '✌️', I: '🫵', J: '🤙',
  K: '🫰', L: '🫲', M: '👇', N: '👇', O: '👌',
  P: '👈', Q: '👇', R: '🤞', S: '👊', T: '👎',
  U: '✌️', V: '✌️', W: '🤟', X: '🪝', Y: '🤙', Z: '👉'
};

export default function LibrasSign({ text, size = 'large' }) {
  // Pega apenas o primeiro caractere pra achar a letra no dicionário
  const letter = String(text).charAt(0).toUpperCase();
  const sign = LIBRAS_DICTIONARY[letter] || '🧏‍♀️'; 

  const isSmall = size === 'small';

  return (
    <View style={[styles.container, isSmall && styles.containerSmall]}>
      <Text style={[styles.librasText, isSmall && styles.librasTextSmall]}>LIBRAS</Text>
      <View style={styles.signBox}>
        <Text style={[styles.signEmoji, isSmall && styles.signEmojiSmall]}>{sign}</Text>
        <Text style={styles.letterHint}>"{letter}"</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#1E88E5',
    padding: 10,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#FFF',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 5, elevation: 8,
    alignItems: 'center',
    zIndex: 999, // Ficar sempre na frente
  },
  containerSmall: {
    padding: 5,
    borderRadius: 15,
    borderWidth: 2,
  },
  librasText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
    marginBottom: 5,
  },
  librasTextSmall: {
    fontSize: 10,
    marginBottom: 2,
  },
  signBox: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  signEmoji: {
    fontSize: 50,
  },
  signEmojiSmall: {
    fontSize: 30,
  },
  letterHint: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 5,
  }
});
