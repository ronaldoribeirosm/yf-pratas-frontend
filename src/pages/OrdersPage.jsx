import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Package, Clock, MapPin, ChevronDown, CheckCircle, XCircle, Truck } from 'lucide-react';

function OrdersPage() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('https://yf-pratas-backend.onrender.com/meus-pedidos', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setPedidos(data);
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  // Função para formatar data
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  // Função para cor do status
  const getStatusColor = (status) => {
    switch (status) {
      case 'pago': return 'text-green-500 border-green-500 bg-green-900/20';
      case 'enviado': return 'text-blue-500 border-blue-500 bg-blue-900/20';
      case 'cancelado': return 'text-red-500 border-red-500 bg-red-900/20';
      default: return 'text-yellow-500 border-yellow-500 bg-yellow-900/20';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-20">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold uppercase tracking-widest mb-8 flex items-center gap-3">
          <Package className="text-white" /> Meus Pedidos
        </h1>

        {loading ? (
          <p className="text-gray-500 animate-pulse">Carregando histórico...</p>
        ) : pedidos.length === 0 ? (
          <div className="bg-gray-900 p-8 rounded text-center border border-gray-800">
            <Package size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400">Você ainda não fez nenhuma compra.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pedidos.map((pedido) => (
              <div key={pedido.id} className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden hover:border-gray-600 transition-all">
                
                {/* Cabeçalho do Pedido */}
                <div className="bg-gray-800 p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <span className="text-gray-400 text-xs uppercase tracking-wider">Pedido #{pedido.id}</span>
                    <p className="font-bold text-sm text-gray-200">{formatDate(pedido.criado_em)}</p>
                  </div>
                  
                  <div className={`px-4 py-1 rounded-full border text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${getStatusColor(pedido.status)}`}>
                    {pedido.status === 'pago' ? <CheckCircle size={14} /> : 
                     pedido.status === 'enviado' ? <Truck size={14} /> : 
                     <Clock size={14} />}
                    {pedido.status}
                  </div>
                </div>

                {/* Corpo do Pedido */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Lista de Itens - CORREÇÃO AQUI */}
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="font-bold text-gray-400 text-sm uppercase mb-2">Produtos</h3>
                    {(() => {
                        // Lógica robusta para tratar os itens, seja string JSON ou array
                        let listaItens = [];
                        try {
                            listaItens = typeof pedido.itens === 'string' 
                                ? JSON.parse(pedido.itens) 
                                : pedido.itens;
                        } catch (e) {
                            console.error("Erro ao processar itens do pedido:", e);
                            listaItens = [];
                        }

                        return listaItens && listaItens.length > 0 ? (
                            listaItens.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center border-b border-gray-800 pb-2 last:border-0">
                                <div className="flex items-center gap-3">
                                  <div className="bg-gray-800 w-12 h-12 rounded flex items-center justify-center text-gray-500">
                                    <Package size={20} />
                                  </div>
                                  <div>
                                    <p className="font-bold text-sm">{item.nome || 'Produto Sem Nome'}</p>
                                    <p className="text-xs text-gray-500">Qtd: {item.quantity || item.quantidade}</p>
                                  </div>
                                </div>
                                <p className="font-bold text-sm">R$ {Number(item.preco || item.unit_price).toFixed(2)}</p>
                              </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm italic">Nenhum detalhe do produto encontrado.</p>
                        );
                    })()}
                  </div>

                  {/* Detalhes de Entrega e Valores */}
                  <div className="space-y-6 lg:border-l lg:border-gray-800 lg:pl-8">
                    
                    {/* Endereço */}
                    <div>
                      <h3 className="font-bold text-gray-400 text-sm uppercase mb-2 flex items-center gap-2">
                        <MapPin size={14} /> Entrega
                      </h3>
                      <p className="text-sm text-gray-300">
                        {pedido.endereco_entrega.rua}, {pedido.endereco_entrega.numero}<br />
                        {pedido.endereco_entrega.bairro} - {pedido.endereco_entrega.cidade}/{pedido.endereco_entrega.estado}<br />
                        CEP: {pedido.endereco_entrega.cep}
                      </p>
                    </div>

                    {/* Previsão */}
                    <div>
                        <h3 className="font-bold text-gray-400 text-sm uppercase mb-2 flex items-center gap-2">
                            <Clock size={14} /> Previsão
                        </h3>
                        <p className="text-sm text-green-400 font-bold">
                            {pedido.detalhes_envio?.prazo ? `${pedido.detalhes_envio.prazo} dias úteis após envio` : 'Aguardando envio'}
                        </p>
                    </div>

                    {/* Total */}
                    <div className="pt-4 border-t border-gray-800">
                        <div className="flex justify-between text-sm text-gray-400 mb-1">
                            <span>Frete</span>
                            <span>R$ {Number(pedido.detalhes_envio?.valor || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold text-white">
                            <span>Total</span>
                            <span>R$ {Number(pedido.total).toFixed(2)}</span>
                        </div>
                    </div>

                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;