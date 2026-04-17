import { GENRES } from '@/constants/genres';
import { useBookStore } from '@/store/useBookStore';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function AdviceScreen() {
  const { adviceHistory } = useBookStore();

  const getGenreEmoji = (genreId: string) => {
    const genre = GENRES.find(g => g.id === genreId);
    return genre?.emoji || '📚';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderAdvice = ({ item, index }: { item: any; index: number }) => (
    <View style={styles.adviceCard}>
      <View style={styles.adviceHeader}>
        <Text style={styles.adviceNumber}>Совет #{index + 1}</Text>
        <Text style={styles.adviceDate}>{formatDate(item.timestamp)}</Text>
      </View>
      <View style={styles.adviceContent}>
        <Text style={styles.adviceEmoji}>{getGenreEmoji(item.genreId)}</Text>
        <Text style={styles.adviceText}>{item.text}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="#000000" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Назад</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>💡 Советы по книгам</Text>
        <View style={styles.placeholder} />
      </View>

      {adviceHistory.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📚</Text>
          <Text style={styles.emptyText}>Пока нет советов</Text>
          <Text style={styles.emptySubtext}>
            Добавьте первую книгу, чтобы получить персональный совет
          </Text>
        </View>
      ) : (
        <FlatList
          data={adviceHistory}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderAdvice}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 30,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#1a1a1a',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 60,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  adviceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  adviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  adviceNumber: {
    fontSize: 12,
    color: '#999',
  },
  adviceDate: {
    fontSize: 12,
    color: '#999',
  },
  adviceContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adviceEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  adviceText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
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
    textAlign: 'center',
  },
});