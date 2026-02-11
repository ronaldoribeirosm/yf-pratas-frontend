import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';

function CatalogPage() {
  const [products, setProducts] = useState([]); // Todos os produtos
  const [filteredProducts, setFilteredProducts] = useState([]); // Produtos visíveis
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Todos');

  // Categorias para os botões de filtro
  const categories = ["Todos", "Anéis", "Colares", "Pulseiras", "Kits"];

  // 1. Busca TUDO do banco ao carregar
  useEffect(() => {
    fetch('http://localhost:3000/produtos')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setFilteredProducts(data); // Começa mostrando tudo
        setLoading(false);
      })
      .catch(err => console.error("Erro:", err));
  }, []);

  // 2. Função que filtra quando clica no botão
  const handleFilter = (category) => {
    setActiveFilter(category);
    if (category === 'Todos') {
      setFilteredProducts(products);
    } else {
      // Filtra onde a categoria do produto CONTÉM o nome do botão
      // Ex: "Pulseira de Prata" contém "Pulseira"
      const filtered = products.filter(p => 
        p.categoria && p.categoria.toLowerCase().includes(category.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        
        {/* Cabeçalho da Página */}
        <h1 className="text-4xl font-serif font-bold text-center mb-8 italic">
          Coleção Completa
        </h1>

        {/* --- BARRA DE FILTROS --- */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilter(cat)}
              className={`px-6 py-2 text-xs uppercase tracking-widest font-bold border transition-all duration-300
                ${activeFilter === cat 
                  ? 'bg-white text-black border-white' 
                  : 'bg-transparent text-gray-400 border-gray-800 hover:border-gray-500 hover:text-white'}
              `}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* --- GRID DE PRODUTOS --- */}
        {loading ? (
          <div className="text-center py-20 animate-pulse">Carregando catálogo...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredProducts.map((produto) => (
                <ProductCard key={produto.id} product={produto} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20 text-gray-500">
                Nenhum produto encontrado nesta categoria.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CatalogPage;