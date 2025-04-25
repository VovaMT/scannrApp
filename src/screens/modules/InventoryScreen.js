import React, { useEffect, useState, useLayoutEffect } from "react";
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { getInventoryItems, clearInventory } from "../../database/inventory";
import { getNameGoodByGoodCode } from "../../database/db";
import { Ionicons } from "@expo/vector-icons"; 


const InventoryScreen = ({ navigation }) => {
  const [items, setItems] = useState([]);

  const loadItems = async () => {
    const result = await getInventoryItems();
    setItems(result);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadItems);
    return unsubscribe;
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", gap: 15 }}>
           <TouchableOpacity onPress={uploadList}>
            <Ionicons name="cloud-upload-outline" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("InventoryScanScreen")}>
            <Ionicons name="scan-outline" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleClearList}>
            <Ionicons name="trash-outline" size={24} color="red" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

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

  return (
    <View style={styles.container}>
      {items.length === 0 ? (
        <Text style={styles.emptyText}>Список порожній</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text>{getNameGoodByGoodCode(item.goodCode)}</Text>
              <Text>{item.goodCode}</Text>
              <Text>Кількість: {item.quantity}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default InventoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  emptyText: {
    marginTop: 20,
    fontSize: 18,
    textAlign: "center",
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
});
