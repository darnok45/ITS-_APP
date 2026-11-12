import { apiRequest } from '@/lib/api/api.client';
import {
  dayOf,
  type AttendanceStatus,
  type MyAttendance,
  type MyAttendanceRecord,
} from '@/features/attendance/attendance.types';
import type { Enrollment } from './student.types';

/** GET /students/me/enrollments → inscripciones activas, cada una con su cursada. */
export function getMyEnrollments(token: string): Promise<Enrollment[]> {
  return apiRequest<Enrollment[]>('/students/me/enrollments', { token });
}

const STATUSES: AttendanceStatus[] = ['PRESENT', 'ABSENT', 'LATE', 'JUSTIFIED'];

/**
 * La documentación solo garantiza que cada registro trae su status y la clase asociada
 * ("Attendance records with classSession + courseOffering"). Se lee de forma defensiva.
 */
type RawRecord = {
  id?: string;
  status?: string;
  date?: string;
  classSessionId?: string;
  classSession?: { id?: string; date?: string; topic?: string | null };
};

function normalizeRecord(raw: RawRecord, index: number): MyAttendanceRecord | null {
  if (!raw || !STATUSES.includes(raw.status as AttendanceStatus)) return null;
  return {
    id: raw.id ?? raw.classSession?.id ?? raw.classSessionId ?? String(index),
    date: dayOf(raw.classSession?.date ?? raw.date),
    topic: raw.classSession?.topic ?? null,
    status: raw.status as AttendanceStatus,
  };
}

/**
 * GET /students/me/attendance?courseOfferingId=... → { totals, records }.
 * Se combina con la inscripción para mostrar los datos de la materia.
 */
export async function getMyAttendance(courseOfferingId: string, token: string): Promise<MyAttendance> {
  const [history, enrollments] = await Promise.all([
    apiRequest<{ totals?: Partial<Record<AttendanceStatus, number>>; records?: RawRecord[] }>(
      `/students/me/attendance?courseOfferingId=${encodeURIComponent(courseOfferingId)}`,
      { token },
    ),
    getMyEnrollments(token),
  ]);

  const records = (history.records ?? [])
    .map(normalizeRecord)
    .filter((r): r is MyAttendanceRecord => r !== null)
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));

  // Totales: se usan los de la API; si no vienen, se cuentan los registros.
  const count = (s: AttendanceStatus) => history.totals?.[s] ?? records.filter((r) => r.status === s).length;
  const present = count('PRESENT');
  const absent = count('ABSENT');
  const late = count('LATE');
  const justified = count('JUSTIFIED');
  const totalClasses = present + absent + late + justified;

  return {
    courseOffering: enrollments.find((e) => e.courseOfferingId === courseOfferingId)?.courseOffering ?? null,
    summary: {
      totalClasses,
      present,
      absent,
      late,
      justified,
      attendancePercentage: totalClasses === 0 ? null : Math.round(((present + late) / totalClasses) * 100),
    },
    records,
  };
}
