import { useState, useEffect, useCallback } from 'react';
import { APIService } from '../services/api.service';
import { Logger } from '../utils/logger.utils';

// Define User interface locally to avoid import issues
interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role?: {
        id: string;
        name: string;
    };
    permissions?: Array<{
        id: string;
        name: string;
        resource: string;
        action: string;
    }>;
    isActive?: boolean;
    lastLogin?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface UseAuthReturn {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshToken: () => Promise<void>;
    updateProfile: (updates: Partial<User>) => Promise<void>;
}

// Define our working auth state interface
interface WorkingAuthState {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    expiresAt: Date | null;
}

const createEmptyAuthState = (): WorkingAuthState => ({
    isAuthenticated: false,
    user: null,
    token: null,
    refreshToken: null,
    expiresAt: null
});

export const useAuth = (): UseAuthReturn => {
    const [authState, setAuthState] = useState<WorkingAuthState>(createEmptyAuthState());
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const apiService = APIService.getInstance();
    const logger = Logger.getInstance().createModuleLogger('useAuth');

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const stored = localStorage.getItem('auth_state');
                if (stored) {
                    const savedAuth = JSON.parse(stored);
                    if (savedAuth && savedAuth.token && savedAuth.expiresAt) {
                        const isExpired = new Date(savedAuth.expiresAt) <= new Date();
                        if (!isExpired) {
                            setAuthState({
                                isAuthenticated: Boolean(savedAuth.isAuthenticated),
                                user: savedAuth.user || null,
                                token: savedAuth.token || null,
                                refreshToken: savedAuth.refreshToken || null,
                                expiresAt: savedAuth.expiresAt ? new Date(savedAuth.expiresAt) : null
                            });
                        } else {
                            localStorage.removeItem('auth_state');
                        }
                    }
                }
            } catch (error) {
                logger.error('Failed to initialize auth state', {
                    error: error instanceof Error ? error.message : String(error)
                });
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, [logger]);

    const login = useCallback(async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await apiService.post<{
                user: User;
                token: string;
                refreshToken: string;
                expiresAt: string;
            }>('/auth/login', { email, password });

            if (response.success && response.data) {
                const { user, token, refreshToken, expiresAt } = response.data;

                const newAuth: WorkingAuthState = {
                    isAuthenticated: true,
                    user: user,
                    token: token,
                    refreshToken: refreshToken,
                    expiresAt: new Date(expiresAt)
                };

                setAuthState(newAuth);

                try {
                    localStorage.setItem('auth_state', JSON.stringify(newAuth));
                } catch (storageError) {
                    logger.warn('Failed to save auth state to localStorage', {
                        error: storageError instanceof Error ? storageError.message : String(storageError)
                    });
                }

                logger.info('User logged in successfully', { userId: user.id });
            } else {
                const errorMessage = typeof response.error === 'string'
                    ? response.error
                    : 'Login failed';
                setError(errorMessage);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            setError(errorMessage);
            logger.error('Login failed', {
                error: error instanceof Error ? error.message : String(error)
            });
        } finally {
            setIsLoading(false);
        }
    }, [apiService, logger]);

    const logout = useCallback(async () => {
        try {
            if (authState.token) {
                await apiService.post('/auth/logout', { token: authState.token });
            }
        } catch (error) {
            logger.warn('Logout request failed', {
                error: error instanceof Error ? error.message : String(error)
            });
        } finally {
            setAuthState(createEmptyAuthState());

            try {
                localStorage.removeItem('auth_state');
            } catch (storageError) {
                logger.warn('Failed to remove auth state from localStorage', {
                    error: storageError instanceof Error ? storageError.message : String(storageError)
                });
            }

            logger.info('User logged out');
        }
    }, [authState, apiService, logger]);

    const refreshToken = useCallback(async () => {
        if (!authState.refreshToken) return;

        try {
            const response = await apiService.post<{
                token: string;
                refreshToken: string;
                expiresAt: string;
            }>('/auth/refresh', { refreshToken: authState.refreshToken });

            if (response.success && response.data) {
                const { token, refreshToken: newRefreshToken, expiresAt } = response.data;

                const updatedAuth: WorkingAuthState = {
                    isAuthenticated: authState.isAuthenticated,
                    user: authState.user,
                    token: token,
                    refreshToken: newRefreshToken,
                    expiresAt: new Date(expiresAt)
                };

                setAuthState(updatedAuth);

                try {
                    localStorage.setItem('auth_state', JSON.stringify(updatedAuth));
                } catch (storageError) {
                    logger.warn('Failed to save updated auth state to localStorage', {
                        error: storageError instanceof Error ? storageError.message : String(storageError)
                    });
                }
            } else {
                logger.warn('Token refresh failed', {
                    error: typeof response.error === 'string' ? response.error : 'Unknown error'
                });
                await logout();
            }
        } catch (error) {
            logger.error('Token refresh error', {
                error: error instanceof Error ? error.message : String(error)
            });
            await logout();
        }
    }, [authState, apiService, logger, logout]);

    const updateProfile = useCallback(async (updates: Partial<User>) => {
        if (!authState.user) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await apiService.put<User>(`/users/${authState.user.id}`, updates);

            if (response.success && response.data) {
                const updatedAuth: WorkingAuthState = {
                    isAuthenticated: authState.isAuthenticated,
                    user: response.data,
                    token: authState.token,
                    refreshToken: authState.refreshToken,
                    expiresAt: authState.expiresAt
                };

                setAuthState(updatedAuth);

                try {
                    localStorage.setItem('auth_state', JSON.stringify(updatedAuth));
                } catch (storageError) {
                    logger.warn('Failed to save updated profile to localStorage', {
                        error: storageError instanceof Error ? storageError.message : String(storageError)
                    });
                }

                logger.info('Profile updated successfully');
            } else {
                const errorMessage = typeof response.error === 'string'
                    ? response.error
                    : 'Profile update failed';
                setError(errorMessage);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Profile update failed';
            setError(errorMessage);
            logger.error('Profile update failed', {
                error: error instanceof Error ? error.message : String(error)
            });
        } finally {
            setIsLoading(false);
        }
    }, [authState, apiService, logger]);

    return {
        user: authState.user,
        isAuthenticated: authState.isAuthenticated,
        isLoading,
        error,
        login,
        logout,
        refreshToken,
        updateProfile
    };
};