import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import ShowsScreen from './src/screens/ShowsScreen';
import EpisodesScreen from './src/screens/EpisodesScreen';

const Stack = createNativeStackNavigator();
const theme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: '#0b1120', card: '#111b2e', primary: '#68dfbd' },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#111b2e" />
      <NavigationContainer theme={theme}>
        <Stack.Navigator screenOptions={{ headerTintColor: '#f1f5f9', headerStyle: { backgroundColor: '#111b2e' }, contentStyle: { backgroundColor: '#0b1120' } }}>
          <Stack.Screen name="Shows" component={ShowsScreen} options={{ title: 'TVmaze • Séries' }} />
          <Stack.Screen name="Episodes" component={EpisodesScreen} options={{ title: 'Episódios' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
