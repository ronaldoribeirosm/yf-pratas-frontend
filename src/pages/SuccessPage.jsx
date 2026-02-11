import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { CheckCircle, Package, ArrowRight, Loader } from 'lucide-react';
import { useCart } from '../context/CartContext';

function SuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [status, setStatus] = useState('verificando'); // verificando, sucesso, erro

  useEffect(() => {
    const payment_id = searchParams.get('payment_id');
    const preference_id = searchParams.get('preference_id');
    const collection_status = searchParams.get('collection_status');

    if (collection_status === 'approved' && payment_id) {
        verificarPagamento(payment_id, preference_id);
    } else {
        setStatus('pendente');
    }
  }, []);

  const verificarPagamento = async (payment_id, preference_id) => {
    try {
        // Chama o backend para confirmar e atualizar o banco
        const res = await fetch('https://yf-pratas-backend.onrender.com/verificar-pagamento', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ payment_id, preference_id })
        });
        
        if (res.ok) {
            clearCart(); // Limpa o carrinho pois já comprou
            setStatus('sucesso');
        } else {
            setStatus('erro');
        }
    } catch (error) {
        console.error(error);
        setStatus('erro');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Navbar />
      <div className="flex flex-col items-center justify-center h-[80vh] px-4 text-center">
        
        {status === 'verificando' && (
            <div className="animate-fade-in">
                <Loader className="w-16 h-16 text-blue-500 animate-spin mb-4 mx-auto" />
                <h1 className="text-2xl font-bold">Validando Pagamento...</h1>
                <p className="text-gray-400">Aguarde um instante.</p>
            </div>
        )}

        {status === 'sucesso' && (
            <div className="animate-fade-in bg-gray-900 p-8 rounded-lg border border-green-500/50 shadow-2xl max-w-md">
                <CheckCircle className="w-20 h-20 text-green-500 mb-6 mx-auto" />
                <h1 className="text-3xl font-bold mb-2 text-white">Pagamento Confirmado!</h1>
                <p className="text-gray-300 mb-8">Seu pedido já entrou na nossa linha de produção e será enviado em breve.</p>
                
                <div className="flex flex-col gap-3">
                    <button onClick={() => navigate('/meus-pedidos')} className="bg-green-600 hover:bg-green-500 text-white py-3 px-6 rounded font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                        <Package size={20} /> Acompanhar Pedido
                    </button>
                    <button onClick={() => navigate('/')} className="border border-gray-600 hover:border-white text-gray-300 hover:text-white py-3 px-6 rounded font-bold uppercase tracking-widest transition-all">
                        Voltar para Loja
                    </button>
                </div>
            </div>
        )}

        {(status === 'erro' || status === 'pendente') && (
            <div className="animate-fade-in bg-gray-900 p-8 rounded-lg border border-yellow-500/50">
                <h1 className="text-2xl font-bold text-yellow-500 mb-2">Processando...</h1>
                <p className="text-gray-300 mb-6">Seu pagamento está sendo processado. Verifique o status em "Meus Pedidos" em alguns minutos.</p>
                <button onClick={() => navigate('/meus-pedidos')} className="bg-white text-black py-3 px-6 rounded font-bold uppercase">
                    Ver Meus Pedidos
                </button>
            </div>
        )}

      </div>
    </div>
  );
}

export default SuccessPage;