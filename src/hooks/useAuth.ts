import { useState } from 'react';
import { apiService } from '../services/api';

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = async (password: string) => {
        try {
            const response = await apiService.verifyAdminPassword(password);
            if (response.success) {
                localStorage.setItem('adminAuthenticated', 'true');
                localStorage.setItem('adminAuthTime', Date.now().toString());
                if (response.token) {
                    localStorage.setItem('adminToken', response.token);
                }
                setIsAuthenticated(true);
                return { success: true };
            }
            return { success: false, message: response.message };
        } catch (error) {
            return { success: false, message: 'Error de conexión' };
        }
    };

    const logout = async () => {
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminAuthTime');
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
    };

    return {
        isAuthenticated,
        login,
        logout,
    };
};