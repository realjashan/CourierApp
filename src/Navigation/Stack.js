import OrderScreen from "../screens/OrderScreen";
import OrderDelivery from "../screens/OrderDelivery";

import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "../screens/ProfileScreen";
import { useAuthContext } from "../context/AuthContext";

const Stack = createNativeStackNavigator();

const StackNavigation = () => {

  const {dbCourier,loading}=useAuthContext();

  if(loading){
    return      <ActivityIndicator
    size={"large"}
    color="gray"
    style={{
      alignItems: "center",

      marginVertical: 300,
    }}
  />
  }

  return (

    
    <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
 
    {dbCourier ? (
   <>

 <Stack.Screen name="OrdersScreen" component={OrderScreen} />
 <Stack.Screen name="OrdersDeliveryScreen" component={OrderDelivery} />
   
 
 </>
 ):(
<Stack.Screen name='Profile' component={Profile}/>
    )}
 
     
    </Stack.Navigator>
 
  );
};

export default StackNavigation;

const styles = StyleSheet.create({});
