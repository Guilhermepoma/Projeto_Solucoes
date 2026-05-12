// DonationScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";

export default function DonationScreen() {
  const [valor, setValor] = useState("");
  const [item, setItem] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [itens, setItens] = useState([]);

  const valoresRapidos = ["10", "25", "50", "100"];

  const adicionarItem = () => {
    if (!item || !quantidade) {
      Alert.alert("Atenção", "Informe o item e a quantidade");
      return;
    }

    const novoItem = {
      nome: item,
      quantidade: quantidade,
    };

    setItens([...itens, novoItem]);

    setItem("");
    setQuantidade("");
  };

  const realizarDoacao = () => {
    if (!valor) {
      Alert.alert("Atenção", "Informe um valor para doar");
      return;
    }

    Alert.alert(
      "Doação realizada",
      `Obrigado pela sua doação de R$ ${valor}`
    );

    setValor("");
    setItens([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.titulo}>Doação</Text>

        <Text style={styles.subtitulo}>
          Doação de cestas básicas
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>
            Escolha o valor da cesta básica
          </Text>

          <View style={styles.valoresContainer}>
            {valoresRapidos.map((itemValor) => (
              <TouchableOpacity
                key={itemValor}
                style={styles.valorBotao}
                onPress={() => setValor(itemValor)}
              >
                <Text style={styles.valorTexto}>
                  R$ {itemValor}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Digite outro valor"
            keyboardType="numeric"
            value={valor}
            onChangeText={setValor}
          />

          <Text style={styles.label}>
            Adicionar itens da cesta
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Nome do item"
            value={item}
            onChangeText={setItem}
          />

          <TextInput
            style={styles.input}
            placeholder="Quantidade"
            keyboardType="numeric"
            value={quantidade}
            onChangeText={setQuantidade}
          />

          <TouchableOpacity
            style={styles.botaoAdicionar}
            onPress={adicionarItem}
          >
            <Text style={styles.botaoTexto}>
              Adicionar Item
            </Text>
          </TouchableOpacity>

          {itens.length > 0 && (
            <View style={styles.listaItens}>
              <Text style={styles.label}>Itens adicionados:</Text>

              {itens.map((itemAdicionado, index) => (
                <View key={index} style={styles.itemCard}>
                  <Text style={styles.itemTexto}>
                    • {itemAdicionado.nome} -{" "}
                    {itemAdicionado.quantidade}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={styles.botaoDoar}
            onPress={realizarDoacao}
          >
            <Text style={styles.botaoTexto}>
              Doar Agora
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },

  content: {
    padding: 20,
    justifyContent: "center",
    flexGrow: 1,
  },

  titulo: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "#0F172A",
  },

  subtitulo: {
    fontSize: 16,
    textAlign: "center",
    color: "#64748B",
    marginTop: 10,
    marginBottom: 30,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 12,
  },

  valoresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  valorBotao: {
    backgroundColor: "#a1c8e2ff",
    paddingVertical: 14,
    width: "48%",
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
  },

  valorTexto: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
  },

  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
  },

  botaoAdicionar: {
    backgroundColor: "#38BDF8",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },

  listaItens: {
    marginBottom: 20,
  },

  itemCard: {
    backgroundColor: "#E2E8F0",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  itemTexto: {
    fontSize: 16,
    color: "#0F172A",
  },

  botaoDoar: {
    backgroundColor: "#4493fcff",
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
  },

  botaoTexto: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});