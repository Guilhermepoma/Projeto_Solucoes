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


  const atualizarPedidoStatus = async (doacaoId, novoStatus) => {
    try {
      const snapshot = await firebase.firestore()
        .collection('pedidos')
        .where('doacaoId', '==', doacaoId)
        .get();
      snapshot.docs.forEach((doc) => {
        doc.ref.update({ status: novoStatus });
      });
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
    }
  };

  const atualizarStatus = async (id, novoStatus, motivo = null) => {
    if (novoStatus === "recusado") {
      setDoacoes((prev) => prev.filter((d) => d.id !== id));
      try {
        await firebase.firestore().collection('doacoes').doc(id).delete();
        await atualizarPedidoStatus(id, "recusado");
      } catch (error) {
        console.error('Erro ao recusar doação no Firestore:', error);
        Alert.alert("Erro", "Não foi possível recusar a doação no Firestore.");
      }
      return;
    }
    setDoacoes((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status: novoStatus,
              atualizadoEm: new Date().toISOString(),
            }
          : d
      )
    );
    try {
      await firebase.firestore().collection('doacoes').doc(id).update({
        status: novoStatus,
        atualizadoEm: new Date().toISOString(),
      });
      await atualizarPedidoStatus(id, novoStatus);
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