// @ts-nocheck
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AccessibilityProvider } from '../contexts/AccessibilityContext';

export default function RootLayout() {
  return (
    <AccessibilityProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="map" />
        <Stack.Screen name="auth/select" options={{ title: 'Quem é você?', headerShown: true, headerStyle: { backgroundColor: '#6C63FF' } }} />
        <Stack.Screen name="teacher_panel/index" options={{ title: 'Painel do Professor', headerShown: true, headerStyle: { backgroundColor: '#4CAF50' } }} />
        <Stack.Screen name="caa_board/index" options={{ title: 'CAA Hub', headerShown: true, headerStyle: { backgroundColor: '#FF8F00' } }} />
        <Stack.Screen name="caa_board/desenho" options={{ title: 'Folha Mágica', headerShown: true, headerStyle: { backgroundColor: '#4CAF50' } }} />
        <Stack.Screen name="caa_board/prancha" options={{ title: 'Prancha de Comunicação', headerShown: true, headerStyle: { backgroundColor: '#E91E63' } }} />
      </Stack>
    </AccessibilityProvider>
  );
}
