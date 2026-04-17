import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { GENRES } from '../constants/genres';
import { Genre, NewBookEntry } from '../types';

interface BookEntryProps {
  onSave: (entry: NewBookEntry) => void;
}

export const BookEntry: React.FC<BookEntryProps> = ({ onSave }) => {
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requestPermissions = async (): Promise<boolean> => {
    if (Platform.OS === 'web') return true;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted' || cameraStatus.status !== 'granted') {
      Alert.alert(
        'Разрешение отклонено',
        'Приложению нужен доступ к камере и галерее для фото обложки.',
        [
          { text: 'OK' },
          {
            text: 'Настройки',
            onPress: () => Linking.openSettings()
          }
        ]
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.5,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить изображение');
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.5,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сделать фото');
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      'Добавить фото обложки',
      'Выберите источник',
      [
        { text: 'Камера', onPress: takePhoto },
        { text: 'Галерея', onPress: pickImage },
        { text: 'Отмена', style: 'cancel' }
      ]
    );
  };

  const handleSave = async () => {
    if (!selectedGenre) {
      Alert.alert('Ошибка', 'Выберите жанр книги');
      return;
    }
    if (!title.trim()) {
      Alert.alert('Ошибка', 'Введите название книги');
      return;
    }
    if (!author.trim()) {
      Alert.alert('Ошибка', 'Введите имя автора');
      return;
    }
    if (rating === 0) {
      Alert.alert('Ошибка', 'Поставьте оценку книге');
      return;
    }
    if (!review.trim()) {
      Alert.alert('Ошибка', 'Напишите рецензию');
      return;
    }

    setIsSubmitting(true);
    
    onSave({
      genre: selectedGenre,
      title: title.trim(),
      author: author.trim(),
      rating,
      review: review.trim(),
      image
    });

    setSelectedGenre(null);
    setTitle('');
    setAuthor('');
    setRating(0);
    setReview('');
    setImage(null);
    setIsSubmitting(false);
    
    Alert.alert('Успех!', 'Книга добавлена в читательский дневник');
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Text style={[styles.star, rating >= star && styles.starActive]}>
              {rating >= star ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📚 Добавить книгу</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.genresScroll}>
        <View style={styles.genresContainer}>
          {GENRES.map((genre) => (
            <TouchableOpacity
              key={genre.id}
              style={[
                styles.genreButton,
                selectedGenre?.id === genre.id && styles.genreButtonSelected
              ]}
              onPress={() => setSelectedGenre(genre)}
            >
              <View style={[styles.genreGradient, { backgroundColor: genre.color }]}>
                <Text style={styles.genreEmoji}>{genre.emoji}</Text>
                <Text style={styles.genreLabel}>{genre.label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TextInput
        style={styles.input}
        placeholder="Название книги"
        placeholderTextColor="#999"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Автор"
        placeholderTextColor="#999"
        value={author}
        onChangeText={setAuthor}
      />

      <View style={styles.ratingSection}>
        <Text style={styles.ratingLabel}>Моя оценка:</Text>
        {renderStars()}
      </View>

      <TextInput
        style={styles.reviewInput}
        placeholder="Моя рецензия..."
        placeholderTextColor="#999"
        multiline
        numberOfLines={4}
        value={review}
        onChangeText={setReview}
      />

      <View style={styles.imageSection}>
        <TouchableOpacity style={styles.imageButton} onPress={showImagePickerOptions}>
          <Text style={styles.imageButtonText}>📷 Добавить фото обложки</Text>
        </TouchableOpacity>

        {image && (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: image }} style={styles.imagePreview} />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => setImage(null)}
            >
              <Text style={styles.removeImageText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[styles.saveButton, isSubmitting && styles.disabledButton]}
        onPress={handleSave}
        disabled={isSubmitting}
      >
        <View style={styles.saveGradient}>
          <Text style={styles.saveButtonText}>
            {isSubmitting ? 'Сохранение...' : '✨ Сохранить в дневник ✨'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f8f8',
    borderRadius: 30,
    padding: 24,
    margin: 16,
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
    color: '#333',
  },
  genresScroll: {
    flexGrow: 0,
  },
  genresContainer: {
    flexDirection: 'row',
    paddingBottom: 10,
  },
  genreButton: {
    marginRight: 12,
    borderRadius: 20,
    overflow: 'hidden',  
  },
  genreButtonSelected: {
    transform: [{ scale: 1.05 }],
    borderWidth: 3,
    borderColor: '#4CAF50',  // Зелёная обводка
    borderRadius: 20,
  },
  genreGradient: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 20,
    minWidth: 70,
  },
  genreEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  genreLabel: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    marginTop: 12,
    color: '#333',
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  ratingLabel: {
    fontSize: 16,
    color: '#333',
    marginRight: 12,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 28,
    color: '#ccc',
    marginHorizontal: 4,
  },
  starActive: {
    color: '#FFD700',
  },
  reviewInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginTop: 16,
    marginBottom: 16,
    color: '#333',
  },
  imageSection: {
    marginBottom: 20,
  },
  imageButton: {
    backgroundColor: '#f0f0f0',
    padding: 14,
    borderRadius: 20,
    alignItems: 'center',
  },
  imageButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  imagePreviewContainer: {
    marginTop: 12,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 16,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  saveGradient: {
    backgroundColor: '#333',
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.6,
  },
});