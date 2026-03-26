"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Erro ao fazer login");
      }
    } catch {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F1F1F1] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decoração de fundo clean */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-hi-blue/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-fade-in-up flex flex-col items-center">
        <Link href="/" className="flex flex-col items-center justify-center mb-6 gap-4">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center p-2 shadow-lg transition-transform hover:scale-105">
            <img src="/logo.png" alt="Logo HI Imóveis" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[#2C2C2C] font-serif">HI<span className="text-hi-dark-orange ml-2">IMÓVEIS</span></h2>
        </Link>
        <h2 className="text-center text-lg font-medium leading-9 text-neutral-500 mb-8 tracking-wide">
          Acesso Administrativo
        </h2>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-[400px] relative z-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="bg-white py-10 px-8 shadow-2xl rounded-2xl border border-neutral-100">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-neutral-700">
                Senha Administrativa
              </label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoFocus
                  className="block w-full rounded-xl border-0 py-3 pl-10 bg-neutral-50 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-200 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-hi-blue sm:text-sm sm:leading-6 transition-all font-medium pt-3.5 pb-3.5"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm font-medium bg-red-50 px-4 py-2 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center items-center gap-2 rounded-xl bg-hi-blue hover:bg-[rgb(52,122,183)] px-3 py-3.5 text-sm font-semibold text-white shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hi-blue transition-all disabled:opacity-70"
              >
                {loading ? "Entrando..." : "Entrar no Painel"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </div>
          </form>
        </div>
        <p className="text-center text-sm text-neutral-600 mt-6 text-balance">
        </p>
      </div>
    </div>
  );
}
