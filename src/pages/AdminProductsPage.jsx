import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { PackagePlus, Upload, CheckCircle } from 'lucide-react';

function AdminProductsPage() {
  const [formData, setFormData] = useState({
    nome: '', descricao: '', preco: '', categoria: '', estoque: '', imagem: null
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    setFormData(prev => ({ ...prev, imagem: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');

    // Prepara o formulário para envio com arquivo (Multipart)
    const data = new FormData();
    data.append('nome', formData.nome);
    data.append('descricao', formData.descricao);
    data.append('preco', formData.preco);
    data.append('categoria', formData.categoria);
    data.append('estoque', formData.estoque);
    if (formData.imagem) data.append('imagem', formData.imagem);

    try {
        const res = await fetch('https://yf-pratas-backend.onrender.com/produtos', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }, // Token para segurança
            body: data
        });

        if (res.ok) {
            alert("✅ Produto cadastrado com sucesso!");
            setFormData({ nome: '', descricao: '', preco: '', categoria: '', estoque: '', imagem: null });
        } else {
            alert("Erro ao cadastrar.");
        }
    } catch (error) {
        console.error(error);
        alert("Erro de conexão.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-20">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold uppercase tracking-widest flex items-center gap-3 mb-8">
            <PackagePlus className="text-yellow-500" /> Cadastrar Produto
        </h1>

        <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-lg border border-gray-800 space-y-6">
            
            {/* Upload de Imagem */}
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-yellow-500 transition-colors cursor-pointer relative">
                <input type="file" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                <div className="flex flex-col items-center gap-2">
                    <Upload size={32} className="text-gray-400" />
                    <p className="text-sm text-gray-400">
                        {formData.imagem ? `Arquivo: ${formData.imagem.name}` : "Clique para enviar a foto do produto"}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs uppercase font-bold text-gray-500">Nome do Produto</label>
                    <input name="nome" value={formData.nome} onChange={handleChange} required className="w-full bg-black border border-gray-700 p-3 rounded text-white focus:border-yellow-500 outline-none" placeholder="Ex: Corrente de Prata 925" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs uppercase font-bold text-gray-500">Categoria</label>
                    <input name="categoria" value={formData.categoria} onChange={handleChange} required className="w-full bg-black border border-gray-700 p-3 rounded text-white focus:border-yellow-500 outline-none" placeholder="Ex: Colares" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs uppercase font-bold text-gray-500">Descrição</label>
                <textarea name="descricao" value={formData.descricao} onChange={handleChange} required rows="3" className="w-full bg-black border border-gray-700 p-3 rounded text-white focus:border-yellow-500 outline-none" placeholder="Detalhes da peça..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs uppercase font-bold text-gray-500">Preço (R$)</label>
                    <input name="preco" type="number" step="0.01" value={formData.preco} onChange={handleChange} required className="w-full bg-black border border-gray-700 p-3 rounded text-white focus:border-yellow-500 outline-none" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs uppercase font-bold text-gray-500">Estoque (Qtd)</label>
                    <input name="estoque" type="number" value={formData.estoque} onChange={handleChange} required className="w-full bg-black border border-gray-700 p-3 rounded text-white focus:border-yellow-500 outline-none" placeholder="10" />
                </div>
            </div>

            <button disabled={loading} className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 rounded uppercase tracking-widest transition-all mt-4 flex justify-center items-center gap-2">
                {loading ? 'Salvando...' : 'Cadastrar Produto'} {!loading && <CheckCircle size={20} />}
            </button>
        </form>
      </div>
    </div>
  );
}

export default AdminProductsPage;