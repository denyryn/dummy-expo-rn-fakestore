import { StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function ExploreScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>This is Explore Screen</ThemedText>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/products")}
      >
        <ThemedText>Go To Shop</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  button: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
});
