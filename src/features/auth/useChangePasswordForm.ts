import { useState } from 'react';
import { getErrorMessage } from '@/lib/api/api.client';
import { useSession } from './SessionProvider';

type FieldErrors = { current?: string; next?: string; confirm?: string };

/** Formulario de cambio de contraseña (obligatorio cuando mustChangePassword = true). */
export function useChangePasswordForm() {
  const { changePassword } = useSession();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): boolean {
    const errors: FieldErrors = {};
    if (!current) errors.current = 'Ingresá tu contraseña actual';
    if (next.length < 8) errors.next = 'La nueva contraseña debe tener al menos 8 caracteres';
    else if (next.length > 72) errors.next = 'La nueva contraseña no puede superar los 72 caracteres';
    else if (next === current) errors.next = 'La nueva contraseña tiene que ser distinta de la actual';
    if (confirm !== next) errors.confirm = 'Las contraseñas no coinciden';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function submit() {
    setSubmitError('');
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await changePassword(current, next);
    } catch (err) {
      setSubmitError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return { current, setCurrent, next, setNext, confirm, setConfirm, fieldErrors, submitError, isSubmitting, submit };
}
