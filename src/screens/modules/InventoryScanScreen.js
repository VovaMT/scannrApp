import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Pressable,
    Modal,
    Keyboard,
} from "react-native";
import { getGoodByBarcode } from "../../database/db";
import { addOrUpdateInventoryItem } from "../../database/inventory";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { CameraView, Camera } from "expo-camera";
import { getUseCameraSetting } from "../../utils/storage";

const InventoryScanScreen = ({ navigation }) => {
    const [barcode, setBarcode] = useState("");
    const [good, setGood] = useState(null);
    const [quantity, setQuantity] = useState("1");
    const [scannerVisible, setScannerVisible] = useState(false);
    const [permission, setPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [allowCamera, setAllowCamera] = useState(false);
    const [editable, setEditable] = useState(false);

    const inputRef = useRef(null);

    useEffect(() => {
        const getPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setPermission(status === "granted");
            const allow = await getUseCameraSetting();
            setAllowCamera(allow);
        };
        getPermissions();
    }, []);

    useEffect(() => {
        requestAnimationFrame(() => {
            inputRef.current?.focus();
        });
    }, []);

    useLayoutEffect(() => {
        if (!allowCamera) return;

        navigation.setOptions({
            headerRight: () => (
                <Pressable
                    onPress={() => {
                        setScanned(false);
                        setScannerVisible(true);
                    }}
                    style={{ marginRight: 15 }}
                >
                    <Ionicons name="camera-outline" size={24} />
                </Pressable>
            ),
        });
    }, [navigation, allowCamera]);

    const findGood = async () => {
        const result = await getGoodByBarcode(barcode);
        if (result) {
            setGood(result);
        } else {
            Alert.alert("Товар не знайдено");
            setGood(null);
        }
    };

    const save = async () => {
        if (good) {
            await addOrUpdateInventoryItem(good.goodCode, parseFloat(quantity), 1);
            navigation.goBack();
        }
    };

    const barCodeScanned = async ({ data }) => {
        setScanned(true);
        setScannerVisible(false);
        setBarcode(data);
        findGoodByCode(data);
    };

    const findGoodByCode = async (code) => {
        const result = await getGoodByBarcode(code);
        if (result) {
            setGood(result);
        } else {
            Alert.alert("Товар не знайдено");
            setGood(null);
        }
    };

    const toggleKeyboard = () => {
        if (editable) {
            Keyboard.dismiss();
            setEditable(false);
        } else {
            setEditable(true);
            inputRef.current?.focus();
        }
    };

    return (
        <View style={styles.container}>
            <Text>Введіть штрих-код</Text>
            <View style={styles.barcodeRow}>
                <TextInput
                    ref={inputRef}
                    value={barcode}
                    onChangeText={setBarcode}
                    style={styles.barcodeInput}
                    keyboardType="numeric"
                    placeholder="Штрих-код"
                    showSoftInputOnFocus={editable}
                />
                <TouchableOpacity onPress={toggleKeyboard}>
                    <MaterialCommunityIcons name="keyboard-outline" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.findButton} onPress={findGood}>
                <Text style={styles.findButtonText}>Пошук</Text>
            </TouchableOpacity>

            {good && (
                <View style={styles.card}>
                    <Text style={styles.label}>Штрих-код:</Text>
                    <Text style={styles.value}>{barcode}</Text>

                    <Text style={styles.label}>Назва товару:</Text>
                    <Text style={styles.value}>{good.name}</Text>

                    <Text style={styles.label}>Код товару:</Text>
                    <Text style={styles.value}>{good.goodCode}</Text>

                    <View style={styles.quantityRow}>
                        <TouchableOpacity
                            style={styles.circleButton}
                            onPress={() => {
                                const newQty = Math.max(0, parseFloat(quantity || 0) - 1);
                                setQuantity(newQty.toString());
                            }}
                        >
                            <Text style={styles.circleButtonText}>-</Text>
                        </TouchableOpacity>

                        <TextInput
                            style={styles.quantityInput}
                            value={quantity}
                            onChangeText={setQuantity}
                            keyboardType="numeric"
                            placeholder="Залишок"
                        />

                        <TouchableOpacity
                            style={styles.circleButton}
                            onPress={() => {
                                const newQty = parseFloat(quantity || 0) + 1;
                                setQuantity(newQty.toString());
                            }}
                        >
                            <Text style={styles.circleButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.saveButton} onPress={save}>
                        <Text style={styles.saveButtonText}>ЗБЕРЕГТИ</Text>
                    </TouchableOpacity>
                </View>
            )}

            <Modal visible={scannerVisible} animationType="slide">
                <View style={styles.scannerContainer}>
                    {permission ? (
                        <>
                            <CameraView
                                onBarcodeScanned={scanned ? undefined : barCodeScanned}
                                barcodeScannerSettings={{
                                    barcodeTypes: ["qr", "code128", "ean13", "ean8"],
                                }}
                                style={StyleSheet.absoluteFillObject}
                            />
                            <TouchableOpacity
                                onPress={() => setScannerVisible(false)}
                                style={styles.closeButton}
                            >
                                <Text style={styles.closeText}>Закрити</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <Text style={styles.permissionText}>Немає доступу до камери</Text>
                    )}
                </View>
            </Modal>
        </View>
    );
};

export default InventoryScanScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        gap: 10,
    },
    input: {
        borderBottomWidth: 1,
        padding: 8,
        marginBottom: 10,
        fontSize: 16,
    },
    findButton: {
        backgroundColor: "#4CAF50",
        padding: 10,
        borderRadius: 6,
        alignItems: "center",
    },
    findButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    card: {
        padding: 16,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        backgroundColor: "#f9f9f9",
        marginTop: 20,
        gap: 10,
    },
    label: {
        fontWeight: "bold",
        fontSize: 16,
    },
    value: {
        fontSize: 16,
        marginBottom: 6,
    },
    quantityRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        marginTop: 10,
    },
    barcodeRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    barcodeInput: {
        flex: 1,
        borderBottomWidth: 1,
        padding: 8,
        marginBottom: 10,
        fontSize: 16,
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
    scannerContainer: {
        flex: 1,
        justifyContent: "center",
    },
    closeButton: {
        position: "absolute",
        bottom: 50,
        alignSelf: "center",
        backgroundColor: "#000",
        padding: 12,
        borderRadius: 8,
    },
    closeText: {
        color: "#fff",
        fontSize: 16,
    },
    permissionText: {
        color: "red",
        fontSize: 18,
        textAlign: "center",
        marginTop: 100,
    },
});
