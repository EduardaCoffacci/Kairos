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
} from "@mui/material";

import {
  Plus,
  Trash2,
  ArrowDown,
  ArrowUp,
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

interface ItemOrdem {
  id?: number;
  pecaId: number | "";
  quantidade: number;
}

interface ItemOriginal {
  id: number;
  pecaId: number;
}

interface ProcessoUsinagem {
  id: number;
  nome: string;
}

interface OrdemDetalhada {
  id: number;
  cliente: Cliente;
  descricao: string;
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

interface Props {
  open: boolean;
  ordemId: number | null;
  onClose: () => void;
  onSalvo: (editando: boolean) => Promise<void>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const PROCESSOS_USINAGEM: ProcessoUsinagem[] = [
  { id: 1, nome: "Torno convencional 01" },
  { id: 2, nome: "Torno convencional 02" },
  { id: 3, nome: "Fresadora ferramenteira 01" },
  { id: 4, nome: "Fresadora ferramenteira 02" },
  { id: 5, nome: "Retífica plana horizontal 01" },
  { id: 6, nome: "Rosqueadeira" },
  { id: 7, nome: "Torno CNC 01" },
  { id: 8, nome: "Centro de Usinagem 01" },
  { id: 9, nome: "Centro de Usinagem 02" },
  { id: 10, nome: "Plaina Chaveteira 01" },
];

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

export default function ModalNovaOrdem({
  open,
  ordemId,
  onClose,
  onSalvo,
}: Props) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [pecas, setPecas] = useState<Peca[]>([]);

  const [clienteId, setClienteId] = useState<number | "">("");
  const [descricao, setDescricao] = useState("");
  const [status, setStatus] = useState("ABERTA");
  const [valor, setValor] = useState("");
  const [prazo, setPrazo] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [itens, setItens] = useState<ItemOrdem[]>([
    { pecaId: "", quantidade: 1 },
  ]);

  const [itensOriginais, setItensOriginais] = useState<ItemOriginal[]>([]);

  const [processosSelecionados, setProcessosSelecionados] = useState<
    ProcessoUsinagem[]
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
          ];

          if (ordemId !== null) {
            requisicoes.push(fetch(`${API_URL}/orders/${ordemId}`));
          }

          const respostas = await Promise.all(requisicoes);

          if (!respostas[0].ok || !respostas[1].ok) {
            throw new Error("Não foi possível carregar clientes e peças.");
          }

          const [dadosClientes, dadosPecas] = await Promise.all([
            respostas[0].json(),
            respostas[1].json(),
          ]);

          setClientes(dadosClientes);
          setPecas(dadosPecas);

          if (ordemId !== null) {
            const respostaOrdem = respostas[2];

            if (!respostaOrdem.ok) {
              throw new Error("Não foi possível carregar a ordem de serviço.");
            }

            const ordem: OrdemDetalhada = await respostaOrdem.json();

            setClienteId(ordem.cliente?.id ?? "");
            setDescricao(ordem.descricao ?? "");
            setStatus(ordem.status ?? "ABERTA");
            setValor(String(ordem.valor ?? ""));
            setPrazo(ordem.prazo ? ordem.prazo.substring(0, 10) : "");
            setObservacoes(ordem.observacoes ?? "");

            const itensCarregados: ItemOrdem[] = (ordem.itens ?? []).map(
              (item) => ({
                id: item.id,
                pecaId: item.peca?.id ?? "",
                quantidade: item.quantidade,
              }),
            );

            setItens(
              itensCarregados.length > 0
                ? itensCarregados
                : [{ pecaId: "", quantidade: 1 }],
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
    setItens((itensAtuais) => [
      ...itensAtuais,
      { pecaId: "", quantidade: 1 },
    ]);
  }

  function removerItem(indice: number) {
    setItens((itensAtuais) =>
      itensAtuais.filter((_, index) => index !== indice),
    );
  }

  function atualizarItem(
    indice: number,
    campo: keyof ItemOrdem,
    valorCampo: number | "",
  ) {
    setItens((itensAtuais) =>
      itensAtuais.map((item, index) =>
        index === indice ? { ...item, [campo]: valorCampo } : item,
      ),
    );
  }

  function adicionarProcesso(processoId: number) {
    const processo = PROCESSOS_USINAGEM.find(
      (item) => item.id === processoId,
    );

    if (!processo) return;

    const jaAdicionado = processosSelecionados.some(
      (item) => item.id === processoId,
    );

    if (jaAdicionado) return;

    setProcessosSelecionados((atuais) => [...atuais, processo]);
  }

  function removerProcesso(processoId: number) {
    setProcessosSelecionados((atuais) =>
      atuais.filter((processo) => processo.id !== processoId),
    );
  }

  function moverProcesso(indice: number, direcao: -1 | 1) {
    const novaPosicao = indice + direcao;

    if (
      novaPosicao < 0 ||
      novaPosicao >= processosSelecionados.length
    ) {
      return;
    }

    setProcessosSelecionados((atuais) => {
      const novaLista = [...atuais];

      [novaLista[indice], novaLista[novaPosicao]] = [
        novaLista[novaPosicao],
        novaLista[indice],
      ];

      return novaLista;
    });
  }

  function limparFormulario() {
    setClienteId("");
    setDescricao("");
    setStatus("ABERTA");
    setValor("");
    setPrazo("");
    setObservacoes("");
    setItens([{ pecaId: "", quantidade: 1 }]);
    setItensOriginais([]);
    setProcessosSelecionados([]);
    setErro("");
  }

  async function criarItens(ordemIdCriada: number) {
    for (const item of itens) {
      const resposta = await fetch(`${API_URL}/order-item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ordemId: ordemIdCriada,
          pecaId: item.pecaId,
          quantidade: item.quantidade,
        }),
      });

      if (!resposta.ok) {
        throw new Error(
          await obterErro(resposta, "Erro ao cadastrar uma peça da ordem."),
        );
      }
    }
  }

  async function atualizarItens() {
    const idsAtuais = itens
      .filter((item) => item.id !== undefined)
      .map((item) => item.id as number);

    // Remove os itens que foram excluídos do formulário.
    for (const itemOriginal of itensOriginais) {
      if (!idsAtuais.includes(itemOriginal.id)) {
        const resposta = await fetch(
          `${API_URL}/order-item/${itemOriginal.id}`,
          { method: "DELETE" },
        );

        if (!resposta.ok) {
          throw new Error(
            await obterErro(resposta, "Não foi possível remover uma peça."),
          );
        }
      }
    }

    // Atualiza os itens existentes ou cadastra os novos.
    for (const item of itens) {
      if (!item.pecaId) continue;

      if (item.id !== undefined) {
        const original = itensOriginais.find(
          (itemOriginal) => itemOriginal.id === item.id,
        );

        if (original && original.pecaId === item.pecaId) {
          // A peça continua a mesma: atualiza somente a quantidade.
          const resposta = await fetch(
            `${API_URL}/order-item/${item.id}`,
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

          if (!resposta.ok) {
            throw new Error(
              await obterErro(resposta, "Não foi possível atualizar a peça."),
            );
          }
        } else {
          // A peça mudou: remove o item antigo e cadastra o novo.
          const respostaExcluir = await fetch(
            `${API_URL}/order-item/${item.id}`,
            { method: "DELETE" },
          );

          if (!respostaExcluir.ok) {
            throw new Error(
              await obterErro(respostaExcluir, "Não foi possível trocar a peça."),
            );
          }

          const respostaCriar = await fetch(`${API_URL}/order-item`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ordemId,
              pecaId: item.pecaId,
              quantidade: item.quantidade,
            }),
          });

          if (!respostaCriar.ok) {
            throw new Error(
              await obterErro(respostaCriar, "Não foi possível cadastrar a nova peça."),
            );
          }
        }
      } else {
        // Item novo adicionado durante a edição.
        const resposta = await fetch(`${API_URL}/order-item`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ordemId,
            pecaId: item.pecaId,
            quantidade: item.quantidade,
          }),
        });

        if (!resposta.ok) {
          throw new Error(
            await obterErro(resposta, "Não foi possível cadastrar a nova peça."),
          );
        }
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

      if (!descricao.trim()) {
        setErro("Informe a descrição da ordem.");
        return;
      }

      if (valor === "" || Number(valor) < 0 || !Number.isFinite(Number(valor))) {
        setErro("Informe um valor válido.");
        return;
      }

      if (itens.length === 0 || itens.some((item) => !item.pecaId)) {
        setErro("Selecione uma peça para cada item.");
        return;
      }

      if (itens.some((item) => item.quantidade < 1)) {
        setErro("A quantidade de cada peça deve ser maior que zero.");
        return;
      }

      setSalvando(true);

      const dadosOrdem = {
        clienteId,
        descricao: descricao.trim(),
        status,
        valor: Number(valor),
        prazo: prazo || null,
        observacoes: observacoes.trim() || null,
      };

      if (ordemId !== null) {
        // Atualiza os dados principais da ordem.
        const respostaOrdem = await fetch(`${API_URL}/orders/${ordemId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dadosOrdem),
        });

        if (!respostaOrdem.ok) {
          throw new Error(
            await obterErro(respostaOrdem, "Não foi possível atualizar a ordem."),
          );
        }

        // Atualiza, adiciona ou remove as peças.
        await atualizarItens();
      } else {
        // Cria uma nova ordem.
        const respostaOrdem = await fetch(`${API_URL}/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dadosOrdem),
        });

        if (!respostaOrdem.ok) {
          throw new Error(
            await obterErro(respostaOrdem, "Não foi possível criar a ordem."),
          );
        }

        const ordemCriada = await respostaOrdem.json();

        if (!ordemCriada.id) {
          throw new Error("A API não retornou o ID da ordem criada.");
        }

        await criarItens(ordemCriada.id);
      }

      // Os processos de usinagem ainda não são enviados ao backend.

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
      <DialogTitle sx={{ fontWeight: 700, color: "#1e293b" }}>
        {editando ? "Editar ordem de serviço" : "Nova ordem de serviço"}
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {erro && <Alert severity="error">{erro}</Alert>}

          <Typography sx={{ fontWeight: 700, color: "#334155" }}>
            Dados da ordem
          </Typography>

          <TextField
            select
            label="Cliente"
            value={clienteId}
            onChange={(e) =>
              setClienteId(e.target.value ? Number(e.target.value) : "")
            }
            disabled={carregandoDados || salvando}
            required
            fullWidth
          >
            {clientes.map((cliente) => (
              <MenuItem key={cliente.id} value={cliente.id}>
                {cliente.nome}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            multiline
            minRows={3}
            required
            fullWidth
            disabled={salvando}
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            <TextField
              select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              fullWidth
              disabled={salvando}
            >
              <MenuItem value="ABERTA">Aberta</MenuItem>
              <MenuItem value="EM_ANDAMENTO">Em andamento</MenuItem>
              <MenuItem value="CONCLUIDA">Concluída</MenuItem>
              <MenuItem value="CANCELADA">Cancelada</MenuItem>
            </TextField>

            <TextField
              label="Valor"
              type="number"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
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
              onChange={(e) => setPrazo(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
              disabled={salvando}
            />
          </Box>

          <TextField
            label="Observações"
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
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
            <Typography sx={{ fontWeight: 700, color: "#334155" }}>
              Peças da ordem
            </Typography>

            <Button
              onClick={adicionarItem}
              startIcon={<Plus size={17} />}
              disabled={salvando || carregandoDados}
              sx={{
                color: "#e04f11",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Adicionar peça
            </Button>
          </Box>

          {itens.map((item, indice) => (
            <Box
              key={item.id ?? `novo-${indice}`}
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
                    e.target.value ? Number(e.target.value) : "",
                  )
                }
                disabled={carregandoDados || salvando}
                fullWidth
              >
                {pecas.map((peca) => (
                  <MenuItem key={peca.id} value={peca.id}>
                    {peca.nome}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Quantidade"
                type="number"
                value={item.quantidade}
                onChange={(e) =>
                  atualizarItem(indice, "quantidade", Number(e.target.value))
                }
                slotProps={{
                  htmlInput: {
                    min: 1,
                    step: 1,
                  },
                }}
                sx={{ width: 140 }}
                disabled={salvando}
              />

              <IconButton
                onClick={() => removerItem(indice)}
                disabled={itens.length === 1 || salvando}
                color="error"
                aria-label="Remover peça"
              >
                <Trash2 size={19} />
              </IconButton>
            </Box>
          ))}

          {/* Processos de usinagem */}
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ fontWeight: 700, color: "#334155", mb: 1 }}>
              Processos de usinagem
            </Typography>

            <TextField
              select
              label="Selecionar processo"
              value=""
              onChange={(e) => adicionarProcesso(Number(e.target.value))}
              fullWidth
              disabled={salvando}
            >
              {PROCESSOS_USINAGEM.filter(
                (processo) =>
                  !processosSelecionados.some(
                    (item) => item.id === processo.id,
                  ),
              ).map((processo) => (
                <MenuItem key={processo.id} value={processo.id}>
                  {processo.nome}
                </MenuItem>
              ))}
            </TextField>

            {processosSelecionados.length > 0 && (
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Sequência de fabricação
                </Typography>

                {processosSelecionados.map((processo, indice) => (
                  <Box
                    key={processo.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      p: 1.5,
                      border: "1px solid #e2e8f0",
                      borderRadius: 2,
                      backgroundColor: "#f8fafc",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: "#e04f11",
                        minWidth: 28,
                      }}
                    >
                      {indice + 1}.
                    </Typography>

                    <Typography sx={{ flex: 1, fontWeight: 500 }}>
                      {processo.nome}
                    </Typography>

                    <IconButton
                      size="small"
                      onClick={() => moverProcesso(indice, -1)}
                      disabled={indice === 0 || salvando}
                      aria-label="Mover processo para cima"
                    >
                      <ArrowUp size={18} />
                    </IconButton>

                    <IconButton
                      size="small"
                      onClick={() => moverProcesso(indice, 1)}
                      disabled={
                        indice === processosSelecionados.length - 1 ||
                        salvando
                      }
                      aria-label="Mover processo para baixo"
                    >
                      <ArrowDown size={18} />
                    </IconButton>

                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removerProcesso(processo.id)}
                      disabled={salvando}
                      aria-label="Remover processo"
                    >
                      <Trash2 size={18} />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        <Button
          onClick={onClose}
          disabled={salvando}
          sx={{ color: "#64748b", textTransform: "none" }}
        >
          Cancelar
        </Button>

        <Button
          variant="contained"
          onClick={salvarOrdem}
          disabled={salvando || carregandoDados}
          sx={{
            backgroundColor: "#e04f11",
            textTransform: "none",
            fontWeight: 600,
            "&:hover": { backgroundColor: "#c9430d" },
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