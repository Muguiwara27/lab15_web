import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/components/ui/Toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Marketplace Pro - Productos Premium",
    template: "%s | Marketplace Pro",
  },
  description:
    "Descubre productos premium seleccionados para ti. Marketplace Pro ofrece la mejor selección con diseño moderno y experiencia fluida.",
  openGraph: {
    title: "Marketplace Pro - Productos Premium",
    description:
      "Descubre productos premium seleccionados para ti. Marketplace Pro ofrece la mejor selección con diseño moderno y experiencia fluida.",
    type: "website",
    siteName: "Marketplace Pro",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-neutral-950 text-white antialiased`}>
        <AuthProvider>
          <ToastProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
            </div>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
