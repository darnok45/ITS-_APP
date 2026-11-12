import type { CourseOffering } from '@/features/courses/courses.types';

export type EnrollmentCondition = 'IN_PROGRESS' | 'REGULAR' | 'NOT_REGULAR' | 'PROMOTED' | 'ABANDONED';

/** EnrollmentResponseDto: inscripción del estudiante a una cursada. */
export type Enrollment = {
  id: string;
  courseOfferingId: string;
  studentId: string;
  status: 'ACTIVE' | 'DROPPED' | 'COMPLETED' | 'VOID';
  /** Condición académica de la cursada. */
  condition: EnrollmentCondition;
  courseOffering?: CourseOffering;
};
