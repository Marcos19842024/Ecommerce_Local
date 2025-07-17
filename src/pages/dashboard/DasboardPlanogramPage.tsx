import React, { useEffect, useRef, useState } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface Product {
  id: string;
  name: string;
  color: string;
  image?: string;
  price?: number;
  stock?: number;
}

interface Category {
  id: string;
  name: string;
  products: (Product | null)[];
  rows: number;
  columns: number;
}

const DraggableProduct: React.FC<{
  product: Product;
  index: number;
  onClick: (product: Product, index: number) => void;
}> = ({ product, index, onClick }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "PRODUCT",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      onClick={() => onClick(product, index)}
      className="w-full h-full flex items-center justify-center rounded cursor-pointer overflow-hidden select-none"
      style={{
        backgroundColor: product.color,
        opacity: isDragging ? 0.5 : 1,
        position: "relative",
      }}
    >
      {product.image ? (
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          draggable={false}
        />
      ) : (
        <span className="text-white text-xs font-bold z-10">{product.name}</span>
      )}
    </div>
  );
};

const Slot: React.FC<{
  index: number;
  product: Product | null;
  onDropProduct: (from: number, to: number) => void;
  onEdit: (product: Product, index: number) => void;
}> = ({ index, product, onDropProduct, onEdit }) => {
  const [{ isOver }, drop] = useDrop({
    accept: "PRODUCT",
    drop: (item: { index: number }) => onDropProduct(item.index, index),
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  });

  return (
    <div
      ref={drop}
      className={`w-24 h-24 border rounded flex items-center justify-center ${
        isOver ? "bg-green-500" : "bg-gray-700"
      }`}
    >
      {product ? (
        <DraggableProduct product={product} index={index} onClick={onEdit} />
      ) : (
        <span className="text-white text-xs select-none">Vacío</span>
      )}
    </div>
  );
};

