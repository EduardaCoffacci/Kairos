"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import {
  ArrowLeft,
  ArrowDown,
  ArrowUp,
  CalendarDays,
  Clock3,
  Package,
  Factory,
  Plus,
  RefreshCw,
  X,
  Printer,
} from "lucide-react";

import OrdemServicoImpressao from "../OrdemServicoImpressao";

interface Cliente {
  id: number;
  nome: string;
  email?: string | null;
  telefone?: string | null;
  cnpj?: string | null;
}

interface Peca {
  id: number;
  nome: string;
  material?: string | null;
}

interface OrderItem {
  id: number;
  peca: Peca;
  quantidade: number;
}

interface Ordem {
  id: number;
  cliente: Cliente;
  descricao: string;
  status: string;
  dataAbertura: string;
  dataConclusao: string | null;
  prazo: string | null;
  valor: number | string;
  observacoes: string | null;
  itens: OrderItem[];
}

interface Processo {
  id: number;
  name: string;
  description?: string;
  active: boolean;
}

interface Operador {
  id: number;
  nome: string;
}

interface Producao {
  id: number;
  itemOrdem: {
    id: number;
    ordem: {
      id: number;
    };
    peca: Peca;
  };
  process: Processo;
  operador: Operador | null;
  sequence: number;
  status: string;
  dataInicio: string | null;
  dataConclusao: string | null;
  quantidadeProduzida: number;
  quantidadeAprovada: number;
  quantidadeRejeitada: number;
  observacoes: string | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function obterErro(resposta: Response, mensagemPadrao: string) {
  try {
    const dados = await resposta.json();

    return Array.isArray(dados.message)
      ? dados.message.join(", ")
      : dados.message || mensagemPadrao;
  } catch {
    return mensagemPadrao;
  }
}

function formatarData(data: string | null) {
  if (!data) return "—";

  return new Date(`${data.substring(0, 10)}T00:00:00`).toLocaleDateString(
    "pt-BR",
  );
}

function formatarValor(valor: number | string) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function nomeStatus(status: string) {
  const nomes: Record<string, string> = {
    ABERTA: "Aberta",
    EM_ANDAMENTO: "Em andamento",
    CONCLUIDA: "Concluída",
    CANCELADA: "Cancelada",
    PENDENTE: "Pendente",
  };

  return nomes[status] ?? status;
}

function corStatus(
  status: string,
): "default" | "success" | "warning" | "error" | "info" {
  const cores: Record<
    string,
    "default" | "success" | "warning" | "error" | "info"
  > = {
    ABERTA: "warning",
    EM_ANDAMENTO: "info",
    CONCLUIDA: "success",
    CANCELADA: "error",
    PENDENTE: "default",
  };

  return cores[status] ?? "default";
}

export default function DetalhesOrdem() {
  const router = useRouter();
  const params = useParams();

  const ordemId = Number(params.id);

  const [ordem, setOrdem] = useState<Ordem | null>(null);
  const [producoes, setProducoes] = useState<Producao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // Estados do modal de processos
  const [modalAberto, setModalAberto] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState<OrderItem | null>(
    null,
  );
  const [processosDisponiveis, setProcessosDisponiveis] = useState<Processo[]>(
    [],
  );
  const [processosSelecionados, setProcessosSelecionados] = useState<number[]>(
    [],
  );
  const [carregandoProcessos, setCarregandoProcessos] = useState(false);
  const [salvandoProcessos, setSalvandoProcessos] = useState(false);
  const [erroModal, setErroModal] = useState("");

  // Atualização manual dos dados
  const buscarDados = useCallback(async () => {
    try {
      setCarregando(true);
      setErro("");

      const [respostaOrdem, respostaProducao] = await Promise.all([
        fetch(`${API_URL}/orders/${ordemId}`),
        fetch(`${API_URL}/production`),
      ]);

      if (!respostaOrdem.ok) {
        throw new Error(
          await obterErro(
            respostaOrdem,
            "Não foi possível carregar a ordem de serviço.",
          ),
        );
      }

      if (!respostaProducao.ok) {
        throw new Error(
          await obterErro(
            respostaProducao,
            "Não foi possível carregar as etapas de produção.",
          ),
        );
      }

      const dadosOrdem: Ordem = await respostaOrdem.json();
      const dadosProducao: Producao[] = await respostaProducao.json();

      setOrdem(dadosOrdem);

      setProducoes(
        dadosProducao.filter(
          (producao) => producao.itemOrdem?.ordem?.id === ordemId,
        ),
      );
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao carregar os dados da ordem.",
      );
    } finally {
      setCarregando(false);
    }
  }, [ordemId]);

