"use client";

import { useEffect, useState } from "react";
import { supabase, type Property, type Project } from "@/lib/supabase";
import { Trash2, CheckCircle, Image as ImageIcon, Pencil, Building2, Home } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"properties" | "projects">("properties");
  const [properties, setProperties] = useState<Property[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProperties = properties.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.code && p.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.location && p.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.code && p.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.location && p.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const [pRes, prjRes] = await Promise.all([
      supabase.from("properties").select("*").order("created_at", { ascending: false }),
      supabase.from("projects").select("*").order("created_at", { ascending: false })
    ]);
    
    if (pRes.data) setProperties(pRes.data as Property[]);
    if (prjRes.data) setProjects(prjRes.data as Project[]);
    setLoading(false);
  }

  async function deleteItem(id: string, type: "properties" | "projects") {
    if (!window.confirm(`Tem certeza que deseja excluir este ${type === 'properties' ? 'imóvel' : 'empreendimento'}?`)) return;
    
    if (type === "properties") {
      setProperties((prev) => prev.filter((p) => p.id !== id));
      await supabase.from("properties").delete().eq("id", id);
    } else {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      await supabase.from("projects").delete().eq("id", id);
    }
  }

  async function markAsSold(id: string) {
    if (!window.confirm("Marcar este imóvel como vendido?")) return;
    setProperties((prev) => prev.map((p) => (p.id === id ? { ...p, status: "Sold" } : p)));
    await supabase.from("properties").update({ status: "Sold" }).eq("id", id);
  }

  async function markProjectStage(id: string, newStatus: Project['status']) {
    if (!window.confirm("Atualizar status do empreendimento?")) return;
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)));
    await supabase.from("projects").update({ status: newStatus }).eq("id", id);
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold text-[#2C2C2C] font-serif tracking-tight">Painel Administrativo</h1>
          <p className="text-neutral-600 mt-1">Gerencie seu portfólio de imóveis e grandes empreendimentos.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <input 
            type="text"
            placeholder="Pesquisar..."
            className="w-full sm:w-64 bg-white border border-neutral-200 rounded-lg px-4 py-2.5 text-sm font-medium text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-hi-blue focus:ring-1 focus:ring-hi-blue shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 border-b border-neutral-200 pb-4">
        <button 
          onClick={() => setActiveTab("properties")} 
          className={cn("px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors", activeTab === "properties" ? "bg-neutral-800 text-white shadow-md" : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200")}
        >
          <Home size={18} /> Imóveis Padrão
        </button>
        <button 
          onClick={() => setActiveTab("projects")} 
          className={cn("px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors", activeTab === "projects" ? "bg-hi-blue text-white shadow-md" : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200")}
        >
          <Building2 size={18} /> Empreendimentos / Lançamentos
        </button>

        <div className="ml-auto w-full md:w-auto mt-4 md:mt-0">
          <Link 
            href={activeTab === "properties" ? "/admin/add" : "/admin/project-add"} 
            className={cn("w-full md:w-auto text-white font-medium px-6 py-2.5 rounded-lg shadow-sm transition-colors text-center whitespace-nowrap block", activeTab === "properties" ? "bg-[#d95d29] hover:bg-[#b04a1f]" : "bg-hi-blue hover:bg-[#347Ab7]")}
          >
            {activeTab === "properties" ? "+ Cadastrar Imóvel" : "+ Novo Empreendimento"}
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/50">
                <th className="p-4 text-sm font-medium text-neutral-500">{activeTab === "properties" ? "Imóvel" : "Empreendimento"}</th>
                <th className="p-4 text-sm font-medium text-neutral-500">{activeTab === "properties" ? "Tipo" : "Status de Obra"}</th>
                <th className="p-4 text-sm font-medium text-neutral-500">{activeTab === "properties" ? "Preço" : "A partir de"}</th>
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
                    </div>
                  </td>
                </tr>
              ) : (activeTab === "properties" ? filteredProperties : filteredProjects).length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-16 text-center text-neutral-500">
                    <ImageIcon className="mx-auto h-12 w-12 text-neutral-300 mb-4" />
                    <p className="text-lg font-medium text-neutral-600">Nenhum registro encontrado.</p>
                  </td>
                </tr>
              ) : (
                (activeTab === "properties" ? filteredProperties : filteredProjects).map((item: any) => (
                  <tr key={item.id} className="hover:bg-neutral-50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200">
                          {item.main_image_url ? (
                            <img src={item.main_image_url} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-400">
                              <ImageIcon size={24} />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-neutral-700 truncate max-w-[200px] md:max-w-xs flex items-center gap-2">
                            {item.title}
                            {item.code && <span className="text-xs bg-neutral-200 text-neutral-600 px-2 py-0.5 rounded-sm">{item.code}</span>}
                          </p>
                          <p className="text-sm text-neutral-500 truncate max-w-[200px] md:max-w-xs mt-0.5">{item.description}</p>
                        </div>
                      </div>
                    </td>
                    
                    {activeTab === "properties" ? (
                       <td className="p-4">
                        <span className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
                          item.type === 'Sale' 
                            ? "bg-blue-500/10 text-blue-400 ring-blue-500/20"
                            : "bg-purple-500/10 text-purple-400 ring-purple-500/20"
                        )}>
                          {item.type === 'Sale' ? 'Venda' : 'Aluguel'}
                        </span>
                      </td>
                    ) : (
                      <td className="p-4">
                        <span className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
                          item.status === 'Launch' ? "bg-hi-orange/10 text-hi-dark-orange ring-hi-orange/20" :
                          item.status === 'InProgress' ? "bg-hi-blue/10 text-hi-blue ring-hi-blue/20" :
                          "bg-emerald-50 text-emerald-600 ring-emerald-200"
                        )}>
                          {item.status === 'Launch' ? 'Lançamento' : item.status === 'InProgress' ? 'Em Obras' : 'Pronto'}
                        </span>
                        {item.stage && <p className="text-xs text-neutral-500 mt-1">{item.stage}</p>}
                      </td>
                    )}
                   
                    <td className="p-4 font-bold text-hi-blue">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price || item.price_starts_at)}
                    </td>

                    <td className="p-4">
                      {activeTab === "properties" ? (
                        <span className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
                          item.status === 'Available' 
                            ? "bg-emerald-50 text-emerald-600 ring-emerald-200"
                            : "bg-neutral-100 text-neutral-500 ring-neutral-200"
                        )}>
                          {item.status === 'Available' ? 'Disponível' : 'Vendido'}
                        </span>
                      ) : (
                        <span className="text-xs text-neutral-500 uppercase tracking-widest">{item.status === 'Ready' ? 'Finalizado' : 'Ativo'}</span>
                      )}
                    </td>
                    
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        {activeTab === "properties" && item.status === 'Available' && (
                          <button 
                            onClick={() => markAsSold(item.id)}
                            title="Marcar como Vendido"
                            className="p-2 text-neutral-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <CheckCircle size={20} />
                          </button>
                        )}
                        <Link 
                          href={activeTab === "properties" ? `/admin/edit/${item.id}` : `/admin/project-edit/${item.id}`}
                          title="Editar"
                          className="p-2 text-neutral-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Pencil size={20} />
                        </Link>
                        <button 
                          onClick={() => deleteItem(item.id, activeTab)}
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
