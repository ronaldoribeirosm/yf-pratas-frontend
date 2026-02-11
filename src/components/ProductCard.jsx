import React from 'react';
import { Link } from 'react-router-dom'; // Importante!

function ProductCard({ product }) {
  const formatMoney = (value) => {
    return parseFloat(value).toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  };

  return (
    // Transformamos o Card inteiro em um Link
    <Link to={`/produto/${product.id}`} className="block h-full">
      <div className="bg-black border border-gray-800 rounded-sm hover:border-gray-500 transition-colors duration-300 overflow-hidden flex flex-col h-full group">
        {/* Imagem */}
        <div className="h-64 overflow-hidden relative">
          <img 
            src={product.imagem_url} 
            alt={product.nome} 
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          />
          {product.destaque && (
            <span className="absolute top-2 left-2 bg-white text-black text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
              Destaque
            </span>
          )}
        </div>

        {/* Informações */}
        <div className="p-4 flex flex-col flex-grow">
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">
            {product.categoria || 'Joia'}
          </p>
          <h3 className="text-lg font-serif text-white mb-2 line-clamp-2 group-hover:underline decoration-1 underline-offset-4">
            {product.nome}
          </h3>
          
          <div className="mt-auto pt-4 flex items-center justify-between">
            <span className="text-lg font-light text-gray-200">
              {formatMoney(product.preco)}
            </span>
            <span className="text-xs text-gray-400 border border-gray-700 px-3 py-1 uppercase hover:bg-white hover:text-black transition-colors">
              Ver
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;