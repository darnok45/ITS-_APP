import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';

type Props = { percentage: number | null; totalClasses: number };

/** Indicador grande del porcentaje de asistencia del estudiante, con barra de progreso. */
export function AttendancePercentage({ percentage, totalClasses }: Props) {
  const color =
    percentage === null
      ? theme.colors.muted
      : percentage >= 75
        ? theme.colors.success
        : percentage >= 60
          ? theme.colors.warning
          : theme.colors.danger;
  return (
    <View style={styles.box}>
      <Text style={[styles.value, { color }]}>{percentage === null ? '—' : `${percentage}%`}</Text>
      <Text style={styles.label}>
        de asistencia en {totalClasses} {totalClasses === 1 ? 'clase' : 'clases'}
      </Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percentage ?? 0}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  value: { fontSize: 44, fontWeight: '900' },
  label: { fontSize: theme.typography.small, color: theme.colors.muted },
  track: {
    alignSelf: 'stretch',
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.background,
    overflow: 'hidden',
    marginTop: theme.spacing.xs,
  },
  fill: { height: '100%', borderRadius: 4 },
});
