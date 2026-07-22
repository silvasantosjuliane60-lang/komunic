// @ts-nocheck
import { View, Text, StyleSheet } from 'react-native';

export default function TeacherPanel() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Painel do Professor</Text>
      <Text>Em breve: acompanhamento do progresso dos alunos.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
});