const EditProductModal: React.FC<{
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onSave: (updatedProduct: Product) => void;
}> = ({ isOpen, product, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#000000");
  const [image, setImage] = useState<string | undefined>();
  const [price, setPrice] = useState<number | undefined>();
  const [stock, setStock] = useState<number | undefined>();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (product) {
      setName(product.name);
      setColor(product.color);
      setImage(product.image);
      setPrice(product.price);
      setStock(product.stock);
      setError("");
    }
  }, [product]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const validateAndSave = () => {
    if (!name.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    if (price !== undefined && (isNaN(price) || price < 0)) {
      setError("El precio debe ser un número positivo");
      return;
    }
    if (stock !== undefined && (isNaN(stock) || stock < 0)) {
      setError("El stock debe ser un número positivo");
      return;
    }
    setError("");
    onSave({ ...product!, name, color, image, price, stock });
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white text-black p-6 rounded shadow w-full max-w-md max-h-full overflow-auto">
        <h2 className="text-xl font-bold mb-4">Editar Producto</h2>
        <label className="block mb-2">
          Nombre:
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded mt-1"
            autoFocus
          />
        </label>
        <label className="block mb-2">
          Color:
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full h-10 mt-1"
          />
        </label>
        <label className="block mb-2">
          Precio:
          <input
            type="number"
            min={0}
            step="0.01"
            value={price !== undefined ? price : ""}
            onChange={(e) => setPrice(e.target.value === "" ? undefined : parseFloat(e.target.value))}
            className="w-full p-2 border rounded mt-1"
          />
        </label>
        <label className="block mb-2">
          Stock:
          <input
            type="number"
            min={0}
            step="1"
            value={stock !== undefined ? stock : ""}
            onChange={(e) => setStock(e.target.value === "" ? undefined : parseInt(e.target.value))}
            className="w-full p-2 border rounded mt-1"
          />
        </label>
        <label className="block mb-4">
          Imagen:
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full mt-1"
          />
        </label>
        {image && (
          <img
            src={image}
            alt="preview"
            className="w-full h-40 object-contain mb-4 rounded border"
            draggable={false}
          />
        )}
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 rounded hover:bg-gray-500"
          >
            Cancelar
          </button>
          <button
            onClick={validateAndSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

const STORAGE_KEY = "planogramasCategorias";

export const DashboardPlanogramPage: React.FC = () => {
  const loadFromStorage = (): Category[] => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    return [
      {
        id: "cat1",
        name: "Bebidas",
        rows: 3,
        columns: 4,
        products: Array.from({ length: 12 }, (_, i) =>
          i < 6
            ? {
                id: `b-${i}`,
                name: `Bebida ${i + 1}`,
                color: ["#3498db", "#2ecc71", "#e67e22", "#9b59b6", "#f1c40f", "#1abc9c"][i % 6],
                price: undefined,
                stock: undefined,
              }
            : null
        ),
      },
      {
        id: "cat2",
        name: "Snacks",
        rows: 3,
        columns: 5,
        products: Array.from({ length: 15 }, (_, i) =>
          i < 8
            ? {
                id: `s-${i}`,
                name: `Snack ${i + 1}`,
                color: ["#e74c3c", "#8e44ad", "#27ae60", "#f39c12", "#2980b9", "#16a085", "#d35400", "#c0392b"][i % 8],
                price: undefined,
                stock: undefined,
              }
            : null
        ),
      },
    ];
  };

  const [categories, setCategories] = useState<Category[]>(loadFromStorage);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCatIndex, setEditingCatIndex] = useState<number | null>(null);
  const [editingProdIndex, setEditingProdIndex] = useState<number | null>(null);
  const [zoomLevels, setZoomLevels] = useState<number[]>(categories.map(() => 1));

  // NUEVOS estados para filtrado
  const [categoryFilter, setCategoryFilter] = useState("");
  const [productFilters, setProductFilters] = useState<string[]>(
    categories.map(() => "")
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  }, [categories]);

  const refs = useRef<React.RefObject<HTMLDivElement>[]>(
    categories.map(() => React.createRef())
  );

  useEffect(() => {
    if (refs.current.length !== categories.length) {
      refs.current = categories.map(() => React.createRef());
    }
    if (zoomLevels.length !== categories.length) {
      setZoomLevels(categories.map(() => 1));
    }
    if (productFilters.length !== categories.length) {
      setProductFilters(categories.map(() => ""));
    }
  }, [categories]);

  const handleDrop = (catIndex: number, from: number, to: number) => {
    setCategories((cats) => {
      const newCats = [...cats];
      const products = [...newCats[catIndex].products];
      [products[from], products[to]] = [products[to], products[from]];
      newCats[catIndex] = { ...newCats[catIndex], products };
      return newCats;
    });
  };

  const handleEdit = (catIndex: number, product: Product, prodIndex: number) => {
    setEditingProduct(product);
    setEditingCatIndex(catIndex);
    setEditingProdIndex(prodIndex);
  };

  const handleSave = (updated: Product) => {
    if (editingCatIndex === null || editingProdIndex === null) return;
    setCategories((cats) => {
      const newCats = [...cats];
      const products = [...newCats[editingCatIndex].products];
      products[editingProdIndex] = updated;
      newCats[editingCatIndex] = { ...newCats[editingCatIndex], products };
      return newCats;
    });
    setEditingProduct(null);
    setEditingCatIndex(null);
    setEditingProdIndex(null);
  };

  const exportMultiplePlanogramsToPDF = async () => {
    const pdf = new jsPDF("landscape", "px", "a4");
    let firstPage = true;

    for (let i = 0; i < categories.length; i++) {
      const ref = refs.current[i];
      if (!ref || !ref.current) continue;

      const canvas = await html2canvas(ref.current, {
        scale: 3,
        backgroundColor: "#ffffff",
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
      const imgWidth = canvas.width * ratio;
      const imgHeight = canvas.height * ratio;

      if (!firstPage) pdf.addPage();
      firstPage = false;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    }

    pdf.save("planogramas.pdf");
  };

  const handleZoomChange = (catIndex: number, delta: number) => {
    setZoomLevels((z) =>
      z.map((zoom, i) => (i === catIndex ? Math.min(2, Math.max(0.5, zoom + delta)) : zoom))
    );
  };

  // Actualiza filtro de producto por categoría
  const handleProductFilterChange = (catIndex: number, value: string) => {
    setProductFilters((filters) =>
      filters.map((f, i) => (i === catIndex ? value : f))
    );
  };

  // Filtrar categorías por nombre
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(categoryFilter.toLowerCase())
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-800 text-white p-6 space-y-8">
        <h1 className="text-3xl font-bold text-center">Planogramas por Categoría</h1>

        {/* Filtrado global de categorías */}
        <div className="flex justify-center mb-4">
          <input
            type="text"
            placeholder="Filtrar categorías..."
            className="p-2 rounded w-72 text-black"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          />
        </div>

        <div className="flex justify-center mb-6 gap-4">
          <button
            onClick={exportMultiplePlanogramsToPDF}
            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Exportar todos como PDF
          </button>
          <button
            onClick={() => {
              localStorage.removeItem(STORAGE_KEY);
              window.location.reload();
            }}
            className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            title="Eliminar guardado y recargar"
          >
            Resetear planogramas
          </button>
        </div>

        <div className="space-y-12">
          {filteredCategories.length === 0 && (
            <p className="text-center text-gray-400">No hay categorías que coincidan.</p>
          )}
          {filteredCategories.map((cat) => {
            // Obtener índice original para refs, zoom y filtros producto
            const originalIndex = categories.findIndex((c) => c.id === cat.id);
            if (originalIndex === -1) return null;

            // Aplicar filtro a productos
            const productFilter = productFilters[originalIndex] || "";
            const filteredProducts = cat.products.map((p) =>
              p && !p.name.toLowerCase().includes(productFilter.toLowerCase()) ? null : p
            );

            return (
              <div key={cat.id} className="bg-gray-900 p-4 rounded shadow">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold">{cat.name}</h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleZoomChange(originalIndex, -0.1)}
                      className="px-2 py-1 bg-gray-600 rounded hover:bg-gray-700"
                      title="Disminuir zoom"
                    >
                      −
                    </button>
                    <span>{(zoomLevels[originalIndex] * 100).toFixed(0)}%</span>
                    <button
                      onClick={() => handleZoomChange(originalIndex, +0.1)}
                      className="px-2 py-1 bg-gray-600 rounded hover:bg-gray-700"
                      title="Aumentar zoom"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Filtrado de productos */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder={`Filtrar productos en ${cat.name}...`}
                    className="p-2 rounded w-full max-w-xs text-black"
                    value={productFilters[originalIndex] || ""}
                    onChange={(e) => handleProductFilterChange(originalIndex, e.target.value)}
                  />
                </div>

                <div
                  ref={refs.current[originalIndex]}
                  className="grid gap-1 p-4 bg-white text-black rounded-lg shadow mx-auto"
                  style={{
                    gridTemplateColumns: `repeat(${cat.columns}, 6rem)`,
                    gridTemplateRows: `repeat(${cat.rows}, 6rem)`,
                    width: "max-content",
                    transform: `scale(${zoomLevels[originalIndex]})`,
                    transformOrigin: "top center",
                  }}
                >
                  {filteredProducts.map((product, prodIndex) => (
                    <Slot
                      key={prodIndex}
                      index={prodIndex}
                      product={product}
                      onDropProduct={(from, to) => handleDrop(originalIndex, from, to)}
                      onEdit={(product) => handleEdit(originalIndex, product, prodIndex)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <EditProductModal
          isOpen={!!editingProduct}
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleSave}
        />
      </div>
    </DndProvider>
  );
};