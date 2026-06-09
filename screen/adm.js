import React, { useContext, useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Animated,
  Modal,
} from "react-native";
import { DoacoesContext } from "../DoacoesContext";
import { TemaContext } from "../TemaContext";

const ABAS = ["Pendentes", "Histórico"];
const CATEGORIAS_FILTRO = ["Todas", "Cesta básica", "Alimentos", "Higiene", "Limpeza", "Outros"];
const MOTIVOS_RECUSA = [
  "Item inadequado",
  "Informações incompletas",
  "Outro",
];

export default function Adm({ navigation }) {
  const { doacoes, atualizarStatus } = useContext(DoacoesContext);
  const { modoNoturno, theme } = useContext(TemaContext);

  const [abaSelecionada, setAbaSelecionada] = useState("Pendentes");
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");


  const [ultimaAcao, setUltimaAcao] = useState(null);
  const [mostrarUndo, setMostrarUndo] = useState(false);
  const undoOpacity = useRef(new Animated.Value(0)).current;
  const undoTimer = useRef(null);

  const [modalRecusa, setModalRecusa] = useState({ visible: false, doacao: null });

  const borderColor = modoNoturno ? theme.border : "#111827";



  const doacoesPendentes = doacoes.filter((d) => d.status === "pendente_aprovacao_doacao");
  const pedidosPendentes = doacoes.filter((d) => d.status === "pendente_aprovacao_pedido");

  const historico = doacoes.filter((d) =>
    ["finalizado", "recusado", "disponivel"].includes(d.status)
  );

  const historicoFiltrado =
    filtroCategoria === "Todas"
      ? historico
      : historico.filter((d) => d.categoria === filtroCategoria);

  const totalFinalizados = doacoes.filter((d) => d.status === "finalizado").length;
  const totalRecusados = doacoes.filter((d) => d.status === "recusado").length;
  const totalDisponiveis = doacoes.filter((d) => d.status === "disponivel").length;
  const totalDecididos = totalFinalizados + totalRecusados + totalDisponiveis;

  const taxaAprovacao =
    totalDecididos === 0
      ? 0
      : Math.round(((totalFinalizados + totalDisponiveis) / totalDecididos) * 100);

  const contagemCategorias = doacoes.reduce((acc, d) => {
    const cat = d.categoria || "Outros";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const categoriasOrdenadas = Object.entries(contagemCategorias).sort((a, b) => b[1] - a[1]);
  const itemMaisDoado = categoriasOrdenadas[0]?.[0] || "—";
  const maxContagem = categoriasOrdenadas[0]?.[1] || 1;

 

  const mostrarToastUndo = (id, statusAnterior, statusNovo) => {
    if (undoTimer.current) clearTimeout(undoTimer.current);
    setUltimaAcao({ id, statusAnterior, statusNovo });
    setMostrarUndo(true);

    Animated.timing(undoOpacity, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();

    undoTimer.current = setTimeout(esconderToastUndo, 4000);
  };

  const esconderToastUndo = () => {
    Animated.timing(undoOpacity, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setMostrarUndo(false);
      setUltimaAcao(null);
    });
  };

  const desfazer = () => {
    if (!ultimaAcao) return;
    atualizarStatus(ultimaAcao.id, ultimaAcao.statusAnterior);
    if (undoTimer.current) clearTimeout(undoTimer.current);
    esconderToastUndo();
  };

  useEffect(() => {
    return () => {
      if (undoTimer.current) clearTimeout(undoTimer.current);
    };
  }, []);

  

  const aprovar = (d, tipo) => {
    const statusAnterior = d.status;
    const novoStatus = tipo === "doacao" ? "disponivel" : "finalizado";
    atualizarStatus(d.id, novoStatus);
    mostrarToastUndo(d.id, statusAnterior, novoStatus);
  };

  const recusar = (d) => {
    setModalRecusa({ visible: true, doacao: d });
  };

  const confirmarRecusa = (motivo) => {
    const d = modalRecusa.doacao;
    if (!d) return;
    const statusAnterior = d.status;
    atualizarStatus(d.id, "recusado", motivo);
    mostrarToastUndo(d.id, statusAnterior, "recusado");
    setModalRecusa({ visible: false, doacao: null });
  };



  const renderVazio = (texto) => (
    <View style={[styles.emptyBox, { backgroundColor: theme.cardAlt, borderColor }]}>
      <Text style={[styles.emptyText, { color: theme.muted }]}>{texto}</Text>
    </View>
  );

  const statusConfig = {
    finalizado: { label: "Finalizado", cor: theme.success },
    recusado: { label: "Recusado", cor: theme.danger },
    disponivel: { label: "Disponível", cor: theme.primary },
  };



  const renderCardPendente = (d, tipo) => {
    const isDoacao = tipo === "doacao";
    const etiqueta = isDoacao ? "Nova doação" : "Pedido de retirada";

    return (
      <View key={d.id} style={[styles.card, { backgroundColor: theme.card, borderColor }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.statusDot, { backgroundColor: isDoacao ? theme.primary : theme.success }]} />
          <View style={styles.cardTitleWrap}>
            <Text style={[styles.cardKicker, { color: theme.muted }]}>{etiqueta}</Text>
            <Text style={[styles.cardTitle, { color: theme.title }]}>{d.item}</Text>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <View style={[styles.infoBox, { backgroundColor: theme.cardAlt, borderColor: theme.border }]}>
            <Text style={[styles.infoLabel, { color: theme.muted }]}>Quantidade</Text>
            <Text style={[styles.infoValue, { color: theme.title }]}>{d.quantidade}</Text>
          </View>
          <View style={[styles.infoBox, { backgroundColor: theme.cardAlt, borderColor: theme.border }]}>
            <Text style={[styles.infoLabel, { color: theme.muted }]}>Categoria</Text>
            <Text style={[styles.infoValue, { color: theme.title }]}>{d.categoria || "Doação"}</Text>
          </View>
        </View>

        <View style={styles.metaList}>
          <Text style={[styles.metaText, { color: theme.text }]}>Doador: {d.nome || "Não informado"}</Text>
          <Text style={[styles.metaText, { color: theme.text }]}>Contato: {d.contato || "Não informado"}</Text>
          <Text style={[styles.metaText, { color: theme.text }]}>Entrega: {d.entrega || "A combinar"}</Text>
          {!!d.endereco && <Text style={[styles.metaText, { color: theme.text }]}>Local: {d.endereco}</Text>}
          {!!d.observacoes && <Text style={[styles.metaText, { color: theme.text }]}>Obs: {d.observacoes}</Text>}
        </View>

        <View style={styles.row}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.actionButton, { backgroundColor: theme.success }]}
            onPress={() => aprovar(d, tipo)}
          >
            <Text style={styles.txt}>Aprovar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.actionButton, { backgroundColor: theme.danger }]}
            onPress={() => recusar(d)}
          >
            <Text style={styles.txt}>Recusar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderCardHistorico = (d) => {
    const config = statusConfig[d.status] || { label: d.status, cor: theme.muted };

    return (
      <View key={d.id} style={[styles.card, { backgroundColor: theme.card, borderColor }]}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleWrap}>
            <Text style={[styles.cardTitle, { color: theme.title }]}>{d.item}</Text>
            <Text style={[styles.cardKicker, { color: theme.muted }]}>
              {d.categoria || "Doação"} • {d.quantidade}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: config.cor + "22", borderColor: config.cor }]}>
            <View style={[styles.statusDotSmall, { backgroundColor: config.cor }]} />
            <Text style={[styles.statusBadgeText, { color: config.cor }]}>{config.label}</Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.metaList}>
          <Text style={[styles.metaText, { color: theme.text }]}>Doador: {d.nome || "Não informado"}</Text>
          <Text style={[styles.metaText, { color: theme.text }]}>Contato: {d.contato || "Não informado"}</Text>
          <Text style={[styles.metaText, { color: theme.text }]}>Entrega: {d.entrega || "A combinar"}</Text>
          {!!d.endereco && <Text style={[styles.metaText, { color: theme.text }]}>Local: {d.endereco}</Text>}
          {!!d.motivoRecusa && (
            <Text style={[styles.metaText, { color: theme.danger }]}>Motivo recusa: {d.motivoRecusa}</Text>
          )}
        </View>
      </View>
    );
  };



  const renderGrafico = () => {
    if (categoriasOrdenadas.length === 0) return renderVazio("Nenhum dado para o gráfico");

    const cores = [theme.primary, theme.success, theme.admin, "#F59E0B", theme.danger, theme.muted];

    return (
      <View style={[styles.graficoCard, { backgroundColor: theme.card, borderColor }]}>
        <Text style={[styles.graficoTitulo, { color: theme.title }]}>Doações por categoria</Text>
        <Text style={[styles.graficoSub, { color: theme.muted }]}>Total de registros no sistema</Text>

        <View style={styles.graficoLista}>
          {categoriasOrdenadas.map(([categoria, total], index) => {
            const porcentagem = (total / maxContagem) * 100;
            const cor = cores[index % cores.length];

            return (
              <View key={categoria} style={styles.graficoItem}>
                <View style={styles.graficoLabelRow}>
                  <Text style={[styles.graficoLabel, { color: theme.text }]}>{categoria}</Text>
                  <Text style={[styles.graficoValor, { color: theme.title }]}>{total}</Text>
                </View>
                <View style={[styles.barraFundo, { backgroundColor: theme.cardAlt, borderColor: theme.border }]}>
                  <View style={[styles.barraPreenchimento, { width: `${porcentagem}%`, backgroundColor: cor }]} />
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };



  const renderAbaPendentes = () => (
    <>
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: theme.cardAlt, borderColor }]}>
          <Text style={[styles.statNumber, { color: theme.title }]}>{doacoesPendentes.length}</Text>
          <Text style={[styles.statLabel, { color: theme.muted }]}>doações</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.cardAlt, borderColor }]}>
          <Text style={[styles.statNumber, { color: theme.title }]}>{pedidosPendentes.length}</Text>
          <Text style={[styles.statLabel, { color: theme.muted }]}>pedidos</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sub, { color: theme.title }]}>Doações Pendentes</Text>
        <Text style={[styles.badge, { color: theme.primary }]}>{doacoesPendentes.length}</Text>
      </View>
      {doacoesPendentes.length === 0
        ? renderVazio("Nenhuma doação aguardando aprovação")
        : doacoesPendentes.map((d) => renderCardPendente(d, "doacao"))}

      <View style={styles.sectionHeader}>
        <Text style={[styles.sub, { color: theme.title }]}>Pedidos Pendentes</Text>
        <Text style={[styles.badge, { color: theme.success }]}>{pedidosPendentes.length}</Text>
      </View>
      {pedidosPendentes.length === 0
        ? renderVazio("Nenhum pedido aguardando aprovação")
        : pedidosPendentes.map((d) => renderCardPendente(d, "pedido"))}
    </>
  );



  const renderAbaHistorico = () => (
    <>
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: theme.cardAlt, borderColor }]}>
          <Text style={[styles.statNumber, { color: theme.success }]}>{totalFinalizados}</Text>
          <Text style={[styles.statLabel, { color: theme.muted }]}>finalizados</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.cardAlt, borderColor }]}>
          <Text style={[styles.statNumber, { color: theme.primary }]}>{totalDisponiveis}</Text>
          <Text style={[styles.statLabel, { color: theme.muted }]}>disponíveis</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.cardAlt, borderColor }]}>
          <Text style={[styles.statNumber, { color: theme.danger }]}>{totalRecusados}</Text>
          <Text style={[styles.statLabel, { color: theme.muted }]}>recusados</Text>
        </View>
      </View>

     
      <View style={styles.statsRow}>
        <View style={[styles.insightCard, { backgroundColor: theme.cardAlt, borderColor }]}>
          <Text style={[styles.insightLabel, { color: theme.muted }]}>Taxa de aprovação</Text>
          <Text style={[styles.insightValue, { color: theme.success }]}>{taxaAprovacao}%</Text>
        </View>
        <View style={[styles.insightCard, { backgroundColor: theme.cardAlt, borderColor }]}>
          <Text style={[styles.insightLabel, { color: theme.muted }]}>Mais doado</Text>
          <Text style={[styles.insightValue, { color: theme.primary }]} numberOfLines={1}>
            {itemMaisDoado}
          </Text>
        </View>
      </View>

  
      {renderGrafico()}

      <View style={styles.sectionHeader}>
        <Text style={[styles.sub, { color: theme.title }]}>Movimentações</Text>
        <Text style={[styles.badge, { color: theme.muted }]}>{historicoFiltrado.length}</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtrosScroll}
        contentContainerStyle={styles.filtrosContent}
      >
        {CATEGORIAS_FILTRO.map((cat) => {
          const ativo = filtroCategoria === cat;
          return (
            <TouchableOpacity
              key={cat}
              activeOpacity={0.8}
              style={[
                styles.filtroChip,
                {
                  backgroundColor: ativo ? theme.admin : theme.cardAlt,
                  borderColor: ativo ? theme.admin : borderColor,
                },
              ]}
              onPress={() => setFiltroCategoria(cat)}
            >
              <Text style={[styles.filtroChipText, { color: ativo ? "#FFFFFF" : theme.muted }]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {historicoFiltrado.length === 0
        ? renderVazio("Nenhuma movimentação nesta categoria")
        : historicoFiltrado.map((d) => renderCardHistorico(d))}
    </>
  );

 

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.content}
      >
        <View style={[styles.hero, { backgroundColor: theme.card, borderColor }]}>
          <Text style={[styles.kicker, { color: theme.admin }]}>Painel de controle</Text>
          <Text style={[styles.titulo, { color: theme.title }]}>Área ADM</Text>
          <Text style={[styles.subtitulo, { color: theme.muted }]}>
            Aprove doações, revise pedidos e acompanhe o histórico.
          </Text>
        </View>


        <View style={[styles.tabsContainer, { backgroundColor: theme.cardAlt, borderColor }]}>
          {ABAS.map((aba) => {
            const ativa = abaSelecionada === aba;
            const totalPendentes = doacoesPendentes.length + pedidosPendentes.length;
            return (
              <TouchableOpacity
                key={aba}
                activeOpacity={0.8}
                style={[styles.tab, ativa && { backgroundColor: theme.admin }]}
                onPress={() => setAbaSelecionada(aba)}
              >
                <Text style={[styles.tabText, { color: ativa ? "#FFFFFF" : theme.muted }]}>{aba}</Text>
                {aba === "Pendentes" && totalPendentes > 0 && (
                  <View style={[styles.tabBadge, { backgroundColor: ativa ? "#FFFFFF33" : theme.admin }]}>
                    <Text style={styles.tabBadgeText}>{totalPendentes}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {abaSelecionada === "Pendentes" ? renderAbaPendentes() : renderAbaHistorico()}

        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.voltar, { backgroundColor: theme.admin }]}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.txt}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>

      
      {mostrarUndo && (
        <Animated.View
          style={[
            styles.undoToast,
            { backgroundColor: theme.card, borderColor, opacity: undoOpacity },
          ]}
        >
          <Text style={[styles.undoTexto, { color: theme.text }]}>Ação realizada</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.undoBotao, { backgroundColor: theme.admin }]}
            onPress={desfazer}
          >
            <Text style={styles.undoBotaoTexto}>Desfazer</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      
      <Modal
        visible={modalRecusa.visible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalRecusa({ visible: false, doacao: null })}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card, borderColor }]}>
            <Text style={[styles.modalTitle, { color: theme.title }]}>Motivo da recusa</Text>
            <Text style={[styles.modalSub, { color: theme.muted }]}>Selecione o motivo:</Text>
            {MOTIVOS_RECUSA.map((motivo) => (
              <TouchableOpacity
                key={motivo}
                activeOpacity={0.8}
                style={[styles.modalOption, { backgroundColor: theme.cardAlt, borderColor }]}
                onPress={() => confirmarRecusa(motivo)}
              >
                <Text style={[styles.modalOptionText, { color: theme.title }]}>{motivo}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.modalCancel, { borderColor }]}
              onPress={() => setModalRecusa({ visible: false, doacao: null })}
            >
              <Text style={[styles.modalCancelText, { color: theme.muted }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 34 },

  hero: { borderWidth: 1, borderRadius: 22, padding: 20, marginBottom: 14 },
  kicker: { fontSize: 13, fontWeight: "800", marginBottom: 8 },
  titulo: { fontSize: 30, fontWeight: "800", marginBottom: 8 },
  subtitulo: { fontSize: 15, lineHeight: 22 },

  tabsContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 16,
    padding: 4,
    marginBottom: 18,
    gap: 4,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  tabText: { fontSize: 14, fontWeight: "800" },
  tabBadge: { borderRadius: 999, paddingHorizontal: 7, paddingVertical: 2 },
  tabBadgeText: { fontSize: 11, fontWeight: "900", color: "#FFFFFF" },

  statsRow: { flexDirection: "row", gap: 10, marginBottom: 14 },
  statCard: { flex: 1, borderWidth: 1, borderRadius: 18, padding: 14 },
  statNumber: { fontSize: 28, fontWeight: "900" },
  statLabel: { fontSize: 13, fontWeight: "700" },

  insightCard: { flex: 1, borderWidth: 1, borderRadius: 18, padding: 14 },
  insightLabel: { fontSize: 12, fontWeight: "700", marginBottom: 4 },
  insightValue: { fontSize: 20, fontWeight: "900" },

  graficoCard: { borderWidth: 1, borderRadius: 20, padding: 16, marginBottom: 18 },
  graficoTitulo: { fontSize: 16, fontWeight: "800", marginBottom: 2 },
  graficoSub: { fontSize: 13, marginBottom: 16 },
  graficoLista: { gap: 12 },
  graficoItem: { gap: 6 },
  graficoLabelRow: { flexDirection: "row", justifyContent: "space-between" },
  graficoLabel: { fontSize: 13, fontWeight: "700" },
  graficoValor: { fontSize: 13, fontWeight: "900" },
  barraFundo: { height: 10, borderRadius: 999, borderWidth: 1, overflow: "hidden" },
  barraPreenchimento: { height: "100%", borderRadius: 999 },

  filtrosScroll: { marginBottom: 12 },
  filtrosContent: { gap: 8, paddingBottom: 4 },
  filtroChip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 },
  filtroChipText: { fontSize: 13, fontWeight: "800" },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
    marginBottom: 10,
  },
  sub: { fontSize: 19, fontWeight: "800" },
  badge: { fontSize: 16, fontWeight: "900" },

  emptyBox: { borderWidth: 1, borderRadius: 16, padding: 16, marginBottom: 14 },
  emptyText: { fontSize: 14, fontWeight: "700", textAlign: "center" },

  card: { padding: 16, borderRadius: 20, marginBottom: 14, borderWidth: 1 },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  statusDot: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
  cardTitleWrap: { flex: 1 },
  cardKicker: { fontSize: 12, fontWeight: "800", marginBottom: 3 },
  cardTitle: { fontSize: 19, fontWeight: "900" },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 5,
  },
  statusDotSmall: { width: 7, height: 7, borderRadius: 4 },
  statusBadgeText: { fontSize: 12, fontWeight: "800" },
  divider: { height: 1, marginBottom: 12 },

  infoGrid: { flexDirection: "row", gap: 10, marginBottom: 12 },
  infoBox: { flex: 1, borderWidth: 1, borderRadius: 14, padding: 12 },
  infoLabel: { fontSize: 12, fontWeight: "800", marginBottom: 5 },
  infoValue: { fontSize: 14, fontWeight: "800" },

  metaList: { marginBottom: 10 },
  metaText: { fontSize: 14, lineHeight: 21 },

  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 6, gap: 10 },
  actionButton: { flex: 1, padding: 12, borderRadius: 10 },

  voltar: { padding: 13, marginTop: 8, borderRadius: 12, alignItems: "center" },
  txt: { color: "#FFFFFF", textAlign: "center", fontWeight: "800" },

  undoToast: {
    position: "absolute",
    bottom: 28,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  undoTexto: { fontSize: 14, fontWeight: "700" },
  undoBotao: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  undoBotaoTexto: { color: "#FFFFFF", fontSize: 13, fontWeight: "800" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 22,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 4,
  },
  modalSub: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 16,
  },
  modalOption: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  modalOptionText: {
    fontSize: 15,
    fontWeight: "800",
    textAlign: "center",
  },
  modalCancel: {
    borderWidth: 0,
    borderRadius: 12,
    padding: 14,
    marginTop: 4,
    alignItems: "center",
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: "700",
  },
});