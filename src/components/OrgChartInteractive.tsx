import { useEffect, useMemo, useRef, useState } from "react";
import Tree from "react-d3-tree";
import toast from "react-hot-toast";
import { url } from "../server/url";
import FileGallery from "./FileGallery";
import { SiAwsorganizations } from "react-icons/si";
import { RiDeleteBin2Line } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { LiaUserEditSolid } from "react-icons/lia";

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
  const [zoom, setZoom] = useState(0.2);
  const [showFiles, setShowFiles] = useState(true);

  // 🌐 Cargar datos iniciales
  useEffect(() => {
    fetch(`${url}orgchart`)
      .then((res) => {
        if (!res.ok) throw new Error("Error en la respuesta");
        return res.json()
      })
      .then((data: OrgNode) => setTreeData(withIds(data)))
      .catch(() => toast.error("Error al cargar organigrama"));
  }, []);

  useEffect(() => {
    if (treeData) {
      // Pequeño delay para asegurar el renderizado
      setTimeout(() => {
        setZoom(0.85);
      }, 100);
    }
  }, [treeData]);

  // Centrar árbol
  useEffect(() => {
    const center = () => {
      const dims = containerRef.current?.getBoundingClientRect();
      if (dims) {
        // Ajusta la posición Y para centrar mejor
        setTranslate({ x: dims.width / 2, y: dims.height / 3 });
      }
    };
    center();
    const ro = new ResizeObserver(center);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Guardar cambios en backend
  const saveTree = async (tree: OrgNode) => {
    try {
      const res = await fetch(`${url}orgchart`, {
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
    const newNode: OrgNode = { id: uid(), name, attributes: { puesto: "?" }, children: [] };
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
    const puesto = prompt("Nuevo puesto", findNode(treeData, selectedId)?.attributes?.puesto ?? "");
    if (!puesto) return;
    const updated = updateNode(treeData, selectedId, { name: editName, attributes: { puesto: puesto } });
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
    <g>
      {/* Fondo del nodo */}
      <rect
        width="200"
        height="100"
        x="-100"
        y="-40"
        fill="white"
        stroke={selectedId === nodeDatum.id ? "#06b6d4" : "#ddd"}
        strokeWidth={selectedId === nodeDatum.id ? "2" : "1"}
        rx="10"
        onClick={(e) => {
          e.stopPropagation();
          setSelectedId(nodeDatum.id);
          setEditName(nodeDatum.name);
          setEditPuesto(nodeDatum.attributes?.puesto ?? "");
          setShowFiles(true);
        }}
        style={{ cursor: "pointer" }}
      />
      
      {/* Contenido del nodo */}
      <text
        textAnchor="middle"
        dy="-15"
        fontSize="14"
        fill="#1f2937"
        onClick={(e) => {
          e.stopPropagation();
          setSelectedId(nodeDatum.id);
          setEditName(nodeDatum.name);
          setEditPuesto(nodeDatum.attributes?.puesto ?? "");
          setShowFiles(true);
        }}
        style={{ cursor: "pointer" }}
      >
        {nodeDatum.name}
      </text>
      
      <text
        textAnchor="middle"
        dy="15"
        fontSize="10"
        fill="#6b7280"
        onClick={(e) => {
          e.stopPropagation();
          setSelectedId(nodeDatum.id);
          setEditName(nodeDatum.name);
          setEditPuesto(nodeDatum.attributes?.puesto ?? "");
          setShowFiles(true);
        }}
        style={{ cursor: "pointer" }}
      >
        {nodeDatum.attributes?.puesto || "?"}
      </text>
      
      {/* Botón toggle */}
      <circle
        r="15"
        cx="80"
        cy="40"
        fill={selectedId === nodeDatum.id ? "#fbbf24" : "#06b6d4"}
        stroke="#9ca3af"
        strokeWidth="1"
        onClick={(e) => {
          e.stopPropagation();
          toggleNode();
        }}
        style={{ cursor: "pointer" }}
      />
      <text
        textAnchor="middle"
        dy="45"
        dx="80"
        fontSize="12"
        fill="white"
        onClick={(e) => {
          e.stopPropagation();
          toggleNode();
        }}
        style={{ cursor: "pointer" }}
      >
        + / -
      </text>
    </g>
  );
  
  const dataMemo = useMemo(() => (treeData ? [treeData] : []), [treeData]);
  const handleModalContainerClick = (e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation();

  return (
    <>
      <div className="h-screen w-full bg-gray-50 text-gray-800">
        {/* Barra superior */}
        <div className="p-4 border-b bg-white sticky top-0 z-10 flex flex-wrap items-center gap-2">
          <div className="text-lg font-semibold mr-auto">Organigrama interactivo</div>
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-2 p-2 rounded-md text-white bg-cyan-600 hover:bg-yellow-500 hover:scale-105 transition-all"
              type="button"
              onClick={addChild}
            >
              <SiAwsorganizations />Añadir Puesto
            </button>
            <button
              className="flex items-center gap-2 p-2 rounded-md text-white bg-cyan-600 hover:bg-yellow-500 hover:scale-105 transition-all"
              type="button"
              onClick={renameNode}
            >
              <LiaUserEditSolid />Editar Nombre
            </button>
            <button
              className="flex items-center gap-2 p-2 rounded-md text-white bg-cyan-600 hover:bg-yellow-500 hover:scale-105 transition-all"
              type="button"
              onClick={editNode}
            >
              <FiEdit />Editar Puesto
            </button>
            <button
              className="flex items-center gap-2 p-2 rounded-md text-white bg-cyan-600 hover:bg-yellow-500 hover:scale-105 transition-all"
              type="button"
              onClick={deleteNode}
            >
              <RiDeleteBin2Line />Eliminar
            </button>
          </div>
          <div className="flex items-center gap-2 ml-2">
            <label>Zoom</label>
            <input
              type="range"
              min={0.1}
              max={2}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
            />
            <button 
              onClick={() => setZoom(1.0)}
              className="flex items-center gap-2 p-2 rounded-md text-white bg-cyan-600 hover:bg-yellow-500 hover:scale-105 transition-all"
            >
              Reset
            </button>
            <button 
              onClick={() => {
                const dims = containerRef.current?.getBoundingClientRect();
                if (dims) setTranslate({ x: dims.width / 2, y: 80 });
              }}
              className="flex items-center gap-2 p-2 rounded-md text-white bg-cyan-600 hover:bg-yellow-500 hover:scale-105 transition-all"
            >
              Re-centrar
            </button>
          </div>
        </div>

        {/* Área del árbol */}
        <div 
          ref={containerRef} 
          className="w-full bg-gray-100" 
          style={{ height: 'calc(100vh - 72px)', minHeight: '400px' }}
        >
          {treeData && (
            <Tree
              data={dataMemo}
              translate={translate}
              zoom={zoom}
              collapsible
              zoomable
              nodeSize={{ x: 300, y: 180 }} // Reducir tamaño
              separation={{ siblings: 1.2, nonSiblings: 1.5 }}
              renderCustomNodeElement={renderNode}
              orientation="vertical"
              pathFunc="step"
            />
          )}
        </div>
      </div>

      {showFiles && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
          onClick={() => setShowFiles(false)}
        >
          <div
            onClick={handleModalContainerClick}
            className="relative bg-white rounded-lg shadow-lg w-[80vw] h-[100vh] max-w-7xl overflow-hidden flex flex-col"
          >
            {/* Contenido ajustado al modal */}
            <div className="flex-1 overflow-auto h-full">
              <FileGallery nombre={editName} puesto={editPuesto} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}