  // Carregamento inicial
  useEffect(() => {
    if (!Number.isInteger(ordemId) || ordemId <= 0) return;

    let cancelado = false;

    async function carregar() {
      try {
        const [respostaOrdem, respostaProducao] = await Promise.all([
          fetch(`${API_URL}/orders/${ordemId}`),
          fetch(`${API_URL}/production`),
        ]);

        if (!respostaOrdem.ok) {
          throw new Error(
            await obterErro(
              respostaOrdem,
              "Não foi possível carregar a ordem de serviço.",
            ),
          );
        }

        if (!respostaProducao.ok) {
          throw new Error(
            await obterErro(
              respostaProducao,
              "Não foi possível carregar as etapas de produção.",
            ),
          );
        }

        const dadosOrdem: Ordem = await respostaOrdem.json();
        const dadosProducao: Producao[] = await respostaProducao.json();

        if (cancelado) return;

        setOrdem(dadosOrdem);

        setProducoes(
          dadosProducao.filter(
            (producao) => producao.itemOrdem?.ordem?.id === ordemId,
          ),
        );

        setErro("");
      } catch (error) {
        if (cancelado) return;

        setErro(
          error instanceof Error
            ? error.message
            : "Erro ao carregar os dados da ordem.",
        );
      } finally {
        if (!cancelado) {
          setCarregando(false);
        }
      }
    }

    void carregar();

    return () => {
      cancelado = true;
    };
  }, [ordemId]);

  // Abre o modal e busca os processos ativos
  async function abrirModalProcessos(item: OrderItem) {
    setItemSelecionado(item);
    setProcessosSelecionados([]);
    setErroModal("");
    setModalAberto(true);
    setCarregandoProcessos(true);

    try {
      const resposta = await fetch(`${API_URL}/machining-processes`);

      if (!resposta.ok) {
        throw new Error(
          await obterErro(resposta, "Não foi possível carregar os processos."),
        );
      }

      const dados: Processo[] = await resposta.json();

      setProcessosDisponiveis(dados.filter((processo) => processo.active));
    } catch (error) {
      setErroModal(
        error instanceof Error
          ? error.message
          : "Erro ao carregar os processos.",
      );
    } finally {
      setCarregandoProcessos(false);
    }
  }

  function fecharModal() {
    if (salvandoProcessos) return;

    setModalAberto(false);
    setItemSelecionado(null);
    setProcessosSelecionados([]);
    setErroModal("");
  }

  // Adiciona ou remove um processo da seleção
  function alternarProcesso(processoId: number) {
    setProcessosSelecionados((atuais) => {
      if (atuais.includes(processoId)) {
        return atuais.filter((id) => id !== processoId);
      }

      return [...atuais, processoId];
    });
  }

  // Altera a posição de um processo na sequência
  function moverProcesso(index: number, direcao: number) {
    setProcessosSelecionados((atuais) => {
      const novaLista = [...atuais];
      const novoIndex = index + direcao;

      if (novoIndex < 0 || novoIndex >= novaLista.length) {
        return atuais;
      }

      [novaLista[index], novaLista[novoIndex]] = [
        novaLista[novoIndex],
        novaLista[index],
      ];

      return novaLista;
    });
  }

