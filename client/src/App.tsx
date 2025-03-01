import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import { uiTheme } from '@rism-tcg/common/theme';
import { RouterProvider } from 'react-router-dom';
import './global.css';
import { AuthProvider } from './hooks/useAuth';
import { router } from './router';

function App() {
	return (
		<MantineProvider theme={uiTheme}>
			<Notifications />
			<AuthProvider>
				<RouterProvider router={router} />
			</AuthProvider>
		</MantineProvider>
	);
}

export default App;
