import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { initDB, clearGoods, insertGoods } from '../database/db';

const API_URL = 'http://10.0.2.2:8080/good';

const DownloadScreen = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const fetchAndStoreGoods = async () => {
    try {
      setLoading(true);
      setProgress(0.1); // Початковий прогрес
      await initDB();

      setProgress(0.3); // Прогрес після ініціалізації бази даних

      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Помилка при отриманні даних з сервера');
      }

      const goods = await response.json();

      setProgress(0.6); // Прогрес після отримання даних
      
      console.log('Отримано товари:', goods);

      // Очищаємо таблицю перед вставкою нових даних
      await clearGoods();

      setProgress(0.8); // Прогрес після очищення таблиці

      // Вставляємо нові дані
      await insertGoods(goods);

      setProgress(1); // Завершення завантаження

      Alert.alert('Успіх', 'Дані успішно збережено у SQLite!');
    } catch (error) {
      console.error('Помилка завантаження:', error);
      Alert.alert('Помилка', error.message || 'Не вдалося завантажити дані');
    } finally {
      setLoading(false);
      setProgress(0); // Скидаємо прогрес
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Завантажити дані з сервера</Text>
      <Text>Прогресбар має бути нижче</Text>
  
      {/* Цей прогресбар показується завжди */}
      <ProgressBar progress={0.5} color="red" style={styles.progressBarStatic} />
  
      <Button
        title="Завантажити"
        onPress={fetchAndStoreGoods}
        disabled={loading}
      />
  
      {/* Цей прогресбар показується тільки під час завантаження */}
      {loading && (
        <>
          <ProgressBar progress={progress} color="#FF0000" style={styles.progressBar} />
          <ActivityIndicator size="large" style={{ marginTop: 20 }} />
        </>
      )}
    </View>
  );
  
};
export default DownloadScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 },
  title: { 
    fontSize: 20, 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  progressBarStatic: {
    width: '80%',
    height: 20,
    marginVertical: 10,
  },
  progressBar: {
    width: '80%',
    height: 10,
    marginTop: 20,
  },
});