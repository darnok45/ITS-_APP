import { StyleSheet, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TextField } from '@/components/ui/TextField';
import { AppButton } from '@/components/ui/AppButton';
import { Banner } from '@/components/ui/Banner';
import { DateStepper } from '@/components/attendance/DateStepper';
import { theme } from '@/constants/theme';
import { useOpenClassSession } from '@/features/attendance/useOpenClassSession';

/** Crear o abrir la clase de una fecha. Si ya existe, el backend la devuelve y se edita. */
export default function NewClassScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const form = useOpenClassSession(id);

  async function handleSubmit() {
    const result = await form.submit();
    if (!result) return;
    // replace: al volver atrás desde la planilla se regresa al detalle de la materia.
    router.replace({
      pathname: '/teacher/class-sessions/[id]',
      params: { id: result.session.id, existing: result.created ? '0' : '1' },
    });
  }

  return (
    <Screen scroll>
      <SectionHeader title="Nueva clase" subtitle="Elegí la fecha y cargá el tema del día. Si ya hay una clase ese día, se abre la existente." />
      <DateStepper value={form.date} onChange={form.setDate} />
      <TextField
        label="Tema del día"
        value={form.topic}
        onChangeText={form.setTopic}
        placeholder="Ej.: Navegación con Expo Router"
        error={form.topicError}
        hint="Obligatorio para crear la clase: queda registrado en el libro de temas."
      />
      {form.error ? <Banner message={form.error} variant="error" /> : null}
      <AppButton title="Abrir clase y tomar asistencia" onPress={handleSubmit} loading={form.isSubmitting} />
      <Text style={styles.note}>
        La API valida que la cursada sea tuya y que la fecha corresponda. Las fechas futuras no están disponibles.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  note: { fontSize: 12, color: theme.colors.muted, textAlign: 'center' },
});
