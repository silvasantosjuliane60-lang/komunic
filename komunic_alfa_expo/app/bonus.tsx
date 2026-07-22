// @ts-nocheck
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ImageBackground, TouchableOpacity,
  ScrollView, StatusBar, Alert, Linking, Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAudio } from '../hooks/useAudio';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

const ACTIVITY_CATEGORIES = [
  {
    id: 'alfabetizacao',
    title: '🔤 Alfabetização',
    color: ['#8E44AD', '#C44569'],
    activities: [
      { id: 'a1', emoji: '✍️', title: 'Tracejado das Letras A-Z', desc: 'Passe o lápis sobre cada letra!', level: 'Fácil', pages: 26, icon: 'pencil-alt' },
      { id: 'a2', emoji: '🖍️', title: 'Pinte a Letra Inicial', desc: 'Que letra começa essa palavra?', level: 'Fácil', pages: 15, icon: 'paint-brush' },
      { id: 'a3', emoji: '🔡', title: 'Ligue Maiúscula × Minúscula', desc: 'Conecte cada letra ao seu par!', level: 'Médio', pages: 10, icon: 'link' },
      { id: 'a4', emoji: '📝', title: 'Complete a Palavra', desc: 'Escreva a letra que falta!', level: 'Médio', pages: 20, icon: 'spell-check' },
    ]
  },
  {
    id: 'silabas',
    title: '🧩 Sílabas e Rimas',
    color: ['#FFC312', '#F79F1F'],
    activities: [
      { id: 's1', emoji: '👏', title: 'Bata Palmas e Conte', desc: 'Quantas sílabas tem essa palavra?', level: 'Fácil', pages: 12, icon: 'hands-helping' },
      { id: 's2', emoji: '🎵', title: 'Rimas Divertidas', desc: 'Pinte os objetos que rimam!', level: 'Fácil', pages: 10, icon: 'music' },
      { id: 's3', emoji: '✂️', title: 'Recorte e Monte Palavras', desc: 'Recorte as sílabas e cole na ordem!', level: 'Médio', pages: 15, icon: 'cut' },
    ]
  },
  {
    id: 'numeros',
    title: '🔢 Números e Contagem',
    color: ['#12CBC4', '#1289A7'],
    activities: [
      { id: 'n1', emoji: '🔢', title: 'Tracejado dos Números 0-9', desc: 'Passe o lápis sobre cada número!', level: 'Fácil', pages: 10, icon: 'sort-numeric-down' },
      { id: 'n2', emoji: '🐾', title: 'Conte os Animais', desc: 'Quantos bichinhos você vê? Escreva!', level: 'Fácil', pages: 12, icon: 'paw' },
      { id: 'n3', emoji: '➕', title: 'Jogo da Soma Divertida', desc: 'Some os docinhos e pinte a resposta!', level: 'Médio', pages: 10, icon: 'plus-circle' },
    ]
  },
  {
    id: 'comunicacao',
    title: '💬 Comunicação e CAA',
    color: ['#4D96FF', '#2D6ECC'],
    activities: [
      { id: 'c1', emoji: '😊', title: 'Cartões de Emoções', desc: 'Recorte e cole as emoções do dia!', level: 'Fácil', pages: 8, icon: 'smile' },
      { id: 'c2', emoji: '🗣️', title: 'Monte Sua Frase', desc: 'Recorte os pictogramas e monte frases!', level: 'Médio', pages: 10, icon: 'comment-dots' },
      { id: 'c3', emoji: '📋', title: 'Rotina Visual', desc: 'Organize o dia com pictogramas!', level: 'Fácil', pages: 6, icon: 'clipboard-list' },
    ]
  },
  {
    id: 'inclusao',
    title: '🤝 Inclusão e Libras',
    color: ['#6BCB77', '#4D9A5C'],
    activities: [
      { id: 'i1', emoji: '🤟', title: 'Alfabeto em Libras', desc: 'Aprenda as letras na língua de sinais!', level: 'Fácil', pages: 26, icon: 'sign-language' },
      { id: 'i2', emoji: '🎨', title: 'Pinte as Diferenças', desc: 'Cada criança é especial — encontre!', level: 'Fácil', pages: 8, icon: 'palette' },
    ]
  },
];

