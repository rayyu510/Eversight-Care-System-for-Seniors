import { useState, useEffect } from 'react';
import { apiService } from '../services/api.service';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export const useAuth = () => {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true,
    });

    useEffect(() => {
        // Check for existing token/session
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (token) {
                    apiService.setToken(token);
                    // Verify token is still valid
                    const user = await apiService.get('/auth/me');
                    setAuthState({
                        user,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } else {
                    setAuthState({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                    });
                }
            } catch (error) {
                // Token is invalid
                localStorage.removeItem('authToken');
                setAuthState({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                });
            }
        };

        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await apiService.post('/auth/login', { email, password });
            const { token, user } = response;

            localStorage.setItem('authToken', token);
            apiService.setToken(token);

            setAuthState({
                user,
                isAuthenticated: true,
                isLoading: false,
            });

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Login failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        apiService.setToken('');
        setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
        });
    };

    return {
        ...authState,
        login,
        logout,
    };
};