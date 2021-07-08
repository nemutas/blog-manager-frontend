/**
 * 半角英数字のランダムな文字列を生成する
 * @param generateTextLength 生成する文字列の文字数
 * @returns ランダムな文字列
 */
export function halfwidthAlphanumeric(generateTextLength: number = 16) {
	let S = [...Array(26)].map((_, i) => String.fromCharCode(i + 97)).join(''); // a-z
	S += S.toUpperCase(); // A-Z
	S += '0123456789'; // 0-9
	const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(generateTextLength)))
		.map(n => S[n % S.length])
		.join('');
	return randomChar;
}
