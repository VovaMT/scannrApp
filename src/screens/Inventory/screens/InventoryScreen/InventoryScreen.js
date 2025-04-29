import React, { useEffect, useState, useLayoutEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, Keyboard, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import InventoryItem from "./InventoryItem";
import { getInventoryGood, clearInventory, deleteInventoryGood } from "services/database/inventoryService";
import { getNameGoodByGoodCode } from "services/database/goodsService";
import BarcodeScanner from "components/BarcodeScanner";
import { getUseCameraSetting } from "services/storage/userStorage";
import styles from "./styles";

const InventoryScreen = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [barcode, setBarcode] = useState("");
  const [barcodeScanned, setBarcodeScanned] = useState("");
  const [scannerVisible, setScannerVisible] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [allowCamera, setAllowCamera] = useState(false);
  const hiddenInputRef = useRef(null);

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

  const loadItems = async () => {
    const result = await getInventoryGood();
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

  const openScanner = () => {
    setScanned(false);
    setScannerVisible(true);
  };

  const handleDeleteItem = async (goodCode) => {
    try {
      await deleteInventoryGood(goodCode);
      setItems((prevItems) => prevItems.filter((item) => item.goodCode !== goodCode));
    } catch (error) {
      console.error("Помилка видалення товару:", error);
      Alert.alert("Помилка", "Не вдалося видалити товар");
    }
  };

  const handlePressItem = (goodCode) => {
    navigation.navigate("InventoryCard", { goodCode });
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

  const barcodeInput = (text) => {
    setBarcodeScanned(text);

    if (text.length === 13) {
      navigation.navigate("InventoryCard", { barcode: text });
      setBarcodeScanned("");
    }
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
      {/* Приховане поле для сканера */}
      <TextInput
        ref={hiddenInputRef}
        style={{ height: 0, width: 0, opacity: 0 }}
        autoFocus
        value={barcodeScanned}
        onChangeText={barcodeInput}
        keyboardType="numeric"
        showSoftInputOnFocus={false}
      />

      {/* Пошук вручну */}
      <View style={styles.inputRow}>
        <TextInput
          value={barcode}
          onChangeText={setBarcode}
          style={styles.barcodeInput}
          placeholder="Введіть штрих-код"
          keyboardType="numeric"
          showSoftInputOnFocus={true}
        />

        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Список */}
      {items.length === 0 ? (
        <Text style={styles.emptyText}>Список порожній</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <InventoryItem
              item={item}
              onDelete={handleDeleteItem}
              onPress={() => handlePressItem(item.goodCode)}
            />
          )}
        />
      )}

      {/* Сканер */}
      <BarcodeScanner
        visible={scannerVisible}
        onClose={() => setScannerVisible(false)}
        onScanned={({ data }) => {
          if (!scanned) {
            setScanned(true);
            setScannerVisible(false);
            navigation.navigate("InventoryCard", { barcode: data });
          }
        }}
      />
    </View>
  );
};

export default InventoryScreen;
