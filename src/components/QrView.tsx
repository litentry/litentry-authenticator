import { isHex } from '@polkadot/util';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, View, ViewStyle } from 'react-native';

import { qrCode, qrCodeHex } from 'utils/native';

interface Props {
	data: string;
	size?: number;
	height?: number;
	style?: ViewStyle;
	testID?: string;
}

export default function QrView(props: Props): React.ReactElement {
	const [qr, setQr] = useState('');

	useEffect((): (() => void) => {
		let promiseDisabled = false;
		async function displayQrCode(data: string): Promise<void> {
			try {
				const generatedQr = isHex(data)
					? await qrCodeHex(data)
					: await qrCode(data);
				if (promiseDisabled) return;
				setQr(generatedQr);
			} catch (e) {
				console.error(e);
			}
		}

		displayQrCode(props.data);
		return (): void => {
			promiseDisabled = true;
		};
	}, [props.data]);

	const { width: deviceWidth } = Dimensions.get('window');
	const size = props.size || deviceWidth - 64;
	const flexBasis = props.height || deviceWidth - 32;

	return (
		<View
			style={[
				{
					alignItems: 'center',
					backgroundColor: 'white',
					flexBasis,
					height: flexBasis,
					justifyContent: 'center',
					marginHorizontal: 16,
					marginVertical: 24,
					width: deviceWidth - 32
				},
				props.style
			]}
			testID={props.testID}
		>
			{qr !== '' && (
				<Image source={{ uri: qr }} style={{ height: size, width: size }} />
			)}
		</View>
	);
}
