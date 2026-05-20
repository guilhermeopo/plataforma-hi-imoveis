import { supabase, type Property } from "@/lib/supabase";
import { Header } from "@/components/ui/Header";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { Search, SlidersHorizontal, Home } from "lucide-react";

export const revalidate = 0;

export default async function ImoveisPage({
  searchParams,
}: {
  searchParams: { type?: string; neighborhood?: string; status?: string; minPrice?: string; maxPrice?: string };
}) {
  const { data: properties } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: systemOptions } = await supabase
    .from("system_options")
    .select("*")
    .order("value", { ascending: true });

  const allNeighborhoods = Array.from(
    new Set([
      ...(systemOptions?.filter(o => o.type === "neighborhood").map(o => o.value) || []),
      ...(properties || []).map(p => p.neighborhood).filter(Boolean),
    ])
  ).sort() as string[];

  const allTypes = Array.from(
    new Set([
      ...(systemOptions?.filter(o => o.type === "property_type").map(o => o.value) || []),
      ...(properties || []).map(p => p.property_type).filter(Boolean),
    ])
  ).sort() as string[];

  const minPrice = searchParams.minPrice ? Number(searchParams.minPrice) : 0;
  const maxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : Infinity;

  const filtered: Property[] = (properties || []).filter(p => {
    if (searchParams.status && p.status !== searchParams.status) return false;
    if (searchParams.neighborhood && p.neighborhood?.toLowerCase() !== searchParams.neighborhood.toLowerCase()) return false;
    if (searchParams.type) {
      const pt = p.property_type?.toLowerCase() || "";
      if (!pt.includes(searchParams.type.toLowerCase())) return false;
    }
    if (minPrice && p.price < minPrice) return false;
    if (maxPrice !== Infinity && p.price > maxPrice) return false;
    return true;
  });

  return (
    <main className="min-h-screen bg-[#F1F1F1]">
      <Header />

      {/* Page Hero */}
      <section className="relative pt-40 pb-24 px-6 text-white overflow-hidden bg-[#191919]">
        {/* Grid pattern background */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "linear-gradient(rgba(255,184,0,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,184,0,0.4) 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }} />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#F1F1F1] to-transparent z-0" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold mb-4">
            <Home size={16} />
            Imóveis à Venda
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
            Encontre o imóvel<br />
            <span className="text-[#FFB800]">dos seus sonhos</span>
          </h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            {filtered.length} imóve{filtered.length === 1 ? "l" : "is"} disponíve{filtered.length === 1 ? "l" : "is"} · Filtre e encontre o ideal para você
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-24 md:top-32 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-200 shadow-sm">
        <form method="GET" action="/imoveis" className="max-w-7xl mx-auto px-4 md:px-12 py-3 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-neutral-500 mr-2">
            <SlidersHorizontal size={18} />
            <span className="text-sm font-bold text-neutral-600 hidden md:block">Filtrar:</span>
          </div>

          <select name="neighborhood" defaultValue={searchParams.neighborhood || ""} className="text-sm border border-neutral-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#FFB800] text-neutral-700 cursor-pointer">
            <option value="">Todos os bairros</option>
            {allNeighborhoods.map(n => <option key={n} value={n}>{n}</option>)}
          </select>

          <select name="type" defaultValue={searchParams.type || ""} className="text-sm border border-neutral-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#FFB800] text-neutral-700 cursor-pointer">
            <option value="">Todos os tipos</option>
            {allTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          <select name="status" defaultValue={searchParams.status || ""} className="text-sm border border-neutral-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#FFB800] text-neutral-700 cursor-pointer">
            <option value="">Qualquer status</option>
            <option value="Available">Disponível</option>
            <option value="Sold">Vendido</option>
          </select>

          <input type="number" name="minPrice" placeholder="Preço mín. R$" defaultValue={searchParams.minPrice || ""} className="text-sm border border-neutral-200 rounded-lg px-3 py-2 bg-white w-36 focus:outline-none focus:ring-2 focus:ring-[#FFB800]" />
          <input type="number" name="maxPrice" placeholder="Preço máx. R$" defaultValue={searchParams.maxPrice || ""} className="text-sm border border-neutral-200 rounded-lg px-3 py-2 bg-white w-36 focus:outline-none focus:ring-2 focus:ring-[#FFB800]" />

          <button type="submit" className="flex items-center gap-2 bg-[#FFB800] text-black font-bold text-sm px-5 py-2 rounded-lg hover:bg-[#f0a800] transition-colors ml-auto">
            <Search size={16} />
            Buscar
          </button>
          {Object.values(searchParams).some(Boolean) && (
            <a href="/imoveis" className="text-sm text-neutral-500 hover:text-red-500 transition-colors font-medium">
              Limpar filtros
            </a>
          )}
        </form>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-neutral-400">
            <Home size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-xl font-semibold">Nenhum imóvel encontrado</p>
            <p className="text-sm mt-2">Tente ajustar os filtros acima.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(p => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </section>

      <WhatsAppButton />
    </main>
  );
}
