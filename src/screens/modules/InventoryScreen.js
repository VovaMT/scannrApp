import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, Camera } from "expo-camera";
import { getGoodByBarcode } from "../../database/db";



const InventoryScreen = () => {
  const [barcode, setBarcode] = useState("");
  const [good, setGood] = useState(null);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [permission, setPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setPermission(status === "granted");
    };
    getPermissions();
  }, []);

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => {
            setScanned(false);
            setScannerVisible(true);
          }}
          style={{ marginRight: 15 }}
        >
          <Ionicons name="camera-outline" size={24} />
        </Pressable>
      ),
    });
  }, [navigation]);

  const handleSearch = async () => {
    if (!barcode.trim()) {
      Alert.alert("Помилка", "Введіть штрихкод");
      return;
    }

    const result = await getGoodByBarcode(barcode);
    if (result) {
      setGood(result);
    } else {
      setGood(null);
      Alert.alert("Не знайдено", "Товар з таким штрихкодом не знайдено");
    }
  };

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    setScannerVisible(false);
    setBarcode(data);
  };

  return (
    <View style={styles.container}>
    <Text style={styles.text}>Модуль інвентаризації</Text>
  </View>
  );
};


export default InventoryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 18 },
});
