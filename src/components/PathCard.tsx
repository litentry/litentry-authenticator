import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';

import AccountIcon from './AccountIcon';
import AccountPrefixedTitle from './AccountPrefixedTitle';
import Address from './Address';
import TouchableItem from './TouchableItem';

import {
	defaultNetworkPrefix,
	defaultServiceKey,
	SERVICES_LIST,
	UNKNOWN_SERVICE_KEY
} from 'constants/servicesSpecs';
import Separator from 'components/Separator';
import colors from 'styles/colors';
import fontStyles from 'styles/fontStyles';
import { Identity } from 'types/identityTypes';
import {
	isSubstrateNetworkParams,
	isUnknownNetworkParams
} from 'types/networkSpecsTypes';
import { ButtonListener } from 'types/props';
import {
	getAddressWithPath,
	getServiceKeyByPath,
	getPathName
} from 'utils/identitiesUtils';
import { useSeedRef } from 'utils/seedRefHooks';

export default function PathCard({
	onPress,
	identity,
	isPathValid = true,
	path,
	name,
	networkKey,
	testID,
	titlePrefix
}: {
	onPress?: ButtonListener;
	identity: Identity;
	isPathValid?: boolean;
	path: string;
	name?: string;
	networkKey?: string;
	testID?: string;
	titlePrefix?: string;
}): React.ReactElement {
	const isNotEmptyName = name && name !== '';
	const pathName = isNotEmptyName ? name : getPathName(path, identity);
	const { isSeedRefValid, substrateAddress } = useSeedRef(
		identity.encryptedSeed
	);
	const [address, setAddress] = useState('');
	const computedNetworkKey =
		networkKey || getServiceKeyByPath(path, identity.meta.get(path)!);
	useEffect(() => {
		const getAddress = async (): Promise<void> => {
			const existedAddress = getAddressWithPath(path, identity);
			if (existedAddress !== '') return setAddress(existedAddress);
			if (isSeedRefValid && isPathValid) {
				const prefix = defaultNetworkPrefix;
				const generatedAddress = await substrateAddress(path, prefix);
				return setAddress(generatedAddress);
			}
			setAddress('');
		};
		getAddress();
	}, [
		path,
		identity,
		isPathValid,
		networkKey,
		computedNetworkKey,
		isSeedRefValid,
		substrateAddress
	]);

	const isUnknownAddress = address === '';
	const hasPassword = identity.meta.get(path)?.hasPassword ?? false;
	const networkParams =
		computedNetworkKey === UNKNOWN_SERVICE_KEY && !isUnknownAddress
			? SERVICES_LIST[defaultServiceKey]
			: SERVICES_LIST[computedNetworkKey];

	const substrateDerivationCard = (
		<TouchableItem
			accessibilityComponentType="button"
			disabled={false}
			onPress={onPress}
			style={styles.body}
		>
			<View style={styles.content} testID={testID}>
				<AccountIcon
					address={address}
					network={networkParams}
					style={styles.identicon}
				/>
				<View style={styles.desc}>
					<View style={styles.row}>
						<AccountPrefixedTitle title={pathName!} titlePrefix={titlePrefix} />
						{hasPassword && <AntIcon name="lock" style={styles.iconLock} />}
					</View>
					<View
						style={{
							alignItems: 'center',
							flexDirection: 'row'
						}}
					>
						<AntIcon
							name="user"
							size={fontStyles.i_small.fontSize}
							color={colors.signal.main}
						/>

						{hasPassword ? (
							<View style={styles.row}>
								<Text
									style={[fontStyles.t_codeS, { color: colors.signal.main }]}
								>
									{path}///
								</Text>

								<AntIcon
									name="lock"
									size={fontStyles.i_small.fontSize}
									color={colors.signal.main}
									style={{ alignSelf: 'center' }}
								/>
							</View>
						) : (
							<Text style={[fontStyles.t_codeS, { color: colors.signal.main }]}>
								{path}
							</Text>
						)}
					</View>
					{address !== '' && (
						<Text
							style={[fontStyles.t_codeS, { color: colors.text.faded }]}
							ellipsizeMode="middle"
							numberOfLines={1}
						>
							{address}
						</Text>
					)}
				</View>
			</View>
		</TouchableItem>
	);

	return substrateDerivationCard;
}

const styles = StyleSheet.create({
	body: {
		borderBottomWidth: 1,
		borderColor: colors.background.app,
		borderTopWidth: 1
	},
	content: {
		alignItems: 'center',
		backgroundColor: colors.background.card,
		flexDirection: 'row',
		paddingLeft: 16,
		paddingVertical: 8
	},
	desc: {
		flex: 1,
		paddingLeft: 16
	},
	footer: {
		height: 80,
		marginLeft: 8,
		width: 4
	},
	iconLock: {
		marginLeft: 4,
		...fontStyles.h2
	},
	identicon: {
		height: 40,
		width: 40
	},
	row: {
		flexDirection: 'row'
	}
});
