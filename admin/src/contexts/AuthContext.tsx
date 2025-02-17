import { createContext, useContext, ReactNode, useState, useCallback } from 'react';

interface User {
    id: string;
    email: string;
    role: 'admin';
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = useCallback(async (email: string, password: string) => {
        try {
            setLoading(true);
            setError(null);

            // TODO: Replace with actual API call
            if (email === 'admin@example.com' && password === 'adminadmin') {
                setUser({
                    id: '1',
                    email,
                    role: 'admin'
                });
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        // TODO: Clear any stored tokens/session
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, error, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
