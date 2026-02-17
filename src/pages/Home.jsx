import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  useEffect(() => {
    fetch('https://yf-pratas-backend.onrender.com/produtos')
      .then(res => res.json())
      .then(data => {
        // Você pode até inverter a ordem para mostrar os recém-adicionados usando data.reverse()
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

      <main id="destaques" className="container mx-auto px-4 py-16">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif text-white mb-2 italic">Destaques da Loja</h2>
          <div className="w-16 h-0.5 bg-gray-700 mx-auto"></div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-500 animate-pulse">Carregando estoque...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {/* 🚀 A MÁGICA AQUI: .slice(0, 4) garante que só vão aparecer 4 produtos no máximo! */}
            {products.slice(0, 4).map((produto) => (
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
          <button 
            onClick={() => navigate('/catalogo')}
            className="border border-white text-white px-8 py-3 text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors font-bold"
          >
            Ver Toda a Loja
          </button>
        </div>

      </main>

      <footer className="bg-black border-t border-gray-900 py-12 text-center">
        <h3 className="text-xl font-serif font-bold mb-4 italic">YF PRATAS</h3>
        <p className="text-gray-500 text-sm mb-6">Peças legítimas para quem exige qualidade.</p>
        <p className="text-gray-700 text-xs">&copy; 2026 Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default Home;