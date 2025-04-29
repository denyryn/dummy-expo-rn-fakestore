import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSession } from "@/context/SessionProvider";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@react-navigation/native";

const LoginScreen = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const { signIn, isLoading, error } = useSession();

  const [form, setForm] = useState({
    username: "mor_2314",
    password: "83r5^_",
  });

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Login</ThemedText>

      <TextInput
        style={[styles.input, { borderColor: colors.text, color: colors.text }]}
        placeholder="Username"
        placeholderTextColor={colors.text + "99"} // semi-transparent
        value={form.username}
        onChangeText={(text) => setForm({ ...form, username: text })}
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, { borderColor: colors.text, color: colors.text }]}
        placeholder="Password"
        placeholderTextColor={colors.text + "99"}
        value={form.password}
        secureTextEntry
        onChangeText={(text) => setForm({ ...form, password: text })}
      />

      <TouchableOpacity onPress={() => router.push("/register")}>
        <ThemedText>Register</ThemedText>
      </TouchableOpacity>

      {isLoading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary || "blue" }]}
          onPress={() => signIn(form.username, form.password)}
        >
          <ThemedText>Login</ThemedText>
        </TouchableOpacity>
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </ThemedView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 6,
  },
  button: {
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  error: { color: "red", marginBottom: 10 },
});
