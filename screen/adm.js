import React, { useState } from "react";
import {View,Text,StyleSheet,ScrollView,TouchableOpacity,SafeAreaView,tatusBar,FlatList,
} from "react-native";

// Dados de exemplo
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

  const aceitarCesta = (id) => {
    setCestas((prev) => prev.filter((p) => p.id !== id));
  };

  const recusarCesta = (id) => {
    setCestas((prev) => prev.filter((p) => p.id !== id));
  };

  const aceitarDoacao = (id) => {
    setDoacoes((prev) => prev.filter((p) => p.id !== id));
  };

  const recusarDoacao = (id) => {
    setDoacoes((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Painel ADM</Text>
        <Text style={styles.headerSub}>Gerenciamento de Pedidos</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Card: Pedidos de Cestas */}
        <View style={styles.card}>
          <View style={[styles.cardHeader, styles.cardHeaderCesta]}>
            <View style={styles.cardTitleRow}>
              <Text style={styles.cardIcon}>🧺</Text>
              <View>
                <Text style={styles.cardTitle}>Pedidos de Cestas</Text>
                <Text style={styles.cardCount}>
                  {cestas.length} pedido{cestas.length !== 1 ? "s" : ""} pendente{cestas.length !== 1 ? "s" : ""}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.cardBody}>
            {cestas.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>✅</Text>
                <Text style={styles.emptyText}>Nenhum pedido pendente</Text>
              </View>
            ) : (
              cestas.map((item, index) => (
                <React.Fragment key={item.id}>
                  <PedidoCestaCard
                    item={item}
                    onAceitar={aceitarCesta}
                    onRecusar={recusarCesta}
                  />
                  {index < cestas.length - 1 && <View style={styles.divider} />}
                </React.Fragment>
              ))
            )}
          </View>
        </View>

        {/* Card: Pedidos de Doações */}
        <View style={styles.card}>
          <View style={[styles.cardHeader, styles.cardHeaderDoacao]}>
            <View style={styles.cardTitleRow}>
              <Text style={styles.cardIcon}>🤝</Text>
              <View>
                <Text style={styles.cardTitle}>Pedidos de Doações</Text>
                <Text style={styles.cardCount}>
                  {doacoes.length} pedido{doacoes.length !== 1 ? "s" : ""} pendente{doacoes.length !== 1 ? "s" : ""}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.cardBody}>
            {doacoes.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>✅</Text>
                <Text style={styles.emptyText}>Nenhum pedido pendente</Text>
              </View>
            ) : (
              doacoes.map((item, index) => (
                <React.Fragment key={item.id}>
                  <PedidoDoacaoCard
                    item={item}
                    onAceitar={aceitarDoacao}
                    onRecusar={recusarDoacao}
                  />
                  {index < doacoes.length - 1 && <View style={styles.divider} />}
                </React.Fragment>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },

  // Header
  header: {
    backgroundColor: "#1a1a2e",
    paddingHorizontal: 20,
    paddingVertical: 18,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  headerSub: {
    fontSize: 13,
    color: "#a0a8c0",
    marginTop: 2,
  },

  // Scroll
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },

  // Card
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  cardHeaderCesta: {
    backgroundColor: "#e8f4fd",
    borderBottomWidth: 1,
    borderBottomColor: "#c8e6f9",
  },
  cardHeaderDoacao: {
    backgroundColor: "#edf7ed",
    borderBottomWidth: 1,
    borderBottomColor: "#c3e6c3",
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardIcon: {
    fontSize: 28,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a2e",
  },
  cardCount: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  cardBody: {
    paddingHorizontal: 4,
  },

  // Pedido item
  pedidoItem: {
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  pedidoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  pedidoNome: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a2e",
  },
  pedidoDetalhe: {
    fontSize: 13,
    color: "#4b5563",
    marginTop: 2,
  },
  pedidoData: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 4,
  },

  // Badge
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: "#fee2e2",
  },
  badgePendente: {
    backgroundColor: "#fef3c7",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#92400e",
  },

  // Ações
  pedidoActions: {
    flexDirection: "row",
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: "center",
  },
  btnRecusar: {
    backgroundColor: "#fee2e2",
    borderWidth: 1,
    borderColor: "#fca5a5",
  },
  btnAceitar: {
    backgroundColor: "#2563eb",
  },
  btnAceitarDoacao: {
    backgroundColor: "#16a34a",
  },
  btnRecusarText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#dc2626",
  },
  btnAceitarText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#ffffff",
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: "#f3f4f6",
    marginHorizontal: 14,
  },

  // Empty state
  emptyState: {
    alignItems: "center",
    paddingVertical: 28,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#9ca3af",
    fontWeight: "500",
  },
});