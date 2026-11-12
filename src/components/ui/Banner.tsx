import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';

type Props = { message: string; variant?: 'error' | 'success' | 'info' };

const COLORS = {
  error: { bg: theme.colors.dangerSoft, fg: theme.colors.danger },
  success: { bg: theme.colors.successSoft, fg: theme.colors.success },
  info: { bg: theme.colors.primarySoft, fg: theme.colors.primaryDark },
};

/** Mensaje en línea (error de envío, guardado exitoso, aviso). */
export function Banner({ message, variant = 'info' }: Props) {
  const c = COLORS[variant];
  return (
    <View style={[styles.box, { backgroundColor: c.bg }]} accessibilityLiveRegion="polite">
      <Text style={[styles.text, { color: c.fg }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { borderRadius: theme.radius.sm, padding: theme.spacing.sm },
  text: { fontSize: theme.typography.small, fontWeight: '600', lineHeight: 19 },
});
