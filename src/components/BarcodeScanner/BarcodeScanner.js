import React from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { CameraView } from "expo-camera";
import styles from "./styles";

const BarcodeScanner = ({ visible, onClose, onScanned }) => {
  const barCodeScanned = (scanningResult) => {
    onScanned(scanningResult);
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <CameraView
          onBarcodeScanned={onScanned ? barCodeScanned : undefined}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "code128", "ean13", "ean8"],
          }}
          style={StyleSheet.absoluteFillObject}
        />
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Закрити</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default BarcodeScanner;
