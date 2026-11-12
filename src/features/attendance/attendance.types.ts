import type { CourseOffering, Student } from '@/features/courses/courses.types';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'JUSTIFIED';
export type ClassSessionStatus = 'OPEN' | 'CLOSED';

// ---------- Contrato de la API ----------

/** ClassSessionResponseDto */
export type ClassSession = {
  id: string;
  courseOfferingId: string;
  /** La API puede devolver "2026-08-06" o "2026-08-06T00:00:00.000Z": usar dayOf(). */
  date: string;
  topic: string | null;
  notes: string | null;
  /** OPEN al crearla; CLOSED después de cerrarla. Solo se puede marcar asistencia con OPEN. */
  status: ClassSessionStatus;
  courseOffering?: CourseOffering;
};

/** AttendanceRecordResponseDto */
export type AttendanceRecord = {
  id: string;
  classSessionId: string;
  studentId: string;
  status: AttendanceStatus;
  observation: string | null;
  markedAt: string;
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber?: string;
    documentNumber?: string;
  };
};

/** Body de POST /class-sessions/{id}/attendance/bulk (BulkMarkAttendanceDto) */
export type BulkMarkAttendancePayload = {
  records: { studentId: string; status: AttendanceStatus; observation?: string }[];
};

// ---------- Modelos que arma la app ----------

export type AttendanceSummary = {
  total: number;
  present: number;
  absent: number;
  late: number;
  justified: number;
};

/** Clase en el historial, con el resumen calculado a partir de la planilla de la cursada. */
export type ClassSessionListItem = ClassSession & {
  attendanceTaken: boolean;
  /** null si no se pudo obtener la planilla (el historial se muestra igual). */
  summary: AttendanceSummary | null;
};

/** Fila de la planilla: un inscripto y su registro (si ya existe). */
export type AttendanceSheetRow = {
  student: Student;
  /** Id del registro de asistencia; null si todavía no se marcó. Se usa para corregir con PATCH. */
  recordId: string | null;
  status: AttendanceStatus | null;
};

export type OpenClassSessionResult = {
  /** false si ya había una clase en esa fecha y simplemente se abrió. */
  created: boolean;
  session: ClassSession;
};

// ---------- Vista del estudiante ----------

export type MyAttendanceRecord = {
  id: string;
  date: string | null;
  topic: string | null;
  status: AttendanceStatus;
};

export type MyAttendance = {
  courseOffering: CourseOffering | null;
  summary: {
    totalClasses: number;
    present: number;
    absent: number;
    late: number;
    justified: number;
    /** (presentes + tardes) / clases registradas. null si todavía no hay clases. */
    attendancePercentage: number | null;
  };
  records: MyAttendanceRecord[];
};

/** "2026-08-06T00:00:00.000Z" → "2026-08-06" */
export function dayOf(date: string | null | undefined): string | null {
  return date ? date.slice(0, 10) : null;
}

export function summarize(statuses: AttendanceStatus[]): AttendanceSummary {
  return {
    total: statuses.length,
    present: statuses.filter((s) => s === 'PRESENT').length,
    absent: statuses.filter((s) => s === 'ABSENT').length,
    late: statuses.filter((s) => s === 'LATE').length,
    justified: statuses.filter((s) => s === 'JUSTIFIED').length,
  };
}
