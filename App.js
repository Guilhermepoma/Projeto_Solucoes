import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "./screen/login";
import Home from "./screen/home";
import FazerDoacao from "./screen/Fazer_doacao";
import PedirDoacao from "./screen/PedirDoacao";
import Adm from "./screen/adm";

import { DoacoesProvider } from "./DoacoesContext";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <DoacoesProvider>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="FazerDoacao" component={FazerDoacao} />
          <Stack.Screen name="PedirDoacao" component={PedirDoacao} />
          <Stack.Screen name="Adm" component={Adm} />
        </Stack.Navigator>
      </DoacoesProvider>
    </NavigationContainer>
  );
}