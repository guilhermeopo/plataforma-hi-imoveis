"use client";

import { useState } from "react";
import { PropertyCard } from "./PropertyCard";
import { Property } from "@/lib/supabase";
import Link from "next/link";

interface PropertyGridProps {
  properties: Property[];
  title: string;
  subtitle: string;
  id: string;
  emptyMessage: string;
  viewAllLink?: string;
}

export function PropertyGrid({ properties, title, subtitle, id, emptyMessage, viewAllLink }: PropertyGridProps) {
  const [visibleCount, setVisibleCount] = useState(6);

  if (properties.length === 0) {
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
        <div className="flex items-center gap-4">
          {viewAllLink && (
            <Link href={viewAllLink} className="text-sm font-bold text-neutral-600 hover:text-hi-blue uppercase transition-colors">
              Ver Todos →
            </Link>
          )}
          <div className="text-sm font-bold tracking-wider text-hi-blue uppercase bg-white px-5 py-2.5 rounded-full border border-neutral-200 shadow-sm whitespace-nowrap">
            {properties.length} {properties.length === 1 ? 'disponível' : 'disponíveis'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.slice(0, visibleCount).map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {visibleCount < properties.length && (
        <div className="mt-16 flex justify-center text-center animate-fade-in-up">
          <button 
            onClick={() => setVisibleCount(prev => prev + 6)}
            className="group relative inline-flex items-center justify-center px-10 py-4 text-sm font-bold uppercase tracking-widest text-[#2C2C2C] bg-white border-2 border-neutral-200 rounded-full overflow-hidden shadow-sm transition-all hover:border-hi-blue hover:text-hi-blue hover:shadow-md"
          >
            <span className="relative">
              Ver mais ({properties.length - visibleCount} ocultos)
            </span>
          </button>
        </div>
      )}
    </section>
  );
}
