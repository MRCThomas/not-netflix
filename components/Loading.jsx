import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../i18n/i18n';

const Loading = ({ message = null }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} />
      {message && (
        <Text style={[styles.message, { color: colors.text }]}>
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginTop: 16,
    fontSize: 16,
  },
});

export default Loading;