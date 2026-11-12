import { FlatList, RefreshControl } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FeedbackState } from '@/components/ui/FeedbackState';
import { listStyles } from '@/components/ui/listStyles';
import { StudentCard } from '@/components/students/StudentCard';
import { useCourseStudents } from '@/features/courses/useCourseStudents';

/** Mismo patrón que Mis materias: hook + estados + FlatList + card. */
export default function CourseStudentsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { students, isLoading, isRefreshing, error, reload, refresh } = useCourseStudents(id);

  if (isLoading) return <FeedbackState variant="loading" title="Cargando estudiantes…" />;
  if (error) return <FeedbackState variant="error" title="Error" description={error} actionLabel="Reintentar" onAction={reload} />;

  return (
    <Screen style={{ padding: 0 }}>
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        contentContainerStyle={listStyles.content}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}
        ListHeaderComponent={
          students.length > 0 ? <SectionHeader title="Inscriptos" subtitle={`${students.length} estudiantes`} /> : undefined
        }
        ListEmptyComponent={<FeedbackState title="Sin estudiantes" description="Todavía no hay estudiantes inscriptos en esta materia." />}
        renderItem={({ item }) => <StudentCard student={item} />}
      />
    </Screen>
  );
}
