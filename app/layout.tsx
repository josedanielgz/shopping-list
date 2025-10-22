import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from '@/components/Header';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mi Lista de Compras", // Título actualizado
  description: "Aplicación demo con Next.js y PostgreSQL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      {/* 💡 CLASES CRÍTICAS: 
      - min-h-screen: Asegura que el body ocupe la altura total de la pantalla.
      - flex flex-col: Habilita el layout flexbox en columna.
      - bg-gray-100: Aplica el fondo a toda la página.
      */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-gray-100`}
      >
        <Header /> {/* Header fijo */}
        
        {/* Envuelve el {children} para que ocupe todo el espacio 
           disponible entre el Header y el Footer. */}
        <div className="flex-grow">
            {children}
        </div>
        
        {/* Footer fijo */}
        <footer className="bg-gray-800 text-white py-8 mt-auto">
            <div className="container mx-auto px-4 text-center">
                <p>&copy; 2024 Lista de Compras Demo. Todos los derechos reservados.</p>
                <p className="text-gray-400 mt-2">
                    Aplicación demo con Node.js, Express, TypeScript y PostgreSQL
                </p>
            </div>
        </footer>
      </body>
    </html>
  );
}