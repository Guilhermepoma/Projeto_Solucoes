import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Bem-vindo</Text>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate("FazerDoacao")}
      >
        <Text style={styles.botaoTexto}>Fazer Doação</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate("PedirDoacao")}
      >
        <Text style={styles.botaoTexto}>Pedir Doação</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botaoAdm}
        onPress={() => navigation.navigate("Adm")}
      >
        <Text style={styles.botaoTexto}>Área ADM</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
  },
  botao: {
    backgroundColor: "#38BDF8",
    padding: 15,
    width: "70%",
    alignItems: "center",
    marginBottom: 15,
    borderRadius: 10,
  },
  botaoAdm: {
    backgroundColor: "#64748B",
    padding: 15,
    width: "70%",
    alignItems: "center",
    borderRadius: 10,
  },
  botaoTexto: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});