"use client";

import { useState, useEffect } from "react";
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

export default function EditPlanPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [newMainImageFile, setNewMainImageFile] = useState<File | null>(null);
  const [newMainPreview, setNewMainPreview] = useState<string | null>(null);
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);
  const [newFloorPlanFiles, setNewFloorPlanFiles] = useState<File[]>([]);

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
    captador_id: "",
    main_image_url: "",
    gallery_urls: [] as string[],
    floor_plan_urls: [] as string[],
  });

  const [team, setTeam] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("team_members").select("*").order("name").then(({ data }) => {
      if (data) setTeam(data);
    });
  }, []);

  useEffect(() => {
    supabase.from("architectural_plans").select("*").eq("id", params.id).single().then(({ data, error }) => {
      if (error || !data) { alert("Projeto não encontrado."); router.push("/admin"); return; }
      setFormData({
        title: data.title || "",
        description: data.description || "",
        area_m2: String(data.area_m2 || ""),
        bedrooms: String(data.bedrooms || "3"),
        suites: String(data.suites || "0"),
        bathrooms: String(data.bathrooms || "1"),
        garage: String(data.garage || "0"),
        style: data.style || "Moderno",
        price: String(data.price || ""),
        video_url: data.video_url || "",
        broker_name: data.broker_name || "",
        broker_whatsapp: data.broker_whatsapp || "",
        captador_id: data.captador_id || "",
        main_image_url: data.main_image_url || "",
        gallery_urls: data.gallery_urls || [],
        floor_plan_urls: data.floor_plan_urls || [],
      });
      setFetching(false);
    });
  }, [params.id, router]);

  function set(field: string, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      let mainUrl = formData.main_image_url;
      if (newMainImageFile) {
        const url = await uploadFile(newMainImageFile, "capa");
        if (url) mainUrl = url;
      }

      const existingGallery = formData.gallery_urls;
      const newGalleryUploaded: string[] = [];
      for (const f of newGalleryFiles) {
        const url = await uploadFile(f, "galeria");
        if (url) newGalleryUploaded.push(url);
      }

      const existingFloorPlans = formData.floor_plan_urls;
      const newFloorPlanUploaded: string[] = [];
      for (const f of newFloorPlanFiles) {
        const url = await uploadFile(f, "planta");
        if (url) newFloorPlanUploaded.push(url);
      }

      const { error } = await supabase.from("architectural_plans").update({
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
        gallery_urls: [...existingGallery, ...newGalleryUploaded],
        floor_plan_urls: [...existingFloorPlans, ...newFloorPlanUploaded],
        video_url: formData.video_url || null,
        broker_name: formData.broker_name || null,
        broker_whatsapp: formData.broker_whatsapp || null,
        captador_id: formData.captador_id || null,
      }).eq("id", params.id);

      if (error) { alert("Erro ao atualizar: " + error.message); }
      else { router.push("/admin"); }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setLoading(false);
    }
  }

  function removeGalleryImage(url: string) {
    setFormData(prev => ({ ...prev, gallery_urls: prev.gallery_urls.filter(u => u !== url) }));
  }

  function removeFloorPlan(url: string) {
    setFormData(prev => ({ ...prev, floor_plan_urls: prev.floor_plan_urls.filter(u => u !== url) }));
  }

  if (fetching) return (
    <div className="p-8 max-w-4xl mx-auto flex items-center justify-center h-64">
      <div className="text-neutral-500 animate-pulse">Carregando projeto...</div>
    </div>
  );

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-6 mb-10">
        <Link href="/admin" className="p-3 bg-white border border-neutral-200 rounded-full hover:bg-neutral-800 hover:text-white hover:border-neutral-800 transition-colors text-neutral-400">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-[#2C2C2C] tracking-tight font-serif">Editar Projeto</h1>
          <p className="text-neutral-600 mt-1">Atualize as informações do projeto arquitetônico.</p>
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
              <textarea required rows={4} className={inputClass} value={formData.description} onChange={e => set("description", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Estilo Arquitetônico *</label>
              <select required className={inputClass + " cursor-pointer"} value={formData.style} onChange={e => set("style", e.target.value)}>
                {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Área Total (m²) *</label>
              <input required type="number" min="1" className={inputClass} value={formData.area_m2} onChange={e => set("area_m2", e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><label className={labelClass}>Quartos</label><input type="number" min="1" className={inputClass} value={formData.bedrooms} onChange={e => set("bedrooms", e.target.value)} /></div>
            <div><label className={labelClass}>Suítes</label><input type="number" min="0" className={inputClass} value={formData.suites} onChange={e => set("suites", e.target.value)} /></div>
            <div><label className={labelClass}>Banheiros</label><input type="number" min="1" className={inputClass} value={formData.bathrooms} onChange={e => set("bathrooms", e.target.value)} /></div>
            <div><label className={labelClass}>Vagas</label><input type="number" min="0" className={inputClass} value={formData.garage} onChange={e => set("garage", e.target.value)} /></div>
          </div>

          <div>
            <label className={labelClass}>Preço do Projeto (R$) *</label>
            <div className="relative">
              <DollarSign size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              <input required type="number" min="0" step="0.01" className={inputClass + " pl-10"} value={formData.price} onChange={e => set("price", e.target.value)} />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm space-y-6">
          <h2 className="text-xl font-semibold text-[#2C2C2C] border-b border-neutral-100 pb-4">Responsividade e Captação</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Captador do Projeto (Equipe)</label>
              <select 
                className={inputClass + " cursor-pointer"}
                value={formData.captador_id}
                onChange={(e) => set("captador_id", e.target.value)}
              >
                <option value="">Selecione quem captou o projeto...</option>
                {team.map(member => (
                  <option key={member.id} value={member.id}>{member.name} ({member.role})</option>
                ))}
              </select>
            </div>
            <div className="hidden md:block"></div>

            <div>
              <label className={labelClass}>Nome do Corretor Oficial (Visual)</label>
              <input type="text" className={inputClass} value={formData.broker_name} onChange={e => set("broker_name", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>WhatsApp do Corretor</label>
              <input type="tel" className={inputClass} placeholder="556899..." value={formData.broker_whatsapp} onChange={e => set("broker_whatsapp", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Mídias */}
        <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-neutral-100 pb-4 mb-6">
            <ImageIcon className="text-[#FFB800]" size={24} />
            <h2 className="text-xl font-semibold text-[#2C2C2C]">Fotos e Plantas</h2>
          </div>

          {/* Current main image */}
          {formData.main_image_url && (
            <div>
              <label className={labelClass}>Imagem de Capa Atual</label>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={formData.main_image_url} alt="Capa atual" className="h-40 w-auto rounded-xl object-cover border border-neutral-200" />
            </div>
          )}
          <div>
            <label className={labelClass}>Substituir Imagem de Capa</label>
            <input type="file" accept="image/*" className="w-full bg-white border border-neutral-300 rounded-xl p-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#FFB800] file:text-black hover:file:bg-[#e0a800] cursor-pointer"
              onChange={e => { 
                if (e.target.files?.[0]) {
                  const file = e.target.files[0];
                  setNewMainImageFile(file);
                  setNewMainPreview(URL.createObjectURL(file));
                }
              }} 
            />
            {newMainPreview && (
              <div className="mt-3 relative w-32 h-20 rounded-lg overflow-hidden border border-neutral-200">
                <img src={newMainPreview} alt="Nova capa preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Current gallery */}
          {formData.gallery_urls.length > 0 && (
            <div>
              <label className={labelClass}>Renders da Galeria Atual</label>
              <div className="flex flex-wrap gap-3">
                {formData.gallery_urls.map((url, i) => (
                  <div key={i} className="relative group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Render ${i+1}`} className="h-24 w-auto rounded-lg object-cover border border-neutral-200" />
                    <button type="button" onClick={() => removeGalleryImage(url)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div>
            <label className={labelClass}>Adicionar Renders à Galeria</label>
            <input type="file" accept="image/*" multiple className="w-full bg-white border border-neutral-300 rounded-xl p-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-neutral-800 file:text-white hover:file:bg-neutral-700 cursor-pointer"
              onChange={e => { 
                if (e.target.files) {
                  const newFiles = Array.from(e.target.files);
                  setNewGalleryFiles(prev => [...prev, ...newFiles]);
                }
              }} 
            />
            {newGalleryFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {newGalleryFiles.map((file, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-neutral-200 group">
                    <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => setNewGalleryFiles(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 bg-red-500 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="text-[10px] px-1">×</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-neutral-500 mt-1">{newGalleryFiles.length} novo(s) render(s) selecionado(s).</p>
          </div>

          {/* Current floor plans */}
          {formData.floor_plan_urls.length > 0 && (
            <div>
              <label className={labelClass}>📐 Plantas Baixas Atuais</label>
              <div className="flex flex-wrap gap-3">
                {formData.floor_plan_urls.map((url, i) => (
                  <div key={i} className="relative group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Planta ${i+1}`} className="h-28 w-auto rounded-lg object-cover border border-neutral-200 bg-neutral-50" />
                    <button type="button" onClick={() => removeFloorPlan(url)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div>
            <label className={labelClass}>📐 Adicionar Plantas Baixas</label>
            <input type="file" accept="image/*" multiple className="w-full bg-white border border-neutral-300 rounded-xl p-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-600 file:text-white hover:file:bg-violet-700 cursor-pointer"
              onChange={e => { 
                if (e.target.files) {
                  const newFiles = Array.from(e.target.files);
                  setNewFloorPlanFiles(prev => [...prev, ...newFiles]);
                }
              }} 
            />
            {newFloorPlanFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {newFloorPlanFiles.map((file, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-neutral-200 group bg-neutral-50">
                    <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-contain" />
                    <button 
                      type="button" 
                      onClick={() => setNewFloorPlanFiles(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 bg-red-500 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="text-[10px] px-1">×</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-neutral-500 mt-1">{newFloorPlanFiles.length} nova(s) planta(s) selecionada(s).</p>
          </div>

          <div>
            <label className={labelClass}>URL do Vídeo / Tour Virtual (Opcional)</label>
            <input type="url" className={inputClass} placeholder="https://youtube.com/..." value={formData.video_url} onChange={e => set("video_url", e.target.value)} />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={loading} className="bg-[#FFB800] text-black hover:bg-[#e0a800] disabled:bg-neutral-300 disabled:text-neutral-500 font-bold px-10 py-4 rounded-xl flex items-center gap-3 transition-all shadow-lg active:scale-95">
            {loading ? "Salvando..." : (<><Save size={22} /> Salvar Alterações</>)}
          </button>
        </div>
      </form>
    </div>
  );
}
