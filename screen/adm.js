import React, { useContext } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView
} from "react-native";
import { DoacoesContext } from "../DoacoesContext";

export default function Adm({ navigation }) {
  const { doacoes, atualizarStatus } = useContext(DoacoesContext);

  const doacoesPendentes = doacoes.filter(
    d => d.status === "pendente_aprovacao_doacao"
  );

  const pedidosPendentes = doacoes.filter(
    d => d.status === "pendente_aprovacao_pedido"
  );

  const renderCard = (d, tipo) => (
    <View key={d.id} style={styles.card}>
      <Text style={styles.texto}>
        {d.item} - {d.quantidade}
      </Text>

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.aprovar}
          onPress={() =>
            atualizarStatus(
              d.id,
              tipo === "doacao" ? "disponivel" : "finalizado"
            )
          }
        >
          <Text style={styles.txt}>Aprovar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.recusar}
          onPress={() => atualizarStatus(d.id, "recusado")}
        >
          <Text style={styles.txt}>Recusar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Área ADM</Text>

      <Text style={styles.sub}>Doações Pendentes</Text>
      {doacoesPendentes.length === 0 && (
        <Text style={styles.vazio}>Nenhuma doação pendente</Text>
      )}
      {doacoesPendentes.map(d => renderCard(d, "doacao"))}

      <Text style={styles.sub}>Pedidos Pendentes</Text>
      {pedidosPendentes.length === 0 && (
        <Text style={styles.vazio}>Nenhum pedido pendente</Text>
      )}
      {pedidosPendentes.map(d => renderCard(d, "pedido"))}

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

  titulo: { fontSize: 24, marginBottom: 10 },
  sub: { fontSize: 18, marginTop: 10 },

  vazio: { marginTop: 10, marginBottom: 10 },

  card: {
    backgroundColor: "#E2E8F0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },

  texto: { fontSize: 16 },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  aprovar: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 8,
  },

  recusar: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 8,
  },

  voltar: {
    backgroundColor: "#64748B",
    padding: 12,
    marginTop: 20,
    borderRadius: 8,
    alignItems: "center",
  },

  txt: { color: "#fff" },
});