import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';
import { ATTENDANCE_STATUS_META } from '@/constants/attendance';

type Props = {
  present: number;
  absent: number;
  late: number;
  justified: number;
  pending?: number;
};

/** Contadores por estado, con los colores de cada uno. */
export function AttendanceSummaryBar({ present, absent, late, justified, pending }: Props) {
  const items = [
    { key: 'PRESENT', value: present },
    { key: 'ABSENT', value: absent },
    { key: 'LATE', value: late },
    { key: 'JUSTIFIED', value: justified },
  ] as const;
  return (
    <View style={styles.row}>
      {items.map(({ key, value }) => {
        const meta = ATTENDANCE_STATUS_META[key];
        return (
          <View key={key} style={[styles.item, { backgroundColor: meta.soft }]}>
            <Text style={[styles.value, { color: meta.color }]}>{value}</Text>
            <Text style={[styles.label, { color: meta.color }]}>{meta.label}</Text>
          </View>
        );
      })}
      {pending !== undefined && pending > 0 ? (
        <View style={[styles.item, styles.pendingItem]}>
          <Text style={[styles.value, { color: theme.colors.muted }]}>{pending}</Text>
          <Text style={[styles.label, { color: theme.colors.muted }]}>Sin marcar</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xs },
  item: {
    flexGrow: 1,
    minWidth: 64,
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.sm,
  },
  pendingItem: { backgroundColor: theme.colors.background, borderWidth: 1, borderColor: theme.colors.border },
  value: { fontSize: 18, fontWeight: '800' },
  label: { fontSize: 11, fontWeight: '700' },
});
