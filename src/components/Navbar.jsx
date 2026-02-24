import React, { useState } from 'react';
import { ShoppingBag, Search, User, Menu, LogOut, PackagePlus, Truck, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo-yf.jpg';
import { useCart } from '../context/CartContext';
import { useSearch } from '../context/SearchContext';

function Navbar() {
  const { setIsCartOpen, cartItems, clearCart } = useCart();
  const { setIsSearchOpen } = useSearch();
  const navigate = useNavigate();
  
  // ESTADO NOVO: Controla se o menu do celular está aberto ou fechado
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Recupera o usuário salvo no navegador
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isAdmin = user && user.is_admin;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    clearCart();
    setIsMenuOpen(false); // Fecha o menu ao sair
    navigate('/login');
  };

  return (
    <nav className="bg-black text-white border-b border-gray-900 sticky top-0 z-50 relative">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Menu Mobile (Hamburguer / X) */}
        <div className="md:hidden cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? (
            <X className="w-6 h-6 text-gray-300 hover:text-white transition-colors" />
          ) : (
            <Menu className="w-6 h-6 text-gray-300 hover:text-white transition-colors" />
          )}
        </div>

        {/* LOGO */}
        <div className="flex-shrink-0">
          <Link to="/" onClick={() => setIsMenuOpen(false)}>
            <img src={logo} alt="YF Pratas" className="h-12 md:h-16 w-auto object-contain hover:opacity-80 transition-opacity" />
          </Link>
        </div>

        {/* LINKS CENTRAIS (Desktop - Some no celular) */}
        <div className="hidden md:flex items-center space-x-6 text-xs uppercase tracking-[0.15em] text-gray-400 font-bold">
          <Link to="/" className="hover:text-white transition-colors py-2 border-b-2 border-transparent hover:border-white">
            Início
          </Link>
          
          <Link to="/catalogo" className="hover:text-white transition-colors py-2 border-b-2 border-transparent hover:border-white">
            Catálogo
          </Link>
          
          {/* SEPARAÇÃO: Se for Admin vê gestão, se for Cliente vê pedidos */}
          {isAdmin ? (
            <>
                <Link to="/admin/produtos" className="text-yellow-500 border border-yellow-500/30 px-3 py-1 rounded hover:bg-yellow-500/10 flex items-center gap-2 transition-all" title="Cadastrar Novos Produtos">
                    <PackagePlus size={14} /> Add Produtos
                </Link>
                <Link to="/admin/pedidos" className="text-blue-400 border border-blue-500/30 px-3 py-1 rounded hover:bg-blue-500/10 flex items-center gap-2 transition-all" title="Gerenciar Vendas e Etiquetas">
                    <Truck size={14} /> Ver Vendas
                </Link>
            </>
          ) : (
            // Só mostra "Meus Pedidos" se estiver logado e NÃO for admin
            user && (
                <Link to="/meus-pedidos" className="hover:text-white transition-colors py-2 border-b-2 border-transparent hover:border-white">
                    Meus Pedidos
                </Link>
            )
          )}

          <Link to="/sobre" className="hover:text-white transition-colors py-2 border-b-2 border-transparent hover:border-white">
            Sobre
          </Link>
        </div>

        {/* ÍCONES DA DIREITA */}
        <div className="flex items-center gap-4 md:gap-6">
          
          {/* Busca */}
          <button onClick={() => setIsSearchOpen(true)} title="Buscar">
             <Search className="w-5 h-5 text-gray-300 hover:text-white transition-transform hover:scale-110" />
          </button>
          
          {/* Área do Usuário */}
          {user ? (
            <div className="flex items-center gap-3 md:gap-4 border-l border-gray-800 pl-3 md:pl-6">
              
              {/* Identificação Visual */}
              {isAdmin ? (
                <Link to="/admin/pedidos" className="hidden md:block text-right">
                  <span className="text-[10px] text-yellow-500 font-bold block leading-tight">ADMIN</span>
                  <span className="text-xs font-bold text-white block">Olá, {user.nome?.split(' ')[0]}</span>
                </Link>
              ) : (
                <div className="hidden md:block text-right">
                    <span className="text-[10px] text-gray-500 block leading-tight">CLIENTE</span>
                    <span className="text-xs font-bold text-gray-300 block">Olá, {user.nome?.split(' ')[0]}</span>
                </div>
              )}

              {/* Botão Sair */}
              <button onClick={handleLogout} title="Sair" className="group">
                <LogOut className="w-5 h-5 text-red-500 group-hover:text-red-400 transition-transform group-hover:scale-110" />
              </button>
            </div>
          ) : (
            // Visitante
            <Link to="/login" title="Entrar" className="border-l border-gray-800 pl-3 md:pl-6">
              <User className="w-5 h-5 text-gray-300 hover:text-white transition-transform hover:scale-110" />
            </Link>
          )}
          
          {/* Carrinho */}
          <button 
            className="relative group p-2 -mr-2" 
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingBag className="w-5 h-5 text-gray-300 group-hover:text-white transition-transform group-hover:scale-110" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-white text-black text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center animate-bounce shadow-lg shadow-white/20">
                {totalItems}
              </span>
            )}
          </button>

        </div>
      </div>

      {/* --- MENU MOBILE (YF Pratas Style) --- */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black border-b border-gray-800 shadow-xl animate-fade-in z-50">
          <div className="flex flex-col px-6 py-6 space-y-6 text-sm uppercase tracking-widest font-bold text-gray-400">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="hover:text-white transition-colors">Início</Link>
            <Link to="/catalogo" onClick={() => setIsMenuOpen(false)} className="hover:text-white transition-colors">Catálogo</Link>
            
            {isAdmin ? (
              <div className="flex flex-col gap-4 border-y border-gray-800 py-4 my-2">
                  <span className="text-[10px] text-yellow-500 font-black tracking-widest">Painel Admin</span>
                  <Link to="/admin/produtos" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-white hover:text-yellow-500 transition-colors">
                      <PackagePlus size={18} /> Adicionar Produtos
                  </Link>
                  <Link to="/admin/pedidos" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors">
                      <Truck size={18} /> Ver Vendas
                  </Link>
              </div>
            ) : (
              user && (
                  <Link to="/meus-pedidos" onClick={() => setIsMenuOpen(false)} className="hover:text-white transition-colors border-y border-gray-800 py-4 my-2">
                      Meus Pedidos
                  </Link>
              )
            )}

            <Link to="/sobre" onClick={() => setIsMenuOpen(false)} className="hover:text-white transition-colors">Sobre</Link>
          </div>
        </div>
      )}

    </nav>
  );
}

export default Navbar;