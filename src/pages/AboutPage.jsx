import React from 'react';
import Navbar from '../components/Navbar';

function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Navbar />

      <div className="container mx-auto px-4 py-16">
        
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 italic">
            Nossa Essência
          </h1>
          <div className="w-24 h-0.5 bg-white mx-auto"></div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-12">
          
          {/* Espaço para Foto do Dono ou da Loja */}
          <div className="md:w-1/2">
            <div className="relative border border-gray-800 p-2">
              <div className="aspect-[3/4] bg-gray-900 overflow-hidden">
                {/* Substitua essa URL pela foto do seu cliente depois */}
                <img 
                  src="https://images.unsplash.com/photo-1555776997-6a707198e79e?q=80&w=1000&auto=format&fit=crop" 
                  alt="Fundador YF Pratas" 
                  className="w-full h-full object-cover opacity-80 hover:opacity-100 transition duration-700"
                />
              </div>
            </div>
          </div>

          {/* Texto Sobre a Marca */}
          <div className="md:w-1/2 text-left space-y-6">
            <h2 className="text-2xl font-bold uppercase tracking-widest text-gray-200">
              Mais que Prata, <br/> Um Estilo de Vida.
            </h2>
            
            <p className="text-gray-400 leading-relaxed font-light">
              A YF Pratas nasceu com o propósito de trazer peças autênticas para quem tem personalidade. 
              Não vendemos apenas acessórios; entregamos autoestima e postura através da Prata 925 legítima.
            </p>

            <p className="text-gray-400 leading-relaxed font-light">
              Nossa curadoria é feita pensando no estilo urbano e na durabilidade eterna do metal nobre. 
              Cada corrente, cada pulseira carrega a garantia de qualidade e o compromisso com nossos clientes.
            </p>

            <div className="pt-6 border-t border-gray-900 mt-8">
              <p className="text-white text-sm font-bold uppercase tracking-widest">
                — Fundador YF Pratas
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AboutPage;