import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';

type Props = { label: string; color?: string; background?: string };

/** Etiqueta pequeña (turno, estado, comisión). */
export function Badge({ label, color = theme.colors.primary, background = theme.colors.primarySoft }: Props) {
  return (
    <View style={[styles.badge, { backgroundColor: background }]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 3,
    borderRadius: theme.radius.pill,
  },
  text: { fontSize: 12, fontWeight: '700' },
});
