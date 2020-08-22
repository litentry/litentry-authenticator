import {
	SUBSTRATE_NETWORK_LIST,
	SubstrateNetworkKeys
} from 'constants/networkSpecs';

export type ServicesSpecs = {
	order: number;
	color: string;
	pathId: string;
	title: string;
	logo?: number;
};

export type KnownServicesSpecs = {
	order: number;
	color: string;
	pathId: string;
	title: string;
	logo: number;
};

export const UNKNOWN_SERVICE_KEY = 'unknown';
export const UNKNOWN_SERVICE_SPECS: ServicesSpecs = {
	color: '#000000',
	order: 100,
	pathId: UNKNOWN_SERVICE_KEY,
	title: 'Unknown Networks'
};

export const SERVICES_KEYS: Record<string, string> = {
	GOOGLE: 'google',
	APPLE: 'apple',
	WECHAT: 'wechat',
	LITENTRY_PLAYGROUND: 'litentry',
	AMAZON: 'amazon',
	POLKADOT: 'polkadot'
};

export const KNOWN_SERVICES_LIST: Record<string, KnownServicesSpecs> = {
	[SERVICES_KEYS.GOOGLE]: {
		color: '#FCC367',
		logo: require('res/img/logos/Centrifuge.png'),
		order: 6,
		pathId: SERVICES_KEYS.GOOGLE,
		title: 'Google'
	},
	[SERVICES_KEYS.APPLE]: {
		color: '#7C6136',
		logo: require('res/img/logos/Centrifuge.png'),
		order: 7,
		pathId: SERVICES_KEYS.APPLE,
		title: 'Apple'
	},
	[SERVICES_KEYS.WECHAT]: {
		color: '#18FFB2',
		logo: require('res/img/litentry.png'),
		order: 4,
		pathId: SERVICES_KEYS.WECHAT,
		title: 'Wechat'
	},
	[SERVICES_KEYS.LITENTRY_PLAYGROUND]: {
		color: '#E6027A',
		logo: require('res/img/litentry.png'),
		order: 5,
		pathId: SERVICES_KEYS.LITENTRY_PLAYGROUND,
		title: 'Litentry Playground'
	},
	[SERVICES_KEYS.POLKADOT]: {
		color: '#2602FA',
		logo: require('res/img/logos/Polkadot.png'),
		order: 2,
		pathId: SERVICES_KEYS.AMAZON,
		title: 'Amazon'
	}
};

export const SERVICES_LIST: Record<string, ServicesSpecs> = {
	...KNOWN_SERVICES_LIST,
	[UNKNOWN_SERVICE_KEY]: UNKNOWN_SERVICE_SPECS
};

export const defaultServiceKey = SERVICES_KEYS.LITENTRY_PLAYGROUND;
export const defaultNetworkPrefix =
	SUBSTRATE_NETWORK_LIST[SubstrateNetworkKeys.LITENTRY].prefix;
