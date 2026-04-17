import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GENRES } from '../constants/genres';

interface StatsChartProps {
  stats: {
    total: number;
    mostCommonGenre: string;
    averageRating: number;
    genreDistribution: Record<string, number>;
    weeklyTrend: { day: string; genre: string }[];
    topAuthors: Record<string, number>;
  };
}

export const StatsChart: React.FC<StatsChartProps> = ({ stats }) => {
  const total = Object.values(stats.genreDistribution).reduce((a, b) => a + b, 0);

  const getGenreEmoji = (genreId: string) => {
    const genre = GENRES.find(g => g.id === genreId);
    return genre?.emoji || '📚';
  };

  const getGenreColor = (genreId: string) => {
    const genre = GENRES.find(g => g.id === genreId);
    return genre?.color || '#666666';
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>📊 Моя читательская статистика</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Прочитано книг</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statEmoji}>{getGenreEmoji(stats.mostCommonGenre)}</Text>
            <Text style={styles.statLabel}>Любимый жанр</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.averageRating}</Text>
            <Text style={styles.statLabel}>Средняя оценка</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>📈 Тренд недели</Text>
        <View style={styles.trendContainer}>
          {stats.weeklyTrend.map((day, i) => (
            <View key={i} style={styles.trendDay}>
              <Text style={styles.trendDayLabel}>{day.day}</Text>
              <Text style={styles.trendEmoji}>{day.genre}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>📚 По жанрам</Text>
        {Object.entries(stats.genreDistribution).map(([genreId, count]) => {
          const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <View key={genreId} style={styles.barItem}>
              <View style={styles.barLabel}>
                <Text style={styles.barEmoji}>{getGenreEmoji(genreId)}</Text>
                <Text style={styles.barText}>{GENRES.find(g => g.id === genreId)?.label || genreId}</Text>
                <Text style={styles.barCount}>{count} ({percentage}%)</Text>
              </View>
              <View style={styles.barBackground}>
                <View style={[styles.barFill, { width: `${percentage}%`, backgroundColor: getGenreColor(genreId) }]} />
              </View>
            </View>
          );
        })}

        {Object.keys(stats.topAuthors).length > 0 && (
          <>
            <Text style={styles.sectionTitle}>✍️ Любимые авторы</Text>
            {Object.entries(stats.topAuthors).map(([author, count]) => (
              <View key={author} style={styles.authorItem}>
                <Text style={styles.authorEmoji}>📝</Text>
                <Text style={styles.authorName}>{author}</Text>
                <Text style={styles.authorCount}>{count} {getDeclension(count, 'книга', 'книги', 'книг')}</Text>
              </View>
            ))}
          </>
        )}

        <View style={styles.motivationCard}>
          <Text style={styles.motivationEmoji}>🏆</Text>
          <View style={styles.motivationTextContainer}>
            <Text style={styles.motivationTitle}>Ваш прогресс!</Text>
            <Text style={styles.motivationText}>
              {stats.total === 0 
                ? 'Добавьте первую книгу, чтобы начать статистику!'
                : `Вы прочитали ${stats.total} ${getDeclension(stats.total, 'книгу', 'книги', 'книг')}! Отличный результат! 🌟`}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

function getDeclension(count: number, one: string, two: string, five: string): string {
  const n = Math.abs(count);
  const lastDigit = n % 10;
  const lastTwoDigits = n % 100;
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return five;
  }
  if (lastDigit === 1) {
    return one;
  }
  if (lastDigit >= 2 && lastDigit <= 4) {
    return two;
  }
  return five;
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 30,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333333',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  statBox: {
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    minWidth: 100,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
  },
  statEmoji: {
    fontSize: 32,
  },
  statLabel: {
    fontSize: 11,
    color: '#888888',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginTop: 20,
    marginBottom: 12,
  },
  trendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    padding: 16,
  },
  trendDay: {
    alignItems: 'center',
  },
  trendDayLabel: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 8,
  },
  trendEmoji: {
    fontSize: 28,
  },
  barItem: {
    marginBottom: 16,
  },
  barLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  barEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  barText: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  barCount: {
    fontSize: 12,
    color: '#888888',
  },
  barBackground: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  authorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  authorEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  authorName: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
  },
  authorCount: {
    fontSize: 12,
    color: '#888888',
  },
  motivationCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    padding: 16,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  motivationEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  motivationTextContainer: {
    flex: 1,
  },
  motivationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  motivationText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
});