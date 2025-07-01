import { API_KEY, BASE_URL } from '../constants/config';

// Fonction pour obtenir les films populaires
export const getPopularMovies = async (page = 1, language = 'fr-FR') => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=${language}&page=${page}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des films populaires:', error);
    throw error;
  }
};

// Fonction pour rechercher des films
export const searchMovies = async (query, page = 1, language = 'fr-FR') => {
  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=${language}&query=${encodeURIComponent(query)}&page=${page}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la recherche de films:', error);
    throw error;
  }
};

// Fonction pour obtenir les détails d'un film
export const getMovieDetails = async (movieId, language = 'fr-FR') => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=${language}&append_to_response=videos,credits`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du film:', error);
    throw error;
  }
};

// Fonction pour obtenir la liste des genres
export const getGenres = async (language = 'fr-FR') => {
  try {
    const response = await fetch(
      `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=${language}`
    );
    const data = await response.json();
    return data.genres;
  } catch (error) {
    console.error('Erreur lors de la récupération des genres:', error);
    throw error;
  }
};

// Fonction pour obtenir les films par genre
export const getMoviesByGenre = async (genreId, page = 1, language = 'fr-FR') => {
  try {
    const response = await fetch(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=${language}&with_genres=${genreId}&page=${page}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des films par genre:', error);
    throw error;
  }
};