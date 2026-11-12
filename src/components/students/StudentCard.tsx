import { StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/ui/Card';
import { theme } from '@/constants/theme';
import { studentFullName, type Student } from '@/features/courses/courses.types';
import { StudentAvatar } from './StudentAvatar';

type Props = { student: Student };

export function StudentCard({ student }: Props) {
  const meta = [
    student.studentNumber ? `Legajo ${student.studentNumber}` : null,
    student.documentNumber ? `DNI ${student.documentNumber}` : null,
  ]
    .filter(Boolean)
    .join(' · ');
  return (
    <Card style={styles.row}>
      <StudentAvatar firstName={student.firstName} lastName={student.lastName} />
      <View style={styles.texts}>
        <Text style={styles.name}>{studentFullName(student)}</Text>
        {meta ? <Text style={styles.meta}>{meta}</Text> : null}
        {student.email ? <Text style={styles.meta}>{student.email}</Text> : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  texts: { flex: 1, gap: 2 },
  name: { fontSize: theme.typography.body, fontWeight: '700', color: theme.colors.text },
  meta: { fontSize: theme.typography.small, color: theme.colors.muted },
});
