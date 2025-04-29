import { Stack } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { useColorScheme } from "react-native";

export default function SettingsLayout() {
  return (
    <ThemedView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: true,
        }}
      >
        <Stack.Screen name="index" options={{ headerTitle: "Settings" }} />
      </Stack>
    </ThemedView>
  );
}
