import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Plus, Edit, Trash2, Search, Package } from 'lucide-react';

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Verifica se é Admin
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.is_admin) {
      alert("Acesso Negado. Área restrita.");
      navigate('/');
    }
  }, [navigate]);

  // Busca os produtos
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    fetch('http://https://yf-pratas-backend.onrender.com/produtos')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  };

  // Função de Excluir
  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este produto? Não tem volta!")) {
      try {
        const res = await fetch(`http://https://yf-pratas-backend.onrender.com/produtos/${id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          alert("Produto deletado!");
          fetchProducts(); // Recarrega a lista
        } else {
          alert("Erro ao deletar.");
        }
      } catch (error) {
        alert("Erro de conexão.");
      }
    }
  };

  // Filtro de busca local
  const filteredProducts = products.filter(p => 
    p.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        
        {/* Cabeçalho do Painel */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold italic">Painel Administrativo</h1>
            <p className="text-gray-500 text-sm">Gerencie o estoque da YF Pratas.</p>
          </div>

          {/* Botão ADICIONAR (Leva para a página de criação que faremos a seguir) */}
          <Link 
            to="/admin/novo-produto" 
            className="bg-white text-black px-6 py-3 font-bold uppercase tracking-widest hover:bg-gray-200 flex items-center gap-2 rounded-sm transition-transform hover:-translate-y-1"
          >
            <Plus size={20} /> Novo Produto
          </Link>
        </div>

        {/* Barra de Busca Rápida */}
        <div className="bg-gray-900/30 p-4 rounded mb-8 border border-gray-800 flex items-center gap-3">
          <Search className="text-gray-500" />
          <input 
            type="text" 
            placeholder="Buscar produto por nome..." 
            className="bg-transparent w-full text-white outline-none placeholder-gray-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* TABELA DE PRODUTOS */}
        <div className="bg-gray-900/20 border border-gray-800 rounded-lg overflow-hidden">
          
          {/* Cabeçalho da Tabela */}
          <div className="grid grid-cols-12 bg-gray-900 p-4 text-xs uppercase tracking-widest text-gray-400 font-bold border-b border-gray-800">
            <div className="col-span-2 md:col-span-1">Img</div>
            <div className="col-span-5 md:col-span-5">Produto</div>
            <div className="col-span-3 md:col-span-2 text-right">Preço</div>
            <div className="col-span-2 md:col-span-2 text-center">Categ.</div>
            <div className="col-span-12 md:col-span-2 mt-2 md:mt-0 text-right">Ações</div>
          </div>

          {/* Lista */}
          {loading ? (
            <div className="p-8 text-center text-gray-500">Carregando estoque...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center text-gray-500">
              <Package size={48} className="mb-4 opacity-50" />
              <p>Nenhum produto encontrado.</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div key={product.id} className="grid grid-cols-12 p-4 items-center border-b border-gray-800 hover:bg-gray-900/40 transition-colors">
                
                {/* Imagem */}
                <div className="col-span-2 md:col-span-1">
                  <img src={product.imagem_url} alt="" className="w-10 h-10 object-cover rounded bg-gray-800" />
                </div>
                
                {/* Nome */}
                <div className="col-span-5 md:col-span-5 font-bold text-sm truncate pr-4">
                  {product.nome}
                </div>
                
                {/* Preço */}
                <div className="col-span-3 md:col-span-2 text-right text-gray-300 text-sm">
                  {Number(product.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>

                {/* Categoria */}
                <div className="col-span-2 md:col-span-2 text-center">
                   <span className="bg-gray-800 text-gray-400 text-[10px] px-2 py-1 rounded uppercase">
                     {product.categoria || 'Geral'}
                   </span>
                </div>

                {/* BOTÕES DE AÇÃO */}
                <div className="col-span-12 md:col-span-2 flex justify-end gap-3 mt-3 md:mt-0">
                  {/* Editar (Link) */}
                  <Link to={`/admin/editar/${product.id}`} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded transition-colors" title="Editar">
                    <Edit size={18} />
                  </Link>
                  
                  {/* Excluir (Botão) */}
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors" 
                    title="Excluir"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;