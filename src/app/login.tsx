import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { TextField } from '@/components/ui/TextField';
import { AppButton } from '@/components/ui/AppButton';
import { Banner } from '@/components/ui/Banner';
import { theme } from '@/constants/theme';
import { useLoginForm } from '@/features/auth/useLoginForm';

export default function LoginScreen() {
  const form = useLoginForm();

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen scroll edges={['top', 'bottom']} style={styles.content}>
        <View style={styles.brand}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>✓</Text>
          </View>
          <Text style={styles.title}>Asistencia</Text>
          <Text style={styles.subtitle}>Sistema GITS · Gestión de asistencia</Text>
        </View>

        <View style={styles.form}>
          <TextField
            label="Email"
            value={form.email}
            onChangeText={form.setEmail}
            error={form.fieldErrors.email}
            placeholder="nombre@its.edu.ar"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            textContentType="emailAddress"
            returnKeyType="next"
          />
          <TextField
            label="Contraseña"
            value={form.password}
            onChangeText={form.setPassword}
            error={form.fieldErrors.password}
            placeholder="••••••"
            secureTextEntry
            autoComplete="password"
            textContentType="password"
            returnKeyType="go"
            onSubmitEditing={form.submit}
          />
          {form.submitError ? <Banner message={form.submitError} variant="error" /> : null}
          <AppButton title="Ingresar" onPress={form.submit} loading={form.isSubmitting} />
        </View>

        <Text style={styles.demo}>Ingresá con tu usuario del Sistema GITS.</Text>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', padding: theme.spacing.lg, gap: theme.spacing.xl },
  brand: { alignItems: 'center', gap: theme.spacing.xs },
  logo: {
    width: 72,
    height: 72,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  logoText: { color: '#FFFFFF', fontSize: 38, fontWeight: '900' },
  title: { fontSize: 30, fontWeight: '900', color: theme.colors.text },
  subtitle: { fontSize: theme.typography.body, color: theme.colors.muted },
  form: { gap: theme.spacing.md },
  demo: { textAlign: 'center', color: theme.colors.muted, fontSize: 12, lineHeight: 18 },
});
