"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
  LinearProgress,
  MenuItem,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  ClipboardList,
  CheckCircle2,
  Clock3,
  PackageCheck,
  Pencil,
  Search,
  Trash2,
  ChevronDown,
  RefreshCw,
  Factory,
  AlertCircle,
  CalendarDays,
  Package,
  Eye,
  FilterX,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type StatusProducao = "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDA";

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
  phone?: string;
  active: boolean;
}

interface ProcessoUsinagem {
  id: number;
  name: string;
  description?: string;
  active: boolean;
}

interface Producao {
  id: number;
  itemOrdem: ItemOrdem;
  process: ProcessoUsinagem;
  operador?: Operador | null;
  sequence: number;
  status: StatusProducao;
  dataInicio: string | null;
  dataConclusao: string | null;
  quantidadeProduzida: number;
  quantidadeAprovada: number;
  quantidadeRejeitada: number;
  observacoes: string | null;
}

interface FormularioProducao {
  operadorId: string;
  status: StatusProducao;
  quantidadeProduzida: string;
  quantidadeAprovada: string;
  quantidadeRejeitada: string;
  observacoes: string;
}

interface ItemAgrupado {
  item: ItemOrdem;
  producoes: Producao[];
}

interface OrdemAgrupada {
  ordemId: number;
  ordem: Ordem;
  itens: ItemAgrupado[];
  producoes: Producao[];
}

const statusOptions: {
  value: StatusProducao;
  label: string;
}[] = [
  { value: "PENDENTE", label: "Pendente" },
  { value: "EM_ANDAMENTO", label: "Em andamento" },
  { value: "CONCLUIDA", label: "Concluída" },
];

const formularioInicial: FormularioProducao = {
  operadorId: "",
  status: "PENDENTE",
  quantidadeProduzida: "0",
  quantidadeAprovada: "0",
  quantidadeRejeitada: "0",
  observacoes: "",
};

const cores = {
  texto: "#172B4D",
  secundario: "#667085",
  borda: "#E6EAF0",
  fundo: "#F6F8FB",
  laranja: "#E56A2F",
  verde: "#16803C",
  azul: "#2563EB",
  amarelo: "#B76E00",
  vermelho: "#D14343",
};

function formatarData(data?: string | null) {
  if (!data) return "Não informado";

  const dataFormatada = new Date(`${data.substring(0, 10)}T12:00:00`);

  if (Number.isNaN(dataFormatada.getTime())) {
    return "Não informado";
  }

  return dataFormatada.toLocaleDateString("pt-BR");
}

function nomeStatus(status: StatusProducao) {
  return statusOptions.find((item) => item.value === status)?.label ?? status;
}

