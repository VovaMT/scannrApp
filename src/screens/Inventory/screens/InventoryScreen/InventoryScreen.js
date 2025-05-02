import React, { useEffect, useState, useLayoutEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import InventoryItem from "./InventoryItem";
import {
  getInventoryGood,
  clearInventory,
  deleteInventoryGood,
  getAllInventoryItems,
} from "services/database/inventoryService";
import { getNameGoodByGoodCode } from "services/database/goodsService";
import BarcodeScanner from "components/BarcodeScanner";
import { getUseCameraSetting } from "services/storage/userStorage";
import { syncInventory } from "services/api/inventoryApi";
import styles from "./styles";

const InventoryScreen = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [barcode, setBarcode] = useState("");
  const [barcodeScanned, setBarcodeScanned] = useState("");
  const [scannerVisible, setScannerVisible] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [allowCamera, setAllowCamera] = useState(false);
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

  const closeActiveSwipe = () => {
    if (activeSwipeRef.current && activeSwipeRef.current.close) {
      activeSwipeRef.current.close();
      activeSwipeRef.current = null;
    }
  };

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
    closeActiveSwipe();
    navigation.navigate("InventoryCard", { goodCode });
  };

  const uploadList = () => {
    closeActiveSwipe();
    Alert.alert("Надіслати результати?", "", [
      { text: "Скасувати", style: "cancel" },
      {
        text: "Так",
        onPress: async () => {
          const success = await sendInventory();
          if (success) {
            await clearInventory();
            loadItems();
          }
        },
      },
    ]);
  };
  

  const sendInventory = async () => {
    try {
      const items = await getAllInventoryItems();
      const deviceKey = await AsyncStorage.getItem("device_key");
  
      if (!deviceKey) {
        Alert.alert("Помилка", "Ключ пристрою не знайдено");
        return false;
      }
  
      if (!items.length) {
        Alert.alert("Список порожній");
        return false;
      }
  
      await syncInventory(items, deviceKey);
      Alert.alert("Успіх", "Інвентаризацію надіслано на сервер");
      return true;
    } catch (error) {
      console.error("Помилка відправки інвентаризації:", error);
      Alert.alert("Помилка", error.message || "Не вдалося надіслати інвентаризацію");
      return false;
    }
  };
  

  const handleClearList = () => {
    closeActiveSwipe();
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
      closeActiveSwipe();
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
    closeActiveSwipe();
    setBarcode("");
    navigation.navigate("InventoryCard", { barcode: code });
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        closeActiveSwipe();
        Keyboard.dismiss();
      }}
    >
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
            showSoftInputOnFocus={true}
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
              <InventoryItem
                item={item}
                onDelete={handleDeleteItem}
                onPress={() => handlePressItem(item.goodCode)}
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
              navigation.navigate("InventoryCard", { barcode: data });
            }
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default InventoryScreen;