const LEVEL_COLORS = {
  'Fácil': '#6BCB77',
  'Médio': '#FFC312',
  'Difícil': '#FF6B6B',
};

const ActivityCard = ({ activity, onPreview, onToggleSelect, selected }) => (
  <View style={styles.actCard}>
    <TouchableOpacity activeOpacity={0.85} onPress={onPreview} style={styles.actCardGradient}>
      <Text style={styles.actEmoji}>{activity.emoji}</Text>
      <Text style={styles.actTitle} numberOfLines={2}>{activity.title}</Text>
      <Text style={styles.actDesc} numberOfLines={2}>{activity.desc}</Text>
      <View style={styles.actMeta}>
        <View style={[styles.levelBadge, { backgroundColor: LEVEL_COLORS[activity.level] }]}> 
          <Text style={styles.levelText}>{activity.level}</Text>
        </View>
        <Text style={styles.pageCount}>📄 {activity.pages} pág</Text>
      </View>
    </TouchableOpacity>

    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onToggleSelect}
      style={[styles.selectBtn, selected && styles.selectBtnSelected]}
    >
      <Text style={[styles.selectBtnText, selected && styles.selectBtnTextSelected]}>
        {selected ? 'Selecionado' : 'Selecionar'}
      </Text>
    </TouchableOpacity>
  </View>
);

