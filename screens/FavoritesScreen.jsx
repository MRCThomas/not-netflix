import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import FilmList from '../components/FilmList';
import { useTheme } from '../contexts/ThemeContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useTranslation } from '../i18n/i18n';
import { Ionicons } from '@expo/vector-icons';

const FavoritesScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { favorites, sortFavoritesByRating } = useFavorites();
  const { t } = useTranslation();
  const [isSorted, setIsSorted] = useState(false);

  const handleFilmPress = (movie) => {
    navigation.navigate('FilmDetail', { 
      id: movie.id,
      title: movie.title 
    });
  };

  const handleSort = () => {
    sortFavoritesByRating();
    setIsSorted(!isSorted);
  };

  // En-tête de la liste avec le bouton de tri
  const renderListHeader = () => {
    if (favorites.length === 0) return null;
    
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={[styles.sortButton, { backgroundColor: colors.primary }]}
          onPress={handleSort}
        >
          <Ionicons 
            name={isSorted ? "swap-vertical" : "star"}
            size={18} 
            color="#fff" 
          />
          <Text style={styles.sortButtonText}>{t('favorites.sortByRating')}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FilmList
        films={favorites}
        onFilmPress={handleFilmPress}
        noResultsMessage={t('favorites.noFavorites')}
        ListHeaderComponent={renderListHeader()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    padding: 16,
    alignItems: 'flex-end',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sortButtonText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 14,
  },
});

export default FavoritesScreen;