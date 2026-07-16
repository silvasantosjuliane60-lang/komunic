import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// TODO: O aluno de mestrado deve substituir estas chaves pelo seu próprio projeto do Firebase
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "komunic-alfa.firebaseapp.com",
  projectId: "komunic-alfa",
  storageBucket: "komunic-alfa.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta as instâncias de Autenticação e Banco de Dados (Firestore)
export const auth = getAuth(app);
export const db = getFirestore(app);

/**
 * SERVIÇOS FALSOS (MOCK) PARA TESTE NO EXPO GO
 * Como as chaves acima são ilustrativas, usaremos essas funções
 * para simular o comportamento do banco de dados na tela.
 */

export const mockSignIn = async (email, password) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ user: { uid: 'mock_uid_123', email } });
    }, 1000);
  });
};

export const mockSaveChildProgress = async (childId, worldId) => {
  console.log(`[Banco de Dados Falso] Progresso Salvo! Criança ${childId} desbloqueou o Mundo ${worldId}`);
  return true;
};
