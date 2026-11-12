import { StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { theme } from '@/constants/theme';
import { SHIFT_LABELS } from '@/constants/shifts';
import { courseTitle, type CourseOffering } from '@/features/courses/courses.types';

type Props = {
  course: CourseOffering;
  onPress: () => void;
  /** En la vista del estudiante se muestra el docente. */
  showTeacher?: boolean;
  /** Etiqueta extra (por ejemplo, la condición de cursada del estudiante). */
  tag?: { label: string; color: string; soft: string };
};

/** Recibe datos y una acción. No llama a la API, no lee el token ni la sesión. */
export function CourseOfferingCard({ course, onPress, showTeacher = false, tag }: Props) {
  const schedule = [course.classroom, course.startTime && course.endTime ? `${course.startTime}–${course.endTime}` : null]
    .filter(Boolean)
    .join(' · ');
  return (
    <Card onPress={onPress} accessibilityLabel={`${courseTitle(course)}, comisión ${course.commission}`}>
      <View style={styles.header}>
        <Text style={styles.code}>{course.subject?.code ?? ''}</Text>
        <View style={styles.badges}>
          {tag ? <Badge label={tag.label} color={tag.color} background={tag.soft} /> : null}
          <Badge label={SHIFT_LABELS[course.shift] ?? course.shift} />
        </View>
      </View>
      <Text style={styles.name}>{courseTitle(course)}</Text>
      <Text style={styles.meta}>
        Comisión {course.commission}
        {course.academicYear ? ` · ${course.academicYear.name}` : ''}
      </Text>
      {schedule ? <Text style={styles.meta}>{schedule}</Text> : null}
      {showTeacher && course.teacher ? (
        <Text style={styles.meta}>
          Prof. {course.teacher.firstName} {course.teacher.lastName}
        </Text>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badges: { flexDirection: 'row', gap: theme.spacing.xs },
  code: { fontSize: 12, fontWeight: '700', color: theme.colors.muted, letterSpacing: 0.5 },
  name: { fontSize: theme.typography.subtitle, fontWeight: '800', color: theme.colors.text },
  meta: { fontSize: theme.typography.small, color: theme.colors.muted },
});
