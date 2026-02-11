import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ShieldCheck, Truck, CreditCard, ArrowLeft } from 'lucide-react';

// 1. IMPORTAR O HOOK DO CARRINHO
import { useCart } from '../context/CartContext';

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // 2. PEGAR A FUNÇÃO DE ADICIONAR
  const { addToCart } = useCart();

  // Busca os dados do produto no Backend
  useEffect(() => {
    window.scrollTo(0, 0); // Sobe para o topo

    fetch(`https://yf-pratas-backend.onrender.com/produtos/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro:", err);
        setLoading(false);
      });
  }, [id]);

  // Loading State
  if (loading) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="animate-pulse text-xl font-serif">Carregando detalhes...</div>
    </div>
  );

  // Error State
  if (!product) return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h2 className="text-2xl mb-4 font-serif">Produto não encontrado.</h2>
      <Link to="/" className="text-gray-400 hover:text-white underline tracking-widest uppercase text-sm">
        Voltar para a loja
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        
        {/* Botão Voltar */}
        <Link to="/" className="inline-flex items-center text-gray-500 hover:text-white mb-8 transition-colors text-xs uppercase tracking-[0.2em] font-bold group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Voltar
        </Link>

        <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
          
          {/* Coluna da Esquerda: Imagem */}
          <div className="md:w-1/2">
            <div className="rounded-sm overflow-hidden border border-gray-900 shadow-[0_0_30px_rgba(255,255,255,0.05)] bg-gray-900/20 sticky top-24">
              <img 
                src={product.imagem_url} 
                alt={product.nome} 
                className="w-full h-auto object-cover hover:scale-105 transition duration-700 ease-in-out"
              />
            </div>
          </div>

          {/* Coluna da Direita: Detalhes */}
          <div className="md:w-1/2 flex flex-col justify-start pt-4">
            
            {/* Categoria */}
            <span className="text-gray-500 uppercase tracking-[0.25em] text-xs font-bold mb-4 border-l-2 border-white pl-3">
              {product.categoria || 'Coleção Exclusiva'}
            </span>
            
            {/* Nome do Produto */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold mb-6 leading-none uppercase italic tracking-tighter text-white">
              {product.nome}
            </h1>
            
            {/* Preço */}
            <p className="text-3xl font-light mb-8 text-white tracking-wide">
              {parseFloat(product.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
            
            {/* Descrição */}
            <p className="text-gray-400 mb-10 leading-relaxed font-light border-b border-gray-900 pb-8 text-sm md:text-base">
              {product.descricao}
            </p>

            {/* BOTÃO DE AÇÃO CONECTADO */}
            <button 
              onClick={() => addToCart(product)} // 3. AQUI ESTÁ A MÁGICA
              className="w-full bg-white text-black py-5 text-sm font-black uppercase tracking-[0.25em] hover:bg-gray-200 transition-all transform hover:-translate-y-1 mb-8 shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95"
            >
              Adicionar ao Carrinho
            </button>

            {/* Ícones de Confiança */}
            <div className="grid grid-cols-1 gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-4 group cursor-help transition-colors hover:text-gray-300">
                <div className="p-2 bg-gray-900 rounded-full group-hover:bg-white group-hover:text-black transition-colors">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="tracking-wide">Garantia Vitalícia na Prata 925</span>
              </div>
              
              <div className="flex items-center gap-4 group cursor-help transition-colors hover:text-gray-300">
                <div className="p-2 bg-gray-900 rounded-full group-hover:bg-white group-hover:text-black transition-colors">
                   <Truck className="w-5 h-5" />
                </div>
                <span className="tracking-wide">Envio Rápido e Seguro</span>
              </div>
              
              <div className="flex items-center gap-4 group cursor-help transition-colors hover:text-gray-300">
                <div className="p-2 bg-gray-900 rounded-full group-hover:bg-white group-hover:text-black transition-colors">
                  <CreditCard className="w-5 h-5" />
                </div>
                <span className="tracking-wide">Parcelamento em até 10x sem juros</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProductPage;