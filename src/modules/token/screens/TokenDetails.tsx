import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { hexStripPrefix, isU8a, u8aToHex } from '@polkadot/util';

import QrView from '../../../components/QrView';
import Button from '../../../components/Button';
import { mock } from '../config';
import { getTokenIdentity } from '../hooks';

import colors from 'styles/colors';
import { NavigationProps } from 'types/props';
import { asciiToHex } from 'utils/decoders';
import { substrateSign } from 'utils/native';
import { isAscii } from 'utils/strings';
import {
	SafeAreaScrollViewContainer,
	SafeAreaViewContainer
} from 'components/SafeAreaContainer';

export default function TokenDetails({
	route
}: NavigationProps<'TokenDetails'>): React.ReactElement {
	const token = route.params.token;

	const [qrData, setQrData] = useState('');
	const [identity, setIdentity] = useState('');

	useEffect(() => {
		const getIdentity = async () => {
			const identity = await getTokenIdentity(token);
			setIdentity(identity.toString());
		};
		getIdentity();
	}, [identity]);

	const generateSignedDetails = async () => {
		let signable = '';
		const dataToSign = `${mock.mockAccount}:${token}:${Date.now()}`;
		if (isU8a(dataToSign)) {
			signable = hexStripPrefix(u8aToHex(dataToSign));
		} else if (isAscii(dataToSign)) {
			signable = hexStripPrefix(asciiToHex(dataToSign));
		}
		const signedData = await substrateSign(mock.mockWrongSeed, signable);
		setQrData(`${dataToSign}:${signedData}`);
	};

	const generateMockSigning = () => {
		setQrData(token);
	};

	const showIdentityQR = () => {
		setQrData(identity);
	};

	return (
		<SafeAreaViewContainer>
			{token ? (
				<SafeAreaScrollViewContainer>
					<Text style={styles.text}>Token QR Code</Text>
					<Text style={styles.text}>{`Token Hash: ${token}`}</Text>
					{identity !== '' && (
						<Text
							style={styles.text}
						>{`Token Belongs to Identity: ${identity}`}</Text>
					)}
					{qrData !== '' && (
						<View style={styles.qr}>
							<QrView data={qrData} />
						</View>
					)}
					<Button
						title="Generate Signed Token"
						style={styles.qrButton}
						onPress={generateMockSigning}
					/>
					<Button
						title="Show Identity QR"
						style={styles.qrButton}
						onPress={showIdentityQR}
					/>
				</SafeAreaScrollViewContainer>
			) : (
				<SafeAreaViewContainer>
					<Text> No hash specified</Text>
				</SafeAreaViewContainer>
			)}
		</SafeAreaViewContainer>
	);
}

const styles = {
	qr: {
		marginTop: 20,
		backgroundColor: colors.background.app
	},
	text: {
		color: colors.text.main
	},
	qrButton: {
		marginTop: 5
	}
};
