import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';
import { AppButton } from './AppButton';

type Props = {
  title: string;
  description?: string;
  variant?: 'loading' | 'error' | 'empty' | 'success';
  actionLabel?: string;
  onAction?: () => void;
};

const ICONS = { error: '⚠️', empty: '📭', success: '✅' } as const;

/** Estados de pantalla consistentes: cargando, error, vacío y éxito. */
export function FeedbackState({ title, description, variant = 'empty', actionLabel, onAction }: Props) {
  return (
    <View style={styles.container} accessibilityLiveRegion="polite">
      {variant === 'loading' ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <Text style={styles.icon}>{ICONS[variant]}</Text>
      )}
      <Text style={[styles.title, variant === 'error' && styles.errorTitle]}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {actionLabel && onAction ? (
        <AppButton title={actionLabel} onPress={onAction} variant="secondary" style={styles.action} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  icon: { fontSize: 40 },
  title: { fontSize: theme.typography.subtitle, fontWeight: '700', color: theme.colors.text, textAlign: 'center' },
  errorTitle: { color: theme.colors.danger },
  description: { fontSize: theme.typography.body, color: theme.colors.muted, textAlign: 'center', lineHeight: 21 },
  action: { marginTop: theme.spacing.sm, minWidth: 180 },
});
