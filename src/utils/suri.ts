/**
 * @typedef {Object} SURIObject
 * @property {string} phrase - The valid bip39 seed phrase
 * @property {string} derivePath - The derivation path consisting in `/soft` and or `//hard`, can be repeated and interchanges
 * @property {string} password - The optionnal password password without the `///`
 */

/**
 * @typedef {Object} DerivationPathObject
 * @property {string} derivePath - The derivation path consisting in `/soft` and or `//hard`, can be repeated and interchanges
 * @property {string} password - The optionnal password password without the `///`
 */

import { SURIObject } from 'types/scannerTypes';

/**
 * @description Extract the phrase, path and password from a SURI format for specifying secret keys `<secret>/<soft-key>//<hard-key>///<password>` (the `///password` may be omitted, and `/<soft-key>` and `//<hard-key>` maybe repeated and mixed).
 * @param {string} suri The SURI to be parsed
 * @returns {SURIObject}
 */

/**
 * @description Extract the path and password from a SURI format for specifying secret keys `/<soft-key>//<hard-key>///<password>` (the `///password` may be omitted, and `/<soft-key>` and `//<hard-key>` maybe repeated and mixed).
 * @param {string} input: suri The SURI to be parsed
 * @returns {DerivationPathObject}
 */

export function parseDerivationPath(
	input: string
): {
	derivePath: string;
	password: string;
} {
	const RE_CAPTURE = /^((?:\/\/?[^/]+)*)(?:\/\/\/(.*))?$/;
	const matches = input.match(RE_CAPTURE);
	let derivePath, password;

	if (matches) {
		[, derivePath = '', password = ''] = matches;
	} else {
		throw new Error('Invalid derivation path input.');
	}

	return {
		derivePath,
		password
	};
}

export function parseSURI(suri: string): SURIObject {
	const RE_CAPTURE = /^([\w ]+(?: +\w*)*)?(.*)$/;
	const matches = suri.match(RE_CAPTURE);
	let phrase,
		parsedDerivationPath,
		derivationPath = '';
	const ERROR = 'Invalid SURI input.';

	if (matches) {
		[, phrase, derivationPath = ''] = matches;
		try {
			parsedDerivationPath = parseDerivationPath(derivationPath);
		} catch {
			throw new Error(ERROR);
		}
	} else {
		throw new Error(ERROR);
	}

	if (!phrase) {
		throw new Error('SURI must contain a phrase.');
	}

	return {
		derivePath: parsedDerivationPath.derivePath || '',
		password: parsedDerivationPath.password || '',
		phrase
	};
}

/**
 * @description Return a SURI format from a bip39 phrase, a derivePath, e.g `//hard/soft` and a password.
 * @param {SURIObject} SURIObject
 * @returns {string}
 */

export function constructSURI({
	derivePath = '',
	password = '',
	phrase
}: {
	derivePath?: string;
	password?: string;
	phrase: string;
}): string {
	if (!phrase) {
		throw new Error('Cannot construct an SURI from emtpy phrase.');
	}

	return `${phrase}${derivePath}///${password}`;
}

export function constructSuriSuffix({
	derivePath = '',
	password = ''
}: {
	derivePath?: string;
	password?: string;
}): string {
	return `${derivePath}///${password}`;
}
