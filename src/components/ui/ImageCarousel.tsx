"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, Expand } from "lucide-react";

export function ImageCarousel({
  mainImage,
  gallery,
  title
}: {
  mainImage: string;
  gallery: string[] | null;
  title: string;
}) {
  const allImages = [mainImage, ...(gallery || [])].filter(Boolean);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fecha modal com a tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
      if (isModalOpen && e.key === "ArrowRight") nextImage();
      if (isModalOpen && e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, allImages.length]);

  if (allImages.length === 0) return null;

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % allImages.length);
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);

  return (
    <div className="relative w-full h-full group">
      {allImages.map((img, idx) => (
         <img 
          key={img}
          src={img} 
          alt={`${title} - foto ${idx + 1}`}
          onClick={() => setIsModalOpen(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out cursor-pointer ${idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        />
      ))}
      
      {/* Botão de Ampliar (Visível no Hover) */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="absolute bottom-6 right-6 z-20 p-3 rounded-full bg-black/50 text-white hover:bg-black/80 backdrop-blur-md transition-all shadow-lg opacity-0 group-hover:opacity-100"
        title="Ampliar Foto"
      >
        <Expand size={24} />
      </button>

      {allImages.length > 1 && (
        <>
          <button 
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/30 text-white hover:bg-hi-blue hover:scale-110 backdrop-blur-md transition-all border border-white/30 shadow-lg"
          >
            <ChevronLeft size={28} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/30 text-white hover:bg-hi-blue hover:scale-110 backdrop-blur-md transition-all border border-white/30 shadow-lg"
          >
            <ChevronRight size={28} />
          </button>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 overflow-hidden px-4 md:px-0">
            {allImages.map((_, idx) => (
              <button 
                key={idx}
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                className={`h-2.5 rounded-full transition-all shadow-md ${idx === currentIndex ? 'bg-hi-blue w-8' : 'bg-white/70 hover:bg-white w-2.5'}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Lightbox / Modal em Tela Cheia */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm">
          <button 
            onClick={() => setIsModalOpen(false)}
            className="absolute top-6 right-6 md:top-8 md:right-8 z-[110] p-2 text-white/70 hover:text-white transition-colors"
          >
            <X size={40} />
          </button>
          
          <img 
            src={allImages[currentIndex]} 
            alt={`${title} - foto ampliada ${currentIndex + 1}`}
            className="max-w-[95vw] max-h-[90vh] object-contain select-none"
          />

          {allImages.length > 1 && (
            <>
              <button 
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-2 md:left-12 top-1/2 -translate-y-1/2 z-[110] p-4 text-white/50 hover:text-white transition-colors"
                title="Foto Anterior"
              >
                <ChevronLeft size={64} strokeWidth={1} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-2 md:right-12 top-1/2 -translate-y-1/2 z-[110] p-4 text-white/50 hover:text-white transition-colors"
                title="Próxima Foto"
              >
                <ChevronRight size={64} strokeWidth={1} />
              </button>
            </>
          )}
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm tracking-widest font-sans z-[110]">
            {currentIndex + 1} / {allImages.length}
          </div>
        </div>
      )}
    </div>
  );
}
