import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { db, auth } from "../services/firebase";
import { collection, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";

export default function ChatListScreen({ navigation }) {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUsers = async () => {
            try {

                const querySnapshot = await getDocs(collection(db, "users"));

                const userList = querySnapshot.docs
                    .map(doc => doc.data())
                    .filter(u => u.uid !== auth.currentUser?.uid);

                setUsers(userList);
                setLoading(false);

            } catch (err) {
                console.log(err);
                setLoading(false);
            }
        };

        getUsers();
    }, []);

    // Logout
    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigation.replace("Login");
        } catch (err) {
            console.log(err);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.userCard}
            onPress={() => navigation.navigate("Chat", { user: item })}
        >
            <View style={styles.avatar}>
                <Ionicons name="person" size={20} color="#fff" />
            </View>

            <View style={styles.userInfo}>
                <Text style={styles.userName}>
                    {item.displayName || item.email}
                </Text>

                <Text style={styles.lastMessage}>
                    Start a conversation
                </Text>
            </View>

            <Ionicons name="chevron-forward" size={18} color="#999" />
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Chats</Text>

                <TouchableOpacity onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={26} color="#333" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={users}
                keyExtractor={(item) => item.uid}
                renderItem={renderItem}
            />

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 50
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        marginBottom: 20
    },

    title: {
        fontSize: 28,
        fontWeight: "bold"
    },

    userCard: {
        flexDirection: "row",
        alignItems: "center",
        padding: 18,
        borderBottomWidth: 1,
        borderBottomColor: "#eee"
    },

    avatar: {
        width: 45,
        height: 45,
        borderRadius: 22,
        backgroundColor: "#4f6cff",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15
    },

    userInfo: {
        flex: 1
    },

    userName: {
        fontSize: 16,
        fontWeight: "bold"
    },

    lastMessage: {
        fontSize: 13,
        color: "#777",
        marginTop: 3
    },

    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }

});