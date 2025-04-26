import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getInventoryItems, clearInventory } from "../../database/inventory";
import { getNameGoodByGoodCode } from "../../database/db";
import { CameraView, Camera } from "expo-camera";
import { getUseCameraSetting } from "../../utils/storage";

const InventoryScreen = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [barcode, setBarcode] = useState("");
  const [scannerVisible, setScannerVisible] = useState(false);
  const [permission, setPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [allowCamera, setAllowCamera] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadItems);
    return unsubscribe;
  }, [navigation]);

  const loadItems = async () => {
    const result = await getInventoryItems();
    const itemsWithNames = await Promise.all(result.map(async (item) => ({
      ...item,
      name: await getNameGoodByGoodCode(item.goodCode),
    })));
    setItems(itemsWithNames);
  };
  

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", gap: 15 }}>
          <TouchableOpacity onPress={uploadList}>
            <Ionicons name="cloud-upload-outline" size={24} color="black" />
          </TouchableOpacity>
          {allowCamera && (
            <TouchableOpacity onPress={openScanner}>
              <Ionicons name="scan-outline" size={24} color="black" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleClearList}>
            <Ionicons name="trash-outline" size={24} color="red" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, allowCamera]);

  useEffect(() => {
    const initPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setPermission(status === "granted");
      const allow = await getUseCameraSetting();
      setAllowCamera(allow);
    };
    initPermissions();
  }, []);

  const openScanner = () => {
    setScanned(false);
    setScannerVisible(true);
  };

  const barCodeScanned = async ({ data }) => {
    if (scanned) return;
    setScanned(true);
    setScannerVisible(false);
    navigation.navigate("InventoryCard", { barcode: data });

  };

  const handleClearList = () => {
    Alert.alert("Очистити список?", "", [
      { text: "Скасувати", style: "cancel" },
      {
        text: "Так",
        onPress: async () => {
          await clearInventory();
          loadItems();
        },
      },
    ]);
  };

  const uploadList = () => {
    Alert.alert("Надіслати результати?", "", [
      { text: "Скасувати", style: "cancel" },
      {
        text: "Так",
        onPress: async () => {
          await clearInventory();
          loadItems();
        },
      },
    ]);
  };

  const handleSearch = () => {
    const code = barcode.trim();
    if (code.length === 0) {
      Alert.alert("Помилка", "Введіть штрих-код");
      return;
    }
    setBarcode("");
    navigation.navigate("InventoryCard", { barcode: code });
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          value={barcode}
          onChangeText={setBarcode}
          style={styles.barcodeInput}
          placeholder="Введіть штрих-код"
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {items.length === 0 ? (
        <Text style={styles.emptyText}>Список порожній</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() =>
                navigation.navigate("InventoryCard", {
                  goodCode: item.goodCode,
                })
              }
            >
              <Text>{item.name}</Text>
              <Text>{item.goodCode}</Text>
              <Text>Кількість: {item.quantity}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <Modal visible={scannerVisible} animationType="slide">
        <View style={styles.scannerContainer}>
          {permission ? (
            <>
              <CameraView
                onBarcodeScanned={scanned ? undefined : barCodeScanned}
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

export default InventoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 10,
  },
  barcodeInput: {
    flex: 1,
    borderBottomWidth: 1,
    padding: 8,
    fontSize: 16,
  },
  emptyText: {
    marginTop: 20,
    fontSize: 18,
    textAlign: "center",
  },
  searchButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#ccc",
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
