import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import JSZip from 'jszip';
import { useLocalSearchParams, Stack } from 'expo-router';

export default function WebGameScreen() {
  const { page, title } = useLocalSearchParams();
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localUri, setLocalUri] = useState<string | null>(null);

  useEffect(() => {
    async function prepareGame() {
      try {
        const webgamesDir = FileSystem.documentDirectory + 'webgames/';
        const targetFile = webgamesDir + (page || 'index.html');
        
        // Verifica se a pasta ja foi extraida
        const dirInfo = await FileSystem.getInfoAsync(webgamesDir);
        
        if (!dirInfo.exists) {
          console.log("Extraindo webgames.zip pela primeira vez...");
          await FileSystem.makeDirectoryAsync(webgamesDir, { intermediates: true });
          
          // Carrega o asset zip
          const zipAsset = Asset.fromModule(require('../assets/webgames.zip'));
          await zipAsset.downloadAsync();
          
          // Le como base64
          if (!zipAsset.localUri) throw new Error("Falha ao baixar zip");
          const zipContent = await FileSystem.readAsStringAsync(zipAsset.localUri, { encoding: FileSystem.EncodingType.Base64 });
          
          // Extrai com JSZip
          const zip = await JSZip.loadAsync(zipContent, { base64: true });
          
          const files = Object.keys(zip.files);
          for (let i = 0; i < files.length; i++) {
            const filename = files[i];
            const zipEntry = zip.files[filename];
            if (zipEntry.dir) {
              await FileSystem.makeDirectoryAsync(webgamesDir + filename, { intermediates: true });
            } else {
              const fileData = await zipEntry.async("base64");
              // Garante que o diretorio pai existe
              const parts = filename.split('/');
              parts.pop();
              if (parts.length > 0) {
                await FileSystem.makeDirectoryAsync(webgamesDir + parts.join('/'), { intermediates: true });
              }
              await FileSystem.writeAsStringAsync(webgamesDir + filename, fileData, { encoding: FileSystem.EncodingType.Base64 });
            }
          }
          console.log("Extracao concluida!");
        }

        setLocalUri(targetFile);
        setIsReady(true);
      } catch (e) {
        console.error(e);
        setError("Erro ao carregar o jogo: " + e);
      }
    }

    prepareGame();
  }, [page]);

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!isReady || !localUri) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#9b59b6" />
        <Text style={styles.loadingText}>Preparando o jogo pela primeira vez (pode demorar alguns segundos)...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: (title as string) || 'Jogo', headerStyle: { backgroundColor: '#9b59b6' }, headerTintColor: '#fff' }} />
      <WebView 
        source={{ uri: localUri }} 
        originWhitelist={['*']}
        allowFileAccess={true}
        allowFileAccessFromFileURLs={true}
        allowUniversalAccessFromFileURLs={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  webview: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff'
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
    textAlign: 'center'
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center'
  }
});
