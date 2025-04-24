import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs"
import ListUsers from "./AdminHome/ListUsers";



const Tab = createMaterialBottomTabNavigator();
export default function UserHome(props) {


  return (
    <Tab.Navigator>
      
      <Tab.Screen name="ListUsers" component={ListUsers}   options={{headerShown:false}}/>
    </Tab.Navigator>
  )
}