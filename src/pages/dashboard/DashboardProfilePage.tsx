import { MdDeleteOutline } from "react-icons/md";
import { Loader } from "../../components/shared/Loader";
import { useUsers } from "../../hooks";
import { User } from "@supabase/supabase-js";
import { useState } from "react";
import { LuUsers } from "react-icons/lu";
import { toast } from "react-hot-toast";
import { getUserDelete } from "../../actions";

export const DashboardProfilePage = () => {
    const { users, isLoading } = useUsers();
    const [usersAll, setUsersAll] = useState<User[]>([]);

    if (isLoading) return <Loader />;

    return (
        <>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h1 className="text-2xl font-bold">Lista de usuarios</h1>
                <button
                    className="flex items-center gap-2 px-4 py-2 rounded-md text-white bg-cyan-600 hover:bg-yellow-500 hover:scale-105 transition-all"
                    onClick={() => setUsersAll(users)}
                >
                  <LuUsers /> Listar Usuarios
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {usersAll.map((user) => (
                    <div
                        key={user.id}
                        className="relative bg-white border border-gray-200 p-4 rounded-md shadow hover:shadow-lg overflow-auto transition-shadow"
                    >
                        <div className="space-y-1 text-sm text-gray-700">
                            <p><strong>ID:</strong> {user.id}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Nombre:</strong> {user.user_metadata.full_name}</p>
                            <p><strong>Estado:</strong> {user.email_confirmed_at ? "Confirmado" : "No confirmado"}</p>
                            <p><strong>Teléfono:</strong> {user.phone || "No disponible"}</p>
                            <p><strong>Dirección:</strong> {user.user_metadata.address || "No disponible"}</p>
                            <p><strong>Ciudad:</strong> {user.user_metadata.city || "No disponible"}</p>
                            <p><strong>Código postal:</strong> {user.user_metadata.postal_code || "No disponible"}</p>
                        </div>

                        <MdDeleteOutline
                            className="absolute right-3 bottom-3 text-yellow-500 hover:text-red-500 cursor-pointer"
                            size={22}
                            onClick={async () => {
                                const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este usuario?");
                                if (confirmDelete) {
                                    const deletedUser = getUserDelete(user.id);
                                    if (await deletedUser) {
                                        setUsersAll(usersAll.filter(u => u.id !== user.id));
                                        toast.success("Usuario eliminado correctamente");
                                    } else {
                                        toast.error("Error al eliminar el usuario");
                                    }
                                }
                            }}
                        />
                    </div>
                ))}
            </div>
        </>

    );
};