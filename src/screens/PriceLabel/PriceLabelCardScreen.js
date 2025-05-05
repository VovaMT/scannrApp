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
          setQuantity(existing.quantity.toString());
        }
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

  const onPressMinus = () => {
    const current = parseInt(quantity || 0);
    const newQty = Math.max(1, current - 1);
    setQuantity(newQty.toString());
  };

  const onPressPlus = () => {
    const current = parseInt(quantity || 0);
    const newQty = current + 1;
    setQuantity(newQty.toString());
  };

  if (!good) return null;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Назва товару:</Text>
        <Text style={styles.value}>{good.name}</Text>

        <Text style={styles.label}>Код товару:</Text>
        <Text style={styles.value}>{good.goodCode}</Text>

        <Text style={styles.label}>Ціна:</Text>
        <Text style={styles.value}>{good.price}</Text>

        {existingQuantity !== null && isScanMode && (
          <Text style={styles.infoText}>
            Цей товар вже скановано. Поточна кількість: {existingQuantity}
          </Text>
        )}

        <Text style={styles.label}>Кількість цінників:</Text>
        <View style={styles.quantityRow}>
          <TouchableOpacity style={styles.circleButton} onPress={onPressMinus}>
            <Text style={styles.circleButtonText}>-</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.quantityInput}
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            placeholder="Кількість"
          />

          <TouchableOpacity style={styles.circleButton} onPress={onPressPlus}>
            <Text style={styles.circleButtonText}>+</Text>
          </TouchableOpacity>
        </View>

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
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#28a745",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  circleButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  quantityInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: "#fff",
    textAlign: "center",
  },
  infoText: {
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
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
