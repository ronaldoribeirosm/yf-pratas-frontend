import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Save, ArrowLeft, UploadCloud, RefreshCw } from 'lucide-react';

function EditProductPage() {
  const { id } = useParams(); // Pega o ID da URL
  const navigate = useNavigate();
  
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [categoria, setCategoria] = useState('Anéis');
  const [descricao, setDescricao] = useState('');
  const [estoque, setEstoque] = useState(10);
  
  // Imagem
  const [currentImageUrl, setCurrentImageUrl] = useState(''); // URL que já existe
  const [newImageFile, setNewImageFile] = useState(null); // Novo arquivo (se houver)
  const [preview, setPreview] = useState(null); // Preview do novo arquivo

  const [loading, setLoading] = useState(true);

  // 1. Busca os dados atuais ao abrir a página
  useEffect(() => {
    fetch(`https://yf-pratas-backend.onrender.com/produtos/${id}`)
      .then(res => res.json())
      .then(data => {
        setNome(data.nome);
        setPreco(data.preco);
        setCategoria(data.categoria);
        setDescricao(data.descricao);
        setEstoque(data.estoque);
        setCurrentImageUrl(data.imagem_url);
        setLoading(false);
      })
      .catch(err => alert("Erro ao carregar produto."));
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('preco', preco);
    formData.append('categoria', categoria);
    formData.append('descricao', descricao);
    formData.append('estoque', estoque);
    
    // Só anexa arquivo se o usuário escolheu um novo. 
    // Se não, o backend mantém o antigo.
    if (newImageFile) {
      formData.append('imagem', newImageFile);
    }

    try {
      const response = await fetch(`https://yf-pratas-backend.onrender.com/produtos/${id}`, {
        method: 'PUT', // Usamos PUT para atualizar
        body: formData 
      });

      if (response.ok) {
        alert("Produto atualizado com sucesso!");
        navigate('/admin');
      } else {
        alert("Erro ao atualizar.");
      }
    } catch (error) {
      alert("Erro de conexão.");
    }
  };

  if (loading) return <div className="text-white text-center py-20">Carregando dados...</div>;

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <button onClick={() => navigate('/admin')} className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Voltar ao Painel
        </button>

        <div className="max-w-2xl mx-auto bg-gray-900/20 border border-gray-800 p-8 rounded-lg">
          <h1 className="text-3xl font-bold mb-8 uppercase tracking-widest border-b border-gray-800 pb-4 flex items-center gap-3">
             Editar Produto
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Nome */}
            <div>
              <label className="block text-xs uppercase font-bold text-gray-500 mb-2">Nome</label>
              <input 
                type="text" 
                required
                className="w-full bg-black border border-gray-700 text-white p-3 rounded focus:border-white outline-none"
                value={nome}
                onChange={e => setNome(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Preço */}
              <div>
                <label className="block text-xs uppercase font-bold text-gray-500 mb-2">Preço (R$)</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  className="w-full bg-black border border-gray-700 text-white p-3 rounded focus:border-white outline-none"
                  value={preco}
                  onChange={e => setPreco(e.target.value)}
                />
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-xs uppercase font-bold text-gray-500 mb-2">Categoria</label>
                <select 
                  className="w-full bg-black border border-gray-700 text-white p-3 rounded focus:border-white outline-none"
                  value={categoria}
                  onChange={e => setCategoria(e.target.value)}
                >
                  <option value="Anéis">Anéis</option>
                  <option value="Colares">Colares</option>
                  <option value="Pulseiras">Pulseiras</option>
                  <option value="Kits">Kits</option>
                  <option value="Masculino">Masculino</option>
                </select>
              </div>
            </div>

            {/* --- ÁREA DE IMAGEM --- */}
            <div className="bg-gray-800/30 p-4 rounded border border-gray-700">
              <label className="block text-xs uppercase font-bold text-gray-500 mb-4">Imagem do Produto</label>
              
              <div className="flex gap-6 items-center">
                {/* Imagem Atual/Preview */}
                <div className="w-24 h-24 bg-gray-900 rounded overflow-hidden border border-gray-600 flex-shrink-0">
                  <img 
                    src={preview || currentImageUrl} 
                    alt="Produto" 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Input para trocar */}
                <div className="flex-1">
                    <p className="text-sm text-gray-300 mb-2">
                        {newImageFile ? 'Nova imagem selecionada' : 'Usando imagem atual'}
                    </p>
                    <label className="cursor-pointer bg-gray-700 hover:bg-white hover:text-black text-white px-4 py-2 rounded text-sm inline-flex items-center gap-2 transition-colors">
                        <UploadCloud size={16} /> Trocar Foto
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                </div>
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-xs uppercase font-bold text-gray-500 mb-2">Descrição</label>
              <textarea 
                rows="4"
                className="w-full bg-black border border-gray-700 text-white p-3 rounded focus:border-white outline-none"
                value={descricao}
                onChange={e => setDescricao(e.target.value)}
              ></textarea>
            </div>

            {/* Botão Salvar */}
            <button 
              type="submit" 
              className="w-full bg-white text-black py-4 font-bold uppercase tracking-widest hover:bg-gray-200 flex justify-center items-center gap-2 rounded transition-transform active:scale-95"
            >
              <Save size={20} /> Salvar Alterações
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProductPage;