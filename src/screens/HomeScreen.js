import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const modules = [
  { title: 'Інвентаризація', route: 'Inventory' },
  { title: 'Переміщення', route: 'Transfer' },
  { title: 'Резервування', route: 'Reservation' },
  { title: 'Властивості товару', route: 'ProductProperties' },
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
            <Text style={styles.moduleText}>{mod.title}</Text>
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
    padding: 20,
    marginBottom: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  moduleText: {
    fontSize: 16,
  },
});
