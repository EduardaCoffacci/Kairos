"use client";

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
  MenuItem,
  TextField,
  Typography,
  Chip,
} from "@mui/material";

import {
  Plus,
  Trash2,
  ArrowDown,
  ArrowUp,
  Lock,
} from "lucide-react";

interface Cliente {
  id: number;
  nome: string;
}

interface Peca {
  id: number;
  nome: string;
  descricao: string | null;
}

interface ProcessoUsinagem {
  id: number;
  name: string;
  description?: string;
  active?: boolean;
}

interface ProcessoSelecionado {
  id: number;
  name: string;
}

interface ItemOrdem {
  id?: number;
  pecaId: number | "";
  quantidade: number;
  processos: ProcessoSelecionado[];
}

interface ItemOriginal {
  id: number;
  pecaId: number;
}

interface OrdemDetalhada {
  id: number;
  cliente: Cliente;
  status: string;
  valor: number | string;
  prazo: string | null;
  observacoes: string | null;
  itens?: {
    id: number;
    peca?: {
      id: number;
    };
    quantidade: number;
  }[];
}

interface ProducaoExistente {
  id: number;
  itemOrdem: {
    id: number;
  };
  process: {
    id: number;
    name: string;
  };
  sequence: number;
  status: string;
}

interface Props {
  open: boolean;
  ordemId: number | null;
  onClose: () => void;
  onSalvo: (editando: boolean) => Promise<void>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

async function enviarRequisicao(
  url: string,
  mensagemPadrao: string,
  options?: RequestInit,
) {
  const resposta = await fetch(url, options);

  if (!resposta.ok) {
    throw new Error(await obterErro(resposta, mensagemPadrao));
  }

  return resposta;
}

export default function ModalNovaOrdem({
  open,
  ordemId,
  onClose,
  onSalvo,
}: Props) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [processosDisponiveis, setProcessosDisponiveis] =
    useState<ProcessoUsinagem[]>([]);

  const [clienteId, setClienteId] = useState<number | "">("");
  const [status, setStatus] = useState("ABERTA");
  const [valor, setValor] = useState("");
  const [prazo, setPrazo] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [itens, setItens] = useState<ItemOrdem[]>([
    { pecaId: "", quantidade: 1, processos: [] },
  ]);

  const [itensOriginais, setItensOriginais] = useState<
    ItemOriginal[]
  >([]);

  const [producoesOriginais, setProducoesOriginais] = useState<
    ProducaoExistente[]
  >([]);

