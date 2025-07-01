import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@movie_catalogue:favorites';
const THEME_KEY = '@movie_catalogue:theme';
const LANGUAGE_KEY = '@movie_catalogue:language';

export const getFavorites = async () => {
  try {
    const favoritesJson = await AsyncStorage.getItem(FAVORITES_KEY);
    return favoritesJson ? JSON.parse(favoritesJson) : [];
  } catch (error) {
    console.error('Erreur lors de la récupération des favoris:', error);
    return [];
  }
};

export const addFavorite = async (movie) => {
  try {
    const favorites = await getFavorites();
    
    const isAlreadyFavorite = favorites.some(fav => fav.id === movie.id);
    if (isAlreadyFavorite) {
      console.log('Film déjà dans les favoris');
      return favorites;
    }
    
    const updatedFavorites = [...favorites, movie];
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    return updatedFavorites;
  } catch (error) {
    console.error('Erreur lors de l\'ajout aux favoris:', error);
    throw error;
  }
};

export const removeFavorite = async (movieId) => {
  try {
    const favorites = await getFavorites();
    const updatedFavorites = favorites.filter(movie => movie.id !== movieId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    return updatedFavorites;
  } catch (error) {
    console.error('Erreur lors de la suppression des favoris:', error);
    throw error;
  }
};

export const isFavorite = async (movieId) => {
  try {
    const favorites = await getFavorites();
    return favorites.some(movie => movie.id === movieId);
  } catch (error) {
    console.error('Erreur lors de la vérification des favoris:', error);
    return false;
  }
};

export const getTheme = async () => {
  try {
    const theme = await AsyncStorage.getItem(THEME_KEY);
    return theme || 'light';
  } catch (error) {
    console.error('Erreur lors de la récupération du thème:', error);
    return 'light';
  }
};

export const setTheme = async (theme) => {
  try {
    await AsyncStorage.setItem(THEME_KEY, theme);
    return theme;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du thème:', error);
    throw error;
  }
};

export const getLanguage = async () => {
  try {
    const language = await AsyncStorage.getItem(LANGUAGE_KEY);
    return language || 'fr';
  } catch (error) {
    console.error('Erreur lors de la récupération de la langue:', error);
    return 'fr';
  }
};

export const setLanguage = async (language) => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
    return language;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la langue:', error);
    throw error;
  }
};