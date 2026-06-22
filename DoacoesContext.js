import React, { createContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import firebase from './firebaseConfig';

export const DoacoesContext = createContext();

export function DoacoesProvider({ children }) {
  const [doacoes, setDoacoes] = useState([]);

  const carregarDoacoes = async () => {
    try {
      const snapshot = await firebase.firestore().collection('doacoes').get();
      const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      lista.sort((a, b) => (b.criadoEm || '').localeCompare(a.criadoEm || ''));
      setDoacoes(lista);
    } catch (error) {
      console.error('Erro ao carregar doações:', error);
    }
  };

  useEffect(() => {
    carregarDoacoes();
  }, []);

  const adicionarDoacao = async (dados) => {
    const nova = {
      ...dados,
      status: "pendente_aprovacao_doacao",
      criadoEm: new Date().toISOString(),
    };
    try {
      const docRef = await firebase.firestore().collection('doacoes').add(nova);
      nova.id = docRef.id;
      setDoacoes((prev) => [nova, ...prev]);
      return docRef.id;
    } catch (error) {
      console.error('Erro ao salvar doação no Firestore:', error);
      Alert.alert("Erro", "Não foi possível salvar a doação. Verifique sua conexão e tente novamente.");
    }
  };


  const atualizarStatus = async (id, novoStatus, dadosExtras = {}) => {
    const campos = {
      status: novoStatus,
      atualizadoEm: new Date().toISOString(),
      ...dadosExtras,
    };
    setDoacoes((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...campos } : d))
    );
    try {
      await firebase.firestore().collection('doacoes').doc(id).update(campos);
    } catch (error) {
      console.error('Erro ao atualizar status da doação no Firestore:', error);
      Alert.alert("Erro", "Não foi possível atualizar o status. Verifique sua conexão e tente novamente.");
    }
  };

  return (
    <DoacoesContext.Provider value={{ doacoes, adicionarDoacao, atualizarStatus, carregarDoacoes }}>
      {children}
    </DoacoesContext.Provider>
  );
}