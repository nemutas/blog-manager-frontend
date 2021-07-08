import React, { useEffect, useState } from 'react';
import { css } from '@emotion/css';
import {
	Button, Divider, Grid, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText,
	makeStyles, Tooltip, Typography
} from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteIcon from '@material-ui/icons/Delete';
import {
	ArticleType, deleteArticle, getArticles, uploadArticles
} from '../firebase/storageFunctions';

export const ArticleManager: React.FC = () => {
	const classes = useStyles();
	const [articles, setArticles] = useState<ArticleType[]>();

	useEffect(() => {
		const f = async () => {
			setArticles(await getArticles());
		};
		f();
	}, []);

	const onDeleteArticle = async (path: string) => {
		const isSuccess = await deleteArticle(path);
		if (isSuccess) {
			setArticles(await getArticles());
		}
	};

	const onUploadArticle = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			const isSuccess = await uploadArticles(Array.from(files));
			if (isSuccess) {
				setArticles(await getArticles());
			}
		}
	};

	return (
		<Grid container direction="column" alignItems="center">
			{/* Title */}
			<div className={sTitleContainer}>
				<Divider className={classes.divider} />
				<Typography variant="h6">Article</Typography>
				<Divider className={classes.divider} />
			</div>

			{/* Uplaod Button */}
			<div className={sInputContainer}>
				<input
					accept=".md"
					className={classes.input}
					id="button-article-file"
					multiple
					type="file"
					onChange={onUploadArticle}
				/>
				<label htmlFor="button-article-file">
					<Button
						variant="contained"
						color="default"
						component="span"
						className={classes.button}
						startIcon={<CloudUploadIcon />}>
						Upload
					</Button>
				</label>
			</div>

			{/* Article List */}
			<List className={classes.listContainer}>
				{articles &&
					articles.map((article, i) => (
						<div key={i}>
							<ListItem>
								<ListItemText
									primary={article.title}
									secondary={new Date(article.date).toLocaleDateString()}
								/>
								<ListItemSecondaryAction>
									<Tooltip title="Delete" placement="top" arrow>
										<IconButton
											edge="end"
											aria-label="delete"
											onClick={() => onDeleteArticle(article.path)}>
											<DeleteIcon />
										</IconButton>
									</Tooltip>
								</ListItemSecondaryAction>
							</ListItem>
							<Divider />
						</div>
					))}
			</List>
		</Grid>
	);
};

// ===============================================
// Style

const useStyles = makeStyles(theme => ({
	divider: {
		width: 'auto',
		margin: 'auto 10px',
		background: theme.palette.primary.light
	},
	button: {
		width: '100%'
	},
	listContainer: {
		width: '100%',
		maxHeight: 'calc(100vh - 200px)',
		marginTop: '20px',
		overflow: 'auto',
		[theme.breakpoints.down('xs')]: {
			maxHeight: '500px'
		}
	},
	input: {
		display: 'none'
	}
}));

const sTitleContainer = css`
	display: grid;
	grid-template-columns: 1fr auto 1fr;
	width: 100%;
`;

const sInputContainer = css`
	width: 100%;
	margin-top: 20px;
`;
