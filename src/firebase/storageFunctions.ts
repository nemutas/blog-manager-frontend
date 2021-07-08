import matter from 'gray-matter';
import path from 'path';
import { storage } from './firebase';

// =============================================
// Image

const urlPrefix = `https://storage.googleapis.com/${process.env.REACT_APP_FIREBASE_STORAGE_BUCKET}/`;

export type ImageType = {
	name: string;
	date: string;
	url: string;
};

/**
 * 画像データ配列を取得する
 * @returns 日付ソートした画像データ配列
 */
export const getImages = async () => {
	try {
		const result: ImageType[] = [];
		const images = await storage.ref('images').list();
		await Promise.all(
			images.items.map(async item => {
				const meta = await item.getMetadata();

				if ((meta.contentType as string).startsWith('image')) {
					result.push({
						name: meta.name,
						date: new Date(meta.updated).toLocaleString(),
						url: urlPrefix + (meta.fullPath as string)
					});
				}
			})
		);

		return result.sort((a: ImageType, b: ImageType) => {
			const a_PathMilli = new Date(a.date);
			const b_PathMilli = new Date(b.date);
			return a_PathMilli < b_PathMilli ? 1 : -1;
		});
	} catch (error) {
		console.log({ error });
	}
};

/**
 * 画像をアップロードする
 * @param files 画像ファイル
 * @returns 成功したかどうか
 */
export const uploadImages = async (files: File[]) => {
	try {
		await Promise.all(
			files.map(async file => {
				await storage.ref(`images/${file.name}`).put(file);
			})
		);
		return true;
	} catch (error) {
		alert('画像のアップロードに失敗しました。');
		return false;
	}
};

/**
 * 画像を削除する
 * @param fileName 対象の画像名
 * @returns 成功したかどうか
 */
export const deleteImage = async (fileName: string) => {
	try {
		await storage.ref(`images/${fileName}`).delete();
		return true;
	} catch (error) {
		alert('画像の削除に失敗しました。');
		return false;
	}
};

// =============================================
// Article

export type ArticleType = {
	title: string;
	date: string;
	path: string;
};

/**
 * 記事の概要を取得する
 * @returns 日付でソートした記事の概要
 */
export const getArticles = async () => {
	console.log('getArticles');

	try {
		const result: ArticleType[] = [];

		// posts直下のファイルを参照する
		const articles = await storage.ref('posts').list();
		await Promise.all(
			articles.items.map(async item => {
				if (path.extname(item.name).toLowerCase() === '.md') {
					result.push(await getArticleContents(item));
				}
			})
		);

		// postsの1つ下のフォルダを参照する
		await Promise.all(
			articles.prefixes.map(async pref => {
				const children = await pref.list();

				await Promise.all(
					children.items.map(async item => {
						if (path.extname(item.name).toLowerCase() === '.md') {
							result.push(await getArticleContents(item));
						}
					})
				);
			})
		);

		return result.sort((a, b) => {
			return a.date < b.date ? 1 : -1;
		});
	} catch (error) {
		console.log({ error });
	}
};

const getArticleContents = async (article: any) => {
	const url = await article.getDownloadURL();
	const res = await fetch(url);
	const data = await res.text();
	const matterResult = matter(data);
	return {
		path: article.fullPath as string,
		...(matterResult.data as { date: string; title: string })
	};
};

/**
 * 記事をアップロードする
 * @param files 記事ファイル
 * @returns 成功したかどうか
 */
export const uploadArticles = async (files: File[]) => {
	try {
		await Promise.all(
			files.map(async file => {
				await storage.ref(`posts/${file.name}`).put(file);
			})
		);
		return true;
	} catch (error) {
		alert('記事のアップロードに失敗しました。');
		return false;
	}
};

/**
 * 記事を削除する
 * @param path 記事のパス
 * @returns 成功したかどうか
 */
export const deleteArticle = async (path: string) => {
	try {
		await storage.ref(path).delete();
		return true;
	} catch (error) {
		alert('記事の削除に失敗しました。');
		return false;
	}
};
