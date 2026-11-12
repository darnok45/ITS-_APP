import { useApiQuery } from '@/hooks/useApiQuery';
import { useSession } from '@/features/auth/SessionProvider';
import { getMyAttendance } from './student.service';

/** Asistencia del estudiante en una materia. */
export function useMyAttendance(courseOfferingId: string | undefined) {
  const { token } = useSession();
  const query = useApiQuery(() => getMyAttendance(courseOfferingId!, token!), [courseOfferingId, token], {
    enabled: !!courseOfferingId && !!token,
    refetchOnFocus: true,
  });
  return { ...query, attendance: query.data };
}
