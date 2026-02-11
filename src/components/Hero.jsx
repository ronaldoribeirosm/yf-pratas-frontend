import React from 'react';
// Importamos a logo
import logo from '../assets/logo-yf.jpg';

function Hero() {
  return (
    <div className="relative h-[80vh] min-h-[600px] w-full bg-black flex items-center justify-center text-center overflow-hidden">
      
      {/* Fundo Sutil: Um gradiente muito leve apenas para dar profundidade,
         mas mantendo o preto predominante para a fusão funcionar.
      */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/20 to-black z-0"></div>
      
      {/* Conteúdo Principal */}
      <div className="relative z-10 px-4 w-full flex flex-col items-center justify-center h-full">
        
        {/* Texto Superior */}
        <p className="text-gray-400 text-xs md:text-sm font-sans uppercase tracking-[0.3em] mb-4 opacity-80">
          Joias em prata 925 • Garantia Vitalícia
        </p>
        
        {/* --- A LOGO GIGANTE --- */}
        {/* mix-blend-screen: Faz o preto da imagem sumir e sobrar só o branco.
            h-[300px] md:h-[500px]: Define a altura gigante.
        */}
        <img 
          src={logo} 
          alt="YF Pratas" 
          className="h-[280px] sm:h-[350px] md:h-[580px] w-auto object-contain mix-blend-screen opacity-90 hover:opacity-100 transition-opacity duration-700"
        />
        
        {/* Texto Inferior (Slogan) */}
        <h2 className="text-white text-xl md:text-3xl font-serif italic -mt mb-8 tracking-wide font-light z-20">
          Brilhante como você💎
        </h2>

        {/* Botão de Ação */}
        <button className="bg-white text-black px-10 py-3 md:px-12 md:py-4 text-xs md:text-sm font-bold uppercase tracking-[0.2em] hover:bg-gray-200 transition-all transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] duration-300 z-20">
          Ver Coleção
        </button>
      </div>
    </div>
  );
}

export default Hero;