import React, { useContext, useState, useEffect, useMemo } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, Alert, ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { TemaContext } from "../TemaContext";
import { AuthContext } from '../AuthContext';
import { DoacoesContext } from "../DoacoesContext";
import firebase from '../firebaseConfig';

export default function Perfil() {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [editandoEmail, setEditandoEmail] = useState(false);
  const { modoNoturno, setModoNoturno, theme } = useContext(TemaContext);
  const { doacoes } = useContext(DoacoesContext);

  useEffect(() => {
    if (user) setEmail(user.email);
  }, [user]);

  const meusPedidos = useMemo(() =>
    doacoes
      .filter((d) => d.solicitanteId === user?.uid)
      .sort((a, b) => (b.solicitadoEm || "").localeCompare(a.solicitadoEm || "")),
    [doacoes, user]
  );

  const statusPedido = (status) => {
    const config = {
      pendente_aprovacao_pedido: { label: "Aguardando aprovação", cor: "#F59E0B" },
      finalizado: { label: "Aprovado", cor: "#22C55E" },
      recusado: { label: "Recusado", cor: "#EF4444" },
      disponivel: { label: "Disponível", cor: "#3B82F6" },
    };
    return config[status] || { label: status, cor: "#9CA3AF" };
  };

  const logout = async () => {
    try {
      await firebase.auth().signOut();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível sair.");
    }
  };

  const salvarEmail = async () => {
    if (!email.trim()) {
      Alert.alert("Erro", "Digite um e-mail válido");
      return;
    }
    try {
    
      await user.updateEmail(email);
    
      await firebase.firestore().collection('usuarios').doc(user.uid).set({
        email,
        atualizadoEm: new Date().toISOString(),
      }, { merge: true });
      setEditandoEmail(false);
      Alert.alert("Pronto", "E-mail atualizado com sucesso");
    } catch (error) {
      Alert.alert("Erro", error.message || "Não foi possível atualizar o e-mail.");
    }
  };

  const borderColor = modoNoturno ? theme.border : "#111827";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View
          style={[
            styles.profileCard,
            { backgroundColor: theme.card, borderColor: "#111827" },
          ]}
        >
          <TouchableOpacity activeOpacity={0.85} style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.email?.charAt(0).toUpperCase() || "U"}</Text>
          </TouchableOpacity>

          <Text style={[styles.name, { color: theme.title }]}>Meu Perfil</Text>
          <Text style={[styles.subtitle, { color: theme.muted }]}>
            Gerencie suas informações e preferências.
          </Text>
        </View>

        <View
          style={[
            styles.optionCard,
            { backgroundColor: theme.card, borderColor: "#111827" },
          ]}
        >
          <View style={styles.optionHeader}>
            <View>
              <Text style={[styles.optionTitle, { color: theme.title }]}>E-mail</Text>
              <Text style={[styles.optionSubtitle, { color: theme.muted }]}>
                Endereço usado na sua conta
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.smallButton,
                {
                  backgroundColor: theme.buttonSoft,
                  borderColor: modoNoturno ? theme.border : "#111827",
                },
              ]}
              onPress={editandoEmail ? salvarEmail : () => setEditandoEmail(true)}
            >
              <Text style={[styles.smallButtonText, { color: theme.buttonText }]}>
                {editandoEmail ? "Salvar" : "Trocar"}
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.input,
                borderColor: modoNoturno
                  ? editandoEmail
                    ? theme.primary
                    : theme.border
                  : "#111827",
                color: theme.title,
              },
            ]}
            value={email}
            onChangeText={setEmail}
            editable={editandoEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Digite seu e-mail"
            placeholderTextColor={theme.muted}
          />
        </View>

        <View
          style={[
            styles.optionCard,
            styles.rowCard,
            { backgroundColor: theme.card, borderColor: "#111827" },
          ]}
        >
          <View style={styles.optionText}>
            <Text style={[styles.optionTitle, { color: theme.title }]}>Modo noturno</Text>
            <Text style={[styles.optionSubtitle, { color: theme.muted }]}>
              Use cores mais escuras em todo o aplicativo
            </Text>
          </View>

          <Switch
            value={modoNoturno}
            onValueChange={setModoNoturno}
            trackColor={{ false: "#9CA3AF", true: "#93C5FD" }}
            thumbColor={modoNoturno ? "#FFFFFF" : "#111827"}
          />
        </View>

    
        <View style={[styles.pedidosHeader, { borderColor }]}>
          <View>
            <Text style={[styles.pedidosTitulo, { color: theme.title }]}>Meus Pedidos</Text>
            <Text style={[styles.pedidosSub, { color: theme.muted }]}>
              Histórico de solicitações feitas
            </Text>
          </View>
        </View>

        {meusPedidos.length === 0 ? (
          <View style={[styles.emptyBox, { backgroundColor: theme.cardAlt, borderColor }]}>
            <Text style={[styles.emptyText, { color: theme.muted }]}>
              Nenhum pedido encontrado
            </Text>
          </View>
        ) : (
          meusPedidos.map((p) => {
            const st = statusPedido(p.status);
            return (
              <View key={p.id} style={[styles.pedidoCard, { backgroundColor: theme.card, borderColor }]}>
                <View style={styles.pedidoHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.pedidoItem, { color: theme.title }]}>
                      {p.item || "Doação"}
                    </Text>
                    <Text style={[styles.pedidoDetalhe, { color: theme.muted }]}>
                      {p.categoria || ""}{p.categoria && p.quantidade ? " • " : ""}{p.quantidade || ""}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: st.cor + "22", borderColor: st.cor }]}>
                    <Text style={[styles.statusText, { color: st.cor }]}>{st.label}</Text>
                  </View>
                </View>
                {p.solicitanteMetodo ? (
                  <Text style={[styles.pedidoInfo, { color: theme.text }]}>Entrega: {p.solicitanteMetodo}</Text>
                ) : null}
                {p.solicitanteLocal ? (
                  <Text style={[styles.pedidoInfo, { color: theme.text }]}>Local: {p.solicitanteLocal}</Text>
                ) : null}
                <Text style={[styles.pedidoData, { color: theme.muted }]}>
                  Solicitado em: {new Date(p.solicitadoEm).toLocaleDateString("pt-BR")}
                </Text>
              </View>
            );
          })
        )}

        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.logoutButton, { backgroundColor: theme.danger }]}
          onPress={logout}
        >
          <Text style={styles.logoutButtonText}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 22,
    paddingBottom: 34,
  },

  profileCard: {
    alignItems: "center",
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    elevation: 3,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
  },

  avatar: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 4,
    borderColor: "#BFDBFE",
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "800",
  },

  name: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 21,
  },

  optionCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
  },

  optionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    gap: 12,
  },

  optionTitle: {
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 4,
  },

  optionSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },

  smallButton: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
  },

  smallButtonText: {
    fontSize: 14,
    fontWeight: "800",
  },

  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 16,
  },

  rowCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },

  optionText: {
    flex: 1,
  },

  logoutButton: {
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
  },

  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  pedidosHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 14,
    borderTopWidth: 1,
    paddingTop: 18,
  },

  pedidosTitulo: {
    fontSize: 19,
    fontWeight: "800",
  },

  pedidosSub: {
    fontSize: 13,
    marginTop: 2,
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

  pedidoCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
  },

  pedidoHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },

  pedidoItem: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 2,
  },

  pedidoDetalhe: {
    fontSize: 13,
  },

  statusBadge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "800",
  },

  pedidoInfo: {
    fontSize: 13,
    marginBottom: 2,
  },

  pedidoData: {
    fontSize: 12,
    marginTop: 4,
  },
});
