import Link from "next/link";
import Image from "next/image";
import { BedDouble, AreaChart, Star, ArrowRight } from "lucide-react";
import { type ArchitecturalPlan } from "@/lib/supabase";

const styleColors: Record<string, string> = {
  "Moderno": "bg-sky-100 text-sky-700 border-sky-200",
  "Clássico": "bg-amber-100 text-amber-700 border-amber-200",
  "Rústico": "bg-orange-100 text-orange-700 border-orange-200",
  "Contemporâneo": "bg-violet-100 text-violet-700 border-violet-200",
  "Minimalista": "bg-neutral-100 text-neutral-600 border-neutral-200",
};

export function ArchPlanCard({ plan }: { plan: ArchitecturalPlan }) {
  const styleClass = styleColors[plan.style] || "bg-neutral-100 text-neutral-600 border-neutral-200";

  return (
    <Link href={`/projetos-prontos/${plan.id}`} className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-neutral-200 hover:border-[#FFB800]/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-[#FFB800]/10">

      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
        <Image
          src={plan.main_image_url}
          alt={plan.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Style Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className={`px-3 py-1 text-xs font-bold rounded-full border ${styleClass}`}>
            {plan.style}
          </span>
        </div>

        {/* Bottom Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
          <div className="flex items-center gap-3 text-white text-sm">
            <span className="flex items-center gap-1 font-semibold bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg">
              <AreaChart size={14} />
              {plan.area_m2} m²
            </span>
            <span className="flex items-center gap-1 font-semibold bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg">
              <BedDouble size={14} />
              {plan.bedrooms} qts
            </span>
            {plan.suites > 0 && (
              <span className="flex items-center gap-1 font-semibold bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg">
                <Star size={14} />
                {plan.suites} suíte{plan.suites > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-neutral-800 leading-snug line-clamp-2 mb-1 group-hover:text-[#FFB800] transition-colors">
          {plan.title}
        </h3>
        <p className="text-sm text-neutral-500 line-clamp-2 mb-4 flex-1">
          {plan.description}
        </p>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-100">
          <div>
            <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider">A partir de</p>
            <p className="text-xl font-black text-[#FFB800]">
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 }).format(plan.price)}
            </p>
          </div>
          <span className="flex items-center gap-1.5 text-sm font-bold text-neutral-600 group-hover:text-[#FFB800] transition-colors">
            Ver Planta <ArrowRight size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
}
