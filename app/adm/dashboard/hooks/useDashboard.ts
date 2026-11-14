
import { useEffect, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// TYPES

export interface Ordem {
  id: number;
  dataAbertura: string;
}

export interface Cliente {
  id: number;
  nome: string;
}

export interface Peca {
  id: number;
  nome: string;
}

export interface PecaDaOrdem {
  nome: string;
  material: string;
  quantidade: number;
}

export interface OrdemRecente {
  id: number;
  cliente: string;
  pecas: PecaDaOrdem[];
  prazo: string | null;
  status: string;
  observacoes?: string | null;
}

export interface Resumo {
  totalOs: number;
  emProducao: number;
  aguardando: number;
  concluidas: number;
  totalClientes: number;
  atrasadas: number;
}

// HOOK

export function useDashboard() {
  const [resumo, setResumo] = useState<Resumo | null>(null);
  const [ordens, setOrdens] = useState<Ordem[]>([]);
  const [ordensRecentes, setOrdensRecentes] = useState<OrdemRecente[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [pecas, setPecas] = useState<Peca[]>([]);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function buscarDados() {
      try {
        const endpoints = [
          "dashboard/resumo",
          "orders",
          "dashboard/ordens-recentes",
          "clients",
          "pecas",
        ];

        const respostas = await Promise.all(
          endpoints.map((endpoint) => fetch(`${API_URL}/${endpoint}`)),
        );

        if (respostas.some((resposta) => !resposta.ok)) {
          throw new Error("Erro ao buscar dados do dashboard.");
        }

        const [dadosResumo, dadosOrdens, dadosRecentes, dadosClientes, dadosPecas] =
          await Promise.all(respostas.map((resposta) => resposta.json()));

        if (!ativo) return;

        setResumo(dadosResumo);
        setOrdens(dadosOrdens);
        setOrdensRecentes(dadosRecentes);
        setClientes(dadosClientes);
        setPecas(dadosPecas);
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);

        if (ativo) {
          setErro("Não foi possível carregar os dados do dashboard.");
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    void buscarDados();

    return () => {
      ativo = false;
    };
  }, []);

  return {
    resumo,
    ordens,
    ordensRecentes,
    clientes,
    pecas,
    carregando,
    erro,
  };
}
