import Link from "next/link";
import { Store } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600">
                <Store className="h-4 w-4 text-white" />
              </div>
              <span className="text-base font-semibold text-white">
                Marketplace<span className="text-neutral-500">Pro</span>
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">
              Productos premium seleccionados para ti. Construido con Next.js, Express y MySQL.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Enlaces Rápidos</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/" className="text-sm text-neutral-400 transition-colors hover:text-white">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-sm text-neutral-400 transition-colors hover:text-white">
                  Productos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Tecnologías</h3>
            <ul className="mt-3 space-y-2">
              <li className="text-sm text-neutral-400">Next.js 15 + TypeScript</li>
              <li className="text-sm text-neutral-400">Express + Sequelize</li>
              <li className="text-sm text-neutral-400">MySQL + JWT Auth</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-neutral-800 pt-6 text-center">
          <p className="text-xs text-neutral-500">
            &copy; {new Date().getFullYear()} Marketplace Pro. Construido con fines educativos.
          </p>
        </div>
      </div>
    </footer>
  );
}
