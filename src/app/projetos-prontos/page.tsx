import { supabase, type ArchitecturalPlan } from "@/lib/supabase";
import { Header } from "@/components/ui/Header";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ArchPlanCard } from "@/components/ui/ArchPlanCard";
import { Ruler, Search, SlidersHorizontal, Hammer } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

const STYLES = ["Moderno", "Clássico", "Rústico", "Contemporâneo", "Minimalista"];

// Mock data while Supabase table is not created
const MOCK_PLANS: ArchitecturalPlan[] = [
  {
    id: "1",
    title: "Residência Parque Linear",
    description: "Design moderno com grandes aberturas, integração entre sala e área gourmet, brises metálicos e acabamentos premium.",
    area_m2: 280,
    bedrooms: 4,
    suites: 2,
    style: "Moderno",
    price: 28000,
    main_image_url: "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop",
    gallery_urls: [],
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Casa de Campo Provence",
    description: "Projeto inspirado no estilo provençal francês, com pedras aparentes, telhado colonial e jardim paisagístico.",
    area_m2: 350,
    bedrooms: 5,
    suites: 3,
    style: "Clássico",
    price: 42000,
    main_image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2070&auto=format&fit=crop",
    gallery_urls: [],
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Chalé Serrano Premium",
    description: "Arquitetura rústica com madeira de demolição, pedra canga, telha rústica e ampla varanda com lareira externa.",
    area_m2: 210,
    bedrooms: 3,
    suites: 1,
    style: "Rústico",
    price: 19000,
    main_image_url: "https://images.unsplash.com/photo-1609220136736-443140cfeaa8?q=80&w=1854&auto=format&fit=crop",
    gallery_urls: [],
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Loft Contemporâneo Slim",
    description: "Minimalismo sofisticado. Planta aberta, pé-direito duplo e iluminação zenital. Perfeito para terrenos estreitos.",
    area_m2: 160,
    bedrooms: 3,
    suites: 1,
    style: "Minimalista",
    price: 14500,
    main_image_url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
    gallery_urls: [],
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Villa Terraço Infinity",
    description: "Fachada contemporânea com piscina de borda infinita integrada à sala de estar, revestimentos naturais e automação.",
    area_m2: 420,
    bedrooms: 5,
    suites: 4,
    style: "Contemporâneo",
    price: 55000,
    main_image_url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop",
    gallery_urls: [],
    created_at: new Date().toISOString(),
  },
  {
    id: "6",
    title: "Casa Cubo Verde",
    description: "Geometria marcante com planos de concreto aparente e jardim vertical. Ecoeficiente, com telhado verde e coletores solares.",
    area_m2: 240,
    bedrooms: 3,
    suites: 2,
    style: "Moderno",
    price: 26000,
    main_image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
    gallery_urls: [],
    created_at: new Date().toISOString(),
  },
];

