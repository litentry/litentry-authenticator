import React, { useState, useEffect, useRef } from 'react';
import { FlatList, Text, View, SafeAreaView } from 'react-native';

import TokenCard from '../components/TokenCard';
import { useTokens } from '../hooks';
import QrView from '../../../components/QrView';

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
	console.log('tokens are', tokens);
	return (
		<SafeAreaViewContainer style={styles.container}>
			<QrView data={'address:' + identityHash.toString()} />
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
