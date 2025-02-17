import { createContext, ReactNode, useContext, useState } from 'react';

interface AuthContextType {
	isAuthenticated: boolean;
	login: (token: string) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(() => {
		const token = localStorage.getItem('auth_token');
		return !!token;
	});

	const login = (token: string) => {
		localStorage.setItem('auth_token', token);
		setIsAuthenticated(true);
	};

	const logout = () => {
		localStorage.removeItem('auth_token');
		setIsAuthenticated(false);
	};

	return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
