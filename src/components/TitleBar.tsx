import React from 'react';
import { useRecoilValue } from 'recoil';
import {
	AppBar, createStyles, IconButton, makeStyles, Theme, Toolbar, Typography
} from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { signOut } from '../firebase/authFunctions';
import { signInUserState } from '../store/auth';

export const TitleBar: React.FC = () => {
	const classes = useStyles();
	const signInUser = useRecoilValue(signInUserState);

	const onSignOut = async () => {
		await signOut();
	};

	return (
		<div className={classes.root}>
			<AppBar position="static">
				<Toolbar className={classes.toolbar}>
					<Typography variant="h6" className={classes.title}>
						Blog Manager
					</Typography>
					<Typography variant="body1" className={classes.email}>
						{signInUser.email}
					</Typography>
					<IconButton
						edge="start"
						className={classes.menuButton}
						color="inherit"
						onClick={onSignOut}>
						<ExitToAppIcon />
					</IconButton>
				</Toolbar>
			</AppBar>
		</div>
	);
};

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			flexGrow: 1
		},
		toolbar: {
			height: '65px'
		},
		menuButton: {
			marginRight: theme.spacing(1)
		},
		title: {
			flexGrow: 1
		},
		email: {
			marginLeft: 'auto',
			marginRight: '30px'
		}
	})
);
