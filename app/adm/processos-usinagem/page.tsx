"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Tooltip,
  Snackbar,
} from "@mui/material";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  RefreshCw,
  X,
  ListChecks,
} from "lucide-react";

// API
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  (process.env.NODE_ENV === "development" ? "http://localhost:3001" : "");

// Tipagem
interface Processo {
  id: number;
  name: string;
  description: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FormularioProcesso {
  name: string;
  description: string;
  active: boolean;
}

const formularioInicial: FormularioProcesso = {
  name: "",
  description: "",
  active: true,
};

// Extrair mensagem de erro da API
async function obterErro(
  resposta: Response,
  mensagemPadrao: string,
): Promise<string> {
  try {
    const dados = await resposta.json();

    if (Array.isArray(dados.message)) {
      return dados.message.join(", ");
    }

    if (typeof dados.message === "string") {
      return dados.message;
    }

    return mensagemPadrao;
  } catch {
    return mensagemPadrao;
  }
}

export default function ProcessosUsinagemPage() {
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [pesquisa, setPesquisa] = useState("");

  const [modalAberto, setModalAberto] = useState(false);
  const [processoEditando, setProcessoEditando] = useState<Processo | null>(
    null,
  );

  const [formulario, setFormulario] =
    useState<FormularioProcesso>(formularioInicial);

  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [erroModal, setErroModal] = useState("");

  const [processoExcluir, setProcessoExcluir] = useState<Processo | null>(null);

  const [excluindo, setExcluindo] = useState(false);
  const [processoAtualizando, setProcessoAtualizando] = useState<number | null>(
    null,
  );

  const [snackbar, setSnackbar] = useState({
    aberto: false,
    mensagem: "",
    tipo: "success" as "success" | "error",
  });

  // Buscar processos
  const carregarProcessos = useCallback(async (mostrarCarregamento = true) => {
    if (mostrarCarregamento) {
      setCarregando(true);
    }

    setErro("");

    try {
      const resposta = await fetch(`${API_URL}/machining-processes`, {
        method: "GET",
        credentials: "include",
      });

      if (!resposta.ok) {
        throw new Error(
          await obterErro(resposta, "Não foi possível carregar os processos."),
        );
      }

      const dados: Processo[] = await resposta.json();

      setProcessos(dados);
    } catch (error) {
      setErro(
        error instanceof Error ? error.message : "Erro ao carregar processos.",
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    let ativo = true;

    async function buscarProcessos() {
      setErro("");

      try {
        const resposta = await fetch(`${API_URL}/machining-processes`, {
          method: "GET",
          credentials: "include",
        });

        if (!resposta.ok) {
          throw new Error(
            await obterErro(
              resposta,
              "Não foi possível carregar os processos.",
            ),
          );
        }

        const dados: Processo[] = await resposta.json();

        if (ativo) {
          setProcessos(dados);
        }
      } catch (error) {
        if (ativo) {
          setErro(
            error instanceof Error
              ? error.message
              : "Erro ao carregar processos.",
          );
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    void buscarProcessos();

    return () => {
      ativo = false;
    };
  }, []);

  // Abrir cadastro
  function abrirNovoProcesso() {
    setProcessoEditando(null);
    setFormulario(formularioInicial);
    setErroModal("");
    setModalAberto(true);
  }

  // Abrir edição
  function abrirEdicao(processo: Processo) {
    setProcessoEditando(processo);

    setFormulario({
      name: processo.name,
      description: processo.description ?? "",
      active: processo.active,
    });

    setErroModal("");
    setModalAberto(true);
  }

  // Fechar modal
  function fecharModal() {
    if (salvando) return;

    setModalAberto(false);
    setProcessoEditando(null);
    setFormulario(formularioInicial);
    setErroModal("");
  }

  // Salvar processo
  async function salvarProcesso() {
    if (!formulario.name.trim()) {
      setErroModal("Informe o nome do processo.");
      return;
    }

    setSalvando(true);
    setErroModal("");

    try {
      const editando = Boolean(processoEditando);

      const url = editando
        ? `${API_URL}/machining-processes/${processoEditando!.id}`
        : `${API_URL}/machining-processes`;

      const resposta = await fetch(url, {
        method: editando ? "PATCH" : "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formulario.name.trim(),
          description: formulario.description.trim() || null,
          active: formulario.active,
        }),
      });

      if (!resposta.ok) {
        throw new Error(
          await obterErro(resposta, "Não foi possível salvar o processo."),
        );
      }

      await carregarProcessos(false);

      setModalAberto(false);
      setProcessoEditando(null);
      setFormulario(formularioInicial);

      setSnackbar({
        aberto: true,
        mensagem: editando
          ? "Processo atualizado com sucesso!"
          : "Processo cadastrado com sucesso!",
        tipo: "success",
      });
    } catch (error) {
      setErroModal(
        error instanceof Error ? error.message : "Erro ao salvar processo.",
      );
    } finally {
      setSalvando(false);
    }
  }

  // Ativar ou desativar
  async function alterarStatus(processo: Processo) {
    setProcessoAtualizando(processo.id);

    try {
      const resposta = await fetch(
        `${API_URL}/machining-processes/${processo.id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            active: !processo.active,
          }),
        },
      );

      if (!resposta.ok) {
        throw new Error(
          await obterErro(resposta, "Não foi possível alterar o status."),
        );
      }

      await carregarProcessos(false);

      setSnackbar({
        aberto: true,
        mensagem: processo.active
          ? "Processo desativado."
          : "Processo ativado.",
        tipo: "success",
      });
    } catch (error) {
      setSnackbar({
        aberto: true,
        mensagem:
          error instanceof Error ? error.message : "Erro ao alterar status.",
        tipo: "error",
      });
    } finally {
      setProcessoAtualizando(null);
    }
  }

  // Excluir processo
  async function excluirProcesso() {
    if (!processoExcluir) return;

    setExcluindo(true);

    try {
      const resposta = await fetch(
        `${API_URL}/machining-processes/${processoExcluir.id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!resposta.ok) {
        throw new Error(
          await obterErro(resposta, "Não foi possível excluir o processo."),
        );
      }

      const nome = processoExcluir.name;

      setProcessoExcluir(null);

      await carregarProcessos(false);

      setSnackbar({
        aberto: true,
        mensagem: `Processo "${nome}" excluído com sucesso!`,
        tipo: "success",
      });
    } catch (error) {
      setSnackbar({
        aberto: true,
        mensagem:
          error instanceof Error ? error.message : "Erro ao excluir processo.",
        tipo: "error",
      });
    } finally {
      setExcluindo(false);
    }
  }

  // Pesquisa
  const processosFiltrados = processos.filter((processo) =>
    processo.name.toLowerCase().includes(pesquisa.toLowerCase().trim()),
  );

  const totalAtivos = processos.filter((processo) => processo.active).length;

  const totalInativos = processos.length - totalAtivos;

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        minHeight: "100vh",
        backgroundColor: "#F4F6F8",
        color: "#111827",
      }}
    >
      {/* Cabeçalho */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <ListChecks size={28} color="#E56A2F" />

            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Processos de Usinagem
            </Typography>
          </Box>

          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Gerencie os processos utilizados na produção das peças.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Tooltip title="Atualizar lista">
            <span>
              <IconButton
                onClick={() => void carregarProcessos()}
                disabled={carregando}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <RefreshCw size={19} />
              </IconButton>
            </span>
          </Tooltip>

          <Button
            variant="contained"
            startIcon={<Plus size={19} />}
            onClick={abrirNovoProcesso}
            sx={{
              backgroundColor: "#E56A2F",
              "&:hover": {
                backgroundColor: "#C95420",
              },
              textTransform: "none",
              borderRadius: 2,
              px: 2.5,
            }}
          >
            Novo processo
          </Button>
        </Box>
      </Box>

      {/* Indicadores */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 3,
        }}
      >
        <Paper variant="outlined" sx={{ p: 2.5, flex: 1, borderRadius: 2 }}>
          <Typography color="text.secondary" variant="body2">
            Total de processos
          </Typography>

          <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
            {processos.length}
          </Typography>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2.5, flex: 1, borderRadius: 2 }}>
          <Typography color="text.secondary" variant="body2">
            Processos ativos
          </Typography>

          <Typography
            variant="h4"
            color="success.main"
            sx={{ mt: 1, fontWeight: 700 }}
          >
            {totalAtivos}
          </Typography>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2.5, flex: 1, borderRadius: 2 }}>
          <Typography color="text.secondary" variant="body2">
            Processos inativos
          </Typography>

          <Typography
            variant="h4"
            color="text.secondary"
            sx={{ mt: 1, fontWeight: 700 }}
          >
            {totalInativos}
          </Typography>
        </Paper>
      </Box>

      {/* Tabela */}
      <Paper
        variant="outlined"
        sx={{
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: 2.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Lista de processos
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Cadastre, edite ou altere o status dos processos.
          </Typography>

          <TextField
            fullWidth
            size="small"
            placeholder="Pesquisar processo pelo nome..."
            value={pesquisa}
            onChange={(event) => setPesquisa(event.target.value)}
            sx={{ mt: 2.5, maxWidth: 450 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={19} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        <Divider />

        {erro && (
          <Alert
            severity="error"
            sx={{ m: 2 }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => void carregarProcessos()}
              >
                Tentar novamente
              </Button>
            }
          >
            {erro}
          </Alert>
        )}

        {carregando ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 8,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#F8FAFC" }}>
                  <TableCell>
                    <Typography sx={{ fontWeight: 700 }}>Processo</Typography>
                  </TableCell>

                  <TableCell>
                    <Typography sx={{ fontWeight: 700 }}>Descrição</Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography sx={{ fontWeight: 700 }}>Status</Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography sx={{ fontWeight: 700 }}>Ações</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {processosFiltrados.map((processo) => (
                  <TableRow key={processo.id} hover>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600 }}>
                        {processo.name}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {processo.description || "Sem descrição"}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Chip
                        label={processo.active ? "Ativo" : "Inativo"}
                        color={processo.active ? "success" : "default"}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <Tooltip
                          title={
                            processo.active
                              ? "Desativar processo"
                              : "Ativar processo"
                          }
                        >
                          <span>
                            <Switch
                              size="small"
                              checked={processo.active}
                              disabled={processoAtualizando === processo.id}
                              onChange={() => void alterarStatus(processo)}
                              color="success"
                            />
                          </span>
                        </Tooltip>

                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            onClick={() => abrirEdicao(processo)}
                            color="primary"
                          >
                            <Pencil size={18} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Excluir">
                          <IconButton
                            size="small"
                            onClick={() => setProcessoExcluir(processo)}
                            color="error"
                          >
                            <Trash2 size={18} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}

                {processosFiltrados.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Box
                        sx={{
                          py: 5,
                          textAlign: "center",
                        }}
                      >
                        <Typography color="text.secondary">
                          {pesquisa
                            ? "Nenhum processo encontrado."
                            : "Nenhum processo cadastrado."}
                        </Typography>

                        {!pesquisa && (
                          <Button
                            startIcon={<Plus size={18} />}
                            onClick={abrirNovoProcesso}
                            sx={{
                              mt: 2,
                              color: "#E56A2F",
                              textTransform: "none",
                            }}
                          >
                            Cadastrar primeiro processo
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Modal de cadastro e edição */}
      <Dialog open={modalAberto} onClose={fecharModal} fullWidth maxWidth="sm">
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {processoEditando ? "Editar processo" : "Novo processo"}
            </Typography>

            <IconButton onClick={fecharModal} disabled={salvando} size="small">
              <X size={20} />
            </IconButton>
          </Box>
        </DialogTitle>

        <Divider />

        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
              pt: 1,
            }}
          >
            {erroModal && <Alert severity="error">{erroModal}</Alert>}

            <TextField
              label="Nome do processo"
              fullWidth
              required
              value={formulario.name}
              onChange={(event) =>
                setFormulario((anterior) => ({
                  ...anterior,
                  name: event.target.value,
                }))
              }
              placeholder="Ex.: Torneamento"
            />

            <TextField
              label="Descrição"
              fullWidth
              multiline
              minRows={3}
              value={formulario.description}
              onChange={(event) =>
                setFormulario((anterior) => ({
                  ...anterior,
                  description: event.target.value,
                }))
              }
              placeholder="Descreva o processo (opcional)"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formulario.active}
                  onChange={(event) =>
                    setFormulario((anterior) => ({
                      ...anterior,
                      active: event.target.checked,
                    }))
                  }
                  color="success"
                />
              }
              label="Processo ativo"
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={fecharModal} disabled={salvando} color="inherit">
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={() => void salvarProcesso()}
            disabled={salvando}
            sx={{
              backgroundColor: "#E56A2F",
              "&:hover": {
                backgroundColor: "#C95420",
              },
              textTransform: "none",
            }}
          >
            {salvando ? (
              <CircularProgress size={22} color="inherit" />
            ) : processoEditando ? (
              "Salvar alterações"
            ) : (
              "Cadastrar processo"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmação de exclusão */}
      <Dialog
        open={Boolean(processoExcluir)}
        onClose={() => {
          if (!excluindo) {
            setProcessoExcluir(null);
          }
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Excluir processo</DialogTitle>

        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir o processo{" "}
            <strong>{processoExcluir?.name}</strong>?
          </Typography>

          <Alert severity="warning" sx={{ mt: 2 }}>
            Essa ação não poderá ser desfeita.
          </Alert>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            color="inherit"
            disabled={excluindo}
            onClick={() => setProcessoExcluir(null)}
          >
            Cancelar
          </Button>

          <Button
            color="error"
            variant="contained"
            disabled={excluindo}
            onClick={() => void excluirProcesso()}
          >
            {excluindo ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Excluir"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mensagem de sucesso ou erro */}
      <Snackbar
        open={snackbar.aberto}
        autoHideDuration={4000}
        onClose={() =>
          setSnackbar((anterior) => ({
            ...anterior,
            aberto: false,
          }))
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity={snackbar.tipo}
          variant="filled"
          onClose={() =>
            setSnackbar((anterior) => ({
              ...anterior,
              aberto: false,
            }))
          }
        >
          {snackbar.mensagem}
        </Alert>
      </Snackbar>
    </Box>
  );
}