function corStatus(status: StatusProducao) {
  switch (status) {
    case "PENDENTE":
      return {
        backgroundColor: "#FFF4E5",
        color: "#A15C00",
        border: "1px solid #F5D9AE",
      };

    case "EM_ANDAMENTO":
      return {
        backgroundColor: "#EAF2FF",
        color: "#245BC5",
        border: "1px solid #C9DBFF",
      };

    case "CONCLUIDA":
      return {
        backgroundColor: "#E8F6ED",
        color: "#16803C",
        border: "1px solid #C5E8D0",
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

function CartaoIndicador({
  titulo,
  valor,
  icone,
  cor,
  fundo,
  descricao,
}: {
  titulo: string;
  valor: number;
  icone: React.ReactNode;
  cor: string;
  fundo: string;
  descricao: string;
}) {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        border: `1px solid ${cores.borda}`,
        borderRadius: 3,
        transition: "all .2s ease",
        "&:hover": {
          borderColor: "#CBD3DF",
          transform: "translateY(-2px)",
          boxShadow: "0 8px 22px rgba(16,24,40,.05)",
        },
      }}
    >
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="body2"
              sx={{ color: cores.secundario, fontWeight: 500 }}
            >
              {titulo}
            </Typography>

            <Typography
              variant="h4"
              sx={{
                mt: 1,
                fontWeight: 750,
                letterSpacing: "-1px",
                color: cores.texto,
              }}
            >
              {valor}
            </Typography>

            <Typography
              variant="caption"
              sx={{ color: cores.secundario, display: "block", mt: 0.5 }}
            >
              {descricao}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: 2.5,
              backgroundColor: fundo,
              color: cor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {icone}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function ProducaoPage() {
  const [producoes, setProducoes] = useState<Producao[]>([]);
  const [operadores, setOperadores] = useState<Operador[]>([]);

  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);

  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("TODOS");
  const [filtroProcesso, setFiltroProcesso] = useState("TODOS");

  const [formulario, setFormulario] =
    useState<FormularioProducao>(formularioInicial);

  const [producaoSelecionada, setProducaoSelecionada] =
    useState<Producao | null>(null);

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
    setAtualizando(true);

    try {
      const [respostaProducoes, respostaOperadores] = await Promise.all([
        fetch(`${API_URL}/production`),
        fetch(`${API_URL}/operators`),
      ]);

      const [dadosProducoes, dadosOperadores] = await Promise.all([
        lerResposta(respostaProducoes),
        lerResposta(respostaOperadores),
      ]);

      if (!respostaProducoes.ok) {
        throw new Error("Não foi possível carregar as produções.");
      }

      if (!respostaOperadores.ok) {
        throw new Error("Não foi possível carregar os operadores.");
      }

      setProducoes(Array.isArray(dadosProducoes) ? dadosProducoes : []);
      setOperadores(Array.isArray(dadosOperadores) ? dadosOperadores : []);
    } catch (error) {
      mostrarMensagem(
        error instanceof Error ? error.message : "Erro ao carregar os dados.",
        "error",
      );
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();

    async function carregarDados() {
      try {
        const [respostaProducoes, respostaOperadores] = await Promise.all([
          fetch(`${API_URL}/production`, {
            signal: controller.signal,
          }),
          fetch(`${API_URL}/operators`, {
            signal: controller.signal,
          }),
        ]);

        const [dadosProducoes, dadosOperadores] = await Promise.all([
          lerResposta(respostaProducoes),
          lerResposta(respostaOperadores),
        ]);

        if (!respostaProducoes.ok) {
          throw new Error("Não foi possível carregar as produções.");
        }

        if (!respostaOperadores.ok) {
          throw new Error("Não foi possível carregar os operadores.");
        }

        setProducoes(Array.isArray(dadosProducoes) ? dadosProducoes : []);
        setOperadores(Array.isArray(dadosOperadores) ? dadosOperadores : []);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        mostrarMensagem(
          error instanceof Error ? error.message : "Erro ao carregar os dados.",
          "error",
        );
      } finally {
        if (!controller.signal.aborted) {
          setCarregando(false);
        }
      }
    }

    carregarDados();

    return () => controller.abort();
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

  function abrirEdicao(producao: Producao) {
    setProducaoSelecionada(producao);

    setFormulario({
      operadorId: String(producao.operador?.id ?? ""),
      status: producao.status,
      quantidadeProduzida: String(producao.quantidadeProduzida ?? 0),
      quantidadeAprovada: String(producao.quantidadeAprovada ?? 0),
      quantidadeRejeitada: String(producao.quantidadeRejeitada ?? 0),
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
      ...(formulario.operadorId
        ? { operadorId: Number(formulario.operadorId) }
        : {}),
      status: formulario.status,
      quantidadeProduzida: Number(formulario.quantidadeProduzida),
      quantidadeAprovada: Number(formulario.quantidadeAprovada),
      quantidadeRejeitada: Number(formulario.quantidadeRejeitada),
      observacoes: formulario.observacoes.trim() || undefined,
    };
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

  function limparFiltros() {
    setBusca("");
    setFiltroStatus("TODOS");
    setFiltroProcesso("TODOS");
  }

  const processos = useMemo(() => {
    const nomes = producoes
      .map((producao) => producao.process?.name)
      .filter((nome): nome is string => Boolean(nome));

    return [...new Set(nomes)].sort((a, b) => a.localeCompare(b));
  }, [producoes]);

  const producoesFiltradas = useMemo(() => {
    return producoes.filter((producao) => {
      const textoBusca = busca.toLowerCase();

      const correspondeBusca = [
        String(producao.id),
        String(producao.itemOrdem?.ordem?.id ?? ""),
        producao.itemOrdem?.ordem?.cliente?.nome ?? "",
        producao.itemOrdem?.peca?.nome ?? "",
        producao.process?.name ?? "",
        String(producao.sequence ?? ""),
        producao.operador?.name ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(textoBusca);

      const correspondeStatus =
        filtroStatus === "TODOS" || producao.status === filtroStatus;

      const correspondeProcesso =
        filtroProcesso === "TODOS" || producao.process?.name === filtroProcesso;

      return correspondeBusca && correspondeStatus && correspondeProcesso;
    });
  }, [producoes, busca, filtroStatus, filtroProcesso]);

  const ordensAgrupadas = useMemo(() => {
    const mapaOrdens = new Map<number, OrdemAgrupada>();

    producoesFiltradas.forEach((producao) => {
      const ordem = producao.itemOrdem?.ordem;
      const item = producao.itemOrdem;

      if (!ordem || !item) return;

      let grupoOrdem = mapaOrdens.get(ordem.id);

      if (!grupoOrdem) {
        grupoOrdem = {
          ordemId: ordem.id,
          ordem,
          itens: [],
          producoes: [],
        };

        mapaOrdens.set(ordem.id, grupoOrdem);
      }

      grupoOrdem.producoes.push(producao);

      let grupoItem = grupoOrdem.itens.find(
        (grupo) => grupo.item.id === item.id,
      );

      if (!grupoItem) {
        grupoItem = {
          item,
          producoes: [],
        };

        grupoOrdem.itens.push(grupoItem);
      }

      grupoItem.producoes.push(producao);
    });

    return Array.from(mapaOrdens.values())
      .map((ordem) => ({
        ...ordem,
        itens: ordem.itens
          .map((item) => ({
            ...item,
            producoes: [...item.producoes].sort(
              (a, b) => a.sequence - b.sequence,
            ),
          }))
          .sort((a, b) => a.item.id - b.item.id),
      }))
      .sort((a, b) => b.ordemId - a.ordemId);
  }, [producoesFiltradas]);

  const indicadores = useMemo(() => {
    const ordens = new Set(
      producoes
        .map((item) => item.itemOrdem?.ordem?.id)
        .filter((id): id is number => id !== undefined),
    );

    return {
      ordens: ordens.size,
      pendentes: producoes.filter((item) => item.status === "PENDENTE").length,
      emAndamento: producoes.filter((item) => item.status === "EM_ANDAMENTO")
        .length,
      concluidas: producoes.filter((item) => item.status === "CONCLUIDA")
        .length,
    };
  }, [producoes]);

  const producaoConcluida = producaoSelecionada?.status === "CONCLUIDA";

  const possuiFiltros =
    busca.trim() !== "" ||
    filtroStatus !== "TODOS" ||
    filtroProcesso !== "TODOS";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: cores.fundo,
        p: { xs: 2, sm: 3, lg: 4 },
      }}
    >
      <Box sx={{ maxWidth: 1600, mx: "auto" }}>
        {/* Cabeçalho */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 3.5,
          }}
        >
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 2.5,
                  backgroundColor: "#FFF0E9",
                  color: cores.laranja,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Factory size={23} />
              </Box>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 750,
                  color: cores.texto,
                  letterSpacing: "-1px",
                }}
              >
                Produção
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ color: cores.secundario, mt: 1 }}>
              Acompanhe as ordens de serviço e o andamento dos processos de
              usinagem.
            </Typography>
          </Box>

          <Button
            variant="outlined"
            startIcon={
              <RefreshCw
                size={17}
                className={atualizando ? "animate-spin" : ""}
              />
            }
            onClick={buscarDados}
            disabled={atualizando || carregando}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderColor: cores.borda,
              color: cores.texto,
              backgroundColor: "#FFFFFF",
              borderRadius: 2,
              px: 2,
              py: 1,
              "&:hover": {
                borderColor: "#C5CCD7",
                backgroundColor: "#FAFBFC",
              },
            }}
          >
            Atualizar dados
          </Button>
        </Box>

        {/* Indicadores */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              xl: "repeat(4, 1fr)",
            },
            gap: 2,
            mb: 3.5,
          }}
        >
          <CartaoIndicador
            titulo="Ordens com produção"
            valor={indicadores.ordens}
            descricao="Ordens com etapas cadastradas"
            icone={<ClipboardList size={23} />}
            cor="#344B70"
            fundo="#EDF2FA"
          />

          <CartaoIndicador
            titulo="Etapas pendentes"
            valor={indicadores.pendentes}
            descricao="Aguardando início"
            icone={<Clock3 size={23} />}
            cor={cores.amarelo}
            fundo="#FFF5E8"
          />

          <CartaoIndicador
            titulo="Em andamento"
            valor={indicadores.emAndamento}
            descricao="Etapas em execução"
            icone={<PackageCheck size={23} />}
            cor={cores.azul}
            fundo="#EAF2FF"
          />

          <CartaoIndicador
            titulo="Etapas concluídas"
            valor={indicadores.concluidas}
            descricao="Processos finalizados"
            icone={<CheckCircle2 size={23} />}
            cor={cores.verde}
            fundo="#E8F6ED"
          />
        </Box>

        {/* Conteúdo principal */}
        <Card
          elevation={0}
          sx={{
            border: `1px solid ${cores.borda}`,
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          {/* Título da listagem */}
          <Box
            sx={{
              px: { xs: 2, md: 3 },
              py: 2.5,
              borderBottom: `1px solid ${cores.borda}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: cores.texto }}
              >
                Ordens de serviço
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: cores.secundario, mt: 0.3 }}
              >
                Consulte as peças e acompanhe cada etapa da produção.
              </Typography>
            </Box>

            {!carregando && (
              <Chip
                label={`${producoesFiltradas.length} ${
                  producoesFiltradas.length === 1 ? "etapa" : "etapas"
                }`}
                size="small"
                sx={{
                  backgroundColor: "#F0F2F5",
                  color: cores.texto,
                  fontWeight: 600,
                }}
              />
            )}
          </Box>

          {carregando ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 300,
                gap: 2,
              }}
            >
              <CircularProgress size={30} />
              <Typography variant="body2" color="text.secondary">
                Carregando dados da produção...
              </Typography>
            </Box>
          ) : (
            <>
              {/* Busca e filtros */}
              <Box
                sx={{
                  p: { xs: 2, md: 3 },
                  backgroundColor: "#FFFFFF",
                  borderBottom: `1px solid ${cores.borda}`,
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      md: "minmax(250px, 1fr) 190px 190px auto",
                    },
                    gap: 1.5,
                    alignItems: "center",
                  }}
                >
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Buscar OS, cliente, peça ou operador..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search size={18} color={cores.secundario} />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "#FFFFFF",
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
                      "& .MuiOutlinedInput-root": { borderRadius: 2 },
                    }}
                  >
                    <MenuItem value="TODOS">Todos os status</MenuItem>

                    {statusOptions.map((status) => (
                      <MenuItem key={status.value} value={status.value}>
                        {status.label}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    size="small"
                    label="Processo"
                    value={filtroProcesso}
                    onChange={(e) => setFiltroProcesso(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: 2 },
                    }}
                  >
                    <MenuItem value="TODOS">Todos os processos</MenuItem>

                    {processos.map((processo) => (
                      <MenuItem key={processo} value={processo}>
                        {processo}
                      </MenuItem>
                    ))}
                  </TextField>

                  <Tooltip title="Limpar filtros">
                    <span>
                      <IconButton
                        onClick={limparFiltros}
                        disabled={!possuiFiltros}
                        sx={{
                          border: `1px solid ${cores.borda}`,
                          borderRadius: 2,
                          width: 40,
                          height: 40,
                          color: cores.secundario,
                        }}
                      >
                        <FilterX size={19} />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Box>
              </Box>

              {/* Lista de ordens */}
              {producoes.length === 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 280,
                    p: 3,
                    textAlign: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 58,
                      height: 58,
                      borderRadius: "50%",
                      backgroundColor: "#F0F2F5",
                      color: cores.secundario,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                    }}
                  >
                    <Factory size={26} />
                  </Box>

                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 700, color: cores.texto }}
                  >
                    Nenhuma produção cadastrada
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5, maxWidth: 420 }}
                  >
                    Adicione processos de usinagem nas peças das ordens de
                    serviço para acompanhar a produção por aqui.
                  </Typography>
                </Box>
              ) : producoesFiltradas.length === 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 240,
                    p: 3,
                    textAlign: "center",
                  }}
                >
                  <Search size={28} color={cores.secundario} />

                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 700, color: cores.texto, mt: 1.5 }}
                  >
                    Nenhum resultado encontrado
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    Tente alterar a busca ou os filtros selecionados.
                  </Typography>

                  <Button
                    onClick={limparFiltros}
                    sx={{
                      mt: 1.5,
                      textTransform: "none",
                      color: cores.laranja,
                    }}
                  >
                    Limpar filtros
                  </Button>
                </Box>
              ) : (
                <Box sx={{ p: { xs: 1.5, md: 2.5 } }}>
                  {ordensAgrupadas.map((grupo) => {
                    const totalEtapas = grupo.producoes.length;

                    const etapasConcluidas = grupo.producoes.filter(
                      (item) => item.status === "CONCLUIDA",
                    ).length;

                    const etapasEmAndamento = grupo.producoes.filter(
                      (item) => item.status === "EM_ANDAMENTO",
                    ).length;

                    const etapasPendentes = grupo.producoes.filter(
                      (item) => item.status === "PENDENTE",
                    ).length;

                    const progresso =
                      totalEtapas > 0
                        ? (etapasConcluidas / totalEtapas) * 100
                        : 0;

                    const statusGeral: StatusProducao =
                      etapasConcluidas === totalEtapas
                        ? "CONCLUIDA"
                        : etapasEmAndamento > 0 || etapasConcluidas > 0
                          ? "EM_ANDAMENTO"
                          : "PENDENTE";

                    return (
                      <Accordion
                        key={grupo.ordemId}
                        disableGutters
                        elevation={0}
                        sx={{
                          mb: 2,
                          border: `1px solid ${cores.borda}`,
                          borderRadius: "12px !important",
                          overflow: "hidden",
                          backgroundColor: "#FFFFFF",
                          "&:before": { display: "none" },
                          "&.Mui-expanded": { my: 0, mb: 2 },
                        }}
                      >
                        <AccordionSummary
                          expandIcon={
                            <Box
                              sx={{
                                width: 34,
                                height: 34,
                                borderRadius: 2,
                                border: `1px solid ${cores.borda}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: cores.secundario,
                              }}
                            >
                              <ChevronDown size={19} />
                            </Box>
                          }
                          sx={{
                            px: { xs: 2, md: 3 },
                            py: 1.5,
                            minHeight: "unset",
                            "&.Mui-expanded": { minHeight: "unset" },
                            "& .MuiAccordionSummary-content": {
                              my: 1,
                              minWidth: 0,
                            },
                            "& .MuiAccordionSummary-content.Mui-expanded": {
                              my: 1,
                            },
                          }}
                        >
                          <Box sx={{ width: "100%", pr: 1, minWidth: 0 }}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: {
                                  xs: "flex-start",
                                  sm: "center",
                                },
                                flexDirection: {
                                  xs: "column",
                                  sm: "row",
                                },
                                gap: 1.5,
                                mb: 2,
                              }}
                            >
                              <Box sx={{ minWidth: 0 }}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                    gap: 1.2,
                                  }}
                                >
                                  <Typography
                                    variant="h6"
                                    sx={{
                                      fontWeight: 750,
                                      color: cores.texto,
                                      letterSpacing: "-.3px",
                                    }}
                                  >
                                    OS #{grupo.ordemId}
                                  </Typography>

                                  <Chip
                                    label={nomeStatus(statusGeral)}
                                    size="small"
                                    sx={{
                                      ...corStatus(statusGeral),
                                      fontWeight: 650,
                                      borderRadius: 1.5,
                                      height: 25,
                                    }}
                                  />
                                </Box>

                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: cores.secundario,
                                    mt: 0.5,
                                  }}
                                >
                                  {grupo.ordem.cliente?.nome ??
                                    "Cliente não informado"}
                                </Typography>
                              </Box>

                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  color: cores.secundario,
                                  flexShrink: 0,
                                }}
                              >
                                <CalendarDays size={16} />

                                <Typography variant="caption">
                                  Prazo:{" "}
                                  <strong>
                                    {formatarData(grupo.ordem.prazo)}
                                  </strong>
                                </Typography>
                              </Box>
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                flexWrap: "wrap",
                                gap: { xs: 1.5, md: 3 },
                                mb: 2,
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.7,
                                  color: cores.secundario,
                                }}
                              >
                                <Package size={15} />
                                <Typography variant="caption">
                                  <strong>{grupo.itens.length}</strong>{" "}
                                  {grupo.itens.length === 1 ? "peça" : "peças"}
                                </Typography>
                              </Box>

                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                <strong>{totalEtapas}</strong>{" "}
                                {totalEtapas === 1 ? "etapa" : "etapas"}
                              </Typography>

                              <Typography
                                variant="caption"
                                sx={{ color: cores.verde }}
                              >
                                <strong>{etapasConcluidas}</strong> concluídas
                              </Typography>

                              <Typography
                                variant="caption"
                                sx={{ color: cores.azul }}
                              >
                                <strong>{etapasEmAndamento}</strong> em
                                andamento
                              </Typography>

                              <Typography
                                variant="caption"
                                sx={{ color: cores.secundario }}
                              >
                                <strong>{etapasPendentes}</strong> pendentes
                              </Typography>
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                              }}
                            >
                              <LinearProgress
                                variant="determinate"
                                value={progresso}
                                sx={{
                                  flex: 1,
                                  height: 7,
                                  borderRadius: 10,
                                  backgroundColor: "#EDF0F4",
                                  "& .MuiLinearProgress-bar": {
                                    borderRadius: 10,
                                    backgroundColor: cores.verde,
                                  },
                                }}
                              />

                              <Typography
                                variant="caption"
                                sx={{
                                  fontWeight: 750,
                                  color: cores.texto,
                                  minWidth: 38,
                                  textAlign: "right",
                                }}
                              >
                                {Math.round(progresso)}%
                              </Typography>
                            </Box>
                          </Box>
                        </AccordionSummary>

                        <AccordionDetails
                          sx={{
                            px: { xs: 1.5, md: 3 },
                            pb: 3,
                            pt: 1,
                            backgroundColor: "#F8FAFC",
                            borderTop: `1px solid ${cores.borda}`,
                          }}
                        >
                          {grupo.itens.map((grupoItem) => {
                            const totalItem = grupoItem.producoes.length;

                            const concluidasItem = grupoItem.producoes.filter(
                              (item) => item.status === "CONCLUIDA",
                            ).length;

                            const progressoItem =
                              totalItem > 0
                                ? (concluidasItem / totalItem) * 100
                                : 0;

                            return (
                              <Card
                                key={grupoItem.item.id}
                                elevation={0}
                                sx={{
                                  mb: 2,
                                  border: `1px solid ${cores.borda}`,
                                  borderRadius: 2.5,
                                  overflow: "hidden",
                                  "&:last-child": { mb: 0 },
                                }}
                              >
                                {/* Cabeçalho da peça */}
                                <Box
                                  sx={{
                                    px: { xs: 2, md: 2.5 },
                                    py: 2,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: {
                                      xs: "flex-start",
                                      sm: "center",
                                    },
                                    flexDirection: {
                                      xs: "column",
                                      sm: "row",
                                    },
                                    gap: 2,
                                  }}
                                >
                                  <Box sx={{ minWidth: 0, flex: 1 }}>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        flexWrap: "wrap",
                                      }}
                                    >
                                      <Typography
                                        variant="subtitle1"
                                        sx={{
                                          fontWeight: 700,
                                          color: cores.texto,
                                        }}
                                      >
                                        {grupoItem.item.peca?.nome ??
                                          "Peça não informada"}
                                      </Typography>

                                      <Chip
                                        label={`${grupoItem.item.quantidade} ${
                                          grupoItem.item.quantidade === 1
                                            ? "unidade"
                                            : "unidades"
                                        }`}
                                        size="small"
                                        sx={{
                                          backgroundColor: "#F0F2F5",
                                          color: cores.texto,
                                          fontWeight: 600,
                                          height: 24,
                                        }}
                                      />
                                    </Box>

                                    <Typography
                                      variant="caption"
                                      sx={{
                                        display: "block",
                                        color: cores.secundario,
                                        mt: 0.5,
                                      }}
                                    >
                                      {totalItem}{" "}
                                      {totalItem === 1
                                        ? "processo cadastrado"
                                        : "processos cadastrados"}
                                    </Typography>
                                  </Box>

                                  <Box
                                    sx={{
                                      width: {
                                        xs: "100%",
                                        sm: 190,
                                      },
                                      flexShrink: 0,
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        mb: 0.7,
                                      }}
                                    >
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                      >
                                        Progresso da peça
                                      </Typography>

                                      <Typography
                                        variant="caption"
                                        sx={{
                                          color: cores.texto,
                                          fontWeight: 700,
                                        }}
                                      >
                                        {Math.round(progressoItem)}%
                                      </Typography>
                                    </Box>

                                    <LinearProgress
                                      variant="determinate"
                                      value={progressoItem}
                                      sx={{
                                        height: 6,
                                        borderRadius: 10,
                                        backgroundColor: "#EDF0F4",
                                        "& .MuiLinearProgress-bar": {
                                          borderRadius: 10,
                                          backgroundColor: cores.verde,
                                        },
                                      }}
                                    />
                                  </Box>
                                </Box>

                                {/* Tabela de processos */}
                                <TableContainer
                                  sx={{
                                    overflowX: "auto",
                                    borderTop: `1px solid ${cores.borda}`,
                                  }}
                                >
                                  <Table sx={{ minWidth: 900 }} size="small">
                                    <TableHead>
                                      <TableRow
                                        sx={{
                                          backgroundColor: "#F8FAFC",
                                          "& th": {
                                            color: cores.secundario,
                                            fontWeight: 700,
                                            fontSize: 11,
                                            textTransform: "uppercase",
                                            letterSpacing: ".4px",
                                            py: 1.5,
                                            borderBottom: `1px solid ${cores.borda}`,
                                          },
                                        }}
                                      >
                                        <TableCell>Processo</TableCell>
                                        <TableCell align="center">
                                          Etapa
                                        </TableCell>
                                        <TableCell>Operador</TableCell>
                                        <TableCell>Quantidade</TableCell>
                                        <TableCell>Prazo</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell align="right">
                                          Ações
                                        </TableCell>
                                      </TableRow>
                                    </TableHead>

                                    <TableBody>
                                      {grupoItem.producoes.map((producao) => {
                                        const emAndamento =
                                          producao.status === "EM_ANDAMENTO";

                                        return (
                                          <TableRow
                                            key={producao.id}
                                            hover
                                            sx={{
                                              backgroundColor: emAndamento
                                                ? "#F5F9FF"
                                                : "#FFFFFF",
                                              "& td": {
                                                borderBottom: `1px solid ${cores.borda}`,
                                                py: 1.5,
                                              },
                                              "&:last-child td": {
                                                borderBottom: 0,
                                              },
                                            }}
                                          >
                                            <TableCell>
                                              <Box
                                                sx={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                  gap: 1,
                                                }}
                                              >
                                                {emAndamento && (
                                                  <Box
                                                    sx={{
                                                      width: 7,
                                                      height: 7,
                                                      borderRadius: "50%",
                                                      backgroundColor:
                                                        cores.azul,
                                                      flexShrink: 0,
                                                    }}
                                                  />
                                                )}

                                                <Typography
                                                  variant="body2"
                                                  sx={{
                                                    fontWeight: emAndamento
                                                      ? 750
                                                      : 600,
                                                    color: cores.texto,
                                                  }}
                                                >
                                                  {producao.process?.name ??
                                                    "Não informado"}
                                                </Typography>
                                              </Box>
                                            </TableCell>

                                            <TableCell align="center">
                                              <Box
                                                sx={{
                                                  display: "inline-flex",
                                                  alignItems: "center",
                                                  justifyContent: "center",
                                                  width: 29,
                                                  height: 29,
                                                  borderRadius: 1.5,
                                                  backgroundColor: emAndamento
                                                    ? "#EAF2FF"
                                                    : "#F0F2F5",
                                                  color: emAndamento
                                                    ? cores.azul
                                                    : cores.texto,
                                                  fontSize: 12,
                                                  fontWeight: 750,
                                                }}
                                              >
                                                {producao.sequence}
                                              </Box>
                                            </TableCell>

                                            <TableCell>
                                              <Typography
                                                variant="body2"
                                                sx={{
                                                  color: producao.operador
                                                    ? cores.texto
                                                    : cores.secundario,
                                                  fontWeight: producao.operador
                                                    ? 500
                                                    : 400,
                                                }}
                                              >
                                                {producao.operador?.name ??
                                                  "Não atribuído"}
                                              </Typography>
                                            </TableCell>

                                            <TableCell>
                                              <Typography
                                                variant="body2"
                                                sx={{
                                                  color: cores.texto,
                                                  fontWeight: 600,
                                                }}
                                              >
                                                {producao.quantidadeProduzida} /{" "}
                                                {grupoItem.item.quantidade}
                                              </Typography>

                                              <Typography
                                                variant="caption"
                                                color="text.secondary"
                                              >
                                                Produzida / Solicitada
                                              </Typography>
                                            </TableCell>

                                            <TableCell>
                                              <Typography
                                                variant="body2"
                                                color="text.secondary"
                                              >
                                                {formatarData(
                                                  grupo.ordem.prazo,
                                                )}
                                              </Typography>
                                            </TableCell>

                                            <TableCell>
                                              <Chip
                                                label={nomeStatus(
                                                  producao.status,
                                                )}
                                                size="small"
                                                sx={{
                                                  ...corStatus(producao.status),
                                                  fontWeight: 650,
                                                  borderRadius: 1.5,
                                                  height: 25,
                                                }}
                                              />
                                            </TableCell>

                                            <TableCell align="right">
                                              <Box
                                                sx={{
                                                  display: "flex",
                                                  justifyContent: "flex-end",
                                                  gap: 0.3,
                                                }}
                                              >
                                                <Tooltip title="Visualizar">
                                                  <IconButton
                                                    aria-label="Visualizar produção"
                                                    onClick={() =>
                                                      abrirVisualizacao(
                                                        producao,
                                                      )
                                                    }
                                                    size="small"
                                                    sx={{
                                                      color: cores.secundario,
                                                      "&:hover": {
                                                        backgroundColor:
                                                          "#F0F2F5",
                                                        color: cores.texto,
                                                      },
                                                    }}
                                                  >
                                                    <Eye size={17} />
                                                  </IconButton>
                                                </Tooltip>

                                                <Tooltip
                                                  title={
                                                    producao.status ===
                                                    "CONCLUIDA"
                                                      ? "Etapa concluída"
                                                      : "Editar"
                                                  }
                                                >
                                                  <span>
                                                    <IconButton
                                                      aria-label="Editar produção"
                                                      onClick={() =>
                                                        abrirEdicao(producao)
                                                      }
                                                      disabled={
                                                        producao.status ===
                                                        "CONCLUIDA"
                                                      }
                                                      size="small"
                                                      sx={{
                                                        color: cores.azul,
                                                        "&:hover": {
                                                          backgroundColor:
                                                            "#EAF2FF",
                                                        },
                                                      }}
                                                    >
                                                      <Pencil size={17} />
                                                    </IconButton>
                                                  </span>
                                                </Tooltip>

                                                <Tooltip title="Excluir">
                                                  <IconButton
                                                    aria-label="Excluir produção"
                                                    onClick={() =>
                                                      abrirExclusao(producao)
                                                    }
                                                    size="small"
                                                    sx={{
                                                      color: cores.vermelho,
                                                      "&:hover": {
                                                        backgroundColor:
                                                          "#FFF0F0",
                                                      },
                                                    }}
                                                  >
                                                    <Trash2 size={17} />
                                                  </IconButton>
                                                </Tooltip>
                                              </Box>
                                            </TableCell>
                                          </TableRow>
                                        );
                                      })}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              </Card>
                            );
                          })}
                        </AccordionDetails>
                      </Accordion>
                    );
                  })}
                </Box>
              )}
            </>
          )}
        </Card>
      </Box>

      {/* Dialog de edição */}
      <Dialog
        open={dialogEdicao}
        onClose={processando ? undefined : fecharEdicao}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: { borderRadius: 3 },
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 750,
            color: cores.texto,
            borderBottom: `1px solid ${cores.borda}`,
          }}
        >
          Editar produção #{producaoSelecionada?.id}
        </DialogTitle>

        <DialogContent sx={{ pt: "20px !important" }}>
          {producaoConcluida ? (
            <Alert severity="warning" sx={{ mt: 1 }}>
              Produções concluídas não podem ser alteradas.
            </Alert>
          ) : (
            <>
              <Alert
                severity="info"
                icon={<AlertCircle size={19} />}
                sx={{ mb: 2.5, borderRadius: 2 }}
              >
                <strong>OS:</strong> #
                {producaoSelecionada?.itemOrdem?.ordem?.id ?? "-"}
                <br />
                <strong>Peça:</strong>{" "}
                {producaoSelecionada?.itemOrdem?.peca?.nome ?? "-"}
                <br />
                <strong>Processo:</strong>{" "}
                {producaoSelecionada?.process?.name ?? "-"}
                <br />
                <strong>Sequência:</strong>{" "}
                {producaoSelecionada?.sequence ?? "-"}
              </Alert>

              <TextField
                fullWidth
                select
                label="Operador"
                value={formulario.operadorId}
                onChange={(e) => atualizarCampo("operadorId", e.target.value)}
                sx={{ mb: 2 }}
              >
                <MenuItem value="">Não atribuído</MenuItem>

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

              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, color: cores.texto, mb: 1.5 }}
              >
                Controle de quantidades
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(3, 1fr)",
                  },
                  gap: 2,
                  mb: 2.5,
                }}
              >
                <TextField
                  type="number"
                  label="Produzida"
                  value={formulario.quantidadeProduzida}
                  onChange={(e) =>
                    atualizarCampo("quantidadeProduzida", e.target.value)
                  }
                  slotProps={{
                    htmlInput: { min: 0, step: 1 },
                  }}
                />

                <TextField
                  type="number"
                  label="Aprovada"
                  value={formulario.quantidadeAprovada}
                  onChange={(e) =>
                    atualizarCampo("quantidadeAprovada", e.target.value)
                  }
                  slotProps={{
                    htmlInput: { min: 0, step: 1 },
                  }}
                />

                <TextField
                  type="number"
                  label="Rejeitada"
                  value={formulario.quantidadeRejeitada}
                  onChange={(e) =>
                    atualizarCampo("quantidadeRejeitada", e.target.value)
                  }
                  slotProps={{
                    htmlInput: { min: 0, step: 1 },
                  }}
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

        <DialogActions
          sx={{
            p: 2.5,
            borderTop: `1px solid ${cores.borda}`,
          }}
        >
          <Button
            onClick={fecharEdicao}
            disabled={processando}
            sx={{
              textTransform: "none",
              color: cores.secundario,
              fontWeight: 600,
            }}
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
                fontWeight: 650,
                borderRadius: 2,
                backgroundColor: cores.laranja,
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
        slotProps={{
          paper: {
            sx: { borderRadius: 3 },
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 750,
            color: cores.texto,
            borderBottom: `1px solid ${cores.borda}`,
          }}
        >
          Detalhes da produção #{producaoSelecionada?.id}
        </DialogTitle>

        <DialogContent sx={{ pt: "20px !important" }}>
          {producaoSelecionada && (
            <Box sx={{ mt: 1, display: "grid", gap: 2.2 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "#F6F8FB",
                  display: "grid",
                  gap: 1.5,
                }}
              >
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
                  <strong>Processo:</strong>{" "}
                  {producaoSelecionada.process?.name ?? "Não informado"}
                </Typography>

                <Typography>
                  <strong>Sequência:</strong>{" "}
                  {producaoSelecionada.sequence ?? "-"}
                </Typography>

                <Typography>
                  <strong>Operador:</strong>{" "}
                  {producaoSelecionada.operador?.name ?? "Não atribuído"}
                </Typography>

                <Box>
                  <Typography component="span" sx={{ fontWeight: 700, mr: 1 }}>
                    Status:
                  </Typography>

                  <Chip
                    label={nomeStatus(producaoSelecionada.status)}
                    size="small"
                    sx={{
                      ...corStatus(producaoSelecionada.status),
                      fontWeight: 650,
                    }}
                  />
                </Box>
              </Box>

              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, color: cores.texto }}
              >
                Quantidades
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 1.5,
                }}
              >
                {[
                  {
                    titulo: "Solicitada",
                    valor: producaoSelecionada.itemOrdem?.quantidade ?? "-",
                  },
                  {
                    titulo: "Produzida",
                    valor: producaoSelecionada.quantidadeProduzida,
                  },
                  {
                    titulo: "Aprovada",
                    valor: producaoSelecionada.quantidadeAprovada,
                  },
                  {
                    titulo: "Rejeitada",
                    valor: producaoSelecionada.quantidadeRejeitada,
                  },
                ].map((item) => (
                  <Box
                    key={item.titulo}
                    sx={{
                      p: 1.8,
                      border: `1px solid ${cores.borda}`,
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {item.titulo}
                    </Typography>

                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 750, color: cores.texto }}
                    >
                      {item.valor}
                    </Typography>
                  </Box>
                ))}
              </Box>

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

              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700, color: cores.texto, mb: 0.5 }}
                >
                  Observações
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {producaoSelecionada.observacoes || "Sem observações."}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            p: 2.5,
            borderTop: `1px solid ${cores.borda}`,
          }}
        >
          <Button
            onClick={() => setDialogVisualizacao(false)}
            sx={{
              textTransform: "none",
              color: cores.secundario,
              fontWeight: 600,
            }}
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
        slotProps={{
          paper: {
            sx: { borderRadius: 3 },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 750, color: cores.texto }}>
          Excluir produção
        </DialogTitle>

        <DialogContent>
          <Typography color="text.secondary">
            Tem certeza de que deseja excluir a produção{" "}
            <strong>#{producaoSelecionada?.id}</strong>?
          </Typography>

          <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }}>
            Essa ação não poderá ser desfeita.
          </Alert>
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={fecharExclusao}
            disabled={processando}
            sx={{
              textTransform: "none",
              color: cores.secundario,
              fontWeight: 600,
            }}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={excluirProducao}
            disabled={processando}
            sx={{
              textTransform: "none",
              fontWeight: 650,
              borderRadius: 2,
            }}
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
          sx={{ borderRadius: 2 }}
        >
          {mensagem}
        </Alert>
      </Snackbar>
    </Box>
  );
}
