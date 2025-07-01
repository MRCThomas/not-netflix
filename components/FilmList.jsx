import React from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import FilmCard from './FilmCard';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../i18n/i18n';

const FilmList = ({ 
  films, 
  onFilmPress, 
  loading = false, 
  onEndReached = null, 
  loadingMore = false,
  noResultsMessage = null,
  ListHeaderComponent = null,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.footerContainer}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  const renderEmptyComponent = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.text }]}>
          {noResultsMessage || t('home.noMovies')}
        </Text>
      </View>
    );
  };

  return (
    <FlatList
      data={films}
      renderItem={({ item }) => (
        <FilmCard movie={item} onPress={onFilmPress} />
      )}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContainer}
      numColumns={2}
      columnWrapperStyle={styles.columnWrapper}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmptyComponent}
      ListHeaderComponent={ListHeaderComponent}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 8,
    paddingBottom: 20,
    flexGrow: 1,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  footerContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  }
});

export default FilmList;