import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IMAGE_BASE_URL, POSTER_SIZE } from '../constants/config';
import { useTheme } from '../contexts/ThemeContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useTranslation } from '../i18n/i18n';

const FilmCard = ({ movie, onPress }) => {
  const { colors } = useTheme();
  const { isFavorite } = useFavorites();
  const { t } = useTranslation();

  const posterPath = movie.poster_path 
    ? `${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}`
    : 'https://www.shutterstock.com/image-vector/default-image-icon-vector-missing-600nw-2079504220.jpg';

  // Tronquer le titre s'il est trop long
  const title = movie.title.length > 20 
    ? movie.title.substring(0, 20) + '...' 
    : movie.title;

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => onPress(movie)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: posterPath }} style={styles.poster} />
      <View style={styles.overlay}>
        {isFavorite(movie.id) && (
          <View style={styles.favoriteIcon}>
            <Ionicons name="heart" size={24} color="red" />
          </View>
        )}
      </View>
      <View style={[styles.infoContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color={colors.rating} />
          <Text style={[styles.rating, { color: colors.text }]}>
            {movie.vote_average.toFixed(1)}
          </Text>
        </View>
        {movie.release_date && (
          <Text style={[styles.year, { color: colors.text }]}>
            {new Date(movie.release_date).getFullYear()}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 160,
    height: 280,
    borderRadius: 10,
    marginHorizontal: 8,
    marginVertical: 12,
    overflow: 'hidden',
    borderWidth: 1,
  },
  poster: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 8,
  },
  favoriteIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    padding: 8,
    height: 60,
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontSize: 12,
  },
  year: {
    fontSize: 12,
    marginTop: 2,
  },
});

export default FilmCard;