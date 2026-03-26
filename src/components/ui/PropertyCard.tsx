"use client";

import { useRef } from "react";
import Link from "next/link";
import { type Property } from "@/lib/supabase";
import { Play, MapPin } from "lucide-react";

export function PropertyCard({ property }: { property: Property }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (videoRef.current && property.video_url && property.video_url.endsWith(".mp4")) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current && property.video_url && property.video_url.endsWith(".mp4")) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <Link 
      href={`/property/${property.id}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-neutral-200 hover:border-neutral-300 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-hi-blue/10 cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative aspect-[4/3] w-full bg-neutral-800 overflow-hidden">
        {/* If available and mp4, we load the video in background to play on hover */}
        {property.video_url?.endsWith(".mp4") && (
          <video 
            ref={videoRef}
            src={property.video_url}
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
          />
        )}
        
        {/* Fallback image, fades out slightly when video plays */}
        <img 
          src={property.main_image_url} 
          alt={property.title} 
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:opacity-50"
        />

        {/* Video Icon Indicator */}
        {property.video_url && !property.video_url.endsWith(".mp4") && (
          <div className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-md p-2 rounded-full text-white shadow-lg">
            <Play size={16} className="fill-white" />
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-4 left-4 z-20">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-md shadow-lg ${
            property.status === 'Available' ? 'bg-white/95 text-hi-blue border border-hi-blue/30' : 'bg-white/95 text-hi-dark-orange border border-hi-dark-orange/30'
          }`}>
            {property.status === 'Available' ? 'Disponível' : 'Vendido'}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-semibold text-hi-orange uppercase tracking-wider">
            {property.type === 'Sale' ? 'Venda' : 'Aluguel'}
          </span>
          <span className="text-lg font-bold text-hi-blue tracking-tight">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.price)}
          </span>
        </div>
        <h3 className="text-xl font-bold text-neutral-800 leading-snug line-clamp-2 mt-1 mb-2 group-hover:text-hi-blue transition-colors font-serif">
          {property.title}
        </h3>
        {property.location && (
          <div className="flex items-center text-neutral-500 text-sm mt-1">
            <MapPin size={14} className="mr-1.5 text-hi-orange" />
            <span className="truncate">{property.location}</span>
          </div>
        )}
        <p className="mt-auto text-sm text-neutral-500 line-clamp-2">
          {property.description}
        </p>
      </div>
    </Link>
  );
}
