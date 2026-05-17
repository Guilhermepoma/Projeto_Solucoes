import React, { createContext, useState } from 'react';

export const DoacoesContext = createContext();

export const DoacoesProvider = ({ children }) => {
  const [doacoes, setDoacoes] = useState([]);

  const adicionarDoacao = (doacao) => {
    setDoacoes((prev) => [
      ...prev,
      {
        ...doacao,
        status: "pendente_aprovacao_doacao",
        id: Date.now(),
      },
    ]);
  };

  const atualizarStatus = (id, novoStatus) => {
    setDoacoes((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status: novoStatus } : d
      )
    );
  };

  return (
    <DoacoesContext.Provider value={{ doacoes, adicionarDoacao, atualizarStatus }}>
      {children}
    </DoacoesContext.Provider>
  );
};