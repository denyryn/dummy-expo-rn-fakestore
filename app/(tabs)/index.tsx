import { useEffect } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useSession } from "@/context/SessionProvider";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { useColorScheme } from "react-native";

export default function HomeScreen() {
  const { session } = useSession(); // Correctly destructure the session from useSession
  const router = useRouter();
  const colorScheme = useColorScheme();

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>This is Home Screen</ThemedText>
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => router.push("/settings")}
      >
        <Ionicons
          name="settings"
          size={28}
          color={Colors[colorScheme ?? "light"].tint}
        />
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
  settingsButton: {
    position: "absolute",
    top: 30,
    right: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
