import * as SecureStore from 'expo-secure-store';
import { BookEntry } from '../types';

const STORAGE_KEY = 'book_entries';

export const saveEntries = async (entries: BookEntry[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(entries);
    await SecureStore.setItemAsync(STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving book entries:', error);
  }
};

export const loadEntries = async (): Promise<BookEntry[]> => {
  try {
    const jsonValue = await SecureStore.getItemAsync(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error loading book entries:', error);
    return [];
  }
};