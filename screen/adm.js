import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { DoacoesContext } from "../DoacoesContext";
import { TemaContext } from "../TemaContext";

export default function Adm({ navigation }) {
  const { doacoes, atualizarStatus } = useContext(DoacoesContext);
  const { modoNoturno, theme } = useContext(TemaContext);

  const doacoesPendentes = doacoes.filter(
    (d) => d.status === "pendente_aprovacao_doacao"
  );

  const pedidosPendentes = doacoes.filter(
    (d) => d.status === "pendente_aprovacao_pedido"
  );

  const borderColor = modoNoturno ? theme.border : "#111827";

  const renderVazio = (texto) => (
    <View style={[styles.emptyBox, { backgroundColor: theme.cardAlt, borderColor }]}>
      <Text style={[styles.emptyText, { color: theme.muted }]}>{texto}</Text>
    </View>
  );

  const renderCard = (d, tipo) => {
    const isDoacao = tipo === "doacao";
    const aprovarStatus = isDoacao ? "disponivel" : "finalizado";
    const etiqueta = isDoacao ? "Nova doação" : "Pedido de retirada";

    return (
      <View
        key={d.id}
        style={[styles.card, { backgroundColor: theme.card, borderColor }]}
      >
        <View style={styles.cardHeader}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: isDoacao ? theme.primary : theme.success },
            ]}
          />

          <View style={styles.cardTitleWrap}>
            <Text style={[styles.cardKicker, { color: theme.muted }]}>{etiqueta}</Text>
            <Text style={[styles.cardTitle, { color: theme.title }]}>{d.item}</Text>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <View style={[styles.infoBox, { backgroundColor: theme.cardAlt, borderColor: theme.border }]}>
            <Text style={[styles.infoLabel, { color: theme.muted }]}>Quantidade</Text>
            <Text style={[styles.infoValue, { color: theme.title }]}>{d.quantidade}</Text>
          </View>

          <View style={[styles.infoBox, { backgroundColor: theme.cardAlt, borderColor: theme.border }]}>
            <Text style={[styles.infoLabel, { color: theme.muted }]}>Categoria</Text>
            <Text style={[styles.infoValue, { color: theme.title }]}>
              {d.categoria || "Doação"}
            </Text>
          </View>
        </View>

        <View style={styles.metaList}>
          <Text style={[styles.metaText, { color: theme.text }]}>
            Doador: {d.nome || "Não informado"}
          </Text>
          <Text style={[styles.metaText, { color: theme.text }]}>
            Contato: {d.contato || "Não informado"}
          </Text>
          <Text style={[styles.metaText, { color: theme.text }]}>
            Entrega: {d.entrega || "A combinar"}
          </Text>

          {!!d.endereco && (
            <Text style={[styles.metaText, { color: theme.text }]}>Local: {d.endereco}</Text>
          )}

          {!!d.observacoes && (
            <Text style={[styles.metaText, { color: theme.text }]}>
              Observações: {d.observacoes}
            </Text>
          )}
        </View>

        <View style={styles.row}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.actionButton, { backgroundColor: theme.success }]}
            onPress={() => atualizarStatus(d.id, aprovarStatus)}
          >
            <Text style={styles.txt}>Aprovar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.actionButton, { backgroundColor: theme.danger }]}
            onPress={() => atualizarStatus(d.id, "recusado")}
          >
            <Text style={styles.txt}>Recusar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={[styles.hero, { backgroundColor: theme.card, borderColor }]}>
        <Text style={[styles.kicker, { color: theme.admin }]}>Painel de controle</Text>
        <Text style={[styles.titulo, { color: theme.title }]}>Área ADM</Text>
        <Text style={[styles.subtitulo, { color: theme.muted }]}>
          Aprove doações, revise pedidos e mantenha o fluxo organizado.
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: theme.cardAlt, borderColor }]}>
          <Text style={[styles.statNumber, { color: theme.title }]}>{doacoesPendentes.length}</Text>
          <Text style={[styles.statLabel, { color: theme.muted }]}>doações</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.cardAlt, borderColor }]}>
          <Text style={[styles.statNumber, { color: theme.title }]}>{pedidosPendentes.length}</Text>
          <Text style={[styles.statLabel, { color: theme.muted }]}>pedidos</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sub, { color: theme.title }]}>Doações Pendentes</Text>
        <Text style={[styles.badge, { color: theme.primary }]}>{doacoesPendentes.length}</Text>
      </View>

      {doacoesPendentes.length === 0
        ? renderVazio("Nenhuma doação aguardando aprovação")
        : doacoesPendentes.map((d) => renderCard(d, "doacao"))}

      <View style={styles.sectionHeader}>
        <Text style={[styles.sub, { color: theme.title }]}>Pedidos Pendentes</Text>
        <Text style={[styles.badge, { color: theme.success }]}>{pedidosPendentes.length}</Text>
      </View>

      {pedidosPendentes.length === 0
        ? renderVazio("Nenhum pedido aguardando aprovação")
        : pedidosPendentes.map((d) => renderCard(d, "pedido"))}

      <TouchableOpacity
        activeOpacity={0.85}
        style={[styles.voltar, { backgroundColor: theme.admin }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.txt}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 34,
  },

  hero: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 20,
    marginBottom: 14,
  },

  kicker: {
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 8,
  },

  titulo: {
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 8,
  },

  subtitulo: {
    fontSize: 15,
    lineHeight: 22,
  },

  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
  },

  statCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
  },

  statNumber: {
    fontSize: 30,
    fontWeight: "900",
  },

  statLabel: {
    fontSize: 14,
    fontWeight: "800",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 10,
  },

  sub: {
    fontSize: 19,
    fontWeight: "800",
  },

  badge: {
    fontSize: 16,
    fontWeight: "900",
  },

  emptyBox: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },

  emptyText: {
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },

  card: {
    padding: 16,
    borderRadius: 20,
    marginBottom: 14,
    borderWidth: 1,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  statusDot: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },

  cardTitleWrap: {
    flex: 1,
  },

  cardKicker: {
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 3,
  },

  cardTitle: {
    fontSize: 19,
    fontWeight: "900",
  },

  infoGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },

  infoBox: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
  },

  infoLabel: {
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 5,
  },

  infoValue: {
    fontSize: 14,
    fontWeight: "800",
  },

  metaList: {
    marginBottom: 10,
  },

  metaText: {
    fontSize: 14,
    lineHeight: 21,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    gap: 10,
  },

  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
  },

  voltar: {
    padding: 13,
    marginTop: 8,
    borderRadius: 12,
    alignItems: "center",
  },

  txt: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "800",
  },
});
