import React, { useState, useEffect, useRef, useContext } from 'react';
import { FlatList, Text, View, SafeAreaView } from 'react-native';
import { Keyring } from '@polkadot/api';

import TokenCard from '../components/TokenCard';
import { useApi, useExtrinsics, useIdentities } from '../hooks';
import Button from '../../../components/Button';
import Head from '../components/Head';

import { getAllPaths } from 'utils/identitiesUtils';
import { alertDeleteAccount, alertError } from 'utils/alertUtils';
import { generateAccountId } from 'utils/account';
import PopupModal from 'modules/token/components/PopupModal';
import { defaultNetworkKey } from 'constants/networkSpecs';
import QrView from 'components/QrView';
import fontStyles from 'styles/fontStyles';
import { AlertStateContext } from 'stores/alertContext';
import ButtonIcon from 'components/ButtonIcon';
import { unlockAndReturnSeed } from 'utils/navigationHelpers';
import QRScannerAndDerivationTab from 'components/QRScannerAndDerivationTab';
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
	const { setAlert } = useContext(AlertStateContext);
	const ownerMeta = currentIdentity.meta.get(ownerPath)!;
	const identities = useIdentities(ownerMeta.address);
	const { registerIdentity } = useExtrinsics();
	const [modalVisible, setModalVisible] = useState<boolean>(false);
	const accountId = generateAccountId({
		address: ownerMeta.address,
		networkKey: defaultNetworkKey
	});

	const registerNewIdentity = async () => {
		const keyring = new Keyring({ type: 'sr25519' });
		const seed = await unlockAndReturnSeed(navigation);
		const newPair = keyring.addFromUri(seed + ownerPath);
		console.log('paris is', keyring.pairs);
		console.log('current keyring is', keyring);
		try {
			const unsub = await registerIdentity().signAndSend(newPair, result => {
				console.log('Current result is', result);
				console.log('Current result status is', result.status);
				if (result.status.isInBlock) {
					console.log(
						`Transaction included at blockHash ${result.status.asInBlock}`
					);
				} else if (result.status.isFinalized) {
					console.log(
						`Transaction finalized at blockHash ${result.status.asFinalized}`
					);
					unsub();
				}
			});
		} catch (e) {
			console.log('e is', e);
			setAlert(
				'Transaction Failed',
				'Please check if the account has enough token, or use Polkadot.js default account like Alice to send some tokens to this account'
			);
		} finally {
			navigation.pop();
		}
	};

	function QrCode(): React.ReactElement {
		return <QrView data={accountId} />;
	}

	function DeleteAccount(): void {
		alertDeleteAccount(setAlert, 'this account', async () => {
			try {
				await accountsStore.deletePath(ownerPath);
				navigation.navigate('Main');
			} catch (err) {
				alertError(setAlert, `Can't delete this account: ${err.toString()}`);
			}
		});
	}

	return (
		<SafeAreaViewContainer style={styles.container}>
			<Head label="Owned Identities" />
			<ButtonIcon
				title="Show QR Code"
				onPress={(): void => setModalVisible(true)}
				{...i_arrowOptions}
			/>
			<ButtonIcon
				title="Delete this Owner"
				onPress={DeleteAccount}
				{...i_arrowOptions}
			/>
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
			/>
			<QRScannerAndDerivationTab
				onPress={registerNewIdentity}
				title="Register New"
			/>
			<PopupModal
				title="QR Code"
				visible={modalVisible}
				setVisible={setModalVisible}
				innerComponent={<QrCode />}
			/>
		</SafeAreaViewContainer>
	);
}

export default withCurrentIdentity(IdentityList);

const i_arrowOptions = {
	iconColor: colors.signal.main,
	iconName: 'arrowright',
	iconSize: fontStyles.i_medium.fontSize,
	iconType: 'antdesign',
	style: {
		paddingLeft: 64,
		paddingTop: 0
	},
	textStyle: { ...fontStyles.a_text, color: colors.signal.main }
};

const styles = {
	container: {
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
