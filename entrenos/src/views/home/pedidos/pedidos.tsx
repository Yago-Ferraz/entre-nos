import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/src/components/header/header";
import CardBase from "@/src/components/cards/cardbase";
import { useNavigation } from "@react-navigation/native";
import { pedidoService } from "@/src/services/pedidos";
import { PedidoGet, ItemPedidoGet, STATUS_CHOICES, StatusPedido } from "@/src/types/pedidos";


// Função auxiliar para mapear Status -> Cor
const getStatusColor = (status: string) => {
  switch (status) {
    case 'pendente': return '#FFA500'; // Laranja
    case 'processando': return '#2196F3'; // Azul
    case 'pago': return '#4CAF50'; // Verde escuro
    case 'concluido': return '#3CB371'; // Verde
    case 'cancelado': return '#FF0000'; // Vermelho
    default: return '#888';
  }
};

export default function MeusPedidos() {
  const navigation = useNavigation();
  
  // Estados
  const [pedidos, setPedidos] = useState<PedidoGet[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState<PedidoGet | null>(null);
  
  // A descrição não vem na API, então vamos criar um estado local temporário
  const [descricao, setDescricao] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<StatusPedido | null>(null);
  const [isSelectingStatus, setIsSelectingStatus] = useState(false);

  // Simula o carregamento da API (GET)
  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        setLoading(true);
        const data = await pedidoService.getPedidos();
        setPedidos(data);
      } catch {
        Alert.alert("Erro", "Não foi possível carregar os pedidos.");
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  // Abrir Modal
  const handleOpenModal = (item: PedidoGet) => {
    setSelectedPedido(item);
    setSelectedStatus(item.status as StatusPedido);
    setDescricao(item.descricao || ""); // Preenche a descrição
    setIsSelectingStatus(false); // Reseta o seletor de status
    setModalVisible(true);
  };

  // Fechar Modal
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedPedido(null);
    setIsSelectingStatus(false);
  };

  // Ação de Salvar (PATCH)
  const handleSave = async () => {
    if (!selectedPedido || !selectedStatus) return;

    try {
      await pedidoService.updatePedidoStatus(selectedPedido.id, {
        status: selectedStatus,
        descricao: descricao,
      });
      Alert.alert("Sucesso", "Pedido atualizado com sucesso!");
      handleCloseModal();
      
      // Atualiza a lista de pedidos
      const data = await pedidoService.getPedidos();
      setPedidos(data);

    } catch {
      Alert.alert("Erro", "Não foi possível atualizar o pedido.");
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Meus Pedidos" showBackButton onBackPress={() => navigation.goBack()} />

      {loading ? (
        <View style={styles.centered}>
          <Text>Carregando pedidos...</Text>
        </View>
      ) : pedidos.length === 0 ? (
        <View style={styles.centered}>
          <Text>Nenhum pedido encontrado.</Text>
        </View>
      ) : (
        <FlatList
          data={pedidos}
          style={{ marginTop: 10, width: "100%" }}
          keyExtractor={(item) => String(item.id)}
          
          renderItem={({ item }: { item: PedidoGet }) => (
            console.log(item),
            <CardBase onPress={() => handleOpenModal(item)} style={styles.card}>
              <View style={styles.row}>
                <Image 
                  source={{ uri: item.itens.length > 0 ? item.itens[0].produto.results.imagem : `https://picsum.photos/seed/${item.id}/200` }} 
                  style={styles.image} 
                />

                <View style={{ flex: 1 }}>
                  
                  <Text style={styles.name}>Pedido {item.comprador}</Text>
                  <Text style={styles.produto}>
                     {item.itens.length} ite{item.itens.length > 1 ? 'ns' : 'm'}
                  </Text>
                  {/* Data Mockada pois API não fornece */}
                  <Text style={styles.data}>Data não informada</Text>

                  <View style={[styles.statusBase, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
                  </View>
                </View>

                <Text style={styles.preco}>R$ {parseFloat(item.valor_total).toFixed(2)}</Text>
              </View>
            </CardBase>
          )}
        />
      )}

      {/* --- MODAL --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent} testID="modal-content">
            {selectedPedido && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Detalhes do Pedido #{selectedPedido.id}</Text>
                  <TouchableOpacity onPress={handleCloseModal} testID="close-modal-button">
                    <Ionicons name="close" size={28} color="#000" />
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  <Text style={styles.label}>
                    Cliente: <Text style={styles.valueBold}>{selectedPedido.comprador}</Text>
                  </Text>
                  
                  <Text style={styles.label}>Status:</Text>
                  <View>
                    {!isSelectingStatus ? (
                      <TouchableOpacity
                        style={[
                          styles.statusOption,
                          {
                            backgroundColor: getStatusColor(selectedStatus || ''),
                            alignSelf: "flex-start",
                            marginBottom: 12,
                          },
                        ]}
                        onPress={() => setIsSelectingStatus(true)}
                      >
                        <Text style={[styles.statusOptionText, { color: "#FFF" }]}>
                          {selectedStatus
                            ? selectedStatus.charAt(0).toUpperCase() +
                              selectedStatus.slice(1)
                            : "Selecionar Status"}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.statusSelectorContainer}>
                        {STATUS_CHOICES.map((status) => (
                          <TouchableOpacity
                            key={status}
                            style={[
                              styles.statusOption,
                              {
                                backgroundColor:
                                  selectedStatus === status
                                    ? getStatusColor(status)
                                    : "#f0f0f0",
                              },
                            ]}
                            onPress={() => {
                              setSelectedStatus(status);
                              setIsSelectingStatus(false);
                            }}
                          >
                            <Text
                              style={[
                                styles.statusOptionText,
                                {
                                  color:
                                    selectedStatus === status ? "#FFF" : "#333",
                                },
                              ]}
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>


                  <View style={styles.divider} />
                  <Text style={[styles.modalTitle, { fontSize: 16, marginBottom: 10 }]}>
                    Itens do Pedido
                  </Text>

                  {/* Lista Dinâmica de Itens baseada no Array 'itens' do JSON */}
                  {selectedPedido.itens.map((prod: ItemPedidoGet, index: number) => (
                    <View key={index} style={styles.productRow}>
                        <View style={{flex: 1}}>
                            <Text style={styles.productText}>
                                {prod.quantidade}x {prod.produto.results.nome}
                            </Text>
                        </View>
                        <Text style={styles.productPrice}>
                            R$ {parseFloat(prod.preco_unitario).toFixed(2)}
                        </Text>
                    </View>
                  ))}

                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total:</Text>
                    <Text style={styles.totalValue}>
                        R$ {parseFloat(selectedPedido.valor_total).toFixed(2)}
                    </Text>
                  </View>

                  <View style={styles.divider} />

                  {/* Campo de Descrição (Apenas visual, pois a API não tem campo pra salvar isso no POST informado) */}
                  <Text style={styles.inputLabel}>Adicionar Observação:</Text>
                  <TextInput
                    style={styles.textArea}
                    multiline={true}
                    numberOfLines={4}
                    value={descricao}
                    onChangeText={setDescricao}
                    placeholder="Ex: Tocar a campainha..."
                  />
                </ScrollView>

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Ionicons name="save-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
                  <Text style={styles.saveButtonText}>Salvar Alterações</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E8F5E9" },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { padding: 12, marginVertical: 8, width: "92%", alignSelf: 'center' },
  row: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  image: { width: 72, height: 72, borderRadius: 10, backgroundColor: '#ddd' },
  name: { fontSize: 17, fontWeight: "600" },
  produto: { fontSize: 15, color: "#6B6B6B" },
  data: { fontSize: 13, color: "#888" },
  statusBase: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8, marginTop: 6, alignSelf: "flex-start" },
  statusText: { color: "#FFF", fontSize: 12, fontWeight: 'bold' },
  preco: { fontSize: 16, fontWeight: "700", alignSelf: "flex-start" },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContent: { width: "90%", backgroundColor: "#FFF", borderRadius: 20, padding: 20, maxHeight: "80%" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#0D1F3C" },
  label: { fontSize: 14, color: "#555", marginBottom: 10, fontWeight: '600' },
  valueBold: { fontWeight: "bold", color: "#000" },
  statusSelectorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  statusOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  statusOptionText: {
    fontSize: 13,
    fontWeight: '500',
  },
  divider: { height: 1, backgroundColor: "#EEE", marginVertical: 12 },
  productRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', paddingBottom: 4 },
  productText: { fontSize: 14, color: "#333" },
  productPrice: { fontSize: 14, fontWeight: "600" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#F5F5F5", padding: 10, borderRadius: 8, marginTop: 5 },
  totalLabel: { fontSize: 16, fontWeight: "bold" },
  totalValue: { fontSize: 16, fontWeight: "bold", color: "#2E7D32" },
  inputLabel: { fontSize: 14, color: "#0D1F3C", fontWeight: "600", marginBottom: 8, marginTop: 5 },
  textArea: { borderWidth: 1, borderColor: "#4CAF50", borderRadius: 10, padding: 10, fontSize: 14, textAlignVertical: "top", height: 80, color: "#0D1F3C" },
  saveButton: { backgroundColor: "#2E7D32", flexDirection: "row", justifyContent: "center", alignItems: "center", paddingVertical: 12, borderRadius: 25, marginTop: 20 },
  saveButtonText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
});