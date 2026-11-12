import { Pressable, StyleSheet, Text } from 'react-native';
import { theme } from '@/constants/theme';

type Props = { label: string; onPress: () => void };

/** Botón de texto para la barra superior (ej.: "Salir"). */
export function HeaderTextButton({ label, onPress }: Props) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" hitSlop={10} style={({ pressed }) => pressed && { opacity: 0.6 }}>
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  text: { color: '#FFFFFF', fontWeight: '700', fontSize: theme.typography.body, paddingHorizontal: 4 },
});