export default async function ProjetosProntosPage({
  searchParams,
}: {
  searchParams: { style?: string; bedrooms?: string; minArea?: string; maxArea?: string };
}) {
  // Try to fetch from Supabase; fall back to mocks if table doesn't exist
  const { data: plansData } = await supabase
    .from("architectural_plans")
    .select("*")
    .order("created_at", { ascending: false });

  const allPlans: ArchitecturalPlan[] = (plansData && plansData.length > 0) ? plansData : MOCK_PLANS;

  const minArea = searchParams.minArea ? Number(searchParams.minArea) : 0;
  const maxArea = searchParams.maxArea ? Number(searchParams.maxArea) : Infinity;
  const bedroomsFilter = searchParams.bedrooms ? Number(searchParams.bedrooms) : 0;

  const filtered = allPlans.filter(p => {
    if (searchParams.style && p.style.toLowerCase() !== searchParams.style.toLowerCase()) return false;
    if (bedroomsFilter && p.bedrooms < bedroomsFilter) return false;
    if (minArea && p.area_m2 < minArea) return false;
    if (maxArea !== Infinity && p.area_m2 > maxArea) return false;
    return true;
  });

  return (
    <main className="min-h-screen bg-[#F1F1F1]">
      <Header />

      {/* Hero */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden bg-[#191919]">
        {/* Grid pattern background */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "linear-gradient(rgba(255,184,0,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,184,0,0.4) 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }} />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#F1F1F1] to-transparent" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#FFB800]/20 text-[#FFB800] border border-[#FFB800]/30 px-4 py-2 rounded-full text-sm font-bold mb-6">
            <Ruler size={16} />
            Projetos Arquitetônicos Prontos
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6">
            Escolha o projeto,<br />
            <span className="text-[#FFB800]">nós construímos para você</span>
          </h1>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto mb-10">
            Plantas arquitetônicas prontas para construção, desenvolvidas por nossa equipe. Selecione o estilo que mais combina com você e construa seu lar.
          </p>

          {/* Style Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a href="/projetos-prontos" className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${!searchParams.style ? "bg-[#FFB800] text-black border-[#FFB800]" : "text-white border-white/30 hover:bg-white/10"}`}>
              Todos
            </a>
            {STYLES.map(s => (
              <a key={s} href={`/projetos-prontos?style=${s}`} className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${searchParams.style === s ? "bg-[#FFB800] text-black border-[#FFB800]" : "text-white border-white/30 hover:bg-white/10"}`}>
                {s}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-24 md:top-32 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-200 shadow-sm">
        <form method="GET" action="/projetos-prontos" className="max-w-7xl mx-auto px-4 md:px-12 py-3 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-neutral-500 mr-2">
            <SlidersHorizontal size={18} />
            <span className="text-sm font-bold text-neutral-600 hidden md:block">Filtrar:</span>
          </div>

          <select name="style" defaultValue={searchParams.style || ""} className="text-sm border border-neutral-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#FFB800] cursor-pointer">
            <option value="">Todos os estilos</option>
            {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select name="bedrooms" defaultValue={searchParams.bedrooms || ""} className="text-sm border border-neutral-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#FFB800] cursor-pointer">
            <option value="">Quartos (mín.)</option>
            {[2, 3, 4, 5].map(n => <option key={n} value={n}>{n}+ quartos</option>)}
          </select>

          <input type="number" name="minArea" placeholder="Área mín. (m²)" defaultValue={searchParams.minArea || ""} className="text-sm border border-neutral-200 rounded-lg px-3 py-2 bg-white w-36 focus:outline-none focus:ring-2 focus:ring-[#FFB800]" />
          <input type="number" name="maxArea" placeholder="Área máx. (m²)" defaultValue={searchParams.maxArea || ""} className="text-sm border border-neutral-200 rounded-lg px-3 py-2 bg-white w-36 focus:outline-none focus:ring-2 focus:ring-[#FFB800]" />

          <button type="submit" className="flex items-center gap-2 bg-[#FFB800] text-black font-bold text-sm px-5 py-2 rounded-lg hover:bg-[#f0a800] transition-colors ml-auto">
            <Search size={16} />
            Aplicar Filtros
          </button>
          {Object.values(searchParams).some(Boolean) && (
            <a href="/projetos-prontos" className="text-sm text-neutral-500 hover:text-red-500 transition-colors font-medium">
              Limpar
            </a>
          )}
        </form>
      </section>

      {/* Info Banner */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pt-12">
        <div className="bg-[#1a1a2e] text-white rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-[#FFB800] p-3 rounded-xl">
              <Hammer size={24} className="text-black" />
            </div>
            <div>
              <p className="font-bold text-lg">Construção com a HI Imóveis e construções</p>
              <p className="text-neutral-400 text-sm">Compre a planta e contrate a construção com nossa equipe. Entrega garantida.</p>
            </div>
          </div>
          <Link href="/construir" className="bg-[#FFB800] text-black font-bold px-6 py-3 rounded-xl hover:bg-[#f0a800] transition-colors whitespace-nowrap flex-shrink-0">
            Construir do Meu Jeito →
          </Link>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-neutral-800">
            {filtered.length} projeto{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
          </h2>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24 text-neutral-400">
            <Ruler size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-xl font-semibold">Nenhum projeto encontrado</p>
            <p className="text-sm mt-2">Ajuste os filtros acima.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(p => (
              <ArchPlanCard key={p.id} plan={p} />
            ))}
          </div>
        )}
      </section>

      <WhatsAppButton />
    </main>
  );
}
