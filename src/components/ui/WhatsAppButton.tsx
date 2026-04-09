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
    ? `Olá! Gostaria de mais informações sobre o imóvel: ${propertyTitle}`
    : "Olá! Gostaria de falar com um corretor sobre os imóveis.";

  const encodedMessage = encodeURIComponent(message);
  const targetNumber = brokerWhatsapp ? brokerWhatsapp.replace(/\D/g, '') : "5568999299010";

  return (
    <a
      href={`https://wa.me/${targetNumber}?text=${encodedMessage}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-[60px] h-[60px] bg-[#00E676] hover:bg-[#00C853] text-white rounded-full shadow-lg hover:scale-105 transition-transform duration-300 ring-2 ring-white"
      aria-label="Falar no WhatsApp"
      title="Falar no WhatsApp"
    >
      <MessageCircle size={36} fill="white" className="text-white relative z-10" />
      <span className="absolute top-0 right-0 translate-x-1 -translate-y-1 bg-red-600 text-white text-[11px] font-bold w-[22px] h-[22px] flex items-center justify-center rounded-full border-2 border-white z-20">
        1
      </span>
    </a>
  );
}
