/*
 * @dev Check if input is in Ascii table.
 */
export function isAscii(data: string | number): boolean {
	/* eslint-disable-next-line no-control-regex */
	return /^[\x00-\x7F]*$/.test(data as string);
}

/*
 * @dev Take hex encoded binary and make it utf-8 readable
 */
export function hexToAscii(hexx: string): string {
	const hex = hexx.toString();
	let str = '';
	for (let i = 0; i < hex.length; i += 2) {
		str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
	}

	return str;
}

/*
 * @dev Take a long string and output the first and last 10 chars.
 */

export function shortString(original: string): string {
	return original
		.substr(0, 20)
		.concat('......')
		.concat(original.substr(original.length - 20));
}
