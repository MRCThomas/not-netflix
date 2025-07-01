import React, { createContext, useState, useContext, useEffect } from 'react';
import { getTheme, setTheme as saveTheme } from '../services/storage';
import { lightTheme, darkTheme } from '../constants/colors';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [colors, setColors] = useState(lightTheme);
  const [loading, setLoading] = useState(true);

  const LIGHT = 'light';
  const DARK = 'dark';

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await getTheme();
        const validTheme = storedTheme === DARK ? DARK : LIGHT;
        setTheme(validTheme);
        setColors(validTheme === DARK ? darkTheme : lightTheme);
      } catch (error) {
        console.error('Failed to load theme:', error);
        setTheme(LIGHT);
        setColors(lightTheme);
      } finally {
        setLoading(false);
      }
    };

    loadTheme();
  }, []);

  const toggleTheme = async () => {
    try {
      const newTheme = theme === LIGHT ? DARK : LIGHT;
      await saveTheme(newTheme);
      setTheme(newTheme);
      setColors(newTheme === DARK ? darkTheme : lightTheme);
    } catch (error) {
      console.error('Failed to toggle theme:', error);
    }
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        colors, 
        toggleTheme, 
        loading
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};