"use client";

import { useState } from "react";
import { ProjectCard } from "./ProjectCard";
import { Project } from "@/lib/supabase";

interface ProjectGridProps {
  projects: Project[];
  title: string;
  subtitle: string;
  id: string;
  emptyMessage: string;
}

export function ProjectGrid({ projects, title, subtitle, id, emptyMessage }: ProjectGridProps) {
  const [visibleCount, setVisibleCount] = useState(6);

  if (projects.length === 0) {
    return (
      <section id={id} className="pt-16 pb-12 px-6 md:px-12 max-w-7xl mx-auto bg-transparent">
        <div className="mb-12 border-t border-neutral-200 pt-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2C2C2C] font-serif mb-2 tracking-tight">{title}</h2>
          <p className="text-neutral-600">{subtitle}</p>
        </div>
        <div className="text-center py-10 opacity-60">
          <p className="text-neutral-600 text-lg">{emptyMessage}</p>
        </div>
      </section>
    );
  }

  return (
    <section id={id} className="pt-16 pb-12 px-6 md:px-12 max-w-7xl mx-auto bg-transparent">
      <div className="flex flex-col md:flex-row justify-between md:items-end mb-12 gap-4 border-t border-neutral-200 pt-12 first:border-0 first:pt-0">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#2C2C2C] font-serif mb-2 tracking-tight">{title}</h2>
          <p className="text-neutral-600">{subtitle}</p>
        </div>
        <div className="text-sm font-bold tracking-wider text-[#d95d29] uppercase bg-white px-5 py-2.5 rounded-full border border-[#d95d29]/20 shadow-sm whitespace-nowrap">
          {projects.length} {projects.length === 1 ? 'lançamento' : 'lançamentos'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.slice(0, visibleCount).map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {visibleCount < projects.length && (
        <div className="mt-16 flex justify-center text-center animate-fade-in-up">
          <button 
            onClick={() => setVisibleCount(prev => prev + 6)}
            className="group relative inline-flex items-center justify-center px-10 py-4 text-sm font-bold uppercase tracking-widest text-[#2C2C2C] bg-white border-2 border-neutral-200 rounded-full overflow-hidden shadow-sm transition-all hover:border-[#d95d29] hover:text-[#d95d29] hover:shadow-md"
          >
            <span className="relative">
              Ver mais ({projects.length - visibleCount} ocultos)
            </span>
          </button>
        </div>
      )}
    </section>
  );
}
