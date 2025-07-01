import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../i18n/i18n';

const GenreFilter = ({ genres, selectedGenres, onGenrePress }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  if (!genres || genres.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>{t('search.genres')}</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {genres.map((genre) => {
          const isSelected = selectedGenres.includes(genre.id);
          return (
            <TouchableOpacity
              key={genre.id}
              style={[
                styles.genreItem,
                { 
                  backgroundColor: isSelected ? colors.primary : colors.card,
                  borderColor: colors.border 
                }
              ]}
              onPress={() => onGenrePress(genre.id)}
            >
              <Text 
                style={[
                  styles.genreText, 
                  { color: isSelected ? '#fff' : colors.text }
                ]}
              >
                {genre.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  scrollContent: {
    paddingVertical: 5,
  },
  genreItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  genreText: {
    fontSize: 14,
  },
});

export default GenreFilter;