// @ts-nocheck
import { Platform } from 'react-native';
import { useAudioPlayer } from 'expo-audio';
import { Audio } from 'expo-av';

// ─── Pré-carregamento das vozes (assíncrono, feito uma vez) ──────────────────
let ptVoice: SpeechSynthesisVoice | null = null;

const numberWords: Record<string, string> = {
  '0': 'zero',
  '1': 'um',
  '2': 'dois',
  '3': 'três',
  '4': 'quatro',
  '5': 'cinco',
  '6': 'seis',
  '7': 'sete',
  '8': 'oito',
  '9': 'nove',
  '10': 'dez',
};

const normalizeSpeechText = (text: string) => {
  const trimmed = text.trim();
  if (!trimmed) return trimmed;
  if (/^\d+$/.test(trimmed)) {
    return numberWords[trimmed] ?? trimmed;
  }
  return trimmed.replace(/\d+/g, (match) => numberWords[match] ?? match);
};

const initVoices = () => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  const pick = () => {
    const all = window.speechSynthesis.getVoices();
    if (!all.length) return;
    // Prioridade: Luciana (macOS) → Vitória → qualquer pt-BR → qualquer pt
    ptVoice =
      all.find(v => v.lang === 'pt-BR' && v.name.includes('Luciana')) ||
      all.find(v => v.lang === 'pt-BR' && v.name.includes('Vitoria')) ||
      all.find(v => v.lang === 'pt-BR') ||
      all.find(v => v.lang.startsWith('pt')) ||
      null;
  };

  // Chrome/Edge disparam onvoiceschanged; Firefox tem as vozes imediatamente
  pick();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = pick;
  }
};

if (Platform.OS === 'web') initVoices();

// ─── Falar no navegador ───────────────────────────────────────────────────────
const speakWeb = (text: string) => {
  const normalizedText = normalizeSpeechText(text);
  if (typeof window === 'undefined' || !window.speechSynthesis || !normalizedText) return;
  
  try {
    window.speechSynthesis.cancel();

    const say = () => {
      const utter = new SpeechSynthesisUtterance(normalizedText);
      utter.lang   = 'pt-BR';
      utter.rate   = 0.95;
      utter.pitch  = 1.0;
      utter.volume = 1.0;
      if (ptVoice) utter.voice = ptVoice;
      window.speechSynthesis.speak(utter);
    };

    if (!ptVoice) {
      const all = window.speechSynthesis.getVoices();
      if (all.length) {
        ptVoice = all.find(v => v.lang === 'pt-BR' && v.name.includes('Luciana')) ||
          all.find(v => v.lang === 'pt-BR' && v.name.includes('Vitoria')) ||
          all.find(v => v.lang === 'pt-BR') ||
          all.find(v => v.lang.startsWith('pt')) ||
          null;
      }
    }

    say();
  } catch (err) {
    console.warn("Erro ao tentar falar o texto no navegador:", err);
  }
};

// ─── Falar no celular (expo-speech) ──────────────────────────────────────────
let Speech: any = null;
if (Platform.OS !== 'web') {
  try { Speech = require('expo-speech'); } catch (_) {}
}

const speakNative = (text: string) => {
  if (!Speech || !text) return;
  const normalizedText = normalizeSpeechText(text);
  Speech.stop();
  Speech.speak(normalizedText, { language: 'pt-BR', rate: 0.95, pitch: 1.0 });
};

// ─── Hook principal ──────────────────────────────────────────────────────────
export function useAudio() {
  const applausePlayer = useAudioPlayer(require('../assets/audio/applause.mp3'));

  const speakText = (text: string) => {
    if (Platform.OS === 'web') speakWeb(text);
    else speakNative(text);
  };

  const stopSpeech = () => {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
      } else {
        if (Speech) Speech.stop();
      }
    } catch (err) {
      console.warn("Erro ao parar a fala:", err);
    }
  };

  const playSuccess = async () => {
    // Apenas toca o som de sucesso sem falar 'Parabéns' repetidamente
    try {
      if (applausePlayer) {
        await applausePlayer.seekTo(0);
        applausePlayer.play();
      }
    } catch (_) {}
  };

  const playAudioFile = async (file: any) => {
    try {
      const { sound } = await Audio.Sound.createAsync(file);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (_) {}
  };

  const playError = () => speakText('Ops! Tente de novo!');
  const playCoin  = () => {};

  // Gravações locais de fonemas (adicione em assets/audio/phonemes/ as letras que quiser usar)
  const phonemeRecordings: Record<string, any> = {};

  const accentedVowels: Record<string, string> = {
    A: 'Á', E: 'Ê', I: 'Í', O: 'Ô', U: 'Ú',
  };

  const phoneticMap: Record<string, string> = {
    A: 'A',  B: 'Bê', C: 'Cê',  D: 'Dê',    E: 'E',
    F: 'Efe', G: 'Gê', H: 'Agá', I: 'I',     J: 'Jota',
    K: 'Cá', L: 'Ele', M: 'Eme', N: 'Ene',   O: 'O',
    P: 'Pê', Q: 'Quê', R: 'Erre', S: 'S', T: 'Tê',
    U: 'U',  V: 'Vê', W: 'Dábliu', X: 'Xis', Y: 'Ípsilon',
    Z: 'Zê',
  };

  const formatSyllable = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return trimmed;

    if (trimmed.length === 1) {
      return phoneticMap[trimmed.toUpperCase()] ?? trimmed.toUpperCase();
    }

    const upper = trimmed.toUpperCase();
    const match = upper.match(/^([BCDFGHJKLMNPQRSTVWXYZ])([AEIOU])$/);
    if (match) {
      const [, consonant, vowel] = match;
      const accented = accentedVowels[vowel] ?? vowel;
      return `${consonant}${accented}`;
    }

    return trimmed;
  };

  const playPhoneme = async (value: string, _label?: string) => {
    const normalized = value.trim();
    const sound = formatSyllable(normalized);
    const audioKey = `letter_${normalized.toLowerCase()}`;

    if (normalized.length === 1) {
      const audioFile = phonemeRecordings[audioKey];
      if (audioFile) {
        await playAudioFile(audioFile);
        return;
      }
    }

    stopSpeech();
    speakText(sound);
  };

  return { playSuccess, playError, playCoin, playPhoneme, speakText, stopSpeech };
}
