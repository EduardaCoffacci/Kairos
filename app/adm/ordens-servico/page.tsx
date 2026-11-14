
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Alert,
  Box,
  Paper,
  Snackbar,
  TextField,
  Typography,
  MenuItem,
  Chip,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from "@mui/material";

import { DataGrid, type GridColDef } from "@mui/x-data-grid";

import {
  Search,
  Plus,
  Pencil,
  Trash2,
  ClipboardList,
} from "lucide-react";

import ModalNovaOrdem from "./ModalNovaOrdem";

interface Cliente {
  id: number;
  nome: string;
}

interface Peca {
  id: number;
  nome: string;
  material?: string;
}

interface ItemOrdem {
  id: number;
  peca: Peca;
  quantidade: number;
}

interface Processo {
  id: number;
  nome?: string;
  descricao?: string;
}

interface Producao {
  id: number;
  itemOrdem: {
    id: number;
    ordem?: {
      id: number;
    };
  };
  process: Processo;
  sequence: number;
  status: string;
}

interface Ordem {
  id: number;
  cliente: Cliente;
  descricao: string;
  status: string;
  dataAbertura: string;
  prazo: string | null;
  valor: number | string;
  itens: ItemOrdem[];
  producoes: Producao[];
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function obterErro(
  resposta: Response,
  mensagemPadrao: string,
) {
  try {
    const dados = await resposta.json();

    return Array.isArray(dados.message)
      ? dados.message.join(", ")
      : dados.message || mensagemPadrao;
  } catch {
    return mensagemPadrao;
  }
}

export default function OrdensServico() {
  const router = useRouter();

  const [ordens, setOrdens] = useState<Ordem[]>([]);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [mensagem, setMensagem] = useState("");
  const [snackbarAberto, setSnackbarAberto] = useState(false);

  const [modalAberto, setModalAberto] = useState(false);
  const [ordemSelecionadaId, setOrdemSelecionadaId] =
    useState<number | null>(null);

  const [ordemParaExcluir, setOrdemParaExcluir] =
    useState<Ordem | null>(null);

  const [excluindo, setExcluindo] = useState(false);

  const buscarOrdens = useCallback(async () => {
    try {
      setCarregando(true);
      setErro("");

      const parametros = new URLSearchParams();

      if (filtroStatus) {
        parametros.append("status", filtroStatus);
      }

      const rota = parametros.toString()
        ? `/orders?${parametros.toString()}`
        : "/orders";

      const resposta = await fetch(`${API_URL}${rota}`);

      if (!resposta.ok) {
        throw new Error(
          await obterErro(
            resposta,
            "Não foi possível carregar as ordens de serviço.",
          ),
        );
      }

      const dados: Ordem[] = await resposta.json();

      const ordensDetalhadas = await Promise.all(
        dados.map(async (ordem) => {
          const respostaDetalhe = await fetch(
            `${API_URL}/orders/${ordem.id}`,
          );

          if (!respostaDetalhe.ok) {
            throw new Error(
              await obterErro(
                respostaDetalhe,
                `Não foi possível carregar os detalhes da OS-${ordem.id}.`,
              ),
            );
          }

          const detalhe: Ordem = await respostaDetalhe.json();

          return detalhe;
        }),
      );

      const respostaProducao = await fetch(`${API_URL}/production`);

      if (!respostaProducao.ok) {
        throw new Error(
          await obterErro(
            respostaProducao,
            "Não foi possível carregar os processos de produção.",
          ),
        );
      }

      const producoes: Producao[] = await respostaProducao.json();

      const ordensCompletas = ordensDetalhadas.map((ordem) => {
        const producoesDaOrdem = producoes
          .filter(
            (producao) =>
              producao.itemOrdem?.ordem?.id === ordem.id,
          )
          .sort((a, b) => a.sequence - b.sequence);

        return {
          ...ordem,
          itens: ordem.itens ?? [],
          producoes: producoesDaOrdem,
        };
      });

      setOrdens(ordensCompletas);
    } catch (error) {
      const mensagemErro =
        error instanceof Error
          ? error.message
          : "Erro ao carregar as ordens.";

      setErro(mensagemErro);
      setMensagem(mensagemErro);
      setSnackbarAberto(true);
    } finally {
      setCarregando(false);
    }
  }, [filtroStatus]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void buscarOrdens();
    }, 0);

