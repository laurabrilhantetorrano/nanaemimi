import "./Footer.css";
import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-conteudo">

        <div className="footer-marca">
          <h2>Nana e Mimi</h2>
          <span>MODA INFANTIL</span>
          <p>Estilo para os pequenos, conforto para viver cada momento.</p>
        </div>

        <nav className="footer-links">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span>Início</span>
          </Link>
          <Link to="/sobre-nos" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span>Sobre nós</span>
          </Link>
          <Link to="/contato" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span>Contato</span>
          </Link>
        </nav>

      </div>
    </footer>
  );
}

export default Footer;