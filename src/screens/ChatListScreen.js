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
import { collection, getDocs, query, where, onSnapshot } from "firebase/firestore";
import { signOut } from "firebase/auth";

import { getChatId } from "../utils/chatId";

export default function ChatListScreen({ navigation }) {

  const [users, setUsers] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [loading, setLoading] = useState(true);

  const currentUser = auth.currentUser;

  useEffect(() => {

    const fetchUsers = async () => {

      try {

        const querySnapshot = await getDocs(collection(db, "users"));

        const userList = querySnapshot.docs
          .map(doc => doc.data())
          .filter(u => u.uid !== currentUser?.uid);

        setUsers(userList);

        setLoading(false);

        listenUnreadMessages(userList);

      } catch (err) {
        console.log(err);
        setLoading(false);
      }

    };

    fetchUsers();

  }, []);

  // Listen for unread messages
  const listenUnreadMessages = (userList) => {

    userList.forEach((user) => {

      const chatId = getChatId(currentUser.uid, user.uid);

      const q = query(
        collection(db, "chats", chatId, "messages"),
        where("seen", "==", false)
      );

      onSnapshot(q, (snapshot) => {

        let count = 0;

        snapshot.docs.forEach((doc) => {
          const data = doc.data();

          if (data.senderId !== currentUser.uid) {
            count++;
          }
        });

        setUnreadCounts(prev => ({
          ...prev,
          [user.uid]: count
        }));

      });

    });

  };

  // Logout
  const handleLogout = async () => {

    try {
      await signOut(auth);
      await AsyncStorage.removeItem("userLoggedIn");
      await auth.signOut();
      navigation.replace("Login");
    } catch (err) {
      console.log(err);
    }

  };

  const renderItem = ({ item }) => {

    const unread = unreadCounts[item.uid] || 0;

    return (
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

        {unread > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unread}</Text>
          </View>
        )}

      </TouchableOpacity>
    );

  };

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

  badge: {
    backgroundColor: "#ff3b30",
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6
  },

  badgeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }

});