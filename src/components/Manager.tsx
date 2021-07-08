import React from 'react';
import { CssBaseline, Divider, Grid, makeStyles, Paper } from '@material-ui/core';
import { ArticleManager } from './ArticleManager';
import { PictureManager } from './PictureManager';
import { TitleBar } from './TitleBar';

export const Manager: React.FC = () => {
	const classes = useStyles();

	return (
		<>
			<TitleBar />
			<Grid container component="main" className={classes.root}>
				<CssBaseline />
				<Grid item xs={12} sm={12} md={6} component={Paper} elevation={6} square>
					<div className={classes.paper}>
						<Grid container spacing={3}>
							<Grid item xs={12} sm={6}>
								<ArticleManager />
							</Grid>
							<Divider orientation="vertical" className={classes.vDivider} />
							<Divider className={classes.hDivider} />
							<Grid item xs={12} sm={6}>
								<PictureManager />
							</Grid>
						</Grid>
					</div>
				</Grid>
				<Grid item xs={false} sm={false} md={6} className={classes.image} />
			</Grid>
		</>
	);
};

// ===============================================
// Style

const useStyles = makeStyles(theme => ({
	root: {
		height: 'calc(100vh - 65px)'
	},
	image: {
		backgroundImage:
			'url(https://images.unsplash.com/photo-1540411003967-af56b79be677?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=634&q=80)',
		backgroundRepeat: 'no-repeat',
		backgroundColor:
			theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
		backgroundSize: 'cover',
		backgroundPosition: 'center'
	},
	paper: {
		margin: '10px',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	vDivider: {
		height: 'calc(100vh - 65px - 20px)',
		margin: '10px -1px',
		backgroundColor: theme.palette.secondary.dark,
		[theme.breakpoints.down('xs')]: {
			display: 'none'
		}
	},
	hDivider: {
		width: '100%',
		margin: '10px 0px',
		backgroundColor: theme.palette.secondary.dark,
		[theme.breakpoints.up('sm')]: {
			display: 'none'
		}
	}
}));
