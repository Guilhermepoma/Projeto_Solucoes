// DoacoesContext.js
// Coloque na raiz do projeto (mesmo nível do App.js)

import React, { createContext, useState } from "react";

export const DoacoesContext = createContext();

export function DoacoesProvider({ children }) {
  const [doacoes, setDoacoes] = useState([]);

  const adicionarDoacao = (dados) => {
    const nova = {
      ...dados,
      id: Date.now().toString(),
      status: "pendente_aprovacao_doacao",
      criadoEm: new Date().toISOString(),
    };
    setDoacoes((prev) => [nova, ...prev]);
  };

  // motivo é opcional — só salvo quando status === "recusado"
  const atualizarStatus = (id, novoStatus, motivo = null) => {
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
  };

  return (
    <DoacoesContext.Provider value={{ doacoes, adicionarDoacao, atualizarStatus }}>
      {children}
    </DoacoesContext.Provider>
  );
}