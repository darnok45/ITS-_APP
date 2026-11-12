import { apiRequest } from '@/lib/api/api.client';
import type { CourseOffering, Student } from './courses.types';

/** Si cambia la API, se cambia acá. */

/** GET /teachers/me/course-offerings → cursadas asignadas al docente logueado. */
export function getMyCourseOfferings(token: string): Promise<CourseOffering[]> {
  return apiRequest<CourseOffering[]>('/teachers/me/course-offerings', { token });
}

/** GET /teachers/me/course-offerings/{id} → "entrar" al espacio de la cursada. */
export function getTeacherCourseOffering(id: string, token: string): Promise<CourseOffering> {
  return apiRequest<CourseOffering>(`/teachers/me/course-offerings/${id}`, { token });
}

/** GET /course-offerings/{id}/students → estudiantes con inscripción activa. */
export async function getCourseStudents(courseOfferingId: string, token: string): Promise<Student[]> {
  const students = await apiRequest<Student[]>(`/course-offerings/${courseOfferingId}/students`, { token });
  return [...students].sort(
    (a, b) => a.lastName.localeCompare(b.lastName, 'es') || a.firstName.localeCompare(b.firstName, 'es'),
  );
}
