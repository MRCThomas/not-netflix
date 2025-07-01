import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "../i18n/i18n";
import { useTheme } from "../contexts/ThemeContext";

const SettingsScreen = ({ navigation }) => {
  const { t, language, changeLanguage } = useTranslation(); // Fixed: destructure the correct properties
  const { theme, toggleTheme } = useTheme();
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return language || "en"; // Fixed: use language instead of i18n?.language
  });
  
  useEffect(() => {
    navigation.setOptions({
      headerTitle: t("settings.title"),
    });
  }, [navigation, t]);

  // Update currentLanguage when language changes
  useEffect(() => {
    setCurrentLanguage(language);
  }, [language]);

  const handleClearData = useCallback(async (key, titleKey, messageKey, successKey) => {
    Alert.alert(t(titleKey), t(messageKey), [
      {
        text: t("common.cancel"),
        style: "cancel",
      },
      {
        text: t("common.confirm"),
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem(key);
            Alert.alert(t(successKey));
          } catch (error) {
            console.error(`Error clearing ${key}:`, error);
            Alert.alert(t("common.error"), t("settings.clearError"));
          }
        },
      },
    ]);
  }, [t]);

  const clearFavorites = useCallback(() => {
    handleClearData(
      "favorites",
      "settings.clearFavoritesTitle",
      "settings.clearFavoritesMessage",
      "settings.favoritesCleared"
    );
  }, [handleClearData]);

  const clearSearchHistory = useCallback(() => {
    handleClearData(
      "searchHistory",
      "settings.clearHistoryTitle",
      "settings.clearHistoryMessage",
      "settings.historyCleared"
    );
  }, [handleClearData]);

  const handleLanguageChange = useCallback(async (lang) => {
    const success = await changeLanguage(lang); // Fixed: use the correct changeLanguage function
    if (success) {
      setCurrentLanguage(lang);
    }
  }, [changeLanguage]);

  const handleTMDBLink = useCallback(async () => {
    try {
      const supported = await Linking.canOpenURL("https://www.themoviedb.org/");
      if (supported) {
        await Linking.openURL("https://www.themoviedb.org/");
      } else {
        Alert.alert(t("common.error"), t("settings.urlError"));
      }
    } catch (error) {
      console.error("Error opening URL:", error);
      Alert.alert(t("common.error"), t("settings.urlError"));
    }
  }, [t]);

  return (
    <View style={[styles.container, theme === "dark" && styles.darkContainer]}>
      {/* Appearance Section */}
      <View style={styles.section}>
        <Text
          style={[styles.sectionTitle, theme === "dark" && styles.darkText]}
        >
          {t("settings.appearance")}
        </Text>
        <View
          style={[
            styles.settingItem,
            theme === "dark" && styles.darkSettingItem,
          ]}
        >
          <View style={styles.settingInfo}>
            <Ionicons
              name={theme === "dark" ? "moon" : "sunny"}
              size={22}
              color={theme === "dark" ? "#fff" : "#000"}
            />
            <Text
              style={[styles.settingText, theme === "dark" && styles.darkText]}
            >
              {theme === "dark" ? t("settings.darkMode") : t("settings.lightMode")}
            </Text>
          </View>
          <Switch
            value={theme === "dark"}
            onValueChange={toggleTheme}
            trackColor={{ false: "#767570", true: "#4f4f4f" }}
            thumbColor={theme === "dark" ? "#f5dd4b" : "#f4f3f4"}
          />
        </View>
      </View>

      {/* Language Section */}
      <View style={styles.section}>
        <Text
          style={[styles.sectionTitle, theme === "dark" && styles.darkText]}
        >
          {t("settings.language")}
        </Text>
        {["en", "fr"].map((lang) => (
          <TouchableOpacity
            key={lang}
            style={[
              styles.languageOption,
              currentLanguage === lang && styles.selectedLanguage,
              theme === "dark" && styles.darkLanguageOption,
              currentLanguage === lang &&
                theme === "dark" &&
                styles.darkSelectedLanguage,
            ]}
            onPress={() => handleLanguageChange(lang)} // Fixed: use the handleLanguageChange function
          >
            <Text
              style={[styles.languageText, theme === "dark" && styles.darkText]}
            >
              {lang === "en" ? "English" : "Français"}
            </Text>
            {currentLanguage === lang && (
              <Ionicons
                name="checkmark"
                size={20}
                color={theme === "dark" ? "#fff" : "#000"}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Data Management Section */}
      <View style={styles.section}>
        <Text
          style={[styles.sectionTitle, theme === "dark" && styles.darkText]}
        >
          {t("settings.dataManagement")}
        </Text>
        <TouchableOpacity
          style={[
            styles.settingItem,
            theme === "dark" && styles.darkSettingItem,
          ]}
          onPress={clearFavorites}
        >
          <View style={styles.settingInfo}>
            <Ionicons
              name="trash-outline"
              size={22}
              color={theme === "dark" ? "#fff" : "#000"}
            />
            <Text
              style={[styles.settingText, theme === "dark" && styles.darkText]}
            >
              {t("settings.clearFavorites")}
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme === "dark" ? "#fff" : "#666"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.settingItem,
            theme === "dark" && styles.darkSettingItem,
          ]}
          onPress={clearSearchHistory}
        >
          <View style={styles.settingInfo}>
            <Ionicons
              name="time-outline"
              size={22}
              color={theme === "dark" ? "#fff" : "#000"}
            />
            <Text
              style={[styles.settingText, theme === "dark" && styles.darkText]}
            >
              {t("settings.clearSearchHistory")}
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme === "dark" ? "#fff" : "#666"}
          />
        </TouchableOpacity>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text
          style={[styles.sectionTitle, theme === "dark" && styles.darkText]}
        >
          {t("settings.about")}
        </Text>
        <View
          style={[
            styles.settingItem,
            theme === "dark" && styles.darkSettingItem,
          ]}
        >
          <View style={styles.settingInfo}>
            <Ionicons
              name="information-circle-outline"
              size={22}
              color={theme === "dark" ? "#fff" : "#000"}
            />
            <Text
              style={[styles.settingText, theme === "dark" && styles.darkText]}
            >
              {t("settings.version")}
            </Text>
          </View>
          <Text
            style={[styles.versionText, theme === "dark" && styles.darkText]}
          >
            1.0.0
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.settingItem,
            theme === "dark" && styles.darkSettingItem,
          ]}
          onPress={() => Linking.openURL("https://www.themoviedb.org/")}
        >
          <View style={styles.settingInfo}>
            <Ionicons
              name="film-outline"
              size={22}
              color={theme === "dark" ? "#fff" : "#000"}
            />
            <Text
              style={[styles.settingText, theme === "dark" && styles.darkText]}
            >
              {t("settings.attributionTMDB")}
            </Text>
          </View>
          <Ionicons
            name="open-outline"
            size={20}
            color={theme === "dark" ? "#fff" : "#666"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  section: {
    marginVertical: 12,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  darkText: {
    color: "#fff",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  darkSettingItem: {
    backgroundColor: "#2a2a2a",
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
    color: "#333",
  },
  versionText: {
    fontSize: 14,
    color: "#666",
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  darkLanguageOption: {
    backgroundColor: "#2a2a2a",
  },
  selectedLanguage: {
    backgroundColor: "#e6f7ff",
  },
  darkSelectedLanguage: {
    backgroundColor: "#003366",
  },
  languageText: {
    fontSize: 16,
  },
});

export default SettingsScreen;