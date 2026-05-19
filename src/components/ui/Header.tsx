"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-[#FFB800] shadow-md h-24 md:h-32 px-6 md:px-12 flex items-center justify-between" style={{ backgroundImage: "url('/fundo.png')", backgroundSize: 'cover' }}>
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/" className="relative w-48 sm:w-64 md:w-[400px] h-20 md:h-28 shrink-0">
            <Image 
              src="/logobranca.png" 
              alt="Logo HI Imóveis" 
              fill
              priority
              className="object-contain object-left scale-[2.5] md:scale-[3] origin-left pointer-events-none"
              style={{ filter: "drop-shadow(0px 0px 8px white)" }}
            />
          </Link>

          {/* Navigation & Actions Wrapper */}
          <div className="flex items-center gap-4 sm:gap-8 relative z-20 shrink-0">
            {/* Desktop Links */}
            <nav className="hidden lg:flex items-center gap-8 font-sans text-sm font-bold text-white">
              <Link href="/sobre" className="hover:text-neutral-200 transition-colors">Sobre nós</Link>
              <Link href="/#venda" className="hover:text-white transition-colors">Imóveis</Link>
              <Link href="/#empreendimentos" className="hover:text-white transition-colors">Empreendimentos</Link>
              <Link href="/contato" className="hover:text-white transition-colors">Contato</Link>
            </nav>

            {/* Desktop Action Button */}
            <div className="hidden lg:block">
              <Link href="/admin" className="px-5 py-2.5 border-2 border-white text-white hover:bg-white hover:text-neutral-900 rounded-lg font-bold text-sm transition-all shadow-sm">
                Acesso
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden text-white p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Abrir menu"
            >
              <Menu size={32} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col pt-6 pb-8 px-6 overflow-y-auto w-full h-screen animate-fade-in-up">
          <div className="flex items-center justify-between mb-16">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="w-[300px] flex items-center">
              <Image src="/logobranca.png" alt="Logo HI" width={300} height={100} style={{ filter: "drop-shadow(0px 0px 6px white) drop-shadow(0px 0px 10px white) drop-shadow(0px 0px 15px white)" }} className="w-full h-auto object-contain object-left scale-[2] origin-left pointer-events-none" />
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
             <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex justify-center text-sm font-bold text-neutral-600 border border-neutral-300 hover:border-[#d95d29] hover:text-[#d95d29] py-3 rounded-md transition-all shadow-sm">
                Acesso
             </Link>
          </div>
        </div>
      )}
    </>
  );
}
