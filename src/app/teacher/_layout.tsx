import { Stack } from 'expo-router';
import { useSession } from '@/features/auth/SessionProvider';
import { HeaderTextButton } from '@/components/ui/HeaderTextButton';
import { stackScreenOptions } from '@/constants/navigation';

export default function TeacherLayout() {
  const { signOut } = useSession();
  return (
    <Stack screenOptions={stackScreenOptions}>
      <Stack.Screen
        name="index"
        options={{ title: 'Mis materias', headerRight: () => <HeaderTextButton label="Salir" onPress={signOut} /> }}
      />
      <Stack.Screen name="course-offerings/[id]/index" options={{ title: 'Materia' }} />
      <Stack.Screen name="course-offerings/[id]/students" options={{ title: 'Estudiantes' }} />
      <Stack.Screen name="course-offerings/[id]/new-class" options={{ title: 'Tomar asistencia' }} />
      <Stack.Screen name="course-offerings/[id]/classes" options={{ title: 'Historial de clases' }} />
      <Stack.Screen name="class-sessions/[id]" options={{ title: 'Asistencia' }} />
    </Stack>
  );
}
