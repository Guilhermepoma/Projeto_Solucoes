import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import { TemaContext } from "../TemaContext";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const { modoNoturno, theme } = useContext(TemaContext);

  const fazerLogin = () => {
    console.log("email:", email);
    console.log("senha:", senha);

    if (!email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    navigation.navigate("Home");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: modoNoturno ? theme.background : "#0F172A" }]}>
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.titulo, { color: theme.title }]}>Login</Text>

        <TextInput
          style={[styles.input, { backgroundColor: theme.input, borderColor: theme.border, color: theme.title }]}
          placeholder="Digite seu email"
          placeholderTextColor={theme.muted}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={[styles.input, { backgroundColor: theme.input, borderColor: theme.border, color: theme.title }]}
          placeholder="Digite sua senha"
          placeholderTextColor={theme.muted}
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity style={[styles.botao, { backgroundColor: theme.primary }]} onPress={fazerLogin}>
          <Text style={styles.textoBotao}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={[styles.link, { color: theme.primary }]}>Criar conta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  card: {
    width: "100%",
    borderRadius: 20,
    padding: 25,
    elevation: 5,
  },

  titulo: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },

  botao: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  textoBotao: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },

  link: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 16,
  },
});
