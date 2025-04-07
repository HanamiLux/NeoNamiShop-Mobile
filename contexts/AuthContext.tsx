import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from "@/services/api";

interface User {
    userId: string;
    email: string;
    login: string;
    roleName: 'manager' | 'dbadmin' | 'user';
}

interface AuthContextType {
    user: User | null;
    isAuthModalOpen: boolean;
    authError: string | null;
    isLoading: boolean;
    openAuthModal: () => void;
    closeAuthModal: () => void;
    contextLogin: (user: User | null, error?: string) => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const checkAuthState = useCallback(async () => {
        try {
            const [userId, email, login, role] = await AsyncStorage.multiGet([
                'userId',
                'email',
                'login',
                'role'
            ]);

            if (userId[1] && email[1] && login[1] && role[1]) {
                setUser({
                    userId: userId[1],
                    email: email[1],
                    login: login[1],
                    roleName: role[1] as 'manager' | 'dbadmin' | 'user'
                });
            }
        } catch (error) {
            console.error('Error checking auth state:', error);
        }
    }, []);

    useEffect(() => {
        checkAuthState();
    }, []);

    const contextLogin = (user: User | null, error?: string) => {
        setUser(user);
        setAuthError(error || null);
    };

    const logout = async () => {
        try {
            await AsyncStorage.multiRemove(['userId', 'email', 'login', 'role']);
            setUser(null);
            Alert.alert('Вы успешно вышли из системы');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthModalOpen,
                authError,
                isLoading,
                openAuthModal: () => {
                    setIsAuthModalOpen(true);
                    setAuthError(null);
                },
                closeAuthModal: () => {
                    setIsAuthModalOpen(false);
                    setAuthError(null);
                },
                contextLogin,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);