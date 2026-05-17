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

export default function PedirDoacao({ navigation }) {
  const { doacoes, atualizarStatus } = useContext(DoacoesContext);
  const { modoNoturno, theme } = useContext(TemaContext);

  const disponiveis = doacoes.filter((d) => d.status === "disponivel");

  const solicitar = (id) => {
    atualizarStatus(id, "pendente_aprovacao_pedido");
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={[styles.hero, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.kicker, { color: theme.success }]}>Solicitar ajuda</Text>
        <Text style={[styles.titulo, { color: theme.title }]}>Doações Disponíveis</Text>
        <Text style={[styles.subtitulo, { color: theme.muted }]}>
          Veja os itens aprovados e solicite o que sua família precisa.
        </Text>
      </View>

      <View style={styles.summaryRow}>
        <View
          style={[
            styles.summaryCard,
            { backgroundColor: theme.cardAlt, borderColor: modoNoturno ? theme.border : "#111827" },
          ]}
        >
          <Text style={[styles.summaryNumber, { color: theme.title }]}>{disponiveis.length}</Text>
          <Text style={[styles.summaryLabel, { color: theme.muted }]}>disponíveis agora</Text>
        </View>
      </View>

      {disponiveis.length === 0 && (
        <View
          style={[
            styles.emptyCard,
            { backgroundColor: theme.card, borderColor: modoNoturno ? theme.border : "#111827" },
          ]}
        >
          <Text style={styles.emptyIcon}>!</Text>
          <Text style={[styles.emptyTitle, { color: theme.title }]}>Nenhuma doação disponível</Text>
          <Text style={[styles.emptyText, { color: theme.muted }]}>
            Assim que uma doação for aprovada, ela aparecerá aqui para solicitação.
          </Text>
        </View>
      )}

      {disponiveis.map((d) => (
        <View
          key={d.id}
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: modoNoturno ? theme.border : "#111827" },
          ]}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconCircle, { backgroundColor: theme.success }]}>
              <Text style={styles.iconText}>+</Text>
            </View>

            <View style={styles.cardTitleWrap}>
              <Text style={[styles.itemTitle, { color: theme.title }]}>{d.item}</Text>
              <Text style={[styles.itemSubtitle, { color: theme.muted }]}>
                {d.categoria || "Doação"} • {d.quantidade}
              </Text>
            </View>
          </View>

          <View style={styles.infoGrid}>
            <View style={[styles.infoBox, { backgroundColor: theme.cardAlt, borderColor: theme.border }]}>
              <Text style={[styles.infoLabel, { color: theme.muted }]}>Entrega</Text>
              <Text style={[styles.infoValue, { color: theme.title }]}>
                {d.entrega || "A combinar"}
              </Text>
            </View>

            <View style={[styles.infoBox, { backgroundColor: theme.cardAlt, borderColor: theme.border }]}>
              <Text style={[styles.infoLabel, { color: theme.muted }]}>Contato</Text>
              <Text style={[styles.infoValue, { color: theme.title }]}>
                {d.contato || "Após aprovação"}
              </Text>
            </View>
          </View>

          {!!d.endereco && (
            <Text style={[styles.detailText, { color: theme.text }]}>
              Local: {d.endereco}
            </Text>
          )}

          {!!d.observacoes && (
            <Text style={[styles.detailText, { color: theme.text }]}>
              Observações: {d.observacoes}
            </Text>
          )}

          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.botao, { backgroundColor: theme.primary }]}
            onPress={() => solicitar(d.id)}
          >
            <Text style={styles.txt}>Solicitar doação</Text>
          </TouchableOpacity>
        </View>
      ))}

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
    fontSize: 29,
    fontWeight: "800",
    marginBottom: 8,
  },

  subtitulo: {
    fontSize: 15,
    lineHeight: 22,
  },

  summaryRow: {
    marginBottom: 14,
  },

  summaryCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
  },

  summaryNumber: {
    fontSize: 28,
    fontWeight: "800",
  },

  summaryLabel: {
    fontSize: 14,
    fontWeight: "700",
  },

  emptyCard: {
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 20,
    padding: 24,
    marginTop: 6,
  },

  emptyIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FACC15",
    color: "#111827",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
    textAlign: "center",
  },

  emptyText: {
    fontSize: 14,
    lineHeight: 20,
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

  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  iconText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
  },

  cardTitleWrap: {
    flex: 1,
  },

  itemTitle: {
    fontSize: 19,
    fontWeight: "800",
    marginBottom: 4,
  },

  itemSubtitle: {
    fontSize: 14,
    fontWeight: "700",
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

  detailText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },

  botao: {
    padding: 13,
    marginTop: 6,
    borderRadius: 12,
  },

  voltar: {
    padding: 13,
    marginTop: 6,
    borderRadius: 12,
    alignItems: "center",
  },

  txt: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "800",
  },
});
