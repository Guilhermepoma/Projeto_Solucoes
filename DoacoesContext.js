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