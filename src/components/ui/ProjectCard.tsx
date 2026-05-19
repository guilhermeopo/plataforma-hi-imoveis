"use client";

import { useRef } from "react";
import Link from "next/link";
import { type Project } from "@/lib/supabase";
import { Play, MapPin, Building2, Hammer, CheckCircle, Flag } from "lucide-react";
import Image from "next/image";

export function ProjectCard({ project }: { project: Project }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (videoRef.current && project.video_url && project.video_url.endsWith(".mp4")) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current && project.video_url && project.video_url.endsWith(".mp4")) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const statusMap = {
    'Launch': { label: 'Lançamento', icon: <Flag size={14} />, classes: 'bg-white/95 text-hi-dark-orange border-hi-dark-orange/30' },
    'InProgress': { label: 'Em Obras', icon: <Hammer size={14} />, classes: 'bg-white/95 text-hi-blue border-hi-blue/30' },
    'Ready': { label: 'Pronto para Morar', icon: <CheckCircle size={14} />, classes: 'bg-white/95 text-emerald-600 border-emerald-600/30' },
  };

  const projectStatus = statusMap[project.status];

  return (
    <Link 
      href={`/project/${project.id}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-neutral-200 hover:border-neutral-300 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-[#d95d29]/10 cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative aspect-[4/3] w-full bg-neutral-800 overflow-hidden">
        {project.video_url?.endsWith(".mp4") && (
          <video 
            ref={videoRef}
            src={project.video_url}
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
          />
        )}
        
        <Image 
          src={project.main_image_url} 
          alt={project.title} 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:opacity-50"
        />

        {project.video_url && !project.video_url.endsWith(".mp4") && (
          <div className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-md p-2 rounded-full text-white shadow-lg">
            <Play size={16} className="fill-white" />
          </div>
        )}

        <div className="absolute top-4 left-4 z-20">
          <span className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-md shadow-lg border ${projectStatus.classes}`}>
            {projectStatus.icon} {projectStatus.label}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div className="flex flex-col gap-1 items-start">
            <span className="text-xs font-semibold text-[#d95d29] uppercase tracking-wider flex items-center gap-1">
              <Building2 size={14} /> Empreendimento
            </span>
            {project.code && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest text-neutral-500 bg-neutral-100 border border-neutral-200">
                {project.code}
              </span>
            )}
          </div>
        </div>
        <h3 className="text-xl font-bold text-neutral-800 leading-snug line-clamp-2 mt-1 mb-2 group-hover:text-[#d95d29] transition-colors font-serif">
          {project.title}
        </h3>
        {project.location && (
          <div className="flex items-center text-neutral-500 text-sm mt-1">
            <MapPin size={14} className="mr-1.5 text-[#FFB800]" />
            <span className="truncate">{project.location}</span>
          </div>
        )}
        <div className="mt-auto pt-4 border-t border-neutral-100 flex flex-col">
          {project.features && project.features.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {project.features.slice(0, 3).map(feature => (
                <span key={feature} className="text-[10px] px-2 py-1 bg-neutral-100 text-neutral-600 font-medium rounded-md border border-neutral-200/60 truncate max-w-[100px]">
                  {feature}
                </span>
              ))}
              {project.features.length > 3 && (
                <span className="text-[10px] px-2 py-1 bg-neutral-100 text-neutral-500 font-medium rounded-md border border-neutral-200/60">
                  +{project.features.length - 3}
                </span>
              )}
            </div>
          )}
          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-0.5">A partir de</span>
          <span className="text-xl font-extrabold text-[#d95d29] tracking-tight">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(project.price_starts_at)}
          </span>
          {project.stage && (
             <span className="text-xs text-[#2C2C2C] font-semibold mt-1.5 bg-[#FFB800]/10 px-2.5 py-1 rounded-md w-fit border border-[#FFB800]/20">{project.stage}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
