import { useApiQuery } from '@/hooks/useApiQuery';
import { useSession } from '@/features/auth/SessionProvider';
import { getTeacherCourseOffering } from './courses.service';

/** Detalle de una cursada del docente. */
export function useCourseOffering(id: string | undefined) {
  const { token } = useSession();
  const query = useApiQuery(() => getTeacherCourseOffering(id!, token!), [id, token], {
    enabled: !!id && !!token,
  });
  return { ...query, course: query.data };
}
