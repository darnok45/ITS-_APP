/** Contrato de datos de la API GITS, escrito en TypeScript (Clase 10). */

export type Shift = 'MORNING' | 'AFTERNOON' | 'EVENING' | 'VIRTUAL' | 'MIXED';

/** CourseOffering = cursada: materia dictada en un ciclo, comisión y docente. No es lo mismo que Subject. */
export type CourseOffering = {
  id: string;
  subjectId: string;
  academicYearId: string;
  teacherId: string;
  commission: string;
  shift: Shift;
  dayOfWeek?: number | string | null;
  startTime?: string | null;
  endTime?: string | null;
  classroom?: string | null;
  isActive: boolean;
  subject?: {
    id: string;
    name: string;
    code: string;
    year?: number;
    semester?: number;
  };
  academicYear?: {
    id: string;
    year: number;
    name: string;
  };
  teacher?: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string | null;
  };
};

/** StudentResponseDto: lo que devuelve GET /course-offerings/{id}/students. */
export type Student = {
  /** Id del StudentProfile: es el que se usa para marcar asistencia. */
  id: string;
  firstName: string;
  lastName: string;
  documentNumber?: string | null;
  studentNumber?: string | null;
  email?: string | null;
};

export function studentFullName(s: Pick<Student, 'firstName' | 'lastName'>): string {
  return `${s.lastName}, ${s.firstName}`;
}

export function courseTitle(co: CourseOffering): string {
  return co.subject?.name ?? 'Materia';
}
