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
    ActivityIndicator,
    Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../services/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function RegisterScreen({ navigation }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            // 1. Create User
            const res = await createUserWithEmailAndPassword(auth, email, password);

            // 2. Set Display Name in Firebase Auth
            await updateProfile(res.user, { displayName: name });

            // 3. Save to Firestore
            await setDoc(doc(db, "users", res.user.uid), {
                uid: res.user.uid,
                displayName: name,
                email: email,
                createdAt: new Date(),
                // Generate a random avatar using the user's name
                avatar: `https://ui-avatars.com/api/?name=${name}&background=random`
            });

            setLoading(false);
            // navigation.navigate("Login"); // Optional: logic in App.js usually handles this auto-redirect
        } catch (err) {
            setLoading(false);

            if (err.code === "auth/email-already-in-use") {
                Alert.alert(
                    "Account Exists",
                    "This email is already registered. Please login instead."
                );
            }
            else if (err.code === "auth/invalid-email") {
                Alert.alert("Invalid Email", "Please enter a valid email address.");
            }
            else if (err.code === "auth/weak-password") {
                Alert.alert("Weak Password", "Password must be at least 6 characters.");
            }
            else {
                Alert.alert("Registration Failed", err.message);
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.inner}
            >
                {/* Decorative Background Shape */}
                <View style={styles.headerCircle} />

                <View style={styles.content}>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>Join Chatter</Text>
                        <Text style={styles.subtitle}>Start connecting with people today.</Text>
                    </View>

                    <View style={styles.form}>
                        {/* Full Name Input */}
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>Full Name</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="person-outline" size={20} color="#666" />
                                <TextInput
                                    placeholder="John Doe"
                                    placeholderTextColor="#999"
                                    style={styles.input}
                                    onChangeText={setName}
                                />
                            </View>
                        </View>

                        {/* Email Input */}
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

                        {/* Password Input */}
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>Password</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="lock-closed-outline" size={20} color="#666" />
                                <TextInput
                                    placeholder="At least 6 characters"
                                    placeholderTextColor="#999"
                                    style={styles.input}
                                    secureTextEntry
                                    onChangeText={setPassword}
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.registerButton, loading && { opacity: 0.7 }]}
                            onPress={handleRegister}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.registerText}>Create Account</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={styles.loginLink}>Sign In</Text>
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
        top: -80,
        left: -80,
        width: 250,
        height: 250,
        borderRadius: 125,
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
    title: {
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
    registerButton: {
        backgroundColor: "#4f6cff",
        height: 60,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        shadowColor: "#4f6cff",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    registerText: {
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
    loginLink: {
        color: "#4f6cff",
        fontSize: 15,
        fontWeight: "bold",
    },
});