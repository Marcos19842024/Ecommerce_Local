import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth'; // Importa el hook
import toast from 'react-hot-toast';

export const AdminLogin = () => {
    const [adminPassword, setAdminPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/';
    const { login, isAuthenticated } = useAuth();

    // Redirigir si ya está autenticado
    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    const handleSubmit = async (e: React.FormEvent) => {
        setLoading(true);
        e.preventDefault();
        
        // Validación básica
        if (!adminPassword.trim()) {
            toast.error('Por favor ingresa una contraseña');
            setLoading(false);
            return;
        }

        try {
            const result = await login(adminPassword);
            
            if (result.success) {
                toast.success('✅ Acceso concedido');
                
                // Pequeña pausa para mostrar el mensaje
                setTimeout(() => {
                    navigate(from, { replace: true });
                }, 500);
            } else {
                toast.error('❌ Contraseña incorrecta');
            }
        } catch (err: any) {
            toast.error(`Error en autenticación: ${err.message || err}`);
        } finally {
            setAdminPassword('');
            setLoading(false);
        }
    };

    // Mostrar loading mientras verifica autenticación
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-gray-600">Verificando autenticación...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-xl p-8 md:p-10">
                {/* Logo o Ícono */}
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <Lock className="h-8 w-8 text-blue-600" />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Acceso Administrativo
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Ingresa la contraseña para acceder a las funciones de administrador
                    </p>
                </div>

                {/* Formulario */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={adminPassword}
                                    onChange={(e) => {
                                        setAdminPassword(e.target.value);
                                    }}
                                    className="appearance-none relative block w-full px-4 py-3 pl-12 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 text-sm transition-all duration-200"
                                    placeholder="Ingresa la contraseña"
                                    disabled={loading}
                                    autoComplete="current-password"
                                    autoFocus
                                />
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 p-4 rounded-md flex items-center text-white bg-cyan-600 hover:bg-yellow-500 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Botón de submit */}
                    <div>
                        <button
                            type="submit"
                            disabled={loading || !adminPassword.trim()}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-cyan-600 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Verificando...
                                </>
                            ) : (
                                'Ingresar como Administrador'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};