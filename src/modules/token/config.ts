const config = {
	address: 'http://112.125.25.18',
	port: '3000',
	graphQLEndpoint: 'http://112.125.25.18:3000/graphql'
};

export const mock = {
	mockAccount: '5Evyk5JtBixLd4YJVJ1p2bvwHcUiU6sz2obt1AoNHQanSXVW',
	mockIdentity:
		'0xf7b20801ad0e0ff5364d0b1446727c2a893ad43cecb212f8f8c5d6af6cc9089f',
	mockWrongSeed:
		'mistake duty subway wing air raise asthma remain unfold amused cactus stick neck proof night essence relief fox alien kitten powder legend news margin'
};

// some suplementary info on a per-chain basis
const CHAIN_INFO = {
	alexander: {
		chainDisplay: 'Alexander',
		logo: 'alexander',
		type: 'Polkadot Testnet'
	},
	edgeware: {
		chainDisplay: 'Edgeware',
		logo: 'edgeware',
		type: 'Edgeware Mainnet'
	},
	edgewareTest: {
		chainDisplay: 'Edgeware Testnet',
		logo: 'edgeware',
		type: 'Edgeware Testnet'
	},
	flamingFir: {
		chainDisplay: 'Flaming Fir',
		logo: 'substrate',
		type: 'Substrate Testnet'
	},
	kusama: {
		chainDisplay: 'Kusama CC2',
		logo: 'kusama',
		type: 'Polkadot Canary'
	}
};

// the actual providers with all  the nodes they provide
const PROVIDERS = {
	commonwealth: {
		providerDisplay: 'Commonwealth Labs',
		nodes: {
			edgeware: 'wss://mainnet1.edgewa.re',
			edgewareTest: 'wss://testnet2.edgewa.re'
		}
	},
	parity: {
		providerDisplay: 'Parity',
		nodes: {
			alexander: 'wss://poc3-rpc.polkadot.io/',
			flamingFir: 'wss://substrate-rpc.parity.io/',
			kusama: 'wss://kusama-rpc.polkadot.io/'
		}
	},
	unfrastructure: {
		providerDisplay: 'Centrality UNfrastructure',
		nodes: {
			alexander: 'wss://alex.unfrastructure.io/public/ws'
		}
	},
	w3f: {
		providerDisplay: 'Web3 Foundation',
		nodes: {
			kusama: 'wss://serinus-5.kusama.network/'
		}
	}
};
