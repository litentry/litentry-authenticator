import { Identity } from 'types/identityTypes';

export type RootStackParamList = {
	About: undefined;
	AccountDetails: undefined;
	AccountEdit: undefined;
	AccountPin: { isNew: boolean } | undefined;
	AccountNew: undefined;
	Main: { isNew: boolean } | undefined;
	AccountUnlockAndSign: { next: string };
	AccountUnlock: { next: string; onDelete: () => any };
	IdentityBackup: { isNew: true } | { isNew: false; seedPhrase: string };
	IdentityManagement: undefined;
	IdentityNew: { isRecover: boolean } | undefined;
	MessageDetails: undefined;
	Empty: undefined;
	LegacyAccountBackup:
		| {
				isNew: boolean;
		  }
		| undefined;
	LegacyAccountList: undefined;
	LegacyNetworkChooser: undefined;
	PathDerivation: { parentPath: string };
	PathDetails: { path: string };
	PathManagement: { path: string };
	PathSecret: { path: string; password?: string };
	PathsList: { networkKey: string };
	PinNew: { resolve: (pin: string) => void };
	PinUnlock:
		| {
				identity?: Identity;
				resolve: (seedPhrase: string) => void;
				shouldReturnSeed: true;
		  }
		| {
				identity?: Identity;
				resolve: () => void;
				shouldReturnSeed: false;
		  };
	PinUnlockWithPassword: {
		identity?: Identity;
		isSeedRefValid: boolean;
		resolve: (password: string) => void;
	};
	PrivacyPolicy: undefined;
	QrScanner: undefined;
	Security: undefined;
	SignedMessage: undefined;
	SignedTx: undefined;
	TermsAndConditions: undefined;
	TxDetails: undefined;
};
