import React, { useEffect, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RequestState from '../components/RequestState';

function ShowCard({ show, onPress }) {
  const [imageFailed, setImageFailed] = useState(false);
  const imageUrl = show.image?.medium ?? show.image?.original;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`Ver episódios de ${show.name}`} onPress={onPress} style={styles.card}>
      {imageUrl && !imageFailed ? (
        <Image source={{ uri: imageUrl }} style={styles.image} accessibilityLabel={`Pôster de ${show.name}`} onError={() => setImageFailed(true)} />
      ) : (
        <View style={[styles.image, styles.placeholder]}><Text style={styles.meta}>Sem imagem</Text></View>
      )}
      <View style={styles.info}>
        <Text style={styles.name}>{show.name ?? 'Série sem nome'}</Text>
        <Text style={styles.meta}>{show.genres?.join(' • ') || 'Gênero não informado'}</Text>
        <Text style={styles.link}>Ver episódios →</Text>
      </View>
    </Pressable>
  );
}

export default function ShowsScreen({ navigation }) {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    async function loadShows() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('https://api.tvmaze.com/shows', { signal: controller.signal });
        if (!response.ok) throw new Error(`Erro HTTP ${response.status}`);
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('Resposta inválida da API');
        if (active) setShows(data.filter(show => show && Number.isInteger(show.id)));
      } catch (err) {
        if (active && err.name !== 'AbortError') setError('Não foi possível carregar as séries. Confira sua conexão e tente novamente.');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadShows();
    return () => { active = false; controller.abort(); };
  }, [attempt]);

  return (
    <SafeAreaView style={styles.screen} edges={['bottom', 'left', 'right']}>
      {loading || error ? <RequestState loading={loading} error={error} onRetry={() => setAttempt(value => value + 1)} /> : (
        <FlatList
          data={shows}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.list}
          ListHeaderComponent={<View style={styles.heading}><Text style={styles.eyebrow}>DESCUBRA SUA PRÓXIMA HISTÓRIA</Text><Text style={styles.title}>Explore as séries</Text><Text style={styles.meta}>{shows.length} séries • Dados da TVmaze</Text></View>}
          ListEmptyComponent={<Text style={styles.meta}>Nenhuma série encontrada.</Text>}
          renderItem={({ item }) => <ShowCard show={item} onPress={() => navigation.navigate('Episodes', { id: item.id, name: item.name })} />}
        />
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0b1120' },
  list: { padding: 20, gap: 14 },
  heading: { gap: 9, marginBottom: 10 },
  eyebrow: { color: '#68dfbd', fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  title: { color: '#f1f5f9', fontSize: 30, fontWeight: '800' },
  card: { backgroundColor: '#162238', borderRadius: 16, flexDirection: 'row', overflow: 'hidden' },
  image: { width: 100, height: 146, backgroundColor: '#24324a' },
  placeholder: { justifyContent: 'center', alignItems: 'center' },
  info: { flex: 1, padding: 16, justifyContent: 'center', gap: 10 },
  name: { color: '#f1f5f9', fontSize: 19, fontWeight: '700' },
  meta: { color: '#a8b5ca', fontSize: 13, lineHeight: 20 },
  link: { color: '#68dfbd', fontWeight: '600', fontSize: 13 },
});
