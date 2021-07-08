import React, { useState } from 'react';
import {
	Avatar, Box, Button, Container, CssBaseline, Grid, IconButton, Link, makeStyles, Modal, Paper,
	TextField, Typography
} from '@material-ui/core';
import CameraIcon from '@material-ui/icons/Camera';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import SendIcon from '@material-ui/icons/Send';
import { sendEmailToPasswordReset, signIn, signInGoogle, signUp } from '../firebase/authFunctions';

export const Auth: React.FC = () => {
	const classes = useStyles();
	const [isSignIn, setIsSignIn] = useState(true);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [opneModal, setOpenModal] = useState(false);
	const [resetEmail, setResetEmail] = useState('');

	const onSendEmailToPasswordReset = async () => {
		try {
			await sendEmailToPasswordReset(resetEmail);
			setOpenModal(false);
			setResetEmail('');
		} catch (error) {
			alert(error.message);
			setResetEmail('');
		}
	};

	const onSingIn = async () => {
		if (isSignIn) {
			await signIn(email, password);
		} else {
			await signUp(email, password);
		}
	};

	const onSignInGoogle = async () => {
		await signInGoogle();
	};

	return (
		<Grid container component="main" className={classes.root}>
			<CssBaseline />
			<Grid item xs={false} sm={4} md={7} className={classes.image} />
			<Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						{isSignIn ? 'Sign In' : 'Register'}
					</Typography>
					<div className={classes.form}>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							id="email"
							label="Email Address"
							name="email"
							autoComplete="email"
							autoFocus
							value={email}
							onChange={e => {
								setEmail(e.target.value);
							}}
						/>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="current-password"
							value={password}
							onChange={e => {
								setPassword(e.target.value);
							}}
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
							disabled={!email || password.length < 6}
							onClick={onSingIn}>
							{isSignIn ? 'Sign In' : 'Register'}
						</Button>
						<Grid container>
							<Grid item xs>
								<Link component="button" variant="body2" onClick={() => setOpenModal(true)}>
									Forgot password?
								</Link>
							</Grid>
							<Grid item>
								<Link component="button" variant="body2" onClick={() => setIsSignIn(prev => !prev)}>
									{isSignIn
										? "Don't have an account? Register"
										: 'Already have an account. Sign In'}
								</Link>
							</Grid>
						</Grid>
						<Button
							fullWidth
							variant="contained"
							color="primary"
							startIcon={<CameraIcon />}
							className={classes.submit}
							onClick={onSignInGoogle}>
							SignIn with Google
						</Button>
						<Box mt={5}>
							<Copyright />
						</Box>
					</div>

					<Modal open={opneModal} onClose={() => setOpenModal(false)}>
						<Container style={getModalStyle()} className={classes.modal}>
							<Grid container>
								<Grid item xs={10}>
									<TextField
										InputLabelProps={{ shrink: true }}
										type="email"
										name="email"
										label="Send Email"
										fullWidth
										value={resetEmail}
										onChange={e => setResetEmail(e.target.value)}
										placeholder="your.signin.email@example.com"
									/>
								</Grid>
								<Grid item xs={2}>
									<IconButton disabled={!resetEmail} onClick={onSendEmailToPasswordReset}>
										<SendIcon />
									</IconButton>
								</Grid>
							</Grid>
						</Container>
					</Modal>
				</div>
			</Grid>
		</Grid>
	);
};

const Copyright: React.FC = () => {
	return (
		<Typography variant="body2" color="textSecondary" align="center">
			{'Copyright © '}
			<Link color="inherit" href="https://github.com/nemutas" target="_blank" rel="noreferrer">
				Nemutas
			</Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	);
};

// ===============================================
// Style

const useStyles = makeStyles(theme => ({
	root: {
		height: '100vh'
	},
	image: {
		backgroundImage:
			'url(https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80)',
		backgroundRepeat: 'no-repeat',
		backgroundColor:
			theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
		backgroundSize: 'cover',
		backgroundPosition: 'center'
	},
	paper: {
		margin: theme.spacing(8, 4),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1)
	},
	submit: {
		margin: theme.spacing(3, 0, 2)
	},
	modal: {
		outline: 'none',
		position: 'absolute',
		width: 400,
		borderRadius: 10,
		backgroundColor: theme.palette.type === 'dark' ? 'rgb(24, 24, 24)' : 'white',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(10, 5)
	}
}));

function getModalStyle() {
	const top = 50;
	const left = 50;

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`
	};
}
