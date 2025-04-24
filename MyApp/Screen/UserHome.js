import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MyInfo from "../Screen/userHome/MyInfo";
import Commande from "./userHome/Commande";
import ListPlaces from "./userHome/ListPlaces";

const Tab = createMaterialBottomTabNavigator();

export default function UserHome() {
  return (
    <Tab.Navigator
      initialRouteName="Commande"
      activeColor="#ffffff"
      inactiveColor="#d1d1d1"
      shifting={true} // shifting animation
      barStyle={{
        backgroundColor: '#001433',
        height: 80,
        paddingBottom: 10,
        paddingTop: 5,
        elevation: 10,
        borderradiusleft: 50,
      }}
    >
      <Tab.Screen
        name="Commande"
        component={Commande}
        options={{
          tabBarLabel: 'Gate Control',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="gate" color={color} size={26} />
          ),
          headerShown: false
        }}
      />
      <Tab.Screen
        name="ListPlaces"
        component={ListPlaces}
        options={{
          tabBarLabel: 'Available Spots',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="car-parking-lights" color={color} size={26} />
          ),
          headerShown: false
        }}
      />
      <Tab.Screen
        name="MyInfo"
        component={MyInfo}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account-circle" color={color} size={26} />
          ),
          headerShown: false
        }}
      />
    </Tab.Navigator>
  );
}
