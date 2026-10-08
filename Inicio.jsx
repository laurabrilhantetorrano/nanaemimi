import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Link, useSearchParams } from "react-router-dom";
import "swiper/css";
import React, { useEffect, useState } from "react";
import "./Inicio.css";
import { apiFetch, formatarPreco, normalizarImagem } from "./api";

import slider1 from "./assets/slider1.png";
import slider2 from "./assets/slider2.png";
import Navbar from "./Navbar";

export default function Inicio() {
  const [searchParams] = useSearchParams();
  const termoBusca = searchParams.get("busca") || "";
  const [produtos, setProdutos] = useState([]);
  const [carregandoProdutos, setCarregandoProdutos] = useState(true);
  const [erroProdutos, setErroProdutos] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarProdutos() {
      try {
        setCarregandoProdutos(true);
        const data = await apiFetch("/products");

        if (ativo) {
          setProdutos(
            (data || []).map((produto) => ({
              ...produto,
              id: Number(produto.id),
              preco: Number(produto.preco),
              preco_antigo:
                produto.preco_antigo == null
                  ? null
                  : Number(produto.preco_antigo),
              imagem: normalizarImagem(produto.imagem),
            }))
          );
          setErroProdutos("");
        }
      } catch (erro) {
        console.error(erro);
        if (ativo) setErroProdutos("Não foi possível carregar os produtos.");
      } finally {
        if (ativo) setCarregandoProdutos(false);
      }
    }

    carregarProdutos();

    return () => {
      ativo = false;
    };
  }, []);


  const normalizarBusca = (texto) =>
    String(texto || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const termoNormalizado = normalizarBusca(termoBusca);

  const produtosFiltrados = produtos.filter((produto) => {
    const campos = [produto.nome, produto.categoria, produto.descricao, produto.cor];
    return campos.some((campo) => normalizarBusca(campo).includes(termoNormalizado));
  });

  const renderCard = (item) => (
    <div key={item.id} className="card-wrapper">
      <Link to={`/produto/${item.id}`} className="card-link">
        <div className="card">
          {item.imagem ? (
            <img src={item.imagem} alt={item.nome} />
          ) : (
            <div className="imagem-sem-produto">Imagem indisponível</div>
          )}

          <p className="nome">{item.nome}</p>

          <p className="preco-antigo">
            {item.preco_antigo ? (
              <del>{formatarPreco(item.preco_antigo)}</del>
            ) : null}
          </p>

          <p className="preco">{formatarPreco(item.preco)}</p>
        </div>
      </Link>
    </div>
  );

  return (
    <div className="app">
      <Navbar />

      <div className="banner">
        <Swiper
          modules={[Autoplay]}
          slidesPerView={1}
          autoplay={{ delay: 3000 }}
          loop
        >
          <SwiperSlide>
            <img src={slider1} alt="Moda Nana & Mimi" />
          </SwiperSlide>

          <SwiperSlide>
            <img src={slider2} alt="Moda Nana & Mimi" />
          </SwiperSlide>
        </Swiper>
      </div>

      <div className="info-barra">
        <div>💳 Parcele em até 12x</div>
        <div>🚛 Frete grátis acima de R$199</div>
        <div>🛡️ Site seguro</div>
        <div>🎯 Produto de qualidade</div>
      </div>

      {carregandoProdutos ? (
        <p className="mensagem-produtos">Carregando produtos...</p>
      ) : erroProdutos ? (
        <p className="mensagem-produtos erro">{erroProdutos}</p>
      ) : termoBusca.trim() !== "" ? (
        <>
          <h2 className="titulo-fileira">
            Resultados para "{termoBusca}"
          </h2>

          <div className="produtos">
            {produtosFiltrados.length > 0 ? (
              produtosFiltrados.map(renderCard)
            ) : (
              <p className="nenhum-produto">Nenhum produto encontrado.</p>
            )}
          </div>
        </>
      ) : (
        <>
          <h2 className="titulo-fileira">Coleção Nana & Mimi</h2>
          <div className="produtos">
            {produtos.slice(0, 4).map(renderCard)}
          </div>

          {produtos.length > 4 && (
            <>
              <h2 className="titulo-fileira">Conforto & Estilo</h2>
              <div className="produtos">
                {produtos.slice(4).map(renderCard)}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
