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
import AsyncStorage from "@react-native-async-storage/async-storage";

import { auth } from "../services/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginScreen({ navigation }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {

    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {

      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Save login state locally
      await AsyncStorage.setItem("userLoggedIn", "true");
      await AsyncStorage.setItem("userUID", userCredential.user.uid);

      // Navigate to chat screen
      navigation.replace("ChatList");

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }

  };

  return (
    <SafeAreaView style={styles.container}>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inner}
      >

        <View style={styles.headerCircle} />

        <View style={styles.content}>

          <View style={styles.textContainer}>
            <Text style={styles.logo}>Chatter</Text>
            <Text style={styles.subtitle}>
              Welcome back, you've been missed!
            </Text>
          </View>

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
  container:{flex:1,backgroundColor:"#fff"},
  inner:{flex:1},
  headerCircle:{position:"absolute",top:-100,right:-100,width:300,height:300,borderRadius:150,backgroundColor:"#f0f3ff"},
  content:{flex:1,paddingHorizontal:30,justifyContent:"center"},
  textContainer:{marginBottom:40},
  logo:{fontSize:40,fontWeight:"900",color:"#1A1A1A"},
  subtitle:{fontSize:16,color:"#666",marginTop:5},
  form:{width:"100%"},
  inputWrapper:{marginBottom:20},
  inputLabel:{fontSize:14,fontWeight:"600",color:"#333",marginBottom:8},
  inputContainer:{flexDirection:"row",alignItems:"center",backgroundColor:"#F7F8FA",borderRadius:16,paddingHorizontal:15,height:60,borderWidth:1,borderColor:"#F0F0F0"},
  input:{flex:1,marginLeft:10,fontSize:16,color:"#1A1A1A"},
  loginButton:{backgroundColor:"#4f6cff",height:60,borderRadius:16,justifyContent:"center",alignItems:"center"},
  loginText:{color:"#fff",fontSize:18,fontWeight:"bold"},
  footer:{flexDirection:"row",justifyContent:"center",marginTop:40},
  footerText:{color:"#666"},
  registerLink:{color:"#4f6cff",fontWeight:"bold"}
});