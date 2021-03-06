import React, { useState, useRef, useContext } from 'react';
import { FlatList, View } from 'react-native';
import { Keyring } from '@polkadot/api';

import TokenCard from '../components/TokenCard';
import {
	getLastIdentity,
	useBalance,
	useExtrinsics,
	useIdentities
} from '../hooks';

import LabelTextCard from 'modules/token/components/LabelTextCard';
import {
	getIpfsAddress,
	getIpfsIdentityName,
	openIpfsIdentityDb
} from 'modules/token/utils';
import { dumbMeta } from 'types/identityTypes';
import { i_arrowOptions } from 'modules/token/styles';
import ScreenHeading from 'components/ScreenHeading';
import { alertDeleteAccount, alertError } from 'utils/alertUtils';
import { generateAccountId } from 'utils/account';
import PopupModal from 'modules/token/components/PopupModal';
import { defaultNetworkKey } from 'constants/networkSpecs';
import QrView from 'components/QrView';
import { AlertStateContext } from 'stores/alertContext';
import ButtonIcon from 'components/ButtonIcon';
import { unlockAndReturnSeed } from 'utils/navigationHelpers';
import QRScannerAndDerivationTab from 'components/QRScannerAndDerivationTab';
import { withCurrentIdentity } from 'utils/HOC';
import { SafeAreaViewContainer } from 'components/SafeAreaContainer';
import { NavigationWithCurrentIdentityAndAccountsStoreProps } from 'types/props';
import fonts from 'styles/fonts';
import colors from 'styles/colors';

function IdentityList({
	accountsStore,
	navigation,
	route
}: NavigationWithCurrentIdentityAndAccountsStoreProps<
	'IdentityList'
>): React.ReactElement {
	// this is the actual default endpoint
	const { currentIdentity } = accountsStore.state;
	const list = useRef(null);
	const ownerPath = route.params.ownerPath;
	const { setAlert } = useContext(AlertStateContext);
	const ownerMeta = currentIdentity.meta.get(ownerPath) || dumbMeta;
	const [updateIndex, setUpdateIndex] = useState(0);
	const identities = useIdentities(ownerMeta.address, updateIndex);
	const { registerIdentity } = useExtrinsics();
	const [modalVisible, setModalVisible] = useState<boolean>(false);
	const balance = useBalance(ownerMeta.address);

	if (ownerMeta === dumbMeta) return <View />;
	const accountId = generateAccountId({
		address: ownerMeta.address,
		networkKey: defaultNetworkKey
	});

	const registerNewIdentity = async () => {
		const keyring = new Keyring({ type: 'sr25519' });
		const seed = await unlockAndReturnSeed(navigation);
		const newPair = keyring.addFromUri(seed + ownerPath);
		try {
			const unsub = await registerIdentity().signAndSend(
				newPair,
				async result => {
					console.log('Current result is', result);
					console.log('Current result status is', result.status);
					if (result.status.isInBlock) {
						console.log(
							`Transaction included at blockHash ${result.status.asInBlock}`
						);
						const addedIdentity = await getLastIdentity(ownerMeta.address);
						if (addedIdentity !== undefined) {
							console.log('last identity is', addedIdentity);
							const ipfsAddress = await getIpfsAddress(addedIdentity);
							if (ipfsAddress !== null) {
								accountsStore.updateIpfsIdentity(addedIdentity, {
									name: '',
									address: ipfsAddress
								});
								console.log('ipfsAddress is', ipfsAddress);
								openIpfsIdentityDb(addedIdentity);
							}
							setUpdateIndex(updateIndex + 1);
						}
					} else if (result.status.isFinalized) {
						console.log(
							`Transaction finalized at blockHash ${result.status.asFinalized}`
						);
						unsub();
					}
				}
			);
		} catch (e) {
			console.log('e is', e);
			setAlert(
				'Transaction Failed',
				'Please check if the account has enough token, or use Polkadot.js default account like Alice to send some tokens to this account:' +
					e.toString()
			);
		} finally {
			// setUpdateIndex(updateIndex + 1);
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
				navigation.pop();
			} catch (err) {
				alertError(setAlert, `Can't delete this account: ${err.toString()}`);
			}
		});
	}

	return (
		<SafeAreaViewContainer style={styles.container}>
			<ScreenHeading title="Owned Identities" />
			<ButtonIcon
				title="Register New Identity"
				onPress={registerNewIdentity}
				{...i_arrowOptions}
			/>
			<ButtonIcon
				title="Show Account QR Code"
				onPress={(): void => setModalVisible(true)}
				{...i_arrowOptions}
			/>
			<ButtonIcon
				title="Delete this Owner"
				onPress={DeleteAccount}
				{...i_arrowOptions}
			/>
			<LabelTextCard text={balance} label="Current Balance" />
			<FlatList
				ref={list}
				style={styles.content}
				data={identities}
				keyExtractor={i => i}
				ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
				renderItem={({ item: identity, index }) => {
					const identityName = getIpfsIdentityName(identity, currentIdentity);
					return (
						<LabelTextCard
							text={identity}
							label={identityName !== '' ? identityName : `id_${index}`}
							onPress={() => navigation.navigate('TokenList', { identity })}
						/>
					);
				}}
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
