import { FlatList, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FeedbackState } from '@/components/ui/FeedbackState';
import { listStyles } from '@/components/ui/listStyles';
import { CourseOfferingCard } from '@/components/courses/CourseOfferingCard';
import { useSession } from '@/features/auth/SessionProvider';
import { displayName } from '@/features/auth/auth.types';
import { useTeacherCourses } from '@/features/courses/useTeacherCourses';

/** Home del profesor: representa estados y delega la implementación. */
export default function TeacherHomeScreen() {
  const { session } = useSession();
  const { courses, isLoading, isRefreshing, error, reload, refresh } = useTeacherCourses();

  if (isLoading) return <FeedbackState variant="loading" title="Cargando materias…" />;
  if (error) return <FeedbackState variant="error" title="No se pudieron cargar las materias" description={error} actionLabel="Reintentar" onAction={reload} />;

  return (
    <Screen style={{ padding: 0 }}>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={listStyles.content}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}
        ListHeaderComponent={
          <SectionHeader
            title={`Hola, ${session ? displayName(session.user) : ''}`}
            subtitle={courses.length > 0 ? 'Elegí una materia para trabajar' : undefined}
          />
        }
        ListEmptyComponent={
          <FeedbackState title="No tenés materias asignadas" description="Cuando la institución te asigne un dictado, va a aparecer acá." />
        }
        renderItem={({ item }) => (
          <CourseOfferingCard course={item} onPress={() => router.push(`/teacher/course-offerings/${item.id}`)} />
        )}
      />
    </Screen>
  );
}
