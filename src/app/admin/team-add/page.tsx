"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Camera } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AddTeamMember() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return alert("Por favor, insira o nome do colaborador.");
    if (!role.trim()) return alert("Por favor, insira o cargo.");
    if (!imageFile) return alert("Por favor, selecione uma foto de perfil.");

    setLoading(true);

    try {
      // Create a unique file name
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `team/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      
      // Upload image to the existing 'properties' bucket
      const { error: uploadError } = await supabase.storage
        .from('properties')
        .upload(fileName, imageFile);

      if (uploadError) throw new Error("Erro no upload da imagem: " + uploadError.message);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('properties')
        .getPublicUrl(fileName);

      const imageUrl = urlData.publicUrl;

      // Insert record
      const { error: insertError } = await supabase.from('team_members').insert([
        {
          name: name.trim(),
          role: role.trim(),
          image_url: imageUrl,
        }
      ]);

      if (insertError) throw new Error("Erro ao salvar no banco: " + insertError.message);

      alert("Colaborador adicionado com sucesso!");
      router.push('/admin');

    } catch (err: unknown) {
      console.error(err);
      alert((err as Error).message || "Erro desconhecido ao salvar o colaborador.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link href="/admin" className="inline-flex items-center text-neutral-500 hover:text-neutral-800 transition-colors mb-8 font-medium">
        <ArrowLeft size={20} className="mr-2" /> Voltar ao painel
      </Link>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200">
        <h1 className="text-3xl font-bold font-serif text-[#2C2C2C] mb-2 tracking-tight">Novo Colaborador</h1>
        <p className="text-neutral-500 mb-8">Cadastre um membro da equipe para aparecer na página Sobre Nós.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="shrink-0 flex flex-col items-center gap-2">
              <label className="block text-sm font-semibold text-neutral-700 w-full text-center">Foto de Perfil</label>
              <div 
                className="relative w-32 h-32 rounded-full border-2 border-dashed border-neutral-300 bg-neutral-50 overflow-hidden group cursor-pointer hover:border-hi-blue transition-colors flex items-center justify-center shrink-0"
                onClick={() => document.getElementById('imageUpload')?.click()}
              >
                {imagePreview ? (
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                ) : (
                  <div className="text-neutral-400 flex flex-col items-center gap-1">
                    <Camera size={24} />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Upload</span>
                  </div>
                )}
                {imagePreview && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={24} className="text-white" />
                  </div>
                )}
              </div>
              <input 
                id="imageUpload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageChange}
              />
            </div>

            <div className="flex-1 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Nome Completo</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome do colaborador"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-hi-blue focus:ring-1 focus:ring-hi-blue"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Cargo / Função na Empresa</label>
                <input 
                  type="text" 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Ex: Corretor Associado, Engenheiro Civil"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-hi-blue focus:ring-1 focus:ring-hi-blue"
                  required
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-100 flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-hi-blue hover:bg-[#347Ab7] text-white font-bold px-8 py-3 rounded-lg shadow-sm transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <><Loader2 size={18} className="animate-spin mr-2" /> Salvando...</> : "Salvar Colaborador"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
