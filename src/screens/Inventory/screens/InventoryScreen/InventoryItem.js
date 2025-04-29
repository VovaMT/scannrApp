import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  TouchableOpacity,
} from "react-native";

const InventoryItem = ({ item, onDelete, onPress, onCloseOthers, registerSwipe }) => {
  const translateX = useRef(new Animated.Value(0)).current;

  const close = () => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          onCloseOthers?.();
          translateX.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -50) {
          Animated.spring(translateX, {
            toValue: -100,
            useNativeDriver: true,
          }).start();
          registerSwipe?.({ close });
        } else {
          close();
        }
      },
    })
  ).current;

  return (
    <View style={styles.itemContainer}>
      <View style={styles.hiddenButton}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(item.goodCode)}
        >
          <Text style={styles.deleteButtonText}>Видалити</Text>
        </TouchableOpacity>
      </View>

      <Animated.View
        style={[styles.itemWrapper, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity style={styles.item} onPress={onPress}>
          <Text>{item.name}</Text>
          <Text>{item.goodCode}</Text>
          <Text>Кількість: {item.quantity}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default InventoryItem;

const styles = StyleSheet.create({
  itemContainer: {
    width: "100%",
    height: 100,
    marginBottom: 10,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  hiddenButton: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 100,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  itemWrapper: {
    flex: 1,
    backgroundColor: "white",
  },
  item: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
});
