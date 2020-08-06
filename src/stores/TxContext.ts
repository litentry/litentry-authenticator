import React, { useState } from 'react';

import { deepCopyMap } from 'stores/utils';
import { loadAccountTxs, saveTx as saveTxDB } from 'utils/db';
import { TxParticipant } from 'types/tx';

type TxContextState = {
	saveTx: (tx: any) => Promise<void>;
	getTxList: ({ address }: { address: string }) => string[];
	loadTxsForAccount: (account: TxParticipant) => Promise<void>;
	signedTxs: Map<string, Record<string, any>>;
};

export function useTxStore(): TxContextState {
	const [signedTxs, setSignedTxs] = useState(new Map());

	async function saveTx(tx: any): Promise<void> {
		await saveTxDB(tx);
		const newSignedTxs = deepCopyMap(signedTxs);
		signedTxs.set(tx.hash, tx);
		setSignedTxs(newSignedTxs);
	}

	async function loadTxsForAccount(account: TxParticipant): Promise<void> {
		const txs = await loadAccountTxs(account);
		const newSignedTxs = new Map([...signedTxs, ...txs]);
		setSignedTxs(newSignedTxs);
	}

	function getTxList({ address }: { address: string }): string[] {
		return Array.from(signedTxs.values()).filter(
			tx => tx.sender === address || tx.recipient === address
		);
	}

	return {
		getTxList,
		loadTxsForAccount,
		saveTx,
		signedTxs
	};
}

export const TxContext = React.createContext({} as TxContextState);
