import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TextField } from '@/components/ui/TextField';
import { AppButton } from '@/components/ui/AppButton';
import { Banner } from '@/components/ui/Banner';
import { theme } from '@/constants/theme';
import { useSession } from '@/features/auth/SessionProvider';
import { useChangePasswordForm } from '@/features/auth/useChangePasswordForm';

/**
 * Se muestra cuando la API indica mustChangePassword = true
 * (contraseña asignada por secretaría). Hasta cambiarla no se accede al resto de la app.
 */
export default function ChangePasswordScreen() {
  const { signOut } = useSession();
  const form = useChangePasswordForm();

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen scroll edges={['top', 'bottom']} style={styles.content}>
        <SectionHeader
          title="Cambiá tu contraseña"
          subtitle="Tu contraseña fue asignada por secretaría. Por seguridad, elegí una nueva para continuar."
        />
        <TextField
          label="Contraseña actual"
          value={form.current}
          onChangeText={form.setCurrent}
          error={form.fieldErrors.current}
          secureTextEntry
          autoComplete="current-password"
        />
        <TextField
          label="Nueva contraseña"
          value={form.next}
          onChangeText={form.setNext}
          error={form.fieldErrors.next}
          hint="Mínimo 8 caracteres"
          secureTextEntry
          autoComplete="new-password"
        />
        <TextField
          label="Repetir nueva contraseña"
          value={form.confirm}
          onChangeText={form.setConfirm}
          error={form.fieldErrors.confirm}
          secureTextEntry
          autoComplete="new-password"
          onSubmitEditing={form.submit}
        />
        {form.submitError ? <Banner message={form.submitError} variant="error" /> : null}
        <AppButton title="Guardar contraseña" onPress={form.submit} loading={form.isSubmitting} />
        <AppButton title="Cerrar sesión" variant="ghost" onPress={signOut} />
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', padding: theme.spacing.lg },
});
