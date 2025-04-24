import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Authentification from './Screen/Authentification';
import FirstPage from './Screen/FirstPage';
import Register from './Screen/Register';
import AdminDashboard from './Screen/AdminDashboard';
import UserHome from './Screen/UserHome';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="FirstPage" component={FirstPage} /> */}
        <Stack.Screen  name="Authentification" component={Authentification} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen name="UserHome" component={UserHome} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
