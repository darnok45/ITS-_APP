import { StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { theme } from '@/constants/theme';
import { formatLongDate, relativeLabel } from '@/lib/dates';
import { dayOf, type ClassSessionListItem } from '@/features/attendance/attendance.types';
import { AttendanceSummaryBar } from './AttendanceSummaryBar';

type Props = { session: ClassSessionListItem; onPress: () => void };

export function ClassSessionCard({ session, onPress }: Props) {
  const day = dayOf(session.date) ?? '';
  const rel = relativeLabel(day);
  return (
    <Card onPress={onPress} accessibilityLabel={`Clase del ${formatLongDate(day)}`}>
      <View style={styles.header}>
        <Text style={styles.date}>
          {rel ? `${rel} · ` : ''}
          {formatLongDate(day)}
        </Text>
        <View style={styles.badges}>
          {session.status === 'CLOSED' ? (
            <Badge label="Cerrada" color={theme.colors.muted} background={theme.colors.background} />
          ) : null}
          {session.summary === null ? null : session.attendanceTaken ? (
            <Badge label="Tomada" color={theme.colors.success} background={theme.colors.successSoft} />
          ) : (
            <Badge label="Pendiente" color={theme.colors.warning} background={theme.colors.warningSoft} />
          )}
        </View>
      </View>
      {session.topic ? <Text style={styles.topic}>{session.topic}</Text> : null}
      {session.attendanceTaken && session.summary ? <AttendanceSummaryBar {...session.summary} /> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing.sm },
  date: { flex: 1, fontSize: theme.typography.body, fontWeight: '700', color: theme.colors.text },
  badges: { flexDirection: 'row', gap: theme.spacing.xs },
  topic: { fontSize: theme.typography.small, color: theme.colors.muted },
});
