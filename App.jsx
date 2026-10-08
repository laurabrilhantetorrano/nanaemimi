import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Inicio from './Inicio';
import Login from './Login';
import Cadastro from './Cadastro';
import Produto from './Produto';
import Carrinho from './Carrinho';
import { CarrinhoProvider } from './CarrinhoContext';
import { AuthProvider } from './AuthContext';
import SobreNos from './SobreNos';
import Contato from './Contato';
import MinhaConta from './MinhaConta';
import Footer from './Footer';
import AdminProdutos from './AdminProdutos';

function FooterCondicional() {
  const location = useLocation();

  if (location.pathname === "/login" || location.pathname === "/cadastro") {
    return null;
  }

  return <Footer />;
}

function App() {
  return (
    <AuthProvider>
      <CarrinhoProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/produto/:id" element={<Produto />} />
            <Route path="/carrinho" element={<Carrinho />} />
            <Route path="/minha-conta" element={<MinhaConta />} />
            <Route path="/admin/produtos" element={<AdminProdutos />} />
            <Route path="/sobre-nos" element={<SobreNos />} />
            <Route path="/contato" element={<Contato />} />
          </Routes>
          <FooterCondicional />
        </BrowserRouter>
      </CarrinhoProvider>
    </AuthProvider>
  );
}

export default App;
