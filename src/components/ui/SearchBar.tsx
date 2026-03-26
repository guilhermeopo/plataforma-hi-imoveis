"use client";

import { useState } from "react";
import { Search } from "lucide-react";
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
    <form onSubmit={handleSearch} className="mt-12 max-w-3xl mx-auto bg-white/95 p-2 rounded-2xl backdrop-blur-md border border-neutral-200 shadow-2xl flex flex-col md:flex-row gap-2">
      <div className="flex-1 flex items-center bg-white rounded-xl px-4 py-3 border border-neutral-100 shadow-inner">
        <Search className="text-hi-blue mr-3" size={20} />
        <input 
          type="text" 
          placeholder="Busque por bairro, cidade, título ou tipo (ex: Venda ou Locação)..." 
          className="bg-transparent border-none text-neutral-800 focus:outline-none w-full placeholder-neutral-400 font-medium"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
      </div>
      <button type="submit" className="bg-hi-blue hover:bg-[#347Ab7] text-white px-8 py-3 rounded-xl font-semibold transition-colors shadow-md">
        Buscar
      </button>
    </form>
  );
}
