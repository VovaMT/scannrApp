import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import {
  addOrUpdateInventoryItem,
  getInventoryGoodByGoodCode,
} from "../../database/inventory";
import {
  getGoodByBarcode,
  getGoodByGoodcode,
} from "../../database/db";

const InventoryCardScreen = ({ navigation, route }) => {
  const { barcode, goodCode } = route.params;

  const [good, setGood] = useState(null);
  const [quantity, setQuantity] = useState("1");
  const [existingQuantity, setExistingQuantity] = useState(null);
  const [step, setStep] = useState(1);
  const isScanMode = !!barcode;

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

      if (result.isWeightGood) {
        setStep(0.1);
      } else {
        setStep(1);
      }

      const existing = await getInventoryGoodByGoodCode(result.goodCode);
      if (existing) {
        setExistingQuantity(existing.quantity);

        if (!isScanMode) {
          // Якщо редагування
          setQuantity(existing.quantity.toString());
        } else {
          // Якщо повторне сканування
          setQuantity(result.isWeightGood ? "0.1" : "1");
        }
      } else {
        // Якщо товар новий
        setQuantity(result.isWeightGood ? "0.1" : "1");
      }
    };

    loadGood();
  }, [barcode, goodCode]);

  const save = async () => {
    if (!good) return;

    const numericQuantity = parseFloat(quantity || 0);

    if (isScanMode) {
      const totalQuantity = existingQuantity
        ? Math.round((existingQuantity + numericQuantity) * 1000) / 1000
        : numericQuantity;

      await addOrUpdateInventoryItem(good.goodCode, totalQuantity, 1);
    } else {
      await addOrUpdateInventoryItem(good.goodCode, numericQuantity, 1);
    }

    navigation.goBack();
  };

  if (!good) return null;

  const onPressMinus = () => {
    let current = parseFloat(quantity || 0);
    let newQty = Math.max(0, Math.round((current - step) * 1000) / 1000);
    setQuantity(newQty.toString());
  };

  const onPressPlus = () => {
    let current = parseFloat(quantity || 0);
    let newQty = Math.round((current + step) * 1000) / 1000;
    setQuantity(newQty.toString());
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {barcode && (
          <>
            <Text style={styles.label}>Штрих-код:</Text>
            <Text style={styles.value}>{barcode}</Text>
          </>
        )}

        <Text style={styles.label}>Назва товару:</Text>
        <Text style={styles.value}>{good.name}</Text>

        <Text style={styles.label}>Код товару:</Text>
        <Text style={styles.value}>{good.goodCode}</Text>

        {existingQuantity !== null && isScanMode && (
          <Text style={styles.infoText}>
            Цей товар вже скановано. Поточна кількість: {existingQuantity}
          </Text>
        )}

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

export default InventoryCardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 10,
  },
  card: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    gap: 10,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
  },
  value: {
    fontSize: 16,
  },
  infoText: {
    color: "#ff0000",
    marginTop: 10,
    fontStyle: "italic",
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 10,
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
  },
  circleButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  quantityInput: {
    borderBottomWidth: 1,
    textAlign: "center",
    padding: 8,
    minWidth: 80,
    fontSize: 16,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
