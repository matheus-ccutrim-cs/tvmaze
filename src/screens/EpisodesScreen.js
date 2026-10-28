import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RequestState from '../components/RequestState';

export default function EpisodesScreen({ route }) {
  const { id, name } = route.params ?? {};
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    async function loadEpisodes() {
      setLoading(true);
      setError(null);
      try {
        if (!Number.isInteger(id) || id <= 0) throw new Error('Identificador inválido');
        // O id recebido pela navegação compõe a URL usando template literal.
        const response = await fetch(`https://api.tvmaze.com/shows/${id}/episodes`, { signal: controller.signal });
        if (!response.ok) throw new Error(`Erro HTTP ${response.status}`);
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('Resposta inválida da API');
        if (active) setEpisodes(data.filter(episode => episode && Number.isInteger(episode.id)));
      } catch (err) {
        if (active && err.name !== 'AbortError') setError('Não foi possível carregar os episódios. Confira sua conexão e tente novamente.');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadEpisodes();
    return () => { active = false; controller.abort(); };
  }, [id, attempt]);

  return (
    <SafeAreaView style={styles.screen} edges={['bottom', 'left', 'right']}>
      {loading || error ? <RequestState loading={loading} error={error} onRetry={() => setAttempt(value => value + 1)} /> : (
        <FlatList
          data={episodes}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.list}
          ListHeaderComponent={<View style={styles.heading}><Text style={styles.eyebrow}>GUIA DE EPISÓDIOS</Text><Text style={styles.title}>{name ?? 'Série selecionada'}</Text><Text style={styles.meta}>{episodes.length} episódios • TVmaze</Text></View>}
          ListEmptyComponent={<Text style={styles.meta}>Esta série ainda não possui episódios cadastrados.</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.season}>Temporada {item.season ?? '—'} • Episódio {item.number ?? 'Especial'}</Text>
              <Text style={styles.name}>{item.name ?? 'Episódio sem nome'}</Text>
              <Text style={styles.meta}>{item.airdate || 'Data não informada'}{item.runtime != null ? ` • ${item.runtime} min` : ''}</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0b1120' },
  list: { padding: 20, gap: 12 },
  heading: { gap: 10, marginBottom: 14 },
  eyebrow: { color: '#68dfbd', fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  title: { color: '#f1f5f9', fontSize: 32, fontWeight: '800' },
  card: { backgroundColor: '#162238', borderRadius: 14, padding: 18, gap: 9 },
  season: { color: '#68dfbd', fontSize: 13, fontWeight: '600' },
  name: { color: '#f1f5f9', fontSize: 18, fontWeight: '700' },
  meta: { color: '#a8b5ca', fontSize: 13 },
});
