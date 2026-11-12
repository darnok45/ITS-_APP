import { StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

/** Estilos compartidos por las pantallas que usan FlatList. */
export const listStyles = StyleSheet.create({
  content: { padding: theme.spacing.md, gap: theme.spacing.sm, flexGrow: 1 },
  header: { gap: theme.spacing.md, marginBottom: theme.spacing.sm },
});
