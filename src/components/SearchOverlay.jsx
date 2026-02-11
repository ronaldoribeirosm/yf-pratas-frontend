import React, { useState, useEffect, useRef } from 'react';
import { X, Search, ArrowRight } from 'lucide-react';
import { useSearch } from '../context/SearchContext';
import { Link } from 'react-router-dom';

function SearchOverlay() {
  const { isSearchOpen, setIsSearchOpen } = useSearch();
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const inputRef = useRef(null);

  // 1. Busca os produtos no banco quando abre a pesquisa
  useEffect(() => {
    if (isSearchOpen) {
      fetch('http://localhost:3000/produtos')
        .then(res => res.json())
        .then(data => setProducts(data))
        .catch(err => console.error(err));
      
      // Foca no input automaticamente
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  // 2. Filtra enquanto digita
  useEffect(() => {
    if (query.trim() === '') {
      setFilteredProducts([]);
    } else {
      const results = products.filter(product => 
        product.nome.toLowerCase().includes(query.toLowerCase()) || 
        product.categoria.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(results);
    }
  }, [query, products]);

  // Fecha se não estiver aberto
  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/95 backdrop-blur-md animate-fade-in flex flex-col">
      
      {/* Botão Fechar */}
      <div className="absolute top-6 right-6">
        <button 
          onClick={() => setIsSearchOpen(false)}
          className="text-gray-400 hover:text-white transition-transform hover:rotate-90"
        >
          <X size={32} />
        </button>
      </div>

      <div className="container mx-auto px-1 mt-12 max-w-4xl">
        
        {/* Campo de Digitação Gigante */}
        <div className="relative border-b-2 border-gray-800 focus-within:border-white transition-colors duration-500">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-500 w-8 h-8" />
          <input
            ref={inputRef}
            type="text"
            placeholder="O que você procura? (Ex: Corrente, Anel...)"
            className="w-full bg-transparent text-3xl md:text-5xl font-bold text-white py-6 pl-12 focus:outline-none placeholder-gray-800 uppercase font-sans tracking-tight"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Resultados */}
        <div className="mt-12 overflow-y-auto max-h-[60vh] pb-20">
          
          {query && filteredProducts.length === 0 && (
            <p className="text-gray-500 text-lg">Nenhum resultado encontrado para "{query}".</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProducts.map(product => (
              <Link 
                key={product.id} 
                to={`/produto/${product.id}`}
                onClick={() => setIsSearchOpen(false)} // Fecha ao clicar
                className="flex items-center gap-4 bg-gray-900/50 p-4 rounded border border-gray-800 hover:bg-gray-800 hover:border-gray-600 transition-all group"
              >
                <img 
                  src={product.imagem_url} 
                  alt={product.nome} 
                  className="w-16 h-16 object-cover rounded-sm"
                />
                <div className="flex-1">
                  <h4 className="text-white font-bold uppercase text-sm group-hover:text-gray-200">{product.nome}</h4>
                  <p className="text-gray-500 text-xs mt-1">{product.categoria}</p>
                  <p className="text-white font-light text-sm mt-1">
                    {Number(product.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                </div>
                <ArrowRight className="text-gray-600 group-hover:text-white transition-colors" />
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default SearchOverlay;