  const [carregandoDados, setCarregandoDados] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const editando = ordemId !== null;

  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      async function carregarDados() {
        try {
          setCarregandoDados(true);
          setErro("");

          const requisicoes: Promise<Response>[] = [
            fetch(`${API_URL}/clients`),
            fetch(`${API_URL}/pecas`),
            fetch(`${API_URL}/machining-processes`),
          ];

          if (ordemId !== null) {
            requisicoes.push(
              fetch(`${API_URL}/orders/${ordemId}`),
            );
            requisicoes.push(fetch(`${API_URL}/production`));
          }

          const respostas = await Promise.all(requisicoes);

          if (
            !respostas[0].ok ||
            !respostas[1].ok ||
            !respostas[2].ok
          ) {
            throw new Error(
              "Não foi possível carregar clientes, peças e processos.",
            );
          }

          const [dadosClientes, dadosPecas, dadosProcessos] =
            await Promise.all([
              respostas[0].json(),
              respostas[1].json(),
              respostas[2].json(),
            ]);

          setClientes(dadosClientes);
          setPecas(dadosPecas);

          setProcessosDisponiveis(
            dadosProcessos.filter(
              (processo: ProcessoUsinagem) =>
                processo.active !== false,
            ),
          );

          if (ordemId !== null) {
            const respostaOrdem = respostas[3];
            const respostaProducoes = respostas[4];

            if (
              !respostaOrdem.ok ||
              !respostaProducoes.ok
            ) {
              throw new Error(
                "Não foi possível carregar os dados da ordem e da produção.",
              );
            }

            const [ordem, todasProducoes]: [
              OrdemDetalhada,
              ProducaoExistente[],
            ] = await Promise.all([
              respostaOrdem.json(),
              respostaProducoes.json(),
            ]);

            const producoesDaOrdem = todasProducoes.filter(
              (producao) =>
                ordem.itens?.some(
                  (item) =>
                    item.id === producao.itemOrdem?.id,
                ),
            );

            setProducoesOriginais(producoesDaOrdem);

            setClienteId(ordem.cliente?.id ?? "");
            setStatus(ordem.status ?? "ABERTA");
            setValor(String(ordem.valor ?? ""));
            setPrazo(
              ordem.prazo
                ? ordem.prazo.substring(0, 10)
                : "",
            );
            setObservacoes(ordem.observacoes ?? "");

            const itensCarregados: ItemOrdem[] = (
              ordem.itens ?? []
            ).map((item) => {
              const processosDoItem = producoesDaOrdem
                .filter(
                  (producao) =>
                    producao.itemOrdem.id === item.id,
                )
                .sort(
                  (a, b) => a.sequence - b.sequence,
                )
                .map((producao) => ({
                  id: producao.process.id,
                  name: producao.process.name,
                }));

              return {
                id: item.id,
                pecaId: item.peca?.id ?? "",
                quantidade: item.quantidade,
                processos: processosDoItem,
              };
            });

            setItens(
              itensCarregados.length > 0
                ? itensCarregados
                : [
                    {
                      pecaId: "",
                      quantidade: 1,
                      processos: [],
                    },
                  ],
            );

            setItensOriginais(
              (ordem.itens ?? []).map((item) => ({
                id: item.id,
                pecaId: item.peca?.id ?? 0,
              })),
            );
          } else {
            limparFormulario();
          }
        } catch (error) {
          setErro(
            error instanceof Error
              ? error.message
              : "Erro ao carregar os dados.",
          );
        } finally {
          setCarregandoDados(false);
        }
      }

