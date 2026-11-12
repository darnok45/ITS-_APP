import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ApiError, setUnauthorizedHandler } from '@/lib/api/api.client';
import { secureStorage } from '@/lib/storage/secure-storage';
import * as authService from './auth.service';
import { isAppRole, type AuthUser, type Session } from './auth.types';

const TOKEN_KEY = 'asistencia.token';

const WRONG_ROLE_MESSAGE =
  'Esta app es para docentes y estudiantes. Las cuentas de secretaría o administración usan el sistema web.';

type SessionContextValue = {
  session: Session | null;
  /** Atajo: el token de la sesión (o null). Lo usan los hooks de cada feature. */
  token: string | null;
  /** true mientras se intenta restaurar la sesión guardada al abrir la app. */
  isRestoring: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

function toSession(token: string, user: AuthUser): Session {
  if (!isAppRole(user.role)) throw new ApiError(WRONG_ROLE_MESSAGE, 403);
  return { token, user: { ...user, role: user.role } };
}

/**
 * Único lugar que conoce el token y dónde se guarda.
 * Las pantallas solo consumen useSession().
 */
export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);

  const signOut = useCallback(async () => {
    setSession(null);
    await secureStorage.remove(TOKEN_KEY);
  }, []);

  // Al abrir la app: si hay un token guardado, se valida contra la API.
  useEffect(() => {
    (async () => {
      try {
        const token = await secureStorage.get(TOKEN_KEY);
        if (!token) return;
        const user = await authService.getMe(token);
        setSession(toSession(token, user));
      } catch (err) {
        // Token vencido o inválido → se descarta. Ante un error de red se muestra
        // el login igual; el error real aparece cuando el usuario intente ingresar.
        if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
          await secureStorage.remove(TOKEN_KEY);
        }
      } finally {
        setIsRestoring(false);
      }
    })();
  }, []);

  // Si cualquier request devuelve 401, la sesión venció: se cierra.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      signOut();
    });
    return () => setUnauthorizedHandler(null);
  }, [signOut]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { accessToken, user } = await authService.login(email, password);
    const next = toSession(accessToken, user); // rechaza ADMIN / ACADEMIC antes de guardar nada
    await secureStorage.set(TOKEN_KEY, accessToken);
    setSession(next);
  }, []);

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      if (!session) return;
      await authService.changePassword(currentPassword, newPassword, session.token);
      // La API limpia mustChangePassword; se refleja localmente para liberar la navegación.
      setSession({ ...session, user: { ...session.user, mustChangePassword: false } });
    },
    [session],
  );

  const value = useMemo(
    () => ({ session, token: session?.token ?? null, isRestoring, signIn, signOut, changePassword }),
    [session, isRestoring, signIn, signOut, changePassword],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession debe usarse dentro de <SessionProvider>');
  return ctx;
}
