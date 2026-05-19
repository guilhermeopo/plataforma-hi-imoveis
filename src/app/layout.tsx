import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const neueMontreal = localFont({
  src: [
    {
      path: './fonts/Neue Montreal/NeueMontreal-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/Neue Montreal/NeueMontreal-LightItalic.otf',
      weight: '300',
      style: 'italic',
    },
    {
      path: './fonts/Neue Montreal/NeueMontreal-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Neue Montreal/NeueMontreal-Italic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: './fonts/Neue Montreal/NeueMontreal-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/Neue Montreal/NeueMontreal-MediumItalic.otf',
      weight: '500',
      style: 'italic',
    },
    {
      path: './fonts/Neue Montreal/NeueMontreal-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/Neue Montreal/NeueMontreal-BoldItalic.otf',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--font-neue-montreal',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "HI Imóveis | Conectando você ao imóvel dos seus sonhos",
  description: "Especialistas em Venda de Imóveis, Empreendimentos, Construções e Lotes de Alto Padrão no Acre. CRECI J 074",
  icons: {
    icon: '/logobranca.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body
        className={`${neueMontreal.variable} font-sans antialiased overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
