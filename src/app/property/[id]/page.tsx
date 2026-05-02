import { supabase, type Property } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle, BedDouble, Bath, Square, MapPin } from "lucide-react";
import Link from "next/link";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ImageCarousel } from "@/components/ui/ImageCarousel";
import { ContactForm } from "@/components/ui/ContactForm";

export const revalidate = 0;

export default async function PropertyDetails({ params }: { params: { id: string } }) {
  const { data: property } = await supabase
    .from("properties")
    .select("*")
    .eq("id", params.id)
    .single();

  const isMock = !property && process.env.NODE_ENV === "development";
  const displayProperty: Property | null = property || (isMock ? {
    id: "1",
    title: "Mansão Suspensa em Balneário Camboriú",
    description: "Vista definitiva para o mar, acabamento premium, 4 suítes, infraestrutura completa de resort. O projeto conta com assinaturas internacionais de arquitetura, trazendo o mais alto nível de conforto e sofisticação para sua família.",
    price: 15500000,
    type: "Sale",
    status: "Available",
    bedrooms: 4,
    bathrooms: 6,
    area: 450,
    location: "Balneário Camboriú, SC",
    main_image_url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop",
    gallery_urls: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
    ],
    video_url: "https://cdn.pixabay.com/video/2021/08/21/85800-591785532_large.mp4",
    created_at: new Date().toISOString()
  } : null);

  if (!displayProperty) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F1F1F1] pb-24">
      {/* Dynamic Header Image Carousel */}
      <div className="relative h-[45vh] md:h-[70vh] w-full">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-[#0A0A0A]/20 to-transparent z-10 pointer-events-none md:block hidden" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10 pointer-events-none md:hidden block" />
        <ImageCarousel
          mainImage={displayProperty.main_image_url}
          gallery={displayProperty.gallery_urls}
          title={displayProperty.title}
        />

        <div className="absolute top-6 left-6 z-20">
          <Link href="/" className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 backdrop-blur-md text-[#2C2C2C] hover:bg-white hover:text-hi-blue hover:scale-105 shadow-md transition-all">
            <ArrowLeft size={22} />
          </Link>
        </div>

        {/* Overlay Texto no Desktop */}
        <div className="hidden md:block absolute bottom-0 left-0 w-full z-20 p-8 md:p-16 max-w-7xl mx-auto animate-fade-in-up">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-block px-3 py-1 text-xs font-semibold tracking-widest text-[#d95d29] uppercase bg-white/90 border border-white/20 rounded-full backdrop-blur-md shadow-sm">
                  {displayProperty.type === 'Sale' ? 'Para Venda' : 'Para Aluguel'}
                </span>
                {displayProperty.code && (
                  <span className="inline-block px-3 py-1 text-xs font-semibold tracking-widest text-neutral-700 uppercase bg-white/90 border border-white/20 rounded-full backdrop-blur-md shadow-sm flex items-center gap-1">
                    CÓDIGO: {displayProperty.code}
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-2 leading-tight drop-shadow-md font-serif">
                {displayProperty.title}
              </h1>
              <div className="flex items-center text-white/90 gap-2 mt-4 drop-shadow-md font-medium">
                <MapPin size={18} className="text-hi-orange" />
                <span>{displayProperty.location || 'Localização sob Consulta'}</span>
              </div>
            </div>

            <div className="text-left md:text-right bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-2xl">
              <p className="text-sm text-neutral-600 mb-1 uppercase tracking-wide font-semibold">Valor do Investimento</p>
              <p className="text-4xl font-bold text-hi-blue">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(displayProperty.price)}
              </p>
              {displayProperty.status !== 'Available' && (
                <div className="mt-3 inline-flex items-center gap-2 text-hi-dark-orange bg-hi-orange/10 px-4 py-2 rounded-lg">
                  <CheckCircle size={18} />
                  <span className="font-bold">Imóvel Vendido</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Título e Preço no Mobile (Card Flutuante que Sobrepõe a base do carrossel) */}
      <div className="md:hidden relative z-30 px-4 -mt-12 mb-8 max-w-lg mx-auto animate-fade-in-up">
        <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-neutral-100 flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-block px-3 py-1 text-[10px] font-bold tracking-widest text-[#d95d29] uppercase bg-[#d95d29]/10 rounded-full">
                {displayProperty.type === 'Sale' ? 'Para Venda' : 'Para Aluguel'}
              </span>
              {displayProperty.code && (
                <span className="inline-block px-3 py-1 text-[10px] font-bold tracking-widest text-neutral-600 uppercase bg-neutral-100 border border-neutral-200 rounded-full">
                  CÓD: {displayProperty.code}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-[#2C2C2C] leading-snug font-serif">
              {displayProperty.title}
            </h1>
            <div className="flex items-center text-neutral-500 gap-1.5 mt-2 text-sm italic">
              <MapPin size={14} className="text-hi-orange" />
              <span>{displayProperty.location || 'Localização sob Consulta'}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100">
            <p className="text-[10px] text-neutral-500 mb-1 uppercase tracking-widest font-bold">Investimento</p>
            <p className="text-3xl font-extrabold text-hi-blue tracking-tight">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(displayProperty.price)}
            </p>
            {displayProperty.status !== 'Available' && (
              <div className="mt-3 inline-flex items-center gap-1.5 text-hi-dark-orange">
                <CheckCircle size={16} />
                <span className="font-bold text-sm">Vendido</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-16 pt-2 md:pt-16 grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-16">
        {/* Main Content Info */}
        <div className="lg:col-span-2 space-y-12">

          {/* Amenities Mock Highlights */}
          <div className="grid grid-cols-3 gap-4 py-8 border-y border-neutral-200">
            <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-neutral-200 shadow-sm">
              <BedDouble size={32} className="text-hi-blue mb-3" />
              <span className="text-3xl font-semibold text-[#2C2C2C]">{displayProperty.bedrooms || '-'}</span>
              <span className="text-xs text-neutral-500 uppercase tracking-wider mt-1 font-bold">Quartos</span>
            </div>
            <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-neutral-200 shadow-sm">
              <Bath size={32} className="text-hi-blue mb-3" />
              <span className="text-3xl font-semibold text-[#2C2C2C]">{displayProperty.bathrooms || '-'}</span>
              <span className="text-xs text-neutral-500 uppercase tracking-wider mt-1 font-bold">Banheiros</span>
            </div>
            <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-neutral-200 shadow-sm">
              <Square size={32} className="text-hi-orange mb-3" />
              <span className="text-3xl font-semibold text-[#2C2C2C]">{displayProperty.area || '-'}</span>
              <span className="text-xs text-neutral-500 uppercase tracking-wider mt-1 font-bold">Metros²</span>
            </div>
          </div>

          <div className="prose prose-lg max-w-none text-neutral-700">
            <h2 className="text-3xl font-bold text-[#2C2C2C] mb-6 font-serif tracking-tight">Sobre a Propriedade</h2>
            <p className="leading-relaxed text-lg">
              {displayProperty.description}
            </p>
            {/* Extended mock description for layout effect */}
            <p className="leading-relaxed mt-4">
            </p>
          </div>

          {/* Video Player Section */}
          {displayProperty.video_url && (
            <div className="pt-8">
              <h2 className="text-2xl font-bold text-[#2C2C2C] mb-8 font-serif tracking-tight">Tour Virtual / Apresentação</h2>
              
              {displayProperty.video_url.includes("instagram.com") ? (
                <div className="flex justify-center w-full">
                  <iframe
                    className="rounded-2xl border border-neutral-200 shadow-xl bg-white"
                    src={(() => {
                       try {
                         const urlObj = new URL(displayProperty.video_url);
                         urlObj.search = '';
                         let base = urlObj.toString();
                         if (!base.endsWith('/')) base += '/';
                         return base + 'embed';
                       } catch { return displayProperty.video_url }
                    })()}
                    width="400"
                    height="480"
                    frameBorder="0"
                    scrolling="no"
                    allowTransparency={true}
                  />
                </div>
              ) : (
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-white border border-neutral-200 shadow-xl block relative">
                  {displayProperty.video_url.includes("youtube.com") || displayProperty.video_url.includes("youtu.be") ? (
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={displayProperty.video_url.replace("watch?v=", "embed/")}
                      title="Vídeo da Propriedade"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      controls
                      className="absolute inset-0 w-full h-full object-cover"
                      src={displayProperty.video_url}
                      poster={displayProperty.main_image_url}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Sticky / Contact */}
        <div className="lg:col-span-1">
          <ContactForm
            propertyTitle={displayProperty.title}
            propertyLocation={displayProperty.location}
            brokerName={displayProperty.broker_name}
            brokerWhatsapp={displayProperty.broker_whatsapp}
            propertyCode={displayProperty.code}
          />
        </div>
      </div>

      {/* Property Location Map */}
      {displayProperty.location && (
        <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 relative z-20">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-neutral-200">
            <h2 className="text-2xl font-bold text-[#2C2C2C] mb-6 flex items-center gap-3 font-serif tracking-tight">
              <MapPin className="text-hi-orange" size={24} />
              Localização do Imóvel
            </h2>
            <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-neutral-200 relative bg-neutral-100">
              <iframe
                title={`Mapa da localização de ${displayProperty.title}`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(displayProperty.location)}&t=m&z=15&output=embed&iwloc=near`}
              ></iframe>
            </div>
            <p className="text-neutral-500 text-sm mt-4 text-center">
              * A marcação no mapa é centrada na região/endereço informado pelo corretor.
            </p>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <WhatsAppButton
        propertyTitle={displayProperty.title}
        brokerWhatsapp={displayProperty.broker_whatsapp}
        propertyCode={displayProperty.code}
      />
    </main>
  );
}
