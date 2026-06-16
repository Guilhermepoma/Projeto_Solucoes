import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Linking,
  Platform,
  Image,
} from "react-native";
import { Calendar } from "react-native-calendars";
import * as Location from "expo-location";
import * as Clipboard from "expo-clipboard";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { DoacoesContext } from "../DoacoesContext";
import { TemaContext } from "../TemaContext";

const categorias = ["Cesta básica", "Alimentos", "Higiene", "Limpeza", "Pagamento por PIX", "Outros"];
const entregas = ["Posso entregar", "Precisa retirar"];
const postos = [
  { nome: "Centro Comunitário", endereco: "Rua Afonso Pena, 150 - Centro, São Paulo - SP" },
  { nome: "Posto Zona Sul", endereco: "Av. Paulista, 1000 - Bela Vista, São Paulo - SP" },
  { nome: "Posto Zona Norte", endereco: "Rua Augusta, 500 - Consolação, São Paulo - SP" },
];

export default function FazerDoacao({ navigation }) {
  const { adicionarDoacao } = useContext(DoacoesContext);
  const { modoNoturno, theme } = useContext(TemaContext);

  const [nome, setNome] = useState("");
  const [contato, setContato] = useState("");
  const [item, setItem] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [categoria, setCategoria] = useState(categorias[0]);
  const [entrega, setEntrega] = useState(entregas[0]);
  const [postoSelecionado, setPostoSelecionado] = useState(null);
  const [endereco, setEndereco] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [dataEntrega, setDataEntrega] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [comprovanteUri, setComprovanteUri] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const chavePix = "5cace8bb-494b-44b7-b125-7eb9cc8ad884";
  const isPix = categoria === "Pagamento por PIX";

  const inputStyle = {
    backgroundColor: theme.input,
    borderColor: modoNoturno ? theme.border : "#111827",
    color: theme.title,
  };

  const selecionarComprovante = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) {
      setComprovanteUri(result.assets[0].uri);
    }
  };

  const lerBase64 = async (uri) => {
    return await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
  };

  const limparForm = () => {
    setNome("");
    setContato("");
    setItem("");
    setQuantidade("");
    setCategoria(categorias[0]);
    setEntrega(entregas[0]);
    setPostoSelecionado(null);
    setEndereco("");
    setObservacoes("");
    setDataEntrega("");
    setShowCalendar(false);
    setComprovanteUri(null);
  };

  const enviar = async () => {
    if (!nome.trim() || !contato.trim() || !quantidade.trim()) {
      Alert.alert("Erro", "Preencha nome, contato e valor/quantidade");
      return;
    }

    if (isPix) {
      if (!quantidade.trim()) {
        Alert.alert("Erro", "Informe o valor em R$ para doação via PIX");
        return;
      }
    } else {
      if (!item.trim()) {
        Alert.alert("Erro", "Preencha o item principal");
        return;
      }
      if (entrega === "Posso entregar" && !postoSelecionado) {
        Alert.alert("Erro", "Selecione um posto de entrega");
        return;
      }
      if (entrega === "Precisa retirar" && !endereco.trim()) {
        Alert.alert("Erro", "Informe o endereço ou ponto de retirada");
        return;
      }
    }

    setEnviando(true);

    let base64 = null;
    if (isPix && comprovanteUri) {
      try {
        base64 = await lerBase64(comprovanteUri);
      } catch (error) {
        console.error("Erro ao ler comprovante:", error);
      }
    }

    const dados = isPix
      ? { nome, contato, quantidade, categoria, entrega: "PIX", comprovanteBase64: base64 }
      : {
          nome,
          contato,
          item,
          quantidade,
          categoria,
          entrega,
          endereco: entrega === "Posso entregar" ? postoSelecionado.endereco : endereco,
          observacoes,
          dataEntrega: dataEntrega || null,
        };

    await adicionarDoacao(dados);

    limparForm();
    setEnviando(false);
    Alert.alert("Enviado", "Sua doação foi enviada para aprovação");
    navigation.navigate("Home");
  };

  const abrirMapa = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão negada", "Permita o acesso à localização para usar o mapa");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;

      const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (geocode.length > 0) {
        const addr = geocode[0];
        const parts = [addr.street, addr.district, addr.city, addr.region, addr.country].filter(Boolean);
        setEndereco(parts.join(", "));
      }

      const url = Platform.select({
        ios: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
        android: `geo:${latitude},${longitude}?q=${latitude},${longitude}`,
        default: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
      });
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível abrir o mapa");
    }
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
          keyboardType="phone-pad"
        />

        <Text style={[styles.sectionTitle, { color: theme.title }]}>Itens da doação</Text>

        <Text style={[styles.label, { color: theme.text }]}>Categoria</Text>
        <View style={styles.chipGroup}>
          {categorias.map((opcao) =>
            renderChip(opcao, categoria === opcao, () => setCategoria(opcao))
          )}
        </View>

        {isPix ? (
          <>
            <Text style={[styles.label, { color: theme.text }]}>Valor em R$ *</Text>
            <TextInput
              style={[styles.input, inputStyle]}
              placeholder="Ex: 50,00"
              placeholderTextColor={theme.muted}
              value={quantidade}
              onChangeText={setQuantidade}
              keyboardType="numeric"
            />

            <Text style={[styles.sectionTitle, { color: theme.title }]}>Pagamento via PIX</Text>

            <View style={[styles.pixChaveBox, { backgroundColor: theme.cardAlt, borderColor: theme.border }]}>
              <Text style={[styles.pixChaveLabel, { color: theme.muted }]}>Chave PIX (aleatória)</Text>
              <Text style={[styles.pixChave, { color: theme.title }]} selectable>
                {chavePix}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.pixCopyBtn, { backgroundColor: theme.primary }]}
              onPress={() => {
                Clipboard.setString(chavePix);
                Alert.alert("Copiado", "Chave PIX copiada!");
              }}
            >
              <Text style={styles.pixCopyBtnText}>Copiar chave PIX</Text>
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <Text style={[styles.pixSectionTitle, { color: theme.title }]}>Comprovante</Text>
            <Text style={[styles.pixObs, { color: theme.muted }]}>
              Selecione o comprovante de pagamento para anexar (opcional).
            </Text>

            {comprovanteUri ? (
              <Image source={{ uri: comprovanteUri }} style={styles.pixPreview} />
            ) : null}

            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.pixSelectBtn, { backgroundColor: theme.cardAlt, borderColor: theme.border }]}
              onPress={selecionarComprovante}
            >
              <Text style={[styles.pixSelectBtnText, { color: theme.title }]}>
                {comprovanteUri ? "Trocar comprovante" : "Selecionar da galeria"}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
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

            {entrega === "Posso entregar" ? (
              <>
                <Text style={[styles.label, { color: theme.text }]}>Posto de entrega *</Text>
                <View style={styles.postoGroup}>
                  {postos.map((posto) => {
                    const selected = postoSelecionado?.nome === posto.nome;
                    return (
                      <TouchableOpacity
                        key={posto.nome}
                        activeOpacity={0.8}
                        style={[
                          styles.postoCard,
                          {
                            backgroundColor: selected ? theme.primary : theme.cardAlt,
                            borderColor: selected ? theme.primary : modoNoturno ? theme.border : "#111827",
                          },
                        ]}
                        onPress={() => setPostoSelecionado(posto)}
                      >
                        <Text style={[styles.postoNome, { color: selected ? "#FFFFFF" : theme.title }]}>
                          {posto.nome}
                        </Text>
                        <Text style={[styles.postoEndereco, { color: selected ? "#FFFFFF" : theme.muted }]}>
                          {posto.endereco}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </>
            ) : (
              <>
                <Text style={[styles.label, { color: theme.text }]}>Endereço para retirada *</Text>
                <TextInput
                  style={[styles.input, inputStyle]}
                  placeholder="Bairro, rua ou ponto de referência"
                  placeholderTextColor={theme.muted}
                  value={endereco}
                  onChangeText={setEndereco}
                />
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.mapButton, { backgroundColor: theme.primary }]}
                  onPress={abrirMapa}
                >
                  <Text style={styles.mapButtonText}>Selecionar no mapa</Text>
                </TouchableOpacity>
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
          </>
        )}

        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.botao, { backgroundColor: theme.primary }]}
          onPress={enviar}
          disabled={enviando}
        >
          <Text style={styles.botaoTexto}>{enviando ? "Enviando..." : "Enviar para aprovação"}</Text>
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

  mapButton: {
    padding: 14,
    alignItems: "center",
    borderRadius: 12,
    marginBottom: 14,
  },

  mapButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  postoGroup: {
    marginBottom: 14,
  },

  postoCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },

  postoNome: {
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 4,
  },

  postoEndereco: {
    fontSize: 13,
    lineHeight: 18,
  },

  pixChaveBox: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
  },
  pixChaveLabel: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
  },
  pixChave: {
    fontSize: 16,
    fontWeight: "800",
  },
  pixCopyBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  pixCopyBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  pixOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  pixSectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 6,
    alignSelf: "flex-start",
  },
  pixPreview: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  pixSelectBtn: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  pixSelectBtnText: {
    fontSize: 15,
    fontWeight: "800",
  },
  divider: {
    width: "100%",
    height: 1,
    marginVertical: 16,
  },
  pixObs: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 18,
  },
  txt: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "800",
  },
});
