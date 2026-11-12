import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { theme } from '@/constants/theme';

type Props = TextInputProps & { label: string; error?: string; hint?: string };

/** Input controlado con etiqueta y mensaje de error. */
export function TextField({ label, error, hint, style, ...inputProps }: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={theme.colors.muted}
        accessibilityLabel={label}
        style={[styles.input, !!error && styles.inputError, style]}
        {...inputProps}
      />
      {error ? <Text style={styles.error}>{error}</Text> : hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: theme.spacing.xs },
  label: { fontSize: theme.typography.small, fontWeight: '700', color: theme.colors.text },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    fontSize: theme.typography.body,
    color: theme.colors.text,
  },
  inputError: { borderColor: theme.colors.danger },
  error: { color: theme.colors.danger, fontSize: theme.typography.small },
  hint: { color: theme.colors.muted, fontSize: theme.typography.small },
});
