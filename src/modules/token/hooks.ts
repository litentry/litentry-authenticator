import { ApiPromise, WsProvider } from '@polkadot/api';
import { SubmittableExtrinsicFunction } from '@polkadot/api/types';
import U64 from '@polkadot/types/primitive/U64';
import { useEffect, useState } from 'react';
import { u64 } from '@polkadot/types';
import { cryptoWaitReady } from '@polkadot/util-crypto';
// Construct
const wsProvider = new WsProvider('wss://ws.litentry.com/');
const alice = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
const testIdentity =
	'0x53838f9049cd2baa7f81f18962330586ba13d61feb08735f75df4d2bb8518264';
const token =
	'0xff1238cdb0e9afdac233cc182faafc1349d4b2c142af161993d6a179fc0cc961';
let api: ApiPromise;
const isApiReady = false;

export function useApi(): boolean {
	const [isApiReady, setApiReady] = useState(false);
	useEffect(() => {
		async function init() {
			try {
				console.log('start connection');
				// const socket = new WebSocket('ws://localhost:9944/');
				// socket.onopen = ev => {
				// 	console.log('socket is opened !');
				// 	socket.send('hahahaha');
				// };
				// socket.onclose = ev => {
				// 	console.log('socket is closed !', ev);
				// };
				// socket.onmessage = ({ data }) => console.log(data);
				api = await ApiPromise.create({
					provider: wsProvider,
					types: {
						Address: 'AccountId',
						LookupSource: 'AccountId',
						IdentityOf: {
							id: 'Hash'
						},
						AuthorizedTokenOf: {
							id: 'Hash',
							cost: 'Balance',
							data: 'u64',
							datatype: 'u64',
							expired: 'u64'
						}
					}
				});
				await cryptoWaitReady();
				setApiReady(true);
				console.log('rpc endpoints are', api.tx.litentry);
				console.log('api genesisHash', api.genesisHash.toHex());
			} catch (error) {
				console.log('ws connect error: ', error);
			}
		}
		init();
	}, []);
	return isApiReady;
}

export async function getLastIdentity(account: string): Promise<string | void> {
	if (account === null || account === '') return;
	const totalNumbersRaw: u64 = await api.query.litentry.ownedIdentitiesCount<
		u64
	>(account);
	const totalNumbers = totalNumbersRaw.toNumber();
	const lastIdentityRaw = await api.query.litentry.ownedIdentitiesArray([
		account,
		totalNumbers - 1
	]);
	return lastIdentityRaw.toString();
}

export function useIdentities(account: string, updateIndex: number): string[] {
	const [identities, setIdentities] = useState<string[]>([]);
	useEffect(() => {
		async function queryTokenIdentity() {
			if (account === null || account === '') return;
			const totalNumbersRaw: u64 = await api.query.litentry.ownedIdentitiesCount<
				u64
			>(account);
			const totalNumbers = totalNumbersRaw.toNumber();
			const a = new Array(totalNumbers).fill(null);
			const promises = a.map((_, i) => {
				return api.query.litentry.ownedIdentitiesArray([account, i]);
			});
			console.log('promises are', promises);
			const results = await Promise.all(promises);
			const unwrappedResult: string[] = results.map(wrappedItem =>
				wrappedItem.toString()
			);
			setIdentities(unwrappedResult);
		}
		console.log('start fetch identities');
		queryTokenIdentity();
	}, [account, updateIndex]);
	return identities;
}

export function useReceivedTokens(account: string): string[] {
	const [tokens, setTokens] = useState<string[]>([]);
	useEffect(() => {
		async function fetchTokens() {
			if (account === null || account === '') return;
			const totalNumbersRaw = await api.query.litentry.ownedAuthorizedTokensCount<
				u64
			>(account);
			const totalNumbers = totalNumbersRaw.toNumber();
			const a = new Array(totalNumbers).fill(null);
			const promises = a.map((_, i) => {
				return api.query.litentry.ownedAuthorizedTokensArray([account, i]);
			});
			console.log('promises are', promises);
			const results = await Promise.all(promises);
			const unwrappedResult = results.map(wrappedItem =>
				wrappedItem.toString()
			);
			setTokens(unwrappedResult);
		}
		fetchTokens();
	}, [account]);
	return tokens;
}

export function useTokens(identityId: string): string[] {
	const [tokens, setTokens] = useState<string[]>([]);
	useEffect(() => {
		async function fetchTokens() {
			if (identityId === null || identityId === '') return;
			const totalNumbersRaw = await api.query.litentry.ownedAuthorizedTokensCount<
				u64
			>(identityId);
			const totalNumbers = totalNumbersRaw.toNumber();
			const a = new Array(totalNumbers).fill(null);
			const promises = a.map((_, i) => {
				return api.query.litentry.ownedAuthorizedTokensArray([identityId, i]);
			});
			console.log('promises are', promises);
			const results = await Promise.all(promises);
			const unwrappedResult = results.map(wrappedItem =>
				wrappedItem.toString()
			);
			setTokens(unwrappedResult);
		}
		fetchTokens();
	}, [identityId]);
	return tokens;
}

export function useTokenOwner(tokenId: string): string {
	const [owner, setOwner] = useState('');
	useEffect(() => {
		async function queryTokenIdentity(token) {
			const result = await api.query.litentry.authorizedTokenIdentity(token);
			console.log('get result', result);
			if (result.toString() !== '') {
				setOwner(result.toString());
			}
		}
		queryTokenIdentity(tokenId);
	}, [tokenId]);
	return owner;
}

export async function getTokenIdentity(token) {
	return await api.query.litentry.authorizedTokenIdentity(token);
}

type LitentryExtrinsics = {
	registerIdentity: SubmittableExtrinsicFunction<'promise'>;
};

export function useExtrinsics(): LitentryExtrinsics {
	return {
		registerIdentity: api.tx.litentry.registerIdentity
	};
}
