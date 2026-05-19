"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Image from "next/image";

export function WhatsAppButton({
  propertyTitle,
  brokerWhatsapp,
  propertyCode
}: {
  propertyTitle?: string,
  brokerWhatsapp?: string | null,
  propertyCode?: string | null
}) {
  const message = propertyTitle
    ? `Olá! Gostaria de mais informações sobre o imóvel: ${propertyTitle}${propertyCode ? ` (CÓD: ${propertyCode})` : ''}`
    : "Olá! Gostaria de falar com um corretor sobre os imóveis.";

  const encodedMessage = encodeURIComponent(message);
  const targetNumber = brokerWhatsapp ? brokerWhatsapp.replace(/\D/g, '') : "556899299010";

  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenClosed, setHasBeenClosed] = useState(false);

  useEffect(() => {
    // Exibe após 3 segundos, se não foi fechado manualmente
    const showTimer = setTimeout(() => {
      if (!hasBeenClosed) setIsVisible(true);
    }, 3000);

    // Esconde após 13 segundos (3s delay + 10s visível)
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 13000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [hasBeenClosed]);

  return (
    <div className="fixed bottom-8 right-8 z-[9999] flex flex-col items-end gap-3 group">
      {/* Tooltip / Greeting Bubble */}
      {isVisible && (
        <div className="bg-white/95 backdrop-blur-md border border-white/50 px-5 py-3 rounded-2xl rounded-br-none shadow-[0_10px_40px_rgba(37,211,102,0.15)] mb-1 animate-fade-in-up relative transition-all duration-500">
          <button 
            onClick={() => { setIsVisible(false); setHasBeenClosed(true); }}
            className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md hover:bg-neutral-100 transition-colors border border-neutral-100"
            aria-label="Fechar"
          >
            <X size={12} className="text-neutral-500" />
          </button>
          <p className="text-[13px] font-bold text-neutral-800 leading-tight">
            Olá! 👋 <br/>
            <span className="text-neutral-500 font-medium">Como posso te ajudar?</span>
          </p>
        </div>
      )}

      <a
        href={`https://wa.me/${targetNumber}?text=${encodedMessage}`}
        target="_blank"
        rel="noreferrer"
        className="relative flex items-center gap-3 p-1.5 pr-6 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white rounded-full shadow-[0_15px_45px_rgba(37,211,102,0.4)] hover:shadow-[0_20px_50px_rgba(37,211,102,0.6)] transition-all duration-500 hover:-translate-y-2 group"
      >
        {/* Avatar / Icon Container */}
        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/30 shadow-inner flex-shrink-0">
          <div className="absolute inset-0 bg-black/10 animate-pulse" />
          <Image 
            src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop" 
            alt="Corretor" 
            width={48} 
            height={48} 
            className="object-cover"
          />
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Online Agora</span>
          <span className="text-sm font-black tracking-tight">{propertyTitle ? "Falar com Corretor" : "Atendimento HI"}</span>
        </div>

        <div className="absolute inset-0 w-full h-full rounded-full overflow-hidden pointer-events-none">
          <div className="w-1/2 h-full bg-white/20 skew-x-[-20deg] absolute -left-full group-hover:animate-shimmer transition-all" />
        </div>
      </a>
      
      <style jsx global>{`
        @keyframes shimmer {
          100% { left: 150%; }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
}
