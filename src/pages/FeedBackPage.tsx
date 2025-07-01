import { useState } from "react";
import toast from "react-hot-toast";

export const FeedBackPage = () => {
    const [rating, setRating] = useState<number | null>(null);
    const [comment, setComment] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rating || comment.trim() === "") {
            toast.error("Por favor, completa todos los campos obligatorios.");
        return;
        }
        setLoading(true);
        try {
            const res = await fetch("http://veterinariabaalak.com/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rating, comment, email }),
            });
            if (res.ok) {
                toast.success("¡Gracias por tu opinión!");
                setRating(null);
                setComment("");
                setEmail("");
            } else {
                toast.error("Ocurrió un error al enviar tu mensaje.");
            }
        } catch (err) {
            toast.error("Error de conexión con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto bg-white shadow-lg rounded-xl">
            <h2 className="text-xl font-bold mb-4">Tu opinión es importante</h2>
            <label className="block mb-2 font-medium">Calificación:</label>
            <div className="flex space-x-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-2xl ${rating && rating >= star ? "text-yellow-400" : "text-gray-400"}`}
                >
                    ★
                </button>
                ))}
            </div>
            <label className="block mb-1 font-medium">Comentario o sugerencia:</label>
            <textarea
                className="w-full border rounded-md p-2 mb-4"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
            />
            <label className="block mb-1 font-medium">Correo electrónico (opcional):</label>
            <input
                type="email"
                className="w-full border rounded-md p-2 mb-4"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-600 text-white py-2 rounded-md hover:bg-cyan-700 hover:scale-105"
            >
                {loading ? "Enviando..." : "Enviar opinión"}
            </button>
        </form>
    );
};