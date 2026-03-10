import React, { useState, useEffect } from "react";
import {
    View,
    TextInput,
    TouchableOpacity,
    FlatList,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StatusBar
} from "react-native";

import { useHeaderHeight } from "@react-navigation/elements";
import { Ionicons } from "@expo/vector-icons";

import { db, auth } from "../services/firebase";
import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp
} from "firebase/firestore";

import { getChatId } from "../utils/chatId";

export default function ChatScreen({ route, navigation }) {

    const { user } = route.params;
    const currentUser = auth.currentUser;
    const chatId = getChatId(currentUser.uid, user.uid);

    const headerHeight = useHeaderHeight();

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

    useEffect(() => {

        const q = query(
            collection(db, "chats", chatId, "messages"),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {

            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date()
            }));

            setMessages(msgs);

        });

        return unsubscribe;

    }, []);

    const sendMessage = async () => {

        if (!text.trim()) return;

        const message = text;
        setText("");

        await addDoc(
            collection(db, "chats", chatId, "messages"),
            {
                text: message,
                senderId: currentUser.uid,
                createdAt: serverTimestamp()
            }
        );

    };

    const renderMessage = ({ item }) => {

        const isMe = item.senderId === currentUser.uid;

        const time = item.createdAt.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

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
                        isMe ? styles.myText : styles.otherText
                    ]}>
                        {item.text}
                    </Text>

                    <Text style={[
                        styles.timeText,
                        isMe ? styles.myTimeText : styles.otherTimeText
                    ]}>
                        {time}
                    </Text>

                </View>

            </View>
        );

    };

    return (

        <SafeAreaView style={styles.safeArea}>

            <StatusBar barStyle="dark-content" />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={headerHeight + 10}
            >

                <View style={styles.container}>

                    <FlatList
                        data={messages}
                        renderItem={renderMessage}
                        keyExtractor={(item) => item.id}
                        inverted
                        contentContainerStyle={styles.listContent}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    />

                    {/* INPUT */}

                    <View style={styles.inputWrapper}>

                        <View style={styles.inputContainer}>

                            <TouchableOpacity style={styles.plusButton}>
                                <Ionicons name="add" size={24} color="#007AFF" />
                            </TouchableOpacity>

                            <TextInput
                                value={text}
                                onChangeText={setText}
                                placeholder="Message..."
                                placeholderTextColor="#999"
                                style={styles.input}
                                multiline
                            />

                            <TouchableOpacity
                                style={[
                                    styles.sendButton,
                                    !text.trim() && styles.sendDisabled
                                ]}
                                onPress={sendMessage}
                                disabled={!text.trim()}
                            >
                                <Ionicons name="arrow-up" size={22} color="#fff" />
                            </TouchableOpacity>

                        </View>

                    </View>

                </View>

            </KeyboardAvoidingView>

        </SafeAreaView>

    );

}

const styles = StyleSheet.create({

    safeArea: {
        flex: 1,
        backgroundColor: "#fff"
    },

    container: {
        flex: 1,
        backgroundColor: "#F2F2F7"
    },

    listContent: {
        paddingHorizontal: 12,
        paddingBottom: 10
    },

    messageRow: {
        flexDirection: "row",
        marginVertical: 4
    },

    myRow: {
        justifyContent: "flex-end"
    },

    otherRow: {
        justifyContent: "flex-start"
    },

    bubble: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        maxWidth: "80%",
        elevation: 1
    },

    myBubble: {
        backgroundColor: "#007AFF",
        borderBottomRightRadius: 4
    },

    otherBubble: {
        backgroundColor: "#fff",
        borderBottomLeftRadius: 4
    },

    messageText: {
        fontSize: 16,
        lineHeight: 20
    },

    myText: {
        color: "#fff"
    },

    otherText: {
        color: "#000"
    },

    timeText: {
        fontSize: 10,
        marginTop: 4,
        alignSelf: "flex-end"
    },

    myTimeText: {
        color: "rgba(255,255,255,0.7)"
    },

    otherTimeText: {
        color: "#999"
    },

    inputWrapper: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderColor: "#E5E5E5"
    },

    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F1F1F1",
        borderRadius: 25,
        paddingHorizontal: 8,
        paddingVertical: 5
    },

    plusButton: {
        padding: 5
    },

    input: {
        flex: 1,
        fontSize: 16,
        color: "#000",
        paddingHorizontal: 10,
        paddingVertical: 8,
        maxHeight: 100
    },

    sendButton: {
        backgroundColor: "#007AFF",
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center"
    },

    sendDisabled: {
        backgroundColor: "#B2D7FF"
    }

});