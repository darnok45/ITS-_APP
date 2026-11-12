import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { FeedbackState } from '@/components/ui/FeedbackState';
import { listStyles } from '@/components/ui/listStyles';
import { AttendancePercentage } from '@/components/attendance/AttendancePercentage';
import { AttendanceSummaryBar } from '@/components/attendance/AttendanceSummaryBar';
import { theme } from '@/constants/theme';
import { ATTENDANCE_STATUS_META } from '@/constants/attendance';
import { formatLongDate } from '@/lib/dates';
import { useMyAttendance } from '@/features/student/useMyAttendance';
import { courseTitle } from '@/features/courses/courses.types';

/** Asistencia del estudiante en una materia: porcentaje, totales y detalle por clase. */
export default function MyAttendanceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { attendance, isLoading, isRefreshing, error, reload, refresh } = useMyAttendance(id);

  if (isLoading) return <FeedbackState variant="loading" title="Cargando asistencia…" />;
  if (error || !attendance) return <FeedbackState variant="error" title="No se pudo cargar tu asistencia" description={error} actionLabel="Reintentar" onAction={reload} />;

  const { courseOffering: course, summary, records } = attendance;

  return (
    <Screen style={{ padding: 0 }}>
      <Stack.Screen options={{ title: course ? courseTitle(course) : 'Mi asistencia' }} />
      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        contentContainerStyle={listStyles.content}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}
        ListHeaderComponent={
          <View style={listStyles.header}>
            {course ? (
              <View>
                <Text style={styles.name}>{courseTitle(course)}</Text>
                <Text style={styles.meta}>
                  Comisión {course.commission}
                  {course.teacher ? ` · Prof. ${course.teacher.firstName} ${course.teacher.lastName}` : ''}
                </Text>
              </View>
            ) : null}
            <AttendancePercentage percentage={summary.attendancePercentage} totalClasses={summary.totalClasses} />
            <AttendanceSummaryBar {...summary} />
            {records.length > 0 ? <Text style={styles.section}>Detalle por clase</Text> : null}
          </View>
        }
        ListEmptyComponent={<FeedbackState title="Todavía no hay asistencia registrada" description="Cuando tu docente tome asistencia, la vas a ver acá." />}
        renderItem={({ item }) => {
          const meta = ATTENDANCE_STATUS_META[item.status];
          return (
            <Card style={styles.row}>
              <View style={styles.rowTexts}>
                <Text style={styles.date}>{item.date ? formatLongDate(item.date) : 'Clase'}</Text>
                {item.topic ? <Text style={styles.meta}>{item.topic}</Text> : null}
              </View>
              <Badge label={meta.label} color={meta.color} background={meta.soft} />
            </Card>
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  name: { fontSize: 22, fontWeight: '800', color: theme.colors.text },
  meta: { fontSize: theme.typography.small, color: theme.colors.muted },
  section: { fontSize: theme.typography.subtitle, fontWeight: '700', color: theme.colors.text, marginTop: theme.spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  rowTexts: { flex: 1, gap: 2 },
  date: { fontSize: theme.typography.body, fontWeight: '700', color: theme.colors.text },
});
