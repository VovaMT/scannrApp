import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const modules = [
  { title: 'Інвентаризація', route: 'Inventory', icon: 'checkmark-done-circle-outline' },
  { title: 'Переміщення', route: 'Transfer', icon: 'open-outline' },
  { title: 'Резервування', route: 'Reservation', icon: 'file-tray-stacked-outline' },
  { title: 'Властивості товару', route: 'ProductProperties', icon: 'book-outline' },
];

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {modules.map((mod, index) => (
          <TouchableOpacity
          key={index}
          style={styles.moduleBox}
          onPress={() => navigation.navigate(mod.route)}
        >
          <View style={styles.iconRow}>
            <Ionicons name={mod.icon} size={24} color="#333" />
          </View>
          <View style={styles.moduleContent}>
            <Text style={styles.moduleText}>{mod.title}</Text>
          </View>
        </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moduleBox: {
    width: '48%',
    backgroundColor: '#f2f2f2',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
  },
  iconRow: {
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  moduleContent: {
    justifyContent: 'center',
  },
  moduleText: {
    fontSize: 16,
    textAlign: 'left',
  },
});

