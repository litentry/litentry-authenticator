import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import { SafeAreaViewContainer } from 'components/SafeAreaContainer';
import testIDs from 'e2e/testIDs';
import { AccountsContext } from 'stores/AccountsContext';
import { AlertStateContext } from 'stores/alertContext';
import { NavigationWithCurrentIdentityAndAccountsStoreProps } from 'types/props';
import { withCurrentIdentity } from 'utils/HOC';
import TextInput from 'components/TextInput';
import {
	unlockAndReturnSeed,
	navigateToLandingPage,
	unlockSeedPhrase
} from 'utils/navigationHelpers';
import { alertDeleteIdentity, alertError } from 'utils/alertUtils';
import ScreenHeading from 'components/ScreenHeading';
import colors from 'styles/colors';
import PopupMenu from 'components/PopupMenu';
import { useSeedRef } from 'utils/seedRefHooks';

type Props = NavigationWithCurrentIdentityAndAccountsStoreProps<
	'IdentityManagement'
>;

function IdentityManagement({
	accountsStore,
	navigation
}: Props): React.ReactElement {
	const { currentIdentity } = accountsStore.state;
	const { setAlert } = useContext(AlertStateContext);
	const { destroySeedRef } = useSeedRef(currentIdentity.encryptedSeed);
	if (!currentIdentity) return <View />;

	const onRenameIdentity = async (name: string): Promise<void> => {
		try {
			await accountsStore.updateIdentityName(name);
		} catch (err) {
			alertError(setAlert, `Can't rename: ${err.message}`);
		}
	};

	const onOptionSelect = async (value: string): Promise<void> => {
		if (value === 'IdentityDelete') {
			alertDeleteIdentity(
				setAlert,
				async (): Promise<void> => {
					await unlockSeedPhrase(navigation, false);
					try {
						await destroySeedRef();
						await accountsStore.deleteCurrentIdentity();
						navigateToLandingPage(navigation);
					} catch (err) {
						alertError(setAlert, "Can't delete Identity.");
					}
				}
			);
		} else if (value === 'IdentityBackup') {
			const seedPhrase = await unlockAndReturnSeed(navigation);
			navigation.pop();
			navigation.navigate(value, { isNew: false, seedPhrase });
		}
	};

	return (
		<SafeAreaViewContainer>
			<ScreenHeading
				title="Manage Seed"
				headMenu={
					<PopupMenu
						testID={testIDs.IdentityManagement.popupMenuButton}
						onSelect={onOptionSelect}
						menuTriggerIconName={'more-vert'}
						menuItems={[
							{ text: 'Backup', value: 'IdentityBackup' },
							{
								testID: testIDs.IdentityManagement.deleteButton,
								text: 'Delete',
								textStyle: styles.deleteText,
								value: 'IdentityDelete'
							}
						]}
					/>
				}
			/>
			<TextInput
				label="Display Name"
				onChangeText={onRenameIdentity}
				value={currentIdentity.name}
				placeholder="Enter a new seed name"
				focus
			/>
		</SafeAreaViewContainer>
	);
}

export default withCurrentIdentity(IdentityManagement);

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
