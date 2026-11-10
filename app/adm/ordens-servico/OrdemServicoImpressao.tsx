
"use client";

interface Cliente {
  id: number;
  nome: string;
  email?: string | null;
  telefone?: string | null;
  cnpj?: string | null;
}

interface Peca {
  id: number;
  nome: string;
  material?: string | null;
}

interface OrderItem {
  id: number;
  peca: Peca;
  quantidade: number;
}

interface Ordem {
  id: number;
  cliente: Cliente;
  descricao?: string;
  status: string;
  dataAbertura: string;
  dataConclusao: string | null;
  prazo: string | null;
  valor: number | string;
  observacoes: string | null;
  itens: OrderItem[];
}

interface Processo {
  id: number;
  name: string;
  description?: string;
  active: boolean;
}

interface Operador {
  id: number;
  nome: string;
}

interface Producao {
  id: number;
  itemOrdem: {
    id: number;
    ordem: {
      id: number;
    };
    peca: Peca;
  };
  process: Processo;
  operador: Operador | null;
  sequence: number;
  status: string;
  dataInicio: string | null;
  dataConclusao: string | null;
  quantidadeProduzida: number;
  quantidadeAprovada: number;
  quantidadeRejeitada: number;
  observacoes: string | null;
}

interface OrdemServicoImpressaoProps {
  ordem: Ordem;
  producoes: Producao[];
}

const empresa = {
  nome: "KAIROS INDUSTRIAL LTDA.",
  cnpj: "12.345.678/0001-90",
  endereco: "Rua Industrial, 100 - Navegantes/SC",
  telefone: "(47) 3333-0000",
  email: "contato@kairosindustrial.com.br",
};

function formatarData(data: string | null) {
  if (!data) return "—";

  return new Date(`${data.substring(0, 10)}T00:00:00`)
    .toLocaleDateString("pt-BR");
}

function formatarValor(valor: number | string) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function nomeStatus(status: string) {
  const nomes: Record<string, string> = {
    ABERTA: "Aberta",
    EM_ANDAMENTO: "Em andamento",
    CONCLUIDA: "Concluída",
    CANCELADA: "Cancelada",
    PENDENTE: "Pendente",
  };

  return nomes[status] || status;
}

