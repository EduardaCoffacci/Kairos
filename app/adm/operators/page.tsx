
"use client";

import { PatternFormat } from "react-number-format";
import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Switch,
  TextField,
  Typography,
  FormControlLabel,
} from "@mui/material";

import { DataGrid, type GridColDef } from "@mui/x-data-grid";

import { Pencil, Plus, Search, Trash2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Operator {
  id: number;
  name: string;
  phone: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FormularioOperador {
  name: string;
  phone: string;
  active: boolean;
}

const formularioInicial: FormularioOperador = {
  name: "",
  phone: "",
  active: true,
};

export default function OperadoresPage() {
  const [operadores, setOperadores] = useState<Operator[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");

  const [modalAberto, setModalAberto] = useState(false);
  const [modalExclusao, setModalExclusao] = useState(false);

  const [operadorSelecionado, setOperadorSelecionado] =
    useState<Operator | null>(null);

  const [formulario, setFormulario] =
    useState<FormularioOperador>(formularioInicial);

  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState<"success" | "error">(
    "success",
  );

  const [snackbarAberto, setSnackbarAberto] = useState(false);
  const [erro, setErro] = useState("");

  function mostrarMensagem(texto: string, tipo: "success" | "error") {
    setMensagem(texto);
    setTipoMensagem(tipo);
    setSnackbarAberto(true);
  }

  // Carregar operadores ao abrir a página
  useEffect(() => {
    let ativo = true;

    async function carregar() {
      try {
        const resposta = await fetch(`${API_URL}/operators`);

        if (!resposta.ok) {
          throw new Error("Não foi possível carregar os operadores.");
        }

        const dados: Operator[] = await resposta.json();

        if (ativo) {
          setOperadores(dados);
          setErro("");
        }
      } catch (error) {
        if (ativo) {
          const mensagemErro =
            error instanceof Error
              ? error.message
              : "Erro ao carregar operadores.";

          setErro(mensagemErro);
          mostrarMensagem(mensagemErro, "error");
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregar();

    return () => {
      ativo = false;
    };
  }, []);

  // Atualizar lista de operadores
  async function buscarOperadores() {
    const resposta = await fetch(`${API_URL}/operators`);

    if (!resposta.ok) {
      throw new Error("Erro ao atualizar a lista de operadores.");
    }

    const dados: Operator[] = await resposta.json();

    setOperadores(dados);
    setErro("");
  }

  function abrirCadastro() {
    setOperadorSelecionado(null);
    setFormulario(formularioInicial);
    setModalAberto(true);
  }

  function abrirEdicao(operador: Operator) {
    setOperadorSelecionado(operador);

    setFormulario({
      name: operador.name,
      phone: operador.phone,
      active: operador.active,
    });

    setModalAberto(true);
  }

  function fecharModal() {
    if (salvando) return;

    setModalAberto(false);
    setOperadorSelecionado(null);
    setFormulario(formularioInicial);
  }

  function atualizarCampo<K extends keyof FormularioOperador>(
    campo: K,
    valor: FormularioOperador[K],
  ) {
    setFormulario((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  // Cadastrar ou editar operador
  async function salvarOperador() {
    if (!formulario.name.trim() || !formulario.phone.trim()) {
      mostrarMensagem("Preencha o nome e o telefone.", "error");
      return;
    }

    setSalvando(true);

    const editando = Boolean(operadorSelecionado);

    try {
      const url = editando
        ? `${API_URL}/operators/${operadorSelecionado!.id}`
        : `${API_URL}/operators`;

      const resposta = await fetch(url, {
        method: editando ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formulario.name.trim(),
          phone: formulario.phone.trim(),
          active: formulario.active,
        }),
      });

      if (!resposta.ok) {
        const erroResposta = await resposta.json().catch(() => null);

        throw new Error(
          Array.isArray(erroResposta?.message)
            ? erroResposta.message.join(", ")
            : erroResposta?.message || "Não foi possível salvar o operador.",
        );
      }

      setModalAberto(false);
      setOperadorSelecionado(null);
      setFormulario(formularioInicial);

      mostrarMensagem(
        editando
          ? "Operador atualizado com sucesso!"
          : "Operador cadastrado com sucesso!",
        "success",
      );

      try {
        await buscarOperadores();
      } catch {
        mostrarMensagem(
          "Operador salvo, mas não foi possível atualizar a lista.",
          "error",
        );
      }
    } catch (error) {
      mostrarMensagem(
        error instanceof Error ? error.message : "Erro ao salvar operador.",
        "error",
      );
    } finally {
      setSalvando(false);
    }
  }

  function confirmarExclusao(operador: Operator) {
    setOperadorSelecionado(operador);
    setModalExclusao(true);
  }

  // Desativar operador
  async function excluirOperador() {
    if (!operadorSelecionado || excluindo) return;

    setExcluindo(true);

    try {
      const resposta = await fetch(
        `${API_URL}/operators/${operadorSelecionado.id}`,
        {
          method: "DELETE",
        },
      );

      if (!resposta.ok) {
        const erroResposta = await resposta.json().catch(() => null);

        throw new Error(
          erroResposta?.message || "Não foi possível desativar o operador.",
        );
      }

      setModalExclusao(false);
      setOperadorSelecionado(null);

      mostrarMensagem("Operador desativado com sucesso!", "success");

      try {
        await buscarOperadores();
      } catch {
        mostrarMensagem(
          "Operador desativado, mas não foi possível atualizar a lista.",
          "error",
        );
      }
    } catch (error) {
      mostrarMensagem(
        error instanceof Error
          ? error.message
          : "Não foi possível desativar o operador.",
        "error",
      );
    } finally {
      setExcluindo(false);
    }
  }

  // Filtrar operadores
  const operadoresFiltrados = operadores.filter((operador) => {
    const termo = busca.toLowerCase().trim();
    const termoNumerico = busca.replace(/\D/g, "");

    return (
      operador.name.toLowerCase().includes(termo) ||
      (termoNumerico.length > 0 && operador.phone.includes(termoNumerico))
    );
  });

  // Colunas do DataGrid
  const columns: GridColDef<Operator>[] = [
    {
      field: "id",
      headerName: "Código",
      width: 100,
      renderCell: (params) => `#${params.row.id}`,
    },
    {
      field: "name",
      headerName: "Nome",
      flex: 1,
      minWidth: 180,
    },
    {
      field: "phone",
      headerName: "Telefone",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "active",
      headerName: "Status",
      width: 130,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Typography
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            fontSize: "13px",
            fontWeight: 600,
            color: params.row.active ? "#15803D" : "#DC2626",
          }}
        >
          {params.row.active ? "Ativo" : "Inativo"}
        </Typography>
      ),
    },
    {
      field: "createdAt",
      headerName: "Data de cadastro",
      width: 160,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        params.row.createdAt
          ? new Date(params.row.createdAt).toLocaleDateString("pt-BR")
          : "-",
    },
    {
      field: "updatedAt",
      headerName: "Última atualização",
      width: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        params.row.updatedAt
          ? new Date(params.row.updatedAt).toLocaleDateString("pt-BR")
          : "-",
    },
    {
      field: "actions",
      headerName: "Ações",
      width: 130,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            width: "100%",
            height: "100%",
          }}
        >
          <IconButton
            onClick={() => abrirEdicao(params.row)}
            title="Editar operador"
            size="small"
            sx={{
              color: "#2563EB",
              backgroundColor: "#EFF6FF",
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "#DBEAFE",
              },
            }}
          >
            <Pencil size={17} />
          </IconButton>

          <IconButton
            onClick={() => confirmarExclusao(params.row)}
            title="Excluir operador"
            size="small"
            sx={{
              color: "#DC2626",
              backgroundColor: "#FEF2F2",
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "#FEE2E2",
              },
            }}
          >
            <Trash2 size={17} />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        backgroundColor: "#F5F6FA",
        minHeight: "100vh",
        width: "100%",
        minWidth: 0,
        overflowX: "hidden",
      }}
    >
      {/* Cabeçalho */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#17233B" }}>
            Operadores
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Gerencie os funcionários responsáveis pela produção.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={abrirCadastro}
          sx={{
            backgroundColor: "#E56A2F",
            "&:hover": { backgroundColor: "#CF5D27" },
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            py: 1.2,
          }}
        >
          Novo operador
        </Button>
      </Box>

      {/* Lista de operadores */}
      <Paper
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 3,
          boxShadow: "none",
          border: "1px solid #e2e8f0",
          width: "100%",
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "#17233B",
            mb: 2,
          }}
        >
          Lista de operadores
        </Typography>

        {/* Pesquisa */}
        <TextField
          fullWidth
          size="small"
          placeholder="Pesquisar por nome ou telefone..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          sx={{ mb: 3, maxWidth: 450 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} color="#64748B" />
                </InputAdornment>
              ),
            },
          }}
        />

        {erro && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {erro}
          </Alert>
        )}

        {/* Rolagem horizontal */}
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
              width: "max(100%, 1100px)",
            }}
          >
            <DataGrid
              rows={operadoresFiltrados}
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
                noRowsLabel: "Nenhum operador encontrado",
              }}
              sx={{
                width: "100%",
                border: "none",

                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#F8FAFC",
                  borderBottom: "1px solid #E2E8F0",
                },

                "& .MuiDataGrid-columnHeaderTitle": {
                  fontWeight: 700,
                  color: "#334155",
                },

                "& .MuiDataGrid-cell": {
                  borderBottom: "1px solid #F1F5F9",
                  color: "#475569",
                },

                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "#F8FAFC",
                },

                "& .MuiDataGrid-footerContainer": {
                  borderTop: "1px solid #E2E8F0",
                },

                "& .MuiDataGrid-columnSeparator": {
                  visibility: "hidden",
                },
              }}
            />
          </Box>
        </Box>
      </Paper>

      {/* Modal de cadastro e edição */}
      <Dialog open={modalAberto} onClose={fecharModal} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700, color: "#17233B" }}>
          {operadorSelecionado ? "Editar operador" : "Novo operador"}
        </DialogTitle>

        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              pt: 1,
            }}
          >
            <TextField
              label="Nome"
              fullWidth
              required
              value={formulario.name}
              onChange={(e) => atualizarCampo("name", e.target.value)}
              slotProps={{
                htmlInput: {
                  maxLength: 100,
                },
              }}
              placeholder="Nome do operador"
            />

            <PatternFormat
              customInput={TextField}
              format="(##) #####-####"
              label="Telefone"
              fullWidth
              required
              value={formulario.phone}
              onValueChange={(values) => atualizarCampo("phone", values.value)}
              placeholder="(00) 00000-0000"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formulario.active}
                  onChange={(e) => atualizarCampo("active", e.target.checked)}
                  color="success"
                />
              }
              label="Operador ativo"
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={fecharModal}
            disabled={salvando}
            sx={{
              textTransform: "none",
              color: "#64748B",
            }}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={salvarOperador}
            disabled={salvando}
            sx={{
              backgroundColor: "#E56A2F",
              "&:hover": { backgroundColor: "#CF5D27" },
              textTransform: "none",
            }}
          >
            {salvando
              ? "Salvando..."
              : operadorSelecionado
                ? "Salvar alterações"
                : "Cadastrar operador"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de exclusão */}
      <Dialog
        open={modalExclusao}
        onClose={() => {
          if (!excluindo) setModalExclusao(false);
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Desativar operador</DialogTitle>

        <DialogContent>
          Deseja realmente desativar o operador{" "}
          <strong>{operadorSelecionado?.name}</strong>?
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setModalExclusao(false)}
            disabled={excluindo}
            sx={{ textTransform: "none" }}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={excluirOperador}
            disabled={excluindo}
            sx={{ textTransform: "none" }}
          >
            {excluindo ? "Desativando..." : "Desativar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mensagens */}
      <Snackbar
        open={snackbarAberto}
        autoHideDuration={4000}
        onClose={() => setSnackbarAberto(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity={tipoMensagem}
          onClose={() => setSnackbarAberto(false)}
          variant="filled"
        >
          {mensagem}
        </Alert>
      </Snackbar>
    </Box>
  );
}
