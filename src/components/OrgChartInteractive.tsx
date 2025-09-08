import { useEffect, useRef, useState } from "react";
import { SiAwsorganizations } from "react-icons/si";
import { RiDeleteBin2Line } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { VscFileSymlinkDirectory } from "react-icons/vsc";
import { url } from "../server/url";
import toast from "react-hot-toast";
import Tree from "react-d3-tree";
import FileGallery from "./FileGallery";

interface OrgNode {
  id?: string;
  name: string;
  alias?: string;
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
  const [showModal, setShowModal] = useState(false);
  const [treeData, setTreeData] = useState<OrgNode | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editPuesto, setEditPuesto] = useState("");
  const [editName, setEditName] = useState("");
  const [editAlias, setEditAlias] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"add" | "edit">("add");
  const [modalPuesto, setModalPuesto] = useState("");
  const [modalNombre, setModalNombre] = useState("");
  const [modalAlias, setModalAlias] = useState("");
  const [nodePosition, setNodePosition] = useState({ x: 0, y: 0, visible: false });
  const [isButtonsVisible, setIsButtonsVisible] = useState(false);
  const [employeeKey, setEmployeeKey] = useState(0);
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

  // Sincronizar datos del nodo seleccionado
  useEffect(() => {
    if (treeData && selectedId) {
      const selectedNode = findNode(treeData, selectedId);
      if (selectedNode) {
        setEditName(selectedNode.name);
        setEditAlias(selectedNode.alias || "");
        setEditPuesto(selectedNode.attributes?.puesto || "");
      }
    }
  }, [treeData, selectedId]);

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
  const addChild = async (childNombre: string, childPuesto: string, childAlias?: string, targetId?: string) => {
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
      alias: childAlias,
      attributes: { puesto: childPuesto },
      children: [] 
    };

    const updated = updateNode(treeData, targetNodeId, {
      children: [...(parentNode.children || []), newNode]
    });
    
    if (updated) {
    // Guardar cambios en backend
      try {
        setTreeData(updated);
        const res = await fetch(`${url}orgchart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updated),
        });

        if (!res.ok) throw new Error("Error al guardar");
        toast.success("Cambios guardados correctamente");
      } catch {
        if (treeData) setTreeData(treeData);
        toast.error("Error al guardar organigrama");
      }
    }
  };

  const editNode = async (newNombre: string, newPuesto: string, newAlias?: string, targetId?: string) => {
    const targetNodeId = targetId || selectedId;
    if (!treeData || !targetNodeId) return;

    // Encontrar el nodo antiguo antes de hacer cambios
    const oldNode = findNode(treeData, targetNodeId);
    if (!oldNode) {
      toast.error("No se encontró el nodo a editar");
      return;
    }

    // Si el nombre cambió, forzar recarga del FileGallery
    if (oldNode.name !== newNombre) {
      setEmployeeKey(prev => prev + 1);
    }

    // Crear copia del treeData para la actualización local
    const treeDataCopy = JSON.parse(JSON.stringify(treeData));
    const updated = updateNode(treeDataCopy, targetNodeId, {
      name: newNombre,
      alias: newAlias,
      attributes: { puesto: newPuesto }
    });

    if (updated) {
      // Guardar el estado anterior para posible rollback
      const previousTreeData = treeData;
      
      try {
        // Actualizar UI primero (optimistic update)
        setTreeData(updated);
        
        // Preparar datos para el backend según tu endpoint
        const updateData = {
          newName: newNombre,  // Este campo es específico para el renombrado
          puesto: newPuesto,   // Otros campos que quieras actualizar
          ...(newAlias && { alias: newAlias }) // Incluir alias solo si existe
        };

        // Llamar al endpoint del backend
        const res = await fetch(`${url}orgachart/employees/${encodeURIComponent(oldNode.name)}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Error al guardar");
        }

        toast.success("Cambios guardados correctamente");
        
      } catch (error) {
        // Revertir cambios en caso de error
        setTreeData(previousTreeData);
        toast.error(error instanceof Error ? error.message : "Error al guardar cambios");
        return; // Salir de la función para no actualizar estados locales
      }
    }

    // Actualizar estados locales solo si todo fue exitoso
    setEditName(newNombre);
    setEditAlias(newAlias || "");
    setEditPuesto(newPuesto);
    setSelectedId(null);
  };

  const deleteNode = async () => {
    if (!treeData || !selectedId) return toast.error("Selecciona un nodo para eliminar");
    if (selectedId === treeData.id) return toast.error("No puedes eliminar la raíz");
    if (!confirm("¿Eliminar este nodo y sus hijos?")) return;
    const selectedNode = findNode(treeData, selectedId);
    const updated = removeNode(treeData, selectedId);
    if (updated && selectedNode) {
      try {
        const res = await fetch(`${url}orgchart/employees/${encodeURIComponent(selectedNode.name)}`,{
          method: "DELETE" }
        );

        if (!res.ok) throw new Error("Error al eliminar en el servidor");
        setTreeData(updated);
        toast.success("nodo eliminada correctamente");
      } catch (error) {
        toast.error("No se pudo eliminar el nodo");
      }
    }
    setSelectedId(null);
    setEditName("");
    setEditAlias("");
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
        setModalAlias(selectedNode.alias || "");
        setModalPuesto(selectedNode.attributes?.puesto || "");
      }
    } else {
      setModalNombre("");
      setModalAlias("");
      setModalPuesto("");
    }
    setModalAction(action);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!modalAction || !selectedId) return;

    try {
      if (modalAction === "edit") {
        await editNode(modalNombre, modalPuesto, modalAlias);
      } else {
        await addChild(modalNombre, modalPuesto, modalAlias);
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Error al guardar los cambios");
    }
  };

  const handleCloseFileModal = () => {
    setShowModal(false);
    setEmployeeKey(0); // Resetear la key cuando se cierra el modal
  };

  // Renderizado de nodo con botones flotantes
  const renderNode = ({ nodeDatum }: any) => (
    <g
      style={{ transition: 'all 0.2s ease-in-out' }}
      className="node-group"
      onClick={(e) => {
        setNodeData(e, nodeDatum);
      }}
    >
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
        style={{ cursor: "pointer" }}
      >
        {nodeDatum.alias}
      </text>

      {nodeDatum.children && nodeDatum.children.length > 0 && (
        <text
          textAnchor="middle"
          dy={nodeDatum.__rd3t.collapsed ? "61" : "75"}
          dx="0"
          fontSize="20"
          fill={selectedId === nodeDatum.id ? "#fbbf24" : "#06b6d4"}
          strokeWidth="0"
          style={{ cursor: "pointer", fontWeight: "bold" }}
        >
          ▼
        </text>
      )}
    </g>
  );

  const setNodeData = (e: React.MouseEvent<SVGGElement>, nodeDatum: any) => {
    e.stopPropagation();
    setSelectedId(nodeDatum.id);
    
    // Obtener posición para botones flotantes
    const rect = e.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (containerRect) {
      setNodePosition({
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top - 40,
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
              zoom={0.80}
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
              className="floating-buttons absolute z-30 bg-white border border-cyan-600 rounded-lg shadow-lg p-1 flex gap-1 transition-all duration-200"
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
                onClick={() => {
                  if (!selectedId) {
                    toast.error("Selecciona un nodo primero");
                    return;
                  }
                  if (treeData && selectedId) {
                    const selectedNode = findNode(treeData, selectedId);
                    if (selectedNode) {
                      setEditName(selectedNode.name);
                      setEditAlias(selectedNode.alias? selectedNode.alias : "");
                      setEditPuesto(selectedNode.attributes?.puesto || "");
                    }
                  }
                  setShowModal(true);
                }}
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
                    name="nombre"
                    value={modalNombre}
                    className="w-full border border-gray-300 text-gray-800 rounded p-2 focus:ring-2 focus:ring-cyan-600 focus:border-transparent transition-colors"
                    required
                    onChange={(e) => setModalNombre(e.target.value)}
                    placeholder="Ingrese el nombre"
                  />
                </div>

                <div>
                  <label htmlFor="alias" className="block text-sm font-medium text-white mb-1">
                    Alias
                  </label>
                  <input
                    id="alias"
                    type="text"
                    name="alias"
                    value={modalAlias}
                    className="w-full border border-gray-300 text-gray-800 rounded p-2 focus:ring-2 focus:ring-cyan-600 focus:border-transparent transition-colors"
                    required
                    onChange={(e) => setModalAlias(e.target.value)}
                    placeholder="Ingrese el alias"
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
            onClick={handleCloseFileModal}
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
                <FileGallery 
                  key={employeeKey}
                  nombre={editName} 
                  alias={editAlias} 
                  puesto={editPuesto} 
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}