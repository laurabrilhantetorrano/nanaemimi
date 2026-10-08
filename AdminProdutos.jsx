import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2, Plus, X } from "lucide-react";
import Navbar from "./Navbar";
import { apiFetch, formatarPreco, normalizarImagem } from "./api";
import { useAuth } from "./AuthContext";
import "./AdminProdutos.css";

const vazio = {
  nome: "",
  descricao: "",
  preco: "",
  preco_antigo: "",
  categoria: "",
  tamanhos: "8,10,12,14",
  cor: "",
  estoque: "0",
};

export default function AdminProdutos() {
  const { isAdministrador, usuario, carregando } = useAuth();
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);
  const [form, setForm] = useState(vazio);
  const [imagem, setImagem] = useState(null);
  const [editando, setEditando] = useState(null);
  const [carregandoProdutos, setCarregandoProdutos] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    if (!carregando && !isAdministrador) navigate("/login", { replace: true });
  }, [carregando, isAdministrador, navigate]);

  const carregar = async () => {
    try {
      setCarregandoProdutos(true);
      const data = await apiFetch("/products");
      setProdutos((data || []).map((p) => ({ ...p, imagem: normalizarImagem(p.imagem) })));
    } catch (e) {
      setErro(e?.erro || "Não foi possível carregar os produtos.");
    } finally {
      setCarregandoProdutos(false);
    }
  };

  useEffect(() => { if (isAdministrador) carregar(); }, [isAdministrador]);

  const alterar = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const limpar = () => {
    setForm(vazio);
    setImagem(null);
    setEditando(null);
    setErro("");
  };

  const editar = (produto) => {
    setEditando(produto.id);
    setForm({
      nome: produto.nome || "",
      descricao: produto.descricao || "",
      preco: produto.preco ?? "",
      preco_antigo: produto.preco_antigo ?? "",
      categoria: produto.categoria || "",
      tamanhos: produto.tamanhos || "8,10,12,14",
      cor: produto.cor || "",
      estoque: produto.estoque ?? 0,
    });
    setImagem(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const salvar = async (e) => {
    e.preventDefault();
    setErro(""); setMensagem("");
    if (!form.nome.trim() || form.preco === "") {
      setErro("Nome e preço são obrigatórios."); return;
    }

    const dados = new FormData();
    Object.entries(form).forEach(([chave, valor]) => dados.append(chave, valor));
    if (imagem) dados.append("imagem", imagem);

    try {
      setSalvando(true);
      if (editando) {
        await apiFetch(`/products/${editando}`, { method: "PUT", body: dados });
        setMensagem("Produto atualizado com sucesso!");
      } else {
        await apiFetch("/products", { method: "POST", body: dados });
        setMensagem("Produto cadastrado com sucesso!");
      }
      limpar();
      await carregar();
    } catch (e) {
      setErro(e?.erro || "Não foi possível salvar o produto.");
    } finally {
      setSalvando(false);
    }
  };

  const desativar = async (id) => {
    if (!window.confirm("Desativar este produto da loja?")) return;
    try {
      await apiFetch(`/products/${id}`, { method: "DELETE" });
      setMensagem("Produto desativado.");
      await carregar();
    } catch (e) {
      setErro(e?.erro || "Não foi possível desativar o produto.");
    }
  };

  if (carregando || !isAdministrador) return null;

  return (
    <div className="admin-pagina">
      <Navbar />
      <main className="admin-container">
        <div className="admin-topo">
          <Link to="/minha-conta" className="admin-voltar"><ArrowLeft size={18} /> Minha conta</Link>
          <div>
            <span>ÁREA RESTRITA</span>
            <h1>Gerenciar produtos</h1>
            <p>Olá, {usuario?.nome}. Aqui você pode cadastrar e editar as roupas da Nana & Mimi.</p>
          </div>
        </div>

        <section className="admin-form-card">
          <div className="admin-card-title">
            <h2>{editando ? "Editar produto" : "Novo produto"}</h2>
            {editando && <button type="button" onClick={limpar}><X size={18} /> Cancelar edição</button>}
          </div>
          <form onSubmit={salvar} className="admin-form">
            <label>Nome *<input name="nome" value={form.nome} onChange={alterar} /></label>
            <label>Preço *<input name="preco" type="number" step="0.01" min="0" value={form.preco} onChange={alterar} /></label>
            <label>Preço antigo<input name="preco_antigo" type="number" step="0.01" min="0" value={form.preco_antigo} onChange={alterar} /></label>
            <label>Estoque<input name="estoque" type="number" min="0" value={form.estoque} onChange={alterar} /></label>
            <label>Categoria<input name="categoria" value={form.categoria} onChange={alterar} /></label>
            <label>Cor<input name="cor" value={form.cor} onChange={alterar} /></label>
            <label>Tamanhos<input name="tamanhos" value={form.tamanhos} onChange={alterar} placeholder="8,10,12,14" /></label>
            <label>Imagem<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(e) => setImagem(e.target.files?.[0] || null)} /></label>
            <label className="admin-campo-grande">Descrição<textarea name="descricao" value={form.descricao} onChange={alterar} rows="4" /></label>
            {imagem && <p className="admin-arquivo">Imagem selecionada: {imagem.name}</p>}
            {erro && <p className="admin-erro">{erro}</p>}
            {mensagem && <p className="admin-sucesso">{mensagem}</p>}
            <button className="admin-salvar" type="submit" disabled={salvando}>
              {salvando ? "Salvando..." : editando ? "Salvar alterações" : "Cadastrar produto"}
            </button>
          </form>
        </section>

        <section className="admin-lista-card">
          <div className="admin-card-title"><h2>Produtos cadastrados</h2><span>{produtos.length} encontrados</span></div>
          {carregandoProdutos ? <p>Carregando...</p> : (
            <div className="admin-produtos-lista">
              {produtos.map((p) => (
                <article className="admin-produto" key={p.id}>
                  <div className="admin-produto-imagem">
                    {p.imagem ? <img src={p.imagem} alt={p.nome} /> : <span>Sem imagem</span>}
                  </div>
                  <div className="admin-produto-info">
                    <strong>{p.nome}</strong>
                    <span>{formatarPreco(p.preco)} · estoque: {p.estoque ?? 0}</span>
                    <small>{p.categoria || "Sem categoria"}</small>
                  </div>
                  <div className="admin-produto-acoes">
                    <button type="button" onClick={() => editar(p)} title="Editar"><Pencil size={18} /> Editar</button>
                    <button type="button" className="perigo" onClick={() => desativar(p.id)} title="Desativar"><Trash2 size={18} /> Desativar</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
