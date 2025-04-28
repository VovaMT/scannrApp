import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  moduleBox: {
    width: "48%",
    backgroundColor: "#f2f2f2",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
  },
  iconRow: {
    alignItems: "flex-start",
    marginBottom: 10,
  },
  moduleContent: {
    justifyContent: "center",
  },
  moduleText: {
    fontSize: 16,
    textAlign: "left",
  },
});

export default styles;