    return () => clearTimeout(timer);
  }, [buscarOrdens]);

  const ordensFiltradas = ordens.filter((ordem) => {
    const termo = busca.trim().toLowerCase();

    if (!termo) return true;

    const cliente = ordem.cliente?.nome?.toLowerCase() ?? "";
    const descricao = ordem.descricao?.toLowerCase() ?? "";

    const pecas = ordem.itens
      .map((item) => item.peca?.nome ?? "")
      .join(" ")
      .toLowerCase();

    const processos = ordem.producoes
      .map(
        (producao) =>
          producao.process?.nome ??
          producao.process?.descricao ??
          "",
      )
      .join(" ")
      .toLowerCase();

    return (
      cliente.includes(termo) ||
      descricao.includes(termo) ||
      pecas.includes(termo) ||
      processos.includes(termo) ||
      String(ordem.id).includes(termo)
    );
  });

  function formatarData(data: string | null) {
    if (!data) return "—";

    const dataFormatada = new Date(
      `${data.substring(0, 10)}T00:00:00`,
    );

    return dataFormatada.toLocaleDateString("pt-BR");
  }

  function formatarValor(valor: number | string) {
    return Number(valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
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
    };

    return cores[status] ?? "default";
  }

  function nomeStatus(status: string) {
    const nomes: Record<string, string> = {
      ABERTA: "Aberta",
      EM_ANDAMENTO: "Em andamento",
      CONCLUIDA: "Concluída",
      CANCELADA: "Cancelada",
    };

    return nomes[status] ?? status;
  }

  function abrirNovaOrdem() {
    setOrdemSelecionadaId(null);
    setModalAberto(true);
  }

  function abrirEdicao(ordem: Ordem) {
    setOrdemSelecionadaId(ordem.id);
    setModalAberto(true);
  }

  function abrirDetalhes(ordem: Ordem) {
    router.push(`/adm/ordens-servico/${ordem.id}`);
  }

  function fecharModal() {
    setModalAberto(false);
    setOrdemSelecionadaId(null);
  }

  async function excluirOrdem() {
    if (!ordemParaExcluir) return;

    try {
      setExcluindo(true);
      setErro("");

      const resposta = await fetch(
        `${API_URL}/orders/${ordemParaExcluir.id}`,
        {
          method: "DELETE",
        },
      );

      if (!resposta.ok) {
        throw new Error(
          await obterErro(
            resposta,
            "Não foi possível excluir a ordem de serviço.",
          ),
        );
      }

      setOrdemParaExcluir(null);

      await buscarOrdens();

      setMensagem("Ordem de serviço excluída com sucesso.");
      setSnackbarAberto(true);
    } catch (error) {
      const mensagemErro =
        error instanceof Error
          ? error.message
          : "Não foi possível excluir a ordem.";

      setMensagem(mensagemErro);
      setSnackbarAberto(true);
    } finally {
      setExcluindo(false);
    }
  }

  const columns: GridColDef<Ordem>[] = [
    {
      field: "id",
      headerName: "Nº OS",
      width: 100,
      renderCell: (params) =>
        `OS-${String(params.row.id).padStart(4, "0")}`,
    },
    {
      field: "cliente",
      headerName: "Cliente",
      minWidth: 190,
      flex: 1,
      valueGetter: (_, row) => row.cliente?.nome ?? "—",
    },
    {
      field: "descricao",
      headerName: "Descrição",
      minWidth: 200,
      flex: 1.3,
    },
    {
      field: "pecas",
      headerName: "Peças",
      minWidth: 210,
      flex: 1.2,
      sortable: false,
      renderCell: (params) => {
        const itens = params.row.itens ?? [];

        if (itens.length === 0) {
          return (
            <Typography variant="body2" color="text.secondary">
              Nenhuma peça
            </Typography>
          );
        }

        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 0.5,
              py: 1,
              width: "100%",
            }}
          >
            {itens.map((item) => (
              <Box key={item.id}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#334155",
                    fontWeight: 600,
                    lineHeight: 1.4,
                  }}
                >
                  {item.peca?.nome ?? "Peça sem nome"}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{ color: "#64748b" }}
                >
                  Quantidade: {item.quantidade}
                </Typography>
              </Box>
            ))}
          </Box>
        );
      },
    },
    {
      field: "processos",
      headerName: "Processos",
      minWidth: 260,
      flex: 1.5,
      sortable: false,
      renderCell: (params) => {
        const itens = params.row.itens ?? [];
        const producoes = params.row.producoes ?? [];

        if (itens.length === 0) {
          return (
            <Typography variant="body2" color="text.secondary">
              —
            </Typography>
          );
        }

        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 1,
              py: 1,
              width: "100%",
            }}
          >
            {itens.map((item) => {
              const processosDaPeca = producoes
                .filter(
                  (producao) =>
                    producao.itemOrdem?.id === item.id,
                )
                .sort((a, b) => a.sequence - b.sequence);

              return (
                <Box key={item.id}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#334155",
                      fontWeight: 700,
                      display: "block",
                      mb: 0.5,
                    }}
                  >
                    {item.peca?.nome ?? "Peça"}
                  </Typography>

                  {processosDaPeca.length > 0 ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.5,
                      }}
                    >
                      {processosDaPeca.map((producao) => (
                        <Chip
                          key={producao.id}
                          size="small"
                          label={`${producao.sequence}. ${
                            producao.process?.nome ??
                            producao.process?.descricao ??
                            "Processo"
                          }`}
                          sx={{
                            backgroundColor: "#fff1e9",
                            color: "#c9430d",
                            fontWeight: 600,
                            fontSize: "0.7rem",
                          }}
                        />
                      ))}
                    </Box>
                  ) : (
                    <Typography
                      variant="caption"
                      sx={{ color: "#94a3b8" }}
                    >
                      Sem processos cadastrados
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Box>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 145,
      renderCell: (params) => (
        <Chip
          label={nomeStatus(params.value)}
          color={corStatus(params.value)}
          size="small"
          sx={{ fontWeight: 600 }}
        />
      ),
    },
    {
      field: "dataAbertura",
      headerName: "Abertura",
      width: 120,
      valueFormatter: (value) => formatarData(value),
    },
    {
      field: "prazo",
      headerName: "Prazo",
      width: 120,
      valueFormatter: (value) => formatarData(value),
    },
    {
      field: "valor",
      headerName: "Valor",
      width: 140,
      valueFormatter: (value) => formatarValor(value),
    },
    {
      field: "acoes",
      headerName: "Ações",
      width: 170,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            height: "100%",
          }}
        >
          <Tooltip title="Visualizar ordem" arrow>
            <IconButton
              onClick={() => abrirDetalhes(params.row)}
              sx={{
                width: 34,
                height: 34,
                borderRadius: "8px",
                color: "#475569",
                backgroundColor: "#f1f5f9",
                transition: "all 0.2s ease",
                "&:hover": {
                  color: "#1e293b",
                  backgroundColor: "#e2e8f0",
                },
              }}
            >
              <ClipboardList size={17} strokeWidth={2} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Editar ordem" arrow>
            <IconButton
              onClick={() => abrirEdicao(params.row)}
              sx={{
                width: 34,
                height: 34,
                borderRadius: "8px",
                color: "#e04f11",
                backgroundColor: "#fff1e9",
                transition: "all 0.2s ease",
                "&:hover": {
                  color: "#c9430d",
                  backgroundColor: "#ffe1d1",
                },
              }}
            >
              <Pencil size={17} strokeWidth={2} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Excluir ordem" arrow>
            <IconButton
              onClick={() => setOrdemParaExcluir(params.row)}
              sx={{
                width: 34,
                height: 34,
                borderRadius: "8px",
                color: "#dc2626",
                backgroundColor: "#fef2f2",
                transition: "all 0.2s ease",
                "&:hover": {
                  color: "#b91c1c",
                  backgroundColor: "#fee2e2",
                },
              }}
            >
              <Trash2 size={17} strokeWidth={2} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box
      className="min-h-screen bg-slate-50 p-6"
      sx={{
        width: "100%",
        minWidth: 0,
        overflowX: "hidden",
      }}
    >
      <Box className="mx-auto max-w-7xl" sx={{ minWidth: 0 }}>
        {/* Cabeçalho */}
        <Box
          className="mb-7"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#1e293b",
                fontSize: { xs: "1.5rem", md: "1.875rem" },
              }}
            >
              Ordens de Serviço
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: "#64748b", mt: 0.5 }}
            >
              Gerencie as ordens de serviço cadastradas no sistema.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={abrirNovaOrdem}
            sx={{
              backgroundColor: "#e04f11",
              borderRadius: "9px",
              textTransform: "none",
              fontWeight: 600,
              px: 2.5,
              py: 1.2,
              "&:hover": {
                backgroundColor: "#c9430d",
              },
            }}
          >
            Nova ordem
          </Button>
        </Box>

        {/* Tabela */}
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            minWidth: 0,
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          {/* Pesquisa e filtro */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              p: 2.5,
              borderBottom: "1px solid #e2e8f0",
              backgroundColor: "#fff",
            }}
          >
            <TextField
              size="small"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por cliente, descrição, peça, processo ou OS..."
              slotProps={{
                input: {
                  startAdornment: (
                    <Box sx={{ display: "flex", mr: 1 }}>
                      <Search size={19} color="#94a3b8" />
                    </Box>
                  ),
                },
              }}
              sx={{
                width: { xs: "100%", md: 450 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "9px",
                },
              }}
            />

            <TextField
              select
              size="small"
              label="Status"
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              sx={{
                width: { xs: "100%", sm: 200 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "9px",
                },
              }}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="ABERTA">Aberta</MenuItem>
              <MenuItem value="EM_ANDAMENTO">Em andamento</MenuItem>
              <MenuItem value="CONCLUIDA">Concluída</MenuItem>
              <MenuItem value="CANCELADA">Cancelada</MenuItem>
            </TextField>
          </Box>

          {/* Erro */}
          {erro && (
            <Box sx={{ p: 2 }}>
              <Alert severity="error">{erro}</Alert>
            </Box>
          )}

          {/* Rolagem horizontal única, abaixo da tabela */}
          <Box
            sx={{
              width: "100%",
              minWidth: 0,
              overflowX: "auto",
              overflowY: "hidden",
              scrollbarWidth: "thin",
              scrollbarColor: "#cbd5e1 transparent",

              "&::-webkit-scrollbar": {
                height: "8px",
              },

              "&::-webkit-scrollbar-track": {
                backgroundColor: "#f8fafc",
              },

              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#cbd5e1",
                borderRadius: "10px",
              },

              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#e04f11",
              },
            }}
          >
            <Box
              sx={{
                width: "1700px",
              }}
            >
              <DataGrid
                rows={ordensFiltradas}
                columns={columns}
                loading={carregando}
                getRowId={(row) => row.id}
                getRowHeight={() => "auto"}
                autoHeight
                disableRowSelectionOnClick
                pageSizeOptions={[5, 10, 25]}
                initialState={{
                  pagination: {
                    paginationModel: {
                      page: 0,
                      pageSize: 5,
                    },
                  },
                }}
                localeText={{
                  noRowsLabel: "Nenhuma ordem de serviço encontrada.",
                  footerRowSelected: (count) =>
                    `${count} linha(s) selecionada(s)`,
                }}
                sx={{
                  width: "100%",
                  border: 0,

                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#f8fafc",
                    borderBottom: "1px solid #e2e8f0",
                  },

                  "& .MuiDataGrid-columnHeaderTitle": {
                    color: "#64748b",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  },

                  "& .MuiDataGrid-cell": {
                    color: "#64748b",
                    borderBottom: "1px solid #f1f5f9",
                    display: "flex",
                    alignItems: "center",
                    whiteSpace: "normal",
                    py: 1,
                  },

                  "& .MuiDataGrid-row:hover": {
                    backgroundColor: "#f8fafc",
                  },

                  "& .MuiDataGrid-footerContainer": {
                    borderTop: "1px solid #e2e8f0",
                  },
                }}
              />
            </Box>
          </Box>
        </Paper>

        {/* Modal de criação e edição */}
        <ModalNovaOrdem
          open={modalAberto}
          ordemId={ordemSelecionadaId}
          onClose={fecharModal}
          onSalvo={async (editando) => {
            await buscarOrdens();

            setMensagem(
              editando
                ? "Ordem de serviço atualizada com sucesso."
                : "Ordem de serviço criada com sucesso.",
            );

            setSnackbarAberto(true);
          }}
        />
      </Box>

      {/* Confirmação de exclusão */}
      <Dialog
        open={ordemParaExcluir !== null}
        onClose={
          excluindo ? undefined : () => setOrdemParaExcluir(null)
        }
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle
          sx={{ fontWeight: 700, color: "#1e293b" }}
        >
          Excluir ordem de serviço
        </DialogTitle>

        <DialogContent>
          <Typography color="text.secondary">
            Tem certeza que deseja excluir a ordem{" "}
            <strong>
              OS-
              {String(ordemParaExcluir?.id ?? "").padStart(4, "0")}
            </strong>
            ?
          </Typography>

          <Typography
            variant="body2"
            color="error"
            sx={{ mt: 1.5 }}
          >
            Essa ação também excluirá os itens vinculados a essa ordem.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={() => setOrdemParaExcluir(null)}
            disabled={excluindo}
            sx={{
              color: "#64748b",
              textTransform: "none",
            }}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={excluirOrdem}
            disabled={excluindo}
            sx={{
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {excluindo ? "Excluindo..." : "Excluir"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notificação */}
      <Snackbar
        open={snackbarAberto}
        autoHideDuration={5000}
        onClose={() => setSnackbarAberto(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity={
            mensagem.toLowerCase().includes("sucesso")
              ? "success"
              : "error"
          }
          onClose={() => setSnackbarAberto(false)}
          variant="filled"
        >
          {mensagem}
        </Alert>
      </Snackbar>
    </Box>
  );
}
