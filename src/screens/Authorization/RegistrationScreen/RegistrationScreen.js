import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { saveUserData } from "services/storage/userStorage";
import { registerUser } from "services/api/authApi";
import { big_logo } from "assets";
import { fetchDeviceId } from "utils/deviceUtils";

const RegistrationScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [deviceKey, setDeviceKey] = useState("");
  const [registerDisabled, setRegisterDisabled] = useState(false);

  useEffect(() => {
    const loadDeviceId = async () => {
      const id = await fetchDeviceId();
      setDeviceKey(id || "-");
    };

    loadDeviceId();
  }, []);

  const handleRegister = async () => {
    setRegisterDisabled(true);
  
    try {
      const keyLicense = await registerUser(name, deviceKey);
  
      // Зберігаємо ім’я, ключ, ліцензію, роль=null, магазин=null
      await saveUserData(name, deviceKey, keyLicense, null, null);
      navigation.replace("Restricted");
  
    } catch (error) {
      setRegisterDisabled(false);
      Alert.alert("Помилка", error.message || "Не вдалося виконати реєстрацію");
    }
  };
  
  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={big_logo}
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
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 250,
    height: 100,
    marginBottom: 40,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 12,
    marginBottom: 20,
    color: "#000",
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#6b8e23",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#a9a9a9",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});