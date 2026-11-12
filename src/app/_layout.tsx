import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SessionProvider, useSession } from '@/features/auth/SessionProvider';
import { FeedbackState } from '@/components/ui/FeedbackState';

/**
 * Layout raíz: provee la sesión y decide qué rutas existen según el rol.
 * Stack.Protected oculta las rutas cuyo guard es false; si el usuario
 * está en una ruta que deja de estar permitida, se lo redirige al inicio.
 */
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SessionProvider>
        <StatusBar style="light" />
        <RootNavigator />
      </SessionProvider>
    </SafeAreaProvider>
  );
}

function RootNavigator() {
  const { session, isRestoring } = useSession();

  if (isRestoring) return <FeedbackState variant="loading" title="Iniciando…" />;

  const role = session?.user.role;
  const mustChangePassword = !!session?.user.mustChangePassword;
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Protected guard={!session}>
        <Stack.Screen name="login" />
      </Stack.Protected>
      {/* Contraseña asignada por secretaría: hay que cambiarla antes de usar la app. */}
      <Stack.Protected guard={mustChangePassword}>
        <Stack.Screen name="change-password" />
      </Stack.Protected>
      <Stack.Protected guard={role === 'TEACHER' && !mustChangePassword}>
        <Stack.Screen name="teacher" />
      </Stack.Protected>
      <Stack.Protected guard={role === 'STUDENT' && !mustChangePassword}>
        <Stack.Screen name="student" />
      </Stack.Protected>
    </Stack>
  );
}
