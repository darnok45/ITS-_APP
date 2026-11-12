import { useApiQuery } from '@/hooks/useApiQuery';
import { useSession } from '@/features/auth/SessionProvider';
import { getMyEnrollments } from './student.service';

/** Materias (cursadas) en las que está inscripto el estudiante logueado. */
export function useStudentCourses() {
  const { token } = useSession();
  const query = useApiQuery(() => getMyEnrollments(token!), [token], { enabled: !!token });
  const enrollments = (query.data ?? []).filter((e) => e.courseOffering);
  return { ...query, enrollments };
}
