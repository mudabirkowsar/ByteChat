import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../services/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) return alert("Please fill in all fields");

    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .catch(err => alert(err.message))
      .finally(() => setLoading(false));
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inner}
      >
        {/* Header Decor */}
        <View style={styles.headerCircle} />

        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={styles.logo}>Chatter</Text>
            <Text style={styles.subtitle}>Welcome back, you've been missed!</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#666" />
                <TextInput
                  placeholder="name@email.com"
                  placeholderTextColor="#999"
                  style={styles.input}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" />
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor="#999"
                  style={styles.input}
                  secureTextEntry
                  onChangeText={setPassword}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginButton, loading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>New to Chatter? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.registerLink}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  inner: {
    flex: 1,
  },
  headerCircle: {
    position: "absolute",
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#f0f3ff",
    zIndex: -1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "center",
  },
  textContainer: {
    marginBottom: 40,
  },
  logo: {
    fontSize: 40,
    fontWeight: "900",
    color: "#1A1A1A",
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  form: {
    width: "100%",
  },
  inputWrapper: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F8FA",
    borderRadius: 16,
    paddingHorizontal: 15,
    height: 60,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#1A1A1A",
  },
  forgotBtn: {
    alignSelf: "flex-end",
    marginBottom: 30,
  },
  forgotText: {
    color: "#4f6cff",
    fontWeight: "600",
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#4f6cff",
    height: 60,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#4f6cff",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  loginText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
  },
  footerText: {
    color: "#666",
    fontSize: 15,
  },
  registerLink: {
    color: "#4f6cff",
    fontSize: 15,
    fontWeight: "bold",
  },
});