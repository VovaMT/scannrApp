import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Switch } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { saveUserData, getUserData, clearUserData } from '../utils/storage';

const API_BASE_URL = 'http://10.0.2.2:8080';

const SettingsScreen = () => {
    const [name, setName] = useState('');
    const [deviceKey, setDeviceKey] = useState('');
    const [hasLicense, setHasLicense] = useState(false);
    const [keyLicense, setLicenseKey] = useState('');
    const [registerDisabled, setRegisterDisabled] = useState(false);
    const [useCamera, setUseCamera] = useState(false);

  

    useEffect(() => {
        const init = async () => {
          const { name, key, license } = await getUserData();
          if (name) setName(name);
          if (license) setLicenseKey(license);
          
          if (key) {
              const response = await fetch(`${API_BASE_URL}/check-license?key=${key}`);
              const data = await response.json();
              if (data.status === 'LICENSED') {
                setDeviceKey(key);
                setHasLicense(true);
                setRegisterDisabled(true);
                if(data.keyLicense){
                    setLicenseKey(data.keyLicense);
                    await AsyncStorage.setItem('key_license',data.keyLicense);
                }
            } else if (data.status === 'USER_NOT_FOUND') {
                await clearUserData();
                setName('');
                setDeviceKey('');
                setHasLicense(false);
                setRegisterDisabled(false);
                Alert.alert('Помилка','Користувача не знайдено');
              } else {
                setDeviceKey(key);
                setRegisterDisabled(true);
              }
          }
          
        };
    
        init();
      }, []);
    
      const handleRegister = async () => {
        const newKey = uuid.v4();
          const response = await fetch(`${API_BASE_URL}/registration`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, key: newKey }),
          });
    
          if (response.status === 201) {
            await saveUserData(name, newKey);
            setDeviceKey(newKey);
            setRegisterDisabled(true);
          } else {
            const error = await response.json();
            Alert.alert('Помилка', error.error);
          }
      };
    
      return (
        <View style={styles.container}>
          {!hasLicense && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Ім'я користувача"
                value={name}
                onChangeText={setName}
              />
              <Text style={styles.text}>
                Ключ пристрою: {deviceKey ? deviceKey : '-'}
              </Text>
              <Button
                title="Зареєструватись"
                onPress={handleRegister}
                disabled={registerDisabled || !name}
              />
            </>
          )}
    
    {hasLicense && (
  <>
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Користувач</Text>
      <Text style={styles.text}>Ім’я: {name}</Text>
      <Text style={styles.text}>Ключ: {deviceKey}</Text>
      <Text style={styles.text}>Ліцензія: {keyLicense}</Text>
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Налаштування</Text>
      <View style={styles.switchRow}>
        <Text style={styles.text}>Використовувати камеру</Text>
        <Switch
          value={useCamera}
          onValueChange={(value) => {
            setUseCamera(value);
          }}
        />
      </View>
    </View>
  </>
)}

        </View>
      );
    };
    
    export default SettingsScreen;
    
    const styles = StyleSheet.create({
      container: { flex: 1, 
        justifyContent: 'center', 
        padding: 20 
    },
      center: { flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
      input: { borderWidth: 1, 
        borderColor: '#aaa', 
        padding: 10, 
        marginBottom: 15 
    },
      text: { fontSize: 16, 
        marginBottom: 10 
    },
      section: {
        marginBottom: 30,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderColor: '#ddd',
      },
      sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      
    });