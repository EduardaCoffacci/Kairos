
export function formatDate(data: string | null): string {
  if (!data) return "Não definido";

  const [ano, mes, dia] = data.slice(0, 10).split("-");

  return `${dia}/${mes}/${ano}`;
}

export function getStatusColor(
  status: string,
): "info" | "warning" | "success" | "error" | "default" {
  const colors = {
    ABERTA: "info",
    EM_ANDAMENTO: "warning",
    CONCLUIDA: "success",
    CANCELADA: "error",
  } as const;

  return colors[status as keyof typeof colors] ?? "default";
}

export function getLastSixMonths() {
  const today = new Date();

  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(
      today.getFullYear(),
      today.getMonth() - (5 - index),
      1,
    );

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");

    return {
      chave: `${year}-${month}`,
      nome: date.toLocaleDateString("pt-BR", {
        month: "short",
      }),
    };
  });
}
