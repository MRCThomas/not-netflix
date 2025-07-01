import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../i18n/i18n';
import { useFavorites } from '../contexts/FavoritesContext'; // Import du hook
import { API_KEY } from '../constants/config';

const FilmDetailScreen = ({ route, navigation }) => {
  const movieId = route?.params?.id || route?.params?.movieId;
  const parsedMovieId = movieId ? parseInt(movieId, 10) : null;
  
  if (!parsedMovieId) {
    console.warn('No movieId provided in route params');
    navigation.goBack();
    return;
  }

  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t, language } = useTranslation();
  
  // Utilisation du context des favoris
  const { favorites, add, remove, isFavorite: checkIsFavorite } = useFavorites();
  const isFavorite = checkIsFavorite(parsedMovieId);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!movieId) {
        console.error('No movie ID provided');
        setLoading(false);
        return;
      }

      try {
        const apiLanguage = language === 'fr' ? 'fr-FR' : 'en-US';
        
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=${apiLanguage}&append_to_response=videos,credits`
        );
        
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        setMovie(data);

        const trailerVideo = data.videos?.results.find(
          (video) => video.type === 'Trailer' && video.site === 'YouTube'
        );
        setTrailer(trailerVideo);

      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId, language]);

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await remove(movie.id);
      } else {
        const movieToAdd = {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          vote_average: movie.vote_average,
          release_date: movie.release_date,
        };
        await add(movieToAdd);
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  const openTrailer = () => {
    if (trailer) {
      Linking.openURL(`https://www.youtube.com/watch?v=${trailer.key}`);
    }
  };

  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {movieId ? t('movieDetail.error') : t('movieDetail.noId')}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Backdrop Image */}
      <View style={styles.backdropContainer}>
        <Image
          source={{
            uri: movie.backdrop_path
              ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
              : 'https://via.placeholder.com/780x439'
          }}
          style={styles.backdropImage}
        />
      </View>

      {/* Movie Info */}
      <View style={styles.infoContainer}>
        <View style={styles.posterContainer}>
          <Image
            source={{
              uri: movie.poster_path
                ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
                : 'https://via.placeholder.com/342x513'
            }}
            style={styles.posterImage}
          />
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{movie.title}</Text>
          
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={20} color="#FFD700" />
            <Text style={styles.rating}>{movie.vote_average ? movie.vote_average.toFixed(1) : '0'}/10</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.releaseDate}>
              {movie.release_date ? new Date(movie.release_date).getFullYear() : t('movieDetail.unknown')}
            </Text>
            {movie.runtime && (
              <Text style={styles.runtime}>{formatRuntime(movie.runtime)}</Text>
            )}
          </View>

          <View style={styles.genresContainer}>
            {movie.genres?.map((genre) => (
              <View key={genre.id} style={styles.genreBadge}>
                <Text style={styles.genreText}>{genre.name}</Text>
              </View>
            ))}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.favoriteButton} 
              onPress={toggleFavorite}
            >
              <Ionicons 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={20} 
                color={isFavorite ? "#ff6b6b" : "#333"} 
              />
              <Text style={styles.buttonText}>
                {isFavorite ? t('movieDetail.removeFavorite') : t('movieDetail.addFavorite')}
              </Text>
            </TouchableOpacity>

            {trailer && (
              <TouchableOpacity 
                style={styles.trailerButton} 
                onPress={openTrailer}
              >
                <Ionicons name="play" size={20} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Synopsis */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{t('movieDetail.synopsis')}</Text>
        <Text style={styles.overview}>
          {movie.overview || t('movieDetail.noOverview')}
        </Text>
      </View>

      {/* Cast */}
      {movie?.credits?.cast?.length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('movieDetail.cast')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.castContainer}>
            {movie.credits.cast.slice(0, 10).map((person) => (
              <View key={person.id} style={styles.castItem}>
                <Image
                  source={{
                    uri: person.profile_path
                      ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                      : 'https://via.placeholder.com/185x278'
                  }}
                  style={styles.castImage}
                />
                <Text style={styles.castName} numberOfLines={1}>
                  {person.name}
                </Text>
                <Text style={styles.characterName} numberOfLines={1}>
                  {person.character}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  backdropContainer: {
    position: 'relative',
    height: 200,
    width: '100%',
  },
  backdropImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  posterContainer: {
    marginRight: 16,
  },
  posterImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  releaseDate: {
    marginRight: 16,
    fontSize: 14,
    color: '#666',
  },
  runtime: {
    fontSize: 14,
    color: '#666',
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  genreBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    fontSize: 12,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
  },
  trailerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF0000',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  buttonText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#333',
  },
  trailerButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: 'white',
  },
  sectionContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  overview: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  castContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  castItem: {
    width: 100,
    marginRight: 12,
  },
  castImage: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginBottom: 4,
  },
  castName: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  characterName: {
    fontSize: 11,
    color: '#666',
  },
});

export default FilmDetailScreen;