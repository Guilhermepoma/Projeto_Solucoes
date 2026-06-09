import React, { useContext, useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TemaContext } from "../TemaContext";
import { AuthContext } from '../AuthContext';
import firebase from '../firebaseConfig';

export default function Perfil() {
  const { user } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [editandoEmail, setEditandoEmail] = useState(false);
  const { modoNoturno, setModoNoturno, theme } = useContext(TemaContext);

  useEffect(() => {
    if (user) {
      setEmail(user.email);
    }
  }, [user]);

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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <View
          style={[
            styles.profileCard,
            { backgroundColor: theme.card, borderColor: "#111827" },
          ]}
        >
          <TouchableOpacity activeOpacity={0.85} style={styles.avatar}>
            <Text style={styles.avatarText}>U</Text>
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    padding: 22,
    justifyContent: "center",
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
});
