import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./Produto.css";
import { ArrowLeft } from "lucide-react";
import { useCarrinho } from "./CarrinhoContext";
import { useAuth } from "./AuthContext";
import apiFetch, { formatarPreco, normalizarImagem } from "./api";

export default function Produto() {
  const { adicionarAoCarrinho } = useCarrinho();
  const { isCliente } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [produto, setProduto] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [adicionando, setAdicionando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarProduto() {
      try {
        setCarregando(true);
        const data = await apiFetch(`/products/${id}`);

        if (ativo) {
          setProduto({
            ...data,
            id: Number(data.id),
            preco: Number(data.preco),
            preco_antigo: data.preco_antigo == null ? null : Number(data.preco_antigo),
            imagem: normalizarImagem(data.imagem),
          });
          setErro("");
        }
      } catch (err) {
        if (ativo) setErro(err?.erro || "Produto não encontrado.");
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarProduto();

    return () => {
      ativo = false;
    };
  }, [id]);

  const comprar = async () => {
    setMensagem("");

    if (!isCliente) {
      navigate("/login");
      return;
    }

    try {
      setAdicionando(true);
      await adicionarAoCarrinho(produto);
      setMensagem("Produto adicionado ao carrinho!");
    } catch (err) {
      setMensagem(err?.erro || "Não foi possível adicionar o produto.");
    } finally {
      setAdicionando(false);
    }
  };

  if (carregando) {
    return <h2 style={{ padding: "40px", textAlign: "center" }}>Carregando produto...</h2>;
  }

  if (erro || !produto) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>{erro || "Produto não encontrado!"}</h2>
        <Link to="/">Voltar para a loja</Link>
      </div>
    );
  }

  const tamanhos = String(produto.tamanhos || "8,10,12,14")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <div className="produto-detalhes-container">
      <Link
        to="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          textDecoration: "none",
          color: "#000",
          marginBottom: "20px",
          fontWeight: "bold"
        }}
      >
        <ArrowLeft size={20} />
        Voltar
      </Link>

      <div className="produto-wrapper">
        <div className="produto-imagem">
          {produto.imagem ? (
            <img src={produto.imagem} alt={produto.nome} />
          ) : (
            <div style={{ padding: "40px" }}>Sem imagem</div>
          )}
        </div>

        <div className="produto-info">
          <h1>{produto.nome}</h1>

          {produto.preco_antigo && (
            <p className="preco-antigo">
              <del>{formatarPreco(produto.preco_antigo)}</del>
            </p>
          )}

          <p className="produto-preco">{formatarPreco(produto.preco)}</p>

          <p className="produto-descricao">
            {produto.descricao || "Produto Nana & Mimi. Consulte as opções disponíveis."}
          </p>

          <div className="opcoes-compra">
            <label htmlFor="tamanho">Tamanho:</label>
            <select id="tamanho" defaultValue={tamanhos[0] || ""}>
              {tamanhos.map((tamanho) => (
                <option key={tamanho} value={tamanho}>
                  {tamanho}
                </option>
              ))}
            </select>
          </div>

          <p style={{ marginTop: "10px" }}>
            Estoque disponível: {produto.estoque}
          </p>

          <button
            onClick={comprar}
            disabled={adicionando || Number(produto.estoque) <= 0}
          >
            {adicionando ? "Adicionando..." : Number(produto.estoque) <= 0 ? "Sem estoque" : "Comprar"}
          </button>

          {mensagem && (
            <p style={{ marginTop: "15px", fontWeight: "bold" }}>
              {mensagem}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
