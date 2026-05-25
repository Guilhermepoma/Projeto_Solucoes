// DoacoesContext.js
// Coloque na raiz do projeto (mesmo nível do App.js)

import React, { createContext, useState } from "react";
import firebase from './firebaseConfig';

export const DoacoesContext = createContext();

export function DoacoesProvider({ children }) {
  const [doacoes, setDoacoes] = useState([]);

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

  // motivo é opcional — só salvo quando status === "recusado"
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