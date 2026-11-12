import { apiRequest } from '@/lib/api/api.client';
import type { AuthUser, LoginResponse } from './auth.types';

/** POST /auth/login → { accessToken, user } */
export function login(email: string, password: string): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: { email: email.trim(), password },
  });
}

/** GET /auth/me → valida un token guardado y devuelve el usuario con su perfil. */
export function getMe(token: string): Promise<AuthUser> {
  return apiRequest<AuthUser>('/auth/me', { token });
}

/** POST /auth/change-password → la nueva contraseña debe tener 8 caracteres o más. */
export function changePassword(currentPassword: string, newPassword: string, token: string): Promise<unknown> {
  return apiRequest('/auth/change-password', {
    method: 'POST',
    token,
    body: { currentPassword, newPassword },
  });
}
