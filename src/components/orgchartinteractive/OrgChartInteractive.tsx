import { useEffect, useRef, useState } from "react";
import { SiAwsorganizations } from "react-icons/si";
import { RiDeleteBin2Line } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { VscFileSymlinkDirectory } from "react-icons/vsc";
import { apiService } from "../../services/api";
import { Employee, OrgNode } from "../../interfaces/orgchartinteractive.interface";
import toast from "react-hot-toast";
import Tree from "react-d3-tree";
import FileGallery from "./FileGallery";
import PasswordPrompt from "../shared/PasswordPrompt";
import Modal from "../shared/Modal";
import NodeAction from "./NodeAction";

const uid = () => Math.random().toString(36).slice(2, 9);

const withIds = (node: OrgNode): OrgNode => ({
  ...node,
  id: node.id ?? uid(),
  children: node.children?.map(withIds) ?? [],
});

export default function OrgChartInteractive() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [translate, setTranslate] = useState({ x: 0, y: 100 });
  const [showModal, setShowModal] = useState<"add" | "edit" | "delete" | "data" | "">("");
  const [treeData, setTreeData] = useState<OrgNode | null>(null);
  const [modalEmployee, setModalEmployee] = useState<Employee | null>(null);
  const [nodePosition, setNodePosition] = useState({ x: 0, y: 0, visible: false });
  const [isButtonsVisible, setIsButtonsVisible] = useState(false);
  const [selectEmployee, setSelectEmployee] = useState<Employee | null>(null);
  const dataMemo = treeData ? [treeData] : [];

  useEffect(() => {
    const loadOrgChart = async () => {
      try {
        const data = await apiService.getOrgChart();
        setTreeData(withIds(data));
      } catch (error) {
        toast.error("Error al cargar organigrama");
      }
    };

    loadOrgChart();
  }, []);

  // Sincronizar datos del nodo seleccionado
  useEffect(() => {
    if (treeData && selectEmployee) {
      const selectedNode = findNode(treeData, selectEmployee.id);
      if (selectedNode) {
        setSelectEmployee({
          id: selectedNode.id ?? selectEmployee.id,
          name: selectedNode.name,
          alias: selectedNode.attributes?.alias || "",
          puesto: selectedNode.attributes?.puesto || "",
          area: selectedNode.attributes?.area || "",
        });
      }
    }
  }, [treeData, selectEmployee]);

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

  // Guardar cambios en backend - ✅ ACTUALIZADO
  const saveTree = async (tree: OrgNode) => {
    try {
      setTreeData(tree);
      
      await apiService.saveOrgChart(tree);
      toast.success("Cambios guardados correctamente");
    } catch {
      if (treeData) setTreeData(treeData);
      toast.error("Error al guardar organigrama");
    }
  };

  // Acciones
  const addChild = async (employee: Employee) => {
    const targetNodeId = selectEmployee?.id;
    if (!treeData || !targetNodeId) return;

    const parentNode = findNode(treeData, targetNodeId);
    if (!parentNode) {
      toast.error("Nodo padre no encontrado");
      return;
    }

    const newNode: OrgNode = { 
      id: uid(), 
      name: employee.name || "Nuevo Empleado",
      attributes: { alias: employee.alias || "", puesto: employee.puesto || "", area: employee.area || "" },
      children: []
    };

    const updated = updateNode(treeData, targetNodeId, {
      children: [...(parentNode.children || []), newNode]
    });

    await saveTree(updated);
    setSelectEmployee(null);
  };

  const editNode = async (employee: Employee) => {
    const targetNodeId = selectEmployee?.id;
    if (!treeData || !targetNodeId) return;

    const updated = updateNode({...treeData}, targetNodeId, {
      name: employee.name || selectEmployee.name,
      attributes: {
        puesto: employee.puesto || selectEmployee.puesto,
        alias: employee.alias || selectEmployee.alias,
        area: employee.area || selectEmployee.area
      }
    });
    await saveTree(updated);
  };

  const deleteNode = () => {
    if (!treeData || !selectEmployee) return toast.error("Selecciona un nodo para eliminar");
    if (selectEmployee.id === treeData.id) return toast.error("No puedes eliminar la raíz");
    if (!confirm("¿Eliminar este nodo y sus hijos?")) return;
    const updated = removeNode(treeData, selectEmployee.id);
    if (updated) saveTree(updated);
    setSelectEmployee(null);
    setNodePosition(prev => ({ ...prev, visible: false }));
    setShowModal("");
  };

  const openModal = (action: "add" | "edit" | "delete" | "data") => {
    if (!selectEmployee) {
      toast.error("Selecciona un nodo primero");
      return;
    }

    if (action !== "add" && treeData) {
      const selectedNode = findNode(treeData, selectEmployee.id);
      if (selectedNode) {
        setModalEmployee  ({
          id: selectedNode.id || selectEmployee.id,
          name: selectedNode.name,
          alias: selectedNode.attributes?.alias || "",
          puesto: selectedNode.attributes?.puesto || "",
          area: selectedNode.attributes?.area || "",
        });
      }
    } else {
      setModalEmployee(null);
    }
    setShowModal(action);
  };

  const handleSave = async (employee: Employee) => {
    if (!treeData || !employee) return;
    
    try {
      if (showModal === "edit") {
        await editNode(employee);
      } else {
        await addChild(employee);
      }
      setShowModal("");
    } catch (error) {
      toast.error("Error al guardar los cambios");
    }
  };

  // Renderizado de nodo con botones flotantes
  const renderNode = ({ nodeDatum }: any) => (
    <g
      style={{ transition: 'all 0.2s ease-in-out' }}
      className="node-group"
      onClick={(e) => {
        e.stopPropagation();
        setSelectEmployee(nodeDatum);
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
      }}
    >
      {/* Fondo del nodo */}
      <rect
        width="200"
        height="100"
        x="-100"
        y="-40"
        fill="white"
        stroke={selectEmployee && selectEmployee.id === nodeDatum.id ? "#fbbf24" : "#06b6d4"}
        strokeWidth={selectEmployee && selectEmployee.id === nodeDatum.id ? "2" : "1"}
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
        {nodeDatum.attributes.puesto}
      </text>

      <text
        textAnchor="middle"
        dy="45"
        fontSize="12"
        fill="#000000ff"
        stroke="#000000ff"
        strokeWidth="1"
        style={{ cursor: "pointer" }}
      >
        {nodeDatum.attributes.area}
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
        {nodeDatum.attributes.alias}
      </text>

      {nodeDatum.children && nodeDatum.children.length > 0 && (
        <text
          textAnchor="middle"
          dy={nodeDatum.__rd3t.collapsed ? "61" : "75"}
          dx="0"
          fontSize="20"
          fill={selectEmployee && selectEmployee.id === nodeDatum.id ? "#fbbf24" : "#06b6d4"}
          strokeWidth="0"
          style={{ cursor: "pointer", fontWeight: "bold" }}
        >
          ▼
        </text>
      )}
    </g>
  );

  return (
    <div className="h-screen w-full bg-white text-gray-800 relative">
      <div className="flex justify-between items-center p-4 border-b border-gray-300 rounded-md">
        <h1 className="text-2xl font-bold">Organigrama Interactivo</h1>
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
            setSelectEmployee(null);
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
        {!selectEmployee || !isButtonsVisible ? null : (
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
              onClick={() => openModal("delete")}
              title="Eliminar nodo"
            >
              <RiDeleteBin2Line size={14} />
            </button>
            
            <button
              className="flex items-center gap-1 p-1 rounded-md text-white bg-cyan-600 hover:bg-yellow-500 transition-all text-xs hover:scale-110 transform transition-transform duration-150"
              onClick={() => {openModal("data")}}
              title="Ver expediente"
            >
              <VscFileSymlinkDirectory size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Modal de edición/añadir */}
      {(showModal === "add" || showModal === "edit") && (
        <Modal
          className1="fixed inset-0 flex items-center justify-center bg-black/70 z-50 transition-opacity duration-200"
          className2="bg-gray-900 p-6 rounded-lg shadow-lg text-white space-y-4 w-[90vw] max-w-md transform transition-transform duration-200"
          closeModal={() => setShowModal("")}
        >
          <NodeAction
            modalAction={showModal}
            modalEmployee={modalEmployee}
            onSuccess={handleSave}
          />
        </Modal>
      )}

      {/* Modal de expediente */}
      {showModal === "data" && selectEmployee && (
        <Modal
          className1="fixed inset-0 flex items-center justify-center bg-black/70 z-50 transition-opacity duration-200"
          className2="relative bg-white rounded-lg shadow-lg max-w-7xl max-h-[100vh] overflow-auto transform transition-transform duration-200"
          closeModal={() => setShowModal("")}
        >
          <div className="p-2 w-fit">
            <FileGallery 
              employee={selectEmployee}
            />
          </div>
        </Modal>
      )}

      {/* Modal de contraseña */}
      {showModal === "delete" && (
        <Modal
          className1="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
          className2="relative bg-white rounded-lg shadow-lg max-w-md w-full p-6"
          closeModal={() => setShowModal("")}
        >
          <PasswordPrompt
            onSuccess={() => {
              deleteNode();
            }}
            message="Ingrese la contraseña para eliminar el nodo"
          />
        </Modal>
      )}
    </div>
  );
}