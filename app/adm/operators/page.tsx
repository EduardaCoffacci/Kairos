"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Snackbar,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  FormControlLabel,
} from "@mui/material";

import { Pencil, Plus, Search, Trash2 } from "lucide-react";

const API_URL = "http://localhost:3001";

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
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState<"success" | "error">(
    "success",
  );
  const [snackbarAberto, setSnackbarAberto] = useState(false);

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
        }
      } catch (error) {
        if (ativo) {
          mostrarMensagem(
            error instanceof Error
              ? error.message
              : "Erro ao carregar operadores.",
            "error",
          );
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

  // Buscar operadores novamente após alterações
  async function buscarOperadores() {
    try {
      const resposta = await fetch(`${API_URL}/operators`);

      if (!resposta.ok) {
        throw new Error("Erro ao atualizar a lista de operadores.");
      }

      const dados: Operator[] = await resposta.json();

      setOperadores(dados);
    } catch (error) {
      mostrarMensagem(
        error instanceof Error
          ? error.message
          : "Erro ao atualizar operadores.",
        "error",
      );
    }
  }

  function mostrarMensagem(texto: string, tipo: "success" | "error") {
    setMensagem(texto);
    setTipoMensagem(tipo);
    setSnackbarAberto(true);
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

  async function salvarOperador() {
    if (!formulario.name.trim() || !formulario.phone.trim()) {
      mostrarMensagem("Preencha o nome e o telefone.", "error");
      return;
    }

    setSalvando(true);

    try {
      const editando = Boolean(operadorSelecionado);

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
        const erro = await resposta.json().catch(() => null);

        throw new Error(
          Array.isArray(erro?.message)
            ? erro.message.join(", ")
            : erro?.message || "Não foi possível salvar o operador.",
        );
      }

      await buscarOperadores();

      mostrarMensagem(
        editando
          ? "Operador atualizado com sucesso!"
          : "Operador cadastrado com sucesso!",
        "success",
      );

      fecharModal();
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

  async function excluirOperador() {
    if (!operadorSelecionado) return;

    try {
      const resposta = await fetch(
        `${API_URL}/operators/${operadorSelecionado.id}`,
        {
          method: "DELETE",
        },
      );

      if (!resposta.ok) {
        const erro = await resposta.json().catch(() => null);

        throw new Error(
          erro?.message || "Não foi possível desativar o operador.",
        );
      }

      await buscarOperadores();

      mostrarMensagem("Operador desativado com sucesso!", "success");

      setModalExclusao(false);
      setOperadorSelecionado(null);
    } catch (error) {
      mostrarMensagem(
        error instanceof Error
          ? error.message
          : "Não foi possível desativar o operador.",
        "error",
      );
    }
  }

  const operadoresFiltrados = operadores.filter((operador) => {
    const termo = busca.toLowerCase();

    return (
      operador.name.toLowerCase().includes(termo) ||
      operador.phone.toLowerCase().includes(termo)
    );
  });

  const totalAtivos = operadores.filter((operador) => operador.active).length;

  const totalInativos = operadores.length - totalAtivos;

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        backgroundColor: "#F5F6FA",
        minHeight: "100vh",
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

      {/* Indicadores */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(3, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Card sx={{ borderRadius: 3, boxShadow: "none" }}>
          <CardContent>
            <Typography color="text.secondary">Total de operadores</Typography>

            <Typography variant="h4" sx={{ fontWeight: 700, color: "#219653" }}>
              {totalAtivos}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3, boxShadow: "none" }}>
          <CardContent>
            <Typography color="text.secondary">Operadores ativos</Typography>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#219653",
              }}
            >
              {totalAtivos}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3, boxShadow: "none" }}>
          <CardContent>
            <Typography color="text.secondary">Operadores inativos</Typography>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#D97706",
              }}
            >
              {totalInativos}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Tabela */}
      <Card sx={{ borderRadius: 3, boxShadow: "none" }}>
        <CardContent>
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

          {carregando ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                py: 5,
              }}
            >
              <CircularProgress sx={{ color: "#E56A2F" }} />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#F8FAFC" }}>
                    <TableCell sx={{ fontWeight: 700 }}>Código</TableCell>

                    <TableCell sx={{ fontWeight: 700 }}>Nome</TableCell>

                    <TableCell sx={{ fontWeight: 700 }}>Telefone</TableCell>

                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>

                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      Ações
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {operadoresFiltrados.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                        <Typography sx={{ color: "text.secondary" }}>
                          Nenhum operador encontrado.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    operadoresFiltrados.map((operador) => (
                      <TableRow key={operador.id} hover>
                        <TableCell>#{operador.id}</TableCell>

                        <TableCell sx={{ fontWeight: 600 }}>
                          {operador.name}
                        </TableCell>

                        <TableCell>{operador.phone}</TableCell>

                        <TableCell>
                          <Box
                            component="span"
                            sx={{
                              display: "inline-block",
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 2,
                              fontSize: 12,
                              fontWeight: 600,
                              backgroundColor: operador.active
                                ? "#DCFCE7"
                                : "#FEE2E2",
                              color: operador.active ? "#15803D" : "#B91C1C",
                            }}
                          >
                            {operador.active ? "Ativo" : "Inativo"}
                          </Box>
                        </TableCell>

                        <TableCell align="right">
                          <IconButton
                            onClick={() => abrirEdicao(operador)}
                            sx={{ color: "#64748B" }}
                            title="Editar"
                          >
                            <Pencil size={18} />
                          </IconButton>

                          <IconButton
                            onClick={() => confirmarExclusao(operador)}
                            sx={{ color: "#DC2626" }}
                            title="Excluir"
                          >
                            <Trash2 size={18} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

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
            sx={{ textTransform: "none", color: "#64748B" }}
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
        onClose={() => setModalExclusao(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Excluir operador</DialogTitle>

        <DialogContent>
          Deseja realmente excluir o operador{" "}
          <strong>{operadorSelecionado?.name}</strong>?
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setModalExclusao(false)}
            sx={{ textTransform: "none" }}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={excluirOperador}
            sx={{ textTransform: "none" }}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mensagens */}
      <Snackbar
        open={snackbarAberto}
        autoHideDuration={4000}
        onClose={() => setSnackbarAberto(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
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
