import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useCarrinho } from "./CarrinhoContext";
import { useAuth } from "./AuthContext";
import { formatarPreco } from "./api";
import "./Carrinho.css";

export default function Carrinho() {
  const {
    carrinho,
    carregando,
    removerDoCarrinho,
    atualizarQuantidade,
    limparCarrinho,
  } = useCarrinho();

  const { usuario, isCliente, isLogado } = useAuth();
  const navigate = useNavigate();

  const [mostrarCheckout, setMostrarCheckout] = useState(false);
  const [finalizado, setFinalizado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erroCheckout, setErroCheckout] = useState("");

  const [formulario, setFormulario] = useState({
    nome: usuario?.nome || "",
    email: usuario?.email || "",
    telefone: "",
    cep: "",
    endereco: "",
    numero: "",
    cidade: "",
    pagamento: "Pix",
  });

  const total = carrinho.reduce(
    (acc, item) =>
      acc + Number(item.preco) * Number(item.quantidade),
    0
  );

  const alterarCampo = (e) => {
    const { name, value } = e.target;
    setFormulario((anterior) => ({ ...anterior, [name]: value }));
  };

  const abrirCheckout = () => {
    setErroCheckout("");

    setFormulario((anterior) => ({
      ...anterior,
      nome: anterior.nome || usuario?.nome || "",
      email: anterior.email || usuario?.email || "",
    }));

    setMostrarCheckout(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const finalizarPedido = async (e) => {
    e.preventDefault();
    setErroCheckout("");

    const camposObrigatorios = [
      "nome",
      "email",
      "telefone",
      "cep",
      "endereco",
      "numero",
      "cidade",
    ];

    if (camposObrigatorios.some((campo) => !formulario[campo].trim())) {
      setErroCheckout("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setEnviando(true);

      // O projeto ainda não possui gateway de pagamento.
      // Aqui confirmamos o pedido e limpamos o carrinho do usuário.
      await limparCarrinho();
      setFinalizado(true);
      setMostrarCheckout(false);
    } catch (erro) {
      setErroCheckout(
        erro?.erro || "Não foi possível finalizar o pedido. Tente novamente."
      );
    } finally {
      setEnviando(false);
    }
  };

  if (!isLogado) {
    return (
      <main className="carrinho-container">
        <div className="carrinho-acesso">
          <h1>Meu Carrinho</h1>
          <p>Entre na sua conta para acessar seu carrinho.</p>
          <Link to="/login" className="botao-carrinho-principal">
            Entrar
          </Link>
        </div>
      </main>
    );
  }

  if (!isCliente) {
    return (
      <main className="carrinho-container">
        <div className="carrinho-acesso">
          <h1>Meu Carrinho</h1>
          <p>Contas de funcionário não possuem carrinho.</p>
          <Link to="/" className="botao-carrinho-principal">
            Voltar para a loja
          </Link>
        </div>
      </main>
    );
  }

  if (finalizado) {
    return (
      <main className="carrinho-container">
        <div className="pedido-sucesso">
          <CheckCircle2 size={64} />
          <h1>Pedido recebido!</h1>
          <p>
            Obrigada, <strong>{usuario?.nome}</strong>! Seu pedido foi
            registrado com sucesso.
          </p>
          <p className="pedido-observacao">
            Nesta versão do TCC, a finalização é uma simulação de compra.
            O pagamento não é processado de verdade.
          </p>

          <div className="pedido-acoes">
            <Link to="/" className="botao-carrinho-principal">
              Continuar comprando
            </Link>
            <Link to="/minha-conta" className="botao-carrinho-secundario">
              Minha conta
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="carrinho-container">
      <div className="carrinho-header-pagina">
        <Link to="/" className="btn-voltar">
          <ArrowLeft size={18} />
          Voltar para a loja
        </Link>
        <h1>Meu Carrinho</h1>
        <p>
          Confira seus produtos antes de finalizar a compra.
        </p>
      </div>

      {carregando ? (
        <div className="carrinho-carregando">
          Carregando seu carrinho...
        </div>
      ) : carrinho.length === 0 ? (
        <div className="carrinho-vazio-box">
          <h2>Seu carrinho está vazio.</h2>
          <p>Escolha uma roupa para adicionar ao seu pedido.</p>
          <Link to="/" className="botao-carrinho-principal">
            Comprar roupas
          </Link>
        </div>
      ) : (
        <>
          <div className="carrinho-conteudo">
            <div className="carrinho-lista">
              {carrinho.map((item) => (
                <div key={item.id} className="carrinho-item-pagina">
                  <div className="imagem-carrinho">
                    {item.img ? (
                      <img src={item.img} alt={item.nome} />
                    ) : (
                      <span>Sem imagem</span>
                    )}
                  </div>

                  <div className="info-item">
                    <h3>{item.nome}</h3>
                    <p className="preco-item">
                      {formatarPreco(item.preco)}
                    </p>

                    <div className="controle-quantidade">
                      <button
                        type="button"
                        onClick={() =>
                          atualizarQuantidade(
                            item.id,
                            Math.max(0, item.quantidade - 1)
                          )
                        }
                        aria-label="Diminuir quantidade"
                      >
                        <Minus size={16} />
                      </button>

                      <span>Qtd: {item.quantidade}</span>

                      <button
                        type="button"
                        onClick={() =>
                          atualizarQuantidade(
                            item.id,
                            item.quantidade + 1
                          )
                        }
                        aria-label="Aumentar quantidade"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="item-subtotal">
                    {formatarPreco(
                      Number(item.preco) * Number(item.quantidade)
                    )}
                  </div>

                  <button
                    className="btn-remover"
                    onClick={() => removerDoCarrinho(item.id)}
                    aria-label={`Remover ${item.nome}`}
                    title="Remover produto"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            <aside className="carrinho-resumo">
              <h2>Resumo do Pedido</h2>

              <div className="linha-resumo">
                <span>Produtos</span>
                <span>{formatarPreco(total)}</span>
              </div>

              <div className="linha-resumo">
                <span>Frete</span>
                <span className="frete-gratis">Grátis</span>
              </div>

              <div className="linha-resumo total">
                <strong>Total</strong>
                <strong>{formatarPreco(total)}</strong>
              </div>

              <button
                type="button"
                className="btn-finalizar"
                onClick={abrirCheckout}
              >
                Finalizar compra
              </button>

              <Link to="/" className="continuar-comprando">
                Continuar comprando
              </Link>
            </aside>
          </div>

          {mostrarCheckout && (
            <section className="checkout-box">
              <div className="checkout-titulo">
                <div>
                  <span>ÚLTIMA ETAPA</span>
                  <h2>Completar pedido</h2>
                  <p>Preencha seus dados para concluir a compra.</p>
                </div>

                <button
                  type="button"
                  className="checkout-fechar"
                  onClick={() => setMostrarCheckout(false)}
                  aria-label="Fechar"
                >
                  ×
                </button>
              </div>

              <form onSubmit={finalizarPedido}>
                <div className="checkout-grid">
                  <label>
                    Nome completo *
                    <input
                      name="nome"
                      value={formulario.nome}
                      onChange={alterarCampo}
                      placeholder="Seu nome"
                    />
                  </label>

                  <label>
                    E-mail *
                    <input
                      type="email"
                      name="email"
                      value={formulario.email}
                      onChange={alterarCampo}
                      placeholder="seu@email.com"
                    />
                  </label>

                  <label>
                    Telefone *
                    <input
                      name="telefone"
                      value={formulario.telefone}
                      onChange={alterarCampo}
                      placeholder="(00) 00000-0000"
                    />
                  </label>

                  <label>
                    CEP *
                    <input
                      name="cep"
                      value={formulario.cep}
                      onChange={alterarCampo}
                      placeholder="00000-000"
                    />
                  </label>

                  <label className="checkout-campo-grande">
                    Endereço *
                    <input
                      name="endereco"
                      value={formulario.endereco}
                      onChange={alterarCampo}
                      placeholder="Rua, avenida..."
                    />
                  </label>

                  <label>
                    Número *
                    <input
                      name="numero"
                      value={formulario.numero}
                      onChange={alterarCampo}
                      placeholder="123"
                    />
                  </label>

                  <label>
                    Cidade *
                    <input
                      name="cidade"
                      value={formulario.cidade}
                      onChange={alterarCampo}
                      placeholder="Sua cidade"
                    />
                  </label>

                  <label>
                    Forma de pagamento
                    <select
                      name="pagamento"
                      value={formulario.pagamento}
                      onChange={alterarCampo}
                    >
                      <option>Pix</option>
                      <option>Cartão de crédito</option>
                      <option>Cartão de débito</option>
                    </select>
                  </label>
                </div>

                {erroCheckout && (
                  <p className="checkout-erro">{erroCheckout}</p>
                )}

                <div className="checkout-final">
                  <div>
                    <span>Total do pedido</span>
                    <strong>{formatarPreco(total)}</strong>
                  </div>

                  <button
                    type="submit"
                    className="btn-confirmar-pedido"
                    disabled={enviando}
                  >
                    {enviando ? "Confirmando..." : "Confirmar pedido"}
                  </button>
                </div>
              </form>
            </section>
          )}
        </>
      )}
    </main>
  );
}
