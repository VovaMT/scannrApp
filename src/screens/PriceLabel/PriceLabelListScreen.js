import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BarcodeScanner from "components/BarcodeScanner";
import PriceLabelItem from "./PriceLabelItem";
import {
  getGoodsOperationsByType,
  deleteGoodsOperation,
  clearGoodsOperationsByType,
  getAllGoodsOperationsByType,
} from "services/database/goodsOperationsService";
import { getNameGoodByGoodCode } from "services/database/goodsService";
import { getUseCameraSetting } from "services/storage/userStorage";
import { uploadInventory } from "services/api/inventoryApi";

const PRICE_LABEL_TYPE = 2;

const PriceLabelListScreen = ({ navigation, route }) => {
  const { mode } = route.params; // check або print
  const [items, setItems] = useState([]);
  const [barcode, setBarcode] = useState("");
  const [barcodeScanned, setBarcodeScanned] = useState("");
  const [scannerVisible, setScannerVisible] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [allowCamera, setAllowCamera] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const hiddenInputRef = useRef(null);
  const activeSwipeRef = useRef(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadItems();
      loadSettings();
      setTimeout(() => {
        hiddenInputRef.current?.focus();
      }, 500);
    });
    return unsubscribe;
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View 
        style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            minWidth: 100,
            marginRight: 10,
          }}
          >
          {allowCamera && (
            <TouchableOpacity onPress={openScanner} style={{ marginRight: 15 }}>
              <Ionicons name="scan-outline" size={24} color="black" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={uploadList}>
            <Ionicons name="cloud-upload-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, allowCamera]);

  const openScanner = () => {
    closeActiveSwipe();
    setScanned(false);
    setScannerVisible(true);
  };

  const loadItems = async () => {
    const result = await getGoodsOperationsByType(PRICE_LABEL_TYPE);
    const itemsWithNames = await Promise.all(
      result.map(async (item) => ({
        ...item,
        name: await getNameGoodByGoodCode(item.goodCode),
      }))
    );
    setItems(itemsWithNames);
  };

  const loadSettings = async () => {
    const allow = await getUseCameraSetting();
    setAllowCamera(allow);
  };

  const closeActiveSwipe = () => {
    if (activeSwipeRef.current?.close) {
      activeSwipeRef.current.close();
      activeSwipeRef.current = null;
    }
  };

  const handleDeleteItem = async (goodCode) => {
    try {
      await deleteGoodsOperation(goodCode, PRICE_LABEL_TYPE);
      setItems((prev) => prev.filter((item) => item.goodCode !== goodCode));
    } catch (error) {
      Alert.alert("Помилка", "Не вдалося видалити товар");
    }
  };

  const handleSearch = () => {
    const code = barcode.trim();
    if (code.length === 0) {
      Alert.alert("Помилка", "Введіть штрих-код");
      return;
    }
    closeActiveSwipe();
    setBarcode("");
    navigation.navigate("PriceLabelCard", { barcode: code, mode });
  };

  const barcodeInput = (text) => {
    setBarcodeScanned(text);
    if (text.length === 13) {
      closeActiveSwipe();
      navigation.navigate("PriceLabelCard", { barcode: text, mode });
      setBarcodeScanned("");
    }
  };

  const uploadList = () => {
    closeActiveSwipe();
    Alert.alert("Надіслати цінники?", "", [
      { text: "Скасувати", style: "cancel" },
      {
        text: "Так",
        onPress: async () => {
          const success = await sendPriceLabels();
          if (success) {
            await clearGoodsOperationsByType(PRICE_LABEL_TYPE);
            loadItems();
          }
        },
      },
    ]);
  };

  const sendPriceLabels = async () => {
    try {
      const items = await getAllGoodsOperationsByType(PRICE_LABEL_TYPE);
      const deviceKey = await AsyncStorage.getItem("device_key");

      if (!deviceKey) {
        Alert.alert("Помилка", "Ключ пристрою не знайдено");
        return false;
      }

      if (!items.length) {
        Alert.alert("Список порожній");
        return false;
      }

      await uploadInventory(items, deviceKey);
      Alert.alert("Успіх", "Цінники надіслано на сервер");
      return true;
    } catch (error) {
      Alert.alert("Помилка", error.message || "Не вдалося надіслати цінники");
      return false;
    }
  };

  const renderOverlay = () => {
    if (!uploadStatus) return null;

    let message = "";
    if (uploadStatus === "loading") message = "Відправлення...";
    if (uploadStatus === "success") message = "✅ Успішно надіслано";
    if (uploadStatus === "error") message = "❌ Помилка відправки";

    return (
      <View style={styles.overlay}>
        <View style={styles.overlayBox}>
          {uploadStatus === "loading" ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <Text style={styles.overlayText}>{message}</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={() => { closeActiveSwipe(); Keyboard.dismiss(); }}>
      <View style={styles.container}>
        <TextInput
          ref={hiddenInputRef}
          style={{ height: 0, width: 0, opacity: 0 }}
          autoFocus
          value={barcodeScanned}
          onChangeText={barcodeInput}
          keyboardType="numeric"
          showSoftInputOnFocus={false}
        />

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
            keyExtractor={(item) => item.goodCode}
            renderItem={({ item }) => (
              <PriceLabelItem
                item={item}
                onDelete={handleDeleteItem}
                onPress={() => navigation.navigate("PriceLabelCard", { goodCode: item.goodCode, mode })}
                onCloseOthers={closeActiveSwipe}
                registerSwipe={(ref) => {
                  closeActiveSwipe();
                  activeSwipeRef.current = ref;
                }}
              />
            )}
          />
        )}

        <BarcodeScanner
          visible={scannerVisible}
          onClose={() => setScannerVisible(false)}
          onScanned={({ data }) => {
            if (!scanned) {
              setScanned(true);
              setScannerVisible(false);
              closeActiveSwipe();
              navigation.navigate("PriceLabelCard", { barcode: data, mode });
            }
          }}
        />
        {renderOverlay()}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default PriceLabelListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  inputRow: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
    gap: 10,
  },
  barcodeInput: {
    flex: 1,
    borderBottomWidth: 1,
    padding: 8,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 30,
    color: "#888",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayBox: {
    backgroundColor: "#333",
    padding: 20,
    borderRadius: 10,
  },
  overlayText: {
    color: "#fff",
    fontSize: 18,
  },
});
