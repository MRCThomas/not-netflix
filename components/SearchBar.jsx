import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../i18n/i18n';

const SearchBar = ({ value, onChangeText, onSubmit, onClear }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Ionicons name="search" size={24} color={colors.text} style={styles.icon} />
      <TextInput
        style={[styles.input, { color: colors.text }]}
        placeholder={t('search.placeholder')}
        placeholderTextColor={colors.text + '80'}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={onClear} style={styles.clearButton}>
          <Ionicons name="close-circle" size={24} color={colors.text} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    marginHorizontal: 16,
    marginVertical: 10,
    height: 50,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  clearButton: {
    padding: 5,
  },
});

export default SearchBar;