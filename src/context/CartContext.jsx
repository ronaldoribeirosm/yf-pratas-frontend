import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false); // Controle da sidebar

  const getToken = () => localStorage.getItem('token');

  // --- FUNÇÃO PARA LIMPAR TUDO (LOGOUT FORÇADO) ---
  // Essa função é a "arma nuclear" contra o token velho.
  const clearSession = () => {
    console.log("🚫 Sessão inválida ou expirada. Realizando logout forçado...");
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCartItems([]);
    setIsCartOpen(false);
    // Redireciona para o login para garantir que o usuário não continue navegando bugado
    window.location.href = '/login';
  };

  // 1. CARREGAR O CARRINHO AO INICIAR
  useEffect(() => {
    const token = getToken();
    if (token) {
      fetchCartFromAPI(token);
    }
  }, []);

  const fetchCartFromAPI = async (token) => {
    try {
      const response = await fetch('http://https://yf-pratas-backend.onrender.com/carrinho', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // SE DER ERRO 403 (Token Inválido/Expirado) -> LIMPA TUDO NA HORA
      if (response.status === 403 || response.status === 401) {
        clearSession(); 
        return;
      }

      const data = await response.json();
      
     if (Array.isArray(data)) {
        const formattedCart = data.map(item => ({
            id: item.produto_id,
            nome: item.nome,
            // 🛡️ CORREÇÃO DE SEGURANÇA AQUI:
            // Forçamos ser um número. Se vier vazio, vira 0.
            preco: Number(item.preco || 0), 
            imagem_url: item.imagem_url,
            quantity: Number(item.quantity || 1)
        }));
        setCartItems(formattedCart);
      }
    } catch (error) {
      console.error("Erro ao buscar carrinho:", error);
    }
  };

  // 2. ADICIONAR AO CARRINHO (AGORA EXIGE LOGIN)
  const addToCart = async (product) => {
    const token = getToken();

    // SE NÃO TIVER TOKEN, PERGUNTA SE QUER LOGAR
    if (!token) {
      const confirmLogin = window.confirm("Você precisa estar logado para comprar. Deseja fazer login agora?");
      if (confirmLogin) {
        window.location.href = '/login'; 
      }
      return; 
    }

    // SE TIVER TOKEN, TENTA SALVAR NO BANCO
    try {
      const res = await fetch('http://https://yf-pratas-backend.onrender.com/carrinho', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ produto_id: product.id, quantidade: 1 })
      });
      
      if (res.ok) {
        fetchCartFromAPI(token);
        setIsCartOpen(true); // Abre o carrinho pra mostrar que deu certo
      } else {
        // Se o token morreu no meio da ação
        if (res.status === 403 || res.status === 401) {
            alert("Sua sessão expirou. Por favor, faça login novamente.");
            clearSession();
        } else {
            alert("Erro ao salvar no carrinho.");
        }
      }
    } catch (error) {
      console.error("Erro de conexão:", error);
    }
  };

  // 3. REMOVER DO CARRINHO
  const removeFromCart = async (productId) => {
    const token = getToken();
    if (token) {
      try {
        const res = await fetch(`http://https://yf-pratas-backend.onrender.com/carrinho/${productId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        // Verificação de Segurança aqui também!
        if (res.status === 403 || res.status === 401) {
            clearSession();
            return;
        }

        fetchCartFromAPI(token);
      } catch (error) { console.error(error); }
    }
  };

  // Função simples apenas para limpar visualmente (sem redirecionar)
  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, isCartOpen, setIsCartOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);