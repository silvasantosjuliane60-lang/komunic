// @ts-nocheck
import { Platform } from 'react-native';
import { useAudioPlayer } from 'expo-audio';

// ─── Pré-carregamento das vozes (assíncrono, feito uma vez) ──────────────────
let ptVoice: SpeechSynthesisVoice | null = null;

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
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  const say = () => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang   = 'pt-BR';
    utter.rate   = 0.75;
    utter.pitch  = 1.0;
    utter.volume = 1.0;
    if (ptVoice) utter.voice = ptVoice;
    window.speechSynthesis.speak(utter);
  };

  // Se as vozes ainda não carregaram, tenta mais uma vez
  if (!ptVoice) {
    const all = window.speechSynthesis.getVoices();
    if (all.length) {
      ptVoice = all.find(v => v.lang === 'pt-BR') || all.find(v => v.lang.startsWith('pt')) || null;
    }
  }

  say();
};

// ─── Falar no celular (expo-speech) ──────────────────────────────────────────
let Speech: any = null;
if (Platform.OS !== 'web') {
  try { Speech = require('expo-speech'); } catch (_) {}
}

const speakNative = (text: string) => {
  if (!Speech) return;
  Speech.stop();
  Speech.speak(text, { language: 'pt-BR', rate: 0.75, pitch: 1.0 });
};

// ─── Hook principal ──────────────────────────────────────────────────────────
export function useAudio() {
  const applausePlayer = useAudioPlayer(require('../assets/audio/applause.mp3'));

  const speakText = (text: string) => {
    if (Platform.OS === 'web') speakWeb(text);
    else speakNative(text);
  };

  const stopSpeech = () => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    } else {
      if (Speech) Speech.stop();
    }
  };

  const playSuccess = async () => {
    // Apenas toca o som de sucesso sem falar 'Parabéns' repetidamente
    try {
      await applausePlayer.seekTo(0);
      applausePlayer.play();
    } catch (_) {}
  };

  const playError = () => speakText('Ops! Tente de novo!');
  const playCoin  = () => {};

  // Nomes das letras em português brasileiro
  const phoneticMap: Record<string, string> = {
    A: 'Á',  B: 'Bê', C: 'Cê',  D: 'Dê',    E: 'É',
    F: 'Efe', G: 'Gê', H: 'Agá', I: 'Í',     J: 'Jota',
    K: 'Cá', L: 'Ele', M: 'Eme', N: 'Ene',   O: 'Ô',
    P: 'Pê', Q: 'Quê', R: 'Erre', S: 'Esse', T: 'Tê',
    U: 'Ú',  V: 'Vê', W: 'Dábliu', X: 'Xis', Y: 'Ípsilon',
    Z: 'Zê',
  };

  const playPhoneme = (letter: string, _desc?: string) => {
    const sound = phoneticMap[letter.toUpperCase()] ?? letter;
    if (sound) speakText(sound);
  };

  return { playSuccess, playError, playCoin, playPhoneme, speakText, stopSpeech };
}
