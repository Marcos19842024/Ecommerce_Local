import { useEffect, useMemo, useRef, useState } from "react";
import Tree from "react-d3-tree";
import toast, { Toaster } from "react-hot-toast";
import { url } from "../server/url";

interface OrgNode {
  id?: string;
  name: string;
  attributes?: { puesto?: string };
  children?: OrgNode[];
}

const uid = () => Math.random().toString(36).slice(2, 9);
const withIds = (node: OrgNode): OrgNode => ({
  ...node,
  id: node.id ?? uid(),
  children: node.children?.map(withIds) ?? [],
});

export default function OrgChartInteractive() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [treeData, setTreeData] = useState<OrgNode | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPuesto, setEditPuesto] = useState("");
  const [translate, setTranslate] = useState({ x: 0, y: 100 });
  const [zoom, setZoom] = useState(0.7);

  // 🌐 Cargar datos iniciales
useEffect(() => {
  fetch(`${url}orgchart`)
    .then((res) => {
      console.log("Respuesta cruda:", res);
      if (!res.ok) throw new Error("Error en la respuesta");
      return res.json();
    })
    .then((data: OrgNode) => {console.log("JSON recibido:", data);setTreeData(withIds(data))})
    .catch((err) => {console.error("Error al cargar organigrama:", err);toast.error("Error al cargar organigrama");
});
}, []);

// Centrar árbol
useEffect(() => {
  const center = () => {
    const dims = containerRef.current?.getBoundingClientRect();
    if (dims) setTranslate({ x: dims.width / 2, y: 100 });
  };
  center();
  const ro = new ResizeObserver(center);
  if (containerRef.current) ro.observe(containerRef.current);
  return () => ro.disconnect();
}, []);

// Guardar cambios en backend
const saveTree = async (tree: OrgNode) => {
  try {
    const res = await fetch(`${url}/orgchart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tree),
    });

    if (!res.ok) throw new Error("Error al guardar");

    setTreeData(tree);
    toast.success("Cambios guardados correctamente");
  } catch {
    toast.error("Error al guardar organigrama");
  }
};

  // Funciones de árbol
  const findNode = (node: OrgNode, id: string): OrgNode | null => {
    if (node.id === id) return node;
    for (const child of node.children ?? []) {
      const found = findNode(child, id);
      if (found) return found;
    }
    return null;
  };

  const updateNode = (node: OrgNode, id: string, updates: Partial<OrgNode>): OrgNode => {
    if (node.id === id) return { ...node, ...updates };
    return { ...node, children: node.children?.map((c) => updateNode(c, id, updates)) ?? [] };
  };

  const removeNode = (node: OrgNode, id: string): OrgNode | null => {
    if (node.id === id) return null;
    return { ...node, children: node.children?.map((c) => removeNode(c, id)).filter(Boolean) as OrgNode[] };
  };

  // Acciones
  const addChild = () => {
    if (!treeData || !selectedId) return;
    const name = prompt("Nombre del nuevo nodo") || "Nuevo Nodo";
    const newNode: OrgNode = { id: uid(), name, attributes: { puesto: "—" }, children: [] };
    const updated = updateNode(treeData, selectedId, {
      children: [...(findNode(treeData, selectedId)?.children ?? []), newNode],
    });
    saveTree(updated);
  };

  const renameNode = () => {
    if (!treeData || !selectedId) return;
    const name = prompt("Nuevo nombre", findNode(treeData, selectedId)?.name ?? "");
    if (!name) return;
    const updated = updateNode(treeData, selectedId, { name });
    saveTree(updated);
  };

  const editNode = () => {
    if (!treeData || !selectedId) return;
    const updated = updateNode(treeData, selectedId, { name: editName, attributes: { puesto: editPuesto } });
    saveTree(updated);
    setSelectedId(null);
  };

  const deleteNode = () => {
    if (!treeData || !selectedId) return;
    if (selectedId === treeData.id) return toast.error("No puedes eliminar la raíz");
    if (!confirm("¿Eliminar este nodo y sus hijos?")) return;
    const updated = removeNode(treeData, selectedId);
    if (updated) saveTree(updated);
    setSelectedId(null);
  };

  // Renderizado de nodo
  const renderNode = ({ nodeDatum, toggleNode }: any) => (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setSelectedId(nodeDatum.id);
        setEditName(nodeDatum.name);
        setEditPuesto(nodeDatum.attributes?.puesto ?? "");
      }}
      className={`rounded-xl p-3 shadow-md cursor-pointer bg-white ${
        selectedId === nodeDatum.id ? "ring-2 ring-cyan-500" : ""
      }`}
    >
      <div className="font-semibold">{nodeDatum.name}</div>
      <div className="text-xs text-gray-500">{nodeDatum.attributes?.puesto}</div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleNode();
        }}
        className="mt-2 text-xs bg-gray-100 px-2 py-1 rounded"
      >
        Toggle
      </button>
    </div>
  );

  const dataMemo = useMemo(() => (treeData ? [treeData] : []), [treeData]);

  return (
    <div className="h-screen w-full bg-gray-50 text-gray-800">
      <Toaster position="top-right" reverseOrder={false} />
      {/* Barra superior */}
      <div className="p-4 border-b bg-white sticky top-0 z-10 flex flex-wrap items-center gap-2">
        <div className="text-lg font-semibold mr-auto">Organigrama interactivo</div>
        <div className="flex items-center gap-2">
          <button onClick={addChild} className="px-3 py-2 border rounded bg-white hover:bg-gray-50">Añadir hijo</button>
          <button onClick={renameNode} className="px-3 py-2 border rounded bg-white hover:bg-gray-50">Renombrar</button>
          <button onClick={editNode} className="px-3 py-2 border rounded bg-white hover:bg-gray-50">Guardar edición</button>
          <button onClick={deleteNode} className="px-3 py-2 border rounded bg-white hover:bg-gray-50">Eliminar</button>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <label>Zoom</label>
          <input type="range" min={0.3} max={1.5} step={0.05} value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} />
        </div>
      </div>

      {/* Área del árbol */}
      <div ref={containerRef} className="h-[calc(100vh-72px)] w-full">
        {treeData && (
          <Tree
            data={dataMemo}
            translate={translate}
            zoom={zoom}
            collapsible
            zoomable
            nodeSize={{ x: 200, y: 120 }}
            separation={{ siblings: 1, nonSiblings: 1.2 }}
            renderCustomNodeElement={renderNode}
          />
        )}
      </div>
    </div>
  );
}