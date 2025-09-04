import { useEffect, useRef, useState } from "react";
import { SiAwsorganizations } from "react-icons/si";
import { RiDeleteBin2Line } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { VscFileSymlinkDirectory } from "react-icons/vsc";
import { MdOutlineZoomInMap, MdOutlineZoomOutMap } from "react-icons/md";
import { url } from "../server/url";
import toast from "react-hot-toast";
import Tree from "react-d3-tree";
import FileGallery from "./FileGallery";

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
  const [translate, setTranslate] = useState({ x: 0, y: 100 });
  const [zoom, setZoom] = useState(0.90);
  const [showModal, setShowModal] = useState(false);
  const [treeData, setTreeData] = useState<OrgNode | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editPuesto, setEditPuesto] = useState("");
  const [editName, setEditName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"add" | "edit">("add");
  const [modalPuesto, setModalPuesto] = useState("");
  const [modalNombre, setModalNombre] = useState("");
  const [nodePosition, setNodePosition] = useState({ x: 0, y: 0, visible: false });
  const [isButtonsVisible, setIsButtonsVisible] = useState(false);
  const dataMemo = treeData ? [treeData] : [];
  const handleModalContainerClick = (e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation();

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

  // Centrar árbol
  useEffect(() => {
    const center = () => {
      const dims = containerRef.current?.getBoundingClientRect();
      if (dims) {
        setTranslate({ x: dims.width / 2, y: 80 });
      }
    };
    center();
    const ro = new ResizeObserver(center);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Efecto para animar la entrada/salida de los botones
  useEffect(() => {
    if (nodePosition.visible) {
      setIsButtonsVisible(true);
    } else {
      const timer = setTimeout(() => setIsButtonsVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [nodePosition.visible]);

  // Guardar cambios en backend
  const saveTree = async (tree: OrgNode) => {
    try {
      setTreeData(tree);
      const res = await fetch(`${url}orgchart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tree),
      });

      if (!res.ok) throw new Error("Error al guardar");
      toast.success("Cambios guardados correctamente");
    } catch {
      if (treeData) setTreeData(treeData);
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
    if (node.id === id) {
      return { 
        ...node, 
        ...updates,
        children: updates.children ?? node.children 
      };
    }
    return { 
      ...node, 
      children: node.children?.map((c) => updateNode(c, id, updates)) ?? [] 
    };
  };

  const removeNode = (node: OrgNode, id: string): OrgNode | null => {
    if (node.id === id) return null;
    return { ...node, children: node.children?.map((c) => removeNode(c, id)).filter(Boolean) as OrgNode[] };
  };

  // Acciones
  const addChild = async (childNombre: string, childPuesto: string, targetId?: string) => {
    const targetNodeId = targetId || selectedId;
    if (!treeData || !targetNodeId) return;

    const parentNode = findNode(treeData, targetNodeId);
    if (!parentNode) {
      toast.error("Nodo padre no encontrado");
      return;
    }

    const newNode: OrgNode = { 
      id: uid(), 
      name: childNombre, 
      attributes: { puesto: childPuesto }, 
      children: [] 
    };

    const updated = updateNode(treeData, targetNodeId, {
      children: [...(parentNode.children || []), newNode]
    });
    
    await saveTree(updated);
  };

  const editNode = async (newNombre: string, newPuesto: string, targetId?: string) => {
    const targetNodeId = targetId || selectedId;
    if (!treeData || !targetNodeId) return;

    const updated = updateNode({...treeData}, targetNodeId, {
      name: newNombre,
      attributes: { puesto: newPuesto }
    });
    
    await saveTree(updated);
    setSelectedId(null);
  };

  const deleteNode = () => {
    if (!treeData || !selectedId) return toast.error("Selecciona un nodo para eliminar");
    if (selectedId === treeData.id) return toast.error("No puedes eliminar la raíz");
    if (!confirm("¿Eliminar este nodo y sus hijos?")) return;
    const updated = removeNode(treeData, selectedId);
    if (updated) saveTree(updated);
    setSelectedId(null);
    setEditName("");
    setEditPuesto("");
    setNodePosition(prev => ({ ...prev, visible: false }));
  };

  const openModal = (action: "add" | "edit") => {
    if (!selectedId) {
      toast.error("Selecciona un nodo primero");
      return;
    }

    if (action === "edit" && treeData) {
      const selectedNode = findNode(treeData, selectedId);
      if (selectedNode) {
        setModalNombre(selectedNode.name);
        setModalPuesto(selectedNode.attributes?.puesto || "");
        // Actualizar también los estados de edición
        setEditName(selectedNode.name);
        setEditPuesto(selectedNode.attributes?.puesto || "");
      }
    } else {
      setModalNombre("");
      setModalPuesto("");
      // Para añadir, mantener los valores del nodo padre seleccionado
      if (treeData && selectedId) {
        const selectedNode = findNode(treeData, selectedId);
        if (selectedNode) {
          setEditName(selectedNode.name);
          setEditPuesto(selectedNode.attributes?.puesto || "");
        }
      }
    }
    setModalAction(action);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!modalAction || !selectedId) return;

    try {
      if (modalAction === "edit") {
        await editNode(modalNombre, modalPuesto);
      } else {
        await addChild(modalNombre, modalPuesto);
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Error al guardar los cambios");
    }
  };

  // Renderizado de nodo con botones flotantes
  const renderNode = ({ nodeDatum, toggleNode }: any) => (
    <g>
      {/* Fondo del nodo */}
      <rect
        width="200"
        height="100"
        x="-100"
        y="-40"
        fill="white"
        stroke={selectedId === nodeDatum.id ? "#fbbf24" : "#06b6d4"}
        strokeWidth={selectedId === nodeDatum.id ? "2" : "1"}
        rx="20"
        onClick={(e) => {
          setNodeData(e, nodeDatum);
        }}
        style={{ cursor: "pointer" }}
      />
      
      {/* Contenido del nodo */}
      <text
        textAnchor="middle"
        dy="-15"
        fontSize="14"
        fill="#000000ff"
        stroke="#000000ff"
        strokeWidth="1"
        onClick={(e) => {
          setNodeData(e, nodeDatum);
        }}
        style={{ cursor: "pointer" }}
      >
        {nodeDatum.attributes?.puesto || "?"}
      </text>
      
      <text
        textAnchor="middle"
        dy="15"
        fontSize="12"
        fill="#000000ff"
        stroke="#000000ff"
        strokeWidth="1"
        onClick={(e) => {
          setNodeData(e, nodeDatum);
        }}
        style={{ cursor: "pointer" }}
      >
        {nodeDatum.name}
      </text>
      
      {/* Botón toggle */}
      {nodeDatum.children && nodeDatum.children.length > 0 && (
        <>
          <circle
            r="10"
            cx="0"
            cy="60"
            fill={selectedId === nodeDatum.id ? "#fbbf24" : "#06b6d4"}
            stroke="#000000ff"
            strokeWidth="1"
            onClick={(e) => {
              e.stopPropagation();
              toggleNode();
            }}
            style={{ cursor: "pointer" }}
          />
          <text
            textAnchor="middle"
            dy="65"
            dx="0"
            fontSize="15"
            fill="white"
            strokeWidth="0"
            onClick={(e) => {
              e.stopPropagation();
              toggleNode();
            }}
            style={{ cursor: "pointer", fontWeight: "bold" }}
          >
            {nodeDatum.__rd3t.collapsed ? "⬆" : "⬇"}
          </text>
        </>
      )}
    </g>
  );

  const setNodeData = (e: React.MouseEvent<SVGRectElement> | React.MouseEvent<SVGTextElement>, nodeDatum: any) => {
    e.stopPropagation();
    setSelectedId(nodeDatum.id);
    setEditName(nodeDatum.name);
    setEditPuesto(nodeDatum.attributes?.puesto ?? "");
    
    // Obtener posición para botones flotantes
    const rect = e.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (containerRect) {
      setNodePosition({
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top - 50,
        visible: true
      });
    }
  }

  return (
    <>
      <div className="h-screen w-full bg-gray-50 text-gray-800 relative">
        {/* Barra superior */}
        <div className="p-4 border-b bg-white sticky top-0 z-10 flex flex-wrap items-center gap-1 rounded-md">
          <div className="text-lg font-semibold mr-auto">Organigrama interactivo</div>
          <div
            className="flex items-center gap-1 border border-cyan-600 p-1 rounded-md">
            <button
              className="flex items-center gap-1 p-1 rounded-md text-white bg-cyan-600 hover:bg-yellow-500 hover:scale-105 transition-all"
              type="button"
              onClick={() => openModal("add")}
            >
              <SiAwsorganizations />Añadir
            </button>
            <button
              className="flex items-center gap-1 p-1 rounded-md text-white bg-cyan-600 hover:bg-yellow-500 hover:scale-105 transition-all"
              type="button"
              onClick={() => openModal("edit")}
            >
              <FiEdit />Editar
            </button>
            <button
              className="flex items-center gap-1 p-1 rounded-md text-white bg-cyan-600 hover:bg-yellow-500 hover:scale-105 transition-all"
              type="button"
              onClick={deleteNode}
            >
              <RiDeleteBin2Line />Eliminar
            </button>
            <button
              className="flex items-center gap-1 p-1 rounded-md text-white bg-cyan-600 hover:bg-yellow-500 hover:scale-105 transition-all"
              type="button"
              onClick={() => {
                if (!selectedId) {
                  toast.error("Selecciona un nodo primero");
                  return;
                }
                if (treeData && selectedId) {
                  const selectedNode = findNode(treeData, selectedId);
                  if (selectedNode) {
                    setEditName(selectedNode.name);
                    setEditPuesto(selectedNode.attributes?.puesto || "");
                  }
                }
                setShowModal(true);
              }}
            >
              <VscFileSymlinkDirectory />Ver Expediente
            </button>
          </div>
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1 border border-cyan-600 p-1 rounded-md">
              <button
                onClick={() => setZoom((prev) => Math.max(0.90, prev - 0.10))}
                className="flex items-center gap-1 p-1 rounded-md text-white bg-cyan-600 hover:bg-yellow-500 hover:scale-105 transition-all"
              >
                <MdOutlineZoomInMap size={20} />Alejar
              </button>
              <span className="flex items-center rounded-md text-cyan-600">{zoom.toFixed(2)}x</span>
              <button
                onClick={() => setZoom((prev) => Math.min(1.0, prev + 0.10))}
                className="flex items-center gap-1 p-1 rounded-md text-white bg-cyan-600 hover:bg-yellow-500 hover:scale-105 transition-all"
              >
                <MdOutlineZoomOutMap size={20} />Acercar
              </button>
            </div>
          </div>
        </div>

        {/* Área del árbol */}
        <div 
          ref={containerRef} 
          className="w-full bg-gray-100 relative" 
          style={{ height: 'calc(100vh - 72px)', minHeight: '400px' }}
          onClick={(e) => {
            const target = e.target as Element;
            if (!target.closest('.floating-buttons')) {
              setNodePosition(prev => ({ ...prev, visible: false }));
              setSelectedId(null);
            }
          }}
        >
          {treeData && (
            <Tree
              data={dataMemo}
              translate={translate}
              zoom={zoom}
              collapsible
              zoomable
              nodeSize={{ x: 300, y: 200 }}
              separation={{ siblings: 1.2, nonSiblings: 1.5 }}
              renderCustomNodeElement={renderNode}
              orientation="vertical"
              pathFunc="step"
            />
          )}
          
          {/* Botones flotantes */}
          {!selectedId || !isButtonsVisible ? null : (
            <div 
              className="floating-buttons absolute z-30 bg-white border border-cyan-600 rounded-lg shadow-lg p-2 flex flex-col gap-1 transition-all duration-200"
              style={{
                left: nodePosition.x,
                top: nodePosition.y,
                opacity: nodePosition.visible ? 1 : 0,
                transform: nodePosition.visible 
                  ? 'translateX(-50%) translateY(0)' 
                  : 'translateX(-50%) translateY(-10px)',
                pointerEvents: nodePosition.visible ? 'auto' : 'none'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="flex items-center gap-1 p-1 rounded-md text-white bg-cyan-600 hover:bg-yellow-500 transition-all text-xs hover:scale-110 transform transition-transform duration-150"
                onClick={() => openModal("add")}
                title="Añadir nodo hijo"
              >
                <SiAwsorganizations size={14} />
              </button>
              
              <button
                className="flex items-center gap-1 p-1 rounded-md text-white bg-cyan-600 hover:bg-yellow-500 transition-all text-xs hover:scale-110 transform transition-transform duration-150"
                onClick={() => openModal("edit")}
                title="Editar nodo"
              >
                <FiEdit size={14} />
              </button>
              
              <button
                className="flex items-center gap-1 p-1 rounded-md text-white bg-cyan-600 hover:bg-yellow-500 transition-all text-xs hover:scale-110 transform transition-transform duration-150"
                onClick={deleteNode}
                title="Eliminar nodo"
              >
                <RiDeleteBin2Line size={14} />
              </button>
              
              <button
                className="flex items-center gap-1 p-1 rounded-md text-white bg-cyan-600 hover:bg-yellow-500 transition-all text-xs hover:scale-110 transform transition-transform duration-150"
                onClick={() => setShowModal(true)}
                title="Ver expediente"
              >
                <VscFileSymlinkDirectory size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Modal de edición/añadir */}
        {isModalOpen && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 transition-opacity duration-200"
            style={{ opacity: isModalOpen ? 1 : 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <div
              onClick={handleModalContainerClick}
              className="bg-gray-900 p-6 rounded-lg shadow-lg text-white space-y-4 w-[90vw] max-w-md transform transition-transform duration-200"
              style={{ 
                transform: isModalOpen ? 'scale(1)' : 'scale(0.95)',
                opacity: isModalOpen ? 1 : 0 
              }}
            >
              <h2 className="text-xl text-center font-bold">
                {modalAction === "edit" ? "Editar nodo" : "Añadir nodo"}
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave();
                }}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="puesto" className="block text-sm font-medium text-white mb-1">
                    Puesto
                  </label>
                  <input
                    id="puesto"
                    type="text"
                    name="puesto"
                    value={modalPuesto}
                    className="w-full border border-gray-300 text-gray-800 rounded p-2 focus:ring-2 focus:ring-cyan-600 focus:border-transparent transition-colors"
                    required
                    onChange={(e) => setModalPuesto(e.target.value)}
                    placeholder="Ingrese el puesto"
                  />
                </div>
                
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-white mb-1">
                    Nombre
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    name="name"
                    value={modalNombre}
                    className="w-full border border-gray-300 text-gray-800 rounded p-2 focus:ring-2 focus:ring-cyan-600 focus:border-transparent transition-colors"
                    required
                    onChange={(e) => setModalNombre(e.target.value)}
                    placeholder="Ingrese el nombre"
                  />
                </div>
                
                <div className="flex justify-center pt-4 gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-yellow-500 transition-colors"
                  >
                    {modalAction === "edit" ? "Actualizar" : "Guardar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de expediente */}
        {showModal && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 transition-opacity duration-200"
            style={{ opacity: showModal ? 1 : 0 }}
            onClick={() => setShowModal(false)}
          >
            <div
              onClick={handleModalContainerClick}
              className="relative bg-white rounded-lg shadow-lg max-w-7xl max-h-[100vh] overflow-auto transform transition-transform duration-200"
              style={{ 
                transform: showModal ? 'scale(1)' : 'scale(0.95)',
                opacity: showModal ? 1 : 0 
              }}
            >
              <div className="p-2 w-fit">
                <FileGallery nombre={editName} puesto={editPuesto} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}