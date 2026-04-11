import { Header } from "@/components/ui/Header";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { Building2, Award, Target, Users } from "lucide-react";

export default function SobrePage() {
  return (
    <main className="min-h-screen bg-[#F1F1F1] pb-20">
      <Header />
      
      {/* Background Spacer para o Header absolute */}
      <div className="h-20 md:h-[90px] bg-white shadow-sm flex-shrink-0 w-full" />

      {/* Título da Página */}
      <section className="bg-[#2C2C2C] text-white py-20 px-6 mt-1 shadow-lg relative overflow-hidden">
         <div className="absolute inset-0 bg-[#d95d29]/10 skew-y-3 origin-bottom-left" />
         <div className="max-w-4xl mx-auto text-center relative z-10">
           <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 tracking-tight">Sobre a HI Imóveis</h1>
           <p className="text-lg md:text-xl text-white/80 leading-relaxed font-medium">
             Desenhando novas histórias e entregando resultados no mercado imobiliário do Acre.
           </p>
         </div>
      </section>

      {/* Conteúdo Institucional */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold font-serif text-[#2C2C2C] mb-4">A nossa história</h2>
            <p className="text-neutral-600 leading-relaxed">
              Fundada com o objetivo de inovar e garantir segurança jurídica e operacional no mercado imobiliário de Rio Branco, a <strong>HI Imóveis</strong> é muito mais do que uma imobiliária: somos consultores especializados na realização de sonhos e na concretização de investimentos sólidos.
            </p>
            <p className="text-neutral-600 leading-relaxed">
              Nossa carteira vai desde apartamentos para locação rápida até grandes áreas, loteamentos e o comércio de empreendimentos de alto padrão (lançamentos e na planta).
            </p>
          </div>
          <div className="aspect-square bg-neutral-200 rounded-3xl overflow-hidden shadow-xl border-4 border-white/50 relative">
             <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1400&auto=format&fit=crop" className="object-cover w-full h-full" alt="HI Imóveis Escritório" />
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="bg-white py-20 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold font-serif text-[#2C2C2C] mb-16">Nossos Pilares</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="flex flex-col items-center">
               <div className="w-16 h-16 bg-[#FFB800]/10 text-[#FFB800] rounded-full flex items-center justify-center mb-6">
                 <Award size={32} />
               </div>
               <h3 className="font-bold text-xl text-[#2C2C2C] mb-3">Excelência</h3>
               <p className="text-neutral-500 text-sm">Atendimento de alto nível do primeiro contato à entrega das chaves.</p>
            </div>
            <div className="flex flex-col items-center">
               <div className="w-16 h-16 bg-[#d95d29]/10 text-[#d95d29] rounded-full flex items-center justify-center mb-6">
                 <Target size={32} />
               </div>
               <h3 className="font-bold text-xl text-[#2C2C2C] mb-3">Foco no Cliente</h3>
               <p className="text-neutral-500 text-sm">Entendemos suas necessidades antes de oferecer soluções.</p>
            </div>
            <div className="flex flex-col items-center">
               <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-6">
                 <Users size={32} />
               </div>
               <h3 className="font-bold text-xl text-[#2C2C2C] mb-3">Transparência</h3>
               <p className="text-neutral-500 text-sm">Negociações abertas, éticas e juridicamente seguras.</p>
            </div>
            <div className="flex flex-col items-center">
               <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                 <Building2 size={32} />
               </div>
               <h3 className="font-bold text-xl text-[#2C2C2C] mb-3">Evolução</h3>
               <p className="text-neutral-500 text-sm">Sempre de olho nos lançamentos e novas tendências arquitetônicas.</p>
            </div>
          </div>
        </div>
      </section>

      <WhatsAppButton />
    </main>
  );
}
