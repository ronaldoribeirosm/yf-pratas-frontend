import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Save, ArrowLeft, UploadCloud } from 'lucide-react';

function AddProductPage() {
  const navigate = useNavigate();
  
  // Estados separados agora
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [categoria, setCategoria] = useState('Anéis');
  const [descricao, setDescricao] = useState('');
  const [estoque, setEstoque] = useState(10);
  
  // Estado para o Arquivo de Imagem
  const [imagemFile, setImagemFile] = useState(null);
  const [preview, setPreview] = useState(null); // Para mostrar a foto antes de enviar

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagemFile(file);
      setPreview(URL.createObjectURL(file)); // Cria um link temporário para preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imagemFile) {
      alert("Por favor, selecione uma imagem.");
      return;
    }

    // Para enviar arquivos, usamos FormData em vez de JSON
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('preco', preco);
    formData.append('categoria', categoria);
    formData.append('descricao', descricao);
    formData.append('estoque', estoque);
    formData.append('imagem', imagemFile); // Aqui vai o arquivo real

    try {
      const response = await fetch('http://https://yf-pratas-backend.onrender.com/produtos', {
        method: 'POST',
        // Não precisamos setar Content-Type, o navegador faz isso sozinho com FormData
        body: formData 
      });

      if (response.ok) {
        alert("Produto cadastrado com sucesso!");
        navigate('/admin');
      } else {
        alert("Erro ao cadastrar.");
      }
    } catch (error) {
      alert("Erro de conexão.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <button onClick={() => navigate('/admin')} className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Voltar ao Painel
        </button>

        <div className="max-w-2xl mx-auto bg-gray-900/20 border border-gray-800 p-8 rounded-lg">
          <h1 className="text-3xl font-bold mb-8 uppercase tracking-widest border-b border-gray-800 pb-4">
            Novo Produto (Upload)
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Nome */}
            <div>
              <label className="block text-xs uppercase font-bold text-gray-500 mb-2">Nome do Produto</label>
              <input 
                type="text" 
                required
                className="w-full bg-black border border-gray-700 text-white p-3 rounded focus:border-white outline-none"
                placeholder="Ex: Corrente de Prata 70cm"
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
                  placeholder="299.90"
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

            {/* --- ÁREA DE UPLOAD --- */}
            <div>
              <label className="block text-xs uppercase font-bold text-gray-500 mb-2">Foto do Produto</label>
              
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-white transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                {preview ? (
                   <img src={preview} alt="Preview" className="h-40 mx-auto object-contain rounded" />
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <UploadCloud size={40} className="mb-2" />
                    <span className="text-sm font-bold">Clique para enviar uma foto</span>
                    <span className="text-xs">JPG, PNG ou WebP</span>
                  </div>
                )}
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-xs uppercase font-bold text-gray-500 mb-2">Descrição Detalhada</label>
              <textarea 
                rows="4"
                className="w-full bg-black border border-gray-700 text-white p-3 rounded focus:border-white outline-none"
                placeholder="Fale sobre o material, tamanho e detalhes..."
                value={descricao}
                onChange={e => setDescricao(e.target.value)}
              ></textarea>
            </div>

            {/* Botão Salvar */}
            <button 
              type="submit" 
              className="w-full bg-white text-black py-4 font-bold uppercase tracking-widest hover:bg-gray-200 flex justify-center items-center gap-2 rounded transition-transform active:scale-95"
            >
              <Save size={20} /> Salvar Produto
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProductPage;