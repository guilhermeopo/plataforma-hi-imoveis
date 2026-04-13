"use client";

import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [desejo, setDesejo] = useState(searchParams.get("tipo") || "");
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [searchMode, setSearchMode] = useState<"avancada" | "codigo">("avancada");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (desejo) params.set("tipo", desejo);
    if (query.trim()) params.set("q", query.trim());
    const qs = params.toString();
    router.push(qs ? `/?${qs}` : "/");
  }

  function handleCodeSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) router.push(`/?q=${encodeURIComponent(query.trim())}`);
    else router.push("/");
  }

  if (searchMode === "codigo") {
    return (
      <form onSubmit={handleCodeSearch} className="mt-8 max-w-sm w-full mx-auto bg-white border border-black p-6 rounded-lg shadow-xl flex flex-col gap-4 text-left">
        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2">Digite o Código do Imóvel</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-neutral-400" />
            </div>
            <input
              type="text"
              placeholder="Ex: REF-1020"
              className="w-full border border-neutral-200 text-neutral-800 py-3 pl-10 pr-3 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#FFB800] focus:border-[#FFB800] uppercase"
              value={query}
              onChange={(e) => setQuery(e.target.value.toUpperCase())}
            />
          </div>
        </div>
        <button type="submit" className="w-full bg-[#FFB800] hover:bg-[#E5A500] text-white py-3 rounded-sm font-bold transition-colors mt-2 text-[15px] shadow-sm">
          BUSCAR CÓDIGO
        </button>
        <div className="flex justify-center items-center mt-2 text-sm gap-2">
          <button type="button" onClick={() => setSearchMode("avancada")} className="hover:underline font-medium text-neutral-500">
            Voltar para Busca Avançada
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSearch} className="mt-8 max-w-sm w-full mx-auto bg-white border border-black p-6 rounded-lg shadow-xl flex flex-col gap-4 text-left">
      {/* O que deseja? */}
      <div className="relative">
        <select
          className="appearance-none w-full border border-neutral-200 text-neutral-500 py-3 px-4 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#FFB800] focus:border-[#FFB800] bg-white font-medium text-sm cursor-pointer"
          value={desejo}
          onChange={(e) => setDesejo(e.target.value)}
        >
          <option value="">O que deseja?</option>
          <option value="imoveis">Imóveis à Venda</option>
          <option value="empreendimentos">Empreendimentos</option>
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={16} />
      </div>

      {/* Campo de texto opcional */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={16} className="text-neutral-400" />
        </div>
        <input
          type="text"
          placeholder="Busca por título, código ou bairro..."
          className="w-full border border-neutral-200 text-neutral-800 py-3 pl-10 pr-3 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#FFB800] focus:border-[#FFB800] bg-white font-medium text-sm placeholder-neutral-400"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <button type="submit" className="bg-[#FFB800] hover:bg-[#E5A500] text-white py-3 rounded-sm font-bold transition-colors mt-2 text-[15px] shadow-sm">
        BUSCAR
      </button>

      <div className="flex justify-center items-center mt-2 text-neutral-700 text-sm gap-2">
        <Search size={16} />
        <button type="button" onClick={() => setSearchMode("codigo")} className="hover:underline font-medium">Buscar por código</button>
      </div>
    </form>
  );
}
