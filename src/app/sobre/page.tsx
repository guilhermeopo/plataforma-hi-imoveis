import { Header } from "@/components/ui/Header";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { Map, PencilRuler, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function SobrePage() {
  return (
    <main className="min-h-screen bg-[#F1F1F1] pb-20">
      <Header />
      
      {/* Background Spacer para o Header absolute */}
      <div className="h-20 md:h-[90px] bg-white shadow-sm flex-shrink-0 w-full" />

      {/* Hero Section */}
      <section className="bg-[#d3a300] text-white py-24 px-6 mt-1 shadow-lg relative overflow-hidden">
         <div className="absolute inset-0 bg-[#d3a300]/10 skew-y-3 origin-bottom-left" />
         <div className="max-w-4xl mx-auto text-center relative z-10">
           <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 tracking-tight">Sobre a HI Imóveis</h1>
           <p className="text-lg md:text-2xl text-white/80 leading-relaxed font-light">
             Construindo mais do que imóveis.<br className="hidden md:block"/> Construindo decisões certas.
           </p>
         </div>
      </section>

      {/* A Nova Abordagem */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-12">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold font-serif text-[#2C2C2C] mb-6">Uma nova perspectiva</h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed text-lg font-light">
              <p>
                <strong className="font-semibold text-neutral-800">Comprar um imóvel não é só uma transação.</strong> É uma decisão que muda rotas, redefine planos e, muitas vezes, marca o início de um novo capítulo.
              </p>
              <p>
                A HI Imóveis nasceu exatamente com esse entendimento.
              </p>
              <p>
                Fundada por <strong>Haline Tonello</strong> e <strong>Ivan Marques</strong>, a empresa une experiência prática de mercado, visão estratégica e, principalmente, compromisso real com cada cliente. Aqui, não trabalhamos com &quot;vendas por impulso&quot;. Trabalhamos com escolhas bem orientadas.
              </p>
            </div>
          </div>
          <div className="aspect-square bg-neutral-200 rounded-3xl overflow-hidden shadow-2xl relative group">
             <div className="absolute inset-0 bg-[#2C2C2C]/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
             <Image 
               src="https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1400&auto=format&fit=crop" 
               width={800} height={800} 
               className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700" 
               alt="HI Imóveis Escritório" 
             />
          </div>
        </div>
      </section>

      {/* Imobiliária e Construtora */}
      <section className="py-20 px-6 bg-[#F1F1F1] relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-serif text-[#2C2C2C] mb-6 font-bold">Somos imobiliária e construtora.</h2>
            <p className="text-xl text-neutral-600 font-light leading-relaxed">
              Isso significa que acompanhamos você em <strong>toda a jornada</strong>: desde a escolha do terreno, passando pelo desenvolvimento do projeto, até a entrega do imóvel pronto. Sem atalhos, sem surpresas no meio do caminho.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-neutral-200 hover:shadow-xl transition-shadow duration-300">
              <div className="w-14 h-14 bg-[#2C2C2C] text-white rounded-xl flex items-center justify-center mb-6">
                <Map size={28} />
              </div>
              <h3 className="text-xl font-bold text-[#2C2C2C] mb-3">Escolha do Terreno</h3>
              <p className="text-neutral-500 font-light leading-relaxed">Mapeamos as melhores áreas e oportunidades, alinhando a busca com o seu objetivo de vida ou investimento.</p>
            </div>
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-neutral-200 hover:shadow-xl transition-shadow duration-300">
              <div className="w-14 h-14 bg-[#d3a300] text-white rounded-xl flex items-center justify-center mb-6">
                <PencilRuler size={28} />
              </div>
              <h3 className="text-xl font-bold text-[#2C2C2C] mb-3">Desenvolvimento</h3>
              <p className="text-neutral-500 font-light leading-relaxed">Tiramos o projeto do papel com especialistas em arquitetura e engenharia, sempre focados na excelência.</p>
            </div>
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-neutral-200 hover:shadow-xl transition-shadow duration-300">
              <div className="w-14 h-14 bg-[#FFB800] text-[#2C2C2C] rounded-xl flex items-center justify-center mb-6">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="text-xl font-bold text-[#2C2C2C] mb-3">Entrega Garantida</h3>
              <p className="text-neutral-500 font-light leading-relaxed">Acompanhamos a obra do início ao fim, para que você receba a chave do seu novo imóvel com total tranquilidade.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Nossa Postura */}
      <section className="bg-white py-24 border-y border-neutral-200">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <p className="text-xl md:text-2xl text-[#2C2C2C] leading-relaxed font-light">
            Nosso time é preparado para fazer mais do que apresentar opções. <strong className="text-[#2C2C2C] font-semibold">A gente escuta, analisa e direciona.</strong> Porque cada cliente tem uma realidade diferente, e tratar todo mundo igual é o jeito mais rápido de errar.
          </p>
          <p className="text-xl md:text-2xl text-[#2C2C2C] leading-relaxed font-light">
            Seja para morar ou investir, nosso papel é trazer clareza em um processo que costuma gerar dúvidas, insegurança e decisões precipitadas.
          </p>
          <div className="pt-10 w-fit mx-auto">
             <div className="h-1 w-20 bg-[#d3a300] mx-auto rounded-full mb-8"></div>
             <p className="text-2xl md:text-4xl font-serif text-[#2C2C2C] italic">
               &quot;Aqui, você não encontra apenas imóveis.<br className="hidden md:block"/> Você encontra orientação, transparência e um caminho mais seguro para chegar onde quer.&quot;
             </p>
          </div>
        </div>
      </section>

      <WhatsAppButton />
    </main>
  );
}
