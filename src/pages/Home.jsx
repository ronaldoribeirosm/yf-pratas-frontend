import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
// REMOVI O IMPORT DO ÍCONE "HOME" AQUI PARA NÃO DAR CONFLITO COM O NOME DA PÁGINA

function Home() {
  // Estado para guardar os produtos que vêm do Banco de Dados
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Efeito que busca os dados assim que o site abre
  useEffect(() => {
    fetch('http://https://yf-pratas-backend.onrender.com/produtos')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar produtos:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Navbar />
      <Hero />

      <main className="container mx-auto px-4 py-16">
        
        {/* Título da Seção */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif text-white mb-2 italic">Destaques da Loja</h2>
          <div className="w-16 h-0.5 bg-gray-700 mx-auto"></div>
        </div>

        {/* Loading ou Grid de Produtos */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-500 animate-pulse">Carregando estoque...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((produto) => (
              <ProductCard key={produto.id} product={produto} />
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-20 text-gray-600">
            Nenhum produto encontrado no sistema.
          </div>
        )}

        <div className="text-center mt-16">
          <button className="border border-white text-white px-8 py-3 text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors font-bold">
            Ver Toda a Loja
          </button>
        </div>

      </main>

      {/* Footer Simples */}
      <footer className="bg-black border-t border-gray-900 py-12 text-center">
        <h3 className="text-xl font-serif font-bold mb-4 italic">YF PRATAS</h3>
        <p className="text-gray-500 text-sm mb-6">Peças legítimas para quem exige qualidade.</p>
        <p className="text-gray-700 text-xs">&copy; 2026 Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default Home;