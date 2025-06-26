// src/component/SearchField.tsx
import React from "react";
import { StyleSheet } from "react-native";
import { TextInput as PaperTextInput, useTheme } from "react-native-paper";

interface SearchFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: any;
  autoFocus?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
}

export const SearchField: React.FC<SearchFieldProps> = ({
  value,
  onChangeText,
  placeholder = "Buscar",
  style,
  autoFocus = false,
  onBlur,
  onFocus,
}) => {
  const theme = useTheme();

  return (
    <PaperTextInput
      mode="outlined"
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      style={[styles.input, style, { color: theme.colors.onBackground }]}
      placeholderTextColor={theme.colors.outline}
      autoCorrect={false}
      autoCapitalize="none"
      autoFocus={autoFocus}
      onBlur={onBlur}
      onFocus={onFocus}
      left={<PaperTextInput.Icon icon="magnify" />}
      right={
        value.length > 0 ? (
          <PaperTextInput.Icon
            icon="close"
            onPress={() => onChangeText("")}
            forceTextInputFocus={false}
            accessibilityLabel="Limpar busca"
          />
        ) : null
      }
    />
  );
};

const styles = StyleSheet.create({
  input: {
    marginTop: 2,
    marginBottom: 8,
    marginHorizontal: 16,
    height: 48,
    paddingHorizontal: 14,
    fontSize: 16,
  },
});
