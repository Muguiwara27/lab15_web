"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { motion, AnimatePresence } from "framer-motion";
import type { Product, Category } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import {
  Box,
  Bookmark,
  Pen,
  Eraser,
  ScanSearch,
  CirclePlus,
  CircleX,
  FileImage,
  SearchSlash,
  BaggageClaim,
  Columns,
  Wallet,
} from "lucide-react";

function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">{title}</h2>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-white"
              >
                <CircleX className="h-5 w-5" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  gradient,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  gradient: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${gradient}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-xs text-zinc-500">{label}</p>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { isAuthenticated, isAdmin, token, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"products" | "categories">("products");
  const [searchQuery, setSearchQuery] = useState("");

  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const [productForm, setProductForm] = useState({
    nombre: "",
    precio: "",
    descripcion: "",
    imageUrl: "",
    categoryId: "",
  });
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [isProductSubmitting, setIsProductSubmitting] = useState(false);

  const [categoryForm, setCategoryForm] = useState({ name: "", description: "" });
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [isCategorySubmitting, setIsCategorySubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, isAdmin, router]);

  useEffect(() => {
    if (isAdmin && token) {
      fetchData();
    }
  }, [isAdmin, token]);

  const fetchData = async () => {
    setIsDataLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        api.products.getAll(),
        api.categories.getAll(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch {
      showToast("error", "Error al cargar datos");
    } finally {
      setIsDataLoading(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      showToast("error", "Debes iniciar sesión como admin");
      return;
    }
    setIsProductSubmitting(true);

    try {
      const payload = {
        nombre: productForm.nombre,
        precio: parseFloat(productForm.precio),
        descripcion: productForm.descripcion,
        imageUrl: productForm.imageUrl || undefined,
        categoryId: productForm.categoryId ? parseInt(productForm.categoryId) : undefined,
      };

      if (editingProductId) {
        await api.products.update(editingProductId, payload, token);
        showToast("success", "Producto actualizado correctamente");
      } else {
        await api.products.create(payload as any, token);
        showToast("success", "Producto creado correctamente");
      }

      closeProductModal();
      fetchData();
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Operación fallida");
    } finally {
      setIsProductSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!token) return;
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
      await api.products.delete(id, token);
      showToast("success", "Producto eliminado correctamente");
      fetchData();
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Error al eliminar");
    }
  };

  const openNewProductModal = () => {
    setProductForm({ nombre: "", precio: "", descripcion: "", imageUrl: "", categoryId: "" });
    setEditingProductId(null);
    setShowProductModal(true);
  };

  const openEditProductModal = (product: Product) => {
    setProductForm({
      nombre: product.nombre,
      precio: product.precio.toString(),
      descripcion: product.descripcion || "",
      imageUrl: product.imageUrl || "",
      categoryId: product.categoryId?.toString() || "",
    });
    setEditingProductId(product.id);
    setShowProductModal(true);
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setEditingProductId(null);
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      showToast("error", "Debes iniciar sesión como admin");
      return;
    }
    setIsCategorySubmitting(true);

    try {
      if (editingCategoryId) {
        await api.categories.update(editingCategoryId, categoryForm, token);
        showToast("success", "Categoría actualizada correctamente");
      } else {
        await api.categories.create(categoryForm, token);
        showToast("success", "Categoría creada correctamente");
      }

      closeCategoryModal();
      fetchData();
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Operación fallida");
    } finally {
      setIsCategorySubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!token) return;
    if (!confirm("¿Estás seguro? Los productos en esta categoría pueden impedir la eliminación.")) return;

    try {
      await api.categories.delete(id, token);
      showToast("success", "Categoría eliminada correctamente");
      fetchData();
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Error al eliminar");
    }
  };

  const openNewCategoryModal = () => {
    setCategoryForm({ name: "", description: "" });
    setEditingCategoryId(null);
    setShowCategoryModal(true);
  };

  const openEditCategoryModal = (category: Category) => {
    setCategoryForm({
      name: category.name,
      description: category.description || "",
    });
    setEditingCategoryId(category.id);
    setShowCategoryModal(true);
  };

  const closeCategoryModal = () => {
    setShowCategoryModal(false);
    setEditingCategoryId(null);
  };

  const filteredProducts = products.filter((p) =>
    p.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-700 border-t-white" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Administración</h1>
              <p className="mt-1 text-zinc-500 text-sm">
                Panel de control de productos y categorías
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatCard
            icon={BaggageClaim}
            label="Total Productos"
            value={products.length}
            gradient="bg-gradient-to-br from-indigo-600 to-violet-600"
          />
          <StatCard
            icon={Columns}
            label="Categorías"
            value={categories.length}
            gradient="bg-gradient-to-br from-emerald-600 to-teal-600"
          />
          <StatCard
            icon={Wallet}
            label="Valor Total"
            value={products.reduce((sum, p) => sum + Number(p.precio), 0)}
            gradient="bg-gradient-to-br from-amber-600 to-orange-600"
          />
        </div>

        <div className="mb-6 flex items-center justify-between border-b border-zinc-800">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab("products")}
              className={`flex items-center gap-2 pb-3 text-sm font-medium transition-all border-b-2 ${
                activeTab === "products"
                  ? "border-indigo-500 text-white"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Box className="h-4 w-4" />
              Productos
              <span className="ml-1 rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
                {products.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("categories")}
              className={`flex items-center gap-2 pb-3 text-sm font-medium transition-all border-b-2 ${
                activeTab === "categories"
                  ? "border-indigo-500 text-white"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Bookmark className="h-4 w-4" />
              Categorías
              <span className="ml-1 rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
                {categories.length}
              </span>
            </button>
          </div>
        </div>

        {activeTab === "products" ? (
          <>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <ScanSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10"
                />
              </div>
              <Button onClick={openNewProductModal} className="shrink-0">
                <CirclePlus className="h-4 w-4" />
                Nuevo Producto
              </Button>
            </div>

            {isDataLoading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <SearchSlash className="mb-4 h-14 w-14 text-zinc-700" />
                <h3 className="text-lg font-semibold text-white">Sin productos</h3>
                <p className="mt-2 text-sm text-zinc-500">
                  {searchQuery ? "Intenta con otra búsqueda." : "Agrega tu primer producto."}
                </p>
                {!searchQuery && (
                  <Button onClick={openNewProductModal} className="mt-6">
                    <CirclePlus className="h-4 w-4" />
                    Crear Producto
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <div className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900">
                      <div className="aspect-[16/9] overflow-hidden bg-zinc-800">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.nombre}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <FileImage className="h-10 w-10 text-zinc-700" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="mb-3">
                          <h3 className="font-semibold text-white truncate">
                            {product.nombre}
                          </h3>
                          <div className="mt-1 flex items-center gap-2 text-sm">
                            <span className="text-violet-400 font-medium">
                              {formatPrice(Number(product.precio))}
                            </span>
                            <span className="text-zinc-600">&middot;</span>
                            <span className="text-zinc-500">
                              {product.category?.name || "Sin categoría"}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => openEditProductModal(product)}
                            className="flex-1"
                          >
                            <Pen className="h-3.5 w-3.5" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-400 border-red-900/40 hover:bg-red-950/30 hover:text-red-300"
                          >
                            <Eraser className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mb-6 flex justify-end">
              <Button onClick={openNewCategoryModal}>
                <CirclePlus className="h-4 w-4" />
                Nueva Categoría
              </Button>
            </div>

            {isDataLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : categories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Bookmark className="mb-4 h-14 w-14 text-zinc-700" />
                <h3 className="text-lg font-semibold text-white">Sin categorías</h3>
                <p className="mt-2 text-sm text-zinc-500">
                  Crea tu primera categoría para organizar productos.
                </p>
                <Button onClick={openNewCategoryModal} className="mt-6">
                  <CirclePlus className="h-4 w-4" />
                  Crear Categoría
                </Button>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-zinc-800">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-900/50">
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                        Nombre
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                        Descripción
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {categories.map((category) => (
                      <tr
                        key={category.id}
                        className="transition-colors hover:bg-zinc-800/40"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600/20">
                              <Bookmark className="h-3.5 w-3.5 text-indigo-400" />
                            </div>
                            <span className="font-medium text-white">{category.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-zinc-400">
                          {category.description || "Sin descripción"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditCategoryModal(category)}
                            >
                              <Pen className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCategory(category.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            >
                              <Eraser className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </motion.div>

      <Modal
        open={showProductModal}
        onClose={closeProductModal}
        title={editingProductId ? "Editar Producto" : "Nuevo Producto"}
      >
        <form onSubmit={handleProductSubmit} className="space-y-4">
          <Input
            label="Nombre"
            value={productForm.nombre}
            onChange={(e) => setProductForm({ ...productForm, nombre: e.target.value })}
            required
          />
          <Input
            label="Precio"
            type="number"
            step="0.01"
            value={productForm.precio}
            onChange={(e) => setProductForm({ ...productForm, precio: e.target.value })}
            required
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-zinc-400">
              Descripción
            </label>
            <textarea
              value={productForm.descripcion}
              onChange={(e) =>
                setProductForm({ ...productForm, descripcion: e.target.value })
              }
              rows={3}
              className="block w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-sm text-white placeholder-zinc-500 transition-colors focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/20"
            />
          </div>
          <Input
            label="URL de Imagen"
            value={productForm.imageUrl}
            onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
            placeholder="https://..."
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-zinc-400">
              Categoría
            </label>
            <select
              value={productForm.categoryId}
              onChange={(e) =>
                setProductForm({ ...productForm, categoryId: e.target.value })
              }
              className="block w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-sm text-white transition-colors focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/20"
            >
              <option value="">Sin categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="primary" isLoading={isProductSubmitting} className="flex-1">
              {editingProductId ? "Actualizar" : "Crear"}
            </Button>
            <Button type="button" variant="outline" onClick={closeProductModal}>
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={showCategoryModal}
        onClose={closeCategoryModal}
        title={editingCategoryId ? "Editar Categoría" : "Nueva Categoría"}
      >
        <form onSubmit={handleCategorySubmit} className="space-y-4">
          <Input
            label="Nombre"
            value={categoryForm.name}
            onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
            required
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-zinc-400">
              Descripción
            </label>
            <textarea
              value={categoryForm.description}
              onChange={(e) =>
                setCategoryForm({ ...categoryForm, description: e.target.value })
              }
              rows={3}
              className="block w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-sm text-white placeholder-zinc-500 transition-colors focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/20"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="primary" isLoading={isCategorySubmitting} className="flex-1">
              {editingCategoryId ? "Actualizar" : "Crear"}
            </Button>
            <Button type="button" variant="outline" onClick={closeCategoryModal}>
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
