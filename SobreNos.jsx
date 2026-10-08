import React from "react";
import imagemDona from "./assets/fotodona.jpg";
import Navbar from "./Navbar";
import "./SobreNos.css";

export default function SobreNos() {
  return (
    <div className="app">
      <Navbar />
      <main className="sobre-container">
        <h1>Sobre a Nana&Mimi</h1>
        <div className="sobre-conteudo">
          <div className="sobre-texto">
            <p>A Nana&Mimi nasceu de um sonho que começou no coração de Flavia Mendes: o desejo de empreender, criar algo especial e transformar sua paixão em uma marca capaz de fazer parte de momentos importantes da infância.</p>
            <p>Somos uma marca de moda infantil criada para vestir crianças de 4 a 12 anos com estilo, conforto e personalidade. Nossa proposta é trazer uma moda infantil moderna, leve e atual, com peças pensadas para acompanhar as crianças em diferentes momentos do dia.</p>
            <p>Acreditamos que as roupas infantis precisam ir além da beleza. Elas devem permitir que a criança brinque, se movimente, explore e seja criança, sem abrir mão de um visual bonito e cheio de estilo.</p>
            <p>Na Nana&Mimi, cada detalhe é pensado para oferecer uma experiência especial às famílias. Valorizamos um atendimento próximo e atencioso. Além disso, trabalhamos para oferecer preços acessíveis, tornando a moda infantil moderna e de qualidade mais próxima das famílias.</p>
            <p>Hoje somos muito mais do que uma loja de roupas infantis. Representa um sonho que ganhou forma e continua sendo construído todos os dias com carinho, propósito e compromisso com nossos clientes.</p>
            <p>Queremos estar presentes em cada fase, em cada descoberta e em cada momento especial da infância, oferecendo roupas que combinam com a alegria, a espontaneidade e a personalidade de cada criança.</p>
          </div>
          <div className="sobre-imagem">
            <img src={imagemDona} alt="Nana&Mimi Moda Infantil" />
          </div>
        </div>
      </main>
    </div>
  );
}
