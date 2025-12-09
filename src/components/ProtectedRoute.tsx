import { ReactNode, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
    children: ReactNode;
    adminOnly?: boolean;
}

export const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const checkAuth = () => {
            const adminAuth = localStorage.getItem('adminAuthenticated');
            const authTime = localStorage.getItem('adminAuthTime');
        
            if (adminAuth === 'true' && authTime) {
                const authTimeNum = parseInt(authTime);
                const now = Date.now();
                const hoursElapsed = (now - authTimeNum) / (1000 * 60 * 60);
                
                // Expiración de sesión (8 horas)
                if (hoursElapsed < 8) {
                    setIsAuthenticated(true);
                } else {
                    localStorage.removeItem('adminAuthenticated');
                    localStorage.removeItem('adminAuthTime');
                }
            }
        
            setIsChecking(false);
        };
    
        checkAuth();
    
        // Verificar autenticación cada minuto
        const interval = setInterval(checkAuth, 60000);
        return () => clearInterval(interval);
    }, []);

    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Verificando acceso...</p>
                </div>
            </div>
        );
    }

    if (adminOnly && !isAuthenticated) {
        // Redirigir al login con la ruta original
        navigate('/admin-login', { 
            state: { from: location.pathname },
            replace: true 
        });
        return null;
    }

    return <>{children}</>;
};