      void carregarDados();
    }, 0);

    return () => clearTimeout(timer);
  }, [open, ordemId]);

  function adicionarItem() {
    setItens((atuais) => [
      ...atuais,
      {
        pecaId: "",
        quantidade: 1,
        processos: [],
      },
    ]);
  }

  function removerItem(indice: number) {
    setItens((atuais) => {
      const item = atuais[indice];

      if (!item) return atuais;

      if (itemPossuiProducaoIniciada(item.id)) {
        return atuais;
      }

      return atuais.filter((_, index) => index !== indice);
    });
  }

  function atualizarItem(
    indice: number,
    campo: "pecaId" | "quantidade",
    valorCampo: number | "",
  ) {
    setItens((atuais) =>
      atuais.map((item, index) => {
        if (index !== indice) return item;

        if (
          campo === "pecaId" &&
          itemPossuiProducaoIniciada(item.id)
        ) {
          return item;
        }

        return {
          ...item,
          [campo]: valorCampo,
        };
      }),
    );
  }

  function adicionarProcesso(
    indiceItem: number,
    processoId: number,
  ) {
    const processo = processosDisponiveis.find(
      (item) => item.id === processoId,
    );

    if (!processo) return;

    setItens((atuais) =>
      atuais.map((item, index) => {
        if (index !== indiceItem) return item;

        const jaAdicionado = item.processos.some(
          (selecionado) =>
            selecionado.id === processoId,
        );

        if (jaAdicionado) return item;

        return {
          ...item,
          processos: [
            ...item.processos,
            {
              id: processo.id,
              name: processo.name,
            },
          ],
        };
      }),
    );
  }

  function obterProducoesDoItem(itemId: number) {
    return producoesOriginais.filter(
      (producao) =>
        producao.itemOrdem.id === itemId,
    );
  }

  function obterProducaoDoProcesso(
    itemId: number | undefined,
    processoId: number,
  ) {
    if (itemId === undefined) return undefined;

    return producoesOriginais.find(
      (producao) =>
        producao.itemOrdem.id === itemId &&
        producao.process.id === processoId,
    );
  }

  function processoEstaBloqueado(
    itemId: number | undefined,
    processoId: number,
  ) {
    const producao = obterProducaoDoProcesso(
      itemId,
      processoId,
    );

    return (
      producao !== undefined &&
      producao.status !== "PENDENTE"
    );
  }

  function itemPossuiProducaoIniciada(
    itemId: number | undefined,
  ) {
    if (itemId === undefined) return false;

    return producoesOriginais.some(
      (producao) =>
        producao.itemOrdem.id === itemId &&
        producao.status !== "PENDENTE",
    );
  }

  function removerProcesso(
    indiceItem: number,
    processoId: number,
  ) {
    setItens((atuais) =>
      atuais.map((item, index) => {
        if (index !== indiceItem) return item;

        if (
          processoEstaBloqueado(
            item.id,
            processoId,
          )
        ) {
          return item;
        }

        return {
          ...item,
          processos: item.processos.filter(
            (processo) =>
              processo.id !== processoId,
          ),
        };
      }),
    );
  }

  function moverProcesso(
    indiceItem: number,
    indiceProcesso: number,
    direcao: -1 | 1,
  ) {
    setItens((atuais) =>
      atuais.map((item, index) => {
        if (index !== indiceItem) return item;

        const novaPosicao = indiceProcesso + direcao;

        if (
          novaPosicao < 0 ||
          novaPosicao >= item.processos.length
        ) {
          return item;
        }

        const processoAtual =
          item.processos[indiceProcesso];

        const processoDestino =
          item.processos[novaPosicao];

        const atualBloqueado = processoEstaBloqueado(
          item.id,
          processoAtual.id,
        );

        const destinoBloqueado = processoEstaBloqueado(
          item.id,
          processoDestino.id,
        );

        if (atualBloqueado || destinoBloqueado) {
          return item;
        }

        const novaLista = [...item.processos];

        [
          novaLista[indiceProcesso],
          novaLista[novaPosicao],
        ] = [
          novaLista[novaPosicao],
          novaLista[indiceProcesso],
        ];

        return {
          ...item,
          processos: novaLista,
        };
      }),
    );
  }

  function limparFormulario() {
    setClienteId("");
    setStatus("ABERTA");
    setValor("");
    setPrazo("");
    setObservacoes("");

    setItens([
      {
        pecaId: "",
        quantidade: 1,
        processos: [],
      },
    ]);

    setItensOriginais([]);
    setProducoesOriginais([]);
    setErro("");
  }

  async function criarItem(
    ordemIdCriada: number,
    item: ItemOrdem,
  ): Promise<number> {
    const resposta = await enviarRequisicao(
      `${API_URL}/order-item`,
      "Erro ao cadastrar uma peça da ordem.",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ordemId: ordemIdCriada,
          pecaId: item.pecaId,
          quantidade: item.quantidade,
        }),
      },
    );

    const itemCriado = await resposta.json();

    if (!itemCriado.id) {
      throw new Error(
        "A API não retornou o ID do item da ordem.",
      );
    }

    return itemCriado.id;
  }

  async function criarProcessos(
    itemOrdemId: number,
    processos: ProcessoSelecionado[],
  ) {
    for (const [indice, processo] of processos.entries()) {
      await enviarRequisicao(
        `${API_URL}/production`,
        `Erro ao cadastrar o processo ${processo.name}.`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            itemOrdemId,
            processId: processo.id,
            sequence: indice + 1,
          }),
        },
      );
    }
  }

  async function excluirProducoesDoItem(
    itemId: number,
  ) {
    const producoes = obterProducoesDoItem(itemId);

    const producaoNaoPendente = producoes.find(
      (producao) =>
        producao.status !== "PENDENTE",
    );

    if (producaoNaoPendente) {
      throw new Error(
        "Não é possível remover ou trocar uma peça que possui etapas em andamento ou concluídas.",
      );
    }

    for (const producao of producoes) {
      await enviarRequisicao(
        `${API_URL}/production/${producao.id}`,
        "Não foi possível remover uma etapa de produção.",
        {
          method: "DELETE",
        },
      );
    }
  }

  async function sincronizarProcessos(
    itemOrdemId: number,
    processosDesejados: ProcessoSelecionado[],
  ) {
    const atuais = obterProducoesDoItem(itemOrdemId);

    const idsDesejados = processosDesejados.map(
      (processo) => processo.id,
    );

    // Identifica processos removidos.
    const removidos = atuais.filter(
      (producao) =>
        !idsDesejados.includes(
          producao.process.id,
        ),
    );

    // Não permite remover etapas iniciadas ou concluídas.
    const removidoEmAndamento = removidos.find(
      (producao) =>
        producao.status !== "PENDENTE",
    );

    if (removidoEmAndamento) {
      throw new Error(
        "Não é possível remover um processo que já está em andamento ou concluído.",
      );
    }

    // Remove somente etapas pendentes.
    for (const producao of removidos) {
      await enviarRequisicao(
        `${API_URL}/production/${producao.id}`,
        "Não foi possível remover um processo.",
        {
          method: "DELETE",
        },
      );
    }

    const atuaisMantidos = atuais.filter(
      (producao) =>
        idsDesejados.includes(
          producao.process.id,
        ),
    );

    const alterouSequencia = processosDesejados.some(
      (processo, indice) => {
        const existente = atuaisMantidos.find(
          (producao) =>
            producao.process.id === processo.id,
        );

        return (
          existente !== undefined &&
          existente.sequence !== indice + 1
        );
      },
    );

    if (alterouSequencia) {
      // Verifica se alguma etapa bloqueada mudaria de posição.
      const etapaBloqueada = atuaisMantidos.find(
        (producao) =>
          producao.status !== "PENDENTE" &&
          producao.sequence !==
            idsDesejados.indexOf(
              producao.process.id,
            ) +
              1,
      );

      if (etapaBloqueada) {
        throw new Error(
          "Não é possível alterar a sequência de uma etapa que já está em andamento ou concluída.",
        );
      }

      // Coloca as etapas pendentes em posições temporárias.
      // Isso evita conflitos de sequência durante a reorganização.
      for (const producao of atuaisMantidos) {
        if (producao.status !== "PENDENTE") {
          continue;
        }

        await enviarRequisicao(
          `${API_URL}/production/${producao.id}`,
          "Não foi possível reorganizar os processos.",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sequence: 100000 + producao.id,
            }),
          },
        );
      }

      // Aplica as posições definitivas.
      for (const [
        indice,
        processo,
      ] of processosDesejados.entries()) {
        const existente = atuaisMantidos.find(
          (producao) =>
            producao.process.id === processo.id,
        );

        if (!existente) continue;

        if (existente.sequence === indice + 1) {
          continue;
        }

        await enviarRequisicao(
          `${API_URL}/production/${existente.id}`,
          "Não foi possível atualizar a sequência do processo.",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sequence: indice + 1,
            }),
          },
        );
      }
    }

    // Cadastra somente os processos novos.
    for (const [
      indice,
      processo,
    ] of processosDesejados.entries()) {
      const jaExiste = atuaisMantidos.some(
        (producao) =>
          producao.process.id === processo.id,
      );

      if (jaExiste) continue;

      await enviarRequisicao(
        `${API_URL}/production`,
        `Não foi possível cadastrar o processo ${processo.name}.`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            itemOrdemId,
            processId: processo.id,
            sequence: indice + 1,
          }),
        },
      );
    }
  }

  async function atualizarItens(
    ordemIdAtual: number,
  ) {
    const idsAtuais = itens
      .filter((item) => item.id !== undefined)
      .map((item) => item.id as number);

    // Remove os itens excluídos do formulário.
    for (const itemOriginal of itensOriginais) {
      if (idsAtuais.includes(itemOriginal.id)) {
        continue;
      }

      await excluirProducoesDoItem(itemOriginal.id);

      await enviarRequisicao(
        `${API_URL}/order-item/${itemOriginal.id}`,
        "Não foi possível remover uma peça.",
        {
          method: "DELETE",
        },
      );
    }

    // Atualiza itens existentes ou cadastra novos.
    for (const item of itens) {
      if (!item.pecaId) continue;

      if (item.id !== undefined) {
        const original = itensOriginais.find(
          (itemOriginal) =>
            itemOriginal.id === item.id,
        );

        if (
          original &&
          original.pecaId === item.pecaId
        ) {
          // A peça continua a mesma.
          await enviarRequisicao(
            `${API_URL}/order-item/${item.id}`,
            "Não foi possível atualizar a peça.",
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                quantidade: item.quantidade,
              }),
            },
          );

          await sincronizarProcessos(
            item.id,
            item.processos,
          );
        } else {
          // A peça foi trocada.
          await excluirProducoesDoItem(item.id);

          await enviarRequisicao(
            `${API_URL}/order-item/${item.id}`,
            "Não foi possível trocar a peça.",
            {
              method: "DELETE",
            },
          );

          const novoItemId = await criarItem(
            ordemIdAtual,
            item,
          );

          await criarProcessos(
            novoItemId,
            item.processos,
          );
        }
      } else {
        // Item novo adicionado durante a edição.
        const novoItemId = await criarItem(
          ordemIdAtual,
          item,
        );

        await criarProcessos(
          novoItemId,
          item.processos,
        );
      }
    }
  }

  async function salvarOrdem() {
    try {
      setErro("");

      if (!clienteId) {
        setErro("Selecione um cliente.");
        return;
      }

      if (
        valor === "" ||
        Number(valor) < 0 ||
        !Number.isFinite(Number(valor))
      ) {
        setErro("Informe um valor válido.");
        return;
      }

      if (
        itens.length === 0 ||
        itens.some((item) => !item.pecaId)
      ) {
        setErro(
          "Selecione uma peça para cada item.",
        );
        return;
      }

      if (
        itens.some(
          (item) => item.quantidade < 1,
        )
      ) {
        setErro(
          "A quantidade de cada peça deve ser maior que zero.",
        );
        return;
      }

      setSalvando(true);

      const dadosOrdem = {
        clienteId,
        status,
        valor: Number(valor),
        prazo: prazo || null,
        observacoes: observacoes.trim() || null,
      };

      if (ordemId !== null) {
        // Atualiza os dados principais da ordem.
        await enviarRequisicao(
          `${API_URL}/orders/${ordemId}`,
          "Não foi possível atualizar a ordem.",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dadosOrdem),
          },
        );

        // Atualiza peças e processos.
        await atualizarItens(ordemId);
      } else {
        // Cria uma nova ordem.
        const respostaOrdem = await enviarRequisicao(
          `${API_URL}/orders`,
          "Não foi possível criar a ordem.",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dadosOrdem),
          },
        );

        const ordemCriada = await respostaOrdem.json();

        if (!ordemCriada.id) {
          throw new Error(
            "A API não retornou o ID da ordem criada.",
          );
        }

        // Cria cada peça e seus processos.
        for (const item of itens) {
          const itemOrdemId = await criarItem(
            ordemCriada.id,
            item,
          );

          await criarProcessos(
            itemOrdemId,
            item.processos,
          );
        }
      }

      await onSalvo(editando);

      limparFormulario();
      onClose();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar a ordem.",
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={salvando ? undefined : onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          color: "#1e293b",
        }}
      >
        {editando
          ? "Editar ordem de serviço"
          : "Nova ordem de serviço"}
      </DialogTitle>

      <DialogContent dividers>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
          }}
        >
          {erro && (
            <Alert severity="error">
              {erro}
            </Alert>
          )}

          <Typography
            sx={{
              fontWeight: 700,
              color: "#334155",
            }}
          >
            Dados da ordem
          </Typography>

          <TextField
            select
            label="Cliente"
            value={clienteId}
            onChange={(e) =>
              setClienteId(
                e.target.value
                  ? Number(e.target.value)
                  : "",
              )
            }
            disabled={carregandoDados || salvando}
            required
            fullWidth
          >
            {clientes.map((cliente) => (
              <MenuItem
                key={cliente.id}
                value={cliente.id}
              >
                {cliente.nome}
              </MenuItem>
            ))}
          </TextField>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
              },
              gap: 2,
            }}
          >
            <TextField
              select
              label="Status"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              fullWidth
              disabled={salvando}
            >
              <MenuItem value="ABERTA">
                Aberta
              </MenuItem>
              <MenuItem value="EM_ANDAMENTO">
                Em andamento
              </MenuItem>
              <MenuItem value="CONCLUIDA">
                Concluída
              </MenuItem>
              <MenuItem value="CANCELADA">
                Cancelada
              </MenuItem>
            </TextField>

            <TextField
              label="Valor"
              type="number"
              value={valor}
              onChange={(e) =>
                setValor(e.target.value)
              }
              slotProps={{
                htmlInput: {
                  min: 0,
                  step: "0.01",
                },
              }}
              required
              fullWidth
              disabled={salvando}
            />

            <TextField
              label="Prazo"
              type="date"
              value={prazo}
              onChange={(e) =>
                setPrazo(e.target.value)
              }
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              fullWidth
              disabled={salvando}
            />
          </Box>

          <TextField
            label="Observações"
            value={observacoes}
            onChange={(e) =>
              setObservacoes(e.target.value)
            }
            multiline
            minRows={2}
            fullWidth
            disabled={salvando}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 1,
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                color: "#334155",
              }}
            >
              Peças da ordem
            </Typography>

            <Button
              onClick={adicionarItem}
              startIcon={<Plus size={17} />}
              disabled={
                salvando || carregandoDados
              }
              sx={{
                color: "#e04f11",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Adicionar peça
            </Button>
          </Box>

          {itens.map((item, indice) => {
            const itemBloqueado =
              itemPossuiProducaoIniciada(item.id);

            return (
              <Box
                key={item.id ?? `novo-${indice}`}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  p: 2,
                  border: "1px solid #e2e8f0",
                  borderRadius: 2,
                  backgroundColor: "#fff",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <TextField
                    select
                    label={`Peça ${indice + 1}`}
                    value={item.pecaId}
                    onChange={(e) =>
                      atualizarItem(
                        indice,
                        "pecaId",
                        e.target.value
                          ? Number(e.target.value)
                          : "",
                      )
                    }
                    disabled={
                      carregandoDados ||
                      salvando ||
                      itemBloqueado
                    }
                    fullWidth
                  >
                    {pecas.map((peca) => (
                      <MenuItem
                        key={peca.id}
                        value={peca.id}
                      >
                        {peca.nome}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    label="Quantidade"
                    type="number"
                    value={item.quantidade}
                    onChange={(e) =>
                      atualizarItem(
                        indice,
                        "quantidade",
                        Number(e.target.value),
                      )
                    }
                    slotProps={{
                      htmlInput: {
                        min: 1,
                        step: 1,
                      },
                    }}
                    sx={{
                      width: 140,
                    }}
                    disabled={salvando}
                  />

                  <IconButton
                    onClick={() =>
                      removerItem(indice)
                    }
                    disabled={
                      itens.length === 1 ||
                      salvando ||
                      itemBloqueado
                    }
                    color="error"
                    aria-label="Remover peça"
                  >
                    <Trash2 size={19} />
                  </IconButton>
                </Box>

                {itemBloqueado && (
                  <Alert
                    severity="info"
                    icon={<Lock size={18} />}
                  >
                    Esta peça possui produção iniciada.
                    Não é possível trocar ou remover a peça.
                  </Alert>
                )}

                <Box
                  sx={{
                    borderTop: "1px solid #e2e8f0",
                    pt: 2,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: "#334155",
                      mb: 1,
                    }}
                  >
                    Processos de usinagem
                  </Typography>

                  <TextField
                    select
                    label="Adicionar processo"
                    value=""
                    onChange={(e) =>
                      adicionarProcesso(
                        indice,
                        Number(e.target.value),
                      )
                    }
                    fullWidth
                    disabled={
                      salvando ||
                      carregandoDados ||
                      processosDisponiveis.length === 0
                    }
                    helperText={
                      processosDisponiveis.length === 0
                        ? "Nenhum processo ativo cadastrado."
                        : "Selecione os processos que serão executados nesta peça."
                    }
                  >
                    {processosDisponiveis
                      .filter(
                        (processo) =>
                          !item.processos.some(
                            (selecionado) =>
                              selecionado.id ===
                              processo.id,
                          ),
                      )
                      .map((processo) => (
                        <MenuItem
                          key={processo.id}
                          value={processo.id}
                        >
                          {processo.name}
                        </MenuItem>
                      ))}
                  </TextField>

                  {item.processos.length > 0 ? (
                    <Box
                      sx={{
                        mt: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Sequência de fabricação desta peça
                      </Typography>

                      {item.processos.map(
                        (processo, indiceProcesso) => {
                          const bloqueado =
                            processoEstaBloqueado(
                              item.id,
                              processo.id,
                            );

                          const statusProcesso =
                            obterProducaoDoProcesso(
                              item.id,
                              processo.id,
                            )?.status;

                          const processoAnteriorBloqueado =
                            indiceProcesso > 0 &&
                            processoEstaBloqueado(
                              item.id,
                              item.processos[
                                indiceProcesso - 1
                              ].id,
                            );

                          const proximoProcessoBloqueado =
                            indiceProcesso <
                              item.processos.length - 1 &&
                            processoEstaBloqueado(
                              item.id,
                              item.processos[
                                indiceProcesso + 1
                              ].id,
                            );

                          return (
                            <Box
                              key={processo.id}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                p: 1.5,
                                border: "1px solid #e2e8f0",
                                borderRadius: 2,
                                backgroundColor: bloqueado
                                  ? "#f1f5f9"
                                  : "#f8fafc",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontWeight: 700,
                                  color: "#e04f11",
                                  minWidth: 28,
                                }}
                              >
                                {indiceProcesso + 1}.
                              </Typography>

                              <Typography
                                sx={{
                                  flex: 1,
                                  fontWeight: 500,
                                }}
                              >
                                {processo.name}
                              </Typography>

                              {bloqueado && (
                                <Chip
                                  size="small"
                                  icon={
                                    <Lock size={13} />
                                  }
                                  label={
                                    statusProcesso ===
                                    "CONCLUIDA"
                                      ? "Concluído"
                                      : "Em andamento"
                                  }
                                  color={
                                    statusProcesso ===
                                    "CONCLUIDA"
                                      ? "success"
                                      : "info"
                                  }
                                  variant="outlined"
                                />
                              )}

                              {!bloqueado && (
                                <Chip
                                  size="small"
                                  label="Pendente"
                                  variant="outlined"
                                />
                              )}

                              <IconButton
                                size="small"
                                onClick={() =>
                                  moverProcesso(
                                    indice,
                                    indiceProcesso,
                                    -1,
                                  )
                                }
                                disabled={
                                  bloqueado ||
                                  indiceProcesso === 0 ||
                                  processoAnteriorBloqueado ||
                                  salvando
                                }
                                aria-label="Mover processo para cima"
                              >
                                <ArrowUp size={18} />
                              </IconButton>

                              <IconButton
                                size="small"
                                onClick={() =>
                                  moverProcesso(
                                    indice,
                                    indiceProcesso,
                                    1,
                                  )
                                }
                                disabled={
                                  bloqueado ||
                                  indiceProcesso ===
                                    item.processos.length - 1 ||
                                  proximoProcessoBloqueado ||
                                  salvando
                                }
                                aria-label="Mover processo para baixo"
                              >
                                <ArrowDown size={18} />
                              </IconButton>

                              <IconButton
                                size="small"
                                color="error"
                                onClick={() =>
                                  removerProcesso(
                                    indice,
                                    processo.id,
                                  )
                                }
                                disabled={
                                  bloqueado || salvando
                                }
                                aria-label="Remover processo"
                              >
                                <Trash2 size={18} />
                              </IconButton>
                            </Box>
                          );
                        },
                      )}
                    </Box>
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 1.5,
                      }}
                    >
                      Nenhum processo selecionado para esta peça.
                    </Typography>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 2.5,
        }}
      >
        <Button
          onClick={onClose}
          disabled={salvando}
          sx={{
            color: "#64748b",
            textTransform: "none",
          }}
        >
          Cancelar
        </Button>

        <Button
          variant="contained"
          onClick={salvarOrdem}
          disabled={
            salvando || carregandoDados
          }
          sx={{
            backgroundColor: "#e04f11",
            textTransform: "none",
            fontWeight: 600,
            "&:hover": {
              backgroundColor: "#c9430d",
            },
          }}
        >
          {salvando
            ? "Salvando..."
            : editando
              ? "Salvar alterações"
              : "Criar ordem"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}