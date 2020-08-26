import { AccountsContextState } from 'stores/AccountsContext';

export type UnlockedAccount = {
	address: string;
	createdAt: number;
	derivationPassword: string;
	derivationPath: string; // doesn't contain the ///password
	encryptedSeed: string;
	isLegacy?: boolean;
	name: string;
	networkKey: string;
	recovered?: boolean;
	seed: string; //this is the SURI (seedPhrase + /soft//hard///password derivation)
	seedPhrase: string; //contains only the BIP39 words, no derivation path
	updatedAt: number;
	validBip39Seed: boolean;
};

export type LockedAccount = Omit<
	UnlockedAccount,
	'seedPhrase' | 'seed' | 'derivationPassword' | 'derivationPath'
>;

export type Account = UnlockedAccount | LockedAccount;

export function isUnlockedAccount(
	account: UnlockedAccount | LockedAccount
): account is UnlockedAccount {
	return 'seed' in account || 'seedPhrase' in account;
}

export type AccountMeta = {
	address: string;
	createdAt: number;
	hasPassword?: boolean;
	name: string;
	updatedAt: number;
	networkPathId?: string;
	dataManifest: string;
};

export const dumbMeta = {
	address: '',
	createdAt: 0,
	hasPassword: false,
	name: '',
	updatedAt: 0,
	dataManifest: ''
};

export interface FoundIdentityAccount extends AccountMeta {
	accountId: string;
	encryptedSeed: string;
	hasPassword: boolean;
	validBip39Seed: true;
	isLegacy: false;
	networkKey: string;
	path: string;
}

export interface FoundLegacyAccount {
	address: string;
	accountId: string;
	createdAt: number;
	name: string;
	updatedAt: number;
	encryptedSeed: string;
	validBip39Seed: boolean;
	isLegacy: true;
	networkKey: string;
	path?: string;
}

export type FoundAccount = FoundIdentityAccount | FoundLegacyAccount;

export type Identity = {
	// encrypted seed include seedPhrase and password
	encryptedSeed: string;
	derivationPassword: string;
	meta: Map<string, AccountMeta>;
	addresses: Map<string, string>;
	name: string;
	names: Map<string, string>;
};

export type SerializedIdentity = {
	encryptedSeed: string;
	derivationPassword: string;
	meta: Array<[string, AccountMeta]>;
	addresses: Array<[string, string]>;
	name: string;
};

export type AccountsStoreState = {
	identities: Identity[];
	accounts: Map<string, Account>;
	currentIdentity: Identity | null;
	loaded: boolean;
	newAccount: UnlockedAccount;
	newIdentity: Identity;
	selectedKey: string;
};

type LensSet<T, R> = Omit<T, keyof R> & R;
export type AccountsStoreStateWithIdentity = LensSet<
	AccountsContextState,
	{ state: LensSet<AccountsStoreState, { currentIdentity: Identity }> }
>;

export type PathGroup = {
	paths: string[];
	title: string;
};
