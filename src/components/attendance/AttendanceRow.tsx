import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';
import { studentFullName, type Student } from '@/features/courses/courses.types';
import type { AttendanceStatus } from '@/features/attendance/attendance.types';
import { StudentAvatar } from '@/components/students/StudentAvatar';
import { AttendanceStatusSelector } from './AttendanceStatusSelector';

type Props = {
  student: Student;
  status: AttendanceStatus | null;
  onChange: (studentId: string, status: AttendanceStatus) => void;
  disabled?: boolean;
};

/** Fila de la planilla: estudiante + selector. memo evita re-render de toda la lista al tocar una fila. */
export const AttendanceRow = memo(function AttendanceRow({ student, status, onChange, disabled }: Props) {
  return (
    <View style={[styles.row, status === null && styles.pending]}>
      <StudentAvatar firstName={student.firstName} lastName={student.lastName} />
      <View style={styles.texts}>
        <Text style={styles.name} numberOfLines={2}>
          {studentFullName(student)}
        </Text>
        {status === null ? <Text style={styles.pendingText}>Sin marcar</Text> : null}
      </View>
      <AttendanceStatusSelector value={status} onChange={(s) => onChange(student.id, s)} disabled={disabled} />
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  pending: { borderColor: theme.colors.warning, borderStyle: 'dashed' },
  texts: { flex: 1, gap: 2 },
  name: { fontSize: theme.typography.body, fontWeight: '700', color: theme.colors.text },
  pendingText: { fontSize: 12, color: theme.colors.warning, fontWeight: '600' },
});
