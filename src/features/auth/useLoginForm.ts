import { useState } from 'react';
import { getErrorMessage } from '@/lib/api/api.client';
import { useSession } from './SessionProvider';

type FieldErrors = { email?: string; password?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Formulario controlado de login: valores, validación, envío y error remoto. */
export function useLoginForm() {
  const { signIn } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): boolean {
    const errors: FieldErrors = {};
    if (!email.trim()) errors.email = 'Ingresá tu email';
    else if (!EMAIL_RE.test(email.trim())) errors.email = 'El email no tiene un formato válido';
    if (!password) errors.password = 'Ingresá tu contraseña';
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function submit() {
    setSubmitError('');
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await signIn(email, password);
      // No hace falta navegar: el layout raíz cambia de pantalla al detectar la sesión.
    } catch (err) {
      setSubmitError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    email,
    password,
    setEmail: (v: string) => {
      setEmail(v);
      if (fieldErrors.email) setFieldErrors((e) => ({ ...e, email: undefined }));
    },
    setPassword: (v: string) => {
      setPassword(v);
      if (fieldErrors.password) setFieldErrors((e) => ({ ...e, password: undefined }));
    },
    fieldErrors,
    submitError,
    isSubmitting,
    submit,
  };
}
