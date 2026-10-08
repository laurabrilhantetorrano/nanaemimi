import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { CircleUserRound, ShoppingCart, LogOut, ArrowLeft } from "lucide-react";
import { useAuth } from "./AuthContext";
import { useCarrinho } from "./CarrinhoContext";
import { formatarPreco } from "./api";
import "./MinhaConta.css";

export default function MinhaConta() {
  const { usuario, logout, isCliente, isAdministrador } = useAuth();
  const { carrinho } = useCarrinho();
  const navigate = useNavigate();

  const quantidadeItens = carrinho.reduce(
    (total, item) => total + Number(item.quantidade || 0),
    0
  );

  const totalCarrinho = carrinho.reduce(
    (total, item) =>
      total + Number(item.preco || 0) * Number(item.quantidade || 0),
    0
  );

  const sair = () => {
    logout();
    navigate("/");
  };

  if (!usuario) {
    return (
      <main className="conta-pagina">
        <div className="conta-nao-logado">
          <CircleUserRound size={58} />
          <h1>Minha conta</h1>
          <p>Você ainda não está conectado.</p>
          <Link to="/login" className="conta-botao-principal">
            Entrar na minha conta
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="conta-pagina">
      <div className="conta-topo">
        <Link to="/" className="conta-voltar">
          <ArrowLeft size={18} />
          Voltar para a loja
        </Link>
      </div>

      <section className="conta-card">
        <div className="conta-cabecalho">
          <div className="conta-icone">
            <CircleUserRound size={54} strokeWidth={1.8} />
          </div>

          <div>
            <p className="conta-saudacao">Olá, {usuario.nome}!</p>
            <h1>Minha conta</h1>
            <span>
              {usuario.tipo === "funcionario" ? "Funcionário" : "Cliente"}
            </span>
          </div>
        </div>

        <div className="conta-divisor" />

        <div className="conta-dados">
          <div className="dado">
            <span>Nome</span>
            <strong>{usuario.nome}</strong>
          </div>

          <div className="dado">
            <span>E-mail</span>
            <strong>{usuario.email}</strong>
          </div>

          {usuario.cargo && (
            <div className="dado">
              <span>Cargo</span>
              <strong>{usuario.cargo}</strong>
            </div>
          )}
        </div>

        {isAdministrador && (
          <>
            <div className="conta-divisor" />
            <Link to="/admin/produtos" className="conta-carrinho-card conta-admin-card">
              <div className="conta-carrinho-icone">🛍️</div>
              <div className="conta-carrinho-info">
                <strong>Área de administração</strong>
                <span>Cadastrar, editar e desativar produtos</span>
              </div>
              <span className="conta-carrinho-seta">→</span>
            </Link>
          </>
        )}

        {isCliente && (
          <>
            <div className="conta-divisor" />

            <Link to="/carrinho" className="conta-carrinho-card">
              <div className="conta-carrinho-icone">
                <ShoppingCart size={25} />
              </div>

              <div className="conta-carrinho-info">
                <strong>Meu carrinho</strong>
                <span>
                  {quantidadeItens === 0
                    ? "Seu carrinho está vazio"
                    : `${quantidadeItens} ${
                        quantidadeItens === 1 ? "item" : "itens"
                      } · ${formatarPreco(totalCarrinho)}`}
                </span>
              </div>

              <span className="conta-carrinho-seta">→</span>
            </Link>
          </>
        )}

        <button type="button" onClick={sair} className="btn-sair-conta">
          <LogOut size={19} />
          <span>Sair da conta</span>
        </button>
      </section>
    </main>
  );
}
