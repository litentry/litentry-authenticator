import React, { useState } from 'react';
import { FlatList, View } from 'react-native';

import TokenCard from '../components/TokenCard';
import { useTokens } from '../hooks';
import QrView from '../../../components/QrView';

import { i_arrowOptions } from 'modules/token/styles';
import PopupModal from 'modules/token/components/PopupModal';
import ScreenHeading from 'components/ScreenHeading';
import ButtonIcon from 'components/ButtonIcon';
import { NavigationAccountIdentityProps } from 'types/props';
import { SafeAreaViewContainer } from 'components/SafeAreaContainer';
import fonts from 'styles/fonts';
import colors from 'styles/colors';

export default function TokenList({
	navigation,
	route
}: NavigationAccountIdentityProps<'TokenList'>) {
	// this is the actual default endpoint
	const identityHash = route.params.identity;
	const tokens = useTokens(identityHash);
	const [modalVisible, setModalVisible] = useState<boolean>(false);
	console.log('tokens are', tokens);
	return (
		<SafeAreaViewContainer style={styles.container}>
			<ScreenHeading title="Identity Related Tokens" />
			<ButtonIcon
				title="Show Identity Authentication Code"
				onPress={(): void => setModalVisible(true)}
				{...i_arrowOptions}
			/>
			<PopupModal
				title="Authentication Code"
				visible={modalVisible}
				setVisible={setModalVisible}
				innerComponent={<QrView data={'address:' + identityHash.toString()} />}
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
