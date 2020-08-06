import Identicon from '@polkadot/reactnative-identicon';
import React, { ReactElement, useEffect, useState } from 'react';
import { Image, ImageStyle, StyleSheet, View, ViewStyle } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import colors from 'styles/colors';
import { NetworkProtocols } from 'constants/networkSpecs';
import { blockiesIcon } from 'utils/native';
import { NetworkParams, SubstrateNetworkParams } from 'types/networkSpecsTypes';

export default function AccountIcon(props: {
	address: string;
	network: NetworkParams;
	style?: ViewStyle | ImageStyle;
}): ReactElement {
	const { address, style, network } = props;
	const [ethereumIconUri, setEthereumIconUri] = useState('');
	const protocol = network.protocol;

	useEffect((): (() => void) => {
		let promiseDisabled = false;

		if (protocol === NetworkProtocols.ETHEREUM && address !== '') {
			const setEthereumIcon = async (): Promise<void> => {
				const generatedIconUri = await blockiesIcon('0x' + address);
				if (promiseDisabled) return;
				setEthereumIconUri(generatedIconUri);
			};
			setEthereumIcon();
		}
		return (): void => {
			promiseDisabled = true;
		};
	}, [address, protocol]);

	if (address === '') {
		return (
			<View style={style as ViewStyle}>
				{(network as SubstrateNetworkParams).logo ? (
					<Image
						source={(network as SubstrateNetworkParams).logo}
						style={styles.logo}
					/>
				) : (
					<View style={styles.logo}>
						<FontAwesome name="question" color={colors.text.main} size={28} />
					</View>
				)}
			</View>
		);
	}
	if (protocol === NetworkProtocols.SUBSTRATE) {
		let iconSize;
		if (typeof style?.width === 'string') {
			const parseIconSize = parseInt(style.width, 10);
			iconSize = isNaN(parseIconSize) ? undefined : parseIconSize;
		} else {
			iconSize = style?.width;
		}
		return <Identicon value={address} size={iconSize || 40} />;
	} else if (protocol === NetworkProtocols.ETHEREUM && ethereumIconUri) {
		return (
			<Image source={{ uri: ethereumIconUri }} style={style as ImageStyle} />
		);
	} else {
		// if there's no protocol or it's unknown we return a warning
		return (
			<MaterialIcon color={colors.signal.error} name={'error'} size={44} />
		);
	}
}

const styles = StyleSheet.create({
	logo: {
		alignItems: 'center',
		height: 36,
		justifyContent: 'center',
		marginHorizontal: 2,
		opacity: 0.7,
		width: 36
	}
});
