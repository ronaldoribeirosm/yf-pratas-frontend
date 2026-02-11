import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { SearchProvider } from './context/SearchContext';

// Componentes Visuais Fixos
import Navbar from './components/Navbar'; 
import SocialFloating from './components/SocialFloating';
import CartSidebar from './components/CartSidebar';
import SearchOverlay from './components/SearchOverlay';

// Importação das Páginas
import Home from './pages/Home';
import ProductPage from './pages/ProductPage';
import CatalogPage from './pages/CatalogPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SecurityPage from './pages/SecurityPage';
import AdminDashboard from './pages/AdminDashboard';
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';
import CheckoutPage from './pages/CheckoutPage'; // <--- Importante estar aqui
import OrdersPage from './pages/OrdersPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import SuccessPage from './pages/SuccessPage';
import AdminProductsPage from './pages/AdminProductsPage';

function App() {
  return (
    <CartProvider>
      <SearchProvider>
        <BrowserRouter>
          
          {/* Componentes Globais (Overlay e Sidebar) */}
          <SocialFloating />
          <CartSidebar />
          <SearchOverlay />
          
          {/* O Navbar pode ficar aqui se quiser que apareça sempre, 
              mas se você já o colocou dentro de cada página, pode remover daqui */}
          {/* <Navbar /> */}

          <Routes>
            {/* --- ROTAS PÚBLICAS --- */}
            <Route path="/" element={<Home />} />
            <Route path="/produto/:id" element={<ProductPage />} />
            <Route path="/catalogo" element={<CatalogPage />} />
            <Route path="/sobre" element={<AboutPage />} />
            
            {/* --- AUTENTICAÇÃO --- */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadastro" element={<RegisterPage />} />

            {/* --- ÁREA ADMIN --- */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/seguranca" element={<SecurityPage />} />
            <Route path="/admin/novo-produto" element={<AddProductPage />} />
            <Route path="/admin/editar/:id" element={<EditProductPage />} />

            {/* --- CHECKOUT E PAGAMENTO --- */}
            <Route path="/checkout" element={<CheckoutPage />} />
            
            {/* --- ROTA DE ERRO (404) --- */}
            {/* Se o usuário digitar algo errado, volta para a Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/meus-pedidos" element={<OrdersPage />} />
            <Route path="/admin/pedidos" element={<AdminOrdersPage />} />
            <Route path="/sucesso" element={<SuccessPage />} />
            <Route path="/admin/produtos" element={<AdminProductsPage />} />
    
            
          </Routes>
        </BrowserRouter>
      </SearchProvider>
    </CartProvider>
  );
}

export default App;