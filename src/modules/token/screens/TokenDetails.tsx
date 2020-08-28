import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { hexStripPrefix, isU8a, u8aToHex } from '@polkadot/util';

import QrView from '../../../components/QrView';
import Button from '../../../components/Button';
import { mock } from '../config';
import { getTokenIdentity } from '../hooks';

import { i_arrowOptions } from 'modules/token/styles';
import LabelTextCard from 'modules/token/components/LabelTextCard';
import PopupModal from 'modules/token/components/PopupModal';
import ScreenHeading from 'components/ScreenHeading';
import ButtonIcon from 'components/ButtonIcon';
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
	const [modalVisible, setModalVisible] = useState(false);

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
			<ScreenHeading title="Token Details" />
			{token && (
				<>
					<ButtonIcon
						title="Show Identity Authentication Code"
						onPress={(): void => {
							setModalVisible(true);
							generateSignedDetails();
						}}
						{...i_arrowOptions}
					/>
					<LabelTextCard text={token} label="Token Hash" />
					<LabelTextCard text={identity ?? ''} label="Belongs to Identity" />
				</>
			)}
			<PopupModal
				title="Signed Token QR"
				visible={modalVisible}
				setVisible={setModalVisible}
				innerComponent={<QrView data={qrData} />}
			/>
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
