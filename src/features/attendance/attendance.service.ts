import { ApiError, apiRequest } from '@/lib/api/api.client';
import {
  dayOf,
  summarize,
  type AttendanceRecord,
  type AttendanceStatus,
  type BulkMarkAttendancePayload,
  type ClassSession,
  type ClassSessionListItem,
  type OpenClassSessionResult,
} from './attendance.types';

/** Si cambia la API, se cambia acá. */

// ---------- Clases ----------

/** GET /course-offerings/{id}/class-sessions (la API las devuelve en orden cronológico). */
export function getClassSessions(courseOfferingId: string, token: string): Promise<ClassSession[]> {
  return apiRequest<ClassSession[]>(`/course-offerings/${courseOfferingId}/class-sessions`, { token });
}

/** GET /class-sessions/{id} */
export function getClassSession(classSessionId: string, token: string): Promise<ClassSession> {
  return apiRequest<ClassSession>(`/class-sessions/${classSessionId}`, { token });
}

/** POST /course-offerings/{id}/class-sessions — el tema es obligatorio (libro de temas). */
export function createClassSession(
  courseOfferingId: string,
  body: { date: string; topic: string; notes?: string },
  token: string,
): Promise<ClassSession> {
  return apiRequest<ClassSession>(`/course-offerings/${courseOfferingId}/class-sessions`, {
    method: 'POST',
    token,
    body,
  });
}

/** PATCH /class-sessions/{id}/close — exige tema cargado. */
export function closeClassSession(classSessionId: string, token: string): Promise<ClassSession> {
  return apiRequest<ClassSession>(`/class-sessions/${classSessionId}/close`, { method: 'PATCH', token });
}

/** PATCH /class-sessions/{id}/reopen — el docente puede hasta el día siguiente a la clase. */
export function reopenClassSession(classSessionId: string, reason: string, token: string): Promise<ClassSession> {
  return apiRequest<ClassSession>(`/class-sessions/${classSessionId}/reopen`, {
    method: 'PATCH',
    token,
    body: { reason },
  });
}

/** Se lanza cuando hay que crear la clase y no se cargó el tema (la API lo exige). */
export class MissingTopicError extends Error {
  constructor() {
    super('Ingresá el tema de la clase: es obligatorio para crearla');
    this.name = 'MissingTopicError';
  }
}

/**
 * "Crear o abrir" la clase de una fecha.
 * Primero busca si ya existe una clase ese día (en ese caso no hace falta el tema);
 * si no existe, la crea. Si otro dispositivo la creó al mismo tiempo (409), la vuelve a buscar.
 */
export async function openOrCreateClassSession(
  courseOfferingId: string,
  date: string,
  topic: string,
  token: string,
): Promise<OpenClassSessionResult> {
  const findExisting = async () =>
    (await getClassSessions(courseOfferingId, token)).find((s) => dayOf(s.date) === date) ?? null;

  const existing = await findExisting();
  if (existing) return { created: false, session: existing };
  if (!topic.trim()) throw new MissingTopicError();

  try {
    return { created: true, session: await createClassSession(courseOfferingId, { date, topic: topic.trim() }, token) };
  } catch (err) {
    if (err instanceof ApiError && err.status === 409) {
      const again = await findExisting();
      if (again) return { created: false, session: again };
    }
    throw err;
  }
}

// ---------- Asistencia ----------

/** GET /class-sessions/{id}/attendance */
export function getSessionAttendance(classSessionId: string, token: string): Promise<AttendanceRecord[]> {
  return apiRequest<AttendanceRecord[]>(`/class-sessions/${classSessionId}/attendance`, { token });
}

/** POST /class-sessions/{id}/attendance/bulk — marca varios estudiantes que todavía no tienen registro. */
export function bulkMarkAttendance(
  classSessionId: string,
  payload: BulkMarkAttendancePayload,
  token: string,
): Promise<AttendanceRecord[]> {
  return apiRequest<AttendanceRecord[]>(`/class-sessions/${classSessionId}/attendance/bulk`, {
    method: 'POST',
    token,
    body: payload,
  });
}

/** PATCH /attendance/{id} — corrige un registro existente (queda auditado en la API). */
export function updateAttendance(recordId: string, status: AttendanceStatus, token: string): Promise<AttendanceRecord> {
  return apiRequest<AttendanceRecord>(`/attendance/${recordId}`, { method: 'PATCH', token, body: { status } });
}

/**
 * Guarda la planilla respetando las reglas de la API:
 * - estudiantes sin registro → un solo POST bulk;
 * - registros existentes que cambiaron → PATCH /attendance/{id} (corrección).
 */
export async function saveAttendanceChanges(
  classSessionId: string,
  changes: {
    toCreate: { studentId: string; status: AttendanceStatus }[];
    toUpdate: { recordId: string; status: AttendanceStatus }[];
  },
  token: string,
): Promise<void> {
  if (changes.toCreate.length > 0) {
    await bulkMarkAttendance(classSessionId, { records: changes.toCreate }, token);
  }
  for (const u of changes.toUpdate) {
    await updateAttendance(u.recordId, u.status, token);
  }
}

// ---------- Historial con resumen ----------

/**
 * GET /course-offerings/{id}/attendance-matrix
 * La documentación indica: statuses[studentId][sessionId] = { status, method }.
 * Se lee de forma defensiva y se convierte en "estados por clase".
 */
export async function getStatusesBySession(
  courseOfferingId: string,
  token: string,
): Promise<Map<string, AttendanceStatus[]>> {
  const matrix = await apiRequest<unknown>(`/course-offerings/${courseOfferingId}/attendance-matrix`, { token });
  const result = new Map<string, AttendanceStatus[]>();
  const statuses = (matrix as { statuses?: Record<string, Record<string, { status?: AttendanceStatus } | null>> })
    ?.statuses;
  if (!statuses || typeof statuses !== 'object') return result;

  for (const bySession of Object.values(statuses)) {
    for (const [sessionId, cell] of Object.entries(bySession ?? {})) {
      if (!cell?.status) continue;
      result.set(sessionId, [...(result.get(sessionId) ?? []), cell.status]);
    }
  }
  return result;
}

/** Clases de la más reciente a la más antigua, con su resumen de asistencia. */
export async function getClassSessionHistory(courseOfferingId: string, token: string): Promise<ClassSessionListItem[]> {
  const [sessions, bySession] = await Promise.all([
    getClassSessions(courseOfferingId, token),
    // Si la planilla falla, el historial se muestra igual, sin contadores.
    getStatusesBySession(courseOfferingId, token).catch(() => null),
  ]);

  return [...sessions]
    .sort((a, b) => (dayOf(b.date) ?? '').localeCompare(dayOf(a.date) ?? ''))
    .map((s) => {
      const statuses = bySession?.get(s.id) ?? [];
      return {
        ...s,
        attendanceTaken: statuses.length > 0,
        summary: bySession ? summarize(statuses) : null,
      };
    });
}
