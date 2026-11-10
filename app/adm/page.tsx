"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Grid from "@mui/material/Grid";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";

import {
  ClipboardList,
  Users,
  Package,
  Clock,
  PlusCircle,
  Factory,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// TIPOS

interface Ordem {
  id: number;
  dataAbertura: string;
}

interface Cliente {
  id: number;
  nome: string;
}

interface Peca {
  id: number;
  nome: string;
}

interface PecaDaOrdem {
  nome: string;
  material: string;
  quantidade: number;
}

interface OrdemRecente {
  id: number;
  cliente: string;
  pecas: PecaDaOrdem[];
  prazo: string | null;
  status: string;
  observacoes?: string | null;
}

interface Resumo {
  totalOs: number;
  emProducao: number;
  aguardando: number;
  concluidas: number;
  totalClientes: number;
  atrasadas: number;
}

// FORMATAÇÃO DE DATAS

function formatarData(data: string | null) {
  if (!data) return "Não definido";

  const [ano, mes, dia] = data.slice(0, 10).split("-");

  return `${dia}/${mes}/${ano}`;
}

// CORES DOS STATUS

function corStatus(
  status: string,
): "info" | "warning" | "success" | "error" | "default" {
  switch (status) {
    case "ABERTA":
      return "info";

    case "EM_ANDAMENTO":
      return "warning";

    case "CONCLUIDA":
      return "success";

    case "CANCELADA":
      return "error";

    default:
      return "default";
  }
}

// ÚLTIMOS SEIS MESES

function obterUltimosSeisMeses() {
  const hoje = new Date();

  return Array.from({ length: 6 }, (_, indice) => {
    const data = new Date(
      hoje.getFullYear(),
      hoje.getMonth() - (5 - indice),
      1,
    );

    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");

    return {
      chave: `${ano}-${mes}`,
      nome: data.toLocaleDateString("pt-BR", {
        month: "short",
      }),
    };
  });
}

// DASHBOARD

export default function DashboardPage() {
  const router = useRouter();

  const [resumo, setResumo] = useState<Resumo | null>(null);

  const [ordens, setOrdens] = useState<Ordem[]>([]);
  const [ordensRecentes, setOrdensRecentes] = useState<OrdemRecente[]>([]);

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [pecas, setPecas] = useState<Peca[]>([]);

  // FILTROS

  const [busca, setBusca] = useState("");
  const [statusSelecionado, setStatusSelecionado] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState("");

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // BUSCA OS DADOS DA API

  useEffect(() => {
    async function buscarDados() {
      try {
        const [
          respostaResumo,
          respostaOrdens,
          respostaRecentes,
          respostaClientes,
          respostaPecas,
        ] = await Promise.all([
          fetch(`${API_URL}/dashboard/resumo`),
          fetch(`${API_URL}/orders`),
          fetch(`${API_URL}/dashboard/ordens-recentes`),
          fetch(`${API_URL}/clients`),
          fetch(`${API_URL}/pecas`),
        ]);

        if (
          !respostaResumo.ok ||
          !respostaOrdens.ok ||
          !respostaRecentes.ok ||
          !respostaClientes.ok ||
          !respostaPecas.ok
        ) {
          throw new Error("Erro ao buscar dados do dashboard.");
        }

        const [
          dadosResumo,
          dadosOrdens,
          dadosRecentes,
          dadosClientes,
          dadosPecas,
        ] = await Promise.all([
          respostaResumo.json(),
          respostaOrdens.json(),
          respostaRecentes.json(),
          respostaClientes.json(),
          respostaPecas.json(),
        ]);

        setResumo(dadosResumo);
        setOrdens(dadosOrdens);
        setOrdensRecentes(dadosRecentes);
        setClientes(dadosClientes);
        setPecas(dadosPecas);
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
        setErro("Não foi possível carregar os dados do dashboard.");
      } finally {
        setCarregando(false);
      }
    }

    buscarDados();
  }, []);

  // FILTROS DAS ORDENS

  const ordensFiltradas = ordensRecentes.filter((ordem) => {
    const termo = busca.trim().toLowerCase();

    const correspondeBusca =
      termo === "" ||
      String(ordem.id).includes(termo) ||
      (ordem.cliente ?? "").toLowerCase().includes(termo) ||
      (ordem.pecas ?? []).some((peca) =>
        (peca.nome ?? "").toLowerCase().includes(termo),
      );

    const correspondeStatus =
      statusSelecionado === "" || ordem.status === statusSelecionado;

    const correspondeCliente =
      clienteSelecionado === "" || ordem.cliente === clienteSelecionado;

    return correspondeBusca && correspondeStatus && correspondeCliente;
  });

  // INDICADORES

  const indicadores = [
    {
      titulo: "Ordens de serviço",
      valor: resumo?.totalOs ?? "—",
      descricao: "Total de ordens cadastradas",
      Icone: ClipboardList,
      cor: "#E56A2F",
      fundo: "#FFF0E8",
    },
    {
      titulo: "Clientes",
      valor: resumo?.totalClientes ?? "—",
      descricao: "Total de clientes cadastrados",
      Icone: Users,
      cor: "#3985D6",
      fundo: "#EAF3FC",
    },
    {
      titulo: "Peças",
      valor: carregando ? "—" : pecas.length,
      descricao: "Total de peças cadastradas",
      Icone: Package,
      cor: "#269B72",
      fundo: "#E8F6F0",
    },
    {
      titulo: "Em andamento",
      valor: resumo?.emProducao ?? "—",
      descricao: "Ordens em andamento",
      Icone: Clock,
      cor: "#D69A28",
      fundo: "#FFF7E6",
    },
  ];

  // DADOS DO GRÁFICO

  const ultimosMeses = obterUltimosSeisMeses();

  const dadosGrafico = ultimosMeses.map((mes) => {
    const quantidade = ordens.filter(
      (ordem) => ordem.dataAbertura?.slice(0, 7) === mes.chave,
    ).length;

    return {
      ...mes,
      quantidade,
    };
  });

  const maiorQuantidade = Math.max(
    ...dadosGrafico.map((mes) => mes.quantidade),
    1,
  );

  // RANKING DAS PEÇAS MAIS SOLICITADAS

  const pecasMaisSolicitadas = Object.values(
    ordensRecentes
      .flatMap((ordem) => ordem.pecas ?? [])
      .reduce(
        (acumulado, peca) => {
          const nome = peca.nome || "Peça sem nome";

          if (!acumulado[nome]) {
            acumulado[nome] = {
              nome,
              quantidade: 0,
            };
          }

          acumulado[nome].quantidade += Number(peca.quantidade) || 0;

          return acumulado;
        },
        {} as Record<string, { nome: string; quantidade: number }>,
      ),
  ).sort((a, b) => b.quantidade - a.quantidade);

  // MÁQUINAS: DADOS DEMONSTRATIVOS TEMPORÁRIOS

  const maquinas = [
    {
      id: 1,
      nome: "Torno CNC",
      codigo: "MC-001",
      status: "EM OPERAÇÃO",
    },
    {
      id: 2,
      nome: "Fresadora",
      codigo: "MC-002",
      status: "DISPONÍVEL",
    },
    {
      id: 3,
      nome: "Retífica",
      codigo: "MC-003",
      status: "MANUTENÇÃO",
    },
  ];

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        pt: { xs: 3, md: 4 },
        backgroundColor: "#F5F6FA",
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* CABEÇALHO */}

      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#17233B" }}>
          Dashboard
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Visão geral do sistema de gestão
        </Typography>

        {erro && (
          <Typography color="error" sx={{ mt: 2 }}>
            {erro}
          </Typography>
        )}
      </Box>

      {/* INDICADORES */}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {indicadores.map((indicador) => {
          const Icone = indicador.Icone;

          return (
            <Grid key={indicador.titulo} size={{ xs: 12, sm: 6, lg: 3 }}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: "1px solid #EAECF0",
                  height: "100%",
                  minHeight: 150,
                }}
              >
                <CardContent
                  sx={{
                    p: 2.5,
                    "&:last-child": { pb: 2.5 },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 1,
                    }}
                  >
                    <Typography color="text.secondary" sx={{ fontWeight: 600 }}>
                      {indicador.titulo}
                    </Typography>

                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        flexShrink: 0,
                        borderRadius: 2,
                        backgroundColor: indicador.fundo,
                        color: indicador.cor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icone size={22} />
                    </Box>
                  </Box>

                  <Typography
                    variant="h4"
                    sx={{ mt: 2, fontWeight: 700, color: "#17233B" }}
                  >
                    {carregando ? (
                      <CircularProgress size={25} />
                    ) : (
                      indicador.valor
                    )}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    {indicador.descricao}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* CONTEÚDO PRINCIPAL - LARGURA TOTAL */}

      <Grid container spacing={2}>
        <Grid
          size={{ xs: 12 }}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            minWidth: 0,
          }}
        >
          {/* ORDENS DE SERVIÇO */}

          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid #EAECF0",
              width: "100%",
              minWidth: 0,
            }}
          >
            <CardContent
              sx={{
                p: { xs: 2, md: 3 },
                "&:last-child": {
                  pb: 2,
                },
              }}
            >
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
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "#17233B" }}
                  >
                    Ordens de serviço
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    Consulte e acompanhe as ordens cadastradas.
                  </Typography>
                </Box>

                <Button
                  component={Link}
                  href="/adm/ordens-servico"
                  variant="contained"
                  startIcon={<PlusCircle size={19} />}
                  sx={{
                    backgroundColor: "#E56A2F",
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 2,
                    px: 2.5,
                    py: 1.2,
                    "&:hover": { backgroundColor: "#C94F1D" },
                  }}
                >
                  Criar nova OS
                </Button>
              </Box>

              {/* FILTROS */}

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Buscar por número, cliente ou peça"
                    placeholder="Digite sua busca..."
                    value={busca}
                    onChange={(event) => setBusca(event.target.value)}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Status"
                    value={statusSelecionado}
                    onChange={(event) =>
                      setStatusSelecionado(event.target.value)
                    }
                  >
                    <MenuItem value="">Todos os status</MenuItem>
                    <MenuItem value="ABERTA">Aberta</MenuItem>
                    <MenuItem value="EM_ANDAMENTO">Em andamento</MenuItem>
                    <MenuItem value="CONCLUIDA">Concluída</MenuItem>
                    <MenuItem value="CANCELADA">Cancelada</MenuItem>
                  </TextField>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Cliente"
                    value={clienteSelecionado}
                    onChange={(event) =>
                      setClienteSelecionado(event.target.value)
                    }
                  >
                    <MenuItem value="">Todos os clientes</MenuItem>

                    {clientes.map((cliente) => (
                      <MenuItem key={cliente.id} value={cliente.nome}>
                        {cliente.nome}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>

              {/* TABELA */}

              {carregando ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : erro ? (
                <Typography color="error">{erro}</Typography>
              ) : ordensFiltradas.length === 0 ? (
                <Box sx={{ py: 5, textAlign: "center" }}>
                  <Typography color="text.secondary">
                    Nenhuma ordem de serviço encontrada.
                  </Typography>
                </Box>
              ) : (
                <TableContainer
                  sx={{
                    width: "100%",
                    overflowX: "auto",
                  }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <strong>Nº</strong>
                        </TableCell>

                        <TableCell>
                          <strong>Cliente</strong>
                        </TableCell>

                        <TableCell>
                          <strong>Peças</strong>
                        </TableCell>

                        <TableCell>
                          <strong>Qtd.</strong>
                        </TableCell>

                        <TableCell>
                          <strong>Prazo</strong>
                        </TableCell>

                        <TableCell>
                          <strong>Status</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {ordensFiltradas.map((ordem) => {
                        const quantidade = (ordem.pecas ?? []).reduce(
                          (total, peca) =>
                            total + (Number(peca.quantidade) || 0),
                          0,
                        );

                        return (
                          <TableRow
                            key={ordem.id}
                            hover
                            onClick={() =>
                              router.push(`/adm/ordens-servico/${ordem.id}`)
                            }
                            sx={{
                              cursor: "pointer",
                              transition: "background-color 0.2s",
                              "&:hover": {
                                backgroundColor: "#FFF4EE",
                              },
                            }}
                          >
                            <TableCell>
                              <strong>#{ordem.id}</strong>
                            </TableCell>

                            <TableCell>
                              {ordem.cliente || "Cliente não informado"}
                            </TableCell>

                            <TableCell sx={{ minWidth: 180 }}>
                              {ordem.pecas?.length > 0
                                ? ordem.pecas
                                    .map(
                                      (peca) =>
                                        `${peca.nome} (${peca.material || "Sem material"})`,
                                    )
                                    .join(", ")
                                : "Nenhuma peça cadastrada"}
                            </TableCell>

                            <TableCell>{quantidade}</TableCell>

                            <TableCell>{formatarData(ordem.prazo)}</TableCell>

                            <TableCell>
                              <Chip
                                label={String(
                                  ordem.status ?? "Não informado",
                                ).replaceAll("_", " ")}
                                color={corStatus(ordem.status ?? "")}
                                size="small"
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {!carregando && ordensRecentes.length > 0 && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
                  Exibindo {ordensFiltradas.length} de {ordensRecentes.length}{" "}
                  ordens.
                </Typography>
              )}

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 1 }}
              >
                Clique em uma ordem para visualizar seus detalhes.
              </Typography>
            </CardContent>
          </Card>

          {/* GRÁFICO */}

          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid #EAECF0",
              width: "100%",
            }}
          >
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "#17233B", mb: 1 }}
              >
                Ordens de serviço por mês
              </Typography>

              <Typography color="text.secondary" variant="body2" sx={{ mb: 4 }}>
                Quantidade de ordens abertas nos últimos seis meses
              </Typography>

              {carregando ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "end",
                    gap: { xs: 1, sm: 3 },
                    height: 220,
                    px: { xs: 0, sm: 2 },
                    pb: 1,
                  }}
                >
                  {dadosGrafico.map((mes) => (
                    <Box
                      key={mes.chave}
                      sx={{
                        flex: 1,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "end",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {mes.quantidade}
                      </Typography>

                      <Box
                        sx={{
                          width: "100%",
                          maxWidth: 64,
                          height: `${(mes.quantidade / maiorQuantidade) * 100}%`,
                          minHeight: mes.quantidade > 0 ? 4 : 0,
                          backgroundColor: "#E56A2F",
                          borderRadius: "6px 6px 0 0",
                          transition: "height 0.3s",
                        }}
                      />

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ textTransform: "capitalize" }}
                      >
                        {mes.nome}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>

          {/* PAINÉIS INFERIORES */}

          <Grid container spacing={2} sx={{ alignItems: "stretch" }}>
            {/* CLIENTES */}

            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                elevation={0}
                sx={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 3,
                  border: "1px solid #EAECF0",
                }}
              >
                <CardContent sx={{ p: 3, "&:last-child": { pb: 2 } }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      mb: 2.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#3985D6",
                        backgroundColor: "#EAF3FC",
                      }}
                    >
                      <Users size={21} />
                    </Box>

                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, color: "#17233B" }}
                      >
                        Clientes
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        {clientes.length} clientes cadastrados
                      </Typography>
                    </Box>
                  </Box>

                  {carregando ? (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", py: 3 }}
                    >
                      <CircularProgress size={24} />
                    </Box>
                  ) : clientes.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      Nenhum cliente cadastrado.
                    </Typography>
                  ) : (
                    <Box>
                      {clientes.slice(0, 5).map((cliente) => (
                        <Box
                          key={cliente.id}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            py: 1.25,
                            borderBottom: "1px solid #F0F1F4",
                            "&:last-child": { borderBottom: 0 },
                          }}
                        >
                          <Box
                            sx={{
                              width: 34,
                              height: 34,
                              flexShrink: 0,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "#F0F4FA",
                              color: "#3985D6",
                              fontWeight: 700,
                            }}
                          >
                            {(cliente.nome || "C").charAt(0).toUpperCase()}
                          </Box>

                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: "#344054",
                              overflowWrap: "anywhere",
                            }}
                          >
                            {cliente.nome}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* PEÇAS MAIS SOLICITADAS */}

            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                elevation={0}
                sx={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 3,
                  border: "1px solid #EAECF0",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      mb: 2.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#269B72",
                        backgroundColor: "#E8F6F0",
                      }}
                    >
                      <Package size={21} />
                    </Box>

                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, color: "#17233B" }}
                      >
                        Peças mais solicitadas
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        Ranking por quantidade nas ordens recentes
                      </Typography>
                    </Box>
                  </Box>

                  {carregando ? (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", py: 3 }}
                    >
                      <CircularProgress size={24} />
                    </Box>
                  ) : pecasMaisSolicitadas.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      Ainda não há peças nas ordens recentes.
                    </Typography>
                  ) : (
                    <Box>
                      {pecasMaisSolicitadas.slice(0, 5).map((peca, indice) => {
                        const maiorQuantidade =
                          pecasMaisSolicitadas[0].quantidade || 1;

                        const percentual =
                          (peca.quantidade / maiorQuantidade) * 100;

                        return (
                          <Box
                            key={peca.nome}
                            sx={{
                              mb: 2,
                              "&:last-child": { mb: 0 },
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: 1,
                                mb: 0.75,
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  color: "#344054",
                                  overflowWrap: "anywhere",
                                }}
                              >
                                {indice + 1}. {peca.nome}
                              </Typography>

                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 700,
                                  color: "#269B72",
                                  flexShrink: 0,
                                }}
                              >
                                {peca.quantidade}
                              </Typography>
                            </Box>

                            <Box
                              sx={{
                                height: 7,
                                borderRadius: 10,
                                backgroundColor: "#E8F6F0",
                                overflow: "hidden",
                              }}
                            >
                              <Box
                                sx={{
                                  width: `${percentual}%`,
                                  height: "100%",
                                  borderRadius: 10,
                                  backgroundColor: "#269B72",
                                }}
                              />
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* MÁQUINAS */}

            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                elevation={0}
                sx={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 3,
                  border: "1px solid #EAECF0",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 1,
                      mb: 2.5,
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <Box
                        sx={{
                          width: 42,
                          height: 42,
                          borderRadius: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#8B5CF6",
                          backgroundColor: "#F2EDFF",
                        }}
                      >
                        <Factory size={21} />
                      </Box>

                      <Box>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 700, color: "#17233B" }}
                        >
                          Máquinas
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          Situação demonstrativa
                        </Typography>
                      </Box>
                    </Box>

                    <Chip label="Estático" size="small" variant="outlined" />
                  </Box>

                  {maquinas.map((maquina) => {
                    const cor =
                      maquina.status === "EM OPERAÇÃO"
                        ? "warning"
                        : maquina.status === "DISPONÍVEL"
                          ? "success"
                          : "error";

                    return (
                      <Box
                        key={maquina.id}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 1,
                          py: 1.5,
                          borderBottom: "1px solid #F0F1F4",
                          "&:last-child": { borderBottom: 0 },
                        }}
                      >
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: "#344054" }}
                          >
                            {maquina.nome}
                          </Typography>

                          <Typography variant="caption" color="text.secondary">
                            {maquina.codigo}
                          </Typography>
                        </Box>

                        <Chip label={maquina.status} color={cor} size="small" />
                      </Box>
                    );
                  })}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
