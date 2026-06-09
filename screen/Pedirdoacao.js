import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { DoacoesContext } from "../DoacoesContext";

import { TemaContext } from "../TemaContext";
import { AuthContext } from "../AuthContext";

export default function PedirDoacao({ navigation }) {
  const { doacoes, atualizarStatus } = useContext(DoacoesContext);
  const { modoNoturno, theme } = useContext(TemaContext);
  const { user } = useContext(AuthContext);

  const disponiveis = doacoes.filter((d) => d.status === "disponivel");

  const [deliveryDates, setDeliveryDates] = useState({});
  const [showCalendars, setShowCalendars] = useState({});
  const [metodosEntrega, setMetodosEntrega] = useState({});
  const [locaisEntrega, setLocaisEntrega] = useState({});

  const solicitar = async (id) => {
    await atualizarStatus(id, "pendente_aprovacao_pedido", {
      solicitanteId: user?.uid,
      solicitanteEmail: user?.email,
      solicitanteData: deliveryDates[id] || null,
      solicitanteMetodo: metodosEntrega[id] || "Vou buscar",
      solicitanteLocal: locaisEntrega[id] || "",
      solicitadoEm: new Date().toISOString(),
    });
  };

  const opcoesEntrega = ["Vou buscar", "Preciso receber"];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
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

          {!!d.observacoes && (
            <Text style={[styles.detailText, { color: theme.text }]}>
              Observações: {d.observacoes}
            </Text>
          )}

          <Text style={[styles.sectionLabel, { color: theme.title }]}>Data de entrega</Text>
          {deliveryDates[d.id] ? (
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.dateButton, { backgroundColor: theme.cardAlt, borderColor: theme.border }]}
              onPress={() =>
                setShowCalendars((prev) => ({ ...prev, [d.id]: !prev[d.id] }))
              }
            >
              <Text style={[styles.dateButtonText, { color: theme.title }]}>
                {deliveryDates[d.id]}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.dateButton, { backgroundColor: theme.cardAlt, borderColor: theme.border }]}
              onPress={() =>
                setShowCalendars((prev) => ({ ...prev, [d.id]: true }))
              }
            >
              <Text style={{ color: theme.muted }}>Selecionar data</Text>
            </TouchableOpacity>
          )}

          {showCalendars[d.id] && (
            <View style={styles.calendarWrap}>
              <Calendar
                minDate={new Date().toISOString().split("T")[0]}
                theme={{
                  backgroundColor: theme.card,
                  calendarBackground: theme.card,
                  dayTextColor: theme.title,
                  monthTextColor: theme.title,
                  arrowColor: theme.primary,
                  todayTextColor: theme.primary,
                  selectedDayBackgroundColor: theme.primary,
                  selectedDayTextColor: "#FFFFFF",
                  textSectionTitleColor: theme.muted,
                }}
                onDayPress={(day) => {
                  setDeliveryDates((prev) => ({ ...prev, [d.id]: day.dateString }));
                  setShowCalendars((prev) => ({ ...prev, [d.id]: false }));
                }}
                markedDates={
                  deliveryDates[d.id]
                    ? { [deliveryDates[d.id]]: { selected: true, selectedColor: theme.primary } }
                    : {}
                }
              />
            </View>
          )}

          <Text style={[styles.sectionLabel, { color: theme.title }]}>Método de entrega</Text>
          <View style={styles.chipGroup}>
            {opcoesEntrega.map((opcao) => (
              <TouchableOpacity
                key={opcao}
                activeOpacity={0.8}
                style={[
                  styles.chip,
                  {
                    backgroundColor: metodosEntrega[d.id] === opcao ? theme.primary : theme.cardAlt,
                    borderColor: metodosEntrega[d.id] === opcao ? theme.primary : modoNoturno ? theme.border : "#111827",
                  },
                ]}
                onPress={() =>
                  setMetodosEntrega((prev) => ({ ...prev, [d.id]: opcao }))
                }
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: metodosEntrega[d.id] === opcao ? "#FFFFFF" : theme.title },
                  ]}
                >
                  {opcao}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {metodosEntrega[d.id] === "Preciso receber" && (
            <>
              <Text style={[styles.sectionLabel, { color: theme.title }]}>
                Local para retirada *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: theme.input, borderColor: modoNoturno ? theme.border : "#111827", color: theme.title },
                ]}
                placeholder="Bairro, rua, ponto de referência..."
                placeholderTextColor={theme.muted}
                value={locaisEntrega[d.id] || ""}
                onChangeText={(text) =>
                  setLocaisEntrega((prev) => ({ ...prev, [d.id]: text }))
                }
              />
            </>
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
        onPress={() => navigation.navigate("Home")}
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

  detailText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },

  sectionLabel: {
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 8,
    marginTop: 6,
  },

  dateButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 14,
  },

  dateButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },

  calendarWrap: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 14,
  },

  chipGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 14,
  },

  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },

  chipText: {
    fontSize: 13,
    fontWeight: "800",
  },

  input: {
    borderWidth: 1,
    marginBottom: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderRadius: 12,
    fontSize: 16,
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
