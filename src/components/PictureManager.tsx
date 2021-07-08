import React, { useEffect, useState } from 'react';
import CopyToClipBoard from 'react-copy-to-clipboard';
import { css } from '@emotion/css';
import {
	Button, Divider, Grid, IconButton, makeStyles, Tooltip, Typography
} from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteIcon from '@material-ui/icons/Delete';
import LinkIcon from '@material-ui/icons/Link';
import { deleteImage, getImages, ImageType, uploadImages } from '../firebase/storageFunctions';

export const PictureManager: React.FC = () => {
	const classes = useStyles();
	const [images, setImages] = useState<ImageType[]>();

	const updateList = async () => {
		const fecthImages = await getImages();
		setImages(fecthImages);
	};

	useEffect(() => {
		const f = async () => {
			await updateList();
		};
		f();
	}, []);

	const onUploadImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			const isSuccess = await uploadImages(Array.from(files));
			if (isSuccess) {
				await updateList();
			}
		}
	};

	const onDeleteImage = async (fileName: string) => {
		const isSuccess = await deleteImage(fileName);
		if (isSuccess) {
			await updateList();
		}
	};

	return (
		<Grid container direction="column" alignItems="center">
			{/* Title */}
			<div className={sTitleContainer}>
				<Divider className={classes.divider} />
				<Typography variant="h6">Picture</Typography>
				<Divider className={classes.divider} />
			</div>

			{/* Uplaod Button */}
			<div className={sInputContainer}>
				<input
					accept="image/*"
					className={classes.input}
					id="button-image-file"
					multiple
					type="file"
					onChange={onUploadImages}
				/>
				<label htmlFor="button-image-file">
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

			{/* Image List */}
			<Grid container spacing={1} className={classes.listContainer}>
				{images &&
					images.map((image, i) => (
						<Grid key={i} item xs={12}>
							<div className={sImageContainer}>
								<img src={image.url} alt="" className={sImage} />
								<a href={image.url} target="_blank" rel="noreferrer" className={sImageClickArea}>
									{}
								</a>
								<div className={sImageInfoContainer}>
									<div className={sImageInfoTextContainer}>
										<Typography variant="body2" noWrap>
											{image.name}
										</Typography>
										<Typography variant="body2" className={classes.infoSecondary}>
											{image.date}
										</Typography>
									</div>
									<div style={{ marginRight: '10px' }}>
										<CopyToClipBoard text={`![${image.name}](${image.url})`}>
											<Tooltip title="Copy" placement="top" arrow>
												<IconButton edge="end" aria-label="link" size="small">
													<LinkIcon />
												</IconButton>
											</Tooltip>
										</CopyToClipBoard>
									</div>
									<div>
										<Tooltip title="Delete" placement="top" arrow>
											<IconButton
												aria-label="delete"
												size="small"
												onClick={() => onDeleteImage(image.name)}>
												<DeleteIcon />
											</IconButton>
										</Tooltip>
									</div>
								</div>
							</div>
						</Grid>
					))}
			</Grid>
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
	link: {
		marginTop: '20px'
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
	infoSecondary: {
		color: theme.palette.text.secondary,
		fontSize: '0.7rem'
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

const sImageContainer = css`
	position: relative;
	width: 100%;
	height: 210px;
`;

const sImage = css`
	width: 100%;
	height: 210px;
	object-fit: cover;
	object-position: center;
`;

const sImageInfoContainer = css`
	display: grid;
	position: absolute;
	grid-template-columns: 1fr auto auto;
	width: 100%;
	bottom: 0;
	height: 50px;
	padding: 5px;
	align-items: center;
	background-color: rgba(0, 0, 0, 0.8);
`;

const sImageInfoTextContainer = css`
	flex: auto 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	text-overflow: ellipsis;
	overflow-wrap: break-word;
`;

const sImageClickArea = css`
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	:hover {
		background-color: rgba(255, 255, 255, 0.3);
		cursor: pointer;
	}
`;

const sInputContainer = css`
	width: 100%;
	margin-top: 20px;
`;
