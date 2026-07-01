import { PackageSearch } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = "No se encontraron productos",
  description = "Ajusta tu búsqueda o filtro para encontrar lo que buscas.",
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 text-neutral-600">
        {icon || <PackageSearch className="h-16 w-16" />}
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-neutral-400">{description}</p>
    </div>
  );
}
