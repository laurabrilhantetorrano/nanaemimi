import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import apiFetch, { normalizarImagem } from './api';
import { useAuth } from './AuthContext';

const CarrinhoContext = createContext();

function normalizarItem(item) {
  return {
    ...item,
    id: Number(item.id),
    preco: Number(item.preco),
    quantidade: Number(item.quantidade),
    img: normalizarImagem(item.img),
  };
}

export function CarrinhoProvider({ children }) {
  const { token, isCliente } = useAuth();
  const [carrinho, setCarrinho] = useState([]);
  const [carregando, setCarregando] = useState(false);

  const carregarCarrinho = useCallback(async () => {
    if (!token || !isCliente) {
      setCarrinho([]);
      return;
    }

    try {
      setCarregando(true);
      const data = await apiFetch('/cart');
      setCarrinho((data.itens || []).map(normalizarItem));
    } catch (erro) {
      console.error('Erro ao carregar carrinho:', erro);
      setCarrinho([]);
    } finally {
      setCarregando(false);
    }
  }, [token, isCliente]);

  useEffect(() => {
    carregarCarrinho();
  }, [carregarCarrinho]);

  const adicionarAoCarrinho = async (produto) => {
    if (!token || !isCliente) {
      throw { status: 401, erro: 'Faça login para adicionar produtos ao carrinho.' };
    }

    const data = await apiFetch('/cart/items', {
      method: 'POST',
      body: JSON.stringify({
        produto_id: Number(produto.id),
        quantidade: 1,
      }),
    });

    setCarrinho((data.itens || []).map(normalizarItem));
    return data;
  };

  const removerDoCarrinho = async (id) => {
    const data = await apiFetch(`/cart/items/${Number(id)}`, {
      method: 'DELETE',
    });

    setCarrinho((data.itens || []).map(normalizarItem));
  };

  const atualizarQuantidade = async (id, quantidade) => {
    const data = await apiFetch(`/cart/items/${Number(id)}`, {
      method: 'PUT',
      body: JSON.stringify({ quantidade: Number(quantidade) }),
    });

    setCarrinho((data.itens || []).map(normalizarItem));
  };

  const limparCarrinho = async () => {
    const data = await apiFetch('/cart/clear', {
      method: 'DELETE',
    });

    setCarrinho((data.itens || []).map(normalizarItem));
  };

  return (
    <CarrinhoContext.Provider
      value={{
        carrinho,
        carregando,
        adicionarAoCarrinho,
        removerDoCarrinho,
        atualizarQuantidade,
        limparCarrinho,
        recarregarCarrinho: carregarCarrinho,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  return useContext(CarrinhoContext);
}
