import React, { useRef } from 'react';
import { FlatList, SafeAreaView, View } from 'react-native';

import { useReceivedTokens, useTokens } from '../hooks';
import TokenCard from '../components/TokenCard';
import Head from '../components/Head';

import colors from 'styles/colors';
import fonts from 'styles/fonts';
import { NavigationProps } from 'types/props';

export default function ReceivedTokenList({
	navigation
}: NavigationProps<'ReceivedTokenList'>): React.ReactElement {
	const list = useRef(null);
	const tokens = useReceivedTokens(
		'5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
	);

	return (
		<SafeAreaView style={styles.container}>
			<Head label="Received Token List" />
			<FlatList
				ref={list}
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
				enableEmptySections
			/>
		</SafeAreaView>
	);
}

const styles = {
	container: {
		flex: 1,
		flexDirection: 'column',
		padding: 20
	},
	content: {
		flex: 1
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	loadingText: {
		fontFamily: fonts.bold,
		color: colors.background.card,
		fontSize: 34
	}
};
