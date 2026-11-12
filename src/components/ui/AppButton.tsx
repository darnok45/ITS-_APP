import { ActivityIndicator, Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';
import { theme } from '@/constants/theme';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

type Props = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
};

/** Botón con variantes: acción principal, secundaria, peligrosa o discreta. */
export function AppButton({ title, onPress, variant = 'primary', disabled, loading, style }: Props) {
  const isDisabled = disabled || loading;
  const v = VARIANTS[variant];
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled, busy: !!loading }}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: v.bg, borderColor: v.border },
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.text} />
      ) : (
        <Text style={[styles.text, { color: v.text }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const VARIANTS: Record<Variant, { bg: string; text: string; border: string }> = {
  primary: { bg: theme.colors.primary, text: '#FFFFFF', border: theme.colors.primary },
  secondary: { bg: theme.colors.surface, text: theme.colors.primary, border: theme.colors.primary },
  danger: { bg: theme.colors.surface, text: theme.colors.danger, border: theme.colors.danger },
  ghost: { bg: 'transparent', text: theme.colors.primary, border: 'transparent' },
};

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { fontSize: theme.typography.body, fontWeight: '700' },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.45 },
});
