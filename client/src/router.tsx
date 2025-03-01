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
const BattlefieldPage = lazy(() => import('./pages/game/Battlefield'));
const DeckBuilderPage = lazy(() => import('./pages/DeckBuilder'));
const LeaderboardPage = lazy(() => import('./pages/Leaderboard'));
const CardPacksPage = lazy(() => import('./pages/CardPacks'));
const ShopPage = lazy(() => import('./pages/Shop'));
const AchievementsPage = lazy(() => import('./pages/Achievements'));
const FriendsPage = lazy(() => import('./pages/Friends'));
const ProfilePage = lazy(() => import('./pages/profile/Profile'));
const ProfileSettingsPage = lazy(() => import('./pages/profile/ProfileSettings'));
const UIComponentsDemo = lazy(() => import('./pages/UIComponentsDemo'));

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
			battlefield: '/game/battlefield',
		},
		leaderboard: '/leaderboard',
		cardPacks: '/card-packs',
		shop: '/shop',
		achievements: '/achievements',
		friends: '/friends',
		profile: {
			view: '/profile',
			settings: '/profile/settings',
		},
		ui: {
			components: '/ui/components',
		},
	},
} as const;

// Type-safe route getter
export function getRoute<T extends string[]>(path: T, routeObj: any = routes): string {
	return path.reduce((obj: any, key) => obj[key], routeObj) as string;
}

// Helper to check if route requires auth
export function isProtectedRoute(path: string): boolean {
	// UI Components page doesn't require auth
	if (path === routes.app.ui.components) {
		return false;
	}

	return path.startsWith('/game') || path.startsWith('/profile') || path === routes.app.home || path === routes.app.leaderboard;
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

// Public layout that doesn't require authentication
const PublicLayout = () => {
	return (
		<div>
			<Suspense fallback={<PageLoader />}>
				<Outlet />
			</Suspense>
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
				path: routes.app.game.battlefield,
				element: <BattlefieldPage />,
			},
			{
				path: routes.app.leaderboard,
				element: <LeaderboardPage />,
			},
			{
				path: routes.app.cardPacks,
				element: <CardPacksPage />,
			},
			{
				path: routes.app.shop,
				element: <ShopPage />,
			},
			{
				path: routes.app.achievements,
				element: <AchievementsPage />,
			},
			{
				path: routes.app.friends,
				element: <FriendsPage />,
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
		element: <PublicLayout />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: routes.app.ui.components,
				element: <UIComponentsDemo />,
			},
		],
	},
	{
		path: '*',
		element: <Navigate to={routes.app.home} replace />,
	},
]);
