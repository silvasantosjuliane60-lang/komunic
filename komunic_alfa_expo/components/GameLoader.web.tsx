// Versão WEB — usa <iframe> apontando pro servidor local de jogos
import React from 'react';
import { View, StyleSheet } from 'react-native';

interface Props {
  page: string;
  title?: string;
}

export default function GameLoader({ page }: Props) {
  const gameUrl = `http://localhost:8080/${page || 'index.html'}`;

  return (
    <View style={styles.container}>
      {/* @ts-ignore — iframe é válido na web */}
      <iframe
        src={gameUrl}
        style={iframeStyle}
        allow="autoplay"
        title={page}
      />
    </View>
  );
}

const iframeStyle: React.CSSProperties = {
  flex: 1,
  width: '100%',
  height: '100%',
  border: 'none',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
