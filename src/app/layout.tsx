import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HI Imóveis | Conectando você ao imóvel dos seus sonhos",
  description: "Especialistas em Venda de Imóveis, Empreendimentos, Construções e Lotes de Alto Padrão no Acre. CRECI J 074",
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${playfair.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
