import { useApiQuery } from '@/hooks/useApiQuery';
import { useSession } from '@/features/auth/SessionProvider';
import { getMyCourseOfferings } from './courses.service';

/** Materias asignadas al profesor logueado. */
export function useTeacherCourses() {
  const { token } = useSession();
  const query = useApiQuery(() => getMyCourseOfferings(token!), [token], { enabled: !!token });
  return { ...query, courses: query.data ?? [] };
}
