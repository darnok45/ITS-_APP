import { theme } from './theme';
import type { EnrollmentCondition } from '@/features/student/student.types';

/** Condición de cursada (Enrollment.condition) tal como la muestra la app. */
export const CONDITION_META: Record<EnrollmentCondition, { label: string; color: string; soft: string }> = {
  IN_PROGRESS: { label: 'Cursando', color: theme.colors.primary, soft: theme.colors.primarySoft },
  REGULAR: { label: 'Regular', color: theme.colors.success, soft: theme.colors.successSoft },
  PROMOTED: { label: 'Promocionada', color: theme.colors.info, soft: theme.colors.infoSoft },
  NOT_REGULAR: { label: 'Libre', color: theme.colors.danger, soft: theme.colors.dangerSoft },
  ABANDONED: { label: 'Abandonó', color: theme.colors.muted, soft: theme.colors.background },
};
