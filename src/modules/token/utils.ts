import { graphqlServer } from 'constants/servers';

function constructQuery(methodName: string, identity: string): string {
	return `http://${graphqlServer}:4000/graphql?query={${methodName}(identityId:"${identity}")}`;
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
