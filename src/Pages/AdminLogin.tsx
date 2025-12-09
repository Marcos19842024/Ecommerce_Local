// Pages/AdminLogin.tsx
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react'; // Importa íconos (opcional)
import { password } from '../server/user';

export const AdminLogin = () => {
    const [adminPassword, setAdminPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
        // Simular validación asíncrona
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (adminPassword === password) {
            // Guardar autenticación
            localStorage.setItem('adminAuthenticated', 'true');
            localStorage.setItem('adminAuthTime', Date.now().toString());
            
            // Redirigir a la página que intentaba acceder
            navigate(from, { replace: true });
        } else {
            setError('Contraseña incorrecta. Inténtalo de nuevo.');
        }
        } catch (err) {
            setError('Error al verificar la contraseña');
        } finally {
            setLoading(false);
            setAdminPassword('');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
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
                                        setError('');
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

                    {/* Mensaje de error */}
                    {error && (
                        <div className="rounded-lg bg-red-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-red-800">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Botón de submit */}
                    <div>
                        <button
                            type="submit"
                            disabled={loading || !password.trim()}
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

                    {/* Enlace para volver */}
                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => navigate('/checklist')}
                            className="text-sm text-cyan-600 hover:text-yellow-500 font-medium transition-colors"
                        >
                            ← Volver al Checklist
                        </button>
                    </div>
                </form>
            </div>

            {/* Modal de éxito */}
            {false && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-6 max-w-sm w-full">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">¡Acceso concedido!</h3>
                            <p className="text-sm text-gray-500">Redirigiendo al panel administrativo...</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};