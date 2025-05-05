import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 10,
  },
  barcodeInput: {
    flex: 1,
    borderBottomWidth: 1,
    padding: 8,
    fontSize: 16,
  },
  emptyText: {
    marginTop: 20,
    fontSize: 18,
    textAlign: "center",
  },
  searchButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  
});

export default styles;
