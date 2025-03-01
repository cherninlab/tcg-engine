import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import { uiTheme } from '@rism-tcg/common/theme';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import './index.css';
import { Router } from './Router';

export default function App() {
	return (
		<ErrorBoundary>
			<BrowserRouter>
				<MantineProvider theme={uiTheme}>
					<Notifications />
					<NotificationsProvider>
						<AuthProvider>
							<Router />
						</AuthProvider>
					</NotificationsProvider>
				</MantineProvider>
			</BrowserRouter>
		</ErrorBoundary>
	);
}
