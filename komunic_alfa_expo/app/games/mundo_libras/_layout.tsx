import { Stack } from 'expo-router';
import React from 'react';

export default function MundoLibrasLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Mundo de Libras',
          headerStyle: { backgroundColor: '#1E88E5' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      <Stack.Screen 
        name="aprender" 
        options={{ 
          title: 'Aprender',
          headerStyle: { backgroundColor: '#4CAF50' },
          headerTintColor: '#fff',
        }} 
      />
      <Stack.Screen 
        name="desafio" 
        options={{ 
          title: 'Modo Desafio',
          headerStyle: { backgroundColor: '#FF9800' },
          headerTintColor: '#fff',
        }} 
      />
    </Stack>
  );
}
