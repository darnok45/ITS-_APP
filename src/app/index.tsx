import { Redirect } from 'expo-router';
import { useSession } from '@/features/auth/SessionProvider';

/** Punto de entrada: manda a cada usuario a su inicio según el rol. */
export default function Index() {
  const { session } = useSession();
  if (!session) return <Redirect href="/login" />;
  if (session.user.mustChangePassword) return <Redirect href="/change-password" />;
  return <Redirect href={session.user.role === 'TEACHER' ? '/teacher' : '/student'} />;
}
