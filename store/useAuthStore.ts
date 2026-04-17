import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from 'firebase/auth';
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  loadStoredUser: () => Promise<void>;
  saveUser: (user: User | null) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,

  setUser: (user) => {
    set({ user, isLoading: false });
    get().saveUser(user);
  },

  loadStoredUser: async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        set({ user: JSON.parse(storedUser), isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
    }
  },

  saveUser: async (user) => {
    try {
      if (user) {
        const userToStore = { uid: user.uid, email: user.email };
        await AsyncStorage.setItem('user', JSON.stringify(userToStore));
      } else {
        await AsyncStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Error saving user:', error);
    }
  }
}));