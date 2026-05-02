"use client";

import { useRef, useState, useEffect } from "react";
import { type Property } from "@/lib/supabase";
import { PropertyCard } from "./PropertyCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface PropertyCarouselProps {
  properties: Property[];
  titleDark: string;
  titleRed: string;
  subtitle: string;
}

export function PropertyCarousel({ properties, titleDark, titleRed, subtitle }: PropertyCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 10);
    }
  };

  useEffect(() => {
    handleScroll();
    const current = scrollContainerRef.current;
    if (current) {
      current.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", handleScroll);
    }
    return () => {
      if (current) current.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [properties]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current;
      const scrollAmount = direction === "left" ? -clientWidth / 1.1 : clientWidth / 1.1;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (properties.length === 0) return null;

  return (
    <section className="pt-16 pb-12 px-6 md:px-12 max-w-7xl mx-auto bg-transparent overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold font-serif mb-2 tracking-tight">
            <span className="text-[#2C2C2C]">{titleDark}</span> <span className="text-[#d3a300]">{titleRed}</span>
          </h2>
          <p className="text-neutral-600">{subtitle}</p>
        </div>
        
        <div className="flex items-center gap-6 hidden md:flex">
          <div className="flex gap-2">
            <button 
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${canScrollLeft ? 'bg-[#d3a300] text-white hover:bg-[#b58c00]' : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'}`}
              aria-label="Scroll left"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${canScrollRight ? 'bg-[#d3a300] text-white hover:bg-[#b58c00]' : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'}`}
              aria-label="Scroll right"
            >
              <ChevronRight size={24} />
            </button>
          </div>
          <Link href="/" className="px-6 py-2 border border-[#d3a300] text-[#d3a300] hover:bg-[#d3a300] hover:text-white rounded-full font-medium transition-colors text-sm">
            Ver Todos os Imóveis
          </Link>
        </div>
      </div>

      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 -mx-6 px-6 md:-mx-12 md:px-12"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {properties.map((property) => (
          <div key={property.id} className="w-[75vw] max-w-[280px] md:max-w-none md:w-[300px] lg:w-[320px] snap-start flex-shrink-0">
            <PropertyCard property={property} />
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex justify-center md:hidden">
          <Link href="/" className="px-6 py-3 border border-[#d3a300] text-[#d3a300] hover:bg-[#d3a300] hover:text-white rounded-full font-medium transition-colors w-full text-center">
            Ver Todos os Imóveis
          </Link>
      </div>
    </section>
  );
}
