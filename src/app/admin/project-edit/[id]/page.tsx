"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Save, Building, Image as ImageIcon, DollarSign, MapPin, List } from "lucide-react";
import Link from "next/link";

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    description: "",
    price_starts_at: "",
    status: "Launch",
    stage: "",
    location: "",
    features: "",
    video_url: "",
    broker_name: "",
    broker_whatsapp: "",
  });
  const [existingMainImage, setExistingMainImage] = useState("");
  const [existingGallery, setExistingGallery] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      loadPropertyData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadPropertyData() {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      if (data) {
        setFormData({
          title: data.title || "",
          code: data.code || "",
          description: data.description || "",
          price_starts_at: data.price_starts_at?.toString() || "",
          status: data.status || "Launch",
          stage: data.stage || "",
          location: data.location || "",
          features: data.features?.join(', ') || "",
          video_url: data.video_url || "",
          broker_name: data.broker_name || "",
          broker_whatsapp: data.broker_whatsapp || "",
        });
        setExistingMainImage(data.main_image_url || "");
        setExistingGallery(data.gallery_urls || []);
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar os dados do empreendimento.");
    } finally {
      setFetching(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = "";

      if (mainImageFile) {
        const fileExt = mainImageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('properties')
          .upload(filePath, mainImageFile);

        if (uploadError) {
          throw new Error('Falha no upload da imagem: ' + uploadError.message);
        }

        const { data: publicUrlData } = supabase.storage
          .from('properties')
          .getPublicUrl(filePath);

        finalImageUrl = publicUrlData.publicUrl;
      } else {
        finalImageUrl = existingMainImage;
      }

      if (!finalImageUrl && !existingMainImage) throw new Error("A imagem de capa é obrigatória.");

      let finalGalleryUrls: string[] = [...existingGallery];
      if (galleryFiles.length > 0) {
        const uploadPromises = galleryFiles.map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
          const filePath = `images/galeria_${fileName}`;
          
          const { error } = await supabase.storage.from('properties').upload(filePath, file);
          if (!error) {
            const { data } = supabase.storage.from('properties').getPublicUrl(filePath);
            return data.publicUrl;
          }
          return null;
        });
        
        const results = await Promise.all(uploadPromises);
        const newUrls = results.filter((url) => url !== null) as string[];
        finalGalleryUrls = [...finalGalleryUrls, ...newUrls];
      }

      const featuresArray = formData.features.split(',').map(f => f.trim()).filter(Boolean);

      const { error } = await supabase.from("projects").update({
        title: formData.title,
        code: formData.code || null,
        description: formData.description,
        price_starts_at: parseFloat(formData.price_starts_at) || 0,
        status: formData.status,
        stage: formData.stage || null,
        location: formData.location,
        features: featuresArray,
        main_image_url: finalImageUrl,
        gallery_urls: finalGalleryUrls,
        video_url: formData.video_url || null,
        broker_name: formData.broker_name || null,
        broker_whatsapp: formData.broker_whatsapp || null,
      }).eq("id", id);

      if (error) {
        console.error(error);
        if (process.env.NODE_ENV === "development") {
          alert(`Erro (Em dev, check o console): ${error.message}`);
        } else {
          alert("Erro ao salvar o empreendimento. Verifique a configuração do banco de dados.");
        }
      } else {
        router.push("/admin");
      }
    } catch (error) {
      console.error(error);
      alert("Erro crítico ao salvar.");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return <div className="p-8 max-w-4xl mx-auto flex items-center justify-center min-h-[50vh]"><div className="animate-pulse text-lg font-medium text-neutral-500">Carregando empreendimento...</div></div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-6 mb-10">
        <Link href="/admin" className="p-3 bg-white border border-neutral-200 rounded-full hover:bg-neutral-800 transition-colors hover:text-white text-neutral-400">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-[#2C2C2C] tracking-tight font-serif">Editar Empreendimento</h1>
          <p className="text-neutral-600 mt-1">Altere os dados do encarte ou lançamento conforme necessário.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-8 rounded-2xl border border-neutral-200 space-y-6 shadow-sm">
          <div className="flex items-center gap-3 border-b border-neutral-100 pb-4 mb-6">
            <Building className="text-hi-blue" size={24} />
            <h2 className="text-xl font-semibold text-[#2C2C2C]">Informações Principais</h2>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Título do Anúncio</label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-white border border-neutral-300 shadow-sm rounded-xl p-3.5 text-neutral-800 placeholder-neutral-400 font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  placeholder="Ex: Mansão Contemporânea"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Código do Imóvel</label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-white border border-neutral-300 shadow-sm rounded-xl p-3.5 text-neutral-800 placeholder-neutral-400 font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all uppercase"
                  placeholder="Ex: REF-1020"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Descrição Completa</label>
              <textarea 
                required
                rows={5}
                className="w-full bg-white border border-neutral-300 shadow-sm rounded-xl p-3.5 text-neutral-800 placeholder-neutral-400 font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-y"
                placeholder="Descreva os diferenciais, arquitetura e acabamento do imóvel..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Valor "A partir de" (R$)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <DollarSign size={18} className="text-neutral-500" />
                  </div>
                  <input 
                    required
                    type="number" 
                    step="0.01"
                    min="0"
                    className="w-full bg-white border border-neutral-300 shadow-sm rounded-xl pl-10 p-3.5 text-neutral-800 placeholder-neutral-400 font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    placeholder="1500000"
                    value={formData.price_starts_at}
                    onChange={(e) => setFormData({...formData, price_starts_at: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Status do Empreendimento</label>
                <select 
                  className="w-full bg-white border border-neutral-300 shadow-sm rounded-xl p-3.5 text-neutral-800 focus:outline-none focus:border-hi-blue focus:ring-1 focus:ring-hi-blue transition-all appearance-none cursor-pointer"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="Launch">Lançamento</option>
                  <option value="InProgress">Obras em Andamento</option>
                  <option value="Ready">Pronto para Morar</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Endereço Principal / Localização</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <MapPin size={18} className="text-neutral-500" />
                </div>
                <input 
                  required
                  type="text" 
                  className="w-full bg-white border border-neutral-300 shadow-sm rounded-xl pl-10 p-3.5 text-neutral-800 placeholder-neutral-400 font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  placeholder="Ex: Praia Brava, Itajaí - SC ou Av. Faria Lima, 100 - SP"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Estágio de Obra (Opcional)</label>
                <input 
                  type="text"
                  className="w-full bg-white border border-neutral-300 shadow-sm rounded-xl p-3.5 text-neutral-800 placeholder-neutral-400 font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  placeholder="Ex: Fase 3, 60% Concluído..."
                  value={formData.stage}
                  onChange={(e) => setFormData({...formData, stage: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Comodidades/Características</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <List size={18} className="text-neutral-500" />
                  </div>
                  <input 
                    type="text"
                    className="w-full bg-white border border-neutral-300 shadow-sm rounded-xl pl-10 p-3.5 text-neutral-800 placeholder-neutral-400 font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    placeholder="Piscina, Academia, 2 vagas (separado por vírgulas)"
                    value={formData.features}
                    onChange={(e) => setFormData({...formData, features: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-neutral-200 space-y-6 shadow-sm">
          <div className="flex items-center gap-3 border-b border-neutral-100 pb-4 mb-6">
            <h2 className="text-xl font-semibold text-[#2C2C2C]">Atribuição do Corretor Responsável</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Nome do Corretor Oficial</label>
              <input 
                type="text" 
                className="w-full bg-white border border-neutral-300 shadow-sm rounded-xl p-3.5 text-neutral-800 placeholder-neutral-400 font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="Ex: Ana Silva ou Rogério Prado"
                value={formData.broker_name}
                onChange={(e) => setFormData({...formData, broker_name: e.target.value})}
              />
              <p className="text-xs text-neutral-500 mt-2">Irá aparecer para o cliente (Ex: &quot;Fale com Ana Silva&quot;).</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">WhatsApp Direto do Corretor</label>
              <input 
                type="tel" 
                className="w-full bg-white border border-neutral-300 shadow-sm rounded-xl p-3.5 text-neutral-800 placeholder-neutral-400 font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="Ex: 5511999999999"
                value={formData.broker_whatsapp}
                onChange={(e) => setFormData({...formData, broker_whatsapp: e.target.value})}
              />
              <p className="text-xs text-neutral-500 mt-2">Insira com DDI e DDD apenas números. Ex: 5511999999999</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-neutral-200 space-y-6 shadow-sm">
          <div className="flex items-center gap-3 border-b border-neutral-100 pb-4 mb-6">
            <ImageIcon className="text-hi-blue" size={24} />
            <h2 className="text-xl font-semibold text-[#2C2C2C]">Mídia e Apresentação</h2>
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Imagem de Capa (Opcional - deixe vazio p/ manter a atual)</label>
              <input 
                type="file" 
                accept="image/*"
                className="w-full bg-white border border-neutral-300 shadow-sm rounded-xl p-3 text-neutral-800 focus:outline-none focus:border-hi-blue focus:ring-1 focus:ring-hi-blue transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-hi-blue file:text-white hover:file:bg-[#347Ab7] cursor-pointer"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setMainImageFile(e.target.files[0]);
                  }
                }}
              />
              {existingMainImage && <p className="text-sm mt-2 text-neutral-500">Imagem atual já enviada.</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Fotos Adicionais (Pula e mantém se não quiser add novas)</label>
              <input 
                type="file" 
                multiple
                accept="image/*"
                className="w-full bg-white border border-neutral-300 shadow-sm rounded-xl p-3 text-neutral-800 focus:outline-none focus:border-hi-blue focus:ring-1 focus:ring-hi-blue transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-neutral-800 file:text-neutral-200 hover:file:bg-neutral-700 cursor-pointer"
                onChange={(e) => {
                  if (e.target.files) {
                    setGalleryFiles(Array.from(e.target.files));
                  }
                }}
              />
              <p className="text-xs text-neutral-500 mt-2">{galleryFiles.length} foto(s) selecionada(s) para a galeria.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">URL do Vídeo (MP4, YouTube, Vimeo) - Opcional</label>
              <input 
                type="url" 
                className="w-full bg-white border border-neutral-300 shadow-sm rounded-xl p-3.5 text-neutral-800 placeholder-neutral-400 font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="https://exemplo.com/tour-virtual.mp4"
                value={formData.video_url}
                onChange={(e) => setFormData({...formData, video_url: e.target.value})}
              />
              <p className="text-xs text-neutral-500 mt-2">Um vídeo bem produzido aumenta muito o engajamento na vitrine imersiva.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit"
            disabled={loading}
            className="bg-hi-blue hover:bg-[#347Ab7] disabled:bg-blue-300 disabled:text-white text-white font-bold px-8 py-4 rounded-xl flex items-center gap-3 transition-all shadow-lg hover:shadow-blue-900/20 active:scale-95"
          >
            {loading ? "Salvando Alterações..." : (
              <>
                <Save size={22} />
                Salvar Alterações
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
