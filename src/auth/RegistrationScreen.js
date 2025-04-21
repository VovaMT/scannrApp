import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import uuid from 'react-native-uuid';
import { saveUserData } from '../utils/storage';
import { registerUser } from '../api/authApi';

const RegistrationScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [deviceKey, setDeviceKey] = useState('');
  const [registerDisabled, setRegisterDisabled] = useState(false);

  const handleRegister = async () => {
    const newKey = uuid.v4();
    setRegisterDisabled(true);

    try {
      const success = await registerUser(name, newKey);

      if (success === true) {
        await saveUserData(name, newKey);
        setDeviceKey(newKey);
        navigation.replace('Restricted');
      } else {
        setRegisterDisabled(false);
        Alert.alert('Помилка', success?.error || 'Щось пішло не так');
      }
    } catch (error) {
      setRegisterDisabled(false);
      Alert.alert('Помилка', error.message || 'Не вдалося виконати реєстрацію');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require('../../assets/big_logo.png')} 
        resizeMode="contain"
      />
      <TextInput
        style={styles.input}
        placeholder="Ім’я"
        placeholderTextColor="#666"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Код пристрою"
        placeholderTextColor="#666"
        value={deviceKey}
        editable={false}
      />
      <TouchableOpacity
        onPress={handleRegister}
        disabled={registerDisabled || !name}
        style={[
          styles.button,
          registerDisabled || !name ? styles.buttonDisabled : null,
        ]}
      >
        <Text style={styles.buttonText}>ЗАРЕЄСТРУВАТИСЬ</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegistrationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 250,
    height: 100,
    marginBottom: 40,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 12,
    marginBottom: 20,
    color: '#000',
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#6b8e23',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a9a9a9',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
