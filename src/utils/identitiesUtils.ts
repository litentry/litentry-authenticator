import { pathsRegex } from './regex';
import { decryptData, substrateAddress } from './native';
import { constructSURI, parseSURI } from './suri';
import { generateAccountId } from './account';

import {
	defaultNetworkPrefix,
	SERVICES_KEYS,
	SERVICES_LIST,
	UNKNOWN_SERVICE_KEY
} from 'constants/servicesSpecs';
import { TryCreateFunc } from 'utils/seedRefHooks';
import {
	SUBSTRATE_NETWORK_LIST,
	SubstrateNetworkKeys,
	UnknownNetworkKeys,
	unknownNetworkPathId
} from 'constants/networkSpecs';
import {
	Account,
	AccountMeta,
	FoundAccount,
	FoundLegacyAccount,
	Identity,
	PathGroup,
	SerializedIdentity,
	UnlockedAccount
} from 'types/identityTypes';
import {
	centrifugeAmberMetadata,
	centrifugeMetadata,
	defaultMetaData,
	edgewareMetadata,
	kulupuMetadata,
	kusamaMetadata,
	polkadotMetaData,
	substrateDevMetadata,
	westendMetadata
} from 'constants/networkMetadata';

//walk around to fix the regular expression support for positive look behind;
export const removeSlash = (str: string): string => str.replace(/\//g, '');

export function isLegacyFoundAccount(
	foundAccount: FoundAccount
): foundAccount is FoundLegacyAccount {
	return foundAccount.isLegacy;
}

export const extractPathId = (path: string): string => {
	const matchNetworkPath = path.match(pathsRegex.networkPath);
	if (matchNetworkPath && matchNetworkPath[0]) {
		const targetPathId = removeSlash(matchNetworkPath[0]);
		if (Object.keys(SERVICES_KEYS).includes(targetPathId)) {
			return targetPathId;
		}
	}
	return UNKNOWN_SERVICE_KEY;
};

export const extractSubPathName = (path: string): string => {
	const pathFragments = path.match(pathsRegex.allPath);
	if (!pathFragments || pathFragments.length === 0) return '';
	if (pathFragments.length === 1) return removeSlash(pathFragments[0]);
	return removeSlash(pathFragments.slice(1).join(''));
};

export const isSubstratePath = (path: string): boolean =>
	path.match(pathsRegex.allPath) !== null || path === '';

export const isEthereumAccountId = (v: string): boolean =>
	v.indexOf('ethereum:') === 0;

export const isSubstrateHardDerivedPath = (path: string): boolean => {
	if (!isSubstratePath(path)) return false;
	const pathFragments = path.match(pathsRegex.allPath);
	if (!pathFragments || pathFragments.length === 0) return false;
	return pathFragments.every((pathFragment: string) => {
		return pathFragment.substring(0, 2) === '//';
	});
};

export const extractAddressFromAccountId = (id: string): string => {
	const withoutNetwork = id.split(':')[1];
	const address = withoutNetwork.split('@')[0];
	if (address.indexOf('0x') !== -1) {
		return address.slice(2);
	}
	return address;
};

export const getAddressKeyByPath = (
	path: string,
	pathMeta: AccountMeta
): string => {
	const address = pathMeta.address;
	return isSubstratePath(path)
		? address
		: generateAccountId({
				address,
				networkKey: getServiceKeyByPath(path, pathMeta)
		  });
};

export function emptyIdentity(): Identity {
	return {
		addresses: new Map(),
		derivationPassword: '',
		encryptedSeed: '',
		meta: new Map(),
		name: ''
	};
}

export const serializeIdentity = (identity: Identity): SerializedIdentity =>
	Object.entries(identity).reduce((newIdentity: any, entry: [string, any]) => {
		const [key, value] = entry;
		if (value instanceof Map) {
			newIdentity[key] = Array.from(value.entries());
		} else {
			newIdentity[key] = value;
		}
		return newIdentity;
	}, {});

export const deserializeIdentity = (
	identityJSON: SerializedIdentity
): Identity =>
	Object.entries(identityJSON).reduce(
		(newIdentity: any, entry: [string, any]) => {
			const [key, value] = entry;
			if (value instanceof Array) {
				newIdentity[key] = new Map(value);
			} else {
				newIdentity[key] = value;
			}
			return newIdentity;
		},
		{}
	);

export const serializeIdentities = (identities: Identity[]): string => {
	const identitiesWithObject = identities.map(serializeIdentity);
	return JSON.stringify(identitiesWithObject);
};

export const deserializeIdentities = (identitiesJSON: string): Identity[] => {
	const identitiesWithObject = JSON.parse(identitiesJSON);
	return identitiesWithObject.map(deserializeIdentity);
};

export const deepCopyIdentities = (identities: Identity[]): Identity[] =>
	deserializeIdentities(serializeIdentities(identities));

export const deepCopyIdentity = (identity: Identity): Identity =>
	deserializeIdentity(serializeIdentity(identity));

export const getAllPaths = (identity: Identity): string[] => {
	return Array.from(identity.meta.keys());
};

export const getNetworkKeyByPathId = (pathId: string): string => {
	return SERVICES_LIST.hasOwnProperty(pathId)
		? pathId
		: UnknownNetworkKeys.UNKNOWN;
};

export const getServiceKey = (path: string, identity: Identity): string => {
	if (identity.meta.has(path)) {
		return getServiceKeyByPath(path, identity.meta.get(path)!);
	}
	return UnknownNetworkKeys.UNKNOWN;
};

export const getServiceKeyByPath = (
	path: string,
	pathMeta: AccountMeta
): string => {
	const pathId = pathMeta.networkPathId || extractPathId(path);
	return getNetworkKeyByPathId(pathId);
};

export const parseFoundLegacyAccount = (
	legacyAccount: Account,
	accountId: string
): FoundLegacyAccount => {
	const returnAccount: FoundLegacyAccount = {
		accountId,
		address: legacyAccount.address,
		createdAt: legacyAccount.createdAt,
		encryptedSeed: legacyAccount.encryptedSeed,
		isLegacy: true,
		name: legacyAccount.name,
		networkKey: legacyAccount.networkKey,
		updatedAt: legacyAccount.updatedAt,
		validBip39Seed: legacyAccount.validBip39Seed
	};
	if (legacyAccount.hasOwnProperty('derivationPath')) {
		returnAccount.path = (legacyAccount as UnlockedAccount).derivationPath;
	}
	return returnAccount;
};

export const getIdentityFromSender = (
	sender: FoundAccount,
	identities: Identity[]
): Identity | undefined =>
	identities.find(i => i.encryptedSeed === sender.encryptedSeed);

export const getAddressWithPath = (
	path: string,
	identity: Identity | null
): string => {
	if (identity == null) return '';
	const pathMeta = identity.meta.get(path);
	if (!pathMeta) return '';
	const { address } = pathMeta;
	return isEthereumAccountId(address)
		? extractAddressFromAccountId(address)
		: address;
};

export const unlockIdentitySeedWithReturn = async (
	pin: string,
	identity: Identity,
	createSeedRef: TryCreateFunc
): Promise<string> => {
	const { encryptedSeed } = identity;
	const seed = await decryptData(encryptedSeed, pin);
	await createSeedRef(pin);
	const { phrase } = parseSURI(seed);
	return phrase;
};

export const verifyPassword = async (
	password: string,
	seedPhrase: string,
	identity: Identity,
	path: string
): Promise<boolean> => {
	const suri = constructSURI({
		derivePath: path,
		password: password,
		phrase: seedPhrase
	});
	const networkKey = getServiceKey(path, identity);
	const networkParams = SUBSTRATE_NETWORK_LIST[networkKey];
	const address = await substrateAddress(suri, defaultNetworkPrefix);
	const accountMeta = identity.meta.get(path);
	return address === accountMeta?.address;
};

export const getExistedServicesKeys = (identity: Identity): string[] => {
	const pathEntries = Array.from(identity.meta.entries());
	const networkKeysSet = pathEntries.reduce(
		(networksSet, [path, pathMeta]: [string, AccountMeta]) => {
			const networkKey = getServiceKeyByPath(path, pathMeta);
			return { ...networksSet, [networkKey]: true };
		},
		{}
	);
	return Object.keys(networkKeysSet);
};

export const validateDerivedPath = (derivedPath: string): boolean =>
	pathsRegex.validateDerivedPath.test(derivedPath);

export const getIdentityName = (
	identity: Identity,
	identities: Identity[]
): string => {
	if (identity.name) return identity.name;
	const identityIndex = identities.findIndex(
		i => i.encryptedSeed === identity.encryptedSeed
	);
	return `Identity_${identityIndex}`;
};

export const getPathName = (
	path: string,
	lookUpIdentity: Identity | null
): string => {
	if (
		lookUpIdentity &&
		lookUpIdentity.meta.has(path) &&
		lookUpIdentity.meta.get(path)!.name !== ''
	) {
		return lookUpIdentity.meta.get(path)!.name;
	}
	if (!isSubstratePath(path)) return 'No name';
	if (path === '') return 'Identity root';
	return extractSubPathName(path);
};

const _comparePathGroups = (a: PathGroup, b: PathGroup): number => {
	const isSingleGroupA = a.paths.length === 1;
	const isSingleGroupB = b.paths.length === 1;
	if (isSingleGroupA && isSingleGroupB) {
		return a.paths[0].length - b.paths[0].length;
	}
	if (isSingleGroupA !== isSingleGroupB) {
		return isSingleGroupA ? -1 : 1;
	}
	return a.title.localeCompare(b.title);
};

const _comparePathsInGroup = (a: string, b: string): number => {
	const pathFragmentsA = a.match(pathsRegex.allPath)!;
	const pathFragmentsB = b.match(pathsRegex.allPath)!;
	if (pathFragmentsA.length !== pathFragmentsB.length) {
		return pathFragmentsA.length - pathFragmentsB.length;
	}
	const lastFragmentA = pathFragmentsA[pathFragmentsA.length - 1];
	const lastFragmentB = pathFragmentsB[pathFragmentsB.length - 1];
	const numberA = parseInt(removeSlash(lastFragmentA), 10);
	const numberB = parseInt(removeSlash(lastFragmentB), 10);
	const isNumberA = !isNaN(numberA);
	const isNumberB = !isNaN(numberB);
	if (isNumberA && isNumberB) {
		return numberA - numberB;
	}
	if (isNumberA !== isNumberB) {
		return isNumberA ? -1 : 1;
	}
	return lastFragmentA.localeCompare(lastFragmentB);
};

/**
 * This function decides how to group the list of derivation paths in the display based on the following rules.
 * If the network is unknown: group by the first subpath, e.g. '/random' of '/random//derivation/1'
 * If the network is known: group by the second subpath, e.g. '//staking' of '//kusama//staking/0'
 * Please refer to identitiesUtils.spec.js for more examples.
 **/
export const groupPaths = (paths: string[]): PathGroup[] => {
	const insertPathIntoGroup = (
		matchingPath: string,
		fullPath: string,
		pathGroup: PathGroup[]
	): void => {
		const matchResult = matchingPath.match(pathsRegex.firstPath);
		const groupName = matchResult ? matchResult[0] : '-';

		const existedItem = pathGroup.find(p => p.title === groupName);
		if (existedItem) {
			existedItem.paths.push(fullPath);
			existedItem.paths.sort(_comparePathsInGroup);
		} else {
			pathGroup.push({ paths: [fullPath], title: groupName });
		}
	};

	const groupedPaths = paths.reduce(
		(groupedPath: PathGroup[], path: string) => {
			if (path === '') {
				groupedPath.push({ paths: [''], title: 'Identity root' });
				return groupedPath;
			}

			const rootPath = path.match(pathsRegex.firstPath)?.[0];
			if (rootPath === undefined) return groupedPath;

			const networkParams = Object.values(SUBSTRATE_NETWORK_LIST).find(
				v => `//${v.pathId}` === rootPath
			);
			if (networkParams === undefined) {
				insertPathIntoGroup(path, path, groupedPath);
				return groupedPath;
			}

			const isRootPath = path === rootPath;
			if (isRootPath) {
				groupedPath.push({
					paths: [path],
					title: `${networkParams.title} root`
				});
				return groupedPath;
			}

			const subPath = path.slice(rootPath.length);
			insertPathIntoGroup(subPath, path, groupedPath);

			return groupedPath;
		},
		[]
	);
	return groupedPaths.sort(_comparePathGroups);
};

export const getMetadata = (networkKey: string): string => {
	switch (networkKey) {
		case SubstrateNetworkKeys.CENTRIFUGE:
			return centrifugeMetadata;
		case SubstrateNetworkKeys.CENTRIFUGE_AMBER:
			return centrifugeAmberMetadata;
		case SubstrateNetworkKeys.KUSAMA:
		case SubstrateNetworkKeys.KUSAMA_CC2:
		case SubstrateNetworkKeys.KUSAMA_DEV:
			return kusamaMetadata;
		case SubstrateNetworkKeys.WESTEND:
			return westendMetadata;
		case SubstrateNetworkKeys.SUBSTRATE_DEV:
			return substrateDevMetadata;
		case SubstrateNetworkKeys.EDGEWARE:
			return edgewareMetadata;
		case SubstrateNetworkKeys.KULUPU:
			return kulupuMetadata;
		case SubstrateNetworkKeys.POLKADOT:
			return polkadotMetaData;
		default:
			return defaultMetaData;
	}
};
