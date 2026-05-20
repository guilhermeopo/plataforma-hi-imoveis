"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Save, Ruler, Image as ImageIcon, DollarSign } from "lucide-react";
import Link from "next/link";

const STYLES = ["Moderno", "Clássico", "Rústico", "Contemporâneo", "Minimalista"];

const inputClass = "w-full bg-white border border-neutral-300 shadow-sm rounded-xl p-3.5 text-neutral-800 placeholder-neutral-400 font-medium focus:outline-none focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800] transition-all";
const labelClass = "block text-sm font-medium text-neutral-700 mb-2";

async function uploadFile(file: File, prefix: string): Promise<string | null> {
  const ext = file.name.split('.').pop();
  const name = `${prefix}_${Math.random().toString(36).substring(2, 10)}.${ext}`;
  const path = `plans/${name}`;
  const { error } = await supabase.storage.from('properties').upload(path, file);
  if (error) return null;
  return supabase.storage.from('properties').getPublicUrl(path).data.publicUrl;
}

export default function AddPlanPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [floorPlanFiles, setFloorPlanFiles] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    area_m2: "",
    bedrooms: "3",
    suites: "1",
    bathrooms: "2",
    garage: "2",
    style: "Moderno",
    price: "",
    video_url: "",
    broker_name: "",
    broker_whatsapp: "",
  });

  function set(field: string, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (!mainImageFile) throw new Error("A imagem de capa é obrigatória.");

      const mainUrl = await uploadFile(mainImageFile, "capa");
      if (!mainUrl) throw new Error("Falha no upload da imagem de capa.");

      const galleryUrls: string[] = [];
      for (const f of galleryFiles) {
        const url = await uploadFile(f, "galeria");
        if (url) galleryUrls.push(url);
      }

      const floorPlanUrls: string[] = [];
      for (const f of floorPlanFiles) {
        const url = await uploadFile(f, "planta");
        if (url) floorPlanUrls.push(url);
      }

      const { error } = await supabase.from("architectural_plans").insert([{
        title: formData.title,
        description: formData.description,
        area_m2: parseInt(formData.area_m2) || 0,
        bedrooms: parseInt(formData.bedrooms) || 0,
        suites: parseInt(formData.suites) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        garage: parseInt(formData.garage) || 0,
        style: formData.style,
        price: parseFloat(formData.price) || 0,
        main_image_url: mainUrl,
        gallery_urls: galleryUrls,
        floor_plan_urls: floorPlanUrls,
        video_url: formData.video_url || null,
        broker_name: formData.broker_name || null,
        broker_whatsapp: formData.broker_whatsapp || null,
      }]);

      if (error) {
        alert("Erro ao salvar: " + error.message);
      } else {
        router.push("/admin?tab=plans");
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-6 mb-10">
        <Link href="/admin" className="p-3 bg-white border border-neutral-200 rounded-full hover:bg-neutral-800 hover:text-white hover:border-neutral-800 transition-colors text-neutral-400">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-[#2C2C2C] tracking-tight font-serif">Novo Projeto Pronto</h1>
          <p className="text-neutral-600 mt-1">Cadastre um projeto arquitetônico com fotos renderizadas e plantas.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informações Principais */}
        <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-neutral-100 pb-4 mb-6">
            <Ruler className="text-[#FFB800]" size={24} />
            <h2 className="text-xl font-semibold text-[#2C2C2C]">Informações do Projeto</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className={labelClass}>Nome do Projeto *</label>
              <input required type="text" className={inputClass} placeholder="Ex: Residência Parque Linear" value={formData.title} onChange={e => set("title", e.target.value)} />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Descrição Completa *</label>
              <textarea required rows={4} className={inputClass} placeholder="Descreva o estilo arquitetônico, materiais, diferenciais e ambientes..." value={formData.description} onChange={e => set("description", e.target.value)} />
            </div>

            <div>
              <label className={labelClass}>Estilo Arquitetônico *</label>
              <select required className={inputClass + " cursor-pointer"} value={formData.style} onChange={e => set("style", e.target.value)}>
                {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className={labelClass}>Área Total (m²) *</label>
              <input required type="number" min="1" className={inputClass} placeholder="Ex: 280" value={formData.area_m2} onChange={e => set("area_m2", e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className={labelClass}>Quartos *</label>
              <input required type="number" min="1" max="20" className={inputClass} value={formData.bedrooms} onChange={e => set("bedrooms", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Suítes</label>
              <input type="number" min="0" max="20" className={inputClass} value={formData.suites} onChange={e => set("suites", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Banheiros</label>
              <input type="number" min="1" max="20" className={inputClass} value={formData.bathrooms} onChange={e => set("bathrooms", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Vagas de Garagem</label>
              <input type="number" min="0" max="20" className={inputClass} value={formData.garage} onChange={e => set("garage", e.target.value)} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Preço do Projeto (R$) *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <DollarSign size={18} className="text-neutral-400" />
              </div>
              <input required type="number" min="0" step="0.01" className={inputClass + " pl-10"} placeholder="Ex: 28000" value={formData.price} onChange={e => set("price", e.target.value)} />
            </div>
            <p className="text-xs text-neutral-500 mt-1.5">Valor do projeto arquitetônico (não da construção).</p>
          </div>
        </div>

        {/* Corretor */}
        <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm space-y-6">
          <h2 className="text-xl font-semibold text-[#2C2C2C] border-b border-neutral-100 pb-4">Corretor Responsável (Opcional)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Nome do Corretor</label>
              <input type="text" className={inputClass} placeholder="Ex: Ana Silva" value={formData.broker_name} onChange={e => set("broker_name", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>WhatsApp do Corretor</label>
              <input type="tel" className={inputClass} placeholder="Ex: 5568999299010" value={formData.broker_whatsapp} onChange={e => set("broker_whatsapp", e.target.value)} />
              <p className="text-xs text-neutral-500 mt-1">Apenas números com DDI+DDD.</p>
            </div>
          </div>
        </div>

        {/* Mídias */}
        <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-neutral-100 pb-4 mb-6">
            <ImageIcon className="text-[#FFB800]" size={24} />
            <h2 className="text-xl font-semibold text-[#2C2C2C]">Fotos e Plantas</h2>
          </div>

          <div>
            <label className={labelClass}>Imagem de Capa / Render Principal *</label>
            <input required type="file" accept="image/*" className="w-full bg-white border border-neutral-300 rounded-xl p-3 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#FFB800] file:text-black hover:file:bg-[#e0a800] cursor-pointer"
              onChange={e => { if (e.target.files?.[0]) setMainImageFile(e.target.files[0]); }} />
          </div>

          <div>
            <label className={labelClass}>Fotos Renderizadas Adicionais (Galeria)</label>
            <input type="file" accept="image/*" multiple className="w-full bg-white border border-neutral-300 rounded-xl p-3 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-neutral-800 file:text-white hover:file:bg-neutral-700 cursor-pointer"
              onChange={e => { if (e.target.files) setGalleryFiles(prev => [...prev, ...Array.from(e.target.files!)]); }} />
            <div className="flex items-center gap-4 mt-2">
              <p className="text-xs text-neutral-500">{galleryFiles.length} foto(s) de render selecionada(s).</p>
              {galleryFiles.length > 0 && <button type="button" onClick={() => setGalleryFiles([])} className="text-xs text-red-500 hover:underline">Limpar</button>}
            </div>
          </div>

          <div>
            <label className={labelClass}>📐 Plantas Baixas (Imagens/PDF como imagem)</label>
            <input type="file" accept="image/*" multiple className="w-full bg-white border border-neutral-300 rounded-xl p-3 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-600 file:text-white hover:file:bg-violet-700 cursor-pointer"
              onChange={e => { if (e.target.files) setFloorPlanFiles(prev => [...prev, ...Array.from(e.target.files!)]); }} />
            <div className="flex items-center gap-4 mt-2">
              <p className="text-xs text-neutral-500">{floorPlanFiles.length} planta(s) selecionada(s). Faça upload como imagem (PNG/JPG).</p>
              {floorPlanFiles.length > 0 && <button type="button" onClick={() => setFloorPlanFiles([])} className="text-xs text-red-500 hover:underline">Limpar</button>}
            </div>
          </div>

          <div>
            <label className={labelClass}>URL do Vídeo / Tour Virtual (Opcional)</label>
            <input type="url" className={inputClass} placeholder="https://youtube.com/..." value={formData.video_url} onChange={e => set("video_url", e.target.value)} />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={loading} className="bg-[#FFB800] text-black hover:bg-[#e0a800] disabled:bg-neutral-300 disabled:text-neutral-500 font-bold px-10 py-4 rounded-xl flex items-center gap-3 transition-all shadow-lg active:scale-95">
            {loading ? "Salvando..." : (<><Save size={22} /> Publicar Projeto</>)}
          </button>
        </div>
      </form>
    </div>
  );
}
