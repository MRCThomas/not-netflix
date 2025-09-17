import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, RefreshControl } from "react-native";
import { getPopularMovies } from "../services/api";
import FilmList from "../components/FilmList";
import Loading from "../components/Loading";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "../i18n/i18n";

const HomeScreen = ({ navigation }) => {
  const [films, setFilms] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const { colors } = useTheme();
  const { t, language } = useTranslation();

  const fetchFilms = useCallback(
    async (pageNumber = 1, refresh = false) => {
      try {
        if (pageNumber === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }

        const data = await getPopularMovies(
          pageNumber,
          language === "fr" ? "fr-FR" : "en-US"
        );

        if (pageNumber === 1 || refresh) {
          setFilms(data?.results ?? []);
        } else {
          setFilms((prevFilms) => [...prevFilms, ...(data?.results ?? [])]);
        }

        setPage(pageNumber);
        setError(null);
      } catch (err) {
        console.error("Error fetching films:", err);
        setError(err.message);
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [language]
  );

  useEffect(() => {
    fetchFilms();
  }, [fetchFilms]);

  const handleLoadMore = () => {
    if (!loadingMore) {
      fetchFilms(page + 1);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchFilms(1, true);
  };

  const handleFilmPress = (movie) => {
    navigation.navigate("FilmDetail", {
      id: movie.id,
      title: movie.title,
    });
  };

  if (loading && !refreshing) {
    return <Loading message={t("common.loading")} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FilmList
        films={films}
        onFilmPress={handleFilmPress}
        onEndReached={handleLoadMore}
        loadingMore={loadingMore}
        noResultsMessage={error ? t("common.error") : t("home.noMovies")}
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

export default HomeScreen;
