"use client";

import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [term, setTerm] = useState(searchParams.get("q") || "");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (term.trim()) {
      router.push(`/?q=${encodeURIComponent(term.trim())}`);
    } else {
      router.push(`/`);
    }
  }

  return (
    <form onSubmit={handleSearch} className="mt-8 max-w-sm w-full mx-auto bg-white border border-black p-6 rounded-lg shadow-xl flex flex-col gap-4 text-left">
      <div className="relative">
        <select 
          className="appearance-none w-full border border-neutral-200 text-neutral-500 py-3 px-4 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#FFB800] focus:border-[#FFB800] bg-white font-medium text-sm cursor-pointer"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        >
          <option value="">O que deseja?</option>
          <option value="venda">Comprar</option>
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={16} />
      </div>

      <div className="relative">
        <select className="appearance-none w-full border border-neutral-200 text-neutral-500 py-3 px-4 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#FFB800] focus:border-[#FFB800] bg-white font-medium text-sm cursor-pointer">
          <option value="">Bairro</option>
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={16} />
      </div>

      <div className="relative">
        <select className="appearance-none w-full border border-neutral-200 text-neutral-500 py-3 px-4 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#FFB800] focus:border-[#FFB800] bg-white font-medium text-sm cursor-pointer">
          <option value="">Tipos de imóvel</option>
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={16} />
      </div>

      <div className="flex flex-row gap-2">
        <div className="relative flex-1">
          <input 
            type="number"
            placeholder="Valor mín. (R$)"
            className="w-full border border-neutral-200 text-neutral-800 py-3 px-3 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#FFB800] focus:border-[#FFB800] bg-white font-medium text-sm placeholder-neutral-500"
          />
        </div>
        <div className="relative flex-1">
          <input 
            type="number"
            placeholder="Valor máx. (R$)"
            className="w-full border border-neutral-200 text-neutral-800 py-3 px-3 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#FFB800] focus:border-[#FFB800] bg-white font-medium text-sm placeholder-neutral-500"
          />
        </div>
      </div>

      <div className="relative">
        <select className="appearance-none w-full border border-neutral-200 text-neutral-500 py-3 px-4 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#FFB800] focus:border-[#FFB800] bg-white font-medium text-sm cursor-pointer">
          <option value="">Empreendimento</option>
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={16} />
      </div>

      <button type="submit" className="bg-[#d95d29] hover:bg-[#b04a1f] text-white py-3 rounded-sm font-bold transition-colors mt-2 text-[15px] shadow-sm">
        BUSCAR
      </button>

      <div className="flex justify-center items-center mt-2 text-neutral-700 text-sm gap-2">
        <Search size={16} />
        <a href="#" className="hover:underline font-medium">Buscar por código</a>
      </div>
    </form>
  );
}
