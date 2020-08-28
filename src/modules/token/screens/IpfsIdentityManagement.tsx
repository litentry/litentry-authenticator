import React, { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { SafeAreaViewContainer } from 'components/SafeAreaContainer';
import ScreenHeading from 'components/ScreenHeading';
import TextInput from 'components/TextInput';
import { AlertStateContext } from 'stores/alertContext';
import colors from 'styles/colors';
import { dumbIpfsIdentity, IpfsIdentity } from 'types/identityTypes';
import { NavigationWithCurrentIdentityAndAccountsStoreProps } from 'types/props';
import { alertError } from 'utils/alertUtils';
import { withCurrentIdentity } from 'utils/HOC';

type Props = NavigationWithCurrentIdentityAndAccountsStoreProps<
	'IpfsIdentityManagement'
>;

function IpfsIdentityManagement({
	accountsStore,
	route
}: Props): React.ReactElement {
	const { currentIdentity } = accountsStore.state;
	const { setAlert } = useContext(AlertStateContext);
	const identityHash = route.params.identity;
	const identityMeta: IpfsIdentity = currentIdentity.ipfs.has(identityHash)
		? currentIdentity.ipfs.get(identityHash)!
		: dumbIpfsIdentity;
	const [input, setInput] = useState(identityMeta.name);

	if (!currentIdentity) return <View />;
	const onRenameIdentity = (name: string): void => {
		try {
			setInput(name);
			accountsStore.updateIpfsIdentity(identityHash, {
				name,
				address: identityMeta.address
			});
		} catch (err) {
			alertError(setAlert, `Can't rename: ${err.message}`);
		}
	};

	return (
		<SafeAreaViewContainer>
			<ScreenHeading title="Rename Identity" />
			<TextInput
				label="Display Name"
				onChangeText={onRenameIdentity}
				value={input}
				placeholder="Enter a new seed name"
				focus
			/>
		</SafeAreaViewContainer>
	);
}

export default withCurrentIdentity(IpfsIdentityManagement);

const styles = StyleSheet.create({
	deleteText: {
		color: colors.signal.error
	},
	header: {
		flexDirection: 'row',
		paddingBottom: 24,
		paddingLeft: 16,
		paddingRight: 16
	}
});
