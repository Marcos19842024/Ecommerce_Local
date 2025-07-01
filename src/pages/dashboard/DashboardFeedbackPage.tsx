import { useEffect, useState } from "react";

interface Feedback {
    _id: string;
    rating: number;
    comment: string;
    email?: string;
    createdAt: string;
}

export const DashboardFeedbackPage = () => {
    const [data, setData] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/feedback")//cambiar la direccion
        .then((res) => res.json())
        .then((json) => {
            setData(json);
            setLoading(false);
        });
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Evaluaciones Recibidas</h1>
            {loading ? (
                <p>Cargando...</p>
            ) : (
                <table className="min-w-full border text-sm">
                    <thead>
                        <tr className="bg-gray-200">
                        <th className="border px-4 py-2">Fecha</th>
                        <th className="border px-4 py-2">⭐</th>
                        <th className="border px-4 py-2">Comentario</th>
                        <th className="border px-4 py-2">Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((f) => (
                            <tr key={f._id}>
                                <td className="border px-2 py-1">{new Date(f.createdAt).toLocaleString()}</td>
                                <td className="border px-2 py-1">{f.rating}</td>
                                <td className="border px-2 py-1">{f.comment}</td>
                                <td className="border px-2 py-1">{f.email || "-"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};