import { createContext, ReactNode, useContext, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8787';

interface AuthContextType {
	isAuthenticated: boolean;
	loading: boolean;
	error: string | null;
	login: (email: string) => Promise<void>;
	verifyToken: (token: string) => Promise<void>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(() => {
		const token = localStorage.getItem('auth_token');
		return !!token;
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const login = async (email: string) => {
		try {
			setLoading(true);
			setError(null);

			const response = await fetch(`${API_URL}/auth/magic-link`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Failed to send magic link');
			}

			// No need to set isAuthenticated here as the user still needs to click the link
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred');
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const verifyToken = async (token: string) => {
		try {
			setLoading(true);
			setError(null);

			const response = await fetch(`${API_URL}/auth/verify`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ token }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Invalid or expired token');
			}

			const data = await response.json();
			localStorage.setItem('auth_token', data.token);
			setIsAuthenticated(true);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred');
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const logout = () => {
		localStorage.removeItem('auth_token');
		setIsAuthenticated(false);
	};

	return <AuthContext.Provider value={{ isAuthenticated, loading, error, login, verifyToken, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
