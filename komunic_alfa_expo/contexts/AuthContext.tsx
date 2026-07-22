import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserRole = 'crianca' | 'adulto';

interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
  secretCode?: string; // Para crianças, ex: "🐶🐱🐦"
  email?: string;      // Para adultos
}

interface AuthContextType {
  user: User | null;
  usersList: User[];
  login: (id: string, secret?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  registerChild: (name: string, avatar: string, secretCode: string) => Promise<void>;
  registerAdult: (name: string, email: string, pass: string) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storedUsers = await AsyncStorage.getItem('@komunic_users');
      if (storedUsers) setUsersList(JSON.parse(storedUsers));

      const currentUser = await AsyncStorage.getItem('@komunic_current_user');
      if (currentUser) setUser(JSON.parse(currentUser));
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (id: string, secret?: string) => {
    const found = usersList.find(u => u.id === id);
    if (!found) return false;
    
    // Adultos podem pular a checagem de secret nesse mock simples ou checar a senha se estivesse armazenada segura
    if (found.role === 'crianca' && found.secretCode !== secret) {
      return false; // Senha incorreta
    }

    setUser(found);
    await AsyncStorage.setItem('@komunic_current_user', JSON.stringify(found));
    return true;
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('@komunic_current_user');
  };

  const registerChild = async (name: string, avatar: string, secretCode: string) => {
    const newUser: User = { id: Date.now().toString(), name, role: 'crianca', avatar, secretCode };
    const updated = [...usersList, newUser];
    setUsersList(updated);
    await AsyncStorage.setItem('@komunic_users', JSON.stringify(updated));
    // Login automático
    setUser(newUser);
    await AsyncStorage.setItem('@komunic_current_user', JSON.stringify(newUser));
  };

  const registerAdult = async (name: string, email: string, pass: string) => {
    // Salvamos a senha no secretCode apenas para o mock funcionar
    const newUser: User = { id: Date.now().toString(), name, role: 'adulto', email, secretCode: pass };
    const updated = [...usersList, newUser];
    setUsersList(updated);
    await AsyncStorage.setItem('@komunic_users', JSON.stringify(updated));
    // Login automático
    setUser(newUser);
    await AsyncStorage.setItem('@komunic_current_user', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ user, usersList, login, logout, registerChild, registerAdult, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
