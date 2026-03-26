"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

  if (allImages.length === 0) return null;

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % allImages.length);
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);

  return (
    <>
      {allImages.map((img, idx) => (
         <img 
          key={img}
          src={img} 
          alt={`${title} - foto ${idx + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${idx === currentIndex ? 'opacity-100 z-0' : 'opacity-0 -z-10'}`}
        />
      ))}
      
      {allImages.length > 1 && (
        <>
          <button 
            onClick={prevImage}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/30 text-white hover:bg-hi-blue hover:scale-110 backdrop-blur-md transition-all border border-white/30 shadow-lg"
          >
            <ChevronLeft size={28} />
          </button>
          <button 
            onClick={nextImage}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/30 text-white hover:bg-hi-blue hover:scale-110 backdrop-blur-md transition-all border border-white/30 shadow-lg"
          >
            <ChevronRight size={28} />
          </button>
          
          <div className="absolute bottom-36 left-1/2 -translate-x-1/2 z-30 flex gap-2 overflow-hidden px-4 md:px-0">
            {allImages.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 rounded-full transition-all shadow-md ${idx === currentIndex ? 'bg-hi-blue w-8' : 'bg-white/70 hover:bg-white w-2.5'}`}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}
