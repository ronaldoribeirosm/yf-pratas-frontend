import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Package, MapPin, Search, Printer, FileText, AlertTriangle, Truck } from 'lucide-react';

function AdminOrdersPage() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('');

  // DADOS DA SUA LOJA (Para aparecer na etiqueta/declaração)
  const REMETENTE = {
    nome: "YF PRATAS JOIAS",
    cpf_cnpj: "00.000.000/0001-00", // Coloque seu CNPJ real aqui
    endereco: "Av. Dr. Januario Miraglia, 1234",
    bairro: "Abernéssia",
    cidade: "Campos do Jordão",
    uf: "SP",
    cep: "12460-000"
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        setLoading(false);
        return;
    }

    try {
      const res = await fetch('http://https://yf-pratas-backend.onrender.com/admin/pedidos', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.status === 403) {
        setError("ACESSO NEGADO: Verifique se seu usuário é Admin.");
        setLoading(false);
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setPedidos(data);
      } else {
        setError("Erro ao buscar pedidos.");
      }
    } catch (error) {
      console.error("Erro:", error);
      setError("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const atualizarStatus = async (id, novoStatus) => {
    const token = localStorage.getItem('token');
    let rastreio = null;

    // Se for marcar como enviado, pede o rastreio
    if (novoStatus === 'enviado') {
        rastreio = prompt("📦 Informe o Código de Rastreio (ex: AA123456789BR):");
        if (rastreio === null) return; // Se cancelar, para tudo
    } else {
        if (!confirm(`Mudar status para "${novoStatus}"?`)) return;
    }

    try {
      const bodyData = { status: novoStatus };
      if (rastreio) bodyData.codigo_rastreio = rastreio;

      await fetch(`http://https://yf-pratas-backend.onrender.com/admin/pedidos/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(bodyData)
      });
      
      // Atualiza a tela localmente
      setPedidos(pedidos.map(p => p.id === id ? { ...p, status: novoStatus, codigo_rastreio: rastreio || p.codigo_rastreio } : p));
    } catch (error) { alert("Erro ao atualizar."); }
  };

  // --- 1. ETIQUETA DE ENVIO (A6 - 10x15cm) ---
  const imprimirEtiqueta = (pedido) => {
    const janela = window.open('', '', 'width=400,height=600');
    janela.document.write(`
      <html>
        <head>
          <title>Etiqueta #${pedido.id}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&display=swap');
            @page { size: 100mm 150mm; margin: 0; }
            body { font-family: 'Roboto', sans-serif; margin: 0; padding: 5mm; box-sizing: border-box; width: 100mm; height: 150mm; }
            .container { border: 2px solid #000; height: 100%; display: flex; flex-direction: column; }
            .header { background: #000; color: #fff; padding: 5px; display: flex; justify-content: space-between; align-items: center; -webkit-print-color-adjust: exact; }
            .servico { font-size: 24px; font-weight: 900; letter-spacing: 2px; }
            .destinatario { padding: 10px; flex-grow: 1; position: relative; }
            .label { font-size: 10px; font-weight: bold; text-transform: uppercase; color: #555; margin-bottom: 2px; }
            .nome { font-size: 16px; font-weight: 900; text-transform: uppercase; line-height: 1.1; margin-bottom: 5px; }
            .endereco { font-size: 14px; line-height: 1.3; margin-bottom: 10px; }
            .cep { font-size: 24px; font-weight: 900; text-align: right; letter-spacing: 3px; border-bottom: 2px solid #000; padding-bottom: 5px; margin-bottom: 10px; }
            .remetente { border-top: 2px dashed #000; padding: 10px; background: #f0f0f0; -webkit-print-color-adjust: exact; font-size: 10px; }
            .qr-fake { position: absolute; top: 10px; right: 10px; border: 1px solid #000; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; font-size: 8px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <span class="servico">SEDEX</span>
              <span style="font-size:10px; font-weight:bold;">CORREIOS</span>
            </div>
            <div class="destinatario">
              <div class="qr-fake">QR<br>PLP</div>
              <div class="label">DESTINATÁRIO</div>
              <div class="nome">${pedido.dados_cliente.nome}</div>
              <div class="endereco">
                ${pedido.endereco_entrega.rua}, ${pedido.endereco_entrega.numero} ${pedido.endereco_entrega.complemento || ''}<br/>
                ${pedido.endereco_entrega.bairro}<br/>
                ${pedido.endereco_entrega.cidade} / ${pedido.endereco_entrega.estado}
              </div>
              <div class="label">CEP</div>
              <div class="cep">${pedido.endereco_entrega.cep}</div>
              <div class="label">PEDIDO: #${pedido.id}</div>
            </div>
            <div class="remetente">
              <div class="label">REMETENTE</div>
              <strong>${REMETENTE.nome}</strong><br/>
              ${REMETENTE.endereco} - ${REMETENTE.bairro}<br/>
              ${REMETENTE.cidade} / ${REMETENTE.uf}<br/>
              CEP: ${REMETENTE.cep}
            </div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    janela.document.close();
  };

  // --- 2. DECLARAÇÃO DE CONTEÚDO (A4) ---
  const imprimirDeclaracao = (pedido) => {
    let listaItens = [];
    try { listaItens = typeof pedido.itens === 'string' ? JSON.parse(pedido.itens) : pedido.itens; } catch(e){}
    const totalValor = listaItens.reduce((acc, item) => acc + (Number(item.preco) * Number(item.quantity)), 0);

    const janela = window.open('', '', 'width=800,height=900');
    janela.document.write(`
      <html>
        <head>
          <title>Declaração #${pedido.id}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
            @page { size: A4; margin: 10mm; }
            body { font-family: 'Roboto', sans-serif; font-size: 11px; line-height: 1.3; }
            h1 { text-align: center; font-size: 16px; margin-bottom: 20px; text-transform: uppercase; font-weight: bold; }
            .box { border: 1px solid #000; padding: 5px; margin-bottom: 5px; }
            .box-title { font-weight: bold; text-transform: uppercase; background: #eee; padding: 2px 5px; margin: -5px -5px 5px -5px; border-bottom: 1px solid #000; -webkit-print-color-adjust: exact; }
            .row { display: flex; gap: 10px; }
            .col { flex: 1; }
            .campo { margin-bottom: 2px; }
            .label { font-weight: bold; margin-right: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 5px; }
            th, td { border: 1px solid #000; padding: 4px; text-align: center; }
            th { background: #eee; -webkit-print-color-adjust: exact; font-size: 10px; }
            .footer { margin-top: 20px; text-align: center; }
            .assinatura { border-top: 1px solid #000; width: 60%; margin: 30px auto 5px auto; }
          </style>
        </head>
        <body>
          <h1>Declaração de Conteúdo</h1>
          <div class="row">
            <div class="col box">
              <div class="box-title">Remetente</div>
              <div class="campo"><span class="label">NOME:</span> ${REMETENTE.nome}</div>
              <div class="campo"><span class="label">CPF/CNPJ:</span> ${REMETENTE.cpf_cnpj}</div>
              <div class="campo"><span class="label">ENDEREÇO:</span> ${REMETENTE.endereco}</div>
              <div class="campo"><span class="label">CIDADE/UF:</span> ${REMETENTE.cidade}/${REMETENTE.uf}</div>
              <div class="campo"><span class="label">CEP:</span> ${REMETENTE.cep}</div>
            </div>
            <div class="col box">
              <div class="box-title">Destinatário</div>
              <div class="campo"><span class="label">NOME:</span> ${pedido.dados_cliente.nome}</div>
              <div class="campo"><span class="label">CPF/CNPJ:</span> ${pedido.dados_cliente.cpf || 'NÃO INFORMADO'}</div>
              <div class="campo"><span class="label">ENDEREÇO:</span> ${pedido.endereco_entrega.rua}, ${pedido.endereco_entrega.numero}</div>
              <div class="campo"><span class="label">CIDADE/UF:</span> ${pedido.endereco_entrega.cidade}/${pedido.endereco_entrega.estado}</div>
              <div class="campo"><span class="label">CEP:</span> ${pedido.endereco_entrega.cep}</div>
            </div>
          </div>
          <div class="box">
            <div class="box-title">Itens</div>
            <table>
              <thead><tr><th>ITEM</th><th>CONTEÚDO</th><th>QTD</th><th>VALOR (R$)</th></tr></thead>
              <tbody>
                ${listaItens.map((item, idx) => `
                  <tr>
                    <td>${idx + 1}</td>
                    <td style="text-align:left">${item.nome || item.title}</td>
                    <td>${item.quantity}</td>
                    <td>${Number(item.preco).toFixed(2)}</td>
                  </tr>`).join('')}
                <tr><td colspan="3" style="text-align:right; font-weight:bold">TOTAL</td><td style="font-weight:bold">R$ ${totalValor.toFixed(2)}</td></tr>
              </tbody>
            </table>
          </div>
          <div class="footer">
            <div style="font-size:10px; text-align:justify; margin-bottom:10px;">Declaro que não me enquadro no conceito de contribuinte previsto no art. 4º da Lei Complementar nº 87/1996, responsabilizando-me pelas informações prestadas.</div>
            <div class="campo">${REMETENTE.cidade}, ${new Date().toLocaleDateString('pt-BR')}</div>
            <div class="assinatura"></div>
            <div>Assinatura do Declarante</div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    janela.document.close();
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit' });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pago': return 'text-green-400 border-green-500';
      case 'enviado': return 'text-blue-400 border-blue-500';
      case 'cancelado': return 'text-red-400 border-red-500';
      default: return 'text-yellow-400 border-yellow-500';
    }
  };

  const pedidosFiltrados = pedidos.filter(p => 
    p.id.toString().includes(filtro) || 
    (p.dados_cliente?.nome || '').toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-20">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold uppercase tracking-widest flex items-center gap-2">
                <Package className="text-yellow-500" /> Gestão de Vendas
            </h1>
            
            <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-3 text-gray-500" size={18} />
                <input 
                    type="text" 
                    placeholder="Buscar ID ou Nome..." 
                    className="w-full bg-gray-900 border border-gray-700 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:border-yellow-500 outline-none"
                    onChange={(e) => setFiltro(e.target.value)}
                />
            </div>
        </div>

        {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded text-center mb-8">
                <AlertTriangle className="inline-block mr-2" />
                {error}
            </div>
        )}

        {loading ? <p className="text-center animate-pulse text-gray-400">Carregando painel...</p> : (
          <div className="grid gap-6">
            {pedidosFiltrados.length === 0 && !error && (
                <p className="text-center text-gray-500">Nenhum pedido encontrado.</p>
            )}

            {pedidosFiltrados.map((pedido) => {
                let itens = [];
                try { itens = typeof pedido.itens === 'string' ? JSON.parse(pedido.itens) : pedido.itens; } catch(e){}

                return (
                <div key={pedido.id} className="bg-gray-900 border border-gray-800 rounded-lg p-6 shadow-lg hover:border-gray-600 transition-all">
                    
                    {/* TOPO: Ações e Status */}
                    <div className="flex flex-wrap justify-between items-start mb-6 border-b border-gray-800 pb-4 gap-4">
                        <div>
                            <span className="font-bold text-xl block text-white">#{pedido.id} <span className="text-sm font-normal text-gray-400 ml-2">{formatDate(pedido.criado_em)}</span></span>
                            <span className="text-yellow-500 font-bold uppercase">{pedido.dados_cliente?.nome || 'Cliente Desconhecido'}</span>
                            {pedido.codigo_rastreio && (
                                <div className="mt-1 text-xs text-blue-400 font-mono flex items-center gap-1">
                                    <Truck size={12} /> {pedido.codigo_rastreio}
                                </div>
                            )}
                        </div>
                        
                        <div className="flex flex-col items-end gap-3">
                             <span className={`px-3 py-1 rounded text-xs font-bold uppercase border ${getStatusColor(pedido.status)}`}>
                                {pedido.status}
                             </span>
                             
                             <div className="flex flex-wrap gap-2 justify-end">
                                {/* BOTÃO ETIQUETA A6 */}
                                <button 
                                    onClick={() => imprimirEtiqueta(pedido)}
                                    className="bg-white text-black hover:bg-gray-200 px-3 py-1 rounded text-xs font-bold uppercase flex items-center gap-1 transition-colors"
                                    title="Imprimir Etiqueta de Envio (10x15cm)"
                                >
                                    <Printer size={14} /> Etiqueta
                                </button>

                                {/* BOTÃO DECLARAÇÃO A4 */}
                                <button 
                                    onClick={() => imprimirDeclaracao(pedido)}
                                    className="bg-blue-600 text-white hover:bg-blue-500 px-3 py-1 rounded text-xs font-bold uppercase flex items-center gap-1 transition-colors"
                                    title="Imprimir Declaração de Conteúdo (A4)"
                                >
                                    <FileText size={14} /> Declaração
                                </button>

                                <select 
                                    className="bg-black border border-gray-600 text-white text-xs rounded p-1 cursor-pointer hover:border-yellow-500"
                                    onChange={(e) => atualizarStatus(pedido.id, e.target.value)}
                                    value=""
                                >
                                    <option value="" disabled>Mudar Status</option>
                                    <option value="pago">Pago</option>
                                    <option value="enviado">Enviado</option>
                                    <option value="cancelado">Cancelar</option>
                                </select>
                             </div>
                        </div>
                    </div>

                    {/* CORPO: Detalhes */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
                                <MapPin size={14}/> Envio
                            </h3>
                            <div className="text-sm text-gray-300 font-mono">
                                <p>{pedido.endereco_entrega?.rua}, {pedido.endereco_entrega?.numero}</p>
                                <p>{pedido.endereco_entrega?.bairro} - {pedido.endereco_entrega?.cidade}/{pedido.endereco_entrega?.estado}</p>
                                <p className="font-bold text-white">CEP: {pedido.endereco_entrega?.cep}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold text-gray-500 uppercase mb-2"><Package size={14} className="inline mr-1"/>Itens</h3>
                            <div className="space-y-1 text-sm text-gray-300 max-h-40 overflow-y-auto custom-scrollbar">
                                {itens && itens.length > 0 ? itens.map((item, idx) => (
                                    <div key={idx} className="flex justify-between border-b border-gray-800 pb-1">
                                        <span>{item.quantity || 1}x {item.nome || item.title || 'Produto'}</span>
                                        <span>R$ {Number(item.preco || item.unit_price || 0).toFixed(2)}</span>
                                    </div>
                                )) : <span className="text-gray-500 italic">Lista vazia.</span>}
                            </div>
                            
                            <div className="flex justify-between font-bold text-lg text-green-400 mt-2 pt-2 border-t border-gray-700">
                                <span>Total</span>
                                <span>R$ {Number(pedido.total).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )})}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrdersPage;