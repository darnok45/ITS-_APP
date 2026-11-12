import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';
import { ATTENDANCE_STATUS_META, ATTENDANCE_STATUSES } from '@/constants/attendance';
import type { AttendanceStatus } from '@/features/attendance/attendance.types';

type Props = {
  value: AttendanceStatus | null;
  onChange: (status: AttendanceStatus) => void;
  disabled?: boolean;
};

/** Cuatro botones P / A / T / J. Controlado: el estado vive en el hook de la planilla. */
export function AttendanceStatusSelector({ value, onChange, disabled }: Props) {
  return (
    <View style={styles.row} accessibilityRole="radiogroup">
      {ATTENDANCE_STATUSES.map((status) => {
        const meta = ATTENDANCE_STATUS_META[status];
        const selected = value === status;
        return (
          <Pressable
            key={status}
            onPress={() => onChange(status)}
            disabled={disabled}
            accessibilityRole="radio"
            accessibilityState={{ selected, disabled }}
            accessibilityLabel={meta.label}
            hitSlop={4}
            style={({ pressed }) => [
              styles.option,
              { borderColor: meta.color },
              selected && { backgroundColor: meta.color },
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.text, { color: selected ? '#FFFFFF' : meta.color }]}>{meta.short}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: theme.spacing.xs },
  option: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.sm,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
  },
  text: { fontWeight: '800', fontSize: 15 },
  pressed: { opacity: 0.7 },
});
