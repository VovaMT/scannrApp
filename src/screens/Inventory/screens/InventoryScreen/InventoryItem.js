import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

const SWIPE_THRESHOLD = -50;

const InventoryItem = ({ item, onDelete, onPress, onCloseOthers, registerSwipe }) => {
  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const close = () => {
    translateX.value = withSpring(0);
  };

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationX < 0) {
        translateX.value = e.translationX;
        runOnJS(onCloseOthers)?.(); 
      }
    })
    .onEnd((e) => {
      if (e.translationX < SWIPE_THRESHOLD) {
        translateX.value = withSpring(-100);
        runOnJS(registerSwipe)?.({ close });
      } else {
        translateX.value = withSpring(0);
      }
    });

  return (
    <View style={styles.itemContainer}>
      <View style={styles.hiddenButton}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            close();
            onDelete(item.goodCode);
          }}
        >
          <Text style={styles.deleteButtonText}>Видалити</Text>
        </TouchableOpacity>
      </View>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.itemWrapper, animatedStyle]}>
          <TouchableOpacity
            style={styles.item}
            activeOpacity={0.7}
            onPress={() => {
              close();
              onPress();
            }}
          >
            <Text>{item.name || item.goodCode}</Text>
            <Text>Кількість: {item.quantity}</Text>
            <Text>Час: {item.scannedAt}</Text>
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default InventoryItem;

const styles = StyleSheet.create({
  itemContainer: {
    width: "100%",
    height: 80,
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
    zIndex: -1,
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
    zIndex: 1,
  },
  item: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
});
