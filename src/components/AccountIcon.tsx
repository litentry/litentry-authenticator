import Identicon from '@polkadot/reactnative-identicon';
import React, { ReactElement, useEffect } from 'react';
import { Image, ImageStyle, StyleSheet, View, ViewStyle } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { ServicesSpecs } from 'constants/servicesSpecs';
import colors from 'styles/colors';
import { SubstrateNetworkParams } from 'types/networkSpecsTypes';

export default function AccountIcon(props: {
	address: string;
	network: ServicesSpecs;
	style?: ViewStyle | ImageStyle;
}): ReactElement {
	const { address, style, network } = props;

	useEffect((): (() => void) => {
		let promiseDisabled = false;
		return (): void => {
			promiseDisabled = true;
		};
	}, [address]);

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
	let iconSize;
	if (typeof style?.width === 'string') {
		const parseIconSize = parseInt(style.width, 10);
		iconSize = isNaN(parseIconSize) ? undefined : parseIconSize;
	} else {
		iconSize = style?.width;
	}
	return <Identicon value={address} size={iconSize || 40} />;
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
