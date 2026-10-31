
"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import ModalNovoCliente from "./ModalNovoCliente";
import ModalEditarCliente from "./ModalEditarCliente";

import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import { DataGrid, type GridColDef } from "@mui/x-data-grid";

interface Cliente {
  id: number;
  nome: string;
  cnpj: string;
  telefone: string;
  email: string | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Clientes() {
  const [modalAberto, setModalAberto] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [clienteEditando, setClienteEditando] = useState<number | null>(null);
  const [clienteExcluindo, setClienteExcluindo] = useState<Cliente | null>(
    null,
  );
  const [excluindo, setExcluindo] = useState(false);

  // Busca todos os clientes ou pesquisa pelo termo informado.
  const buscarClientes = useCallback(async (termo = "") => {
    try {
      const rota = termo
        ? `/clients/search?searchTerm=${encodeURIComponent(termo)}`
        : "/clients";

      const resposta = await fetch(`${API_URL}${rota}`);

      if (!resposta.ok) {
        throw new Error();
      }

      const dados = await resposta.json();

      setClientes(dados);
      setErro("");
    } catch {
      setErro("Não foi possível carregar os clientes.");
    } finally {
      setCarregando(false);
    }
  }, []);

  // Exclui o cliente selecionado.
  async function excluirCliente() {
    if (!clienteExcluindo) return;

    try {
      setExcluindo(true);
      setErro("");

      const resposta = await fetch(
        `${API_URL}/clients/${clienteExcluindo.id}`,
        {
          method: "DELETE",
        },
      );

      if (!resposta.ok) {
        throw new Error("Não foi possível excluir o cliente.");
      }

      setClienteExcluindo(null);

      await buscarClientes(busca.trim());
    } catch (error) {
      setErro(
        error instanceof Error ? error.message : "Erro ao excluir cliente.",
      );
    } finally {
      setExcluindo(false);
    }
  }

  // Executa a pesquisa após 300 ms sem digitação.
  useEffect(() => {
    const timer = setTimeout(() => {
      buscarClientes(busca.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [busca, buscarClientes]);

  const columns: GridColDef<Cliente>[] = [
    {
      field: "nome",
      headerName: "Cliente",
      flex: 1.3,
      minWidth: 180,
    },
    {
      field: "cnpj",
      headerName: "CNPJ",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "telefone",
      headerName: "Telefone",
      flex: 1,
      minWidth: 140,
    },
    {
      field: "email",
      headerName: "E-mail",
      flex: 1.2,
      minWidth: 180,
      valueGetter: (value) => value || "—",
    },
    {
      field: "acoes",
      headerName: "Ações",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <IconButton
            title="Editar cliente"
            aria-label={`Editar ${params.row.nome}`}
            onClick={() => setClienteEditando(params.row.id)}
            size="small"
            sx={{
              color: "#64748b",
              "&:hover": {
                color: "#e04f11",
                backgroundColor: "#fff7ed",
              },
            }}
          >
            <Pencil size={18} />
          </IconButton>

          <IconButton
            title="Excluir cliente"
            aria-label={`Excluir ${params.row.nome}`}
            onClick={() => setClienteExcluindo(params.row)}
            size="small"
            sx={{
              color: "#64748b",
              "&:hover": {
                color: "#dc2626",
                backgroundColor: "#fef2f2",
              },
            }}
          >
            <Trash2 size={18} />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box className="min-h-screen bg-slate-50 p-6">
      <Box className="mx-auto max-w-7xl">
        {/* Cabeçalho */}
        <Box className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#1e293b",
                fontSize: { xs: "1.5rem", md: "1.875rem" },
              }}
            >
              Clientes
            </Typography>

            <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
              Gerencie os clientes cadastrados no sistema.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={() => setModalAberto(true)}
            sx={{
              backgroundColor: "#e04f11",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "9px",
              px: 2.5,
              py: 1.2,
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#c9430d",
                boxShadow: "none",
              },
            }}
          >
            Novo cliente
          </Button>
        </Box>

        {/* Tabela de clientes */}
        <Paper
          elevation={0}
          sx={{
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          {/* Pesquisa */}
          <Box
            sx={{
              p: 2.5,
              borderBottom: "1px solid #e2e8f0",
              backgroundColor: "#fff",
            }}
          >
            <TextField
              fullWidth
              size="small"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome ou CNPJ..."
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={19} color="#94a3b8" />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                maxWidth: 480,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "9px",
                  backgroundColor: "#fff",
                },
              }}
            />
          </Box>

          {/* Mensagem de erro */}
          {erro && (
            <Box sx={{ p: 2 }}>
              <Alert severity="error">{erro}</Alert>
            </Box>
          )}

          {/* DataGrid */}
          <DataGrid
            rows={clientes}
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
      </Box>

      {/* Cadastro */}
      <ModalNovoCliente
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        onSalvo={() => buscarClientes()}
      />

      {/* Edição */}
      <ModalEditarCliente
        aberto={clienteEditando !== null}
        clienteId={clienteEditando}
        onFechar={() => setClienteEditando(null)}
        onSalvo={() => buscarClientes(busca.trim())}
      />

      {/* Confirmação de exclusão */}
      <Dialog
        open={clienteExcluindo !== null}
        onClose={() => {
          if (!excluindo) setClienteExcluindo(null);
        }}
        fullWidth
        maxWidth="xs"
        slotProps={{
          paper: {
            sx: {
              borderRadius: "14px",
              p: 1,
            },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#1e293b" }}>
          Excluir cliente
        </DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ color: "#64748b" }}>
            Tem certeza que deseja excluir esse cliente?
          </DialogContentText>

          {clienteExcluindo && (
            <Typography
              sx={{
                mt: 1.5,
                fontWeight: 600,
                color: "#334155",
              }}
            >
              {clienteExcluindo.nome}
            </Typography>
          )}

          <Typography
            variant="caption"
            sx={{ display: "block", mt: 2, color: "#94a3b8" }}
          >
            Essa ação não poderá ser desfeita.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 2.5, pb: 2 }}>
          <Button
            onClick={() => setClienteExcluindo(null)}
            disabled={excluindo}
            sx={{
              textTransform: "none",
              color: "#64748b",
            }}
          >
            Cancelar
          </Button>

          <Button
            onClick={excluirCliente}
            disabled={excluindo}
            variant="contained"
            color="error"
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              boxShadow: "none",
            }}
          >
            {excluindo ? "Excluindo..." : "Excluir"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
