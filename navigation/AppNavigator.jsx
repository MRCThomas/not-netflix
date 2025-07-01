import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Screens
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import FilmDetailScreen from '../screens/FilmDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Contexts
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../i18n/i18n';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Fonction pour créer le stack de navigation pour chaque tab
const HomeStack = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: t('home.title') }} 
      />
      <Stack.Screen 
        name="FilmDetail" 
        component={FilmDetailScreen} 
        options={({ route }) => ({ title: route.params.title })} 
      />
    </Stack.Navigator>
  );
};

const SearchStack = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Search" 
        component={SearchScreen} 
        options={{ title: t('search.title') }} 
      />
      <Stack.Screen 
        name="FilmDetail" 
        component={FilmDetailScreen} 
        options={({ route }) => ({ title: route.params.title })} 
      />
    </Stack.Navigator>
  );
};

const FavoritesStack = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Favorites" 
        component={FavoritesScreen} 
        options={{ title: t('favorites.title') }} 
      />
      <Stack.Screen 
        name="FilmDetail" 
        component={FilmDetailScreen} 
        options={({ route }) => ({ title: route.params.title })} 
      />
    </Stack.Navigator>
  );
};

const SettingsStack = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: t('settings.title') }} 
      />
    </Stack.Navigator>
  );
};

// Tab navigator principal
const AppNavigator = () => {
  const { colors, theme } = useTheme();
  const { t } = useTranslation();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'SearchTab') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'FavoritesTab') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'SettingsTab') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeStack} 
        options={{ title: t('navigation.home') }} 
      />
      <Tab.Screen 
        name="SearchTab" 
        component={SearchStack} 
        options={{ title: t('navigation.search') }} 
      />
      <Tab.Screen 
        name="FavoritesTab" 
        component={FavoritesStack} 
        options={{ title: t('navigation.favorites') }} 
      />
      <Tab.Screen 
        name="SettingsTab" 
        component={SettingsStack} 
        options={{ title: t('navigation.settings') }} 
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;