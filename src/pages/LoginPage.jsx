import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ArrowRight, ShieldAlert } from 'lucide-react';
import { useCart } from '../context/CartContext'; 

function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '', code: '' });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { clearCart } = useCart(); 

  // --- TRAVA DE SEGURANÇA 1: LIMPEZA TOTAL AO ABRIR ---
  useEffect(() => {
    // Se o usuário entrou nesta tela, matamos a sessão anterior
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    clearCart(); // Limpa os itens do carrinho da memória
    console.log("🧹 Sessão limpa automaticamente.");
  }, []);
  // ----------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://https://yf-pratas-backend.onrender.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Passo 1: Verifica se precisa de 2FA
        if (data.require2fa) {
          setStep(2);
          setLoading(false);
          alert("Código enviado para o seu e-mail! Verifique sua caixa de entrada.");
          return;
        }

        // Passo 2: Login com Sucesso
        // Salva o Token
        localStorage.setItem('token', data.token);
        
        // IMPORTANTE: Salva os dados do usuário (incluindo se é admin)
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirecionamento
        if (data.user.is_admin) {
           // Se for admin, vai direto pro painel
           window.location.href = '/admin/pedidos';
        } else {
           // Se for cliente, vai pra home e recarrega para atualizar a navbar
           window.location.href = '/'; 
        }

      } else {
        alert(data.error || "Erro ao entrar.");
      }

    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Navbar />
      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Lado Esquerdo */}
        <div className="hidden lg:block w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000&auto=format&fit=crop" 
            alt="Login Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-20 left-10 z-20 max-w-md">
            <h2 className="text-4xl font-serif font-bold mb-4 italic">
              {step === 1 ? 'Bem-vindo de volta.' : 'Verifique seu E-mail.'}
            </h2>
          </div>
        </div>

        {/* Lado Direito */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-black">
          <div className="w-full max-w-md space-y-8 animate-fade-in">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl font-bold uppercase tracking-widest mb-2">
                {step === 1 ? 'Login' : 'Código de Acesso'}
              </h1>
              <p className="text-gray-500 text-sm">
                {step === 1 ? 'Entre com suas credenciais.' : 'Olhe sua caixa de entrada (e SPAM).'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-bold tracking-widest text-gray-400">Email</label>
                    <input 
                      type="email" 
                      required
                      className="w-full bg-gray-900 border border-gray-800 text-white p-4 focus:outline-none focus:border-white transition-colors"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-bold tracking-widest text-gray-400">Senha</label>
                    <input 
                      type="password" 
                      required
                      className="w-full bg-gray-900 border border-gray-800 text-white p-4 focus:outline-none focus:border-white transition-colors"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                </>
              )}

              {step === 2 && (
                <div className="space-y-4 animate-slide-in">
                  <div className="flex justify-center mb-2">
                    <ShieldAlert className="w-12 h-12 text-yellow-500" />
                  </div>
                  <label className="text-xs uppercase font-bold tracking-widest text-gray-400 text-center block">
                    Código do Email
                  </label>
                  <input 
                    type="text" 
                    required
                    maxLength="6"
                    autoFocus
                    className="w-full bg-black border border-gray-700 text-white text-3xl tracking-[0.5em] text-center p-4 rounded focus:border-yellow-500 outline-none transition-colors"
                    placeholder="000000"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                  />
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full bg-white text-black py-4 font-bold uppercase tracking-widest hover:bg-gray-200 flex justify-center items-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Processando...' : (step === 1 ? 'Entrar' : 'Confirmar')} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            
            {step === 1 && (
                <div className="text-center pt-4 border-t border-gray-900">
                  <p className="text-gray-500 text-sm">Sem conta? <Link to="/cadastro" className="text-white font-bold underline ml-1 hover:text-gray-300">CADASTRAR</Link></p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;