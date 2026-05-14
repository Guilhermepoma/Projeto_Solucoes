import React, { useContext } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView
} from "react-native";
import { DoacoesContext } from "../DoacoesContext";

export default function PedirDoacao({ navigation }) {
  const { doacoes, atualizarStatus } = useContext(DoacoesContext);

  const disponiveis = doacoes.filter(
    d => d.status === "disponivel"
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Doações Disponíveis</Text>

      {disponiveis.length === 0 && (
        <Text style={styles.vazio}>Nenhuma doação disponível</Text>
      )}

      {disponiveis.map((d) => (
        <View key={d.id} style={styles.card}>
          <Text style={styles.texto}>
            {d.item} - {d.quantidade}
          </Text>

          <TouchableOpacity
            style={styles.botao}
            onPress={() =>
              atualizarStatus(d.id, "pendente_aprovacao_pedido")
            }
          >
            <Text style={styles.txt}>Solicitar</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity
        style={styles.voltar}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.txt}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#F1F5F9" },
  titulo: { fontSize: 24, marginBottom: 20 },
  vazio: { textAlign: "center", marginTop: 20 },

  card: {
    backgroundColor: "#E2E8F0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },

  texto: { fontSize: 16 },

  botao: {
    backgroundColor: "#38BDF8",
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
  },

  voltar: {
    backgroundColor: "#64748B",
    padding: 12,
    marginTop: 20,
    borderRadius: 8,
    alignItems: "center",
  },

  txt: { color: "#fff", textAlign: "center" },
});