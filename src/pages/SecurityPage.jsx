import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { ShieldCheck, Mail, Lock } from 'lucide-react';

function SecurityPage() {
  const [enabled, setEnabled] = useState(false);
  
  // Pega dados do usuário
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleEnable2FA = async () => {
    try {
      const res = await fetch('https://yf-pratas-backend.onrender.com/auth/2fa/enable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      });
      
      if (res.ok) {
        alert("Segurança ativada! No próximo login pediremos um código por e-mail.");
        // Atualiza localstorage para refletir a mudança
        const updatedUser = { ...user, two_factor_enabled: true };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setEnabled(true); // Atualiza visual
      } else {
        alert("Erro ao ativar.");
      }
    } catch (err) {
      alert("Erro de conexão.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="w-full max-w-lg bg-gray-900/30 border border-gray-800 p-8 rounded-lg text-center">
          
          <div className="flex justify-center mb-6">
            <div className="bg-gray-800 p-4 rounded-full">
                <Mail className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold uppercase tracking-widest mb-2">Segurança por E-mail</h1>
          <p className="text-gray-500 mb-8">Autenticação de Dois Fatores (2FA)</p>

          <div className="animate-fade-in">
            <p className="text-gray-400 mb-8 leading-relaxed">
              Ao ativar, enviaremos um código de 6 dígitos para <strong>{user.email}</strong> toda vez que você tentar entrar no painel Admin.
            </p>

            {user.two_factor_enabled || enabled ? (
               <div className="bg-green-900/20 border border-green-800 p-6 rounded flex flex-col items-center gap-3">
                  <ShieldCheck size={40} className="text-green-500" />
                  <span className="text-green-400 font-bold uppercase tracking-widest">Proteção Ativada</span>
                  <p className="text-xs text-gray-400">Sua conta está blindada.</p>
               </div>
            ) : (
              <button 
                onClick={handleEnable2FA}
                className="w-full bg-white text-black py-4 font-bold uppercase tracking-widest hover:bg-gray-200 transition shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                Ativar Agora
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default SecurityPage;