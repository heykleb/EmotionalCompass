import { BookEntry } from '@/components/BookEntry';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/useAuthStore';
import { useBookStore } from '@/store/useBookStore';
import { BookEntry as BookEntryType, NewBookEntry } from '@/types';
import { getAdviceForGenre } from '@/utils/aiAdvice';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
    Alert,
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function HomeScreen() {
  const { user } = useAuthStore();
  const { logOut } = useAuth();
  const { entries, addEntry, deleteEntry, addAdvice } = useBookStore();

  const handleSaveEntry = async (entryData: NewBookEntry) => {
    const newEntry: BookEntryType = {
      ...entryData,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    
    addEntry(newEntry);
    
    const advice = await getAdviceForGenre(entryData.genre);
    addAdvice({
      text: advice,
      genreId: entryData.genre.id,
      timestamp: new Date().toISOString()
    });
    
    Alert.alert('Успех!', 'Книга добавлена в дневник!');
  };

  const handleDeleteEntry = (id: string) => {
    Alert.alert(
      'Удаление',
      'Удалить эту запись?',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Удалить', style: 'destructive', onPress: () => deleteEntry(id) }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Сегодня';
    if (days === 1) return 'Вчера';
    if (days < 7) return `${days} дня назад`;
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Выход',
      'Вы уверены, что хотите выйти?',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Выйти', 
          style: 'destructive', 
          onPress: async () => {
            await logOut();
            router.replace('/login');
          }
        }
      ]
    );
  };

  const renderEntry = ({ item }: { item: BookEntryType }) => (
    <View style={styles.entryCard}>
      <View style={styles.entryHeader}>
        <View style={[styles.genreCircle, { backgroundColor: item.genre.color }]}>
          <Text style={styles.genreEmoji}>{item.genre.emoji}</Text>
        </View>
        <View style={styles.entryInfo}>
          <Text style={styles.entryDate}>{formatDate(item.date)}</Text>
          <Text style={styles.bookTitle}>{item.title}</Text>
          <Text style={styles.bookAuthor}>{item.author}</Text>
        </View>
        <TouchableOpacity onPress={() => handleDeleteEntry(item.id)} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingLabel}>Оценка:</Text>
        <Text style={styles.ratingStars}>{renderStars(item.rating)}</Text>
      </View>
      
      <Text style={styles.reviewText}>{item.review}</Text>
      
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.entryImage} />
      )}
    </View>
  );

  if (!user) return null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#000000" />
      
      {/* Хедер */}
      <LinearGradient
        colors={['#1a1a1a', '#0d0d0d']}
        style={styles.header}
      >
        <View style={styles.logoutRow}>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>🚪 Выйти</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>📚 Читательский дневник</Text>
            <Text style={styles.userEmail}>{user.email?.split('@')[0] || 'Читатель'}</Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={() => router.push('/stats')} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>📊</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/advice')} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>💡</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/settings')} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Отдельная строка "Мои книги" */}
      <View style={styles.myBooksRow}>
        <Text style={styles.myBooksText}>Мои книги</Text>
      </View>

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<BookEntry onSave={handleSaveEntry} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📚</Text>
            <Text style={styles.emptyText}>Пока нет книг</Text>
            <Text style={styles.emptySubtext}>
              Добавьте первую прочитанную книгу
            </Text>
          </View>
        }
        renderItem={renderEntry}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 12,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logoutRow: {
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  greeting: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  userEmail: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  headerButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonText: {
    fontSize: 18,
  },
  // Новая отдельная строка "Мои книги"
  myBooksRow: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 12,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  myBooksText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  listContent: {
    paddingBottom: 20,
  },
  entryCard: {
    margin: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  genreCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  genreEmoji: {
    fontSize: 32,
  },
  entryInfo: {
    flex: 1,
  },
  entryDate: {
    fontSize: 11,
    color: '#999',
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
  },
  bookAuthor: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    fontSize: 18,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  ratingLabel: {
    fontSize: 13,
    color: '#666',
    marginRight: 8,
  },
  ratingStars: {
    fontSize: 16,
    color: '#FFD700',
    letterSpacing: 2,
  },
  reviewText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 12,
  },
  entryImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});