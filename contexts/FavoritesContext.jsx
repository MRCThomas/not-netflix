import React, { createContext, useState, useContext, useEffect } from 'react';
import { getFavorites, addFavorite, removeFavorite } from '../services/storage';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      const storedFavorites = await getFavorites();
      setFavorites(storedFavorites);
      setLoading(false);
    };
    
    loadFavorites();
  }, []);

  const add = async (movie) => {
    const updatedFavorites = await addFavorite(movie);
    setFavorites(updatedFavorites);
    return true;
  };

  const remove = async (movieId) => {
    const updatedFavorites = await removeFavorite(movieId);
    setFavorites(updatedFavorites);
    return true;
  };

  const isFavorite = (movieId) => {
    return favorites.some(movie => movie.id === movieId);
  };

  const sortFavoritesByRating = () => {
    const sorted = [...favorites].sort((a, b) => b.vote_average - a.vote_average);
    setFavorites(sorted);
  };

  const value = {
    favorites,
    loading,
    add,
    remove,
    isFavorite,
    sortFavoritesByRating
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};