import { supabase, type Project } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle, MapPin, Building, Flag, Hammer } from "lucide-react";
import Link from "next/link";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ImageCarousel } from "@/components/ui/ImageCarousel";
import { ContactForm } from "@/components/ui/ContactForm";

export const revalidate = 0;

export default async function ProjectDetails({ params }: { params: { id: string } }) {
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", params.id)
    .single();

  const isMock = !project && process.env.NODE_ENV === "development";
  const displayProject: Project | null = project || (isMock ? {
      id: "1",
      title: "Residencial Horizonte Bairro Alto",
      code: "LANC-001",
      description: "Um empreendimento desenhado para transformar a skyline da cidade. Oferecendo opções versáteis de apartamentos studio a 3 quartos com varanda gourmet, o Horizonte traz um novo conceito de moradia com lazer completo no rooftop, infraestrutura para carros elétricos e muito mais.",
      price_starts_at: 450000,
      status: "Launch",
      stage: "Fase de Lançamento / Pré-venda",
      location: "Bairro Alto, Curitiba - PR",
      features: ["Rooftop Pool", "Academia", "Coworking", "Portaria 24h"],
      main_image_url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2000&auto=format&fit=crop",
      gallery_urls: [
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2000&auto=format&fit=crop"
      ],
      video_url: null,
      created_at: new Date().toISOString()
  } : null);

  if (!displayProject) {
    notFound();
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Launch': return 'Lançamento';
      case 'InProgress': return 'Em Obras';
      case 'Ready': return 'Pronto para Morar';
      default: return 'Empreendimento';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Launch': return <Flag size={18} className="text-pink-500" />;
      case 'InProgress': return <Hammer size={18} className="text-[#FFB800]" />;
      case 'Ready': return <CheckCircle size={18} className="text-emerald-500" />;
      default: return <Building size={18} />;
    }
  };

  return (
    <main className="min-h-screen bg-[#F1F1F1] pb-24">
      {/* Dynamic Header Image Carousel */}
      <div className="relative h-[45vh] md:h-[70vh] w-full">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-[#0A0A0A]/30 to-transparent z-10 pointer-events-none md:block hidden" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 pointer-events-none md:hidden block" />
        <ImageCarousel 
          mainImage={displayProject.main_image_url} 
          gallery={displayProject.gallery_urls} 
          title={displayProject.title} 
        />
        
        <div className="absolute top-6 left-6 z-20">
          <Link href="/" className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 backdrop-blur-md text-[#2C2C2C] hover:bg-white hover:text-[#d95d29] hover:scale-105 shadow-md transition-all">
            <ArrowLeft size={22} />
          </Link>
        </div>

        {/* Overlay Texto no Desktop */}
        <div className="hidden md:block absolute bottom-0 left-0 w-full z-20 p-8 md:p-16 max-w-7xl mx-auto animate-fade-in-up">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold tracking-widest text-[#2C2C2C] uppercase bg-white/90 border border-white/20 rounded-full backdrop-blur-md shadow-sm">
                  {getStatusIcon(displayProject.status)}
                  {getStatusText(displayProject.status)}
                </span>
                {displayProject.code && (
                  <span className="inline-block px-3 py-1 text-xs font-semibold tracking-widest text-neutral-700 uppercase bg-white/90 border border-white/20 rounded-full backdrop-blur-md shadow-sm">
                    CÓD: {displayProject.code}
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-2 leading-tight drop-shadow-md font-serif">
                {displayProject.title}
              </h1>
              <div className="flex items-center text-white/90 gap-2 mt-4 drop-shadow-md font-medium">
                <MapPin size={18} className="text-[#FFB800]" />
                <span>{displayProject.location || 'Localização sob Consulta'}</span>
              </div>
            </div>
            
            <div className="text-left md:text-right bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-2xl">
              <p className="text-xs text-neutral-600 mb-1 uppercase tracking-wide font-semibold">Unidades a partir de</p>
              <p className="text-4xl font-extrabold text-[#d95d29] mb-1">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(displayProject.price_starts_at)}
              </p>
              {displayProject.stage && (
                <p className="text-sm font-semibold text-neutral-500 mt-2">Estágio: {displayProject.stage}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Título e Preço no Mobile */}
      <div className="md:hidden relative z-30 px-4 -mt-12 mb-8 max-w-lg mx-auto animate-fade-in-up">
        <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-neutral-100 flex flex-col gap-4">
          <div>
            <div className="flex items-center flex-wrap gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold tracking-widest text-neutral-800 uppercase bg-neutral-100 rounded-full">
                {getStatusIcon(displayProject.status)}
                {getStatusText(displayProject.status)}
              </span>
              {displayProject.code && (
                <span className="inline-block px-3 py-1 text-[10px] font-bold tracking-widest text-neutral-600 uppercase bg-neutral-50 border border-neutral-200 rounded-full">
                  CÓD: {displayProject.code}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-[#2C2C2C] leading-snug font-serif">
              {displayProject.title}
            </h1>
            <div className="flex items-center text-neutral-500 gap-1.5 mt-2 text-sm italic">
              <MapPin size={14} className="text-[#FFB800]" />
              <span>{displayProject.location || 'Localização'}</span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-neutral-100">
            <p className="text-[10px] text-neutral-500 mb-1 uppercase tracking-widest font-bold">A partir de</p>
            <p className="text-3xl font-extrabold text-[#d95d29] tracking-tight">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(displayProject.price_starts_at)}
            </p>
            {displayProject.stage && (
              <p className="text-xs text-neutral-500 font-semibold mt-2">{displayProject.stage}</p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-16 pt-2 md:pt-16 grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-16">
        {/* Main Content Info */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Features Highlights */}
          {displayProject.features && displayProject.features.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-[#2C2C2C] mb-6 font-serif tracking-tight flex items-center gap-2">
                <Building className="text-[#d95d29]" size={24} /> Diferenciais do Projeto
              </h2>
              <div className="flex flex-wrap gap-3 py-6 border-b border-neutral-200">
                {displayProject.features.map(feature => (
                  <span key={feature} className="px-4 py-2 bg-white text-neutral-700 text-sm font-semibold rounded-lg shadow-sm border border-neutral-200">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="prose prose-lg max-w-none text-neutral-700">
            <h2 className="text-3xl font-bold text-[#2C2C2C] mb-6 font-serif tracking-tight">Sobre o Empreendimento</h2>
            <p className="leading-relaxed text-lg whitespace-pre-wrap">
              {displayProject.description}
            </p>
          </div>

          {/* Video Player Section */}
          {displayProject.video_url && (
            <div className="pt-8">
              <h2 className="text-2xl font-bold text-[#2C2C2C] mb-8 font-serif tracking-tight">Vídeo de Apresentação</h2>
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-white border border-neutral-200 shadow-xl block relative">
                {displayProject.video_url.includes("youtube.com") || displayProject.video_url.includes("youtu.be") ? (
                   <iframe 
                    className="absolute inset-0 w-full h-full"
                    src={displayProject.video_url.replace("watch?v=", "embed/")} 
                    title="Vídeo do Empreendimento"
                    allowFullScreen 
                  />
                ) : (
                  <video 
                    controls 
                    className="absolute inset-0 w-full h-full object-cover"
                    src={displayProject.video_url}
                    poster={displayProject.main_image_url}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Sticky / Contact */}
        <div className="lg:col-span-1">
          <ContactForm 
            propertyTitle={`Empreendimento: ${displayProject.title}`}
            propertyLocation={displayProject.location}
            brokerName={displayProject.broker_name}
            brokerWhatsapp={displayProject.broker_whatsapp}
          />
        </div>
      </div>

      {/* Property Location Map */}
      {displayProject.location && (
        <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 relative z-20">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-neutral-200">
            <h2 className="text-2xl font-bold text-[#2C2C2C] mb-6 flex items-center gap-3 font-serif tracking-tight">
              <MapPin className="text-[#d95d29]" size={24} />
              Localização
            </h2>
            <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-neutral-200 relative bg-neutral-100">
              <iframe
                title={`Mapa da localização de ${displayProject.title}`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(displayProject.location)}&t=m&z=15&output=embed&iwloc=near`}
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <WhatsAppButton 
        propertyTitle={`Lançamento: ${displayProject.title}`} 
        brokerWhatsapp={displayProject.broker_whatsapp} 
      />
    </main>
  );
}
