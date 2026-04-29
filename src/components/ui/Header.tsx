"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="absolute top-0 inset-x-0 z-50 shadow-md h-20 md:h-[90px] px-4 md:px-8 flex items-center justify-between" style={{ backgroundImage: "url('/fundo.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
        {/* Logo */}
        <Link href="/" className="w-48 sm:w-60 md:w-72 h-full flex items-center justify-start py-2.5">
          <img src="/logo.png" alt="Logo HI Imóveis" style={{ filter: "drop-shadow(0px 0px 6px white) drop-shadow(0px 0px 10px white) drop-shadow(0px 0px 15px white)" }} className="w-[110%] max-w-[110%] h-auto md:h-full object-contain object-left md:scale-[1.10] origin-left" />
        </Link>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-6 font-sans text-sm font-semibold text-neutral-800">
          <Link href="/sobre" className="hover:text-[#d95d29] transition-colors">Sobre nós</Link>
          <Link href="/#venda" className="hover:text-[#d95d29] transition-colors">Imóveis</Link>
          <Link href="/#empreendimentos" className="hover:text-[#d95d29] transition-colors">Empreendimentos</Link>
          <Link href="/contato" className="hover:text-[#d95d29] transition-colors">Contato</Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <Link href="/contato" className="text-sm font-bold text-white bg-[#FFB800] hover:bg-[#E5A500] px-6 py-2.5 rounded-sm transition-colors shadow-sm">
            Anuncie Aqui
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="lg:hidden flex items-center">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-[#FFB800] p-2 hover:bg-neutral-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFB800]"
          >
            <Menu size={32} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col pt-6 pb-8 px-6 overflow-y-auto w-full h-screen animate-fade-in-up">
          <div className="flex items-center justify-between mb-16">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="w-44">
              <img src="/logo.png" alt="Logo HI" style={{ filter: "drop-shadow(0px 0px 6px white) drop-shadow(0px 0px 10px white) drop-shadow(0px 0px 15px white)" }} className="w-full h-auto object-contain object-left" />
            </Link>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-[#FFB800] p-2 hover:bg-neutral-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFB800]"
            >
               <X size={36} />
            </button>
          </div>
          
          <nav className="flex flex-col gap-8 text-3xl font-serif font-bold text-[#2C2C2C] mb-12 flex-1 items-stretch justify-start">
            <Link href="/sobre" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#d95d29] transition-colors border-b border-neutral-100 pb-4">Sobre nós</Link>
            <Link href="/#venda" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#d95d29] transition-colors border-b border-neutral-100 pb-4">Imóveis</Link>
            <Link href="/#empreendimentos" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#d95d29] transition-colors border-b border-neutral-100 pb-4">Empreendimentos</Link>
            <Link href="/contato" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#d95d29] transition-colors border-b border-neutral-100 pb-4">Contato</Link>
          </nav>
          
          <div className="mt-auto pt-8">
             <Link href="/contato" onClick={() => setIsMobileMenuOpen(false)} className="w-full block text-center text-xl font-bold text-white bg-[#FFB800] hover:bg-[#E5A500] py-4 rounded-sm transition-colors shadow-md">
                Anuncie Aqui
             </Link>
          </div>
        </div>
      )}
    </>
  );
}
