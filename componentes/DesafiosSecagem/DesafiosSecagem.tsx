import { 
  Droplets, 
  Thermometer, 
  Fuel, 
  Skull, 
  AlertTriangle, 
} from "lucide-react"; 
 
const challenges = [ 
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
    <section className="relative overflow-hidden bg-[#050505] px-4 py-16 sm:px-6 lg:px-8"> 
      <div className="mx-auto max-w-6xl"> 
        {/* Título */} 
        <div className="mb-8 flex justify-center"> 
          <div className="inline-flex items-center gap-4 rounded-2xl border border-[#e04f11]/30 bg-[#0d0d0d] px-6 py-3 shadow-sm"> 
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1a100c]"> 
              <AlertTriangle 
                className="h-6 w-6 text-[#e04f11]" 
                strokeWidth={2} 
              /> 
            </div> 
 
            <h2 className="text-center text-2xl font-bold tracking-tight text-white sm:text-3xl"> 
              Os principais desafios da secagem 
            </h2> 
          </div> 
        </div> 
 
        {/* Subtítulo */} 
        <p className="mb-12 text-center text-base font-medium text-gray-400 sm:text-lg"> 
          Durante a operação, o produto enfrenta desafios como: 
        </p> 
 
        {/* Cards */} 
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2"> 
          {challenges.map((desafio, index) => { 
            const Icon = desafio.icon; 
 
            return ( 
              <article 
                key={index} 
                className="group relative mx-auto flex min-h-[170px] w-full max-w-[520px] items-center overflow-hidden rounded-xl bg-[#0d0d0d] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" 
              > 
                {/* Barra lateral */} 
                <div className="absolute left-0 top-0 h-full w-2 bg-[#e04f11]" /> 
 
                <div className="flex max-w-2xl items-center gap-6 px-8 py-8 sm:px-10"> 
                  {/* Ícone */} 
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#1a100c] shadow-sm"> 
                    <Icon 
                      className="h-8 w-8 text-[#e04f11]" 
                      strokeWidth={1.8} 
                    /> 
                  </div> 
 
                  {/* Texto */} 
                  <p className="text-base font-medium leading-relaxed text-gray-200 sm:text-lg"> 
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