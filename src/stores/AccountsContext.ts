import {
	defaultNetworkKey,
	ETHEREUM_NETWORK_LIST,
	NetworkProtocols,
	SUBSTRATE_NETWORK_LIST,
	UnknownNetworkKeys
} from 'constants/networkSpecs';

import {defaultNetworkPrefix} from 'constants/servicesSpecs';
import {default as React, useEffect, useReducer} from 'react';
import {Account, AccountsStoreState, FoundIdentityAccount, Identity, LockedAccount} from 'types/identityTypes';
import {emptyAccount, generateAccountId} from 'utils/account';
import {loadIdentities, saveIdentities} from 'utils/db';
import {
	accountExistedError,
	addressGenerateError,
	duplicatedIdentityError,
	emptyIdentityError,
	identityUpdateError
} from 'utils/errors';
import {
	deepCopyIdentities,
	deepCopyIdentity,
	emptyIdentity,
	extractAddressFromAccountId,
	getAddressKeyByPath,
	getNetworkKey,
	isEthereumAccountId
} from 'utils/identitiesUtils';
import {brainWalletAddressWithRef, encryptData} from 'utils/native';
import {CreateSeedRefWithNewSeed, TryBrainWalletAddress, TrySubstrateAddress} from 'utils/seedRefHooks';
import {constructSuriSuffix} from 'utils/suri';

export type AccountsContextState = {
	clearIdentity: () => void;
	state: AccountsStoreState;
	deriveEthereumAccount: (
		createBrainWalletAddress: TryBrainWalletAddress,
		networkKey: string
	) => Promise<void>;
	updateSelectedAccount: (updatedAccount: Partial<LockedAccount>) => void;
	getById: ({
		address,
		networkKey
	}: {
		address: string;
		networkKey: string;
	}) => null | FoundIdentityAccount;
	getAccountByAddress: (address: string) => false | FoundIdentityAccount;
	getIdentityByAccountId: (accountId: string) => Identity | undefined;
	resetCurrentIdentity: () => void;
	saveNewIdentity: (
		seedPhrase: string,
		pin: string,
		generateSeedRef: CreateSeedRefWithNewSeed
	) => Promise<void>;
	selectIdentity: (identity: Identity) => void;
	updateNewIdentity: (identityUpdate: Partial<Identity>) => void;
	updateIdentityName: (name: string) => void;
	updatePathName: (path: string, name: string) => void;
	deriveNewPath: (
		newPath: string,
		createSubstrateAddress: TrySubstrateAddress,
		serviceKey: string,
		name: string,
		password: string
	) => Promise<void>;
	deletePath: (path: string) => void;
	deleteCurrentIdentity: () => Promise<void>;
};

const defaultAccountState = {
	accounts: new Map(),
	currentIdentity: null,
	identities: [],
	loaded: false,
	newAccount: emptyAccount(),
	newIdentity: emptyIdentity(),
	selectedKey: ''
};

