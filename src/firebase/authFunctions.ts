import { useEffect } from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { signInUserState } from '../store/auth';
import { auth, provider } from './firebase';

/**
 * ユーザー認証する
 */
export const signIn = async (email: string, password: string) => {
	try {
		await auth.signInWithEmailAndPassword(email, password);
	} catch (error) {
		alert('サインイン認証に失敗しました。');
	}
};

/**
 * ユーザー登録する
 */
export const signUp = async (email: string, password: string) => {
	try {
		await auth.createUserWithEmailAndPassword(email, password);
	} catch (error) {
		alert('ユーザー登録に失敗しました。');
	}
};

/**
 * googleアカウントでログインする
 */
export const signInGoogle = async () => {
	// ポップアップでgoogleのサインインを表示する
	try {
		await auth.signInWithPopup(provider);
	} catch (error) {
		alert('Googleアカウント認証に失敗しました。');
	}
};

/**
 * サインアウトする
 */
export const signOut = async () => {
	try {
		await auth.signOut();
	} catch (error) {
		alert('サインアウトに失敗しました。');
	}
};

/**
 * パスワードの再設定メールを送信する
 */
export const sendEmailToPasswordReset = async (resetEmail: string) => {
	await auth.sendPasswordResetEmail(resetEmail);
};

/**
 * SignInの状態を監視する
 */
export const useAuth = () => {
	const [signInUser, setSignInUser] = useRecoilState(signInUserState);
	const resetStatus = useResetRecoilState(signInUserState);

	useEffect(() => {
		const unSub = auth.onAuthStateChanged(authUser => {
			if (authUser) {
				setSignInUser({
					uid: authUser.uid,
					email: authUser.email!
				});
			} else {
				resetStatus();
			}
		});
		return () => unSub();
	}, [setSignInUser, resetStatus]);

	return signInUser;
};
