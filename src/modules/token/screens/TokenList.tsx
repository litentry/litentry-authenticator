import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';

import TokenCard from '../components/TokenCard';
import { useTokens } from '../hooks';
import QrView from '../../../components/QrView';

import LabelTextCard from 'modules/token/components/LabelTextCard';
import { getIpfsAddress } from 'modules/token/utils';
import { withCurrentIdentity } from 'utils/HOC';
import { i_arrowOptions } from 'modules/token/styles';
import PopupModal from 'modules/token/components/PopupModal';
import ScreenHeading from 'components/ScreenHeading';
import ButtonIcon from 'components/ButtonIcon';
import { NavigationWithCurrentIdentityAndAccountsStoreProps } from 'types/props';
import { SafeAreaViewContainer } from 'components/SafeAreaContainer';
import fonts from 'styles/fonts';
import colors from 'styles/colors';

export function TokenList({
	accountsStore,
	navigation,
	route
}: NavigationWithCurrentIdentityAndAccountsStoreProps<
	'TokenList'
>): React.ReactElement {
	// this is the actual default endpoint
	const { currentIdentity } = accountsStore.state;
	const identityHash = route.params.identity;
	const [ipfsAddress, setIpfsAddress] = useState('');
	const tokens = useTokens(identityHash);
	const [modalVisible, setModalVisible] = useState<boolean>(false);
	const [qrTitle, setQrTitle] = useState<string>('');
	const [qrData, setQrData] = useState<string>('');
	console.log('tokens are', tokens);

	useEffect(() => {
		const checkIpfsAddress = async () => {
			if (!currentIdentity.ipfs?.has(identityHash)) {
				try {
					const fetchedIpfsAddress = await getIpfsAddress(identityHash);
					if (fetchedIpfsAddress !== null) {
						accountsStore.addIpfsIdentity(identityHash, {
							name: '',
							address: fetchedIpfsAddress
						});
						setIpfsAddress(fetchedIpfsAddress);
					}
				} catch (e) {
					console.log('can not fetch ipfs address');
				}
			} else {
				setIpfsAddress(currentIdentity.ipfs.get(identityHash)?.address ?? '');
			}
		};

		checkIpfsAddress();
	}, [currentIdentity, identityHash]);

	return (
		<SafeAreaViewContainer style={styles.container}>
			<ScreenHeading title="Identity Related Tokens" />
			<ButtonIcon
				title="Show Identity Authentication Code"
				onPress={(): void => {
					setQrTitle('Authentication Code');
					setQrData('address:' + identityHash.toString());
					setModalVisible(true);
				}}
				{...i_arrowOptions}
			/>
			<ButtonIcon
				title="Change Identity Name"
				onPress={(): void => {
					setQrTitle('Authentication Code');
					setQrData('address:' + identityHash.toString());
					setModalVisible(true);
				}}
				{...i_arrowOptions}
			/>
			{ipfsAddress !== '' && (
				<ButtonIcon
					title="Show Identity IPFS Address"
					onPress={(): void => {
						setQrTitle('Identity IPFS Address');
						setQrData(ipfsAddress);
						setModalVisible(true);
					}}
					{...i_arrowOptions}
				/>
			)}
			<PopupModal
				title={qrTitle}
				visible={modalVisible}
				setVisible={setModalVisible}
				innerComponent={<QrView data={qrData} />}
			/>
			<FlatList
				style={styles.content}
				data={tokens}
				keyExtractor={i => i}
				ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
				renderItem={({ item: token, index }) => (
					<LabelTextCard
						text={token}
						label={`token_${index}`}
						onPress={() => navigation.navigate('TokenDetails', { token })}
					/>
				)}
			/>
		</SafeAreaViewContainer>
	);
}

export default withCurrentIdentity(TokenList);

const styles = {
	container: {
		padding: 0
	},
	content: {
		flex: 1,
		backgroundColor: colors.background.app
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	loadingText: {
		fontFamily: fonts.bold,
		color: colors.text.main,
		fontSize: 34
	}
};
