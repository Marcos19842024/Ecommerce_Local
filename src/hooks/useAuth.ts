import { useState, useEffect, useCallback } from 'react';
import { password } from '../server/user';

export const useAuth = () => {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAdminAuth = () => {
            const adminAuth = localStorage.getItem('adminAuthenticated');
            const authTime = localStorage.getItem('adminAuthTime');
            
            if (adminAuth === 'true' && authTime) {
                const authTimeNum = parseInt(authTime);
                const now = Date.now();
                const hoursElapsed = (now - authTimeNum) / (1000 * 60 * 60);
                
                if (hoursElapsed < 8) {
                    setIsAdmin(true);
                } else {
                    logout();
                }
            }
        };
        
        checkAdminAuth();
    }, []);

    const login = useCallback((adminPassword: string): boolean => {;
        
        if (adminPassword === password) {
            localStorage.setItem('adminAuthenticated', 'true');
            localStorage.setItem('adminAuthTime', Date.now().toString());
            setIsAdmin(true);
            return true;
        }
        return false;
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminAuthTime');
        setIsAdmin(false);
    }, []);

    return { isAdmin, login, logout };
};