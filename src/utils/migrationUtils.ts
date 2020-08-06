import { AccountMeta, Identity, LockedAccount } from 'types/identityTypes';
import { loadIdentities, saveIdentities } from 'utils/db';
import {
	extractAddressFromAccountId,
	isEthereumAccountId
} from 'utils/identitiesUtils';

interface LegacyMeta extends AccountMeta {
	accountId: string;
}

interface LegacyIdentity extends Identity {
	meta: Map<string, LegacyMeta>;
	accountIds: Map<string, string>;
}

interface LegacyAccount extends LockedAccount {
	chainId: string;
	networkType: string;
}

export const migrateIdentity = async (): Promise<void> => {
	const identities = await loadIdentities(4);

	const migrationIdentityFunction = (identity: LegacyIdentity): Identity => {
		const getAddressKey = (accountId: string): string =>
			isEthereumAccountId(accountId)
				? accountId
				: extractAddressFromAccountId(accountId);

		if (identity.hasOwnProperty('addresses')) {
			return identity;
		}
		const addressMap = new Map();
		identity.accountIds.forEach((path: string, accountId: string): void => {
			addressMap.set(getAddressKey(accountId), path);
		});
		identity.addresses = addressMap;
		delete identity.accountIds;

		const metaMap = new Map();
		identity.meta.forEach((metaData: LegacyMeta, path: string): void => {
			if (metaData.hasOwnProperty('accountId')) {
				const { accountId } = metaData;
				metaData.address = extractAddressFromAccountId(accountId);
				delete metaData.accountId;
				metaMap.set(path, metaData);
			} else {
				metaMap.set(path, metaData);
			}
		});
		identity.meta = metaMap;

		return identity;
	};
	saveIdentities(
		(identities as LegacyIdentity[]).map(migrationIdentityFunction)
	);
};
