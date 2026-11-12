import { StyleSheet, Text, View } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { FeedbackState } from '@/components/ui/FeedbackState';
import { theme } from '@/constants/theme';
import { SHIFT_LABELS } from '@/constants/shifts';
import { useCourseOffering } from '@/features/courses/useCourseOffering';
import { courseTitle } from '@/features/courses/courses.types';

/** Detalle de materia como hub de acciones: no carga todo, organiza el acceso a cada caso de uso. */
export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { course, isLoading, error, reload } = useCourseOffering(id);

  if (isLoading) return <FeedbackState variant="loading" title="Cargando materia…" />;
  if (error || !course) return <FeedbackState variant="error" title="No se pudo cargar la materia" description={error} actionLabel="Reintentar" onAction={reload} />;

  const base = `/teacher/course-offerings/${course.id}` as const;

  return (
    <Screen scroll>
      <Stack.Screen options={{ title: courseTitle(course) }} />

      <Card>
        <Text style={styles.code}>{course.subject?.code ?? ''}</Text>
        <Text style={styles.name}>{courseTitle(course)}</Text>
        <View style={styles.badges}>
          <Badge label={`Comisión ${course.commission}`} />
          <Badge label={SHIFT_LABELS[course.shift]} />
          {course.academicYear ? <Badge label={course.academicYear.name} /> : null}
          {course.classroom ? <Badge label={course.classroom} /> : null}
        </View>
      </Card>

      <ActionCard
        icon="📝"
        title="Tomar asistencia"
        description="Abrir la clase del día (con su tema) y registrar el estado de cada estudiante."
        onPress={() => router.push(`${base}/new-class`)}
        highlighted
      />
      <ActionCard
        icon="👥"
        title="Estudiantes inscriptos"
        description="Listado de estudiantes con inscripción activa en esta comisión."
        onPress={() => router.push(`${base}/students`)}
      />
      <ActionCard
        icon="📅"
        title="Historial de clases"
        description="Consultar las clases registradas y corregir su asistencia."
        onPress={() => router.push(`${base}/classes`)}
      />
    </Screen>
  );
}

function ActionCard(props: { icon: string; title: string; description: string; onPress: () => void; highlighted?: boolean }) {
  return (
    <Card onPress={props.onPress} style={props.highlighted ? styles.highlighted : undefined} accessibilityLabel={props.title}>
      <View style={styles.actionRow}>
        <Text style={styles.icon}>{props.icon}</Text>
        <View style={styles.actionTexts}>
          <Text style={[styles.actionTitle, props.highlighted && styles.highlightedText]}>{props.title}</Text>
          <Text style={styles.actionDesc}>{props.description}</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  code: { fontSize: 12, fontWeight: '700', color: theme.colors.muted, letterSpacing: 0.5 },
  name: { fontSize: 22, fontWeight: '800', color: theme.colors.text },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xs, marginTop: theme.spacing.xs },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  icon: { fontSize: 28 },
  actionTexts: { flex: 1, gap: 2 },
  actionTitle: { fontSize: theme.typography.subtitle, fontWeight: '700', color: theme.colors.text },
  actionDesc: { fontSize: theme.typography.small, color: theme.colors.muted, lineHeight: 18 },
  chevron: { fontSize: 28, color: theme.colors.muted },
  highlighted: { borderColor: theme.colors.primary, borderWidth: 2, backgroundColor: theme.colors.primarySoft },
  highlightedText: { color: theme.colors.primaryDark },
});
