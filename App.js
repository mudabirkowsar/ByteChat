import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/services/firebase';

import LoginScreen from './src/screens/LoginScreen';
import ChatListScreen from './src/screens/ChatListScreen';
import ChatRoomScreen from './src/screens/ChatRoomScreen';
import RegisterScreen from './src/screens/RegisterScreen';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen name="ChatList" component={ChatListScreen} />
            <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}