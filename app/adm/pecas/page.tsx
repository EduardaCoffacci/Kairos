
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import { Pencil, Plus, Search, Trash2 } from "lucide-react";

const API_URL = "http://localhost:3001";

interface Peca {
  id: number;
  nome: string;
  descricao: string | null;
  material: string;
}

export default function PecasPage() {
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [material, setMaterial] = useState("");

  const [pecaSelecionada, setPecaSelecionada] = useState<Peca | null>(null);

  const [dialogCadastro, setDialogCadastro] = useState(false);
  const [dialogEdicao, setDialogEdicao] = useState(false);
  const [dialogExclusao, setDialogExclusao] = useState(false);

  const [processando, setProcessando] = useState(false);

  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState<"success" | "error">(
    "success",
  );
  const [snackbarAberto, setSnackbarAberto] = useState(false);

  // Buscar todas as peças
  useEffect(() => {
    async function buscarPecas() {
      try {
        const resposta = await fetch(`${API_URL}/pecas`);

        if (!resposta.ok) {
          throw new Error("Não foi possível carregar as peças.");
        }

        const dados: Peca[] = await resposta.json();

        setPecas(dados);
      } catch {
        mostrarMensagem("Não foi possível carregar as peças.", "error");
      } finally {
        setCarregando(false);
      }
    }

    buscarPecas();
  }, []);

  // Exibir mensagens
  function mostrarMensagem(
    texto: string,
    tipo: "success" | "error",
  ) {
    setMensagem(texto);
    setTipoMensagem(tipo);
    setSnackbarAberto(true);
  }

  // Abrir cadastro
  function abrirCadastro() {
    setNome("");
    setDescricao("");
    setMaterial("");
    setDialogCadastro(true);
  }

  // Fechar cadastro
  function fecharCadastro() {
    setDialogCadastro(false);
    setNome("");
    setDescricao("");
    setMaterial("");
  }

  // Cadastrar peça
  async function cadastrarPeca() {
    const nomeLimpo = nome.trim();
    const materialLimpo = material.trim();

    if (!nomeLimpo) {
      mostrarMensagem("O nome da peça é obrigatório.", "error");
      return;
    }

    if (nomeLimpo.length > 100) {
      mostrarMensagem(
        "O nome deve ter no máximo 100 caracteres.",
        "error",
      );
      return;
    }

    if (!materialLimpo) {
      mostrarMensagem("O material da peça é obrigatório.", "error");
      return;
    }

    setProcessando(true);

    try {
      const resposta = await fetch(`${API_URL}/pecas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: nomeLimpo,
          descricao: descricao.trim() || undefined,
          material: materialLimpo,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.message || "Não foi possível cadastrar a peça.",
        );
      }

      setPecas((pecasAtuais) => [...pecasAtuais, dados]);

      fecharCadastro();

      mostrarMensagem("Peça cadastrada com sucesso.", "success");
    } catch (error) {
      mostrarMensagem(
        error instanceof Error
          ? error.message
          : "Erro ao cadastrar a peça.",
        "error",
      );
    } finally {
      setProcessando(false);
    }
  }

  // Abrir edição
  function abrirEdicao(peca: Peca) {
    setPecaSelecionada(peca);
    setNome(peca.nome);
    setDescricao(peca.descricao ?? "");
    setMaterial(peca.material ?? "");
    setDialogEdicao(true);
  }

  // Fechar edição
  function fecharEdicao() {
    setDialogEdicao(false);
    setPecaSelecionada(null);
    setNome("");
    setDescricao("");
    setMaterial("");
  }

  // Atualizar peça
  async function atualizarPeca() {
    if (!pecaSelecionada) return;

    const nomeLimpo = nome.trim();
    const materialLimpo = material.trim();

    if (!nomeLimpo) {
      mostrarMensagem("O nome da peça é obrigatório.", "error");
      return;
    }

    if (nomeLimpo.length > 100) {
      mostrarMensagem(
        "O nome deve ter no máximo 100 caracteres.",
        "error",
      );
      return;
    }

    if (!materialLimpo) {
      mostrarMensagem("O material da peça é obrigatório.", "error");
      return;
    }

    setProcessando(true);

    try {
      const resposta = await fetch(
        `${API_URL}/pecas/${pecaSelecionada.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome: nomeLimpo,
            descricao: descricao.trim(),
            material: materialLimpo,
          }),
        },
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.message || "Não foi possível atualizar a peça.",
        );
      }

      setPecas((pecasAtuais) =>
        pecasAtuais.map((peca) =>
          peca.id === pecaSelecionada.id ? dados : peca,
        ),
      );

      fecharEdicao();

      mostrarMensagem("Peça atualizada com sucesso.", "success");
    } catch (error) {
      mostrarMensagem(
        error instanceof Error
          ? error.message
          : "Erro ao atualizar a peça.",
        "error",
      );
    } finally {
      setProcessando(false);
    }
  }

  // Abrir confirmação de exclusão
  function abrirExclusao(peca: Peca) {
    setPecaSelecionada(peca);
    setDialogExclusao(true);
  }

  // Fechar confirmação de exclusão
  function fecharExclusao() {
    setDialogExclusao(false);
    setPecaSelecionada(null);
  }

  // Excluir peça
  async function excluirPeca() {
    if (!pecaSelecionada) return;

    setProcessando(true);

    try {
      const resposta = await fetch(
        `${API_URL}/pecas/${pecaSelecionada.id}`,
        {
          method: "DELETE",
        },
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.message || "Não foi possível excluir a peça.",
        );
      }

      setPecas((pecasAtuais) =>
        pecasAtuais.filter(
          (peca) => peca.id !== pecaSelecionada.id,
        ),
      );

      fecharExclusao();

      mostrarMensagem(
        dados.message || "Peça excluída com sucesso.",
        "success",
      );
    } catch (error) {
      fecharExclusao();

      mostrarMensagem(
        error instanceof Error
          ? error.message
          : "Erro ao excluir a peça.",
        "error",
      );
    } finally {
      setProcessando(false);
    }
  }

  // Filtrar peças pela busca
  const pecasFiltradas = pecas.filter((peca) =>
    `${peca.nome} ${peca.descricao ?? ""} ${peca.material ?? ""}`
      .toLowerCase()
      .includes(busca.toLowerCase()),
  );

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
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#17233B",
            }}
          >
            Peças
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Gerencie as peças utilizadas nas ordens de serviço.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={abrirCadastro}
          sx={{
            backgroundColor: "#E56A2F",
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            px: 2.5,
            "&:hover": {
              backgroundColor: "#CF5D27",
            },
          }}
        >
          Nova peça
        </Button>
      </Box>

      {/* Tabela */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid #EAECF0",
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {carregando ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 250,
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Campo de busca */}
              <Box
                sx={{
                  p: 3,
                  borderBottom: "1px solid #EAECF0",
                }}
              >
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Buscar peça por nome, descrição ou material..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search size={18} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>

              {pecas.length === 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 250,
                    p: 3,
                  }}
                >
                  <Typography color="text.secondary">
                    Nenhuma peça cadastrada.
                  </Typography>
                </Box>
              ) : pecasFiltradas.length === 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 200,
                    p: 3,
                  }}
                >
                  <Typography color="text.secondary">
                    Nenhuma peça encontrada.
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <strong>ID</strong>
                        </TableCell>

                        <TableCell>
                          <strong>Nome</strong>
                        </TableCell>

                        <TableCell>
                          <strong>Material</strong>
                        </TableCell>

                        <TableCell>
                          <strong>Descrição</strong>
                        </TableCell>

                        <TableCell align="right">
                          <strong>Ações</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {pecasFiltradas.map((peca) => (
                        <TableRow key={peca.id} hover>
                          <TableCell>#{peca.id}</TableCell>

                          <TableCell>{peca.nome}</TableCell>

                          <TableCell>
                            {peca.material || "Não informado"}
                          </TableCell>

                          <TableCell>
                            {peca.descricao || "Sem descrição"}
                          </TableCell>

                          <TableCell align="right">
                            <IconButton
                              aria-label="Editar peça"
                              onClick={() => abrirEdicao(peca)}
                              sx={{ color: "#17233B" }}
                            >
                              <Pencil size={18} />
                            </IconButton>

                            <IconButton
                              aria-label="Excluir peça"
                              onClick={() => abrirExclusao(peca)}
                              sx={{ color: "#D14343" }}
                            >
                              <Trash2 size={18} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialog de cadastro */}
      <Dialog
        open={dialogCadastro}
        onClose={processando ? undefined : fecharCadastro}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            color: "#17233B",
          }}
        >
          Nova peça
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            slotProps={{
              htmlInput: {
                maxLength: 100,
              },
            }}
            required
            sx={{ mt: 1, mb: 2 }}
          />

          <TextField
            fullWidth
            label="Material"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            multiline
            minRows={3}
          />
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={fecharCadastro}
            disabled={processando}
            sx={{
              textTransform: "none",
              color: "#667085",
            }}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={cadastrarPeca}
            disabled={processando}
            sx={{
              textTransform: "none",
              backgroundColor: "#E56A2F",
              "&:hover": {
                backgroundColor: "#CF5D27",
              },
            }}
          >
            {processando ? "Cadastrando..." : "Cadastrar peça"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de edição */}
      <Dialog
        open={dialogEdicao}
        onClose={processando ? undefined : fecharEdicao}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            color: "#17233B",
          }}
        >
          Editar peça
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            slotProps={{
              htmlInput: {
                maxLength: 100,
              },
            }}
            required
            sx={{ mt: 1, mb: 2 }}
          />

          <TextField
            fullWidth
            label="Material"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            multiline
            minRows={3}
          />
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={fecharEdicao}
            disabled={processando}
            sx={{
              textTransform: "none",
              color: "#667085",
            }}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={atualizarPeca}
            disabled={processando}
            sx={{
              textTransform: "none",
              backgroundColor: "#E56A2F",
              "&:hover": {
                backgroundColor: "#CF5D27",
              },
            }}
          >
            {processando ? "Salvando..." : "Salvar alterações"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de exclusão */}
      <Dialog
        open={dialogExclusao}
        onClose={processando ? undefined : fecharExclusao}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Excluir peça
        </DialogTitle>

        <DialogContent>
          <Typography color="text.secondary">
            Tem certeza de que deseja excluir a peça{" "}
            <strong>{pecaSelecionada?.nome}</strong>?
          </Typography>

          <Typography
            color="text.secondary"
            variant="body2"
            sx={{ mt: 1 }}
          >
            Essa ação não poderá ser desfeita.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={fecharExclusao}
            disabled={processando}
            sx={{
              textTransform: "none",
              color: "#667085",
            }}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={excluirPeca}
            disabled={processando}
            sx={{ textTransform: "none" }}
          >
            {processando ? "Excluindo..." : "Confirmar exclusão"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mensagens de sucesso e erro */}
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
