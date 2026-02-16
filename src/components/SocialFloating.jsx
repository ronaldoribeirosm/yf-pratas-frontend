import React from 'react';

function SocialFloating() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      
      {/* Instagram */}
      <a 
        href="https://www.instagram.com/yfpratas__ofc?igsh=MWtsOWJ6enVmYThjag==" 
        target="_blank" 
        rel="noopener noreferrer"
        className="bg-black text-white p-3 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:scale-110 transition-transform duration-300 flex items-center justify-center border border-gray-800"
        title="Siga no Instagram"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      </a>

      {/* WhatsApp */}
      <a 
        href="https://wa.me/5512996212457" // Coloque seu número aqui
        target="_blank" 
        rel="noopener noreferrer"
        className="bg-black text-white p-3 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:scale-110 transition-transform duration-300 flex items-center justify-center border border-gray-800"
        title="Fale no WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
      </a>

    </div>
  );
}

export default SocialFloating;