"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { LayoutDashboard, PlusCircle, LogOut, Home } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }
  return (
    <div className="min-h-screen bg-[#F1F1F1] text-neutral-800 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col hidden md:flex shadow-sm">
        <div className="p-6 flex items-center gap-3 border-b border-neutral-800/50 pb-8">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1 cursor-pointer hover:scale-105 transition-transform">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-xl font-bold tracking-tighter text-white">
            HI<span className="text-[#D4AF37] ml-1.5">IMÓVEIS</span>
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-50 text-neutral-600 hover:text-hi-blue font-medium transition-colors">
            <LayoutDashboard size={20} />
            Gerenciar Imóveis
          </Link>
          <Link href="/admin/add" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-50 text-neutral-600 hover:text-hi-blue font-medium transition-colors">
            <PlusCircle size={20} />
            Adicionar Novo
          </Link>
          <hr className="border-neutral-200 my-4" />
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-50 text-neutral-600 hover:text-hi-blue font-medium transition-colors">
            <Home size={20} />
            Ver Vitrine Publica
          </Link>
        </nav>

        <div className="p-4 border-t border-neutral-200">
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 text-red-500 font-medium transition-colors"
          >
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 w-full bg-white border-t border-neutral-200 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] flex items-center justify-around py-3 px-2 z-50">
        <Link href="/admin" className="flex flex-col items-center gap-1.5 p-2 text-neutral-500 hover:text-hi-blue transition-colors">
          <LayoutDashboard size={22} className="text-hi-blue" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#2C2C2C]">Início</span>
        </Link>
        <Link 
          href="/admin/add" 
          className="flex flex-col items-center justify-center -mt-6 gap-1 shadow-xl bg-gradient-to-br from-hi-blue to-[#347Ab7] text-white p-4 rounded-full hover:scale-105 transition-transform"
        >
          <PlusCircle size={28} />
          <span className="sr-only">Novo</span>
        </Link>
        <button onClick={handleLogout} className="flex flex-col items-center gap-1.5 p-2 text-neutral-400 hover:text-red-500 transition-colors">
          <LogOut size={22} />
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#2C2C2C]">Sair</span>
        </button>
      </nav>
    </div>
  );
}
