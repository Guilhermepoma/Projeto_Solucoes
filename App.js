import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";

import Login from "./screen/login";
import Home from "./screen/home";
import FazerDoacao from "./screen/Fazerdoacao";
import PedirDoacao from "./screen/Pedirdoacao";
import Adm from "./screen/adm";

import { DoacoesProvider } from "./DoacoesContext";

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <DoacoesProvider>
        <Drawer.Navigator initialRouteName="Login">
          <Drawer.Screen 
            name="Login" 
            component={Login} 
            options={{ headerShown: false, drawerItemStyle: { display: 'none' } }} 
          />
          <Drawer.Screen name="Home" component={Home} options={{ title: 'Início' }} />
          <Drawer.Screen name="FazerDoacao" component={FazerDoacao} options={{ title: 'Fazer Doação' }} />
          <Drawer.Screen name="PedirDoacao" component={PedirDoacao} options={{ title: 'Pedir Doação' }} />
          <Drawer.Screen name="Adm" component={Adm} options={{ title: 'Área ADM' }} />
        </Drawer.Navigator>
      </DoacoesProvider>
    </NavigationContainer>
  );
}