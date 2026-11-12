/**
 * Tokens visuales centralizados (Clase 10).
 * Si cambia el color institucional, se cambia acá y no en 20 pantallas.
 */
export const theme = {
  colors: {
    primary: '#0E6FB8',
    primaryDark: '#0A4F85',
    primarySoft: '#E3F0FA',
    secondary: '#8EC644',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    text: '#0F172A',
    muted: '#64748B',
    border: '#CBD5E1',
    danger: '#DC2626',
    dangerSoft: '#FEE2E2',
    success: '#16A34A',
    successSoft: '#DCFCE7',
    warning: '#D97706',
    warningSoft: '#FEF3C7',
    info: '#7C3AED',
    infoSoft: '#EDE9FE',
  },
  spacing: { xs: 6, sm: 10, md: 16, lg: 24, xl: 32 },
  radius: { sm: 8, md: 12, lg: 18, pill: 999 },
  typography: { title: 26, subtitle: 18, body: 15, small: 13 },
} as const;
