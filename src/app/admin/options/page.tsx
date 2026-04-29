"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { MapPin, Home, ArrowLeft, Trash2, Plus } from "lucide-react";
import Link from "next/link";

type SystemOption = {
  id: string;
  type: "neighborhood" | "property_type";
  value: string;
};

export default function OptionsPage() {
  const [options, setOptions] = useState<SystemOption[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newNeighborhood, setNewNeighborhood] = useState("");
  const [newPropertyType, setNewPropertyType] = useState("");

  useEffect(() => {
    loadOptions();
  }, []);

  async function loadOptions() {
    setLoading(true);
    const { data, error } = await supabase.from("system_options").select("*").order("value", { ascending: true });
    if (!error && data) {
      setOptions(data as SystemOption[]);
    }
    setLoading(false);
  }

  async function addOption(type: "neighborhood" | "property_type", value: string) {
    if (!value.trim()) return;
    
    // Check if already exists locally
    if (options.find(o => o.type === type && o.value.toLowerCase() === value.trim().toLowerCase())) {
      alert("Esta opção já existe!");
      return;
    }

    const { error } = await supabase.from("system_options").insert([{ type, value: value.trim() }]);
    
    if (error) {
      alert("Erro ao adicionar: " + error.message);
    } else {
      if (type === "neighborhood") setNewNeighborhood("");
      if (type === "property_type") setNewPropertyType("");
      loadOptions();
    }
  }

  async function deleteOption(id: string) {
    if (!confirm("Tem certeza que deseja apagar esta opção?")) return;
    const { error } = await supabase.from("system_options").delete().eq("id", id);
    if (!error) {
      loadOptions();
    } else {
      alert("Erro ao apagar.");
    }
  }

  const neighborhoods = options.filter(o => o.type === "neighborhood");
  const propertyTypes = options.filter(o => o.type === "property_type");

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-6 mb-10">
        <Link href="/admin" className="p-3 bg-white border border-neutral-200 rounded-full hover:bg-neutral-800 transition-colors text-neutral-400">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-[#2C2C2C] tracking-tight font-serif">Opções Rápidas</h1>
          <p className="text-neutral-600 mt-1">Cadastre os Bairros e Tipos de Imóveis para ficarem disponíveis na seleção rápida do sistema e busca.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Bairros */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-3 border-b border-neutral-100 pb-4 mb-6">
            <MapPin className="text-hi-blue" size={24} />
            <h2 className="text-xl font-semibold text-[#2C2C2C]">Bairros (Regiões)</h2>
          </div>

          <div className="flex gap-2 mb-6">
            <input 
              type="text" 
              className="flex-1 bg-white border border-neutral-300 rounded-xl p-3 text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-hi-blue"
              placeholder="Ex: Lourdes, Batel..."
              value={newNeighborhood}
              onChange={(e) => setNewNeighborhood(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addOption("neighborhood", newNeighborhood)}
            />
            <button 
              onClick={() => addOption("neighborhood", newNeighborhood)}
              className="bg-hi-blue text-white px-5 rounded-xl font-bold hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Plus size={20} /> <span className="hidden md:inline">Adicionar</span>
            </button>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {loading && <p className="text-neutral-500 text-sm">Carregando...</p>}
            {!loading && neighborhoods.length === 0 && <p className="text-neutral-500 text-sm italic">Nenhum bairro cadastrado.</p>}
            {neighborhoods.map(option => (
              <div key={option.id} className="flex items-center justify-between bg-neutral-50 border border-neutral-200 p-3 rounded-xl">
                <span className="font-medium text-neutral-800">{option.value}</span>
                <button 
                  onClick={() => deleteOption(option.id)}
                  className="text-neutral-400 hover:text-red-500 transition-colors bg-white p-1.5 rounded-md shadow-sm border border-neutral-200"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Tipos de Imóvel */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-3 border-b border-neutral-100 pb-4 mb-6">
            <Home className="text-hi-blue" size={24} />
            <h2 className="text-xl font-semibold text-[#2C2C2C]">Tipos de Imóvel</h2>
          </div>

          <div className="flex gap-2 mb-6">
            <input 
              type="text" 
              className="flex-1 bg-white border border-neutral-300 rounded-xl p-3 text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-hi-blue"
              placeholder="Ex: Apartamento, Casa, Terreno..."
              value={newPropertyType}
              onChange={(e) => setNewPropertyType(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addOption("property_type", newPropertyType)}
            />
            <button 
              onClick={() => addOption("property_type", newPropertyType)}
              className="bg-hi-blue text-white px-5 rounded-xl font-bold hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Plus size={20} /> <span className="hidden md:inline">Adicionar</span>
            </button>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {loading && <p className="text-neutral-500 text-sm">Carregando...</p>}
            {!loading && propertyTypes.length === 0 && <p className="text-neutral-500 text-sm italic">Nenhum tipo cadastrado.</p>}
            {propertyTypes.map(option => (
              <div key={option.id} className="flex items-center justify-between bg-neutral-50 border border-neutral-200 p-3 rounded-xl">
                <span className="font-medium text-neutral-800">{option.value}</span>
                <button 
                  onClick={() => deleteOption(option.id)}
                  className="text-neutral-400 hover:text-red-500 transition-colors bg-white p-1.5 rounded-md shadow-sm border border-neutral-200"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
