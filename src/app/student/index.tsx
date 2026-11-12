import { FlatList, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FeedbackState } from '@/components/ui/FeedbackState';
import { listStyles } from '@/components/ui/listStyles';
import { CourseOfferingCard } from '@/components/courses/CourseOfferingCard';
import { useSession } from '@/features/auth/SessionProvider';
import { displayName } from '@/features/auth/auth.types';
import { useStudentCourses } from '@/features/student/useStudentCourses';
import { CONDITION_META } from '@/constants/enrollment';

/** Home del estudiante: sus materias. Reutiliza la misma card que el profesor. */
export default function StudentHomeScreen() {
  const { session } = useSession();
  const { enrollments, isLoading, isRefreshing, error, reload, refresh } = useStudentCourses();

  if (isLoading) return <FeedbackState variant="loading" title="Cargando materias…" />;
  if (error) return <FeedbackState variant="error" title="No se pudieron cargar tus materias" description={error} actionLabel="Reintentar" onAction={reload} />;

  return (
    <Screen style={{ padding: 0 }}>
      <FlatList
        data={enrollments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={listStyles.content}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}
        ListHeaderComponent={
          <SectionHeader
            title={`Hola, ${session ? displayName(session.user) : ''}`}
            subtitle={enrollments.length > 0 ? 'Tocá una materia para ver tu asistencia' : undefined}
          />
        }
        ListEmptyComponent={<FeedbackState title="No estás inscripto en materias" description="Cuando te inscriban en un dictado, va a aparecer acá." />}
        renderItem={({ item }) => (
          <CourseOfferingCard
            course={item.courseOffering!}
            showTeacher
            tag={CONDITION_META[item.condition]}
            onPress={() => router.push(`/student/course-offerings/${item.courseOfferingId}`)}
          />
        )}
      />
    </Screen>
  );
}
