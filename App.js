import 'react-native-gesture-handler'; // IMPORTANTE

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "./screen/Login";
import Adm from "./screen/Adm";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Adm" component={Adm} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}