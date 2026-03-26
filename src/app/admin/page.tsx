"use client";

import { useEffect, useState } from "react";
import { supabase, type Property } from "@/lib/supabase";
import { Trash2, CheckCircle, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProperties = properties.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.location && p.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  useEffect(() => {
    fetchProperties();
  }, []);

  async function fetchProperties() {
    setLoading(true);
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) {
      setProperties(data as Property[]);
    } else if (error && process.env.NODE_ENV === "development") {
      console.warn("Supabase auth might not be configured completely:", error);
    }
    setLoading(false);
  }

  async function deleteProperty(id: string) {
    if (!window.confirm("Tem certeza que deseja excluir este imóvel?")) return;
    
    // Optimistic Update
    setProperties((prev) => prev.filter((p) => p.id !== id));
    await supabase.from("properties").delete().eq("id", id);
  }

  async function markAsSold(id: string) {
    if (!window.confirm("Marcar este imóvel como vendido?")) return;
    // Optimistic Update
    setProperties((prev) => 
      prev.map((p) => (p.id === id ? { ...p, status: "Sold" } : p))
    );
    await supabase.from("properties").update({ status: "Sold" }).eq("id", id);
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#2C2C2C] font-serif tracking-tight">Gerenciar Imóveis</h1>
          <p className="text-neutral-600 mt-1">Visão geral e controle do seu portfólio de propriedades.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <input 
            type="text"
            placeholder="Pesquisar imóvel..."
            className="w-full sm:w-64 bg-white border border-neutral-200 rounded-lg px-4 py-2.5 text-sm font-medium text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-hi-blue focus:ring-1 focus:ring-hi-blue shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Link 
            href="/admin/add" 
            className="w-full sm:w-auto bg-hi-blue hover:bg-[#347Ab7] text-white font-medium px-6 py-2.5 rounded-lg shadow-sm transition-colors text-center whitespace-nowrap"
          >
            Novo Imóvel
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/50">
                <th className="p-4 text-sm font-medium text-neutral-500">Imóvel</th>
                <th className="p-4 text-sm font-medium text-neutral-500">Tipo</th>
                <th className="p-4 text-sm font-medium text-neutral-500">Preço</th>
                <th className="p-4 text-sm font-medium text-neutral-500">Status</th>
                <th className="p-4 text-sm font-medium text-neutral-500 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-neutral-500">
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-neutral-200 rounded w-1/4 mx-auto"></div>
                      <div className="h-4 bg-neutral-200 rounded w-1/3 mx-auto"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredProperties.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-16 text-center text-neutral-500">
                    <ImageIcon className="mx-auto h-12 w-12 text-neutral-300 mb-4" />
                    <p className="text-lg font-medium text-neutral-600">Nenhum imóvel encontrado.</p>
                    <p className="text-sm mt-1">{searchQuery ? "Tente buscar usando outros termos." : "Clique em 'Novo Imóvel' para começar."}</p>
                  </td>
                </tr>
              ) : (
                filteredProperties.map((property) => (
                  <tr key={property.id} className="hover:bg-neutral-50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200">
                          {property.main_image_url ? (
                            <img src={property.main_image_url} alt={property.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-400">
                              <ImageIcon size={24} />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-neutral-700 truncate max-w-[200px] md:max-w-xs">{property.title}</p>
                          <p className="text-sm text-neutral-500 truncate max-w-[200px] md:max-w-xs mt-0.5">{property.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
                        property.type === 'Sale' 
                          ? "bg-blue-500/10 text-blue-400 ring-blue-500/20"
                          : "bg-purple-500/10 text-purple-400 ring-purple-500/20"
                      )}>
                        {property.type === 'Sale' ? 'Venda' : 'Aluguel'}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-hi-blue">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.price)}
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
                        property.status === 'Available' 
                          ? "bg-emerald-50 text-emerald-600 ring-emerald-200"
                          : "bg-hi-orange/10 text-hi-dark-orange ring-hi-orange/20"
                      )}>
                        {property.status === 'Available' ? 'Disponível' : 'Vendido'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        {property.status === 'Available' && (
                          <button 
                            onClick={() => markAsSold(property.id)}
                            title="Marcar como Vendido"
                            className="p-2 text-neutral-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <CheckCircle size={20} />
                          </button>
                        )}
                        <button 
                          onClick={() => deleteProperty(property.id)}
                          title="Excluir"
                          className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
