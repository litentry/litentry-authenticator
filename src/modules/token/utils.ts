import {
	defaultNetworkKey,
	SUBSTRATE_NETWORK_LIST
} from 'constants/networkSpecs';
import { graphqlServer } from 'constants/servers';
import { Identity } from 'types/identityTypes';

export function parseBalance(rawBalance: string): string {
	const networkDecimals = SUBSTRATE_NETWORK_LIST[defaultNetworkKey].decimals;
	const integer = rawBalance.slice(0, -networkDecimals);
	const decimal = rawBalance.slice(-networkDecimals, rawBalance.length);
	return `${integer}.${decimal}`;
}

function constructQuery(methodName: string, identity: string): string {
	return `http://${graphqlServer}:4000/graphql?query={${methodName}(identityId:"${identity}")}`;
}

export function getIpfsIdentityName(
	identity: string,
	currentIdentity: Identity
): string {
	debugger;
	if (currentIdentity.ipfs.has(identity)) {
		const ipfsIdentityMeta = currentIdentity.ipfs.get(identity)!;
		return ipfsIdentityMeta.name;
	}
	return '';
}

export async function getIpfsAddress(identity: string): Promise<string | null> {
	const maximalQuery = 5;
	let query = 0;
	let result = null;
	const queryUrl = constructQuery('determineAddress', identity);
	while (query < maximalQuery) {
		try {
			const response = await fetch(queryUrl);
			const json = await response.json();
			const fetchedData = json.data.determineAddress;
			if (fetchedData.indexOf('/orbitdb') !== -1) {
				result = fetchedData;
				break;
			} else {
				query++;
			}
		} catch (error) {
			console.error(error);
		}
	}
	return result;
}

export function openIpfsIdentityDb(identity: string): void {
	setTimeout((): void => {
		const queryUrl = constructQuery('registerIdentity', identity);
		fetch(queryUrl);
	}, 500);
}
