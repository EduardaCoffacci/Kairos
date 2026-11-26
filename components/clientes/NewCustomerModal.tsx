
"use client";

import { useState, type FormEvent } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface ModalNovoClienteProps {
  aberto: boolean;
  onFechar: () => void;
  onSalvo: () => Promise<void>;
}

interface ClienteForm {
  nome: string;
  email: string;
  telefone: string;
  cnpj: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  observacoes: string;
}

const camposIniciais: ClienteForm = {
  nome: "",
  email: "",
  telefone: "",
  cnpj: "",
  cep: "",
  logradouro: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  estado: "",
  observacoes: "",
};

export default function ModalNovoCliente({
  aberto,
  onFechar,
  onSalvo,
}: ModalNovoClienteProps) {
  const [form, setForm] = useState<ClienteForm>(camposIniciais);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erroCep, setErroCep] = useState("");
  const [erro, setErro] = useState("");

  function atualizarCampo(campo: keyof ClienteForm, valor: string) {
    setForm((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  // Consulta o CEP e preenche automaticamente os dados do endereço.
  async function buscarCep() {
    const cep = form.cep.replace(/\D/g, "");

    if (cep.length !== 8) {
      setErroCep("Digite um CEP válido.");
      return;
    }

    try {
      setBuscandoCep(true);
      setErroCep("");

      const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const dados = await resposta.json();

      if (dados.erro) throw new Error();

      setForm((anterior) => ({
        ...anterior,
        cep: cep.replace(/(\d{5})(\d{3})/, "$1-$2"),
        logradouro: dados.logradouro || "",
        bairro: dados.bairro || "",
        cidade: dados.localidade || "",
        estado: dados.uf || "",
      }));
    } catch {
      setErroCep("Erro ao consultar o CEP.");
    } finally {
      setBuscandoCep(false);
    }
  }

  // Cadastra o cliente na API.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErro("");
    setSalvando(true);

    const cliente = {
      ...form,
      nome: form.nome.trim(),
      email: form.email.trim() || null,
      telefone: form.telefone.trim(),
      cnpj: form.cnpj.trim(),
      cep: form.cep.trim(),
      logradouro: form.logradouro.trim(),
      numero: form.numero.trim(),
      complemento: form.complemento.trim() || null,
      bairro: form.bairro.trim(),
      cidade: form.cidade.trim(),
      estado: form.estado.trim().toUpperCase(),
      observacoes: form.observacoes.trim() || null,
    };

    try {
      const resposta = await fetch(`${API_URL}/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cliente),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          Array.isArray(dados.message)
            ? dados.message.join(", ")
            : dados.message || "Erro ao cadastrar cliente.",
        );
      }

      await onSalvo();
      setForm(camposIniciais);
      onFechar();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao cadastrar.");
    } finally {
      setSalvando(false);
    }
  }

  if (!aberto) return null;

  const inputProps = {
    size: "small" as const,
    fullWidth: true,
    variant: "outlined" as const,
  };

  const tituloSecao = {
    fontSize: "0.9rem",
    fontWeight: 700,
    color: "#1e293b",
    mb: 2,
  };

  return (
    <Dialog
      open={aberto}
      onClose={() => {}}
      fullWidth
      maxWidth="md"
      slotProps={{
        paper: {
          sx: {
            borderRadius: "16px",
            maxHeight: "92vh",
          },
        },
      }}
    >
      {/* Cabeçalho */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          py: 2.5,
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "#111827" }}
          >
            Novo cliente
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: "text.secondary", mt: 0.5 }}
          >
            Preencha os dados para cadastrar um novo cliente.
          </Typography>
        </Box>

        <IconButton
          onClick={onFechar}
          aria-label="Fechar modal"
          disabled={salvando}
          size="small"
        >
          <Typography sx={{ fontSize: 25, lineHeight: 1 }}>
            ×
          </Typography>
        </IconButton>
      </DialogTitle>

      {/* Formulário */}
      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ px: 3, py: 3 }}>
          <Stack spacing={3}>
            {/* Dados da empresa */}
            <Box component="section">
              <Typography sx={tituloSecao}>
                Dados da empresa
              </Typography>

              <Stack spacing={2}>
                <TextField
                  {...inputProps}
                  label="Nome / Razão social *"
                  required
                  slotProps={{
                    htmlInput: { maxLength: 100 },
                  }}
                  value={form.nome}
                  onChange={(e) => atualizarCampo("nome", e.target.value)}
                  placeholder="Digite o nome da empresa"
                />

                <Stack
                  sx={{
                    flexDirection: { xs: "column", md: "row" },
                    gap: 2,
                  }}
                >
                  <TextField
                    {...inputProps}
                    label="CNPJ *"
                    required
                    value={form.cnpj}
                    onChange={(e) =>
                      atualizarCampo("cnpj", e.target.value)
                    }
                    placeholder="00.000.000/0000-00"
                  />

                  <TextField
                    {...inputProps}
                    label="Telefone *"
                    type="tel"
                    required
                    value={form.telefone}
                    onChange={(e) =>
                      atualizarCampo("telefone", e.target.value)
                    }
                    placeholder="(47) 99999-9999"
                  />
                </Stack>

                <TextField
                  {...inputProps}
                  label="E-mail"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    atualizarCampo("email", e.target.value)
                  }
                  placeholder="contato@empresa.com"
                />
              </Stack>
            </Box>

            <Divider />

            {/* Endereço */}
            <Box component="section">
              <Typography sx={tituloSecao}>
                Endereço
              </Typography>

              <Stack spacing={2}>
                <Box sx={{ maxWidth: 380 }}>
                  <Stack
                    sx={{
                      flexDirection: "row",
                      gap: 1,
                    }}
                  >
                    <TextField
                      {...inputProps}
                      label="CEP *"
                      required
                      value={form.cep}
                      onChange={(e) => {
                        atualizarCampo("cep", e.target.value);
                        setErroCep("");
                      }}
                      onBlur={buscarCep}
                      placeholder="00000-000"
                      slotProps={{
                        htmlInput: { maxLength: 9 },
                      }}
                      error={Boolean(erroCep)}
                      helperText={erroCep}
                    />

                    <Button
                      type="button"
                      variant="outlined"
                      onClick={buscarCep}
                      disabled={buscandoCep}
                      sx={{
                        minWidth: 100,
                        borderColor: "#d1d5db",
                        color: "#374151",
                        textTransform: "none",
                      }}
                    >
                      {buscandoCep ? (
                        <CircularProgress size={18} />
                      ) : (
                        "Buscar"
                      )}
                    </Button>
                  </Stack>
                </Box>

                <Stack
                  sx={{
                    flexDirection: { xs: "column", md: "row" },
                    gap: 2,
                  }}
                >
                  <TextField
                    {...inputProps}
                    label="Logradouro *"
                    required
                    slotProps={{
                      htmlInput: { maxLength: 150 },
                    }}
                    value={form.logradouro}
                    onChange={(e) =>
                      atualizarCampo("logradouro", e.target.value)
                    }
                    placeholder="Rua, avenida..."
                    sx={{ flex: 1 }}
                  />

                  <TextField
                    {...inputProps}
                    label="Número *"
                    required
                    slotProps={{
                      htmlInput: { maxLength: 10 },
                    }}
                    value={form.numero}
                    onChange={(e) =>
                      atualizarCampo("numero", e.target.value)
                    }
                    placeholder="Nº"
                    sx={{ maxWidth: { md: 150 } }}
                  />
                </Stack>

                <Stack
                  sx={{
                    flexDirection: { xs: "column", md: "row" },
                    gap: 2,
                  }}
                >
                  <TextField
                    {...inputProps}
                    label="Complemento"
                    slotProps={{
                      htmlInput: { maxLength: 100 },
                    }}
                    value={form.complemento}
                    onChange={(e) =>
                      atualizarCampo("complemento", e.target.value)
                    }
                    placeholder="Sala, galpão, bloco..."
                  />

                  <TextField
                    {...inputProps}
                    label="Bairro *"
                    required
                    slotProps={{
                      htmlInput: { maxLength: 100 },
                    }}
                    value={form.bairro}
                    onChange={(e) =>
                      atualizarCampo("bairro", e.target.value)
                    }
                    placeholder="Digite o bairro"
                  />
                </Stack>

                <Stack
                  sx={{
                    flexDirection: { xs: "column", md: "row" },
                    gap: 2,
                  }}
                >
                  <TextField
                    {...inputProps}
                    label="Cidade *"
                    required
                    slotProps={{
                      htmlInput: { maxLength: 100 },
                    }}
                    value={form.cidade}
                    onChange={(e) =>
                      atualizarCampo("cidade", e.target.value)
                    }
                    placeholder="Digite a cidade"
                    sx={{ flex: 1 }}
                  />

                  <TextField
                    {...inputProps}
                    label="Estado *"
                    required
                    slotProps={{
                      htmlInput: { maxLength: 2 },
                    }}
                    value={form.estado}
                    onChange={(e) =>
                      atualizarCampo("estado", e.target.value.toUpperCase())
                    }
                    placeholder="SC"
                    sx={{ maxWidth: { md: 150 } }}
                  />
                </Stack>
              </Stack>
            </Box>

            <Divider />

            {/* Informações adicionais */}
            <Box component="section">
              <Typography sx={tituloSecao}>
                Informações adicionais
              </Typography>

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Observações"
                value={form.observacoes}
                onChange={(e) =>
                  atualizarCampo("observacoes", e.target.value)
                }
                placeholder="Informações adicionais sobre o cliente..."
              />
            </Box>
          </Stack>

          {/* Erro do cadastro */}
          {erro && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {erro}
            </Alert>
          )}
        </Box>

        {/* Rodapé */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 1.5,
            px: 3,
            py: 2,
            borderTop: "1px solid #e5e7eb",
            bgcolor: "#f9fafb",
          }}
        >
          <Button
            type="button"
            variant="outlined"
            onClick={onFechar}
            disabled={salvando}
            sx={{
              textTransform: "none",
              color: "#374151",
              borderColor: "#d1d5db",
            }}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={salvando}
            sx={{
              textTransform: "none",
              bgcolor: "#e04f11",
              "&:hover": {
                bgcolor: "#c7430d",
              },
            }}
          >
            {salvando ? (
              <Stack
                sx={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <CircularProgress size={17} color="inherit" />
                <span>Salvando...</span>
              </Stack>
            ) : (
              "Salvar cliente"
            )}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
