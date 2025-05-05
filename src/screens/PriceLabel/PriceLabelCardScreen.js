import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import {
  addGoodsOperation,
  updateGoodsOperationQuantity,
  getGoodsOperationByCodeAndType,
} from "services/database/goodsOperationsService";
import {
  getGoodByBarcode,
  getGoodByGoodcode,
} from "services/database/goodsService";

const PRICE_LABEL_TYPE = 2;

const PriceLabelCardScreen = ({ navigation, route }) => {
  const { barcode, goodCode, mode } = route.params;
  const isScanMode = !!barcode;

  const [good, setGood] = useState(null);
  const [quantity, setQuantity] = useState("1");
  const [existingQuantity, setExistingQuantity] = useState(null);

  useEffect(() => {
    const loadGood = async () => {
      let result = null;

      if (barcode) {
        result = await getGoodByBarcode(barcode);
      } else if (goodCode) {
        result = await getGoodByGoodcode(goodCode);
      }

      if (!result) {
        Alert.alert("Помилка", "Товар не знайдено");
        navigation.goBack();
        return;
      }

      setGood(result);

      const existing = await getGoodsOperationByCodeAndType(result.goodCode, PRICE_LABEL_TYPE);
      if (existing) {
        setExistingQuantity(existing.quantity);
        if (!isScanMode) {
          setQuantity(existing.quantity.toString()); // редагування
        }
      }

      if (isScanMode) {
        setQuantity("1"); // сканування
      }
    };

    loadGood();
  }, [barcode, goodCode]);

  const save = async () => {
    if (!good) return;

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      Alert.alert("Некоректна кількість", "Введіть правильну кількість");
      return;
    }

    if (existingQuantity !== null) {
      const total = isScanMode ? existingQuantity + qty : qty;
      await updateGoodsOperationQuantity(good.goodCode, total, PRICE_LABEL_TYPE);
    } else {
      await addGoodsOperation(good.goodCode, qty, PRICE_LABEL_TYPE);
    }

    navigation.goBack();
  };

  if (!good) return null;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Кількість цінників:</Text>
        <TextInput
          style={styles.quantityInput}
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
          placeholder="Кількість"
        />
        <TouchableOpacity style={styles.saveButton} onPress={save}>
          <Text style={styles.saveButtonText}>ЗБЕРЕГТИ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PriceLabelCardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: "#28a745",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
