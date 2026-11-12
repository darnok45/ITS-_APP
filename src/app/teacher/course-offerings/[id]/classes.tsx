import { FlatList, RefreshControl } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { AppButton } from '@/components/ui/AppButton';
import { FeedbackState } from '@/components/ui/FeedbackState';
import { listStyles } from '@/components/ui/listStyles';
import { ClassSessionCard } from '@/components/attendance/ClassSessionCard';
import { useClassSessions } from '@/features/attendance/useClassSessions';

/** Clases registradas de la materia. Tocar una abre su planilla para consultar o corregir. */
export default function ClassHistoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { sessions, isLoading, isRefreshing, error, reload, refresh } = useClassSessions(id);
  const goToNewClass = () => router.push(`/teacher/course-offerings/${id}/new-class`);

  if (isLoading) return <FeedbackState variant="loading" title="Cargando clases…" />;
  if (error) return <FeedbackState variant="error" title="Error" description={error} actionLabel="Reintentar" onAction={reload} />;

  return (
    <Screen style={{ padding: 0 }}>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={listStyles.content}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}
        ListHeaderComponent={
          sessions.length > 0 ? (
            <SectionHeader title="Clases" subtitle={`${sessions.length} registradas`} />
          ) : undefined
        }
        ListEmptyComponent={
          <FeedbackState
            title="Todavía no hay clases"
            description="Creá la primera clase para empezar a tomar asistencia."
            actionLabel="Tomar asistencia"
            onAction={goToNewClass}
          />
        }
        ListFooterComponent={sessions.length > 0 ? <AppButton title="Nueva clase" variant="secondary" onPress={goToNewClass} /> : undefined}
        renderItem={({ item }) => (
          <ClassSessionCard session={item} onPress={() => router.push(`/teacher/class-sessions/${item.id}`)} />
        )}
      />
    </Screen>
  );
}
