import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { db, auth } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function ChatListScreen({ navigation }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const userList = querySnapshot.docs
        .map(doc => doc.data())
        .filter(u => u.uid !== auth.currentUser.uid); // Don't show myself
      setUsers(userList);
    };
    getUsers();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.userCard}
            onPress={() => navigation.navigate('ChatRoom', { recipient: item })}
          >
            <Text style={styles.userName}>{item.email}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  userCard: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  userName: { fontSize: 18 }
});