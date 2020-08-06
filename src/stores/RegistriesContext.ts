import { Metadata, TypeRegistry } from '@polkadot/types';
import { getSpecTypes } from '@polkadot/types-known';
import React, { useState } from 'react';

import { SUBSTRATE_NETWORK_LIST } from 'constants/networkSpecs';
import { deepCopyMap } from 'stores/utils';
import { getMetadata } from 'utils/identitiesUtils';

//Map PathId to Polkadot.js/api spec names and chain names
type NetworkTypes = {
	alias?: string;
	chains: {
		[key: string]: string;
	};
};
type NetworkTypesMap = {
	[key: string]: NetworkTypes;
};
const networkTypesMap: NetworkTypesMap = {
	centrifuge: {
		alias: 'centrifuge-chain',
		chains: {
			centrifuge_amber: 'centrifuge-chain-amber'
		}
	},
	kusama: { chains: {} },
	polkadot: {
		chains: {
			westend: 'Westend'
		}
	}
};

export const getOverrideTypes = (
	registry: TypeRegistry,
	pathId: string
): any => {
	let specName = '',
		chainName = '';
	Object.entries(networkTypesMap).find(
		([networkName, networkTypes]: [string, NetworkTypes]) => {
			if (networkName === pathId) {
				specName = networkTypes.alias ?? networkName;
			} else if (networkTypes.chains.hasOwnProperty(pathId)) {
				const chainAlias = networkTypes.chains[pathId];
				specName = networkTypes.alias ?? networkName;
				chainName = chainAlias ?? pathId;
			} else {
				return false;
			}
			return true;
		}
	);
	return getSpecTypes(registry, chainName, specName, Number.MAX_SAFE_INTEGER);
};

export type RegistriesStoreState = {
	registries: Map<string, TypeRegistry>;
	get: (networkKey: string) => TypeRegistry;
};

export function useRegistriesStore(): RegistriesStoreState {
	const dumbRegistry = new TypeRegistry();
	const [registries, setRegistries] = useState(new Map());

	function get(networkKey: string): TypeRegistry {
		if (!SUBSTRATE_NETWORK_LIST.hasOwnProperty(networkKey)) return dumbRegistry;
		if (registries.has(networkKey)) return registries.get(networkKey)!;

		const networkParams = SUBSTRATE_NETWORK_LIST[networkKey];
		const newRegistry = new TypeRegistry();
		const networkMetadataRaw = getMetadata(networkKey);
		const overrideTypes = getOverrideTypes(newRegistry, networkParams.pathId);
		newRegistry.register(overrideTypes);
		const metadata = new Metadata(newRegistry, networkMetadataRaw);
		newRegistry.setMetadata(metadata);
		const newRegistries = deepCopyMap(registries);
		newRegistries.set(networkKey, newRegistry);
		setRegistries(newRegistries);
		return newRegistry;
	}

	return { get, registries };
}

export const RegistriesContext = React.createContext(
	{} as RegistriesStoreState
);
