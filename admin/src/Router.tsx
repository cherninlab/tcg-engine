import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { AdminLayout } from './layouts/AdminLayout';
import { CardsPage } from './pages/Cards.page';
import { DashboardPage } from './pages/Dashboard.page';
import { DecksPage } from './pages/Decks.page';
import { LoginPage } from './pages/Login.page';
import { PlayersPage } from './pages/Players.page';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
	const { user, loading } = useAuth();

	if (loading) {
		return <div>Loading...</div>;
	}

	if (!user) {
		return <Navigate to="/login" />;
	}

	return <>{children}</>;
}

function AdminRoutes() {
	return (
		<ProtectedRoute>
			<AdminLayout>
				<Routes>
					<Route path="/" element={<DashboardPage />} />
					<Route path="/cards" element={<CardsPage />} />
					<Route path="/decks" element={<DecksPage />} />
					<Route path="/players" element={<PlayersPage />} />
				</Routes>
			</AdminLayout>
		</ProtectedRoute>
	);
}

export function Router() {
	const { user } = useAuth();

	return (
		<Routes>
			<Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
			<Route path="/*" element={<AdminRoutes />} />
		</Routes>
	);
}
