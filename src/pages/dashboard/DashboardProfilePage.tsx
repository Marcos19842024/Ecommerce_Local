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
            <div className="flex items-center justify-between">
                <h1 className='text-2xl font-bold'>Lista de usuario</h1>
                <button
                    className='flex justify-between items-center gap-1 w-fit text-white rounded-md p-2 transition-all group bg-cyan-600 hover:bg-yellow-500 hover:scale-105'
                    type="button"
                    onClick={() => setUsersAll(users)}
                    >
                    <LuUsers />Listar Usuarios
                </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3">
                {usersAll.map((user) => {
                    return(
                        <div
                            key={user.id}
                            className="relative border p-4 m-2 w-full h-full rounded-md shadow-md overflow-hidden transition-shadow duration-300">
                            <p className="text-gray-600">ID: {user.id}</p>
                            <p className="text-gray-600">Email: {user.email}</p>
                            <p className="text-gray-600">Nombre: {user.user_metadata.full_name}</p>
                            <p className="text-gray-600">Estado: {user.email_confirmed_at ? "Confirmado" : "No confirmado"}</p>
                            <p className="text-gray-600">Teléfono: {user.phone || "No disponible"}</p>
                            <p className="text-gray-600">Dirección: {user.user_metadata.address || "No disponible"}</p>
                            <p className="text-gray-600">Ciudad: {user.user_metadata.city || "No disponible"}</p>
                            <p className="text-gray-600">Código postal: {user.user_metadata.postal_code || "No disponible"}</p>
                            <MdDeleteOutline
                                className="absolute right-0 bottom-0 m-2 text-yellow-500 hover:text-red-500 cursor-pointer"
                                size={20}
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
                    );
                })}
            </div>
        </>
    );
};