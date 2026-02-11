import React from 'react';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

function CartSidebar() {
  const { isCartOpen, setIsCartOpen, cartItems, removeFromCart } = useCart();
  const navigate = useNavigate();

  // 🛡️ CÁLCULO SEGURO DO SUBTOTAL
  const subtotal = cartItems.reduce((total, item) => {
    const preco = Number(item.preco) || 0;
    const qtd = Number(item.quantity) || 1;
    return total + (preco * qtd);
  }, 0);

  // Função auxiliar para formatar dinheiro (Evita repetir código e erros)
  const formatMoney = (value) => {
    return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay Escuro (clique fecha) */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsCartOpen(false)}
      ></div>

      {/* Sidebar */}
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-black border-l border-gray-800 text-white flex flex-col shadow-2xl animate-slide-in">
          
          {/* Cabeçalho */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <h2 className="text-xl font-bold uppercase tracking-widest flex items-center gap-2">
              <ShoppingBag size={20} /> Seu Carrinho
            </h2>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Lista de Itens */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-20 opacity-50">
                <p>Seu carrinho está vazio.</p>
                <button 
                  onClick={() => setIsCartOpen(false)} 
                  className="mt-4 underline hover:text-white"
                >
                  Continuar comprando
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 group">
                  {/* Imagem */}
                  <div className="w-20 h-20 bg-gray-900 rounded overflow-hidden flex-shrink-0 border border-gray-800">
                    <img 
                      src={item.imagem_url || 'https://via.placeholder.com/150'} 
                      alt={item.nome} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>

                  {/* Detalhes */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-sm uppercase tracking-wide">{item.nome}</h3>
                      <p className="text-gray-400 text-xs mt-1">Quantidade: {item.quantity}</p>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="font-bold text-sm">
                        {formatMoney(item.preco)}
                      </span>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-400 transition-colors p-1"
                        title="Remover item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Rodapé (Total e Botão) */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-gray-800 bg-gray-900/50">
              <div className="flex justify-between items-center mb-6 text-lg font-bold">
                <span>Subtotal</span>
                <span>{formatMoney(subtotal)}</span>
              </div>
              <button 
                className="w-full bg-white text-black py-4 font-bold uppercase tracking-widest hover:bg-gray-200 transition-transform active:scale-95"
               onClick={() => {
            setIsCartOpen(false);
            navigate('/checkout');
            }}
              >
                Finalizar Compra
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default CartSidebar;