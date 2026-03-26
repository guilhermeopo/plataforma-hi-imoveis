"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";

export function ContactForm({ 
  propertyTitle, 
  propertyLocation, 
  brokerName, 
  brokerWhatsapp 
}: { 
  propertyTitle: string;
  propertyLocation?: string;
  brokerName?: string | null;
  brokerWhatsapp?: string | null;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert("Por favor, preencha pelo menos seu Nome e Telefone/WhatsApp para que possamos iniciar o contato!");
      return;
    }

    const number = brokerWhatsapp || "5511999999999";
    const cleanNumber = number.replace(/\D/g, '');
    
    const text = `Olá${brokerName ? ' ' + brokerName : ''}! Meu nome é *${name}*.
    
Estou entrando em contato através do site pois tenho muito interesse no imóvel:
📍 *${propertyTitle}*
${propertyLocation ? `🗺️ Localizado em: ${propertyLocation}\n` : ''}
Gostaria de agendar uma visita ou receber mais detalhes.
Meu telefone de retorno é: ${phone}${email ? `\nMeu e-mail alternativo: ${email}` : ''}

Aguardando retorno, obrigado!`.replace(/    /g, '');

    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleQuickWhatsApp = () => {
    const number = brokerWhatsapp || "5511999999999";
    const cleanNumber = number.replace(/\D/g, '');
    const text = `Olá${brokerName ? ' ' + brokerName : ''}! Tenho interesse no imóvel: *${propertyTitle}*. Pode me ajudar?`;
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`, '_blank');
  }

  return (
    <div className="sticky top-8 bg-white border border-neutral-200 rounded-3xl p-8 shadow-xl">
      <h3 className="text-xl font-bold text-[#2C2C2C] mb-2 font-serif">Agende sua Visita</h3>
      <p className="text-neutral-500 text-sm mb-8 font-medium">
        {brokerName 
          ? `Fale diretamente com nosso corretor especialista, ${brokerName}.`
          : `Fale diretamente com nosso corretor especializado neste imóvel.`}
      </p>
      
      <form onSubmit={handleWhatsApp} className="space-y-4">
        <input 
          type="text" 
          required
          placeholder="Seu Nome completo" 
          className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3.5 text-neutral-800 focus:outline-none focus:border-hi-blue focus:ring-1 focus:ring-hi-blue transition-colors font-medium" 
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input 
          type="email" 
          placeholder="Seu melhor E-mail" 
          className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3.5 text-neutral-800 focus:outline-none focus:border-hi-blue focus:ring-1 focus:ring-hi-blue transition-colors font-medium" 
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input 
          type="tel" 
          required
          placeholder="Telefone / WhatsApp" 
          className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3.5 text-neutral-800 focus:outline-none focus:border-hi-blue focus:ring-1 focus:ring-hi-blue transition-colors font-medium" 
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
        <button 
          type="submit"
          className="w-full bg-hi-blue hover:bg-[#347Ab7] text-white font-bold py-4 rounded-xl transition-all shadow-md mt-4 flex items-center justify-center gap-2"
        >
          <MessageCircle size={20} />
          Solicitar Contato Privado
        </button>
      </form>

      <div className="mt-8 pt-8 border-t border-neutral-200 text-center">
        <p className="text-sm text-neutral-500 mb-4 font-medium">Ou prefere falar agora mesmo?</p>
        <button 
          onClick={handleQuickWhatsApp}
          className="flex items-center justify-center gap-3 w-full bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] font-bold py-4 rounded-xl transition-colors border border-[#25D366]/20"
        >
          Chamar Corretor no WhatsApp
        </button>
      </div>
    </div>
  );
}
