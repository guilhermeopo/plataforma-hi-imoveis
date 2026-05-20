import { supabase, type Property, type Project, type ArchitecturalPlan } from "@/lib/supabase";
import { PropertyGrid } from "@/components/ui/PropertyGrid";
import { ProjectGrid } from "@/components/ui/ProjectGrid";
import { SearchBar } from "@/components/ui/SearchBar";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { Header } from "@/components/ui/Header";
import { ArchPlanCard } from "@/components/ui/ArchPlanCard";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 0; // Disable static rendering to always show fresh data

export default async function Home({
  searchParams,
}: {
  searchParams: { q?: string, intent?: string, location?: string, type?: string, project?: string, minPrice?: string, maxPrice?: string, code?: string }
}) {
  const query = searchParams.q?.toLowerCase() || "";
  const intent = searchParams.intent || "";
  const searchLocation = searchParams.location?.toLowerCase() || "";
  const searchType = searchParams.type?.toLowerCase() || "";
  const minPrice = searchParams.minPrice ? Number(searchParams.minPrice) : 0;
  const maxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : Infinity;
  const code = searchParams.code?.toLowerCase() || "";

  const [{ data: properties }, { data: projects }, { data: systemOptions }, { data: plansData }] = await Promise.all([
    supabase.from("properties").select("*").order("created_at", { ascending: false }),
    supabase.from("projects").select("*").order("created_at", { ascending: false }),
    supabase.from("system_options").select("*").order("value", { ascending: true }),
    supabase.from("architectural_plans").select("*").order("created_at", { ascending: false }).limit(3)
  ]);

  const allLocationsRaw = [
    ...(systemOptions?.filter(o => o.type === "neighborhood").map(o => o.value) || []),
    ...(properties || []).map(p => p.neighborhood),
    ...(projects || []).map(p => p.neighborhood)
  ].filter(Boolean) as string[];
  const allLocations = Array.from(new Set(allLocationsRaw)).sort();

  const allTypesRaw = [
    ...(systemOptions?.filter(o => o.type === "property_type").map(o => o.value) || []),
    ...(properties || []).map(p => p.property_type),
    ...(projects || []).map(p => p.property_type),
    ...(plansData || []).map(p => p.style)
  ].filter(Boolean) as string[];
  const allTypes = Array.from(new Set(allTypesRaw)).sort();

  const isMock = process.env.NODE_ENV === "development";

  const displayProperties: Property[] = properties || [
    {
      id: "1",
      title: "Mansão Suspensa em Balneário Camboriú",
      description: "Vista definitiva para o mar, acabamento premium, 4 suítes, infraestrutura completa de resort.",
      price: 15500000,
      type: "Sale",
      status: "Available",
      location: "Praia de Laranjeiras, Balneário Camboriú",
      main_image_url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop",
      gallery_urls: [],
      video_url: null,
      created_at: new Date().toISOString()
    },
    {
      id: "2",
      title: "Cobertura Duplex no Itaim Bibi",
      description: "Design contemporâneo assinado, piscina privativa com borda infinita, 100% automatizada.",
      price: 89000,
      type: "Rent",
      status: "Available",
      location: "Itaim Bibi, São Paulo - SP",
      main_image_url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
      gallery_urls: [],
      video_url: null,
      created_at: new Date().toISOString()
    }
  ];

  const displayProjects: Project[] = projects || (isMock ? [
    {
      id: "1",
      title: "Residencial Horizonte Bairro Alto",
      code: "LANC-001",
      description: "Um empreendimento desenhado para transformar a skyline da cidade.",
      price_starts_at: 450000,
      status: "Launch",
      stage: "Aprovação de Projeto",
      location: "Bairro Alto, Curitiba - PR",
      features: ["Rooftop Pool", "Academia"],
      main_image_url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2000&auto=format&fit=crop",
      gallery_urls: [],
      video_url: null,
      created_at: new Date().toISOString()
    }
  ] : []);


  const searchProject = searchParams.project?.toLowerCase() || "";

  const filteredProperties = displayProperties.filter((p) => {
    if (code) return p.code?.toLowerCase().includes(code);

    if (searchProject) return false;

    if (intent === 'empreendimento') return false;
    if (intent === 'venda' && p.type !== 'Sale') return false;

    if (searchLocation) {
      const pLoc = p.location?.toLowerCase() || '';
      const pNeigh = p.neighborhood?.toLowerCase() || '';
      if (!pLoc.includes(searchLocation) && !pNeigh.includes(searchLocation)) return false;
    }

    if (searchType) {
      const pType = p.property_type?.toLowerCase() || '';
      const pTitle = p.title.toLowerCase();
      const pDesc = p.description.toLowerCase();
      if (!pType.includes(searchType) && !pTitle.includes(searchType) && !pDesc.includes(searchType)) return false;
    }

    if (minPrice && p.price < minPrice) return false;
    if (maxPrice !== Infinity && p.price > maxPrice) return false;

    if (query) {
      const titleMatch = p.title.toLowerCase().includes(query);
      const locationMatch = p.location && p.location.toLowerCase().includes(query);
      const descriptionMatch = p.description.toLowerCase().includes(query);
      const codeMatch = p.code && p.code.toLowerCase().includes(query);
      const matchesSale = p.type === 'Sale' && (query.includes('venda') || query.includes('comprar'));
      if (!titleMatch && !locationMatch && !descriptionMatch && !codeMatch && !matchesSale) return false;
    }

    return true;
  });

  const filteredProjects = displayProjects.filter((p) => {
    if (code) return p.code?.toLowerCase().includes(code);

    if (intent === 'venda') return false;

    if (searchLocation) {
      const pLoc = p.location?.toLowerCase() || '';
      const pNeigh = p.neighborhood?.toLowerCase() || '';
      if (!pLoc.includes(searchLocation) && !pNeigh.includes(searchLocation)) return false;
    }

    if (searchType) {
      const pType = p.property_type?.toLowerCase() || '';
      const pTitle = p.title.toLowerCase();
      const pDesc = p.description.toLowerCase();
      if (!pType.includes(searchType) && !pTitle.includes(searchType) && !pDesc.includes(searchType)) return false;
    }

    if (minPrice && p.price_starts_at < minPrice) return false;
    if (maxPrice !== Infinity && p.price_starts_at > maxPrice) return false;

    if (searchProject && p.title.toLowerCase() !== searchProject) return false;

    if (query) {
      const titleMatch = p.title.toLowerCase().includes(query);
      const locationMatch = p.location && p.location.toLowerCase().includes(query);
      const codeMatch = p.code && p.code.toLowerCase().includes(query);
      const matchesEmpreendimento = query.includes('empreendimento') || query.includes('lançamento') || query.includes('obra');
      if (!titleMatch && !locationMatch && !codeMatch && !matchesEmpreendimento) return false;
    }

    return true;
  });

  const salesProperties = filteredProperties.filter(p => p.type === 'Sale');

  return (

    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/50 z-10 pointer-events-none" />
          <Image
            src="/fundonovo.png"
            alt="Hero Background"
            fill
            className="w-full h-full object-cover"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto animate-fade-in-up -mt-16 md:-mt-24">

          {/* Hero Content Space (Logo used to be here) */}
          <div className="h-16 md:h-24"></div>

          {/* Frase Principal Estilizada */}

          {/* Search Bar */}
          <SearchBar neighborhoods={allLocations} propertyTypes={allTypes} />
        </div>
      </section>

      {/* Showcase Grids (Agora Paginados) */}
      <div className="bg-[#F1F1F1]">


        {intent !== 'empreendimento' && (
          <PropertyGrid
            id="venda"
            title="Imóveis à Venda"
            subtitle="Oportunidades exclusivas para aquisição do seu novo patrimônio."
            emptyMessage="Nenhum imóvel à venda encontrado no momento com estes critérios."
            properties={salesProperties}
          />
        )}

        {intent !== 'venda' && (
          <ProjectGrid
            id="empreendimentos"
            title="Empreendimentos na planta"
            subtitle="Explore lançamentos e projetos em construção ideais para investir ou morar."
            emptyMessage="Nenhum empreendimento ativo encontrado com estes critérios."
            projects={filteredProjects}
          />
        )}

        {/* Projetos Prontos Preview */}
        {plansData && plansData.length > 0 && (
          <div className="py-10 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <div className="inline-flex items-center gap-2 bg-[#FFB800]/10 text-[#b07d00] border border-[#FFB800]/20 px-3 py-1 rounded-full text-xs font-bold mb-3">
                    🏗️ NOVIDADE
                  </div>
                  <h2 className="text-3xl font-black text-[#2C2C2C] tracking-tighter">
                    Projetos <span className="text-[#FFB800]">Disponíveis</span>
                  </h2>
                  <p className="text-neutral-500 mt-1 text-sm">Plantas arquitetônicas prontas para construção.</p>
                </div>
                <Link href="/projetos-prontos" className="hidden md:flex items-center gap-2 text-sm font-bold text-neutral-600 hover:text-[#FFB800] transition-colors">
                  Ver todos →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(plansData as ArchitecturalPlan[]).map(plan => (
                  <ArchPlanCard key={plan.id} plan={plan} />
                ))}
              </div>

              <div className="mt-8 text-center md:hidden">
                <Link href="/projetos-prontos" className="inline-flex items-center gap-2 bg-[#FFB800] text-black font-bold px-6 py-3 rounded-xl hover:bg-[#e0a800] transition-colors">
                  Ver todos os projetos →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Projetos Prontos CTA */}
      <section className="bg-[#1a1a2e] py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 bg-[#FFB800]/20 text-[#FFB800] border border-[#FFB800]/30 px-4 py-1.5 rounded-full text-xs font-bold mb-5">
              🏗️ NOVO
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4">
              Plantas Prontas para<br />
              <span className="text-[#FFB800]">Construção</span>
            </h2>
            <p className="text-neutral-400 text-base mb-8">
              Projetos arquitetônicos desenvolvidos pela nossa equipe. Compre a planta e construa com segurança, qualidade e prazo garantido.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <a href="/projetos-prontos" className="bg-[#FFB800] text-black font-bold px-8 py-4 rounded-xl hover:bg-[#f0a800] transition-all hover:-translate-y-1 shadow-lg shadow-[#FFB800]/20">
                Ver Projetos →
              </a>
              <a href="/construir" className="border border-white/20 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-all">
                Construir do Meu Jeito
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm mx-auto md:mx-0">
            {["Moderno", "Clássico", "Rústico", "Contemporâneo"].map((style, i) => (
              <a key={style} href={`/projetos-prontos?style=${style}`} className={`bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:bg-[#FFB800]/10 hover:border-[#FFB800]/30 transition-all group ${i === 0 ? "col-span-2 md:col-span-1" : ""}`}>
                <p className="text-white font-bold text-sm group-hover:text-[#FFB800] transition-colors">{style}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-neutral-200 mt-20" style={{ backgroundImage: "url('/fundo.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-48 h-20 flex items-center justify-center overflow-visible">
                <Image src="/logobranca.png" alt="HI Imóveis Logo" width={192} height={80} className="w-full h-full object-contain object-left scale-[2.5] origin-left" />
              </div>
              <div className="text-2xl font-bold tracking-tighter text-[#2C2C2C]">
                <span className="text-hi-dark-orange ml-1.5"></span>
              </div>
            </div>
            <p className="text-neutral-600"></p>
            <p className="text-white mt-4 text-xl md:text-2xl font-bold tracking-wide">CRECI J 074</p>
          </div>

          <div className="flex flex-col items-center md:items-start text-black">
            <h4 className="text-black font-bold mb-4 text-xl md:text-2xl">Nossas Especialidades</h4>
            <ul className="space-y-3 text-base md:text-lg">
              <li>• Venda de Imóveis</li>
              <li>• Terrenos</li>
              <li>• Construções & Empreendimentos</li>
              <li>• Lançamentos</li>
              <li>• Crédito Imobiliário</li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start text-black">
            <h4 className="text-black font-bold mb-4 text-xl md:text-2xl">Nosso Escritório</h4>
            <p className="text-base md:text-lg mb-2">Rua Buriti, 343 - Jardim de Alah</p>
            <p className="text-base md:text-lg mb-2">Sala 04, Rio Branco - Acre</p>
            <p className="text-base md:text-lg">CEP: 69915-514</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 pt-8 border-t border-white/30 text-center text-sm text-white/70 flex flex-col items-center">
          <p>&copy; {new Date().getFullYear()} HI Imóveis e Construções. Todos os direitos reservados.</p>
        </div>
      </footer>
      <WhatsAppButton />
    </main>
  );
}
