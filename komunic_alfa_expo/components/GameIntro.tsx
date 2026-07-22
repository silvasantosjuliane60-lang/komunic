// @ts-nocheck
/**
 * GameIntro.tsx — Componente de Introdução Pedagógica do Jogo
 * Mostra competências, objetivo, BNCC antes de iniciar cada jogo
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { GAME_METADATA } from '../constants/GameData';

/**
 * Botão "ℹ️" que fica no HUD de cada jogo.
 * Ao clicar, abre um modal bonito com as informações pedagógicas.
 */
export const GameInfoButton = ({ gameKey, style }) => {
  const [visible, setVisible] = useState(false);
  const meta = GAME_METADATA[gameKey];

  if (!meta) return null;

  return (
    <>
      <TouchableOpacity onPress={() => setVisible(true)} style={[styles.infoBtn, style]} activeOpacity={0.8}>
        <Ionicons name="information-circle" size={28} color="#FFF" />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            {/* Header */}
            <LinearGradient colors={meta.hudColor} style={styles.modalHeader}>
              <Text style={styles.modalEmoji}>{meta.emoji}</Text>
              <Text style={styles.modalTitle}>{meta.titulo}</Text>
              <Text style={styles.modalId}>{meta.id}</Text>
            </LinearGradient>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Categoria e Módulo */}
              <View style={styles.row}>
                <View style={[styles.tag, { backgroundColor: '#8E44AD' }]}>
                  <Text style={styles.tagText}>📂 {meta.categoria}</Text>
                </View>
                <View style={[styles.tag, { backgroundColor: '#4D96FF' }]}>
                  <Text style={styles.tagText}>📘 {meta.modulo}</Text>
                </View>
              </View>

              {/* Info básica */}
              <View style={styles.infoRow}>
                <View style={styles.infoPill}>
                  <Text style={styles.infoPillEmoji}>🎯</Text>
                  <Text style={styles.infoPillText}>Nível {meta.nivel}</Text>
                </View>
                <View style={styles.infoPill}>
                  <Text style={styles.infoPillEmoji}>👶</Text>
                  <Text style={styles.infoPillText}>{meta.idade}</Text>
                </View>
                <View style={styles.infoPill}>
                  <Text style={styles.infoPillEmoji}>🏆</Text>
                  <Text style={styles.infoPillText}>{meta.recompensa}</Text>
                </View>
              </View>

              {/* Objetivo */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>🎯 Objetivo de Aprendizagem</Text>
                <Text style={styles.sectionText}>{meta.objetivo}</Text>
              </View>

              {/* Descrição */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>📋 Como Funciona</Text>
                <Text style={styles.sectionText}>{meta.descricao}</Text>
              </View>

              {/* BNCC */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>📚 Habilidades da BNCC</Text>
                <View style={styles.bnccRow}>
                  {meta.bncc.map((code, i) => (
                    <View key={i} style={styles.bnccBadge}>
                      <Text style={styles.bnccText}>{code}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Competências */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>🧠 Competências Desenvolvidas</Text>
                <View style={styles.compGrid}>
                  {meta.competencias.map((comp, i) => (
                    <View key={i} style={[styles.compBadge, { backgroundColor: comp.color + '20', borderColor: comp.color }]}>
                      <Text style={styles.compEmoji}>{comp.emoji}</Text>
                      <Text style={[styles.compLabel, { color: comp.color }]}>{comp.label}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Recursos */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>♿ Inclusão e Acessibilidade</Text>
                <Text style={styles.sectionText}>{meta.inclusao}</Text>
              </View>

              {/* Features */}
              <View style={styles.featuresRow}>
                {meta.audio && (
                  <View style={styles.featureBadge}>
                    <FontAwesome5 name="volume-up" size={14} color="#6BCB77" />
                    <Text style={styles.featureText}>Áudio</Text>
                  </View>
                )}
                {meta.animacao && (
                  <View style={styles.featureBadge}>
                    <FontAwesome5 name="magic" size={14} color="#FFC312" />
                    <Text style={styles.featureText}>Animação</Text>
                  </View>
                )}
                <View style={styles.featureBadge}>
                  <FontAwesome5 name="star" size={14} color="#FF6B6B" />
                  <Text style={styles.featureText}>{meta.pontuacao} pts/rodada</Text>
                </View>
              </View>
            </ScrollView>

            {/* Botão Fechar */}
            <TouchableOpacity onPress={() => setVisible(false)} style={styles.closeBtn} activeOpacity={0.8}>
              <LinearGradient colors={meta.hudColor} style={styles.closeBtnGradient}>
                <Text style={styles.closeBtnText}>VAMOS JOGAR! 🎮</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  // Info Button
  infoBtn: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 16,
    padding: 4,
  },

  // Modal Overlay
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '85%',
    backgroundColor: '#FFF',
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },

  // Header
  modalHeader: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  modalEmoji: {
    fontSize: 50,
    marginBottom: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFF',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    textAlign: 'center',
  },
  modalId: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '700',
    marginTop: 4,
  },

  // Body
  modalBody: {
    padding: 18,
  },

  // Tags
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  tagText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },

  // Info Pills
  infoRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4FF',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 5,
  },
  infoPillEmoji: {
    fontSize: 16,
  },
  infoPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#555',
  },

  // Sections
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#333',
    marginBottom: 6,
  },
  sectionText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 19,
  },

  // BNCC
  bnccRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  bnccBadge: {
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  bnccText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2E7D32',
  },

  // Competências
  compGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  compBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 2,
    gap: 5,
  },
  compEmoji: {
    fontSize: 16,
  },
  compLabel: {
    fontSize: 11,
    fontWeight: '800',
  },

  // Features
  featuresRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  featureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F8F9FF',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  featureText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#555',
  },

  // Close button
  closeBtn: {
    marginHorizontal: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  closeBtnGradient: {
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  closeBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default GameInfoButton;
