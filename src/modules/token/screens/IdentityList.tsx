import React, { useState, useEffect, useRef } from 'react';
import { FlatList, Text, View, SafeAreaView } from 'react-native';

import TokenCard from '../components/TokenCard';
import { useApi, useIdentities } from '../hooks';
import Button from '../../../components/Button';
import Head from '../components/Head';

import { withCurrentIdentity } from 'utils/HOC';
import { SafeAreaViewContainer } from 'components/SafeAreaContainer';
import { NavigationAccountIdentityProps, NavigationProps } from 'types/props';
import fonts from 'styles/fonts';
import colors from 'styles/colors';

function IdentityList({
	accountsStore,
	navigation,
	route
}: NavigationAccountIdentityProps<'IdentityList'>): React.ReactElement {
	// this is the actual default endpoint
	const { currentIdentity } = accountsStore.state;
	const list = useRef(null);
	const ownerPath = route.params.ownerPath;
	const ownerMeta = currentIdentity.meta.get(ownerPath)!;
	const identities = useIdentities(ownerMeta.address);

	return (
		<SafeAreaViewContainer style={styles.container}>
			<Head label="Owned Identities" />
			<FlatList
				ref={list}
				style={styles.content}
				data={identities}
				keyExtractor={i => i}
				ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
				renderItem={({ item: identity, index }) => (
					<TokenCard
						title="id"
						identity={identity}
						index={index}
						onPress={() => navigation.navigate('TokenList', { identity })}
						style={{ paddingBottom: 10 }}
					/>
				)}
				enableEmptySections
			/>

			<Button
				title={'Received Tokens'}
				onPress={() => navigation.navigate('ReceivedTokenList')}
			/>
		</SafeAreaViewContainer>
	);
}

export default withCurrentIdentity(IdentityList);

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
		color: colors.text.faded,
		fontSize: 34
	}
};
