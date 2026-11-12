/**
 * Cliente HTTP único de la app.
 * Centraliza: URL base, headers, token, timeout, JSON y manejo de errores.
 * Ninguna pantalla ni componente usa fetch directamente.
 */

/** API del Sistema GITS. Se puede cambiar con EXPO_PUBLIC_API_URL en .env. */
const DEFAULT_API_URL = 'https://api-gits.innovaweb.com.ar';

export const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL?.trim() || DEFAULT_API_URL).replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  token?: string | null;
  body?: unknown;
  timeoutMs?: number;
};

/** Se dispara ante un 401 con token: la sesión venció. Lo registra SessionProvider. */
let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

/** La API devuelve { success: false, statusCode, message: string | string[] }. Lo convertimos en un texto legible. */
function extractMessage(payload: unknown, status: number): string {
  if (payload && typeof payload === 'object' && 'message' in payload) {
    const msg = (payload as { message: unknown }).message;
    if (Array.isArray(msg)) return msg.join('\n');
    if (typeof msg === 'string') return msg;
  }
  if (status >= 500) return 'El servidor tuvo un problema. Intentá de nuevo en unos minutos.';
  return `Error inesperado (${status})`;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', token, body, timeoutMs = 15000 } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    const aborted = err instanceof Error && err.name === 'AbortError';
    throw new ApiError(
      aborted
        ? 'El servidor tardó demasiado en responder.'
        : `No se pudo conectar con el servidor (${API_BASE_URL}). Revisá tu conexión a internet.`,
      0,
    );
  } finally {
    clearTimeout(timer);
  }

  const text = await response.text();
  const payload = text ? safeJson(text) : null;

  if (!response.ok) {
    if (response.status === 401 && token) onUnauthorized?.();
    if (response.status === 429) throw new ApiError('Demasiados intentos. Esperá un minuto y probá de nuevo.', 429);
    throw new ApiError(extractMessage(payload, response.status), response.status);
  }
  return unwrap<T>(payload);
}

/**
 * La API envuelve toda respuesta exitosa: { success: true, data: ..., timestamp }.
 * Acá se desenvuelve una sola vez, así los services reciben directamente "data".
 */
function unwrap<T>(payload: unknown): T {
  if (payload && typeof payload === 'object' && 'success' in payload && 'data' in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/** Mensaje amigable para cualquier error que llegue a un hook. */
export function getErrorMessage(err: unknown): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return 'Ocurrió un error inesperado';
}
