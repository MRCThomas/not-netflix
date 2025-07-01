import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, RefreshControl } from 'react-native';
import { searchMovies, getGenres, getMoviesByGenre } from '../services/api';
import FilmList from '../components/FilmList';
import SearchBar from '../components/SearchBar';
import GenreFilter from '../components/GenreFilter';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../i18n/i18n';

const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [films, setFilms] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const { colors } = useTheme();
  const { t, language } = useTranslation();

  // Récupérer la liste des genres
  const fetchGenres = useCallback(async () => {
    try {
      const genresData = await getGenres(language === 'fr' ? 'fr-FR' : 'en-US');
      setGenres(genresData);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  }, [language]);

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  // Fonction de recherche
  const handleSearch = async (pageNumber = 1, refresh = false) => {
    if (!query.trim() && selectedGenres.length === 0) {
      setFilms([]);
      return;
    }

    try {
      if (pageNumber === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      let data;
      const langParam = language === 'fr' ? 'fr-FR' : 'en-US';

      // Si des genres sont sélectionnés mais pas de query, recherche par genre
      if (selectedGenres.length > 0 && !query.trim()) {
        data = await getMoviesByGenre(selectedGenres.join(','), pageNumber, langParam);
      } 
      // Si une query est présente, recherche par query
      else if (query.trim()) {
        data = await searchMovies(query, pageNumber, langParam);
      }

      if (data) {
        if (pageNumber === 1 || refresh) {
          setFilms(data.results);
        } else {
          setFilms(prevFilms => [...prevFilms, ...data.results]);
        }
        setPage(pageNumber);
      }
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  // Gérer le changement de texte dans la barre de recherche
  const handleChangeText = (text) => {
    setQuery(text);
    if (text.trim() === '') {
      // Si la barre de recherche est vide et qu'aucun genre n'est sélectionné, réinitialiser les films
      if (selectedGenres.length === 0) {
        setFilms([]);
      } else {
        // Sinon, rechercher par genre uniquement
        setPage(1);
        handleSearch(1);
      }
    }
  };

  // Soumettre la recherche
  const handleSubmitSearch = () => {
    setPage(1);
    handleSearch(1);
  };

  // Effacer la recherche
  const handleClearSearch = () => {
    setQuery('');
    if (selectedGenres.length === 0) {
      setFilms([]);
    } else {
      setPage(1);
      handleSearch(1);
    }
  };

  // Gestion des genres
  const handleGenrePress = (genreId) => {
    setSelectedGenres(prev => {
      const newSelectedGenres = prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId];
      
      // Mettre à jour la recherche avec les nouveaux genres sélectionnés
      setTimeout(() => {
        setPage(1);
        handleSearch(1);
      }, 0);
      
      return newSelectedGenres;
    });
  };

  // Charger plus de résultats
  const handleLoadMore = () => {
    if (!loadingMore && films.length > 0) {
      handleSearch(page + 1);
    }
  };

  // Rafraîchir les résultats
  const handleRefresh = () => {
    setRefreshing(true);
    handleSearch(1, true);
  };

  // Navigation vers les détails d'un film
  const handleFilmPress = (movie) => {
    navigation.navigate('FilmDetail', { 
      id: movie.id,
      title: movie.title 
    });
  };

  // En-tête de la liste avec la barre de recherche et le filtre de genres
  const renderListHeader = () => (
    <View>
      <SearchBar
        value={query}
        onChangeText={handleChangeText}
        onSubmit={handleSubmitSearch}
        onClear={handleClearSearch}
      />
      <GenreFilter
        genres={genres}
        selectedGenres={selectedGenres}
        onGenrePress={handleGenrePress}
      />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FilmList
        films={films}
        onFilmPress={handleFilmPress}
        onEndReached={handleLoadMore}
        loadingMore={loadingMore}
        loading={loading}
        noResultsMessage={t('search.noResults')}
        ListHeaderComponent={renderListHeader()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SearchScreen;