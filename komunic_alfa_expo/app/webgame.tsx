// @ts-nocheck
// Metro Bundler resolve automaticamente:
//   GameLoader.web.tsx  → quando roda no navegador (web)
//   GameLoader.tsx      → quando roda no Android / iOS
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import GameLoader from '../components/GameLoader';

export default function WebGameScreen() {
  const { page, title } = useLocalSearchParams<{ page: string; title: string }>();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: title || 'Jogo',
          headerStyle: { backgroundColor: '#9b59b6' },
          headerTintColor: '#fff',
        }}
      />
      <GameLoader page={page || 'index.html'} title={title} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});
