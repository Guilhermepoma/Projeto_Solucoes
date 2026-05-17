import React, { createContext, useState } from "react";

export const TemaContext = createContext();

const temaClaro = {
  background: "#F8FAFC",
  card: "#FFFFFF",
  cardAlt: "#F1F5F9",
  input: "#F8FAFC",
  border: "#CBD5E1",
  title: "#0F172A",
  text: "#334155",
  muted: "#64748B",
  primary: "#2563EB",
  primarySoft: "#DBEAFE",
  buttonSoft: "#DBEAFE",
  buttonText: "#1D4ED8",
  success: "#10B981",
  admin: "#7C3AED",
  danger: "#DC2626",
  header: "#FFFFFF",
};

const temaEscuro = {
  background: "#0F172A",
  card: "#1E293B",
  cardAlt: "#111827",
  input: "#111827",
  border: "#475569",
  title: "#F8FAFC",
  text: "#E2E8F0",
  muted: "#CBD5E1",
  primary: "#3B82F6",
  primarySoft: "#1E3A8A",
  buttonSoft: "#2563EB",
  buttonText: "#FFFFFF",
  success: "#22C55E",
  admin: "#8B5CF6",
  danger: "#EF4444",
  header: "#1E293B",
};

export function TemaProvider({ children }) {
  const [modoNoturno, setModoNoturno] = useState(false);
  const theme = modoNoturno ? temaEscuro : temaClaro;

  return (
    <TemaContext.Provider value={{ modoNoturno, setModoNoturno, theme }}>
      {children}
    </TemaContext.Provider>
  );
}