export default function BonusPage() {
  const router = useRouter();
  const { speakText } = useAudio();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [previewActivityId, setPreviewActivityId] = useState<string | null>(null);

  const handleDownload = (activity) => {
    speakText(`Baixando ${activity.title}`);
    Alert.alert(
      '📥 Baixar Atividade',
      `"${activity.title}" (${activity.pages} páginas)\n\nEssa funcionalidade estará disponível em breve! Os PDFs serão criados exclusivamente para o Komunic Alfa.`,
      [
        { text: 'OK, Entendi! 🎉', style: 'default' },
      ]
    );
  };

  const handleToggleSelect = (activityId: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activityId) ? prev.filter((id) => id !== activityId) : [...prev, activityId]
    );
  };

  const handlePreview = (activityId: string) => {
    setPreviewActivityId(activityId);
  };

  const handleDownloadSelected = () => {
    const activeCategoryActivities = activeCategory?.activities || [];
    const selected = activeCategoryActivities.filter((act) => selectedActivities.includes(act.id));
    if (!selected.length) {
      Alert.alert('Nenhuma atividade selecionada', 'Escolha pelo menos uma atividade antes de baixar.');
      return;
    }

    const titles = selected.map((act) => act.title).join(', ');
    speakText(`Baixando ${selected.length} atividades`);
    Alert.alert(
      '📥 Baixar atividades',
      `As seguintes atividades serão baixadas:\n\n${titles}\n\nEssa funcionalidade estará disponível em breve!`,
      [{ text: 'OK, Entendi! 🎉', style: 'default' }]
    );
  };

  const activeCategory = selectedCategory
    ? ACTIVITY_CATEGORIES.find(c => c.id === selectedCategory)
    : null;

  return (
    <ImageBackground
      source={require('../assets/images/bg_escola.jpg')}
      style={styles.background}
      resizeMode="cover"
      blurRadius={3}
    >
      <StatusBar hidden />

      {/* HUD */}
      <SafeAreaView edges={["top"]}>
        <LinearGradient colors={['#FF6B6B', '#EE5A24', '#FFC312']} style={styles.hud}>
        <TouchableOpacity onPress={() => {
          if (selectedCategory) {
            setSelectedCategory(null);
          } else {
            router.push('/');
          }
        }} style={styles.hudBackBtn}>
          <Ionicons name="arrow-back" size={26} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.hudCenter}>
          <Text style={styles.hudTitle}>🎁 BÔNUS — ATIVIDADES PARA BAIXAR</Text>
          <View style={styles.hudBadge}>
            <Text style={styles.hudBadgeText}>
              {selectedCategory ? activeCategory?.title : 'Escolha uma categoria!'}
            </Text>
          </View>
        </View>
        <View style={styles.hudRight}>
          <FontAwesome5 name="gift" size={28} color="#FFF" />
        </View>
        </LinearGradient>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {!selectedCategory ? (
          /* ============ GRID DE CATEGORIAS ============ */
          <>
            {/* Título de boas vindas */}
            <View style={styles.welcomeCard}>
              <Text style={styles.welcomeEmoji}>🎉</Text>
              <Text style={styles.welcomeTitle}>Atividades Impressas Exclusivas!</Text>
              <Text style={styles.welcomeDesc}>
                Baixe atividades pedagógicas em PDF para complementar o aprendizado do app. 
                Ideal para a sala de aula ou em casa!
              </Text>
            </View>

            <View style={styles.categoriesGrid}>
              {ACTIVITY_CATEGORIES.map((cat) => {
                const totalPages = cat.activities.reduce((acc, a) => acc + a.pages, 0);
                return (
                  <TouchableOpacity
                    key={cat.id}
                    activeOpacity={0.85}
                    onPress={() => setSelectedCategory(cat.id)}
                    style={styles.catCard}
                  >
                    <LinearGradient colors={cat.color} style={styles.catGradient}>
                      <View style={styles.catGloss} />
                      <Text style={styles.catTitle}>{cat.title}</Text>
                      <Text style={styles.catCount}>{cat.activities.length} atividades</Text>
                      <Text style={styles.catPages}>📄 {totalPages} páginas</Text>
                      <View style={styles.catArrow}>
                        <Ionicons name="arrow-forward" size={20} color="rgba(255,255,255,0.8)" />
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Info card */}
            <View style={styles.infoCard}>
              <FontAwesome5 name="info-circle" size={20} color="#4D96FF" />
              <Text style={styles.infoText}>
                Todas as atividades são alinhadas com a BNCC e pensadas para crianças de 3 a 8 anos, 
                incluindo crianças com necessidades especiais. 💚
              </Text>
            </View>
          </>
        ) : (
          /* ============ ATIVIDADES DA CATEGORIA ============ */
          <>
            <View style={styles.activityHeader}>
              <Text style={styles.activityHeaderTitle}>Selecione as atividades</Text>
              <Text style={styles.activityHeaderSubtitle}>Toque em cada atividade para ver mais detalhes.</Text>
            </View>

            <View style={styles.activitiesGrid}>
              {activeCategory?.activities.map((act) => (
                <ActivityCard
                  key={act.id}
                  activity={act}
                  onPreview={() => handlePreview(act.id)}
                  onToggleSelect={() => handleToggleSelect(act.id)}
                  selected={selectedActivities.includes(act.id)}
                />
              ))}
            </View>

            <View style={styles.downloadBar}>
              <Text style={styles.downloadSummary}>{selectedActivities.length} selecionada(s)</Text>
              <TouchableOpacity activeOpacity={0.85} onPress={handleDownloadSelected} style={styles.downloadAllBtn}>
                <Text style={styles.downloadAllText}>Baixar selecionadas</Text>
              </TouchableOpacity>
            </View>

            {previewActivityId && (
              <View style={styles.previewCard}>
                <Text style={styles.previewTitle}>Pré-visualização</Text>
                {activeCategory?.activities
                  .filter((act) => act.id === previewActivityId)
                  .map((act) => (
                    <View key={act.id} style={styles.previewContent}>
                      <Text style={styles.previewEmoji}>{act.emoji}</Text>
                      <Text style={styles.previewName}>{act.title}</Text>
                      <Text style={styles.previewDesc}>{act.desc}</Text>
                      <Text style={styles.previewMeta}>Nível: {act.level}</Text>
                      <Text style={styles.previewMeta}>Páginas: {act.pages}</Text>
                    </View>
                  ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  // HUD
  hud: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingTop: 15,
    gap: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 10,
  },
  hudBackBtn: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 20,
    padding: 8,
  },
  hudCenter: {
    flex: 1,
    alignItems: 'center',
  },
  hudTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  hudBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 3,
    marginTop: 4,
  },
  hudBadgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  hudRight: {
    padding: 8,
  },

  // Scroll
  scrollContent: {
    padding: 15,
    paddingBottom: 40,
  },

  // Welcome
  welcomeCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 25,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#FFC312',
    shadowColor: '#FFC312',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  welcomeEmoji: {
    fontSize: 50,
    marginBottom: 8,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeDesc: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Categories Grid
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 14,
    marginBottom: 20,
  },
  catCard: {
    width: CARD_WIDTH,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  catGradient: {
    borderRadius: 22,
    padding: 18,
    minHeight: 140,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
    overflow: 'hidden',
  },
  catGloss: {
    position: 'absolute',
    top: 3,
    left: '10%',
    right: '10%',
    height: '35%',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 15,
  },
  catTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginBottom: 6,
  },
  catCount: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 2,
  },
  catPages: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },
  catArrow: {
    position: 'absolute',
    bottom: 10,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 4,
  },

  // Info Card
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 18,
    padding: 15,
    gap: 12,
    alignItems: 'flex-start',
    borderWidth: 2,
    borderColor: '#4D96FF',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
  },

  // Activities Grid
  activitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 14,
  },
  actCard: {
    width: CARD_WIDTH,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  actCardGradient: {
    borderRadius: 22,
    padding: 14,
    borderWidth: 3,
    borderColor: 'rgba(200,200,255,0.5)',
    alignItems: 'center',
  },
  actEmoji: {
    fontSize: 45,
    marginBottom: 6,
  },
  actTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  selectBtn: {
    marginTop: 10,
    alignSelf: 'center',
    backgroundColor: '#F1F3FF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#4D96FF',
  },
  selectBtnSelected: {
    backgroundColor: '#4D96FF',
  },
  selectBtnText: {
    color: '#4D96FF',
    fontWeight: '800',
    fontSize: 12,
  },
  selectBtnTextSelected: {
    color: '#FFF',
  },
  activityHeader: {
    marginBottom: 14,
    paddingHorizontal: 8,
  },
  activityHeaderTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#333',
    marginBottom: 4,
  },
  activityHeaderSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  downloadBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    marginTop: 18,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#DDE6F2',
  },
  downloadSummary: {
    color: '#333',
    fontSize: 13,
    fontWeight: '700',
  },
  downloadAllBtn: {
    backgroundColor: '#4D96FF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  downloadAllText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '900',
  },
  previewCard: {
    marginTop: 20,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 18,
    borderWidth: 2,
    borderColor: '#C4D7FF',
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#333',
    marginBottom: 10,
  },
  previewContent: {
    gap: 8,
  },
  previewEmoji: {
    fontSize: 40,
    marginBottom: 6,
  },
  previewName: {
    fontSize: 15,
    fontWeight: '900',
    color: '#222',
    marginBottom: 4,
  },
  previewDesc: {
    fontSize: 13,
    color: '#555',
    marginBottom: 6,
    lineHeight: 18,
  },
  previewMeta: {
    fontSize: 12,
    color: '#777',
  },
  actDesc: {
    fontSize: 11,
    color: '#777',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 15,
  },
  actMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  levelText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },
  pageCount: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  downloadText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
