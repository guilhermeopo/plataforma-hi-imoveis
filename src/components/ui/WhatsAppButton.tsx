"use client";

import { useState, useEffect } from "react";
import { X, MessageCircle } from "lucide-react";

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
  const targetNumber = brokerWhatsapp ? brokerWhatsapp.replace(/\D/g, '') : "5568999299010";

  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenClosed, setHasBeenClosed] = useState(false);

  useEffect(() => {
    if (hasBeenClosed) return;
    const showTimer = setTimeout(() => setIsVisible(true), 4000);
    const hideTimer = setTimeout(() => setIsVisible(false), 24000);
    return () => { clearTimeout(showTimer); clearTimeout(hideTimer); };
  }, [hasBeenClosed]);

  if (hasBeenClosed) return null;

  return (
    <div 
      className={`fixed bottom-8 right-8 z-[9999] flex flex-col items-end gap-3 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onMouseEnter={() => setIsVisible(true)}
    >
      <div className="bg-white/95 backdrop-blur-md border border-neutral-200 px-5 py-3 rounded-2xl rounded-br-none shadow-xl mb-1 relative">
        <button 
          onClick={(e) => { e.preventDefault(); setIsVisible(false); setHasBeenClosed(true); }}
          className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md border border-neutral-100 text-neutral-500 hover:bg-neutral-50"
        >
          <X size={12} />
        </button>
        <p className="text-[13px] font-bold text-neutral-800 leading-tight">
          Olá! 👋 <br/>
          <span className="text-neutral-500 font-medium font-sans">Como posso te ajudar?</span>
        </p>
      </div>

      <a
        href={`https://wa.me/${targetNumber}?text=${encodedMessage}`}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-3 p-4 bg-[#25D366] text-white rounded-full shadow-[0_10px_40px_rgba(37,211,102,0.4)] hover:scale-105 transition-transform"
      >
        <MessageCircle size={28} fill="white" />
        <span className="font-bold text-sm pr-2">
          {propertyTitle ? "Falar com Corretor" : "Atendimento HI"}
        </span>
      </a>
    </div>
  );
}
