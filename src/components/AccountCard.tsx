import React, { ReactElement, useMemo } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import AccountIcon from './AccountIcon';
import Address from './Address';
import TouchableItem from './TouchableItem';
import AccountPrefixedTitle from './AccountPrefixedTitle';

import { SERVICES_LIST, UNKNOWN_SERVICE_KEY } from 'constants/servicesSpecs';
import Separator from 'components/Separator';
import { NETWORK_LIST, NetworkProtocols } from 'constants/networkSpecs';
import fontStyles from 'styles/fontStyles';
import colors from 'styles/colors';
import { NetworkParams } from 'types/networkSpecsTypes';
import { ButtonListener } from 'types/props';

const CardSeparator = (): ReactElement => (
	<Separator
		shadow={true}
		style={{
			backgroundColor: 'transparent',
			height: 0,
			marginVertical: 0
		}}
	/>
);

const NetworkFooter = ({
	networkColor,
	network
}: {
	networkColor: string;
	network: NetworkParams;
}): React.ReactElement => (
	<View
		style={[
			styles.footer,
			{
				backgroundColor: networkColor || network.color
			}
		]}
	/>
);

export function NetworkCard({
	isAdd,
	networkColor,
	networkKey,
	onPress,
	testID,
	title
}: {
	isAdd?: boolean;
	networkColor?: string;
	networkKey?: string;
	onPress: ButtonListener;
	testID?: string;
	title: string;
}): ReactElement {
	const network = useMemo(() => {
		if (networkKey === undefined || !SERVICES_LIST.hasOwnProperty(networkKey))
			return SERVICES_LIST[UNKNOWN_SERVICE_KEY];
		return SERVICES_LIST[networkKey];
	}, [networkKey]);

	return (
		<TouchableItem testID={testID} disabled={false} onPress={onPress}>
			<CardSeparator />
			<View style={styles.content}>
				{isAdd ? (
					<View
						style={{
							alignItems: 'center',
							height: 40,
							justifyContent: 'center',
							width: 40
						}}
					>
						<Icon name="add" color={colors.text.main} size={30} />
					</View>
				) : (
					<AccountIcon address={''} network={network} style={styles.icon} />
				)}
				<View style={styles.desc}>
					<AccountPrefixedTitle title={title} />
				</View>
				<NetworkFooter
					network={network}
					networkColor={networkColor ?? network.color}
				/>
			</View>
		</TouchableItem>
	);
}

type AccountCardProps = {
	address: string;
	networkKey?: string;
	onPress?: ButtonListener;
	seedType?: string;
	style?: ViewStyle;
	testID?: string;
	title: string;
	titlePrefix?: string;
};

export default function AccountCard({
	address,
	networkKey,
	onPress,
	seedType,
	style,
	testID,
	title,
	titlePrefix
}: AccountCardProps): ReactElement {
	const defaultTitle = 'No name';
	const displayTitle = title.length > 0 ? title : defaultTitle;
	const seedTypeDisplay = seedType || '';
	const network =
		networkKey !== undefined
			? NETWORK_LIST[networkKey]
			: NETWORK_LIST[NetworkProtocols.UNKNOWN];

	return (
		<TouchableItem
			accessibilityComponentType="button"
			testID={testID}
			disabled={false}
			onPress={onPress}
		>
			<CardSeparator />
			<View style={[styles.content, style]}>
				<AccountIcon address={address} network={network} style={styles.icon} />
				<View style={styles.desc}>
					<View>
						<Text style={[fontStyles.t_regular, { color: colors.text.faded }]}>
							{`${network.title}${seedTypeDisplay} `}
						</Text>
					</View>
					<AccountPrefixedTitle
						title={displayTitle}
						titlePrefix={titlePrefix}
					/>
					{address !== '' && (
						<Address address={address} protocol={network.protocol} />
					)}
				</View>
				<NetworkFooter network={network} networkColor={network.color} />
			</View>
		</TouchableItem>
	);
}

const styles = StyleSheet.create({
	content: {
		alignItems: 'center',
		flexDirection: 'row',
		paddingLeft: 16
	},
	desc: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-between',
		paddingLeft: 16
	},
	footer: {
		alignSelf: 'stretch',
		height: 80,
		marginLeft: 8,
		width: 4
	},
	icon: {
		height: 40,
		width: 40
	}
});
