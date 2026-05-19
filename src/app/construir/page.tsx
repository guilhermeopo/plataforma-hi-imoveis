"use client";

import { useState } from "react";
import { Header } from "@/components/ui/Header";
import { ArrowRight, ArrowLeft, Home, Map, Hammer, Sofa, Waves, Trees } from "lucide-react";
import Image from "next/image";

type StepData = {
  terreno: string;
  estilo: string;
  quartos: string;
  lazer: string[];
};

export default function ConstruirPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<StepData>({
    terreno: "",
    estilo: "",
    quartos: "",
    lazer: [],
  });

  const nextStep = () => setStep((s) => Math.min(s + 1, 5));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const toggleLazer = (item: string) => {
    setData(prev => ({
      ...prev,
      lazer: prev.lazer.includes(item) 
        ? prev.lazer.filter(i => i !== item)
        : [...prev.lazer, item]
    }));
  };

  const handleFinish = () => {
    const text = `Olá, vim pelo "Construir do Meu Jeito"!%0A%0A*Briefing da Casa dos Meus Sonhos:*%0A- Terreno: ${data.terreno}%0A- Estilo Preferido: ${data.estilo}%0A- Quartos: ${data.quartos}%0A- Lazer & Essenciais: ${data.lazer.join(", ") || "Nenhum"}`;
    window.open(`https://wa.me/5568999014456?text=${text}`, '_blank');
  };

  return (
    <main className="min-h-screen bg-[#F1F1F1] pb-20">
      <Header />
      <div className="h-20 md:h-[90px] bg-white shadow-sm flex-shrink-0 w-full" />

      {/* Hero Section */}
      <section className="bg-neutral-900 text-white pt-24 pb-32 px-6 relative overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop" fill className="object-cover opacity-20" alt="Background" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="text-[#FFB800] font-bold tracking-widest uppercase text-sm mb-4 block">Construir do Meu Jeito</span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 tracking-tight">Sua assinatura, nosso concreto.</h1>
          <p className="text-lg md:text-2xl text-white/80 leading-relaxed font-light">
            Responda algumas perguntas rápidas e enviamos um projeto sob medida pra você.
          </p>
        </div>
      </section>

      {/* Gamified Form */}
      <section className="max-w-3xl mx-auto px-6 -mt-20 relative z-20">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-neutral-100">
          
          {/* Progress Bar */}
          <div className="flex gap-2 mb-12">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-[#FFB800]' : 'bg-neutral-100'}`} />
            ))}
          </div>

          {/* Steps */}
          <div className="min-h-[300px]">
            {step === 1 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-bold font-serif text-[#2C2C2C] mb-8">Antes de tudo, você já tem o terreno?</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <button 
                    onClick={() => { setData({...data, terreno: "Já possuo o terreno"}); nextStep(); }}
                    className={`p-6 border-2 rounded-2xl flex flex-col items-center gap-4 text-center transition-all ${data.terreno === "Já possuo o terreno" ? 'border-[#FFB800] bg-[#FFB800]/5' : 'border-neutral-200 hover:border-neutral-300'}`}
                  >
                    <Map size={48} className={data.terreno === "Já possuo o terreno" ? 'text-[#FFB800]' : 'text-neutral-400'} />
                    <span className="font-bold text-lg text-neutral-800">Sim, já tenho o terreno</span>
                  </button>
                  <button 
                    onClick={() => { setData({...data, terreno: "Preciso de um terreno"}); nextStep(); }}
                    className={`p-6 border-2 rounded-2xl flex flex-col items-center gap-4 text-center transition-all ${data.terreno === "Preciso de um terreno" ? 'border-[#FFB800] bg-[#FFB800]/5' : 'border-neutral-200 hover:border-neutral-300'}`}
                  >
                    <Home size={48} className={data.terreno === "Preciso de um terreno" ? 'text-[#FFB800]' : 'text-neutral-400'} />
                    <span className="font-bold text-lg text-neutral-800">Não, preciso encontrar um</span>
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-bold font-serif text-[#2C2C2C] mb-8">Qual estilo arquitetônico mais te agrada?</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {['Moderno / Reto', 'Clássico', 'Rústico / Madeira'].map(estilo => (
                    <button 
                      key={estilo}
                      onClick={() => { setData({...data, estilo}); nextStep(); }}
                      className={`p-6 border-2 rounded-2xl flex flex-col items-center justify-center gap-4 text-center transition-all h-40 ${data.estilo === estilo ? 'border-[#FFB800] bg-[#FFB800]/5' : 'border-neutral-200 hover:border-neutral-300'}`}
                    >
                      <Hammer size={32} className={data.estilo === estilo ? 'text-[#FFB800]' : 'text-neutral-400'} />
                      <span className="font-bold text-md text-neutral-800">{estilo}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-bold font-serif text-[#2C2C2C] mb-8">Quantos quartos são necessários?</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['2 Quartos', '3 Quartos', '4 Quartos', '5+ Quartos'].map(q => (
                    <button 
                      key={q}
                      onClick={() => { setData({...data, quartos: q}); nextStep(); }}
                      className={`py-4 border-2 rounded-2xl flex items-center justify-center font-bold transition-all ${data.quartos === q ? 'border-[#FFB800] bg-[#FFB800]/10 text-neutral-900' : 'border-neutral-200 text-neutral-500 hover:border-neutral-300'}`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-bold font-serif text-[#2C2C2C] mb-8">O que não pode faltar no seu projeto?</h2>
                <p className="text-neutral-500 mb-6 font-medium">Selecione quantas opções desejar.</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: 'Piscina', icon: <Waves size={24} /> },
                    { label: 'Área Gourmet', icon: <Sofa size={24} /> },
                    { label: 'Jardim Amplo', icon: <Trees size={24} /> },
                    { label: 'Escritório', icon: <Home size={24} /> },
                  ].map(Item => (
                    <button 
                      key={Item.label}
                      onClick={() => toggleLazer(Item.label)}
                      className={`p-4 border-2 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all ${data.lazer.includes(Item.label) ? 'border-[#FFB800] bg-[#FFB800]/5 text-[#FFB800]' : 'border-neutral-200 text-neutral-500 hover:border-neutral-300'}`}
                    >
                      {Item.icon}
                      <span className="font-bold text-sm text-neutral-800 text-center">{Item.label}</span>
                    </button>
                  ))}
                </div>
                <div className="flex justify-end mt-4">
                   <button 
                    onClick={handleFinish}
                    className="bg-[#2C2C2C] hover:bg-black text-white font-bold px-8 py-4 rounded-xl shadow-lg transition-transform hover:-translate-y-1 flex items-center group"
                  >
                    Gerar Orçamento no WhatsApp <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}

          </div>

          <div className="mt-8 pt-8 border-t border-neutral-100 flex justify-between items-center">
            {step > 1 ? (
              <button onClick={prevStep} className="flex items-center text-neutral-400 hover:text-neutral-800 font-semibold transition-colors">
                <ArrowLeft size={16} className="mr-2" /> Voltar
              </button>
            ) : <div />}
            <span className="text-sm font-bold text-neutral-300">Etapa {step} de 4</span>
          </div>

        </div>
      </section>
    </main>
  );
}
