import { useState } from 'react';
import { getErrorMessage } from '@/lib/api/api.client';
import { todayIso } from '@/lib/dates';
import { useSession } from '@/features/auth/SessionProvider';
import { MissingTopicError, openOrCreateClassSession } from './attendance.service';
import type { OpenClassSessionResult } from './attendance.types';

/**
 * Formulario "crear o abrir clase": fecha + tema del día.
 * El tema es obligatorio para crear (libro de temas), pero no para abrir una clase que ya existe.
 */
export function useOpenClassSession(courseOfferingId: string | undefined) {
  const { token } = useSession();
  const [date, setDate] = useState(todayIso());
  const [topic, setTopic] = useState('');
  const [topicError, setTopicError] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(): Promise<OpenClassSessionResult | null> {
    if (!courseOfferingId || !token) return null;
    setError('');
    setTopicError('');
    setIsSubmitting(true);
    try {
      return await openOrCreateClassSession(courseOfferingId, date, topic, token);
    } catch (err) {
      if (err instanceof MissingTopicError) setTopicError(err.message);
      else setError(getErrorMessage(err));
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    date,
    setDate,
    topic,
    setTopic: (v: string) => {
      setTopic(v);
      if (topicError) setTopicError('');
    },
    topicError,
    error,
    isSubmitting,
    submit,
  };
}
