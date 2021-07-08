import React from 'react';
import * as colors from '@material-ui/core/colors';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { useAuth } from '../firebase/authFunctions';
import { Auth } from './Auth';
import { Manager } from './Manager';

export const App: React.FC = () => {
	const signInUser = useAuth();

	const theme = createMuiTheme({
		palette: {
			primary: {
				main: colors.orange[800]
			},
			type: 'dark'
			// type: 'light'
		}
	});

	return <ThemeProvider theme={theme}>{signInUser.uid ? <Manager /> : <Auth />}</ThemeProvider>;
};
