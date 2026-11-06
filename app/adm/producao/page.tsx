"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
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

import {
  ClipboardList,
  CheckCircle2,
  Clock3,
  PackageCheck,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

const API_URL = "http://localhost:3001";

type StatusProducao = "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDA";

type EtapaProducao =
  | "CORTE"
  | "TORNEAMENTO"
  | "FRESAGEM"
  | "RETIFICA"
  | "ROSQUEAMENTO"
  | "PLAINAMENTO"
  | "ACABAMENTO";

interface Cliente {
  id: number;
  nome: string;
}

interface Ordem {
  id: number;
  prazo?: string | null;
  cliente?: Cliente;
}

interface Peca {
  id: number;
  nome: string;
}

interface ItemOrdem {
  id: number;
  quantidade: number;
  ordem: Ordem;
  peca: Peca;
}

interface Operador {
  id: number;
  name: string;
  phone: string;
  active: boolean;
}

interface Producao {
  id: number;
  itemOrdem: ItemOrdem;
  operador: Operador;
  etapa: EtapaProducao;
  status: StatusProducao;
  dataInicio: string | null;
  dataConclusao: string | null;
  quantidadeProduzida: number;
  quantidadeAprovada: number;
  quantidadeRejeitada: number;
  observacoes: string | null;
}

interface FormularioProducao {
  itemOrdemId: string;
  operadorId: string;
  etapa: EtapaProducao;
  status: StatusProducao;
  quantidadeProduzida: string;
  quantidadeAprovada: string;
  quantidadeRejeitada: string;
  observacoes: string;
}

const etapas: { value: EtapaProducao; label: string }[] = [
  { value: "CORTE", label: "Corte" },
  { value: "TORNEAMENTO", label: "Torneamento" },
  { value: "FRESAGEM", label: "Fresagem" },
  { value: "RETIFICA", label: "Retífica" },
  { value: "ROSQUEAMENTO", label: "Rosqueamento" },
  { value: "PLAINAMENTO", label: "Plainamento" },
  { value: "ACABAMENTO", label: "Acabamento" },
];

const statusOptions: { value: StatusProducao; label: string }[] = [
  { value: "PENDENTE", label: "Pendente" },
  { value: "EM_ANDAMENTO", label: "Em andamento" },
  { value: "CONCLUIDA", label: "Concluída" },
];

const formularioInicial: FormularioProducao = {
  itemOrdemId: "",
  operadorId: "",
  etapa: "CORTE",
  status: "PENDENTE",
  quantidadeProduzida: "0",
  quantidadeAprovada: "0",
  quantidadeRejeitada: "0",
  observacoes: "",
};

function formatarData(data?: string | null) {
  if (!data) return "Não informado";

  const dataFormatada = new Date(`${data.substring(0, 10)}T12:00:00`);

  if (Number.isNaN(dataFormatada.getTime())) {
    return "Não informado";
  }

  return dataFormatada.toLocaleDateString("pt-BR");
}

function nomeEtapa(etapa: EtapaProducao) {
  return etapas.find((item) => item.value === etapa)?.label ?? etapa;
}

function nomeStatus(status: StatusProducao) {
  return statusOptions.find((item) => item.value === status)?.label ?? status;
}

function corStatus(status: StatusProducao) {
  switch (status) {
    case "PENDENTE":
      return {
        backgroundColor: "#FFF4E5",
        color: "#B76E00",
      };

    case "EM_ANDAMENTO":
      return {
        backgroundColor: "#E8F1FF",
        color: "#2563EB",
      };

    case "CONCLUIDA":
      return {
        backgroundColor: "#E7F7ED",
        color: "#16803C",
      };
  }
}

async function lerResposta(resposta: Response) {
  const texto = await resposta.text();

  if (!texto) return {};

  try {
    return JSON.parse(texto);
  } catch {
    return {};
  }
}

export default function ProducaoPage() {
  const [producoes, setProducoes] = useState<Producao[]>([]);
  const [itensOrdem, setItensOrdem] = useState<ItemOrdem[]>([]);
  const [operadores, setOperadores] = useState<Operador[]>([]);

  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("TODOS");
  const [filtroEtapa, setFiltroEtapa] = useState("TODAS");

  const [formulario, setFormulario] =
    useState<FormularioProducao>(formularioInicial);

  const [producaoSelecionada, setProducaoSelecionada] =
    useState<Producao | null>(null);

  const [dialogCadastro, setDialogCadastro] = useState(false);
  const [dialogEdicao, setDialogEdicao] = useState(false);
  const [dialogExclusao, setDialogExclusao] = useState(false);
  const [dialogVisualizacao, setDialogVisualizacao] = useState(false);

  const [processando, setProcessando] = useState(false);

  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState<"success" | "error">(
    "success",
  );
  const [snackbarAberto, setSnackbarAberto] = useState(false);

  function mostrarMensagem(texto: string, tipo: "success" | "error") {
    setMensagem(texto);
    setTipoMensagem(tipo);
    setSnackbarAberto(true);
  }

  async function buscarDados() {
    try {
      const [respostaProducoes, respostaItens, respostaOperadores] =
        await Promise.all([
          fetch(`${API_URL}/production`),
          fetch(`${API_URL}/order-item`),
          fetch(`${API_URL}/operators`),
        ]);

      const [dadosProducoes, dadosItens, dadosOperadores] = await Promise.all([
        lerResposta(respostaProducoes),
        lerResposta(respostaItens),
        lerResposta(respostaOperadores),
      ]);

      console.log("Operadores recebidos da API:", dadosOperadores);

      if (!respostaProducoes.ok) {
        throw new Error("Não foi possível carregar as produções.");
      }

      if (!respostaItens.ok) {
        throw new Error("Não foi possível carregar os itens das ordens.");
      }

      if (!respostaOperadores.ok) {
        throw new Error("Não foi possível carregar os operadores.");
      }

      setProducoes(Array.isArray(dadosProducoes) ? dadosProducoes : []);
      setItensOrdem(Array.isArray(dadosItens) ? dadosItens : []);
      setOperadores(Array.isArray(dadosOperadores) ? dadosOperadores : []);
    } catch (error) {
      mostrarMensagem(
        error instanceof Error ? error.message : "Erro ao carregar os dados.",
        "error",
      );
    } finally {
      setCarregando(false);
    }
  }
  useEffect(() => {
    const carregar = async () => {
      await buscarDados();
    };

    carregar();
  }, []);

  function atualizarCampo<K extends keyof FormularioProducao>(
    campo: K,
    valor: FormularioProducao[K],
  ) {
    setFormulario((atual) => ({
      ...atual,
      [campo]: valor,
    }));
  }

  function abrirCadastro() {
    setFormulario(formularioInicial);
    setProducaoSelecionada(null);
    setDialogCadastro(true);
  }

  function fecharCadastro() {
    setDialogCadastro(false);
    setFormulario(formularioInicial);
  }

  function abrirEdicao(producao: Producao) {
    setProducaoSelecionada(producao);

    setFormulario({
      itemOrdemId: String(producao.itemOrdem?.id ?? ""),
      operadorId: String(producao.operador?.id ?? ""),
      etapa: producao.etapa,
      status: producao.status,
      quantidadeProduzida: String(producao.quantidadeProduzida),
      quantidadeAprovada: String(producao.quantidadeAprovada),
      quantidadeRejeitada: String(producao.quantidadeRejeitada),
      observacoes: producao.observacoes ?? "",
    });

    setDialogEdicao(true);
  }

  function fecharEdicao() {
    setDialogEdicao(false);
    setProducaoSelecionada(null);
    setFormulario(formularioInicial);
  }

  function validarFormulario() {
    if (!formulario.itemOrdemId) {
      mostrarMensagem("Selecione o item da ordem de serviço.", "error");
      return false;
    }

    if (!formulario.operadorId) {
      mostrarMensagem("Selecione um operador.", "error");
      return false;
    }

    const produzida = Number(formulario.quantidadeProduzida);
    const aprovada = Number(formulario.quantidadeAprovada);
    const rejeitada = Number(formulario.quantidadeRejeitada);

    if (
      !Number.isInteger(produzida) ||
      !Number.isInteger(aprovada) ||
      !Number.isInteger(rejeitada) ||
      produzida < 0 ||
      aprovada < 0 ||
      rejeitada < 0
    ) {
      mostrarMensagem("Informe quantidades inteiras e não negativas.", "error");
      return false;
    }

    if (aprovada + rejeitada > produzida) {
      mostrarMensagem(
        "A quantidade aprovada e rejeitada não pode superar a quantidade produzida.",
        "error",
      );
      return false;
    }

    return true;
  }

  function montarDadosFormulario() {
    return {
      itemOrdemId: Number(formulario.itemOrdemId),
      operadorId: Number(formulario.operadorId),
      etapa: formulario.etapa,
      status: formulario.status,
      quantidadeProduzida: Number(formulario.quantidadeProduzida),
      quantidadeAprovada: Number(formulario.quantidadeAprovada),
      quantidadeRejeitada: Number(formulario.quantidadeRejeitada),
      observacoes: formulario.observacoes.trim() || undefined,
    };
  }

  async function cadastrarProducao() {
    if (!validarFormulario()) return;

    setProcessando(true);

    try {
      const resposta = await fetch(`${API_URL}/production`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(montarDadosFormulario()),
      });

      const dados = await lerResposta(resposta);

      if (!resposta.ok) {
        throw new Error(
          dados.message || "Não foi possível cadastrar a produção.",
        );
      }

      fecharCadastro();
      await buscarDados();

      mostrarMensagem("Produção cadastrada com sucesso.", "success");
    } catch (error) {
      mostrarMensagem(
        error instanceof Error ? error.message : "Erro ao cadastrar produção.",
        "error",
      );
    } finally {
      setProcessando(false);
    }
  }

  async function atualizarProducao() {
    if (!producaoSelecionada) return;

    if (!validarFormulario()) return;

    setProcessando(true);

    try {
      const resposta = await fetch(
        `${API_URL}/production/${producaoSelecionada.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(montarDadosFormulario()),
        },
      );

      const dados = await lerResposta(resposta);

      if (!resposta.ok) {
        throw new Error(
          dados.message || "Não foi possível atualizar a produção.",
        );
      }

      fecharEdicao();
      await buscarDados();

      mostrarMensagem("Produção atualizada com sucesso.", "success");
    } catch (error) {
      mostrarMensagem(
        error instanceof Error ? error.message : "Erro ao atualizar produção.",
        "error",
      );
    } finally {
      setProcessando(false);
    }
  }

  function abrirExclusao(producao: Producao) {
    setProducaoSelecionada(producao);
    setDialogExclusao(true);
  }

  function fecharExclusao() {
    setDialogExclusao(false);
    setProducaoSelecionada(null);
  }

  async function excluirProducao() {
    if (!producaoSelecionada) return;

    setProcessando(true);

    try {
      const resposta = await fetch(
        `${API_URL}/production/${producaoSelecionada.id}`,
        {
          method: "DELETE",
        },
      );

      const dados = await lerResposta(resposta);

      if (!resposta.ok) {
        throw new Error(
          dados.message || "Não foi possível excluir a produção.",
        );
      }

      fecharExclusao();
      await buscarDados();

      mostrarMensagem("Produção excluída com sucesso.", "success");
    } catch (error) {
      mostrarMensagem(
        error instanceof Error ? error.message : "Erro ao excluir produção.",
        "error",
      );
    } finally {
      setProcessando(false);
    }
  }

  function abrirVisualizacao(producao: Producao) {
    setProducaoSelecionada(producao);
    setDialogVisualizacao(true);
  }

  const producoesFiltradas = useMemo(() => {
    return producoes.filter((producao) => {
      const textoBusca = busca.toLowerCase();

      const correspondeBusca = [
        String(producao.id),
        String(producao.itemOrdem?.ordem?.id ?? ""),
        producao.itemOrdem?.ordem?.cliente?.nome ?? "",
        producao.itemOrdem?.peca?.nome ?? "",
        producao.operador?.name ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(textoBusca);

      const correspondeStatus =
        filtroStatus === "TODOS" || producao.status === filtroStatus;

      const correspondeEtapa =
        filtroEtapa === "TODAS" || producao.etapa === filtroEtapa;

      return correspondeBusca && correspondeStatus && correspondeEtapa;
    });
  }, [producoes, busca, filtroStatus, filtroEtapa]);

  const indicadores = useMemo(() => {
    return {
      emAndamento: producoes.filter((item) => item.status === "EM_ANDAMENTO")
        .length,

      concluidas: producoes.filter((item) => item.status === "CONCLUIDA")
        .length,

      aprovadas: producoes.reduce(
        (total, item) => total + Number(item.quantidadeAprovada || 0),
        0,
      ),

      rejeitadas: producoes.reduce(
        (total, item) => total + Number(item.quantidadeRejeitada || 0),
        0,
      ),
    };
  }, [producoes]);

  const itemSelecionado = itensOrdem.find(
    (item) => item.id === Number(formulario.itemOrdemId),
  );

  const producaoConcluida = producaoSelecionada?.status === "CONCLUIDA";

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
          flexDirection: { xs: "column", sm: "row" },
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
            Produção
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Acompanhe e gerencie as etapas de produção das ordens de serviço.
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
          Nova produção
        </Button>
      </Box>

      {/* Indicadores */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 4,
        }}
      >
        <Card
          elevation={0}
          sx={{ borderRadius: 3, border: "1px solid #EAECF0" }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box>
                <Typography color="text.secondary" variant="body2">
                  Em andamento
                </Typography>

                <Typography
                  variant="h4"
                  sx={{ mt: 1, fontWeight: 700, color: "#17233B" }}
                >
                  {indicadores.emAndamento}
                </Typography>
              </Box>

              <Box sx={{ color: "#2563EB" }}>
                <Clock3 size={25} />
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card
          elevation={0}
          sx={{ borderRadius: 3, border: "1px solid #EAECF0" }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box>
                <Typography color="text.secondary" variant="body2">
                  Produções concluídas
                </Typography>

                <Typography
                  variant="h4"
                  sx={{ mt: 1, fontWeight: 700, color: "#17233B" }}
                >
                  {indicadores.concluidas}
                </Typography>
              </Box>

              <Box sx={{ color: "#16803C" }}>
                <CheckCircle2 size={25} />
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card
          elevation={0}
          sx={{ borderRadius: 3, border: "1px solid #EAECF0" }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box>
                <Typography color="text.secondary" variant="body2">
                  Quantidade aprovada
                </Typography>

                <Typography
                  variant="h4"
                  sx={{ mt: 1, fontWeight: 700, color: "#17233B" }}
                >
                  {indicadores.aprovadas}
                </Typography>
              </Box>

              <Box sx={{ color: "#16803C" }}>
                <PackageCheck size={25} />
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card
          elevation={0}
          sx={{ borderRadius: 3, border: "1px solid #EAECF0" }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box>
                <Typography color="text.secondary" variant="body2">
                  Quantidade rejeitada
                </Typography>

                <Typography
                  variant="h4"
                  sx={{ mt: 1, fontWeight: 700, color: "#17233B" }}
                >
                  {indicadores.rejeitadas}
                </Typography>
              </Box>

              <Box sx={{ color: "#D14343" }}>
                <ClipboardList size={25} />
              </Box>
            </Box>
          </CardContent>
        </Card>
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
              {/* Busca e filtros */}
              <Box
                sx={{
                  p: 3,
                  borderBottom: "1px solid #EAECF0",
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 2,
                }}
              >
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Buscar por OS, cliente, peça ou operador..."
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

                <TextField
                  select
                  size="small"
                  label="Status"
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value)}
                  sx={{ minWidth: { xs: "100%", md: 180 } }}
                >
                  <MenuItem value="TODOS">Todos</MenuItem>

                  {statusOptions.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  size="small"
                  label="Etapa"
                  value={filtroEtapa}
                  onChange={(e) => setFiltroEtapa(e.target.value)}
                  sx={{ minWidth: { xs: "100%", md: 180 } }}
                >
                  <MenuItem value="TODAS">Todas</MenuItem>

                  {etapas.map((etapa) => (
                    <MenuItem key={etapa.value} value={etapa.value}>
                      {etapa.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              {producoes.length === 0 ? (
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
                    Nenhuma produção cadastrada.
                  </Typography>
                </Box>
              ) : producoesFiltradas.length === 0 ? (
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
                    Nenhuma produção encontrada.
                  </Typography>
                </Box>
              ) : (
                <TableContainer sx={{ overflowX: "auto" }}>
                  <Table sx={{ minWidth: 1100 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <strong>Produção</strong>
                        </TableCell>

                        <TableCell>
                          <strong>Ordem de serviço</strong>
                        </TableCell>

                        <TableCell>
                          <strong>Cliente</strong>
                        </TableCell>

                        <TableCell>
                          <strong>Peça</strong>
                        </TableCell>

                        <TableCell>
                          <strong>Etapa</strong>
                        </TableCell>

                        <TableCell>
                          <strong>Operador</strong>
                        </TableCell>

                        <TableCell>
                          <strong>Quantidade</strong>
                        </TableCell>

                        <TableCell>
                          <strong>Prazo</strong>
                        </TableCell>

                        <TableCell>
                          <strong>Status</strong>
                        </TableCell>

                        <TableCell align="right">
                          <strong>Ações</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {producoesFiltradas.map((producao) => (
                        <TableRow key={producao.id} hover>
                          <TableCell>#{producao.id}</TableCell>

                          <TableCell>
                            #{producao.itemOrdem?.ordem?.id ?? "-"}
                          </TableCell>

                          <TableCell>
                            {producao.itemOrdem?.ordem?.cliente?.nome ??
                              "Não informado"}
                          </TableCell>

                          <TableCell>
                            {producao.itemOrdem?.peca?.nome ?? "Não informada"}
                          </TableCell>

                          <TableCell>{nomeEtapa(producao.etapa)}</TableCell>

                          <TableCell>
                            {producao.operador?.name ?? "Não informado"}
                          </TableCell>

                          <TableCell>
                            <Typography variant="body2">
                              {producao.quantidadeProduzida} /{" "}
                              {producao.itemOrdem?.quantidade ?? "-"}
                            </Typography>

                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Produzida / Solicitada
                            </Typography>
                          </TableCell>

                          <TableCell>
                            {formatarData(producao.itemOrdem?.ordem?.prazo)}
                          </TableCell>

                          <TableCell>
                            <Chip
                              label={nomeStatus(producao.status)}
                              size="small"
                              sx={{
                                ...corStatus(producao.status),
                                fontWeight: 600,
                                borderRadius: 1.5,
                              }}
                            />
                          </TableCell>

                          <TableCell align="right">
                            <IconButton
                              aria-label="Visualizar produção"
                              onClick={() => abrirVisualizacao(producao)}
                              sx={{ color: "#667085" }}
                            >
                              <ClipboardList size={18} />
                            </IconButton>

                            <IconButton
                              aria-label="Editar produção"
                              onClick={() => abrirEdicao(producao)}
                              disabled={producao.status === "CONCLUIDA"}
                              sx={{ color: "#17233B" }}
                            >
                              <Pencil size={18} />
                            </IconButton>

                            <IconButton
                              aria-label="Excluir produção"
                              onClick={() => abrirExclusao(producao)}
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
        <DialogTitle sx={{ fontWeight: 700, color: "#17233B" }}>
          Nova produção
        </DialogTitle>

        <DialogContent>
          <TextField
            select
            fullWidth
            label="Item da ordem de serviço"
            value={formulario.itemOrdemId}
            onChange={(e) => atualizarCampo("itemOrdemId", e.target.value)}
            required
            sx={{ mt: 1, mb: 2 }}
          >
            {itensOrdem.map((item) => (
              <MenuItem key={item.id} value={String(item.id)}>
                OS #{item.ordem?.id} — {item.peca?.nome} —{" "}
                {item.ordem?.cliente?.nome ?? "Cliente não informado"}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            select
            label="Operador"
            value={formulario.operadorId}
            onChange={(e) => atualizarCampo("operadorId", e.target.value)}
            required
            sx={{ mb: 2 }}
          >
            {operadores
              .filter((operador) => operador.active)
              .map((operador) => (
                <MenuItem key={operador.id} value={String(operador.id)}>
                  {operador.name}
                </MenuItem>
              ))}
          </TextField>

          <TextField
            fullWidth
            select
            label="Etapa da produção"
            value={formulario.etapa}
            onChange={(e) =>
              atualizarCampo("etapa", e.target.value as EtapaProducao)
            }
            sx={{ mb: 2 }}
          >
            {etapas.map((etapa) => (
              <MenuItem key={etapa.value} value={etapa.value}>
                {etapa.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            select
            label="Status"
            value={formulario.status}
            onChange={(e) =>
              atualizarCampo("status", e.target.value as StatusProducao)
            }
            sx={{ mb: 2 }}
          >
            {statusOptions.map((status) => (
              <MenuItem key={status.value} value={status.value}>
                {status.label}
              </MenuItem>
            ))}
          </TextField>

          {itemSelecionado && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Quantidade solicitada na ordem:{" "}
              <strong>{itemSelecionado.quantidade}</strong>
            </Alert>
          )}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(3, 1fr)",
              },
              gap: 2,
              mb: 2,
            }}
          >
            <TextField
              type="number"
              label="Produzida"
              value={formulario.quantidadeProduzida}
              onChange={(e) =>
                atualizarCampo("quantidadeProduzida", e.target.value)
              }
              slotProps={{ htmlInput: { min: 0, step: 1 } }}
            />

            <TextField
              type="number"
              label="Aprovada"
              value={formulario.quantidadeAprovada}
              onChange={(e) =>
                atualizarCampo("quantidadeAprovada", e.target.value)
              }
              slotProps={{ htmlInput: { min: 0, step: 1 } }}
            />

            <TextField
              type="number"
              label="Rejeitada"
              value={formulario.quantidadeRejeitada}
              onChange={(e) =>
                atualizarCampo("quantidadeRejeitada", e.target.value)
              }
              slotProps={{ htmlInput: { min: 0, step: 1 } }}
            />
          </Box>

          <TextField
            fullWidth
            label="Observações"
            value={formulario.observacoes}
            onChange={(e) => atualizarCampo("observacoes", e.target.value)}
            multiline
            minRows={3}
          />
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={fecharCadastro}
            disabled={processando}
            sx={{ textTransform: "none", color: "#667085" }}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={cadastrarProducao}
            disabled={processando}
            sx={{
              textTransform: "none",
              backgroundColor: "#E56A2F",
              "&:hover": {
                backgroundColor: "#CF5D27",
              },
            }}
          >
            {processando ? "Cadastrando..." : "Cadastrar produção"}
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
        <DialogTitle sx={{ fontWeight: 700, color: "#17233B" }}>
          Editar produção #{producaoSelecionada?.id}
        </DialogTitle>

        <DialogContent>
          {producaoConcluida ? (
            <Alert severity="warning" sx={{ mt: 1 }}>
              Produções concluídas não podem ser alteradas.
            </Alert>
          ) : (
            <>
              <TextField
                fullWidth
                select
                label="Item da ordem de serviço"
                value={formulario.itemOrdemId}
                onChange={(e) => atualizarCampo("itemOrdemId", e.target.value)}
                sx={{ mt: 1, mb: 2 }}
              >
                {itensOrdem.map((item) => (
                  <MenuItem key={item.id} value={String(item.id)}>
                    OS #{item.ordem?.id} — {item.peca?.nome} —{" "}
                    {item.ordem?.cliente?.nome ?? "Cliente não informado"}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                select
                label="Operador"
                value={formulario.operadorId}
                onChange={(e) => atualizarCampo("operadorId", e.target.value)}
                sx={{ mb: 2 }}
              >
                {operadores
                  .filter(
                    (operador) =>
                      operador.active ||
                      operador.id === producaoSelecionada?.operador?.id,
                  )
                  .map((operador) => (
                    <MenuItem key={operador.id} value={String(operador.id)}>
                      {operador.name}
                    </MenuItem>
                  ))}
              </TextField>

              <TextField
                fullWidth
                select
                label="Etapa"
                value={formulario.etapa}
                onChange={(e) =>
                  atualizarCampo("etapa", e.target.value as EtapaProducao)
                }
                sx={{ mb: 2 }}
              >
                {etapas.map((etapa) => (
                  <MenuItem key={etapa.value} value={etapa.value}>
                    {etapa.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                select
                label="Status"
                value={formulario.status}
                onChange={(e) =>
                  atualizarCampo("status", e.target.value as StatusProducao)
                }
                sx={{ mb: 2 }}
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </TextField>

              {itemSelecionado && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Quantidade solicitada na ordem:{" "}
                  <strong>{itemSelecionado.quantidade}</strong>
                </Alert>
              )}

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(3, 1fr)",
                  },
                  gap: 2,
                  mb: 2,
                }}
              >
                <TextField
                  type="number"
                  label="Produzida"
                  value={formulario.quantidadeProduzida}
                  onChange={(e) =>
                    atualizarCampo("quantidadeProduzida", e.target.value)
                  }
                  slotProps={{ htmlInput: { min: 0, step: 1 } }}
                />

                <TextField
                  type="number"
                  label="Aprovada"
                  value={formulario.quantidadeAprovada}
                  onChange={(e) =>
                    atualizarCampo("quantidadeAprovada", e.target.value)
                  }
                  slotProps={{ htmlInput: { min: 0, step: 1 } }}
                />

                <TextField
                  type="number"
                  label="Rejeitada"
                  value={formulario.quantidadeRejeitada}
                  onChange={(e) =>
                    atualizarCampo("quantidadeRejeitada", e.target.value)
                  }
                  slotProps={{ htmlInput: { min: 0, step: 1 } }}
                />
              </Box>

              <TextField
                fullWidth
                label="Observações"
                value={formulario.observacoes}
                onChange={(e) => atualizarCampo("observacoes", e.target.value)}
                multiline
                minRows={3}
              />
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={fecharEdicao}
            disabled={processando}
            sx={{ textTransform: "none", color: "#667085" }}
          >
            Fechar
          </Button>

          {!producaoConcluida && (
            <Button
              variant="contained"
              onClick={atualizarProducao}
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
          )}
        </DialogActions>
      </Dialog>

      {/* Dialog de visualização */}
      <Dialog
        open={dialogVisualizacao}
        onClose={() => setDialogVisualizacao(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#17233B" }}>
          Detalhes da produção #{producaoSelecionada?.id}
        </DialogTitle>

        <DialogContent>
          {producaoSelecionada && (
            <Box sx={{ mt: 1, display: "grid", gap: 2 }}>
              <Typography>
                <strong>Ordem de serviço:</strong> #
                {producaoSelecionada.itemOrdem?.ordem?.id ?? "-"}
              </Typography>

              <Typography>
                <strong>Cliente:</strong>{" "}
                {producaoSelecionada.itemOrdem?.ordem?.cliente?.nome ??
                  "Não informado"}
              </Typography>

              <Typography>
                <strong>Peça:</strong>{" "}
                {producaoSelecionada.itemOrdem?.peca?.nome ?? "Não informada"}
              </Typography>

              <Typography>
                <strong>Operador:</strong>{" "}
                {producaoSelecionada.operador?.name ?? "Não informado"}
              </Typography>

              <Typography>
                <strong>Etapa:</strong> {nomeEtapa(producaoSelecionada.etapa)}
              </Typography>

              <Typography>
                <strong>Status:</strong>{" "}
                {nomeStatus(producaoSelecionada.status)}
              </Typography>

              <Typography>
                <strong>Quantidade solicitada:</strong>{" "}
                {producaoSelecionada.itemOrdem?.quantidade ?? "-"}
              </Typography>

              <Typography>
                <strong>Quantidade produzida:</strong>{" "}
                {producaoSelecionada.quantidadeProduzida}
              </Typography>

              <Typography>
                <strong>Quantidade aprovada:</strong>{" "}
                {producaoSelecionada.quantidadeAprovada}
              </Typography>

              <Typography>
                <strong>Quantidade rejeitada:</strong>{" "}
                {producaoSelecionada.quantidadeRejeitada}
              </Typography>

              <Typography>
                <strong>Início:</strong>{" "}
                {formatarData(producaoSelecionada.dataInicio)}
              </Typography>

              <Typography>
                <strong>Conclusão:</strong>{" "}
                {formatarData(producaoSelecionada.dataConclusao)}
              </Typography>

              <Typography>
                <strong>Prazo da OS:</strong>{" "}
                {formatarData(producaoSelecionada.itemOrdem?.ordem?.prazo)}
              </Typography>

              <Typography>
                <strong>Observações:</strong>{" "}
                {producaoSelecionada.observacoes || "Sem observações"}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setDialogVisualizacao(false)}
            sx={{ textTransform: "none", color: "#667085" }}
          >
            Fechar
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
        <DialogTitle sx={{ fontWeight: 700 }}>Excluir produção</DialogTitle>

        <DialogContent>
          <Typography color="text.secondary">
            Tem certeza de que deseja excluir a produção{" "}
            <strong>#{producaoSelecionada?.id}</strong>?
          </Typography>

          <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
            Essa ação não poderá ser desfeita.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={fecharExclusao}
            disabled={processando}
            sx={{ textTransform: "none", color: "#667085" }}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={excluirProducao}
            disabled={processando}
            sx={{ textTransform: "none" }}
          >
            {processando ? "Excluindo..." : "Confirmar exclusão"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mensagens */}
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
