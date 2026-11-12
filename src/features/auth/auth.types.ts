/** Contrato de autenticación de la API GITS (AuthUserDto / LoginResponseDto). */

export type ApiRole = 'ADMIN' | 'ACADEMIC' | 'TEACHER' | 'STUDENT';

/** Roles que usan esta app. ADMIN y ACADEMIC (secretaría) tienen su propio sistema. */
export type UserRole = Extract<ApiRole, 'TEACHER' | 'STUDENT'>;

export type ProfileSummary = {
  /** Id del TeacherProfile o del StudentProfile (no es el id del usuario). */
  id: string;
  firstName: string;
  lastName: string;
};

export type AuthUser = {
  id: string;
  email: string;
  role: ApiRole;
  /** true si secretaría asignó la contraseña: hay que cambiarla antes de seguir. */
  mustChangePassword: boolean;
  profile?: ProfileSummary | null;
};

export type LoginResponse = {
  accessToken: string;
  user: AuthUser;
};

export type Session = {
  token: string;
  user: AuthUser & { role: UserRole };
};

export function isAppRole(role: ApiRole): role is UserRole {
  return role === 'TEACHER' || role === 'STUDENT';
}

/** Nombre para mostrar: el del perfil o, si no tiene, el email. */
export function displayName(user: AuthUser): string {
  return user.profile ? user.profile.firstName : user.email;
}
