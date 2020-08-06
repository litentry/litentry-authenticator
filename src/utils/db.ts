import AsyncStorage from '@react-native-community/async-storage';
import SecureStorage from 'react-native-secure-storage';

import { generateAccountId } from './account';
import { deserializeIdentities, serializeIdentities } from './identitiesUtils';

import { Identity } from 'types/identityTypes';
import { Tx, TxParticipant } from 'types/tx';

const identitiesStore = {
	keychainService: 'litentry_authenticator_identities',
	sharedPreferencesName: 'litentry_authenticator_identities'
};
const currentIdentityStorageLabel = 'identities_v4';

export async function loadIdentities(version = 4): Promise<Identity[]> {
	function handleError(e: Error): Identity[] {
		console.warn('loading identities error', e);
		return [];
	}

	const identityStorageLabel = `identities_v${version}`;
	try {
		const identities = await SecureStorage.getItem(
			identityStorageLabel,
			identitiesStore
		);
		if (!identities) return [];
		return deserializeIdentities(identities);
	} catch (e) {
		return handleError(e);
	}
}

export const saveIdentities = (identities: Identity[]): void => {
	SecureStorage.setItem(
		currentIdentityStorageLabel,
		serializeIdentities(identities),
		identitiesStore
	);
};

function accountTxsKey({
	address,
	networkKey
}: {
	address: string;
	networkKey: string;
}): string {
	return 'account_txs_' + generateAccountId({ address, networkKey });
}

function txKey(hash: string): string {
	return 'tx_' + hash;
}

async function storagePushValue(key: string, value: string): Promise<void> {
	let currentVal = await AsyncStorage.getItem(key);

	if (currentVal === null) {
		return AsyncStorage.setItem(key, JSON.stringify([value]));
	} else {
		currentVal = JSON.parse(currentVal);
		const newVal = new Set([...(currentVal as NonNullable<any>), value]);
		return AsyncStorage.setItem(key, JSON.stringify(Array.from(newVal)));
	}
}

export async function saveTx(tx: Tx): Promise<void> {
	if (!tx.sender) {
		throw new Error('Tx should contain sender to save');
	}

	if (!tx.recipient) {
		throw new Error('Tx should contain recipient to save');
	}

	await Promise.all([
		storagePushValue(accountTxsKey(tx.sender), tx.hash),
		storagePushValue(accountTxsKey(tx.recipient), tx.hash),
		AsyncStorage.setItem(txKey(tx.hash), JSON.stringify(tx))
	]);
}

export async function loadAccountTxHashes(
	account: TxParticipant
): Promise<string[]> {
	const result = await AsyncStorage.getItem(accountTxsKey(account));

	return result ? JSON.parse(result) : [];
}

export async function loadAccountTxs(
	account: TxParticipant
): Promise<Array<[string, Tx]>> {
	const hashes = await loadAccountTxHashes(account);

	return (
		await AsyncStorage.multiGet(hashes.map(txKey))
	).map((v: [string, any]) => [v[0], JSON.parse(v[1])]);
}

export async function loadToCAndPPConfirmation(): Promise<boolean> {
	const result = await AsyncStorage.getItem('ToCAndPPConfirmation_v4');

	return !!result;
}

export async function saveToCAndPPConfirmation(): Promise<void> {
	await AsyncStorage.setItem('ToCAndPPConfirmation_v4', 'yes');
}
