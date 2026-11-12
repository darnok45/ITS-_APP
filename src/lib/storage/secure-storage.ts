import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

/**
 * Guarda datos sensibles (el token) en el almacenamiento seguro del sistema:
 * Keychain en iOS y Keystore en Android.
 * En web SecureStore no existe, así que se usa localStorage solo para desarrollo.
 */
export const secureStorage = {
  async get(key: string): Promise<string | null> {
    if (Platform.OS === 'web') return globalThis.localStorage?.getItem(key) ?? null;
    return SecureStore.getItemAsync(key);
  },
  async set(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') return globalThis.localStorage?.setItem(key, value);
    return SecureStore.setItemAsync(key, value);
  },
  async remove(key: string): Promise<void> {
    if (Platform.OS === 'web') return globalThis.localStorage?.removeItem(key);
    return SecureStore.deleteItemAsync(key);
  },
};
