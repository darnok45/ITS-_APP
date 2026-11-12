import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';

type Props = { firstName: string; lastName: string };

/** Iniciales del estudiante en un círculo. */
export function StudentAvatar({ firstName, lastName }: Props) {
  const initials = `${lastName[0] ?? ''}${firstName[0] ?? ''}`.toUpperCase();
  return (
    <View style={styles.circle}>
      <Text style={styles.text}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { color: theme.colors.primaryDark, fontWeight: '800' },
});
