import React, { useState, useEffect } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { MapPin, User, Truck, CreditCard, CheckCircle, Package, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function CheckoutPage() {
  // SUAS CHAVES
  initMercadoPago('APP_USR-f72254fb-893e-4a9a-8a13-878382a592a5', { locale: 'pt-BR' });

  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [preferenceId, setPreferenceId] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Estados do Frete
  const [opcoesFrete, setOpcoesFrete] = useState([]); 
  const [freteSelecionado, setFreteSelecionado] = useState(null); 
  const [loadingFrete, setLoadingFrete] = useState(false);

  const [formData, setFormData] = useState({
    nome: '', cpf: '', email: '', telefone: '',
    cep: '', rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: ''
  });

  const subtotal = cartItems.reduce((acc, item) => acc + Number(item.preco) * item.quantity, 0);
  const total = subtotal + (freteSelecionado ? freteSelecionado.valor : 0);

  // Busca CEP
  const buscarCep = async (e) => {
    const cep = e.target.value.replace(/\D/g, '');
    
    if (cep.length === 8) {
        setLoadingFrete(true);
        try {
            const resEnd = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const dataEnd = await resEnd.json();
            
            if (!dataEnd.erro) {
                setFormData(prev => ({
                    ...prev,
                    rua: dataEnd.logradouro,
                    bairro: dataEnd.bairro,
                    cidade: dataEnd.localidade,
                    estado: dataEnd.uf
                }));

                // Calcula Frete no Backend
                const resFrete = await fetch('https://yf-pratas-backend.onrender.com/calcular-frete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        cepDestino: cep,
                        estadoDestino: dataEnd.uf 
                    })
                });
                const dataFrete = await resFrete.json();
                setOpcoesFrete(dataFrete);
            } else {
                alert("CEP não encontrado.");
            }
        } catch (error) {
            console.error("Erro CEP/Frete:", error);
            // Fallback visual caso dê erro de conexão
            setOpcoesFrete([{ tipo: 'Frete Fixo', valor: 30.00, prazo: '5-10' }]);
        } finally {
            setLoadingFrete(false);
        }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- VALIDAÇÃO E FINALIZAÇÃO ---
  const handleFinalizar = async (e) => {
    e.preventDefault();

    // 0. Verifica Login
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Você precisa estar logado para finalizar a compra.");
        navigate('/login');
        return;
    }

    // 1. LISTA DE CAMPOS OBRIGATÓRIOS
    const camposObrigatorios = [
        { campo: 'nome', label: 'Nome Completo' },
        { campo: 'cpf', label: 'CPF' },
        { campo: 'email', label: 'E-mail' },
        { campo: 'telefone', label: 'Telefone/WhatsApp' },
        { campo: 'cep', label: 'CEP' },
        { campo: 'rua', label: 'Rua' },
        { campo: 'numero', label: 'Número da Casa' },
        { campo: 'bairro', label: 'Bairro' },
        { campo: 'cidade', label: 'Cidade' },
        { campo: 'estado', label: 'Estado (UF)' }
    ];

    // 2. VERIFICA SE TEM ALGO VAZIO
    const camposVazios = camposObrigatorios.filter(item => !formData[item.campo] || formData[item.campo].trim() === '');

    if (camposVazios.length > 0) {
        const listaFaltando = camposVazios.map(i => i.label).join(', ');
        alert(`⚠️ ATENÇÃO: Você esqueceu de preencher: \n\n${listaFaltando}\n\nPreencha tudo para continuar!`);
        return; 
    }

    // 3. VERIFICA FRETE
    if (!freteSelecionado) {
        alert("⚠️ Por favor, selecione uma opção de FRETE antes de pagar.");
        return;
    }

    // SE PASSOU POR TUDO, CHAMA O BACKEND
    setLoading(true);

    try {
        const response = await fetch('https://yf-pratas-backend.onrender.com/pedidos', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({
                dados_cliente: {
                    nome: formData.nome,
                    cpf: formData.cpf,
                    email: formData.email,
                    telefone: formData.telefone
                },
                endereco: {
                    ...formData,
                    cep: formData.cep
                },
                itens: cartItems,
                frete: freteSelecionado.valor,
                prazo: freteSelecionado.prazo // <--- IMPORTANTE: Envia o prazo para o banco salvar
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            setPreferenceId(data.id);
        } else {
            alert("Erro ao gerar pedido: " + (data.error || "Erro desconhecido"));
        }

    } catch (error) {
        console.error(error);
        alert("Erro de conexão com o servidor.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-20">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold uppercase tracking-widest mb-8 text-center md:text-left">Checkout Seguro</h1>

        <div className="flex flex-col lg:flex-row gap-12">
            
            {/* ESQUERDA: Formulário */}
            <div className="w-full lg:w-2/3 space-y-8">
                
                {/* Dados Pessoais */}
                <div className="bg-gray-900 p-6 rounded border border-gray-800">
                    <h2 className="flex items-center gap-2 text-xl font-bold mb-4 text-gray-200">
                        <User className="text-blue-500" /> Dados Pessoais
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="nome" placeholder="Nome Completo *" required onChange={handleChange} className="bg-black border border-gray-700 p-3 rounded text-white focus:border-blue-500 outline-none" />
                        <input name="cpf" placeholder="CPF *" required onChange={handleChange} className="bg-black border border-gray-700 p-3 rounded text-white focus:border-blue-500 outline-none" />
                        <input name="email" type="email" placeholder="E-mail *" required onChange={handleChange} className="bg-black border border-gray-700 p-3 rounded text-white focus:border-blue-500 outline-none" />
                        <input name="telefone" placeholder="WhatsApp / Telefone *" required onChange={handleChange} className="bg-black border border-gray-700 p-3 rounded text-white focus:border-blue-500 outline-none" />
                    </div>
                </div>

                {/* Endereço */}
                <div className="bg-gray-900 p-6 rounded border border-gray-800">
                    <h2 className="flex items-center gap-2 text-xl font-bold mb-4 text-gray-200">
                        <MapPin className="text-red-500" /> Entrega
                    </h2>
                    
                    <div className="mb-6">
                        <label className="text-sm text-gray-400">Digite seu CEP para calcular o frete:</label>
                        <div className="flex gap-4 mt-1">
                            <input 
                                name="cep" 
                                placeholder="00000-000 *" 
                                required 
                                onBlur={buscarCep} 
                                onChange={handleChange}
                                maxLength="9"
                                className="w-40 bg-black border border-gray-700 p-3 rounded text-white text-center tracking-widest focus:border-red-500 outline-none" 
                            />
                            {loadingFrete && <span className="flex items-center text-yellow-500 text-sm animate-pulse">Calculando...</span>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <input name="rua" placeholder="Rua *" required value={formData.rua} onChange={handleChange} className="md:col-span-2 bg-black border border-gray-700 p-3 rounded text-white" />
                        <input name="numero" placeholder="Número *" required onChange={handleChange} className="bg-black border border-gray-700 p-3 rounded text-white focus:border-red-500 outline-none" />
                        <input name="bairro" placeholder="Bairro *" required value={formData.bairro} onChange={handleChange} className="bg-black border border-gray-700 p-3 rounded text-white" />
                        <input name="cidade" placeholder="Cidade *" required value={formData.cidade} onChange={handleChange} className="bg-black border border-gray-700 p-3 rounded text-white" />
                        <input name="estado" placeholder="UF *" required value={formData.estado} onChange={handleChange} className="bg-black border border-gray-700 p-3 rounded text-white" />
                        <input name="complemento" placeholder="Complemento (Opcional)" onChange={handleChange} className="md:col-span-3 bg-black border border-gray-700 p-3 rounded text-white" />
                    </div>

                    {/* OPÇÕES DE FRETE */}
                    {opcoesFrete.length > 0 && (
                        <div className="bg-black p-4 rounded border border-gray-700 animate-fade-in">
                            <h3 className="text-sm font-bold uppercase mb-3 flex items-center gap-2">
                                <Package size={16} /> Escolha o envio:
                            </h3>
                            <div className="space-y-3">
                                {opcoesFrete.map((opcao, index) => (
                                    <label key={index} className={`flex items-center justify-between p-3 rounded cursor-pointer border transition-all ${freteSelecionado === opcao ? 'border-green-500 bg-green-900/20' : 'border-gray-800 hover:border-gray-600'}`}>
                                        <div className="flex items-center gap-3">
                                            <input 
                                                type="radio" 
                                                name="frete" 
                                                className="accent-green-500"
                                                checked={freteSelecionado === opcao}
                                                onChange={() => setFreteSelecionado(opcao)}
                                            />
                                            <div>
                                                <p className="font-bold">{opcao.tipo}</p>
                                                <p className="text-xs text-gray-400">Chega em {opcao.prazo} dias úteis</p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-green-400">
                                            R$ {opcao.valor.toFixed(2).replace('.', ',')}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

            </div>

            {/* DIREITA: Resumo */}
            <div className="w-full lg:w-1/3">
                <div className="bg-gray-800 p-6 rounded-lg sticky top-24 shadow-2xl">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <CreditCard className="text-green-500" /> Resumo
                    </h2>

                    <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex justify-between text-sm text-gray-300">
                                <span>{item.quantity}x {item.nome}</span>
                                <span>R$ {(item.preco * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-700 pt-4 space-y-2">
                        <div className="flex justify-between text-gray-400">
                            <span>Subtotal</span>
                            <span>R$ {subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                            <span className="flex items-center gap-1"><Truck size={14} /> Frete</span>
                            {freteSelecionado ? (
                                <span>R$ {freteSelecionado.valor.toFixed(2)}</span>
                            ) : (
                                <span className="text-yellow-500 text-xs">Aguardando...</span>
                            )}
                        </div>
                        <div className="flex justify-between text-2xl font-bold text-white pt-2">
                            <span>Total</span>
                            <span>R$ {total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="mt-8">
                        {!preferenceId ? (
                            <button 
                                onClick={handleFinalizar}
                                disabled={loading}
                                className={`w-full py-4 font-bold uppercase tracking-widest rounded transition-all flex justify-center items-center gap-2
                                    ${loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-white text-black hover:bg-gray-200 active:scale-95'}
                                `}
                            >
                                {loading ? 'Validando...' : 'Confirmar e Pagar'} {!loading && <CheckCircle size={20} />}
                            </button>
                        ) : (
                            <div className="animate-fade-in">
                                <p className="text-center text-sm text-gray-400 mb-2 flex items-center justify-center gap-1">
                                    <CheckCircle size={14} className="text-green-500"/> Tudo certo! Pague abaixo:
                                </p>
                                <Wallet initialization={{ preferenceId: preferenceId }} customization={{ texts:{ valueProp: 'security_details'}}} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;