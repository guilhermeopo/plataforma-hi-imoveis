"use client";

import { MessageCircle } from "lucide-react";

export function WhatsAppButton({ 
  propertyTitle,
  brokerWhatsapp
}: { 
  propertyTitle?: string,
  brokerWhatsapp?: string | null
}) {
  const message = propertyTitle 
    ? `Olá! Gostaria de mais informações sobre o imóvel de luxo: ${propertyTitle}` 
    : "Olá! Gostaria de falar com um corretor sobre os imóveis de luxo.";
    
  const encodedMessage = encodeURIComponent(message);
  const targetNumber = brokerWhatsapp ? brokerWhatsapp.replace(/\D/g, '') : "5511999999999";
  
  return (
    <a
      href={`https://wa.me/${targetNumber}?text=${encodedMessage}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-16 h-16 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-[0_0_25px_rgba(37,211,102,0.4)] hover:shadow-[0_0_35px_rgba(37,211,102,0.7)] hover:scale-110 transition-all duration-300 ring-4 ring-black/20"
      aria-label="Falar no WhatsApp"
      title="Falar no WhatsApp"
    >
      <MessageCircle size={32} />
    </a>
  );
}
