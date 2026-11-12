import { theme } from './theme';
import type { AttendanceStatus } from '@/features/attendance/attendance.types';

/** Cómo se muestra cada estado en toda la app (un solo lugar). */
export const ATTENDANCE_STATUS_META: Record<
  AttendanceStatus,
  { label: string; short: string; color: string; soft: string }
> = {
  PRESENT: { label: 'Presente', short: 'P', color: theme.colors.success, soft: theme.colors.successSoft },
  ABSENT: { label: 'Ausente', short: 'A', color: theme.colors.danger, soft: theme.colors.dangerSoft },
  LATE: { label: 'Tarde', short: 'T', color: theme.colors.warning, soft: theme.colors.warningSoft },
  JUSTIFIED: { label: 'Justificada', short: 'J', color: theme.colors.info, soft: theme.colors.infoSoft },
};

export const ATTENDANCE_STATUSES: AttendanceStatus[] = ['PRESENT', 'ABSENT', 'LATE', 'JUSTIFIED'];
