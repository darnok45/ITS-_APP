import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { theme } from '@/constants/theme';

type Props = {
  children: ReactNode;
  /** true para pantallas con formulario o contenido largo sin FlatList. */
  scroll?: boolean;
  /** Bordes con zona segura. Debajo de un header nativo alcanza con 'bottom'. */
  edges?: Edge[];
  style?: ViewStyle;
};

/** Fondo, padding y zona segura comunes a todas las pantallas. */
export function Screen({ children, scroll = false, edges = ['bottom'], style }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={edges}>
      {scroll ? (
        <ScrollView contentContainerStyle={[styles.content, style]} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, styles.fill, style]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  fill: { flex: 1 },
  content: { padding: theme.spacing.md, gap: theme.spacing.md },
});
