import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Advice, BookEntry } from '../types';

interface BookState {
  entries: BookEntry[];
  adviceHistory: Advice[];
  addEntry: (entry: BookEntry) => void;
  deleteEntry: (id: string) => void;
  addAdvice: (advice: Advice) => void;
  getStats: () => {
    total: number;
    totalPages?: number;
    mostCommonGenre: string;
    averageRating: number;
    genreDistribution: Record<string, number>;
    weeklyTrend: { day: string; genre: string }[];
    topAuthors: Record<string, number>;
  };
}

export const useBookStore = create<BookState>()(
  persist(
    (set, get) => ({
      entries: [],
      adviceHistory: [],

      addEntry: (entry) => {
        set((state) => ({
          entries: [entry, ...state.entries]
        }));
      },

      deleteEntry: (id) => {
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id)
        }));
      },

      addAdvice: (advice) => {
        set((state) => ({
          adviceHistory: [advice, ...state.adviceHistory].slice(0, 20)
        }));
      },

      getStats: () => {
        const { entries } = get();
        const total = entries.length;
        
        // Распределение по жанрам
        const genreCount: Record<string, number> = {};
        // Распределение по авторам
        const authorCount: Record<string, number> = {};
        // Сумма оценок
        let totalRating = 0;
        
        entries.forEach((entry) => {
          genreCount[entry.genre.id] = (genreCount[entry.genre.id] || 0) + 1;
          authorCount[entry.author] = (authorCount[entry.author] || 0) + 1;
          totalRating += entry.rating;
        });
        
        // Самый частый жанр
        let mostCommonGenre = 'fiction';
        let maxCount = 0;
        Object.entries(genreCount).forEach(([genreId, count]) => {
          if (count > maxCount) {
            maxCount = count;
            mostCommonGenre = genreId;
          }
        });
        
        // Средняя оценка
        const averageRating = total > 0 ? totalRating / total : 0;
        
        // Тренд недели
        const last7Days = [...Array(7)].map((_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return date.toISOString().split('T')[0];
        }).reverse();
        
        const weeklyTrend = last7Days.map((day) => {
          const entry = entries.find((e) => e.date.split('T')[0] === day);
          return {
            day: day.slice(5),
            genre: entry?.genre.emoji || '📚'
          };
        });
        
        return {
          total,
          mostCommonGenre,
          averageRating: Math.round(averageRating * 10) / 10,
          genreDistribution: genreCount,
          weeklyTrend,
          topAuthors: Object.fromEntries(
            Object.entries(authorCount).sort((a, b) => b[1] - a[1]).slice(0, 5)
          )
        };
      }
    }),
    {
      name: 'book-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);