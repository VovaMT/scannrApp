import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View, Image } from "react-native";
import { logo } from "assets";

// Екрани
import HomeScreen from "screens/HomeScreen/HomeScreen";
import SettingsScreen from "screens/SettingsScreen/SettingsScreen";
import DownloadScreen from "screens/DownloadScreen/DownloadScreen";

// Модулі
import { InventoryScreen, InventoryCardScreen } from "screens/Inventory";
import TransferScreen from "screens/Transfer";
import ReservationScreen from "screens/Reservation";
import ProductPropertiesScreen from "screens/ProductProperties";
import {
  PriceLabelScreen,
  PriceLabelListScreen,
  PriceLabelCardScreen,
} from "screens/PriceLabel";

// Авторизація
import {
  AuthLoadingScreen,
  RegistrationScreen,
  RestrictedScreen,
} from "screens/Authorization";

const Stack = createNativeStackNavigator();

const AppStack = () => (
  <Stack.Navigator
    initialRouteName="AuthLoading"
    screenOptions={({ navigation, route }) => {
      const hideHeaderFor = ["AuthLoading", "Registration", "Restricted"];
      const isHome = route.name === "Home";

      return {
        headerShown: !hideHeaderFor.includes(route.name),
        headerTitleAlign: "center",
        headerLeft: () =>
          isHome ? (
            <Image
              source={logo}
              style={{ width: 30, height: 30, marginLeft: 10 }}
              resizeMode="contain"
            />
          ) : (
            <Pressable
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 10 }}
            >
              <Ionicons name="arrow-back" size={24} />
            </Pressable>
          ),
        headerRight: () =>
          isHome && (
            <View style={{ flexDirection: "row", gap: 15 }}>
              <Pressable
                onPress={() => navigation.navigate("Download")}
                style={{ marginHorizontal: 5 }}
              >
                <Ionicons name="cloud-download-outline" size={24} />
              </Pressable>
              <Pressable
                onPress={() => navigation.navigate("Settings")}
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
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{ title: "Головна" }}
    />
    <Stack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{ title: "Налаштування" }}
    />
    <Stack.Screen
      name="Download"
      component={DownloadScreen}
      options={{ title: "Завантаження даних" }}
    />

    {/* Модулі */}
    <Stack.Screen
      name="Inventory"
      component={InventoryScreen}
      options={{ title: "Інвентаризація" }}
    />
    <Stack.Screen
      name="InventoryCard"
      component={InventoryCardScreen}
      options={{ title: "Інвентаризація" }}
    />
    <Stack.Screen
      name="Transfer"
      component={TransferScreen}
      options={{ title: "Переміщення" }}
    />
    <Stack.Screen
      name="Reservation"
      component={ReservationScreen}
      options={{ title: "Резервування" }}
    />
    <Stack.Screen
      name="ProductProperties"
      component={ProductPropertiesScreen}
      options={{ title: "Властивості товару" }}
    />
    <Stack.Screen
      name="PriceLabelScreen"
      component={PriceLabelScreen}
      options={{ title: "Цінники" }}
    />
    <Stack.Screen
      name="PriceLabelList"
      component={PriceLabelListScreen}
      options={{ title: "Список цінників" }}
    />
    <Stack.Screen
      name="PriceLabelCard"
      component={PriceLabelCardScreen}
      options={{ title: "Цінник" }}
    />

  </Stack.Navigator>
);

export default AppStack;
