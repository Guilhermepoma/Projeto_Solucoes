import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { DoacoesContext } from "../DoacoesContext";
import { TemaContext } from "../TemaContext";

const categorias = ["Cesta básica", "Alimentos", "Higiene", "Limpeza", "Outros"];
const entregas = ["Entrego pessoalmente", "Retirada no local"];

export default function FazerDoacao({ navigation }) {
  const { adicionarDoacao } = useContext(DoacoesContext);
  const { modoNoturno, theme } = useContext(TemaContext);

  const [nome, setNome] = useState("");
  const [contato, setContato] = useState("");
  const [item, setItem] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [categoria, setCategoria] = useState(categorias[0]);
  const [entrega, setEntrega] = useState(entregas[0]);
  const [endereco, setEndereco] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [dataEntrega, setDataEntrega] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);

  const inputStyle = {
    backgroundColor: theme.input,
    borderColor: modoNoturno ? theme.border : "#111827",
    color: theme.title,
  };

  const enviar = () => {
    if (!nome.trim() || !contato.trim() || !item.trim() || !quantidade.trim()) {
      Alert.alert("Erro", "Preencha nome, contato, item e quantidade");
      return;
    }

    if (entrega === "Retirada no local" && !endereco.trim()) {
      Alert.alert("Erro", "Informe o endereço ou ponto de retirada");
      return;
    }

    adicionarDoacao({
      nome,
      contato,
      item,
      quantidade,
      categoria,
      entrega,
      endereco,
      observacoes,
      dataEntrega: dataEntrega || null,
    });

    Alert.alert("Enviado", "Sua doação foi enviada para aprovação");
    navigation.navigate("Home");
  };

  const renderChip = (label, selected, onPress) => (
    <TouchableOpacity
      key={label}
      activeOpacity={0.8}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? theme.primary : theme.cardAlt,
          borderColor: selected ? theme.primary : modoNoturno ? theme.border : "#111827",
        },
      ]}
      onPress={onPress}
    >
      <Text style={[styles.chipText, { color: selected ? "#FFFFFF" : theme.title }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={[styles.hero, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.kicker, { color: theme.primary }]}>Nova contribuição</Text>
        <Text style={[styles.titulo, { color: theme.title }]}>Fazer Doação</Text>
        <Text style={[styles.subtitulo, { color: theme.muted }]}>
          Informe o que será doado para facilitar a aprovação e a entrega.
        </Text>
      </View>

      <View style={[styles.formCard, { backgroundColor: theme.card, borderColor: "#111827" }]}>
        <Text style={[styles.sectionTitle, { color: theme.title }]}>Dados do doador</Text>

        <Text style={[styles.label, { color: theme.text }]}>Nome completo *</Text>
        <TextInput
          style={[styles.input, inputStyle]}
          placeholder="Ex: Maria Silva"
          placeholderTextColor={theme.muted}
          value={nome}
          onChangeText={setNome}
        />

        <Text style={[styles.label, { color: theme.text }]}>Contato *</Text>
        <TextInput
          style={[styles.input, inputStyle]}
          placeholder="Telefone, WhatsApp ou e-mail"
          placeholderTextColor={theme.muted}
          value={contato}
          onChangeText={setContato}
          keyboardType="email-address"
        />

        <Text style={[styles.sectionTitle, { color: theme.title }]}>Itens da doação</Text>

        <Text style={[styles.label, { color: theme.text }]}>Categoria</Text>
        <View style={styles.chipGroup}>
          {categorias.map((opcao) =>
            renderChip(opcao, categoria === opcao, () => setCategoria(opcao))
          )}
        </View>

        <Text style={[styles.label, { color: theme.text }]}>Item principal *</Text>
        <TextInput
          style={[styles.input, inputStyle]}
          placeholder="Ex: Arroz, feijão, cesta básica"
          placeholderTextColor={theme.muted}
          value={item}
          onChangeText={setItem}
        />

        <Text style={[styles.label, { color: theme.text }]}>Quantidade *</Text>
        <TextInput
          style={[styles.input, inputStyle]}
          placeholder="Ex: 2 cestas, 5 kg, 10 unidades"
          placeholderTextColor={theme.muted}
          value={quantidade}
          onChangeText={setQuantidade}
        />

        <Text style={[styles.sectionTitle, { color: theme.title }]}>Entrega</Text>

        <Text style={[styles.label, { color: theme.text }]}>Data de entrega</Text>
        {dataEntrega ? (
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.dateButton, { backgroundColor: theme.cardAlt, borderColor: theme.border }]}
            onPress={() => setShowCalendar(!showCalendar)}
          >
            <Text style={[styles.dateButtonText, { color: theme.title }]}>{dataEntrega}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.dateButton, { backgroundColor: theme.cardAlt, borderColor: theme.border }]}
            onPress={() => setShowCalendar(true)}
          >
            <Text style={{ color: theme.muted }}>Selecionar data</Text>
          </TouchableOpacity>
        )}

        {showCalendar && (
          <View style={styles.calendarWrap}>
            <Calendar
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
                setDataEntrega(day.dateString);
                setShowCalendar(false);
              }}
              markedDates={dataEntrega ? { [dataEntrega]: { selected: true, selectedColor: theme.primary } } : {}}
            />
          </View>
        )}

        <View style={styles.chipGroup}>
          {entregas.map((opcao) =>
            renderChip(opcao, entrega === opcao, () => setEntrega(opcao))
          )}
        </View>

        {entrega === "Retirada no local" && (
          <>
            <Text style={[styles.label, { color: theme.text }]}>Endereço para retirada *</Text>
            <TextInput
              style={[styles.input, inputStyle]}
              placeholder="Bairro, rua ou ponto de referência"
              placeholderTextColor={theme.muted}
              value={endereco}
              onChangeText={setEndereco}
            />
          </>
        )}

        <Text style={[styles.label, { color: theme.text }]}>Observações</Text>
        <TextInput
          style={[styles.input, styles.textArea, inputStyle]}
          placeholder="Validade, melhor horário, detalhes dos itens..."
          placeholderTextColor={theme.muted}
          value={observacoes}
          onChangeText={setObservacoes}
          multiline
          textAlignVertical="top"
        />

        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.botao, { backgroundColor: theme.primary }]}
          onPress={enviar}
        >
          <Text style={styles.botaoTexto}>Enviar para aprovação</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 16,
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

  formCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 8,
    marginBottom: 14,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    marginBottom: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderRadius: 12,
    fontSize: 16,
  },

  textArea: {
    minHeight: 96,
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

  botao: {
    padding: 16,
    alignItems: "center",
    borderRadius: 14,
    marginTop: 6,
  },

  botaoTexto: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});
