import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { getErrorMessage } from '@/lib/api/api.client';

type Options = {
  /** Si es false, no se ejecuta (ej.: falta el id). */
  enabled?: boolean;
  /** Vuelve a pedir los datos cada vez que la pantalla recupera el foco. */
  refetchOnFocus?: boolean;
};

/**
 * Patrón loading / error / data / reload de la Clase 10, escrito una sola vez.
 * Los hooks de cada feature (useTeacherCourses, useCourseStudents, …)
 * lo usan pasando la función del service que corresponde.
 */
export function useApiQuery<T>(fetcher: () => Promise<T>, deps: unknown[], options: Options = {}) {
  const { enabled = true, refetchOnFocus = false } = options;
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  // Evita que una respuesta vieja pise a una más nueva.
  const requestId = useRef(0);
  const hasLoaded = useRef(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(fetcher, deps);

  const load = useCallback(
    async (mode: 'initial' | 'refresh' | 'silent' = 'initial') => {
      if (!enabled) return;
      const id = ++requestId.current;
      if (mode === 'initial') setIsLoading(true);
      if (mode === 'refresh') setIsRefreshing(true);
      try {
        const result = await run();
        if (id !== requestId.current) return;
        setData(result);
        setError('');
        hasLoaded.current = true;
      } catch (err) {
        if (id !== requestId.current) return;
        setError(getErrorMessage(err));
      } finally {
        if (id === requestId.current) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    },
    [run, enabled],
  );

  useEffect(() => {
    hasLoaded.current = false;
    load('initial');
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      // La primera carga ya la hace el useEffect; al volver a la pantalla se recarga en silencio.
      if (refetchOnFocus && hasLoaded.current) load('silent');
    }, [refetchOnFocus, load]),
  );

  return {
    data,
    setData,
    isLoading,
    isRefreshing,
    error,
    reload: () => load('initial'),
    refresh: () => load('refresh'),
  };
}
