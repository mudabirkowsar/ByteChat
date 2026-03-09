import React, { useState, useEffect, useRef } from "react";
import {
    View,
    TextInput,
    TouchableOpacity,
    FlatList,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { db, auth } from "../services/firebase";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { getChatId } from "../utils/chatId";

export default function ChatScreen({ route }) {

    const { user } = route.params;
    const currentUser = auth.currentUser;

    const chatId = getChatId(currentUser.uid, user.uid);

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

    const flatListRef = useRef();

    useEffect(() => {

        const q = query(
            collection(db, "chats", chatId, "messages"),
            orderBy("createdAt", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {

            const msgList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setMessages(msgList);

            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);

        });

        return unsubscribe;

    }, []);

    const sendMessage = async () => {

        if (text.trim() === "") return;

        await addDoc(
            collection(db, "chats", chatId, "messages"),
            {
                text: text,
                senderId: currentUser.uid,
                createdAt: new Date()
            }
        );

        setText("");
    };

    const renderMessage = ({ item }) => {

        const isMe = item.senderId === currentUser.uid;

        return (
            <View style={[
                styles.messageRow,
                isMe ? styles.myRow : styles.otherRow
            ]}>

                <View style={[
                    styles.bubble,
                    isMe ? styles.myBubble : styles.otherBubble
                ]}>
                    <Text style={[
                        styles.messageText,
                        isMe && { color: "#fff" }
                    ]}>
                        {item.text}
                    </Text>
                </View>

            </View>
        );
    };

    return (

        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={80}
        >

            <View style={styles.container}>

                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingVertical: 10 }}
                />

                <View style={styles.inputContainer}>

                    <TextInput
                        value={text}
                        onChangeText={setText}
                        placeholder="Type a message..."
                        style={styles.input}
                        multiline
                    />

                    <TouchableOpacity
                        style={styles.sendButton}
                        onPress={sendMessage}
                    >
                        <Ionicons name="send" size={20} color="#fff" />
                    </TouchableOpacity>

                </View>

            </View>

        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7F9FC", // Softer off-white
    },
    messageRow: {
        flexDirection: "row",
        marginVertical: 2, // Tighter spacing
        paddingHorizontal: 12,
    },
    myRow: { justifyContent: "flex-end" },
    otherRow: { justifyContent: "flex-start" },

    bubble: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        maxWidth: "80%",
        // Adding shadow for depth
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 2,
    },
    myBubble: {
        backgroundColor: "#007AFF", // Standard modern blue
        borderBottomRightRadius: 5,
    },
    otherBubble: {
        backgroundColor: "#E9E9EB", // Classic light gray
        borderBottomLeftRadius: 5,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 20,
    },
    inputContainer: {
        flexDirection: "row",
        padding: 10,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderColor: "#e0e0e0",
        paddingBottom: Platform.OS === 'ios' ? 25 : 10, // Account for home indicator
    },
    input: {
        flex: 1,
        backgroundColor: "#F1F1F1",
        borderRadius: 22,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 16,
        marginRight: 10,
        maxHeight: 100,
    },
    sendButton: {
        backgroundColor: "#007AFF",
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
    }
});