import { useApiQuery } from '@/hooks/useApiQuery';
import { useSession } from '@/features/auth/SessionProvider';
import { getClassSessionHistory } from './attendance.service';

/** Historial de clases. Se recarga al volver a la pantalla (por si se tomó asistencia). */
export function useClassSessions(courseOfferingId: string | undefined) {
  const { token } = useSession();
  const query = useApiQuery(() => getClassSessionHistory(courseOfferingId!, token!), [courseOfferingId, token], {
    enabled: !!courseOfferingId && !!token,
    refetchOnFocus: true,
  });
  return { ...query, sessions: query.data ?? [] };
}
