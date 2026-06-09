import React, { useContext } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";

import Login from "./screen/login";
import Home from "./screen/home";
import FazerDoacao from "./screen/Fazerdoacao";
import PedirDoacao from "./screen/Pedirdoacao";
import Adm from "./screen/adm";
import Perfil from "./screen/Perfil";

import { DoacoesProvider } from "./DoacoesContext";
import { TemaContext, TemaProvider } from "./TemaContext";
import { AuthProvider, AuthContext } from "./AuthContext";

const Drawer = createDrawerNavigator();

function Rotas() {
  const { modoNoturno, theme } = useContext(TemaContext);
  const { user, isAdmin, loading } = React.useContext(AuthContext);

  const navigationTheme = {
    ...(modoNoturno ? DarkTheme : DefaultTheme),
    dark: modoNoturno,
    colors: {
      ...(modoNoturno ? DarkTheme.colors : DefaultTheme.colors),
      primary: theme.primary,
      background: theme.background,
      card: theme.header,
      text: theme.title,
      border: theme.border,
      notification: theme.admin,
    },
  };

  if (loading) return null;

  return (
    <NavigationContainer key={user ? "logado" : "deslogado"} theme={navigationTheme}>
      <DoacoesProvider>
        <Drawer.Navigator
          initialRouteName={user ? "Home" : "Login"}
          screenOptions={({ navigation }) => ({
            drawerStyle: { backgroundColor: theme.card },
            drawerActiveBackgroundColor: theme.primary,
            drawerActiveTintColor: "#FFFFFF",
            drawerInactiveTintColor: theme.title,
            headerStyle: { backgroundColor: theme.header },
            headerTintColor: theme.title,
            headerTitleStyle: { fontWeight: "800" },
            headerRight: () => (
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.headerAvatar, { backgroundColor: theme.primary }]}
                onPress={() => navigation.navigate("Perfil")}
              >
                <Text style={styles.headerAvatarText}>U</Text>
              </TouchableOpacity>
            ),
          })}
        >
          <Drawer.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false, drawerItemStyle: { display: "none" } }}
          />
          <Drawer.Screen name="Home" component={Home} options={{ title: "Início" }} />
          <Drawer.Screen
            name="FazerDoacao"
            component={FazerDoacao}
            options={{ title: "Fazer Doação" }}
          />
          <Drawer.Screen
            name="PedirDoacao"
            component={PedirDoacao}
            options={{ title: "Pedir Doação" }}
          />
          <Drawer.Screen
            name="Perfil"
            component={Perfil}
            options={{ title: "Perfil", drawerItemStyle: { display: "none" } }}
          />
          {isAdmin && (
            <Drawer.Screen name="Adm" component={Adm} options={{ title: "Área ADM" }} />
          )}
        </Drawer.Navigator>
      </DoacoesProvider>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <TemaProvider>
      <AuthProvider>
        <Rotas />
      </AuthProvider>
    </TemaProvider>
  );
}

const styles = StyleSheet.create({
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  headerAvatarText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});
