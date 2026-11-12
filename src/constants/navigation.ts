import type { NativeStackNavigationOptions } from 'expo-router';
import { theme } from './theme';

/** Estilo común de los headers de los stacks de profesor y estudiante. */
export const stackScreenOptions = {
  headerStyle: { backgroundColor: theme.colors.primary },
  headerTintColor: '#FFFFFF',
  headerTitleStyle: { fontWeight: '700' },
  contentStyle: { backgroundColor: theme.colors.background },
  headerBackButtonDisplayMode: 'minimal',
} satisfies NativeStackNavigationOptions;
