import { Stack } from 'expo-router';
import { useSession } from '@/features/auth/SessionProvider';
import { HeaderTextButton } from '@/components/ui/HeaderTextButton';
import { stackScreenOptions } from '@/constants/navigation';

export default function StudentLayout() {
  const { signOut } = useSession();
  return (
    <Stack screenOptions={stackScreenOptions}>
      <Stack.Screen
        name="index"
        options={{ title: 'Mis materias', headerRight: () => <HeaderTextButton label="Salir" onPress={signOut} /> }}
      />
      <Stack.Screen name="course-offerings/[id]" options={{ title: 'Mi asistencia' }} />
    </Stack>
  );
}
