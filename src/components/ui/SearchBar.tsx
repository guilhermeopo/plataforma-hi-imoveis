"use client";

import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export function SearchBar({ 
  neighborhoods = [], 
  propertyTypes = []
}: { 
  neighborhoods?: string[], 
  propertyTypes?: string[]
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [intent, setIntent] = useState(searchParams.get("intent") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [code, setCode] = useState(searchParams.get("code") || "");
  const [searchMode, setSearchMode] = useState<"avancada" | "codigo">("avancada");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();

    if (searchMode === "codigo") {
      if (code.trim()) params.append("code", code.trim());
    } else {
      if (intent === "construir") {
        router.push("/construir");
        return;
      }

      if (intent === "projetos") {
        if (type) params.append("style", type);
        if (minPrice) params.append("minArea", minPrice);
        if (maxPrice) params.append("maxArea", maxPrice);
        router.push(`/projetos-prontos?${params.toString()}`);
        return;
      }

      if (intent === "venda") {
        if (location) params.append("neighborhood", location);
        if (type) params.append("type", type);
        if (minPrice) params.append("minPrice", minPrice);
        if (maxPrice) params.append("maxPrice", maxPrice);
        router.push(`/imoveis?${params.toString()}`);
        return;
      }

      if (intent === "empreendimento") {
        if (location) params.append("neighborhood", location);
        if (minPrice) params.append("minPrice", minPrice);
        if (maxPrice) params.append("maxPrice", maxPrice);
        router.push(`/empreendimentos?${params.toString()}`);
        return;
      }

      if (intent) params.append("intent", intent);
      if (location) params.append("location", location);
      if (type) params.append("type", type);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
    }

    if (params.toString()) {
      router.push(`/?${params.toString()}`);
    } else {
      router.push(`/`);
    }
  }

  if (searchMode === "codigo") {
    return (
      <form onSubmit={handleSearch} className="mt-8 max-w-sm w-full mx-auto border border-white p-6 rounded-lg shadow-xl flex flex-col gap-4 text-left" style={{ backgroundImage: "url('/fundo.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
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
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
            />
          </div>
        </div>
        <button type="submit" className="w-full text-black py-3 rounded-sm font-bold transition-opacity hover:opacity-90 mt-2 text-[15px] shadow-sm" style={{ backgroundImage: "url('/fundobotao.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
          BUSCAR CÓDIGO
        </button>
        <div className="flex justify-center items-center mt-2 text-neutral-700 text-sm gap-2">
          <button type="button" onClick={() => setSearchMode("avancada")} className="hover:underline font-medium text-neutral-500">
            Voltar para Busca Avançada
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSearch} className="mt-8 max-w-sm w-full mx-auto border border-white p-6 rounded-lg shadow-xl flex flex-col gap-4 text-left" style={{ backgroundImage: "url('/fundo.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="relative">
        <select 
          className="appearance-none w-full border border-neutral-200 text-neutral-500 py-3 px-4 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#FFB800] focus:border-[#FFB800] bg-white font-medium text-sm cursor-pointer"
          value={intent}
          onChange={(e) => setIntent(e.target.value)}
        >
          <option value="">O que deseja?</option>
          <option value="venda">Imóveis à Venda</option>
          <option value="empreendimento">Empreendimentos</option>
          <option value="projetos">Projetos Disponíveis</option>
          <option value="construir">Construir do Meu Jeito</option>
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={16} />
      </div>

      <div className="relative">
        <select 
          className="appearance-none w-full border border-neutral-200 text-neutral-500 py-3 px-4 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#FFB800] focus:border-[#FFB800] bg-white font-medium text-sm cursor-pointer"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="">Todos os Bairros</option>
          {neighborhoods.map(n => <option key={`n-${n}`} value={n}>{n}</option>)}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={16} />
      </div>

      <div className="relative">
        <select 
          className="appearance-none w-full border border-neutral-200 text-neutral-500 py-3 px-4 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#FFB800] focus:border-[#FFB800] bg-white font-medium text-sm cursor-pointer"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">Todos os Tipos</option>
          {propertyTypes.map(t => <option key={`t-${t}`} value={t}>{t}</option>)}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={16} />
      </div>



      <div className="flex flex-row gap-2">
        <div className="relative flex-1">
          <input 
            type="number"
            placeholder={intent === "projetos" ? "Área mín. (m²)" : "Valor mín. (R$)"}
            className="w-full border border-neutral-200 text-neutral-800 py-3 px-3 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#FFB800] focus:border-[#FFB800] bg-white font-medium text-sm placeholder-neutral-500"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>
        <div className="relative flex-1">
          <input 
            type="number"
            placeholder={intent === "projetos" ? "Área máx. (m²)" : "Valor máx. (R$)"}
            className="w-full border border-neutral-200 text-neutral-800 py-3 px-3 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#FFB800] focus:border-[#FFB800] bg-white font-medium text-sm placeholder-neutral-500"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>



      <button type="submit" className="text-black py-3 rounded-sm font-bold transition-opacity hover:opacity-90 mt-2 text-[15px] shadow-sm" style={{ backgroundImage: "url('/fundobotao.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
        BUSCAR
      </button>

      <div className="flex justify-center items-center mt-2 text-neutral-700 text-sm gap-2">
        <Search size={16} />
        <button type="button" onClick={() => setSearchMode("codigo")} className="hover:underline font-medium">Buscar por código</button>
      </div>
    </form>
  );
}
