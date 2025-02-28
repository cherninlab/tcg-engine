import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { ErrorPage } from './components/ErrorPage';
import { PageLoader } from './components/PageLoader';
import { useAuth } from './hooks/useAuth';
import appStyles from './styles/AppLayout.module.css';

// Lazy load components
const LoginPage = lazy(() => import('./pages/auth/Login'));
const VerifyTokenPage = lazy(() => import('./pages/auth/VerifyToken'));
const HomePage = lazy(() => import('./pages/Home'));
const GamePlayPage = lazy(() => import('./pages/game/GamePlay'));
const GameLobbyPage = lazy(() => import('./pages/game/GameLobby'));
const DeckBuilderPage = lazy(() => import('./pages/game/DeckBuilder'));
const ProfilePage = lazy(() => import('./pages/profile/Profile'));
const ProfileSettingsPage = lazy(() => import('./pages/profile/ProfileSettings'));

// Route configuration
export const routes = {
	// Public routes
	auth: {
		login: '/auth/login',
		verify: '/auth/verify',
		register: '/auth/register',
		forgotPassword: '/auth/forgot-password',
	},
	// Protected routes
	app: {
		home: '/',
		game: {
			play: '/game/play',
			playWithId: '/game/play/:gameId',
			lobby: '/game/lobby',
			deck: '/game/deck',
		},
		profile: {
			view: '/profile',
			settings: '/profile/settings',
		},
	},
} as const;

// Type-safe route getter
export function getRoute<T extends string[]>(path: T, routeObj: any = routes): string {
	return path.reduce((obj: any, key) => obj[key], routeObj) as string;
}

// Helper to check if route requires auth
export function isProtectedRoute(path: string): boolean {
	return path.startsWith('/game') || path.startsWith('/profile') || path === routes.app.home;
}

// Layout components
const AuthLayout = () => {
	const { isAuthenticated } = useAuth();

	if (isAuthenticated) {
		return <Navigate to={routes.app.home} replace />;
	}

	return (
		<Suspense fallback={<PageLoader />}>
			<Outlet />
		</Suspense>
	);
};

const AppLayout = () => {
	const { isAuthenticated } = useAuth();

	if (!isAuthenticated) {
		return <Navigate to={routes.auth.login} replace />;
	}

	return (
		<div className={appStyles.appLayout}>
			<main className={appStyles.main}>
				<Suspense fallback={<PageLoader />}>
					<Outlet />
				</Suspense>
			</main>
		</div>
	);
};

// Router configuration
export const router = createBrowserRouter([
	{
		element: <AuthLayout />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: routes.auth.login,
				element: <LoginPage />,
			},
			{
				path: routes.auth.verify,
				element: <VerifyTokenPage />,
			},
		],
	},
	{
		element: <AppLayout />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: routes.app.home,
				element: <HomePage />,
			},
			{
				path: routes.app.game.play,
				element: <GamePlayPage />,
			},
			{
				path: routes.app.game.playWithId,
				element: <GamePlayPage />,
			},
			{
				path: routes.app.game.lobby,
				element: <GameLobbyPage />,
			},
			{
				path: routes.app.game.deck,
				element: <DeckBuilderPage />,
			},
			{
				path: routes.app.profile.view,
				element: <ProfilePage />,
			},
			{
				path: routes.app.profile.settings,
				element: <ProfileSettingsPage />,
			},
		],
	},
	{
		path: '*',
		element: <Navigate to={routes.app.home} replace />,
	},
]);
