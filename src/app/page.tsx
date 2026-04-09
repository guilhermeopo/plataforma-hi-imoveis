import { supabase, type Property } from "@/lib/supabase";
import { PropertyGrid } from "@/components/ui/PropertyGrid";
import { SearchBar } from "@/components/ui/SearchBar";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { Menu } from "lucide-react";

export const revalidate = 0; // Disable static rendering to always show fresh data

export default async function Home({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const query = searchParams.q?.toLowerCase() || "";

  const { data: properties } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  // Fallback data if no supabase connection yet
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

  const filteredProperties = query
    ? displayProperties.filter((p) => {
      const titleMatch = p.title.toLowerCase().includes(query);
      const locationMatch = p.location && p.location.toLowerCase().includes(query);
      const descriptionMatch = p.description.toLowerCase().includes(query);

      // Match natural language for type
      const matchesSale = p.type === 'Sale' && (query.includes('venda') || query.includes('comprar'));

      return titleMatch || locationMatch || descriptionMatch || matchesSale;
    })
    : displayProperties;

  const salesProperties = filteredProperties.filter(p => p.type === 'Sale');

  return (
    <main className="min-h-screen">
      {/* Navbar (Header) */}
      <header className="absolute top-0 inset-x-0 z-50 bg-white shadow-md h-20 md:h-[90px] px-4 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <div className="w-48 sm:w-60 md:w-72 h-full flex items-center justify-start py-2.5">
          <img src="/logo.png" alt="Logo HI Imóveis" className="w-[110%] max-w-[110%] h-auto md:h-full object-contain object-left md:scale-[1.10] origin-left" />
        </div>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-6 font-sans text-sm font-semibold text-neutral-800">
          <a href="#" className="hover:text-[#d95d29] transition-colors">Sobre nós</a>
          <a href="#venda" className="hover:text-[#d95d29] transition-colors">Imóveis</a>
          <a href="#" className="hover:text-[#d95d29] transition-colors">Empreendimentos</a>
          <a href="#" className="hover:text-[#d95d29] transition-colors">Contato</a>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <a href="#" className="text-sm font-bold text-white bg-[#d95d29] hover:bg-[#b04a1f] px-6 py-2.5 rounded-sm transition-colors shadow-sm">
            Anuncie Aqui
          </a>
        </div>

        {/* Mobile Hamburger */}
        <div className="lg:hidden flex items-center">
          <button className="text-[#d95d29] p-2 hover:bg-neutral-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#d95d29]">
            <Menu size={32} />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/50 z-10 pointer-events-none" />
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            src="https://cdn.pixabay.com/video/2021/08/21/85800-591785532_large.mp4"
            poster="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto animate-fade-in-up -mt-16 md:-mt-24">

          {/* Hero Content Space (Logo used to be here) */}
          <div className="h-16 md:h-24"></div>

          {/* Frase Principal Estilizada */}

          {/* Search Bar */}
          <SearchBar />
        </div>
      </section>

      {/* Showcase Grids (Agora Paginados) */}
      <div className="bg-[#F1F1F1]">
        <PropertyGrid
          id="venda"
          title="Imóveis à Venda"
          subtitle="Oportunidades exclusivas para aquisição do seu novo patrimônio."
          emptyMessage="Nenhum imóvel à venda encontrado no momento."
          properties={salesProperties}
        />
      </div>

      {/* Footer */}
      <footer className="bg-white py-16 border-t border-neutral-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1">
                <img src="/logo.png" alt="HI Imóveis Logo" className="w-full h-full object-contain" />
              </div>
              <div className="text-2xl font-bold tracking-tighter text-[#2C2C2C]">
                HI<span className="text-hi-dark-orange ml-1.5">IMÓVEIS</span>
              </div>
            </div>
            <p className="text-neutral-600">onde sua nova história começa.</p>
            <p className="text-hi-blue mt-2 text-sm font-semibold tracking-wide">CRECI J 074</p>
          </div>

          <div className="flex flex-col items-center md:items-start text-neutral-600">
            <h4 className="text-[#2C2C2C] font-semibold mb-4 text-lg">Nossas Especialidades</h4>
            <ul className="space-y-2 text-sm">
              <li>• Venda de Imóveis</li>
              <li>• Lotes e Terrenos</li>
              <li>• Construções & Empreendimentos</li>
              <li>• Lançamentos</li>
              <li>• Crédito Imobiliário</li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start text-neutral-600">
            <h4 className="text-[#2C2C2C] font-semibold mb-4 text-lg">Nosso Escritório</h4>
            <p className="text-sm mb-1">Rua Buriti, 343 - Jardim de Alah</p>
            <p className="text-sm mb-1">Sala 04, Rio Branco - Acre</p>
            <p className="text-sm">CEP: 69915-514</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 pt-8 border-t border-neutral-200 text-center text-sm text-neutral-600 flex flex-col items-center">
          <p>&copy; {new Date().getFullYear()} HI Imóveis e Construções. Todos os direitos reservados.</p>
        </div>
      </footer>
      <WhatsAppButton />
    </main>
  );
}
