import { AppShell, LoadingOverlay, NavLink } from '@mantine/core';
import { IconCards, IconDashboard, IconLayersSubtract, IconUsers } from '@tabler/icons-react';
import { ReactNode, Suspense } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface AdminLayoutProps {
	children: ReactNode;
}

const navigation = [
	{ path: '/', label: 'Dashboard', icon: IconDashboard },
	{ path: '/cards', label: 'Cards', icon: IconCards },
	{ path: '/decks', label: 'Decks', icon: IconLayersSubtract },
	{ path: '/players', label: 'Players', icon: IconUsers },
];

export function AdminLayout({ children }: AdminLayoutProps) {
	const location = useLocation();

	return (
		<AppShell navbar={{ width: 300, breakpoint: 'sm' }} padding="md">
			<AppShell.Navbar p="md">
				{navigation.map((item) => (
					<NavLink
						key={item.path}
						component={Link}
						to={item.path}
						label={item.label}
						leftSection={<item.icon size="1.2rem" stroke={1.5} />}
						active={location.pathname === item.path}
					/>
				))}
			</AppShell.Navbar>

			<AppShell.Main>
				<Suspense fallback={<LoadingOverlay visible />}>{children}</Suspense>
			</AppShell.Main>
		</AppShell>
	);
}
