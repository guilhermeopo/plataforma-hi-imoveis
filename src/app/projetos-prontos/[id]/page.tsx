import { supabase } from "@/lib/supabase";
import { Header } from "@/components/ui/Header";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AreaChart, BedDouble, Star, Bath, Car, ArrowLeft, Ruler } from "lucide-react";
import { GalleryLightbox } from "@/components/ui/GalleryLightbox";

export const revalidate = 0;

const styleColors: Record<string, string> = {
  "Moderno": "bg-sky-100 text-sky-700",
  "Clássico": "bg-amber-100 text-amber-700",
  "Rústico": "bg-orange-100 text-orange-700",
  "Contemporâneo": "bg-violet-100 text-violet-700",
  "Minimalista": "bg-neutral-100 text-neutral-600",
};

export default async function PlanDetailPage({ params }: { params: { id: string } }) {
  const { data: plan, error } = await supabase
    .from("architectural_plans")
    .select("*")
    .eq("id", params.id)
    .single();

  let captador = null;
  if (plan?.captador_id) {
    const { data: captadorData } = await supabase
      .from("team_members")
      .select("*")
      .eq("id", plan.captador_id)
      .single();
    captador = captadorData;
  }

  if (error || !plan) {
    notFound();
  }

  const styleClass = styleColors[plan.style] || "bg-neutral-100 text-neutral-600";
  const whatsappNumber = plan.broker_whatsapp || "5568999299010";
  const whatsappMessage = encodeURIComponent(
    `Olá! Tenho interesse no projeto arquitetônico "${plan.title}" (${plan.area_m2}m², ${plan.bedrooms} quartos, estilo ${plan.style}). Gostaria de mais informações.`
  );

  const galleryImages: string[] = plan.gallery_urls || [];
  const floorPlans: string[] = plan.floor_plan_urls || [];

  return (
    <main className="min-h-screen bg-[#F1F1F1]">
      <Header />

      {/* Hero Image */}
      <section className="relative w-full h-[55vh] md:h-[70vh] overflow-hidden bg-neutral-900">
        <Image
          src={plan.main_image_url}
          alt={plan.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Back button */}
        <div className="absolute top-28 md:top-36 left-6 md:left-12 z-10">
          <Link href="/projetos-prontos" className="flex items-center gap-2 text-white/80 hover:text-white bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold transition-colors">
            <ArrowLeft size={16} /> Todos os Projetos
          </Link>
        </div>

        {/* Hero Info overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-6 md:p-12 max-w-7xl mx-auto">
          <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full mb-3 ${styleClass}`}>
            {plan.style}
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4 leading-tight">
            {plan.title}
          </h1>

          {/* Key stats */}
          <div className="flex flex-wrap gap-3">
            <span className="flex items-center gap-1.5 text-white text-sm font-semibold bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <AreaChart size={15} /> {plan.area_m2} m²
            </span>
            <span className="flex items-center gap-1.5 text-white text-sm font-semibold bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <BedDouble size={15} /> {plan.bedrooms} quartos
            </span>
            {(plan.suites || 0) > 0 && (
              <span className="flex items-center gap-1.5 text-white text-sm font-semibold bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Star size={15} /> {plan.suites} suíte{plan.suites > 1 ? "s" : ""}
              </span>
            )}
            {(plan.bathrooms || 0) > 0 && (
              <span className="flex items-center gap-1.5 text-white text-sm font-semibold bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Bath size={15} /> {plan.bathrooms} banheiro{plan.bathrooms > 1 ? "s" : ""}
              </span>
            )}
            {(plan.garage || 0) > 0 && (
              <span className="flex items-center gap-1.5 text-white text-sm font-semibold bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Car size={15} /> {plan.garage} vaga{plan.garage > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left — Description + Gallery + Floor Plans */}
        <div className="lg:col-span-2 space-y-10">
          {/* Description */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-neutral-800 mb-4 flex items-center gap-2">
              <Ruler size={20} className="text-[#FFB800]" /> Sobre o Projeto
            </h2>
            <p className="text-neutral-600 leading-relaxed text-base whitespace-pre-line">
              {plan.description}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-neutral-100">
              <div className="text-center p-4 bg-neutral-50 rounded-xl">
                <p className="text-2xl font-black text-[#FFB800]">{plan.area_m2}</p>
                <p className="text-xs text-neutral-500 font-medium mt-1 uppercase tracking-wider">m² de área</p>
              </div>
              <div className="text-center p-4 bg-neutral-50 rounded-xl">
                <p className="text-2xl font-black text-neutral-800">{plan.bedrooms}</p>
                <p className="text-xs text-neutral-500 font-medium mt-1 uppercase tracking-wider">Quartos</p>
              </div>
              <div className="text-center p-4 bg-neutral-50 rounded-xl">
                <p className="text-2xl font-black text-neutral-800">{plan.suites || 0}</p>
                <p className="text-xs text-neutral-500 font-medium mt-1 uppercase tracking-wider">Suítes</p>
              </div>
              <div className="text-center p-4 bg-neutral-50 rounded-xl">
                <p className="text-2xl font-black text-neutral-800">{plan.garage || 0}</p>
                <p className="text-xs text-neutral-500 font-medium mt-1 uppercase tracking-wider">Vagas</p>
              </div>
            </div>
          </div>

          {/* Renders Gallery */}
          {galleryImages.length > 0 && (
            <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-neutral-800 mb-6 font-serif tracking-tight">Renders e Visualizações</h2>
              <GalleryLightbox images={galleryImages} />
            </div>
          )}

          {/* Floor Plans */}
          {floorPlans.length > 0 && (
            <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-neutral-800 mb-2 font-serif tracking-tight">📐 Plantas Baixas</h2>
              <p className="text-sm text-neutral-500 mb-6">Visualize os ambientes e a distribuição dos espaços.</p>
              <GalleryLightbox images={floorPlans} />
            </div>
          )}

          {/* Video */}
          {plan.video_url && (
            <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-neutral-800 mb-4 flex items-center gap-2">
                {plan.video_url.includes("instagram.com") ? "📱 Reel do Projeto" : "🎬 Tour Virtual"}
              </h2>
              <div className="aspect-[9/16] max-w-[400px] mx-auto md:aspect-video md:max-w-none rounded-xl overflow-hidden bg-neutral-900 border border-neutral-200">
                <iframe
                  src={
                    plan.video_url.includes("instagram.com")
                      ? `${plan.video_url.split('?')[0].replace(/\/$/, '')}/embed/`
                      : plan.video_url.replace("watch?v=", "embed/").replace("youtu.be/", "www.youtube.com/embed/")
                  }
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            </div>
          )}

        </div>

        {/* Right — Pricing & CTA */}
        <div className="space-y-6">
          {/* Price Card */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm sticky top-36">
            <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest mb-1">Valor do Projeto</p>
            <p className="text-4xl font-black text-[#FFB800] mb-2">
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 }).format(plan.price)}
            </p>
            <p className="text-xs text-neutral-400 mb-8">Inclui todas as pranchas e arquivos necessários para a construção.</p>

            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-3 bg-[#25D366] text-white font-bold py-4 rounded-xl hover:bg-[#1dad57] transition-all hover:-translate-y-0.5 shadow-lg shadow-green-500/20 mb-3"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.004.496 3.894 1.373 5.549L0 24l6.63-1.35A11.933 11.933 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.49-5.18-1.348l-.371-.22-3.839.783.835-3.735-.242-.387A9.958 9.958 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
              Quero Este Projeto
            </a>

            <Link
              href="/construir"
              className="w-full flex items-center justify-center gap-2 border-2 border-neutral-200 text-neutral-700 font-bold py-3.5 rounded-xl hover:border-[#FFB800] hover:text-[#FFB800] transition-colors text-sm"
            >
              Construir do Meu Jeito
            </Link>

            {plan.broker_name && (
              <div className="mt-6 pt-6 border-t border-neutral-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FFB800] flex items-center justify-center text-black font-black text-sm shrink-0">
                  {plan.broker_name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs text-neutral-400">Responsável</p>
                  <p className="font-bold text-neutral-800 text-sm">{plan.broker_name}</p>
                </div>
              </div>
            )}
          </div>

          {/* Back Link */}
          <Link href="/projetos-prontos" className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-800 transition-colors font-medium">
            <ArrowLeft size={14} /> Ver todos os projetos
          </Link>

          {/* Captador Section - Premium Minimalist */}
          {captador && (
            <div className="mt-12 pt-10 border-t border-neutral-100">
              <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-5 border border-neutral-200/60 shadow-sm flex items-center gap-5 group hover:border-amber-200/50 transition-all duration-500">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md flex-shrink-0">
                  <Image 
                    src={captador.image_url} 
                    alt={captador.name} 
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-10 transition-opacity" />
                </div>
                <div>
                  <span className="inline-block px-2 py-0.5 rounded-full bg-neutral-100 text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1.5 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">Captação Especializada</span>
                  <h3 className="text-sm font-black text-[#2C2C2C] leading-none">{captador.name}</h3>
                </div>
              </div>
              <p className="text-[9px] text-neutral-300 text-center mt-4 uppercase tracking-[0.3em] font-medium">Curadoria HI Imóveis</p>
            </div>
          )}
        </div>
      </section>

      <WhatsAppButton propertyTitle={plan.title} brokerWhatsapp={plan.broker_whatsapp} />
    </main>
  );
}
