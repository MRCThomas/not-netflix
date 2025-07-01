import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './navigation/AppNavigator';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { I18nProvider } from './i18n/i18n';

export default function App() {
  return (
    <NavigationContainer>
      <ThemeProvider>
        <I18nProvider>
          <FavoritesProvider>
            <StatusBar style="auto" />
            <AppNavigator />
          </FavoritesProvider>
        </I18nProvider>
      </ThemeProvider>
    </NavigationContainer>
  );
}