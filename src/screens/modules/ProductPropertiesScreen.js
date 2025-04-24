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

const ProductPropertiesScreen = () => {
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
      <Text style={styles.title}>Введіть або відскануйте штрихкод</Text>

      <TextInput
        style={styles.input}
        placeholder="Штрихкод"
        value={barcode}
        onChangeText={setBarcode}
        keyboardType="numeric"
      />

      <View style={styles.buttonRow}>
        <Button title="Пошук" onPress={handleSearch} />
        <View style={{ width: 10 }} />
        <Button
          title="Сканувати"
          onPress={() => {
            setScanned(false);
            setScannerVisible(true);
          }}
        />
      </View>

      {good && (
        <View style={styles.result}>
          <Text style={styles.resultText}>Штрихкод: {good.barCode}</Text>
          <Text style={styles.resultText}>Назва: {good.name}</Text>
          <Text style={styles.resultText}>Код товару: {good.goodCode}</Text>
        </View>
      )}

      <Modal visible={scannerVisible} animationType="slide">
        <View style={styles.scannerContainer}>
          {permission ? (
            <>
              <CameraView
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                  barcodeTypes: ["qr", "code128", "ean13", "ean8"],
                }}
                style={StyleSheet.absoluteFillObject}
              />
              <TouchableOpacity
                onPress={() => setScannerVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeText}>Закрити</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.permissionText}>Немає доступу до камери</Text>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default ProductPropertiesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 12,
    marginBottom: 12,
    borderRadius: 6,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  result: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 6,
  },
  scannerContainer: {
    flex: 1,
    justifyContent: "center",
  },
  closeButton: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 8,
  },
  closeText: {
    color: "#fff",
    fontSize: 16,
  },
  permissionText: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
    marginTop: 100,
  },
});
