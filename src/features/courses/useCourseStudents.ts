import { useApiQuery } from '@/hooks/useApiQuery';
import { useSession } from '@/features/auth/SessionProvider';
import { getCourseStudents } from './courses.service';

/** Estudiantes inscriptos en una materia. */
export function useCourseStudents(courseOfferingId: string | undefined) {
  const { token } = useSession();
  const query = useApiQuery(() => getCourseStudents(courseOfferingId!, token!), [courseOfferingId, token], {
    enabled: !!courseOfferingId && !!token,
  });
  return { ...query, students: query.data ?? [] };
}
