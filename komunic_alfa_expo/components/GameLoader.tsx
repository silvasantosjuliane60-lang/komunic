// Versão NATIVA (Android / iOS) — extrai zip e usa WebView
// Usa a nova API do expo-file-system (SDK 54+): File e Directory
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system/legacy';
import { Asset } from 'expo-asset';
import JSZip from 'jszip';

interface Props {
  page: string;
  title?: string;
}

export default function GameLoader({ page }: Props) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localUri, setLocalUri] = useState<string | null>(null);

  useEffect(() => {
    async function prepareGame() {
      try {
        const webgamesDir = FileSystem.documentDirectory + 'webgames_v21/';
        const targetFile = webgamesDir + (page || 'index.html');

        // Nova API legada compatível com SDK 54
        const dirInfo = await FileSystem.getInfoAsync(webgamesDir);

        if (!dirInfo.exists) {
          console.log('Extraindo webgames.zip pela primeira vez...');
          await FileSystem.makeDirectoryAsync(webgamesDir, { intermediates: true });

          const zipAsset = Asset.fromModule(require('../assets/webgames.zip'));
          await zipAsset.downloadAsync();

          if (!zipAsset.localUri) throw new Error('Falha ao baixar zip');
          const zipContent = await FileSystem.readAsStringAsync(zipAsset.localUri, {
            encoding: FileSystem.EncodingType.Base64,
          });

          const zip = await JSZip.loadAsync(zipContent, { base64: true });
          const files = Object.keys(zip.files);

          for (let i = 0; i < files.length; i++) {
            const filename = files[i];
            const zipEntry = zip.files[filename];
            if (zipEntry.dir) {
              await FileSystem.makeDirectoryAsync(webgamesDir + filename, {
                intermediates: true,
              });
            } else {
              const fileData = await zipEntry.async('base64');
              const parts = filename.split('/');
              parts.pop();
              if (parts.length > 0) {
                await FileSystem.makeDirectoryAsync(webgamesDir + parts.join('/'), {
                  intermediates: true,
                });
              }
              await FileSystem.writeAsStringAsync(webgamesDir + filename, fileData, {
                encoding: FileSystem.EncodingType.Base64,
              });
            }
          }
          console.log('Extração concluída!');
        }

        setLocalUri(targetFile);
        setIsReady(true);
      } catch (e: any) {
        console.error(e);
        setError('Erro ao carregar o jogo: ' + (e?.message || String(e)));
      }
    }

    prepareGame();
  }, [page]);

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>⚠️ Erro ao carregar</Text>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!isReady || !localUri) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#9b59b6" />
        <Text style={styles.loadingText}>Preparando o jogo... (só na primeira vez)</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: localUri }}
        originWhitelist={['*']}
        allowFileAccess={true}
        allowFileAccessFromFileURLs={true}
        allowUniversalAccessFromFileURLs={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mediaPlaybackRequiresUserAction={false}
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  webview: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#c0392b',
  },
  error: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
