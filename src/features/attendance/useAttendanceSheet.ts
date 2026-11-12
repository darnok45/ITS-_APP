import { useEffect, useMemo, useState } from 'react';
import { useApiQuery } from '@/hooks/useApiQuery';
import { getErrorMessage } from '@/lib/api/api.client';
import { useSession } from '@/features/auth/SessionProvider';
import { getCourseStudents } from '@/features/courses/courses.service';
import {
  closeClassSession,
  getClassSession,
  getSessionAttendance,
  reopenClassSession,
  saveAttendanceChanges,
} from './attendance.service';
import type { AttendanceSheetRow, AttendanceStatus, ClassSession } from './attendance.types';

type StatusMap = Record<string, AttendanceStatus | null>;

/** Arma la planilla: la clase + todos los inscriptos + los registros que ya existen. */
async function fetchSheet(classSessionId: string, token: string) {
  const session = await getClassSession(classSessionId, token);
  const [students, records] = await Promise.all([
    getCourseStudents(session.courseOfferingId, token),
    getSessionAttendance(classSessionId, token),
  ]);
  const byStudent = new Map(records.map((r) => [r.studentId, r]));
  const rows: AttendanceSheetRow[] = students.map((student) => {
    const record = byStudent.get(student.id);
    return { student, recordId: record?.id ?? null, status: record?.status ?? null };
  });
  return { session, rows };
}

/**
 * Planilla de asistencia (Clase 11): estado local por estudiante,
 * acciones rápidas y guardado en la API.
 */
export function useAttendanceSheet(classSessionId: string | undefined) {
  const { token } = useSession();
  const query = useApiQuery(() => fetchSheet(classSessionId!, token!), [classSessionId, token], {
    enabled: !!classSessionId && !!token,
  });
  const session: ClassSession | undefined = query.data?.session;
  const rows = useMemo(() => query.data?.rows ?? [], [query.data]);

  // Estado guardado en la API vs. estado que está editando el docente.
  const [saved, setSaved] = useState<StatusMap>({});
  const [draft, setDraft] = useState<StatusMap>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [actionError, setActionError] = useState('');
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  useEffect(() => {
    const map: StatusMap = {};
    rows.forEach((r) => (map[r.student.id] = r.status));
    setSaved(map);
    setDraft(map);
  }, [rows]);

  const isClosed = session?.status === 'CLOSED';
  const attendanceTaken = rows.some((r) => r.recordId !== null);

  const stats = useMemo(() => {
    const values = rows.map((r) => draft[r.student.id] ?? null);
    return {
      total: rows.length,
      pending: values.filter((v) => v === null).length,
      present: values.filter((v) => v === 'PRESENT').length,
      absent: values.filter((v) => v === 'ABSENT').length,
      late: values.filter((v) => v === 'LATE').length,
      justified: values.filter((v) => v === 'JUSTIFIED').length,
    };
  }, [rows, draft]);

  const hasChanges = rows.some((r) => (draft[r.student.id] ?? null) !== (saved[r.student.id] ?? null));
  const canSave = !isClosed && rows.length > 0 && stats.pending === 0 && hasChanges && !isSaving;

  function setStatus(studentId: string, status: AttendanceStatus) {
    if (isClosed) return;
    setSavedAt(null);
    setDraft((d) => ({ ...d, [studentId]: status }));
  }

  /** Marca a todos los que todavía no tienen estado. No pisa lo ya marcado. */
  function markPendingAs(status: AttendanceStatus) {
    if (isClosed) return;
    setSavedAt(null);
    setDraft((d) => {
      const next = { ...d };
      rows.forEach((r) => {
        if (!next[r.student.id]) next[r.student.id] = status;
      });
      return next;
    });
  }

  function discardChanges() {
    setDraft(saved);
    setActionError('');
  }

  async function reloadSheet() {
    if (!classSessionId || !token) return;
    query.setData(await fetchSheet(classSessionId, token));
  }

  async function save(): Promise<boolean> {
    if (!classSessionId || !token || !canSave) return false;
    setIsSaving(true);
    setActionError('');
    try {
      const toCreate = rows
        .filter((r) => r.recordId === null)
        .map((r) => ({ studentId: r.student.id, status: draft[r.student.id] as AttendanceStatus }));
      const toUpdate = rows
        .filter((r) => r.recordId !== null && draft[r.student.id] !== r.status)
        .map((r) => ({ recordId: r.recordId as string, status: draft[r.student.id] as AttendanceStatus }));

      await saveAttendanceChanges(classSessionId, { toCreate, toUpdate }, token);
      setSavedAt(new Date());
      return true;
    } catch (err) {
      setActionError(getErrorMessage(err));
      return false;
    } finally {
      // Siempre se recarga: si falló a mitad de camino, la planilla muestra lo que realmente quedó guardado.
      await reloadSheet().catch(() => undefined);
      setIsSaving(false);
    }
  }

  /** Cierra la clase (la API exige que tenga tema). Después no se puede editar sin reabrir. */
  async function closeSession() {
    if (!classSessionId || !token) return;
    setIsChangingStatus(true);
    setActionError('');
    setSavedAt(null);
    try {
      await closeClassSession(classSessionId, token);
      await reloadSheet();
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setIsChangingStatus(false);
    }
  }

  /** Reabre la clase para corregir. El docente puede hasta el día siguiente a la clase. */
  async function reopenSession() {
    if (!classSessionId || !token) return;
    setIsChangingStatus(true);
    setActionError('');
    setSavedAt(null);
    try {
      await reopenClassSession(classSessionId, 'Corrección de asistencia desde la app móvil', token);
      await reloadSheet();
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setIsChangingStatus(false);
    }
  }

  return {
    session,
    rows,
    draft,
    stats,
    isClosed,
    attendanceTaken,
    isLoading: query.isLoading,
    error: query.error,
    reload: query.reload,
    hasChanges,
    canSave,
    isSaving,
    isChangingStatus,
    actionError,
    savedAt,
    setStatus,
    markPendingAs,
    discardChanges,
    save,
    closeSession,
    reopenSession,
  };
}
