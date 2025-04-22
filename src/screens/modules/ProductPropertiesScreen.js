import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { getGoodByBarcode } from '../../database/db';



const ProductPropertiesScreen = () => {
  const [barcode, setBarcode] = useState('');
  const [good, setGood] = useState(null);

  const handleSearch = async () => {
    if (!barcode.trim()) {
      Alert.alert('Помилка', 'Введіть штрихкод');
      return;
    }

    const result = await getGoodByBarcode(barcode);
    if (result) {
      setGood(result);
    } else {
      setGood(null);
      Alert.alert('Не знайдено', 'Товар з таким штрихкодом не знайдено');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Введіть штрихкод товару</Text>

      <TextInput
        style={styles.input}
        placeholder="Штрихкод"
        value={barcode}
        onChangeText={setBarcode}
        keyboardType="numeric"
      />

      <Button title="Пошук" onPress={handleSearch} />

      {good && (
        <View style={styles.result}>
          <Text style={styles.resultText}>Штрихкод: {good.barCode}</Text>
          <Text style={styles.resultText}>Назва: {good.name}</Text>
          <Text style={styles.resultText}>Код товару: {good.goodCode}</Text>
        </View>
      )}
    </View>
  );
};

export default ProductPropertiesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 12,
    marginBottom: 12,
    borderRadius: 6,
  },
  result: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 6,
  },
});
