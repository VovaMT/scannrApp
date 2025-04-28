import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 30,
  },
  buttonWrapper: {
    width: "100%",
    marginTop: 20,
    position: "relative",
  },
  progressLine: {
    position: "absolute",
    bottom: -2,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: "#ddd",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#6b8e23",
    borderRadius: 2,
  },
});

export default styles;
