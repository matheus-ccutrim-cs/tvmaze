import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

export default function RequestState({ loading, error, onRetry }) {
  return (
    <View style={styles.container}>
      {loading ? (
        <>
          <ActivityIndicator size="large" color="#68dfbd" />
          <Text style={styles.text}>Carregando...</Text>
        </>
      ) : (
        <>
          <Text accessibilityRole="alert" style={styles.text}>{error}</Text>
          <Pressable accessibilityRole="button" onPress={onRetry} style={styles.button}>
            <Text style={styles.buttonText}>Tentar novamente</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 28, gap: 18 },
  text: { color: '#cbd5e1', textAlign: 'center', fontSize: 16 },
  button: { backgroundColor: '#68dfbd', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12 },
  buttonText: { color: '#0b1120', fontWeight: '700' },
});
