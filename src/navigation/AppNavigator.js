import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Основні екрани
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import DownloadScreen from '../screens/DownloadScreen';

// Модулі
import InventoryScreen from '../screens/modules/InventoryScreen';
import TransferScreen from '../screens/modules/TransferScreen';
import ReservationScreen from '../screens/modules/ReservationScreen';
import ProductPropertiesScreen from '../screens/modules/ProductPropertiesScreen';

// Авторизаційні екрани
import AuthLoadingScreen from '../auth/AuthLoadingScreen';
import RegistrationScreen from '../auth/RegistrationScreen';
import RestrictedScreen from '../auth/RestrictedScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="AuthLoading"
      screenOptions={({ navigation, route }) => {
        const hideHeaderFor = ['AuthLoading', 'Registration', 'Restricted'];

        return {
          headerShown: !hideHeaderFor.includes(route.name),
          headerTitleAlign: 'center',
          headerLeft: () =>
            route.name !== 'Home' && !hideHeaderFor.includes(route.name) && (
              <Pressable onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
                <Ionicons name="arrow-back" size={24} />
              </Pressable>
            ),
          headerRight: () =>
            !hideHeaderFor.includes(route.name) && (
              <View style={{ flexDirection: 'row', gap: 15 }}>
                <Pressable
                  onPress={() => navigation.navigate('Download')}
                  style={{ marginHorizontal: 5 }}
                >
                  <Ionicons name="cloud-download-outline" size={24} />
                </Pressable>
                <Pressable
                  onPress={() => navigation.navigate('Settings')}
                  style={{ marginHorizontal: 5 }}
                >
                  <Ionicons name="settings-outline" size={24} />
                </Pressable>
              </View>
            ),
        };
      }}
    >
      {/* Авторизація */}
      <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} />
      <Stack.Screen name="Registration" component={RegistrationScreen} />
      <Stack.Screen name="Restricted" component={RestrictedScreen} />

      {/* Основні екрани */}
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Головна' }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Налаштування' }} />
      <Stack.Screen name="Download" component={DownloadScreen} options={{ title: 'Завантаження даних' }} />

      {/* Модулі */}
      <Stack.Screen name="Inventory" component={InventoryScreen} options={{ title: 'Інвентаризація' }} />
      <Stack.Screen name="Transfer" component={TransferScreen} options={{ title: 'Переміщення' }} />
      <Stack.Screen name="Reservation" component={ReservationScreen} options={{ title: 'Резервування' }} />
      <Stack.Screen name="ProductProperties" component={ProductPropertiesScreen} options={{ title: 'Властивості товару' }} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