export function useAccountContext(): AccountsContextState {
	const initialState: AccountsStoreState = defaultAccountState;

	const reducer = (
		state: AccountsStoreState,
		delta: Partial<AccountsStoreState>
	): AccountsStoreState => ({
		...state,
		...delta
	});
	const [state, setState] = useReducer(reducer, initialState);
	useEffect(() => {
		const loadInitialContext = async (): Promise<void> => {
			const identities = await loadIdentities();
			const currentIdentity = identities.length > 0 ? identities[0] : null;
			setState({
				currentIdentity,
				identities,
				loaded: true
			});
		};
		loadInitialContext();
	}, []);

	function _updateIdentitiesWithCurrentIdentity(
		updatedCurrentIdentity: Identity
	): void {
		setState({
			currentIdentity: updatedCurrentIdentity
		});
		const newIdentities = deepCopyIdentities(state.identities);
		if (state.currentIdentity === null) return;
		const identityIndex = newIdentities.findIndex(
			(identity: Identity) =>
				identity.encryptedSeed === state.currentIdentity!.encryptedSeed
		);
		newIdentities.splice(identityIndex, 1, updatedCurrentIdentity);
		setState({ identities: newIdentities });
		saveIdentities(newIdentities);
	}

	function _updateCurrentIdentity(updatedIdentity: Identity): void {
		try {
			_updateIdentitiesWithCurrentIdentity(updatedIdentity);
		} catch (error) {
			throw new Error(identityUpdateError);
		}
	}

	function updateIdentityName(name: string): void {
		const updatedCurrentIdentity = deepCopyIdentity(state.currentIdentity!);
		updatedCurrentIdentity.name = name;
		_updateCurrentIdentity(updatedCurrentIdentity);
	}

	async function deriveEthereumAccount(
		createBrainWalletAddress: TryBrainWalletAddress,
		networkKey: string
	): Promise<void> {
		const networkParams = ETHEREUM_NETWORK_LIST[networkKey];
		const ethereumAddress = await brainWalletAddressWithRef(
			createBrainWalletAddress
		);
		if (ethereumAddress.address === '') throw new Error(addressGenerateError);
		const { ethereumChainId } = networkParams;
		const accountId = generateAccountId({
			address: ethereumAddress.address,
			networkKey
		});
		if (state.currentIdentity === null) throw new Error(emptyIdentityError);
		const updatedCurrentIdentity = deepCopyIdentity(state.currentIdentity);
		if (updatedCurrentIdentity.meta.has(ethereumChainId))
			throw new Error(accountExistedError);
		updatedCurrentIdentity.meta.set(ethereumChainId, {
			address: ethereumAddress.address,
			createdAt: new Date().getTime(),
			name: '',
			updatedAt: new Date().getTime()
		});
		updatedCurrentIdentity.addresses.set(accountId, ethereumChainId);
		_updateCurrentIdentity(updatedCurrentIdentity);
	}

	function _updateAccount(
		accountKey: string,
		updatedAccount: Partial<LockedAccount>
	): void {
		const accounts = state.accounts;
		const account = accounts.get(accountKey);

		if (account && updatedAccount) {
			setState({
				accounts: accounts.set(accountKey, { ...account, ...updatedAccount })
			});
		}
	}

	function updateSelectedAccount(updatedAccount: Partial<LockedAccount>): void {
		_updateAccount(state.selectedKey, updatedAccount);
	}

	function _getAccountWithoutCaseSensitive(accountId: string): Account | null {
		let findLegacyAccount = null;
		for (const [key, value] of state.accounts) {
			if (isEthereumAccountId(accountId)) {
				if (key.toLowerCase() === accountId.toLowerCase()) {
					findLegacyAccount = value;
					break;
				}
			} else if (key === accountId) {
				findLegacyAccount = value;
				break;
			} else if (
				//backward compatible with hard spoon substrate key pairs
				extractAddressFromAccountId(key) ===
				extractAddressFromAccountId(accountId)
			) {
				findLegacyAccount = value;
				break;
			}
		}
		return findLegacyAccount;
	}

	function _getAccountFromIdentity(
		accountIdOrAddress: string
	): false | FoundIdentityAccount {
		const isAccountId = accountIdOrAddress.split(':').length > 1;
		let targetAccountId = null;
		let targetIdentity = null;
		let targetNetworkKey = null;
		let targetPath = null;
		for (const identity of state.identities) {
			const searchList = Array.from(identity.addresses.entries());
			for (const [addressKey, path] of searchList) {
				const networkKey = getNetworkKey(path, identity);
				const accountId = generateAccountId({ address: addressKey, networkKey });
				const searchAccountIdOrAddress = isAccountId ? accountId : addressKey;
				const found = isEthereumAccountId(accountId)
					? searchAccountIdOrAddress.toLowerCase() ===
					  accountIdOrAddress.toLowerCase()
					: searchAccountIdOrAddress === accountIdOrAddress;
				if (found) {
					targetPath = path;
					targetIdentity = identity;
					targetAccountId = accountId;
					targetNetworkKey = networkKey;
					break;
				}
			}
		}

		if (
			targetPath === null ||
			targetIdentity === null ||
			targetAccountId === null
		)
			return false;
		setState({ currentIdentity: targetIdentity });

		const metaData = targetIdentity.meta.get(targetPath);
		if (metaData === undefined) return false;
		return {
			accountId: targetAccountId,
			encryptedSeed: targetIdentity.encryptedSeed,
			hasPassword: !!metaData.hasPassword,
			isLegacy: false,
			networkKey: targetNetworkKey!,
			path: targetPath,
			validBip39Seed: true,
			...metaData
		};
	}

	function getById({
		address,
		networkKey
	}: {
		address: string;
		networkKey: string;
	}): null | FoundIdentityAccount {
		const accountId = generateAccountId({ address, networkKey });
		let derivedAccount;
		//assume it is an accountId
		if (networkKey !== UnknownNetworkKeys.UNKNOWN) {
			derivedAccount = _getAccountFromIdentity(accountId);
		}
		//TODO backward support for user who has create account in known network for an unknown network. removed after offline network update
		derivedAccount = derivedAccount || _getAccountFromIdentity(address);

		if (derivedAccount instanceof Object)
			return { ...derivedAccount, isLegacy: false };
		return null;
	}

	function getAccountByAddress(address: string): false | FoundIdentityAccount {
		if (!address) {
			return false;
		}
		return _getAccountFromIdentity(address);
	}

	function getIdentityByAccountId(accountId: string): Identity | undefined {
		const networkProtocol = accountId.split(':')[0];
		const searchAddress =
			networkProtocol === NetworkProtocols.SUBSTRATE
				? extractAddressFromAccountId(accountId)
				: accountId;
		return state.identities.find(identity =>
			identity.addresses.has(searchAddress)
		);
	}

	function resetCurrentIdentity(): void {
		setState({ currentIdentity: null });
	}

	async function _addPathToIdentity(
		newPath: string,
		createSubstrateAddress: TrySubstrateAddress,
		updatedIdentity: Identity,
		name: string,
		serviceKey: string,
		password: string
	): Promise<Identity> {
		const { pathId } = SUBSTRATE_NETWORK_LIST[defaultNetworkKey];
		const suriSuffix = constructSuriSuffix({
			derivePath: newPath,
			password
		});
		if (updatedIdentity.meta.has(newPath)) throw new Error(accountExistedError);
		let address = '';
		try {
			address = await createSubstrateAddress(suriSuffix, defaultNetworkPrefix);
		} catch (e) {
			throw new Error(addressGenerateError);
		}
		if (address === '') throw new Error(addressGenerateError);
		const pathMeta = {
			address,
			createdAt: new Date().getTime(),
			hasPassword: password !== '',
			name,
			networkPathId: pathId,
			updatedAt: new Date().getTime()
		};
		updatedIdentity.meta.set(newPath, pathMeta);
		updatedIdentity.addresses.set(address, newPath);
		return updatedIdentity;
	}

	async function saveNewIdentity(
		seedPhrase: string,
		pin: string,
		generateSeedRef: CreateSeedRefWithNewSeed
	): Promise<void> {
		const updatedIdentity = deepCopyIdentity(state.newIdentity);
		const suri = seedPhrase;

		updatedIdentity.encryptedSeed = await encryptData(suri, pin);
		//prevent duplication
		if (
			state.identities.find(
				i => i.encryptedSeed === updatedIdentity.encryptedSeed
			)
		)
			throw new Error(duplicatedIdentityError);
		await generateSeedRef(updatedIdentity.encryptedSeed, pin);
		const newIdentities = state.identities.concat(updatedIdentity);
		setState({
			currentIdentity: updatedIdentity,
			identities: newIdentities,
			newIdentity: emptyIdentity()
		});
		await saveIdentities(newIdentities);
	}

	function selectIdentity(identity: Identity): void {
		setState({ currentIdentity: identity });
	}

	function clearIdentity(): void {
		setState({ newIdentity: emptyIdentity() });
	}

	function updateNewIdentity(identityUpdate: Partial<Identity>): void {
		setState({
			newIdentity: { ...state.newIdentity, ...identityUpdate }
		});
	}

	function updatePathName(path: string, name: string): void {
		const updatedCurrentIdentity = deepCopyIdentity(state.currentIdentity!);
		const updatedPathMeta = Object.assign(
			{},
			updatedCurrentIdentity.meta.get(path),
			{ name }
		);
		updatedCurrentIdentity.meta.set(path, updatedPathMeta);
		_updateCurrentIdentity(updatedCurrentIdentity);
	}

	async function deriveNewPath(
		newPath: string,
		createSubstrateAddress: TrySubstrateAddress,
		serviceKey: string,
		name: string,
		password: string
	): Promise<void> {
		const updatedCurrentIdentity = deepCopyIdentity(state.currentIdentity!);
		await _addPathToIdentity(
			newPath,
			createSubstrateAddress,
			updatedCurrentIdentity,
			name,
			serviceKey,
			password
		);
		_updateCurrentIdentity(updatedCurrentIdentity);
	}

	function deletePath(path: string): void {
		if (state.currentIdentity === null) throw new Error(emptyIdentityError);
		const updatedCurrentIdentity = deepCopyIdentity(state.currentIdentity);
		const pathMeta = updatedCurrentIdentity.meta.get(path)!;
		updatedCurrentIdentity.meta.delete(path);
		updatedCurrentIdentity.addresses.delete(
			getAddressKeyByPath(path, pathMeta)
		);
		_updateCurrentIdentity(updatedCurrentIdentity);
	}

	async function deleteCurrentIdentity(): Promise<void> {
		const newIdentities = deepCopyIdentities(state.identities);
		const identityIndex = newIdentities.findIndex(
			(identity: Identity) =>
				identity.encryptedSeed === state.currentIdentity!.encryptedSeed
		);
		newIdentities.splice(identityIndex, 1);
		setState({
			currentIdentity: newIdentities.length >= 1 ? newIdentities[0] : null,
			identities: newIdentities
		});
		await saveIdentities(newIdentities);
	}

	return {
		clearIdentity,
		deleteCurrentIdentity,
		deletePath,
		deriveEthereumAccount,
		deriveNewPath,
		getAccountByAddress,
		getById,
		getIdentityByAccountId,
		resetCurrentIdentity,
		saveNewIdentity,
		selectIdentity,
		state,
		updateIdentityName,
		updateNewIdentity,
		updatePathName,
		updateSelectedAccount
	};
}

export const AccountsContext = React.createContext({} as AccountsContextState);
