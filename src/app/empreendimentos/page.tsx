import { supabase, type Project } from "@/lib/supabase";
import { Header } from "@/components/ui/Header";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Building2, Search, SlidersHorizontal } from "lucide-react";

export const revalidate = 0;

const statusLabel: Record<string, string> = {
  Launch: "Lançamento",
  InProgress: "Em Obra",
  Ready: "Pronto p/ Morar",
};

const statusStyle: Record<string, string> = {
  Launch: "bg-violet-100 text-violet-700 border-violet-200",
  InProgress: "bg-blue-100 text-blue-700 border-blue-200",
  Ready: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

export default async function EmpreendimentosPage({
  searchParams,
}: {
  searchParams: { status?: string; neighborhood?: string; minPrice?: string; maxPrice?: string };
}) {
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: systemOptions } = await supabase
    .from("system_options")
    .select("*")
    .order("value", { ascending: true });

  const allNeighborhoods = Array.from(
    new Set([
      ...(systemOptions?.filter(o => o.type === "neighborhood").map(o => o.value) || []),
      ...(projects || []).map(p => p.neighborhood).filter(Boolean),
    ])
  ).sort() as string[];

  const minPrice = searchParams.minPrice ? Number(searchParams.minPrice) : 0;
  const maxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : Infinity;

  const filtered: Project[] = (projects || []).filter(p => {
    if (searchParams.status && p.status !== searchParams.status) return false;
    if (searchParams.neighborhood && p.neighborhood?.toLowerCase() !== searchParams.neighborhood.toLowerCase()) return false;
    if (minPrice && p.price_starts_at < minPrice) return false;
    if (maxPrice !== Infinity && p.price_starts_at > maxPrice) return false;
    return true;
  });

  return (
    <main className="min-h-screen bg-[#F1F1F1]">
      <Header />

      {/* Hero */}
      <section
        className="relative pt-40 pb-20 px-6 text-white overflow-hidden"
        style={{ backgroundImage: "url('/fundo.png')", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold mb-4">
            <Building2 size={16} />
            Empreendimentos
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
            Invista no futuro,<br />
            <span className="text-[#FFB800]">construa patrimônio</span>
          </h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            {filtered.length} empreendimento{filtered.length !== 1 ? "s" : ""} · Lançamentos, obras e prontos para morar
          </p>

          {/* Status pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            {Object.entries(statusLabel).map(([key, label]) => {
              const count = (projects || []).filter(p => p.status === key).length;
              return (
                <a
                  key={key}
                  href={`/empreendimentos?status=${key}`}
                  className={`px-4 py-2 rounded-full text-sm font-bold border transition-all hover:scale-105 ${
                    searchParams.status === key
                      ? "bg-[#FFB800] text-black border-[#FFB800]"
                      : "bg-white/10 text-white border-white/30 hover:bg-white/20"
                  }`}
                >
                  {label} ({count})
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-24 md:top-32 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-200 shadow-sm">
        <form method="GET" action="/empreendimentos" className="max-w-7xl mx-auto px-4 md:px-12 py-3 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-neutral-500 mr-2">
            <SlidersHorizontal size={18} />
            <span className="text-sm font-bold text-neutral-600 hidden md:block">Filtrar:</span>
          </div>

          <select name="status" defaultValue={searchParams.status || ""} className="text-sm border border-neutral-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#FFB800] text-neutral-700 cursor-pointer">
            <option value="">Todos os status</option>
            <option value="Launch">Lançamento</option>
            <option value="InProgress">Em Obra</option>
            <option value="Ready">Pronto p/ Morar</option>
          </select>

          <select name="neighborhood" defaultValue={searchParams.neighborhood || ""} className="text-sm border border-neutral-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#FFB800] text-neutral-700 cursor-pointer">
            <option value="">Todos os bairros</option>
            {allNeighborhoods.map(n => <option key={n} value={n}>{n}</option>)}
          </select>

          <input type="number" name="minPrice" placeholder="Valor mín. R$" defaultValue={searchParams.minPrice || ""} className="text-sm border border-neutral-200 rounded-lg px-3 py-2 bg-white w-36 focus:outline-none focus:ring-2 focus:ring-[#FFB800]" />
          <input type="number" name="maxPrice" placeholder="Valor máx. R$" defaultValue={searchParams.maxPrice || ""} className="text-sm border border-neutral-200 rounded-lg px-3 py-2 bg-white w-36 focus:outline-none focus:ring-2 focus:ring-[#FFB800]" />

          <button type="submit" className="flex items-center gap-2 bg-[#FFB800] text-black font-bold text-sm px-5 py-2 rounded-lg hover:bg-[#f0a800] transition-colors ml-auto">
            <Search size={16} />
            Filtrar
          </button>
          {Object.values(searchParams).some(Boolean) && (
            <a href="/empreendimentos" className="text-sm text-neutral-500 hover:text-red-500 transition-colors font-medium">
              Limpar filtros
            </a>
          )}
        </form>
      </section>

      {/* Status Stats */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pt-12">
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(statusLabel).map(([key, label]) => {
            const count = (projects || []).filter(p => p.status === key).length;
            return (
              <div key={key} className={`px-4 py-3 rounded-xl border text-center ${statusStyle[key]}`}>
                <p className="text-2xl font-black">{count}</p>
                <p className="text-xs font-bold uppercase tracking-wider">{label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-neutral-400">
            <Building2 size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-xl font-semibold">Nenhum empreendimento encontrado</p>
            <p className="text-sm mt-2">Tente ajustar os filtros acima.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(p => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </section>

      <WhatsAppButton />
    </main>
  );
}
