import React, { useState } from 'react';
import { FlatList, View } from 'react-native';

import TokenCard from '../components/TokenCard';
import { useTokens } from '../hooks';
import QrView from '../../../components/QrView';

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
	const ipfsAddress = currentIdentity.ipfs.get(identityHash)?.address ?? '';
	const tokens = useTokens(identityHash);
	const [modalVisible, setModalVisible] = useState<boolean>(false);
	const [qrTitle, setQrTitle] = useState<string>('');
	const [qrData, setQrData] = useState<string>('');
	console.log('tokens are', tokens);
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
					<TokenCard
						title="token"
						identity={token}
						index={index}
						onPress={() => navigation.navigate('TokenDetails', { token })}
						style={{ paddingBottom: 10 }}
					/>
				)}
			/>
		</SafeAreaViewContainer>
	);
}

export default withCurrentIdentity(TokenList);

const styles = {
	container: {
		padding: 20
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
