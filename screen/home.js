import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TemaContext } from "../TemaContext";

export default function Home({ navigation }) {
  const { modoNoturno, theme } = useContext(TemaContext);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={["top", "bottom"]}
    >
      <View style={styles.content}>
        <View
          style={[
            styles.hero,
            {
              backgroundColor: modoNoturno ? theme.card : "#111827",
              borderColor: modoNoturno ? theme.border : "#111827",
            },
          ]}
        >
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>Solidariedade</Text>
          </View>

          <Text style={styles.titulo}>Bem-vindo</Text>
          <Text style={styles.subtitulo}>
            Encontre apoio ou ajude alguém com uma cesta básica.
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            activeOpacity={0.86}
            style={[
              styles.actionCard,
              { backgroundColor: theme.cardAlt, borderColor: theme.border },
            ]}
            onPress={() => navigation.navigate("FazerDoacao")}
          >
            <View style={[styles.iconCircle, { backgroundColor: theme.primary }]}>
              <Text style={styles.iconText}>+</Text>
            </View>

            <View style={styles.actionTextWrap}>
              <Text style={[styles.actionTitle, { color: theme.title }]}>Fazer Doação</Text>
              <Text style={[styles.actionDescription, { color: theme.muted }]}>
                Cadastre uma contribuição para ajudar uma família.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.86}
            style={[
              styles.actionCard,
              { backgroundColor: theme.cardAlt, borderColor: theme.border },
            ]}
            onPress={() => navigation.navigate("PedirDoacao")}
          >
            <View style={[styles.iconCircle, { backgroundColor: theme.success }]}>
              <Text style={styles.iconText}>?</Text>
            </View>

            <View style={styles.actionTextWrap}>
              <Text style={[styles.actionTitle, { color: theme.title }]}>Pedir Doação</Text>
              <Text style={[styles.actionDescription, { color: theme.muted }]}>
                Solicite uma cesta de forma simples e acolhedora.
              </Text>
            </View>
          </TouchableOpacity>
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
    paddingHorizontal: 22,
    paddingVertical: 24,
    justifyContent: "center",
  },

  hero: {
    borderRadius: 28,
    padding: 26,
    marginBottom: 22,
    overflow: "hidden",
    borderWidth: 1,
  },

  heroBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#E0F2FE",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginBottom: 28,
  },

  heroBadgeText: {
    color: "#0369A1",
    fontSize: 13,
    fontWeight: "700",
  },

  titulo: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "800",
    marginBottom: 8,
  },

  subtitulo: {
    color: "#CBD5E1",
    fontSize: 16,
    lineHeight: 23,
    maxWidth: 300,
  },

  actions: {
    gap: 14,
    marginBottom: 18,
  },

  actionCard: {
    minHeight: 116,
    borderRadius: 22,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    elevation: 3,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
  },

  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  iconText: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "800",
    lineHeight: 30,
  },

  actionTextWrap: {
    flex: 1,
  },

  actionTitle: {
    fontSize: 19,
    fontWeight: "800",
    marginBottom: 5,
  },

  actionDescription: {
    fontSize: 14,
    lineHeight: 20,
  },

  adminButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    paddingVertical: 15,
    borderWidth: 1,
  },

  adminButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
