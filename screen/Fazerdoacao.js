import React, { useState, useContext } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert
} from "react-native";
import { DoacoesContext } from "../DoacoesContext";

export default function FazerDoacao({ navigation }) {
  const { adicionarDoacao } = useContext(DoacoesContext);

  const [nome, setNome] = useState("");
  const [contato, setContato] = useState("");
  const [item, setItem] = useState("");
  const [quantidade, setQuantidade] = useState("");

  const enviar = () => {
    if (!nome || !item || !quantidade) {
      Alert.alert("Erro", "Preencha os campos");
      return;
    }

    adicionarDoacao({ nome, contato, item, quantidade });

    Alert.alert("Enviado", "Aguardando aprovação");
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Fazer Doação</Text>

      <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome}/>
      <TextInput style={styles.input} placeholder="Contato" value={contato} onChangeText={setContato}/>
      <TextInput style={styles.input} placeholder="Item" value={item} onChangeText={setItem}/>
      <TextInput style={styles.input} placeholder="Quantidade" value={quantidade} onChangeText={setQuantidade}/>

      <TouchableOpacity style={styles.botao} onPress={enviar}>
        <Text style={styles.botaoTexto}>Enviar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#F1F5F9" },
  titulo: { fontSize: 24, marginBottom: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 8, backgroundColor: "#fff" },
  botao: { backgroundColor: "#38BDF8", padding: 15, alignItems: "center", borderRadius: 10 },
  botaoTexto: { color: "#fff" },
});