  // Cria uma produção para cada processo selecionado
  async function salvarProcessos() {
    if (!itemSelecionado || processosSelecionados.length === 0) {
      setErroModal("Selecione pelo menos um processo.");
      return;
    }

    setSalvandoProcessos(true);
    setErroModal("");

    const producoesCriadas: number[] = [];

    try {
      const etapasExistentes = producoes.filter(
        (producao) => producao.itemOrdem?.id === itemSelecionado.id,
      );

      const maiorSequencia = etapasExistentes.reduce(
        (maior, etapa) => Math.max(maior, etapa.sequence),
        0,
      );

      for (let index = 0; index < processosSelecionados.length; index++) {
        const processoId = processosSelecionados[index];

        const resposta = await fetch(`${API_URL}/production`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            itemOrdemId: itemSelecionado.id,
            processId: processoId,
            sequence: maiorSequencia + index + 1,
          }),
        });

        if (!resposta.ok) {
          throw new Error(
            await obterErro(
              resposta,
              "Não foi possível criar uma etapa de produção.",
            ),
          );
        }

        producoesCriadas.push(processoId);
      }

      await buscarDados();

      setModalAberto(false);
      setItemSelecionado(null);
      setProcessosSelecionados([]);
      setErroModal("");
    } catch (error) {
      if (producoesCriadas.length > 0) {
        await buscarDados();
      }

      setErroModal(
        error instanceof Error ? error.message : "Erro ao salvar os processos.",
      );
    } finally {
      setSalvandoProcessos(false);
    }
  }

  if (carregando) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress sx={{ color: "#e04f11" }} />
      </Box>
    );
  }

  if (erro || !ordem) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {erro || "Ordem de serviço não encontrada."}
        </Alert>

        <Button
          startIcon={<ArrowLeft size={18} />}
          onClick={() => {
            router.push("/adm/ordens-servico");
          }}
          sx={{
            color: "#e04f11",
            textTransform: "none",
          }}
        >
          Voltar para ordens de serviço
        </Button>
      </Box>
    );
  }

  const producoesPorItem = (itemId: number) =>
    producoes
      .filter((producao) => producao.itemOrdem?.id === itemId)
      .sort((a, b) => a.sequence - b.sequence);

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        backgroundColor: "#F1F5F9",
        color: "#1E293B",
        minHeight: "100vh",

        "& .MuiTypography-colorTextSecondary": {
          color: "#64748B",
        },
      }}
    >
      {/* Cabeçalho */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          mb: 3,
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
        }}
      >
        <Box>
          <Button
            startIcon={<ArrowLeft size={18} />}
            onClick={() => router.push("/adm/ordens-servico")}
            sx={{
              color: "#64748b",
              textTransform: "none",
              mb: 1,
              pl: 0,
            }}
          >
            Voltar para ordens de serviço
          </Button>

          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: "#1e293b",
            }}
          >
            Ordem de serviço #{ordem.id}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Detalhes da ordem e acompanhamento da produção
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            flexWrap: "wrap",
            gap: 1.5,
          }}
        >
          <Button
            variant="contained"
            startIcon={<Printer size={17} />}
            onClick={() => window.print()}
            sx={{
              backgroundColor: "#e04f11",
              color: "#ffffff",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#c9430d",
              },
            }}
          >
            Imprimir ordem
          </Button>

          <Button
            variant="outlined"
            startIcon={<RefreshCw size={16} />}
            onClick={buscarDados}
            sx={{
              borderColor: "#e2e8f0",
              color: "#475569",
              textTransform: "none",
            }}
          >
            Atualizar
          </Button>
        </Stack>
      </Stack>

      {/* Informações da ordem */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          sx={{
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ fontWeight: 700 }}
            >
              Cliente
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
              {ordem.cliente?.nome || "Cliente não informado"}
            </Typography>

            {ordem.cliente?.cnpj && (
              <Typography variant="body2" color="text.secondary">
                CNPJ: {ordem.cliente.cnpj}
              </Typography>
            )}

            {ordem.cliente?.telefone && (
              <Typography variant="body2" color="text.secondary">
                Telefone: {ordem.cliente.telefone}
              </Typography>
            )}
          </Box>

          <Divider
            orientation="vertical"
            flexItem
            sx={{ display: { xs: "none", md: "block" } }}
          />

          <Box sx={{ flex: 1 }}>
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ fontWeight: 700 }}
            >
              Informações da ordem
            </Typography>

            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Chip
                label={nomeStatus(ordem.status)}
                color={corStatus(ordem.status)}
                size="small"
              />
            </Stack>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              <CalendarDays
                size={15}
                style={{
                  display: "inline",
                  verticalAlign: "middle",
                  marginRight: 6,
                }}
              />
              Abertura: {formatarData(ordem.dataAbertura)}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              <Clock3
                size={15}
                style={{
                  display: "inline",
                  verticalAlign: "middle",
                  marginRight: 6,
                }}
              />
              Prazo: {formatarData(ordem.prazo)}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Valor: {formatarValor(ordem.valor)}
            </Typography>
          </Box>
        </Stack>

        {ordem.descricao && (
          <Box sx={{ mt: 3 }}>
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ fontWeight: 700 }}
            >
              Descrição
            </Typography>

            <Typography variant="body2" color="#334155">
              {ordem.descricao}
            </Typography>
          </Box>
        )}

        {ordem.observacoes && (
          <Box sx={{ mt: 2 }}>
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ fontWeight: 700 }}
            >
              Observações
            </Typography>

            <Typography variant="body2" color="#334155">
              {ordem.observacoes}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Peças da ordem */}
      <Box sx={{ mb: 3 }}>
        <Stack
          direction="row"
          sx={{
            mb: 2,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b" }}>
              Peças e produção
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Configure os processos de usinagem de cada peça
            </Typography>
          </Box>
        </Stack>

        {!ordem.itens || ordem.itens.length === 0 ? (
          <Alert severity="info">
            Esta ordem de serviço ainda não possui peças cadastradas.
          </Alert>
        ) : (
          <Stack spacing={2}>
            {ordem.itens.map((item) => {
              const etapas = producoesPorItem(item.id);

              return (
                <Paper
                  key={item.id}
                  elevation={0}
                  sx={{
                    p: 3,
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                  }}
                >
                  {/* Cabeçalho da peça */}
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    sx={{
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ alignItems: "center" }}
                      >
                        <Package size={20} color="#e04f11" />

                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 700, color: "#1e293b" }}
                        >
                          {item.peca?.nome || "Peça não informada"}
                        </Typography>
                      </Stack>

                      {item.peca?.material && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          Material: {item.peca.material}
                        </Typography>
                      )}

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        Quantidade: {item.quantidade}
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      startIcon={<Plus size={17} />}
                      onClick={() => abrirModalProcessos(item)}
                      sx={{
                        backgroundColor: "#e04f11",
                        textTransform: "none",
                        alignSelf: { xs: "stretch", sm: "center" },
                        "&:hover": {
                          backgroundColor: "#c9430d",
                        },
                      }}
                    >
                      Adicionar processos
                    </Button>
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  {/* Etapas de produção */}
                  <Box>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ alignItems: "center" }}
                    >
                      <Factory size={17} color="#64748b" />

                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 700, color: "#334155" }}
                      >
                        Etapas de produção
                      </Typography>

                      <Chip
                        label={etapas.length}
                        size="small"
                        sx={{
                          height: 21,
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      />
                    </Stack>

                    {etapas.length === 0 ? (
                      <Box
                        sx={{
                          mt: 2,
                          p: 2,
                          backgroundColor: "#f8fafc",
                          borderRadius: "8px",
                          textAlign: "center",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Nenhum processo foi configurado para esta peça.
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                          Clique em “Adicionar processos” para configurar a
                          sequência de produção.
                        </Typography>
                      </Box>
                    ) : (
                      <Stack spacing={1.5} sx={{ mt: 2 }}>
                        {etapas.map((etapa) => (
                          <Paper
                            key={etapa.id}
                            variant="outlined"
                            sx={{
                              p: 2,
                              borderRadius: "9px",
                              borderColor: "#e2e8f0",
                            }}
                          >
                            <Stack
                              direction={{ xs: "column", sm: "row" }}
                              spacing={2}
                              sx={{
                                justifyContent: "space-between",
                              }}
                            >
                              <Box sx={{ flex: 1 }}>
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  sx={{ alignItems: "center" }}
                                >
                                  <Chip
                                    label={`Etapa ${etapa.sequence}`}
                                    size="small"
                                    sx={{
                                      backgroundColor: "#fff1e9",
                                      color: "#e04f11",
                                      fontWeight: 700,
                                    }}
                                  />

                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: 700,
                                      color: "#1e293b",
                                    }}
                                  >
                                    {etapa.process?.name || "Processo"}
                                  </Typography>
                                </Stack>

                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mt: 1 }}
                                >
                                  Operador:{" "}
                                  {etapa.operador?.nome || "Não atribuído"}
                                </Typography>

                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mt: 0.5 }}
                                >
                                  Status: {nomeStatus(etapa.status)}
                                </Typography>
                              </Box>

                              <Box
                                sx={{
                                  display: "flex",
                                  gap: 2,
                                  flexWrap: "wrap",
                                }}
                              >
                                <Box>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    Produzida
                                  </Typography>

                                  <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 700, color: "#334155" }}
                                  >
                                    {etapa.quantidadeProduzida}
                                  </Typography>
                                </Box>

                                <Box>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    Aprovada
                                  </Typography>

                                  <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 700, color: "#16a34a" }}
                                  >
                                    {etapa.quantidadeAprovada}
                                  </Typography>
                                </Box>

                                <Box>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    Rejeitada
                                  </Typography>

                                  <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 700, color: "#dc2626" }}
                                  >
                                    {etapa.quantidadeRejeitada}
                                  </Typography>
                                </Box>
                              </Box>
                            </Stack>

                            <Divider sx={{ my: 1.5 }} />

                            <Box
                              sx={{
                                display: "flex",
                                gap: 3,
                                flexWrap: "wrap",
                              }}
                            >
                              <Box>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Início
                                </Typography>

                                <Typography
                                  variant="body2"
                                  sx={{ color: "#334155" }}
                                >
                                  {formatarData(etapa.dataInicio)}
                                </Typography>
                              </Box>

                              <Box>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Conclusão
                                </Typography>

                                <Typography
                                  variant="body2"
                                  sx={{ color: "#334155" }}
                                >
                                  {formatarData(etapa.dataConclusao)}
                                </Typography>
                              </Box>
                            </Box>

                            {etapa.observacoes && (
                              <Box sx={{ mt: 2 }}>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Observações
                                </Typography>

                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {etapa.observacoes}
                                </Typography>
                              </Box>
                            )}
                          </Paper>
                        ))}
                      </Stack>
                    )}
                  </Box>
                </Paper>
              );
            })}
          </Stack>
        )}
      </Box>

      {/* Modal para adicionar processos */}
      <Dialog
        open={modalAberto}
        onClose={fecharModal}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "#ffffff",
              color: "#1e293b",
              borderRadius: "12px",
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: 700,
            backgroundColor: "#ffffff",
            color: "#1e293b",
          }}
        >
          Adicionar processos de usinagem
          <IconButton onClick={fecharModal} disabled={salvandoProcessos}>
            <X size={20} />
          </IconButton>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            backgroundColor: "#ffffff",
            color: "#1e293b",
          }}
        >
          {itemSelecionado && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Peça selecionada
              </Typography>

              <Typography sx={{ fontWeight: 700, color: "#1e293b" }}>
                {itemSelecionado.peca?.nome}
              </Typography>

              <Typography variant="caption" color="text.secondary">
                Quantidade: {itemSelecionado.quantidade}
              </Typography>
            </Box>
          )}

          <Divider sx={{ mb: 2 }} />

          {erroModal && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {erroModal}
            </Alert>
          )}

          {carregandoProcessos ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress sx={{ color: "#e04f11" }} />
            </Box>
          ) : processosDisponiveis.length === 0 ? (
            <Alert severity="info">
              Nenhum processo ativo foi encontrado. Cadastre processos antes de
              continuar.
            </Alert>
          ) : (
            <>
              <Typography sx={{ fontWeight: 600, mb: 1 }}>
                Selecione os processos necessários
              </Typography>

              <List dense>
                {processosDisponiveis.map((processo) => (
                  <ListItem key={processo.id} disablePadding>
                    <FormControlLabel
                      sx={{
                        width: "100%",
                        py: 0.5,
                        "& .MuiFormControlLabel-label": {
                          flex: 1,
                        },
                      }}
                      control={
                        <Checkbox
                          checked={processosSelecionados.includes(processo.id)}
                          onChange={() => alternarProcesso(processo.id)}
                          sx={{
                            color: "#94a3b8",
                            "&.Mui-checked": {
                              color: "#e04f11",
                            },
                          }}
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {processo.name}
                          </Typography>

                          {processo.description && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {processo.description}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>

              {processosSelecionados.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />

                  <Typography sx={{ fontWeight: 600, mb: 1 }}>
                    Ordem de execução
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    Use as setas para definir a sequência dos processos.
                  </Typography>

                  <Stack spacing={1} sx={{ mt: 2 }}>
                    {processosSelecionados.map((processoId, index) => {
                      const processo = processosDisponiveis.find(
                        (item) => item.id === processoId,
                      );

                      if (!processo) return null;

                      return (
                        <Paper
                          key={processo.id}
                          variant="outlined"
                          sx={{
                            p: 1.5,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderRadius: "9px",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1.5,
                              alignItems: "center",
                            }}
                          >
                            <Chip
                              label={index + 1}
                              size="small"
                              sx={{
                                backgroundColor: "#fff1e9",
                                color: "#e04f11",
                                fontWeight: 700,
                              }}
                            />

                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {processo.name}
                            </Typography>
                          </Box>

                          <Stack direction="row" spacing={0.5}>
                            <IconButton
                              size="small"
                              disabled={index === 0 || salvandoProcessos}
                              onClick={() => moverProcesso(index, -1)}
                            >
                              <ArrowUp size={18} />
                            </IconButton>

                            <IconButton
                              size="small"
                              disabled={
                                index === processosSelecionados.length - 1 ||
                                salvandoProcessos
                              }
                              onClick={() => moverProcesso(index, 1)}
                            >
                              <ArrowDown size={18} />
                            </IconButton>

                            <IconButton
                              size="small"
                              color="error"
                              disabled={salvandoProcessos}
                              onClick={() => alternarProcesso(processo.id)}
                            >
                              <X size={18} />
                            </IconButton>
                          </Stack>
                        </Paper>
                      );
                    })}
                  </Stack>
                </>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            p: 2,
            backgroundColor: "#ffffff",
          }}
        >
          <Button
            onClick={fecharModal}
            disabled={salvandoProcessos}
            sx={{
              textTransform: "none",
              color: "#64748b",
            }}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={salvarProcessos}
            disabled={
              carregandoProcessos ||
              salvandoProcessos ||
              processosSelecionados.length === 0
            }
            startIcon={
              salvandoProcessos ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <Plus size={16} />
              )
            }
            sx={{
              backgroundColor: "#e04f11",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#c9430d",
              },
            }}
          >
            {salvandoProcessos ? "Salvando..." : "Salvar processos"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Documento exclusivo para impressão */}
      <OrdemServicoImpressao ordem={ordem} producoes={producoes} />
    </Box>
  );
}
