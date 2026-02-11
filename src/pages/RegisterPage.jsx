import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Adicionado useNavigate
import Navbar from '../components/Navbar';
import { ArrowRight, Mail, Lock, User } from 'lucide-react';

function RegisterPage() {
  const [formData, setFormData] = useState({ nome: '', email: '', password: '' });
  const [loading, setLoading] = useState(false); // Estado para travar o botão
  const navigate = useNavigate(); // Hook para redirecionar

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Trava o botão

    try {
      // Envia os dados para o Back-end
      const response = await fetch('http://https://yf-pratas-backend.onrender.com/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Sucesso!
        alert("Conta criada com sucesso! Faça login para continuar.");
        navigate('/login'); // Manda para a tela de login
      } else {
        // Erro (Ex: Email já existe)
        alert(data.error || "Ocorreu um erro ao criar a conta.");
      }
    } catch (error) {
      console.error("Erro de conexão:", error);
      alert("Erro ao conectar com o servidor. Verifique se o backend está rodando.");
    } finally {
      setLoading(false); // Destrava o botão
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] py-12 px-4">
        
        <div className="w-full max-w-md space-y-8 bg-gray-900/20 p-8 border border-gray-800 rounded-lg backdrop-blur-sm shadow-[0_0_50px_rgba(255,255,255,0.05)]">
          
          <div className="text-center">
            <h1 className="text-3xl font-bold uppercase tracking-widest mb-2">Criar Conta</h1>
            <p className="text-gray-500 text-sm">Junte-se ao clube YF Pratas.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Nome */}
            <div className="space-y-2">
              <label className="text-xs uppercase font-bold tracking-widest text-gray-400">Nome Completo</label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-white transition-colors" />
                <input 
                  type="text" 
                  required
                  className="w-full bg-black border border-gray-800 text-white p-4 pl-12 focus:outline-none focus:border-white focus:bg-gray-900 transition-all"
                  placeholder="Seu Nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs uppercase font-bold tracking-widest text-gray-400">Email</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-white transition-colors" />
                <input 
                  type="email" 
                  required
                  className="w-full bg-black border border-gray-800 text-white p-4 pl-12 focus:outline-none focus:border-white focus:bg-gray-900 transition-all"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            {/* Senha */}
            <div className="space-y-2">
              <label className="text-xs uppercase font-bold tracking-widest text-gray-400">Senha</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-white transition-colors" />
                <input 
                  type="password" 
                  required
                  className="w-full bg-black border border-gray-800 text-white p-4 pl-12 focus:outline-none focus:border-white focus:bg-gray-900 transition-all"
                  placeholder="Crie uma senha forte"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full bg-white text-black py-4 font-bold uppercase tracking-widest hover:bg-gray-200 flex justify-center items-center gap-2 transition-transform active:scale-95 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Criando Conta...' : (
                <>Cadastrar <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="text-center pt-4 border-t border-gray-800">
            <p className="text-gray-500 text-sm">
              Já tem conta? <Link to="/login" className="text-white font-bold hover:underline uppercase transition-colors">Fazer Login</Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default RegisterPage;