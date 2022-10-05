import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigation from "./src/Navigation/Stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Amplify } from "aws-amplify";
import awsconfig from "./src/aws-exports";
import {withAuthenticator} from 'aws-amplify-react-native'
import  AuthContextProvider, { useAuthContext } from './src/context/AuthContext'
import OrderContextProvider from "./src/context/OrderContext";






Amplify.configure({
  ...awsconfig,
  Analytics: {
    disabled: true,
  },
});

 function App() {
  return (
    <NavigationContainer>
      {/* gesture handler to make bottom sheet work in android */}
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthContextProvider>
          <OrderContextProvider>
        <StackNavigation />
        </OrderContextProvider>

        </AuthContextProvider>
      </GestureHandlerRootView>

      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

export default withAuthenticator(App);

