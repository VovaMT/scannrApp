import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import DownloadScreen from './src/screens/DownloadScreen';
import InventoryScreen from './src/screens/InventoryScreen';
import TransferScreen from './src/screens/TransferScreen';
import ReservationScreen from './src/screens/ReservationScreen';
import ProductPropertiesScreen from './src/screens/ProductPropertiesScreen';
import { Provider as PaperProvider } from 'react-native-paper';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={({ navigation, route }) => ({
          headerTitleAlign: 'center',
          headerLeft: () =>
            route.name !== 'Home' && (
              <Pressable onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
                <Ionicons name="arrow-back" size={24} />
              </Pressable>
            ),
          headerRight: () => (
            <View style={{ flexDirection: 'row', gap: 15 }}>
              <Pressable onPress={() => navigation.navigate('Download')} style={{ marginHorizontal: 5 }}>
                <Ionicons name="cloud-download-outline" size={24} />
              </Pressable>
              <Pressable onPress={() => navigation.navigate('Settings')} style={{ marginHorizontal: 5 }}>
                <Ionicons name="settings-outline" size={24} />
              </Pressable>
            </View>
          ),
        })}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Головна' }} />
        <Stack.Screen name="Download" component={DownloadScreen} options={{ title: 'Завантаження даних' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Налаштування' }} />
        <Stack.Screen name="Inventory" component={InventoryScreen} options={{ title: 'Інвентаризація' }} />
        <Stack.Screen name="Transfer" component={TransferScreen} options={{ title: 'Переміщення' }} />
        <Stack.Screen name="Reservation" component={ReservationScreen} options={{ title: 'Резервування' }} />
        <Stack.Screen name="ProductProperties" component={ProductPropertiesScreen} options={{ title: 'Властивості товару' }} />

      </Stack.Navigator>
    </NavigationContainer>
    </PaperProvider>
  );
}
