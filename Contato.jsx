import React from "react";
import { Phone, MapPin, Mail, Clock, Instagram } from "lucide-react";
import Navbar from "./Navbar";
import "./Contato.css";

export default function Contato() {
  return (
    <div className="app">
      <Navbar />
      <main className="contato-container">
        <div className="contato-conteudo-central">
          <h1>Contato</h1>
          <div className="contato-texto">
            <p>Tem dúvidas sobre tamanhos, trocas, prazos de entrega ou quer saber mais sobre nossa coleção? Estamos sempre prontas para ajudar você com todo o carinho que a sua família merece!</p>
            <p>Adoramos conversar com quem compartilha do nosso amor pela moda infantil. Entre em contato conosco através dos canais abaixo:</p>
          </div>
          <div className="info-cards-central">
            <div className="card-item-central"><Phone size={22} /><div><strong>WhatsApp</strong><p>(19) 99572-9704</p></div></div>
            <div className="card-item-central"><Mail size={22} /><div><strong>E-mail</strong><p>nanaemimimodainfantil@gmail.com</p></div></div>
            <div className="card-item-central"><Instagram size={22} /><div><strong>Instagram</strong><p>@nanaemimimodainfantil</p></div></div>
            <div className="card-item-central"><Clock size={22} /><div><strong>Horário de Atendimento</strong><p>Segunda a Sábado, das 9h às 17h</p></div></div>
            <div className="card-item-central"><MapPin size={22} /><div><strong>Localização</strong><p>Rua José Ramos Catarino 396 Pq Tropical - Campinas/SP</p></div></div>
          </div>
        </div>
      </main>
    </div>
  );
}
