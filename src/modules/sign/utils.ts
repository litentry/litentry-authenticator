// Copyright 2015-2020 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// Parity is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Parity is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Parity.  If not, see <http://www.gnu.org/licenses/>.
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useContext } from 'react';

import strings from 'modules/sign/strings';
import { AccountsContext } from 'stores/AccountsContext';
import { ScannerContext } from 'stores/ScannerContext';
import { SeedRefsContext, SeedRefsState } from 'stores/SeedRefStore';
import { FoundIdentityAccount } from 'types/identityTypes';
import { isEthereumNetworkParams } from 'types/networkSpecsTypes';
import { RootStackParamList } from 'types/routes';
import {
	CompletedParsedData,
	isMultiFramesInfo,
	isMultipartData,
	ParsedData,
	QrInfo,
	TxRequestData
} from 'types/scannerTypes';
import {
	constructDataFromBytes,
	isAddressString,
	isJsonString,
	rawDataToU8A
} from 'utils/decoders';
import { getIdentityFromSender, getNetworkParams } from 'utils/identitiesUtils';
import { SeedRefClass } from 'utils/native';
import {
	unlockSeedPhrase,
	unlockSeedPhraseWithPassword
} from 'utils/navigationHelpers';
import { constructSuriSuffix } from 'utils/suri';

function getSeedRef(
	encryptedSeed: string,
	seedRefs: Map<string, SeedRefClass>
): SeedRefClass | undefined {
	if (seedRefs.has(encryptedSeed)) {
		return seedRefs.get(encryptedSeed);
	}
}

export function useProcessBarCode(
	showErrorMessage: (title: string, message: string) => void
): (txRequestData: TxRequestData) => Promise<void> {
	const accountsStore = useContext(AccountsContext);
	const scannerStore = useContext(ScannerContext);
	const [seedRefs] = useContext<SeedRefsState>(SeedRefsContext);
	const navigation: StackNavigationProp<
		RootStackParamList,
		'QrScanner'
	> = useNavigation();

	async function parseQrData(
		txRequestData: TxRequestData
	): Promise<ParsedData> {
		if (isAddressString(txRequestData.data)) {
			throw new Error(strings.ERROR_ADDRESS_MESSAGE);
		} else if (isJsonString(txRequestData.data)) {
			// Ethereum Legacy
			return JSON.parse(txRequestData.data);
		} else if (!scannerStore.state.multipartComplete) {
			const strippedData = rawDataToU8A(txRequestData.rawData);
			if (strippedData === null) throw new Error(strings.ERROR_NO_RAW_DATA);
			const parsedData = await constructDataFromBytes(strippedData, false);
			return parsedData;
		} else {
			throw new Error(strings.ERROR_NO_RAW_DATA);
		}
	}

	async function checkMultiFramesData(
		parsedData: ParsedData
	): Promise<null | CompletedParsedData> {
		if (isMultipartData(parsedData)) {
			const multiFramesResult = await scannerStore.setPartData(
				parsedData.currentFrame,
				parsedData.frameCount,
				parsedData.partData
			);
			if (isMultiFramesInfo(multiFramesResult)) {
				return null;
			}
			//Otherwise all the frames are assembled as completed parsed data
			return multiFramesResult;
		} else {
			return parsedData;
		}
	}

	async function unlockSeedAndSign(
		sender: FoundIdentityAccount,
		qrInfo: QrInfo
	): Promise<void> {
		const senderNetworkParams = getNetworkParams(sender.networkKey);
		const isEthereum = isEthereumNetworkParams(senderNetworkParams);

		// 1. check if sender existed
		const senderIdentity = getIdentityFromSender(
			sender,
			accountsStore.state.identities
		);
		if (!senderIdentity) throw new Error(strings.ERROR_NO_SENDER_IDENTITY);

		let seedRef = getSeedRef(sender.encryptedSeed, seedRefs);
		let password = '';
		// 2. unlock and get Seed reference
		if (seedRef === undefined || !seedRef.isValid()) {
			if (sender.hasPassword) {
				//need unlock with password
				password = await unlockSeedPhraseWithPassword(
					navigation,
					false,
					senderIdentity
				);
			} else {
				await unlockSeedPhrase(navigation, false, senderIdentity);
			}
			seedRef = getSeedRef(sender.encryptedSeed, seedRefs)!;
		} else {
			if (sender.hasPassword) {
				password = await unlockSeedPhraseWithPassword(
					navigation,
					true,
					senderIdentity
				);
			}
		}
		// 3. sign data
		if (isEthereum) {
			await scannerStore.signEthereumData(
				seedRef.tryBrainWalletSign.bind(seedRef),
				qrInfo
			);
		} else {
			const suriSuffix = constructSuriSuffix({
				derivePath: sender.path,
				password
			});
			await scannerStore.signSubstrateData(
				seedRef.trySubstrateSign.bind(seedRef),
				suriSuffix,
				qrInfo
			);
		}
	}

	async function unlockAndNavigationToSignedQR(qrInfo: QrInfo): Promise<void> {
		const { sender, type } = qrInfo;
		if (!sender)
			return showErrorMessage(
				strings.ERROR_TITLE,
				strings.ERROR_NO_SENDER_FOUND
			);

		const seedRef = getSeedRef(sender.encryptedSeed, seedRefs);
		const isSeedRefInvalid = seedRef && seedRef.isValid();
		await unlockSeedAndSign(sender, qrInfo);
		const nextRoute = type === 'transaction' ? 'SignedTx' : 'SignedMessage';

		if (isSeedRefInvalid) {
			navigation.navigate(nextRoute);
		} else {
			navigation.replace(nextRoute);
		}
	}

	async function processBarCode(txRequestData: TxRequestData): Promise<void> {
		try {
			const parsedData = await parseQrData(txRequestData);
			const unsignedData = await checkMultiFramesData(parsedData);
			if (unsignedData === null) return;
			const qrInfo = await scannerStore.setData(accountsStore, unsignedData);
			await unlockAndNavigationToSignedQR(qrInfo);
			scannerStore.clearMultipartProgress();
		} catch (e) {
			return showErrorMessage(strings.ERROR_TITLE, e.message);
		}
	}

	return processBarCode;
}
