import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import {
  addGoodsOperation,
  updateGoodsOperationQuantity,
  getGoodsOperationByCodeAndType,
} from "services/database/goodsOperationsService";
import {
  getGoodByBarcode,
  getGoodByGoodcode,
  findGoodByMaskPrefix,
} from "services/database/goodsService";
import { validateQuantityInput } from "utils/inputUtils";
import { parseWeightBarcode } from "utils/parseWeightBarcode";
import styles from "./styles";

const INVENTORY_TYPE = 1;

const InventoryCardScreen = ({ navigation, route }) => {
  const { barcode, goodCode } = route.params;
  const [good, setGood] = useState(null);
  const [quantity, setQuantity] = useState("1");
  const [existingQuantity, setExistingQuantity] = useState(null);
  const [step, setStep] = useState(1);
  const isQuantityValid = parseFloat(quantity) > 0;
  const isScanMode = !!barcode;

  useEffect(() => {
    const loadGood = async () => {
      let result = null;
      let resolvedQuantity = "1";

      if (barcode) {
        result = await getGoodByBarcode(barcode);

        if (!result) {
          const parsed = parseWeightBarcode(barcode);
          if (parsed) {
            result = await findGoodByMaskPrefix(parsed.barCode);
            if (result) {
              resolvedQuantity = parsed.weightInKg.toString();
            }
          }
        }
      } else if (goodCode) {
        result = await getGoodByGoodcode(goodCode);
      }

      if (!result) {
        Alert.alert("Помилка", "Товар не знайдено");
        navigation.goBack();
        return;
      }

      setGood(result);
      setStep(result.isWeightGood ? 0.1 : 1);

      const existing = await getGoodsOperationByCodeAndType(result.goodCode, INVENTORY_TYPE);
      if (existing) {
        setExistingQuantity(existing.quantity);
        setQuantity(!isScanMode ? existing.quantity.toString() : resolvedQuantity);
      } else {
        setQuantity(resolvedQuantity);
      }
    };

    loadGood();
  }, [barcode, goodCode]);

  const save = async () => {
    if (!good) return;

    const numericQuantity = parseFloat(quantity || 0);
    const isWeight = good.isWeightGood;

    if (
      (isWeight && (numericQuantity < 0.001 || numericQuantity > 10000)) ||
      (!isWeight && (numericQuantity < 1 || numericQuantity > 10000)) ||
      (!isWeight && !Number.isInteger(numericQuantity))
    ) {
      Alert.alert("Некоректна кількість");
      return;
    }

    if (existingQuantity !== null) {
      const finalQuantity = isScanMode
        ? Math.round((existingQuantity + numericQuantity) * 1000) / 1000
        : numericQuantity;

      await updateGoodsOperationQuantity(good.goodCode, finalQuantity, INVENTORY_TYPE);
    } else {
      await addGoodsOperation(good.goodCode, numericQuantity, INVENTORY_TYPE);
    }

    navigation.goBack();
  };
  

  if (!good) return null;

  const onPressMinus = () => {
    const current = parseFloat(quantity || 0);
    const newQty = Math.max(step, Math.round((current - step) * 1000) / 1000);
    setQuantity(newQty.toString());
  };

  const onPressPlus = () => {
    const current = parseFloat(quantity || 0);
    const newQty = Math.round((current + step) * 1000) / 1000;
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
            onChangeText={(text) => {
              const validated = validateQuantityInput(text, good?.isWeightGood);
              if (validated !== null) {
                setQuantity(validated);
              }
            }}
            keyboardType="numeric"
            placeholder="Кількість"
          />

          <TouchableOpacity style={styles.circleButton} onPress={onPressPlus}>
            <Text style={styles.circleButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, !isQuantityValid && { opacity: 0.4 }]}
          onPress={save}
          disabled={!isQuantityValid}
        >
          <Text style={styles.saveButtonText}>ЗБЕРЕГТИ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InventoryCardScreen;
