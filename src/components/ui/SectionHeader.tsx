import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';

type Props = { title: string; subtitle?: string; right?: ReactNode };

/** Título y subtítulo de pantalla o de sección. */
export function SectionHeader({ title, subtitle, right }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.texts}>
        <Text style={styles.title} accessibilityRole="header">
          {title}
        </Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  texts: { flex: 1, gap: 2 },
  title: { fontSize: theme.typography.title, fontWeight: '800', color: theme.colors.text },
  subtitle: { fontSize: theme.typography.body, color: theme.colors.muted },
});
