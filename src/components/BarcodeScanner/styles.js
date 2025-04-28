import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
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
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default styles;
