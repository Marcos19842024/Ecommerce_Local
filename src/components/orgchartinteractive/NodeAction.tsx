import { useState } from "react";
import { Employee } from "../../interfaces/orgchartinteractive.interface";

interface NodeActionProps {
    modalAction?: string;
    modalEmployee?: Employee | null;
    onSuccess: any
}

const NodeAction: React.FC<NodeActionProps> = ({
    modalAction,
    modalEmployee,
    onSuccess,
}) => {

    const [employee, setEmployee] = useState<Employee>(modalEmployee ?? {} as Employee)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSuccess(employee);
    };

    return (
        <>
            <h2 className="text-xl text-center font-bold">
                {modalAction === "edit" ? "Editar nodo" : "Añadir nodo"}
            </h2>
            <form
                className="space-y-4"
                onSubmit={handleSubmit}
            >
                <div>
                    <label
                        htmlFor="puesto"
                        className="block text-sm font-medium text-white mb-1">
                        Puesto
                    </label>
                    <input
                        id="puesto"
                        type="text"
                        name="puesto"
                        value={employee?.puesto || ""}
                        className="w-full border border-gray-300 text-gray-800 rounded p-2 focus:ring-2 focus:ring-cyan-600 focus:border-transparent transition-colors"
                        required
                        onChange={(e) => setEmployee({ ...employee, puesto: e.target.value })}
                        placeholder="Ingrese el puesto"
                    />
                </div>
                    
                <div>
                    <label
                        htmlFor="area"
                        className="block text-sm font-medium text-white mb-1">
                        Area
                    </label>
                    <input
                        id="area"
                        type="text"
                        name="area"
                        value={employee?.area || ""}
                        className="w-full border border-gray-300 text-gray-800 rounded p-2 focus:ring-2 focus:ring-cyan-600 focus:border-transparent transition-colors"
                        required
                        onChange={(e) => setEmployee({ ...employee, area: e.target.value })}
                        placeholder="Ingrese el área"
                    />
                </div>

                <div>
                    <label
                        htmlFor="nombre"
                        className="block text-sm font-medium text-white mb-1">
                        Nombre
                    </label>
                    <input
                        id="nombre"
                        type="text"
                        name="nombre"
                        value={employee.name || ""}
                        className="w-full border border-gray-300 text-gray-800 rounded p-2 focus:ring-2 focus:ring-cyan-600 focus:border-transparent transition-colors"
                        required
                        onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
                        placeholder="Ingrese el nombre"
                    />
                </div>

                <div>
                    <label
                        htmlFor="alias"
                        className="block text-sm font-medium text-white mb-1">
                        Alias
                    </label>
                    <input
                        id="alias"
                        type="text"
                        name="alias"
                        value={employee.alias || ""}
                        className="w-full border border-gray-300 text-gray-800 rounded p-2 focus:ring-2 focus:ring-cyan-600 focus:border-transparent transition-colors"
                        required
                        onChange={(e) => setEmployee({ ...employee, alias: e.target.value })}
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
        </>
    );
};

export default NodeAction;