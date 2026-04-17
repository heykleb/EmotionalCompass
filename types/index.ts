// Жанр книги
export interface Genre {
  id: string;
  emoji: string;
  label: string;
  color: string;
}

// Запись о книге
export interface BookEntry {
  id: string;
  date: string;
  genre: Genre;
  title: string;
  author: string;
  rating: number;        // 1-5 звёзд
  review: string;
  image?: string | null;
}

// Совет от AI
export interface Advice {
  text: string;
  genreId: string;
  timestamp: string;
}

export type NewBookEntry = Omit<BookEntry, 'id' | 'date'>;