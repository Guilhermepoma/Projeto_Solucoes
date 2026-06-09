import React, { useContext, useState } from "react";
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView,} from "react-native";
import { TemaContext } from "../TemaContext";
import firebase from '../firebaseConfig';

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const { modoNoturno, theme } = useContext(TemaContext);

  const fazerLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }
    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, senha);
      
      await firebase.firestore().collection('usuarios').doc(userCredential.user.uid).set({
        email: userCredential.user.email,
        criadoEm: new Date().toISOString(),
        ultimoLogin: new Date().toISOString(),
      }, { merge: true });
      navigation.navigate("Home");
    } catch (error) {
      let mensagem = "Erro ao fazer login.";
      if (error.code === 'auth/user-not-found') {
        mensagem = "Usuário não encontrado.";
      } else if (error.code === 'auth/wrong-password') {
        mensagem = "Senha incorreta.";
      } else if (error.code === 'auth/invalid-email') {
        mensagem = "Email inválido.";
      }
      Alert.alert("Erro", mensagem);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: modoNoturno ? theme.background : "#0F172A" }]}>
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.titulo, { color: theme.title }]}>Login</Text>

        <TextInput
          style={[styles.input, { backgroundColor: theme.input, borderColor: theme.border, color: theme.title }]}
          placeholder="Digite seu email"
          placeholderTextColor={theme.muted}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={[styles.input, { backgroundColor: theme.input, borderColor: theme.border, color: theme.title }]}
          placeholder="Digite sua senha"
          placeholderTextColor={theme.muted}
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity style={[styles.botao, { backgroundColor: theme.primary }]} onPress={fazerLogin}>
          <Text style={styles.textoBotao}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={async () => {
          if (!email || !senha) {
            Alert.alert("Erro", "Preencha todos os campos para criar a conta");
            return;
          }
          try {
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, senha);
            // Salva dados do usuário no Firestore
            await firebase.firestore().collection('usuarios').doc(userCredential.user.uid).set({
              email: userCredential.user.email,
              criadoEm: new Date().toISOString(),
            });
            Alert.alert("Sucesso", "Conta criada com sucesso! Você já pode entrar.");
          } catch (error) {
            let mensagem = "Erro ao criar conta.";
            if (error.code === 'auth/email-already-in-use') {
              mensagem = "Email inválido.";
            } else if (error.code === 'auth/weak-password') {
              mensagem = "A senha deve ter pelo menos 6 caracteres.";
            }
            Alert.alert("Erro", mensagem);
          }
        }}>
          <Text style={[styles.link, { color: theme.primary }]}>Criar conta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  card: {
    width: "100%",
    borderRadius: 20,
    padding: 25,
    elevation: 5,
  },

  titulo: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },

  botao: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  textoBotao: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },

  link: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 16,
  },
});
