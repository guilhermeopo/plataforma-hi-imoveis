import { Header } from "@/components/ui/Header";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ContactForm } from "@/components/ui/ContactForm";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContatoPage() {
  return (
    <main className="min-h-screen bg-[#F1F1F1] pb-20">
      <Header />

      <div className="h-20 md:h-[90px] bg-white shadow-sm flex-shrink-0 w-full" />

      {/* Hero Contato */}
      <section className="relative pt-40 pb-24 px-6 text-white overflow-hidden bg-[#191919]">
        {/* Grid pattern background */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "linear-gradient(rgba(255,184,0,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,184,0,0.4) 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }} />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#F1F1F1] to-transparent z-0" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 tracking-tight">Entre em Contato</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Nossa equipe de consultores especializados está pronta para ajudar você a encontrar o seu próximo imóvel ou investimento no Acre.
          </p>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="grid lg:grid-cols-2 gap-16">

          {/* Lado Esquerdo - Info Textual e Form */}
          <div className="space-y-12">
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-lg border border-neutral-200">
              <h2 className="text-2xl font-bold font-serif text-[#2C2C2C] mb-8"></h2>
              <ContactForm propertyTitle="" isGeneralContact={true} />
            </div>
          </div>

          {/* Lado Direito - Cards e Mapas */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-neutral-200">
              <h2 className="text-2xl font-bold font-serif text-[#2C2C2C] mb-6">Nossos Canais</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#2C2C2C]">Telefone / WhatsApp</h4>
                    <p className="text-neutral-500 text-sm mt-1">Atendimento Rápido</p>
                    <a href={`https://wa.me/556899299010?text=Olá!%20Vim%20pelo%20site%20da%20HI%20Imóveis%20e%20gostaria%20de%20falar%20com%20vocês.`} className="text-lg font-bold text-emerald-600 mt-1 block hover:underline">
                      (68) 9929-9010
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#FFB800]/10 text-[#FFB800] rounded-full flex items-center justify-center shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#2C2C2C]">E-mail</h4>
                    <p className="text-neutral-500 text-sm mt-1">Dúvidas, parcerias e propostas</p>
                    <a href="mailto:contato@hiimoveis.com.br" className="text-[#FFB800] font-medium mt-1 block hover:underline">
                      contato@hiimoveis.com.br
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-hi-blue/10 text-hi-blue rounded-full flex items-center justify-center shrink-0">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#2C2C2C]">Horário de Atendimento</h4>
                    <p className="text-neutral-500 text-sm mt-1">Segunda a Sexta: 08:00 às 18:00</p>
                    <p className="text-neutral-500 text-sm">Sábado: 08:00 às 12:00</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg border border-neutral-200">
              <h2 className="text-2xl font-bold font-serif text-[#2C2C2C] mb-6 flex items-center gap-2">
                <MapPin className="text-[#d3a300]" size={24} />
                Nosso Escritório
              </h2>
              <div className="w-full h-[250px] rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 relative mb-4">
                <iframe
                  title="Escritório HI Imóveis"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  src="https://maps.google.com/maps?q=Rua+Buriti,+343+-+Jardim+de+Alah,+Rio+Branco+-+Acre&t=m&z=15&output=embed&iwloc=near"
                ></iframe>
              </div>
              <p className="font-medium text-[#2C2C2C] leading-snug text-sm">
                Rua Buriti, 343 - Jardim de Alah<br />
                Sala 04, Rio Branco - Acre<br />
                <span className="text-neutral-500 font-normal">CEP: 69915-514</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <WhatsAppButton />
    </main>
  );
}
