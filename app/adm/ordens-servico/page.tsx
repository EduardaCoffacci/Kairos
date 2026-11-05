"use client";

import { useCallback, useEffect, useState } from "react";
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
} from "lucide-react";

import ModalNovaOrdem from "./ModalNovaOrdem";

interface Cliente {
  id: number;
  nome: string;
}

interface Ordem {
  id: number;
  cliente: Cliente;
  descricao: string;
  status: string;
  dataAbertura: string;
  prazo: string | null;
  valor: number | string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

export default function OrdensServico() {
  const [ordens, setOrdens] = useState<Ordem[]>([]);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [mensagem, setMensagem] = useState("");
  const [snackbarAberto, setSnackbarAberto] = useState(false);

  const [modalAberto, setModalAberto] = useState(false);
  const [ordemSelecionadaId, setOrdemSelecionadaId] = useState<number | null>(
    null,
  );

  const [ordemParaExcluir, setOrdemParaExcluir] = useState<Ordem | null>(null);
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
      setOrdens(dados);
    } catch (error) {
      const mensagemErro =
        error instanceof Error ? error.message : "Erro ao carregar as ordens.";

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

    return (
      ordem.cliente?.nome?.toLowerCase().includes(termo) ||
      ordem.descricao?.toLowerCase().includes(termo) ||
      String(ordem.id).includes(termo)
    );
  });

  function formatarData(data: string | null) {
    if (!data) return "—";

    const dataFormatada = new Date(`${data.substring(0, 10)}T00:00:00`);

    return dataFormatada.toLocaleDateString("pt-BR");
  }

  function formatarValor(valor: number | string) {
    return Number(valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function corStatus(status: string) {
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
      width: 90,
      renderCell: (params) => `OS-${String(params.row.id).padStart(4, "0")}`,
    },
    {
      field: "cliente",
      headerName: "Cliente",
      flex: 1.2,
      minWidth: 180,
      valueGetter: (_, row) => row.cliente?.nome ?? "—",
    },
    {
      field: "descricao",
      headerName: "Descrição",
      flex: 1.5,
      minWidth: 200,
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
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
      width: 110,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Tooltip title="Editar ordem">
            <IconButton
              size="small"
              onClick={() => abrirEdicao(params.row)}
              sx={{
                color: "#2563eb",
                "&:hover": {
                  backgroundColor: "#eff6ff",
                },
              }}
            >
              <Pencil size={18} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Excluir ordem">
            <IconButton
              size="small"
              onClick={() => setOrdemParaExcluir(params.row)}
              sx={{
                color: "#dc2626",
                "&:hover": {
                  backgroundColor: "#fef2f2",
                },
              }}
            >
              <Trash2 size={18} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box className="min-h-screen bg-slate-50 p-6">
      <Box className="mx-auto max-w-7xl">
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

            <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
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
              placeholder="Buscar por cliente, descrição ou OS..."
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
                width: { xs: "100%", md: 400 },
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

          {/* DataGrid */}
          <DataGrid
            rows={ordensFiltradas}
            columns={columns}
            loading={carregando}
            getRowId={(row) => row.id}
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
              footerRowSelected: (count) => `${count} linha(s) selecionada(s)`,
            }}
            sx={{
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
              },

              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#f8fafc",
              },

              "& .MuiDataGrid-footerContainer": {
                borderTop: "1px solid #e2e8f0",
              },
            }}
          />
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
        onClose={excluindo ? undefined : () => setOrdemParaExcluir(null)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#1e293b" }}>
          Excluir ordem de serviço
        </DialogTitle>

        <DialogContent>
          <Typography color="text.secondary">
            Tem certeza que deseja excluir a ordem{" "}
            <strong>
              OS-{String(ordemParaExcluir?.id ?? "").padStart(4, "0")}
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
            sx={{ textTransform: "none", fontWeight: 600 }}
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
          severity={mensagem.toLowerCase().includes("sucesso") ? "success" : "error"}
          onClose={() => setSnackbarAberto(false)}
          variant="filled"
        >
          {mensagem}
        </Alert>
      </Snackbar>
    </Box>
  );
}