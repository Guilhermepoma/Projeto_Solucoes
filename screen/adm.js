import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";

const pedidosCestas = [
  { id: "1", nome: "Maria Silva", data: "12/05/2026", status: "pendente", itens: "Cesta Básica Grande" },
  { id: "2", nome: "João Souza", data: "11/05/2026", status: "pendente", itens: "Cesta Básica Pequena" },
  { id: "3", nome: "Ana Costa", data: "10/05/2026", status: "pendente", itens: "Cesta Básica Grande" },
];

const pedidosDoacoes = [
  { id: "1", nome: "Carlos Mendes", data: "12/05/2026", status: "pendente", tipo: "Roupas e alimentos" },
  { id: "2", nome: "Lucia Ferreira", data: "11/05/2026", status: "pendente", tipo: "Brinquedos" },
];

const StatusBadge = ({ status }) => (
  <View style={[styles.badge, status === "pendente" && styles.badgePendente]}>
    <Text style={styles.badgeText}>
      {status === "pendente" ? "Pendente" : "Aceito"}
    </Text>
  </View>
);

const PedidoCestaCard = ({ item, onAceitar, onRecusar }) => (
  <View style={styles.pedidoItem}>
    <View style={styles.pedidoHeader}>
      <View>
        <Text style={styles.pedidoNome}>{item.nome}</Text>
        <Text style={styles.pedidoDetalhe}>{item.itens}</Text>
        <Text style={styles.pedidoData}>{item.data}</Text>
      </View>
      <StatusBadge status={item.status} />
    </View>

    <View style={styles.pedidoActions}>
      <TouchableOpacity
        style={[styles.actionBtn, styles.btnRecusar]}
        onPress={() => onRecusar(item.id)}
      >
        <Text style={styles.btnRecusarText}>Recusar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionBtn, styles.btnAceitar]}
        onPress={() => onAceitar(item.id)}
      >
        <Text style={styles.btnAceitarText}>Aceitar</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const PedidoDoacaoCard = ({ item, onAceitar, onRecusar }) => (
  <View style={styles.pedidoItem}>
    <View style={styles.pedidoHeader}>
      <View>
        <Text style={styles.pedidoNome}>{item.nome}</Text>
        <Text style={styles.pedidoDetalhe}>{item.tipo}</Text>
        <Text style={styles.pedidoData}>{item.data}</Text>
      </View>
      <StatusBadge status={item.status} />
    </View>

    <View style={styles.pedidoActions}>
      <TouchableOpacity
        style={[styles.actionBtn, styles.btnRecusar]}
        onPress={() => onRecusar(item.id)}
      >
        <Text style={styles.btnRecusarText}>Recusar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionBtn, styles.btnAceitarDoacao]}
        onPress={() => onAceitar(item.id)}
      >
        <Text style={styles.btnAceitarText}>Aceitar</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default function Adm() {
  const [cestas, setCestas] = useState(pedidosCestas);
  const [doacoes, setDoacoes] = useState(pedidosDoacoes);

  const aceitarCesta = (id) => setCestas(prev => prev.filter(p => p.id !== id));
  const recusarCesta = (id) => setCestas(prev => prev.filter(p => p.id !== id));
  const aceitarDoacao = (id) => setDoacoes(prev => prev.filter(p => p.id !== id));
  const recusarDoacao = (id) => setDoacoes(prev => prev.filter(p => p.id !== id));

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Painel ADM</Text>
        <Text style={styles.headerSub}>Gerenciamento de Pedidos</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pedidos de Cestas ({cestas.length})</Text>

          {cestas.map((item) => (
            <PedidoCestaCard
              key={item.id}
              item={item}
              onAceitar={aceitarCesta}
              onRecusar={recusarCesta}
            />
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pedidos de Doações ({doacoes.length})</Text>

          {doacoes.map((item) => (
            <PedidoDoacaoCard
              key={item.id}
              item={item}
              onAceitar={aceitarDoacao}
              onRecusar={recusarDoacao}
            />
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f0f2f5" },

  header: {
    backgroundColor: "#1a1a2e",
    padding: 20,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  headerSub: {
    color: "#aaa",
    fontSize: 12,
  },

  scrollContent: {
    padding: 16,
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 16,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },

  pedidoItem: {
    marginBottom: 12,
  },

  pedidoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  pedidoNome: { fontWeight: "bold" },

  pedidoDetalhe: { fontSize: 12 },

  pedidoData: { fontSize: 10, color: "#777" },

  pedidoActions: {
    flexDirection: "row",
    marginTop: 8,
  },

  actionBtn: {
    flex: 1,
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
    marginRight: 5,
  },

  btnRecusar: { backgroundColor: "#fca5a5" },
  btnAceitar: { backgroundColor: "#2563eb" },
  btnAceitarDoacao: { backgroundColor: "#16a34a" },

  btnRecusarText: { color: "#7f1d1d" },
  btnAceitarText: { color: "#fff" },

  badge: {
    backgroundColor: "#fef3c7",
    padding: 5,
    borderRadius: 10,
  },

  badgeText: { fontSize: 10 },
});