export default function OrdemServicoImpressao({
  ordem,
  producoes,
}: OrdemServicoImpressaoProps) {
  const producoesDaOrdem = producoes.filter(
    (producao) => producao.itemOrdem?.ordem?.id === ordem.id,
  );

  return (
    <>
      <style jsx global>{`
        @page {
          size: A4;
          margin: 12mm;
        }

        @media screen {
          .os-documento-impressao {
            display: none !important;
          }
        }

        @media print {
          body * {
            visibility: hidden !important;
          }

          .os-documento-impressao,
          .os-documento-impressao * {
            visibility: visible !important;
          }

          .os-documento-impressao {
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            color: #1e293b !important;
            background: #ffffff !important;
          }

          .os-documento-impressao table {
            page-break-inside: auto;
          }

          .os-documento-impressao tr {
            page-break-inside: avoid;
          }

          .os-documento-impressao .nao-quebrar {
            page-break-inside: avoid;
          }
        }
      `}</style>

      <div className="os-documento-impressao">
        <div
          style={{
            fontFamily: "Arial, sans-serif",
            color: "#1e293b",
            fontSize: "11px",
            lineHeight: 1.5,
          }}
        >
          {/* CABEÇALHO */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "3px solid #e04f11",
              paddingBottom: 15,
              marginBottom: 18,
            }}
          >
            <div>
              <h1
                style={{
                  color: "#e04f11",
                  fontSize: 25,
                  margin: 0,
                  fontWeight: 800,
                }}
              >
                KAIROS
              </h1>

              <strong style={{ fontSize: 11, letterSpacing: 3 }}>
                INDUSTRIAL
              </strong>

              <p style={{ margin: "5px 0 0", color: "#64748b" }}>
                Gestão e fabricação industrial
              </p>
            </div>

            <div style={{ textAlign: "right" }}>
              <h2 style={{ fontSize: 17, margin: 0 }}>
                ORDEM DE SERVIÇO
              </h2>

              <h1
                style={{
                  fontSize: 24,
                  color: "#e04f11",
                  margin: "5px 0",
                }}
              >
                Nº {String(ordem.id).padStart(6, "0")}
              </h1>

              <strong>{nomeStatus(ordem.status).toUpperCase()}</strong>
            </div>
          </div>

          {/* DADOS DA EMPRESA */}
          <section style={{ marginBottom: 18 }}>
            <h3 style={tituloSecao}>IDENTIFICAÇÃO DA EMPRESA</h3>

            <strong>{empresa.nome}</strong>

            <p style={texto}>
              CNPJ: {empresa.cnpj}
            </p>

            <p style={texto}>
              {empresa.endereco}
            </p>

            <p style={texto}>
              Telefone: {empresa.telefone} | E-mail: {empresa.email}
            </p>

            <p style={{ ...texto, color: "#b45309", fontWeight: 700 }}>
              Dados empresariais fictícios para teste.
            </p>
          </section>

          {/* CLIENTE */}
          <section style={secao}>
            <h3 style={tituloSecao}>01 — DADOS DO CLIENTE</h3>

            <p style={texto}>
              <strong>Nome:</strong>{" "}
              {ordem.cliente?.nome || "Não informado"}
            </p>

            <p style={texto}>
              <strong>CNPJ:</strong>{" "}
              {ordem.cliente?.cnpj || "Não informado"}
            </p>

            <p style={texto}>
              <strong>Telefone:</strong>{" "}
              {ordem.cliente?.telefone || "Não informado"}
            </p>

            <p style={texto}>
              <strong>E-mail:</strong>{" "}
              {ordem.cliente?.email || "Não informado"}
            </p>
          </section>

          {/* INFORMAÇÕES DA ORDEM */}
          <section style={secao}>
            <h3 style={tituloSecao}>02 — INFORMAÇÕES DA ORDEM</h3>

            <div style={grade}>
              <p style={texto}>
                <strong>Data de abertura:</strong>{" "}
                {formatarData(ordem.dataAbertura)}
              </p>

              <p style={texto}>
                <strong>Prazo de entrega:</strong>{" "}
                {formatarData(ordem.prazo)}
              </p>

              <p style={texto}>
                <strong>Data de conclusão:</strong>{" "}
                {formatarData(ordem.dataConclusao)}
              </p>

              <p style={texto}>
                <strong>Valor total:</strong>{" "}
                {formatarValor(ordem.valor)}
              </p>
            </div>
          </section>

          {/* PEÇAS */}
          <section style={secao}>
            <h3 style={tituloSecao}>03 — PEÇAS E ITENS DA ORDEM</h3>

            {ordem.itens?.length ? (
              ordem.itens.map((item, index) => {
                const etapas = producoesDaOrdem
                  .filter(
                    (producao) =>
                      producao.itemOrdem?.id === item.id,
                  )
                  .sort((a, b) => a.sequence - b.sequence);

                return (
                  <div
                    key={item.id}
                    className="nao-quebrar"
                    style={{
                      border: "1px solid #cbd5e1",
                      borderRadius: 5,
                      padding: 10,
                      marginBottom: 12,
                    }}
                  >
                    <h4 style={{ margin: "0 0 8px", fontSize: 12 }}>
                      PEÇA {index + 1}: {item.peca?.nome || "Não informada"}
                    </h4>

                    <p style={texto}>
                      <strong>Material:</strong>{" "}
                      {item.peca?.material || "Não informado"}
                    </p>

                    <p style={texto}>
                      <strong>Quantidade solicitada:</strong>{" "}
                      {item.quantidade}
                    </p>

                    <h4 style={{ margin: "12px 0 6px", fontSize: 11 }}>
                      PROCESSOS DE FABRICAÇÃO
                    </h4>

                    {etapas.length ? (
                      <table style={tabela}>
                        <thead>
                          <tr>
                            <th style={celulaCabecalho}>Sequência</th>
                            <th style={celulaCabecalho}>Processo</th>
                            <th style={celulaCabecalho}>Operador</th>
                            <th style={celulaCabecalho}>Status</th>
                            <th style={celulaCabecalho}>Produzida</th>
                            <th style={celulaCabecalho}>Aprovada</th>
                            <th style={celulaCabecalho}>Rejeitada</th>
                          </tr>
                        </thead>

                        <tbody>
                          {etapas.map((etapa) => (
                            <tr key={etapa.id}>
                              <td style={celula}>{etapa.sequence}</td>
                              <td style={celula}>
                                {etapa.process?.name || "Processo"}
                              </td>
                              <td style={celula}>
                                {etapa.operador?.nome || "Não atribuído"}
                              </td>
                              <td style={celula}>
                                {nomeStatus(etapa.status)}
                              </td>
                              <td style={celula}>
                                {etapa.quantidadeProduzida}
                              </td>
                              <td style={celula}>
                                {etapa.quantidadeAprovada}
                              </td>
                              <td style={celula}>
                                {etapa.quantidadeRejeitada}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p style={texto}>
                        Nenhum processo cadastrado para esta peça.
                      </p>
                    )}
                  </div>
                );
              })
            ) : (
              <p style={texto}>
                Nenhuma peça cadastrada nesta ordem.
              </p>
            )}
          </section>

          {/* OBSERVAÇÕES */}
          <section style={secao}>
            <h3 style={tituloSecao}>04 — OBSERVAÇÕES</h3>

            <div
              style={{
                border: "1px solid #cbd5e1",
                borderRadius: 5,
                padding: 12,
                minHeight: 55,
              }}
            >
              {ordem.observacoes || "Nenhuma observação registrada."}
            </div>
          </section>

          {/* ASSINATURAS */}
          <section
            className="nao-quebrar"
            style={{
              display: "flex",
              gap: 35,
              marginTop: 55,
              textAlign: "center",
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={linhaAssinatura} />
              <strong>Responsável pela empresa</strong>
            </div>

            <div style={{ flex: 1 }}>
              <div style={linhaAssinatura} />
              <strong>Responsável pelo cliente</strong>
            </div>
          </section>

          {/* RODAPÉ */}
          <footer
            style={{
              borderTop: "1px solid #cbd5e1",
              marginTop: 35,
              paddingTop: 10,
              textAlign: "center",
              color: "#64748b",
              fontSize: 9,
            }}
          >
            Documento gerado pelo sistema de gestão industrial Kairos.
            <br />
            Ordem de Serviço nº {String(ordem.id).padStart(6, "0")}
          </footer>
        </div>
      </div>
    </>
  );
}

const secao = {
  marginBottom: 17,
};

const tituloSecao = {
  fontSize: 12,
  color: "#e04f11",
  borderBottom: "1px solid #cbd5e1",
  paddingBottom: 5,
  marginBottom: 9,
};

const texto = {
  margin: "4px 0",
  fontSize: 11,
};

const grade = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "3px 20px",
};

const tabela = {
  width: "100%",
  borderCollapse: "collapse" as const,
  fontSize: 9,
};

const celulaCabecalho = {
  backgroundColor: "#f1f5f9",
  border: "1px solid #cbd5e1",
  padding: 6,
  textAlign: "left" as const,
};

const celula = {
  border: "1px solid #cbd5e1",
  padding: 6,
};

const linhaAssinatura = {
  borderTop: "1px solid #334155",
  marginBottom: 7,
  marginTop: 35,
};
