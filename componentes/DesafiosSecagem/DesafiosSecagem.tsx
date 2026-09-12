import {
  Droplets,
  Thermometer,
  Fuel,
  Skull,
  AlertTriangle,
} from "lucide-react";

const desafios = [
  {
    icon: Droplets,
    title:
      "Excesso de umidade, que acelera a deterioração e o aparecimento de fungos",
  },
  {
    icon: Thermometer,
    title:
      "Variações de temperatura que reduzem a qualidade e a integridade dos grãos",
  },
  {
    icon: Fuel,
    title: "Consumo elevado de combustível e baixa eficiência energética",
  },
  {
    icon: Skull,
    title:
      "Risco de contaminação por compostos indesejáveis, como HPA (Hidrocarbonetos Policíclicos Aromáticos)",
  },
];

export default function DesafiosSecagem() {
  return (
    <section className="relative overflow-hidden bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Título */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex items-center gap-4 rounded-2xl border border-orange-200 bg-red-50 px-6 py-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
              <AlertTriangle
                className="h-6 w-6 text-orange-500"
                strokeWidth={2}
              />
            </div>

            <h2 className="text-center text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
              Os principais desafios da secagem
            </h2>
          </div>
        </div>

        {/* Subtítulo */}
        <p className="mb-12 text-center text-base font-medium text-slate-500 sm:text-lg">
          Durante a operação, o produto enfrenta desafios como:
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {desafios.map((desafio, index) => {
            const Icon = desafio.icon;

            return (
              <article
                key={index}
                className="group relative flex min-h-[170px] items-center overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Barra lateral */}
                <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-orange-500 to-red-400" />

                <div className="flex w-full items-center gap-6 px-8 py-8 sm:px-10">
                  {/* Ícone */}
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-red-50 shadow-sm">
                    <Icon
                      className="h-8 w-8 text-orange-500"
                      strokeWidth={1.8}
                    />
                  </div>

                  {/* Texto */}
                  <p className="text-base font-medium leading-relaxed text-slate-700 sm:text-lg">
                    {desafio.title}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}