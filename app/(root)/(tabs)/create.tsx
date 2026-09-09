import { StyleSheet, Text, View } from "react-native";

export default function CreateProperty() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Property</Text>
      <Text>Create your property listing here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
  },
});
