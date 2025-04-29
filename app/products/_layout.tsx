import { ThemedView } from "@/components/ThemedView";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function ProductLayout() {
  return (
    <ThemedView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: true,
        }}
      >
        <Stack.Screen name="index" options={{ headerTitle: "Products" }} />
        <Stack.Screen
          name="[id]"
          options={{ headerTitle: "Product Details" }}
        />
      </Stack>
    </ThemedView>
  );
}
