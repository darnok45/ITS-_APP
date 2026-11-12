import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';
import { addDays, formatLongDate, relativeLabel, todayIso } from '@/lib/dates';

type Props = { value: string; onChange: (iso: string) => void };

/**
 * Selector de fecha sin dependencias nativas: día anterior / siguiente.
 * No permite avanzar más allá de hoy (el backend también lo valida).
 */
export function DateStepper({ value, onChange }: Props) {
  const today = todayIso();
  const canGoForward = value < today;
  const rel = relativeLabel(value);
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <StepButton label="‹" onPress={() => onChange(addDays(value, -1))} accessibilityLabel="Día anterior" />
        <View style={styles.center}>
          {rel ? <Text style={styles.rel}>{rel}</Text> : null}
          <Text style={styles.date}>{formatLongDate(value)}</Text>
        </View>
        <StepButton
          label="›"
          onPress={() => onChange(addDays(value, 1))}
          disabled={!canGoForward}
          accessibilityLabel="Día siguiente"
        />
      </View>
      {value !== today ? (
        <Pressable onPress={() => onChange(today)} accessibilityRole="button">
          <Text style={styles.todayLink}>Volver a hoy</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function StepButton(props: { label: string; onPress: () => void; disabled?: boolean; accessibilityLabel: string }) {
  return (
    <Pressable
      onPress={props.onPress}
      disabled={props.disabled}
      accessibilityRole="button"
      accessibilityLabel={props.accessibilityLabel}
      style={({ pressed }) => [styles.step, props.disabled && styles.stepDisabled, pressed && { opacity: 0.6 }]}
    >
      <Text style={styles.stepText}>{props.label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.sm,
    gap: theme.spacing.xs,
    alignItems: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, alignSelf: 'stretch' },
  center: { flex: 1, alignItems: 'center' },
  rel: { fontSize: 12, fontWeight: '800', color: theme.colors.primary, textTransform: 'uppercase' },
  date: { fontSize: theme.typography.subtitle, fontWeight: '700', color: theme.colors.text, textAlign: 'center' },
  step: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDisabled: { opacity: 0.3 },
  stepText: { fontSize: 26, fontWeight: '700', color: theme.colors.primary, marginTop: -3 },
  todayLink: { color: theme.colors.primary, fontWeight: '700', fontSize: theme.typography.small },
});
