import React, { createContext, useState, useEffect } from "react";
import firebase from './firebaseConfig';

export const DoacoesContext = createContext();

export function DoacoesProvider({ children }) {
  const [doacoes, setDoacoes] = useState([]);

  useEffect(() => {
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
    } catch (error) {
      console.error('Erro ao salvar doação no Firestore:', error);
    }
  };


  const atualizarStatus = async (id, novoStatus, motivo = null) => {
    setDoacoes((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status: novoStatus,
              motivoRecusa: novoStatus === "recusado" ? motivo : null,
              atualizadoEm: new Date().toISOString(),
            }
          : d
      )
    );
    try {
      await firebase.firestore().collection('doacoes').doc(id).update({
        status: novoStatus,
        motivoRecusa: novoStatus === "recusado" ? motivo : null,
        atualizadoEm: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Erro ao atualizar status da doação no Firestore:', error);
    }
  };

  return (
    <DoacoesContext.Provider value={{ doacoes, adicionarDoacao, atualizarStatus }}>
      {children}
    </DoacoesContext.Provider>
  );
}