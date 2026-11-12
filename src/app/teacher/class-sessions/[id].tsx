import { useState } from 'react';
import { Alert, FlatList, Platform, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, usePreventRemove } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '@/components/ui/AppButton';
import { Badge } from '@/components/ui/Badge';
import { Banner } from '@/components/ui/Banner';
import { FeedbackState } from '@/components/ui/FeedbackState';
import { listStyles } from '@/components/ui/listStyles';
import { AttendanceRow } from '@/components/attendance/AttendanceRow';
import { AttendanceSummaryBar } from '@/components/attendance/AttendanceSummaryBar';
import { theme } from '@/constants/theme';
import { formatLongDate, relativeLabel } from '@/lib/dates';
import { dayOf } from '@/features/attendance/attendance.types';
import { courseTitle } from '@/features/courses/courses.types';
import { useAttendanceSheet } from '@/features/attendance/useAttendanceSheet';

/**
 * Planilla de asistencia.
 * - Clase OPEN: se marca y se guarda (altas en bloque + correcciones).
 * - Clase CLOSED: solo lectura; el docente puede reabrirla hasta el día siguiente.
 */
export default function AttendanceSheetScreen() {
  const { id, existing } = useLocalSearchParams<{ id: string; existing?: string }>();
  const sheet = useAttendanceSheet(id);
  const [allowLeave, setAllowLeave] = useState(false);

  // Si hay cambios sin guardar, se pide confirmación antes de salir de la pantalla.
  usePreventRemove(sheet.hasChanges && !allowLeave, ({ repeat }) => {
    confirm('¿Salir sin guardar?', 'Hay cambios en la asistencia que todavía no se guardaron.', 'Salir sin guardar', () => {
      setAllowLeave(true);
      // Se espera un ciclo para que el bloqueo se desactive antes de repetir la navegación.
      setTimeout(repeat, 0);
    });
  });

  if (sheet.isLoading) return <FeedbackState variant="loading" title="Cargando planilla…" />;
  if (sheet.error || !sheet.session) {
    return <FeedbackState variant="error" title="No se pudo cargar la clase" description={sheet.error} actionLabel="Reintentar" onAction={sheet.reload} />;
  }

  const { session, stats } = sheet;
  const day = dayOf(session.date) ?? '';
  const rel = relativeLabel(day);
  const busy = sheet.isSaving || sheet.isChangingStatus;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Stack.Screen options={{ title: session.courseOffering ? courseTitle(session.courseOffering) : 'Asistencia' }} />
      <FlatList
        data={sheet.rows}
        keyExtractor={(item) => item.student.id}
        contentContainerStyle={listStyles.content}
        extraData={[sheet.draft, sheet.isClosed]}
        ListHeaderComponent={
          <View style={listStyles.header}>
            <View style={styles.titleRow}>
              <View style={styles.titleTexts}>
                <Text style={styles.date}>
                  {rel ? `${rel} · ` : ''}
                  {formatLongDate(day)}
                </Text>
                <Text style={styles.meta}>
                  {session.courseOffering ? `Comisión ${session.courseOffering.commission}` : ''}
                  {session.topic ? ` · ${session.topic}` : ''}
                </Text>
              </View>
              {sheet.isClosed ? (
                <Badge label="Cerrada" color={theme.colors.muted} background={theme.colors.background} />
              ) : (
                <Badge label="Abierta" color={theme.colors.success} background={theme.colors.successSoft} />
              )}
            </View>

            {sheet.isClosed ? (
              <View style={styles.closedBox}>
                <Banner message="La clase está cerrada: la asistencia es de solo lectura. Para corregirla, reabrila (como docente podés hacerlo hasta el día siguiente a la clase)." />
                <AppButton title="Reabrir clase para corregir" variant="secondary" onPress={sheet.reopenSession} loading={sheet.isChangingStatus} />
              </View>
            ) : existing === '1' && sheet.attendanceTaken ? (
              <Banner message="Esta clase ya existía y tiene asistencia cargada. Podés corregirla y volver a guardar." />
            ) : null}

            <AttendanceSummaryBar {...stats} />

            {!sheet.isClosed && stats.pending > 0 ? (
              <AppButton
                title={`Marcar ${stats.pending} sin marcar como presentes`}
                variant="secondary"
                onPress={() => sheet.markPendingAs('PRESENT')}
              />
            ) : null}
            <Text style={styles.legend}>P presente · A ausente · T tarde · J justificada</Text>
          </View>
        }
        ListEmptyComponent={<FeedbackState title="Sin estudiantes" description="No hay inscriptos activos en esta cursada." />}
        renderItem={({ item }) => (
          <AttendanceRow
            student={item.student}
            status={sheet.draft[item.student.id] ?? null}
            onChange={sheet.setStatus}
            disabled={busy || sheet.isClosed}
          />
        )}
      />

      {!sheet.isClosed ? (
        <View style={styles.footer}>
          {sheet.actionError ? <Banner message={sheet.actionError} variant="error" /> : null}
          {sheet.savedAt && !sheet.hasChanges ? <Banner message="Asistencia guardada correctamente." variant="success" /> : null}
          {stats.pending > 0 && stats.total > 0 ? (
            <Text style={styles.hint}>Faltan {stats.pending} estudiantes por marcar para poder guardar.</Text>
          ) : null}

          <View style={styles.footerRow}>
            {sheet.hasChanges ? (
              <AppButton title="Descartar" variant="ghost" onPress={sheet.discardChanges} disabled={busy} />
            ) : null}
            {sheet.hasChanges || !sheet.attendanceTaken ? (
              <AppButton
                title={sheet.attendanceTaken ? 'Guardar cambios' : 'Guardar asistencia'}
                onPress={sheet.save}
                disabled={!sheet.canSave}
                loading={sheet.isSaving}
                style={styles.flex}
              />
            ) : (
              <AppButton
                title="Cerrar clase"
                variant="secondary"
                loading={sheet.isChangingStatus}
                style={styles.flex}
                onPress={() =>
                  confirm(
                    '¿Cerrar la clase?',
                    'Después de cerrarla, la asistencia queda de solo lectura. Podés reabrirla hasta el día siguiente.',
                    'Cerrar clase',
                    sheet.closeSession,
                  )
                }
              />
            )}
          </View>
        </View>
      ) : sheet.actionError ? (
        <View style={styles.footer}>
          <Banner message={sheet.actionError} variant="error" />
        </View>
      ) : null}
    </SafeAreaView>
  );
}

function confirm(title: string, message: string, confirmLabel: string, onConfirm: () => void) {
  if (Platform.OS === 'web') {
    if (globalThis.confirm?.(`${title}\n${message}`)) onConfirm();
    return;
  }
  Alert.alert(title, message, [
    { text: 'Cancelar', style: 'cancel' },
    { text: confirmLabel, style: 'destructive', onPress: onConfirm },
  ]);
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  flex: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.sm },
  titleTexts: { flex: 1 },
  date: { fontSize: 20, fontWeight: '800', color: theme.colors.text },
  meta: { fontSize: theme.typography.small, color: theme.colors.muted, marginTop: 2 },
  closedBox: { gap: theme.spacing.sm },
  legend: { fontSize: 12, color: theme.colors.muted, textAlign: 'center' },
  footer: {
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  footerRow: { flexDirection: 'row', gap: theme.spacing.sm },
  hint: { fontSize: theme.typography.small, color: theme.colors.warning, fontWeight: '600', textAlign: 'center' },
});
