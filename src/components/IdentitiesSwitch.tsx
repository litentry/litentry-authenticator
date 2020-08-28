import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import ButtonIcon from './ButtonIcon';
import Separator from './Separator';
import TransparentBackground from './TransparentBackground';

import { AccountsContext } from 'stores/AccountsContext';
import { RootStackParamList } from 'types/routes';
import testIDs from 'e2e/testIDs';
import colors from 'styles/colors';
import fontStyles from 'styles/fontStyles';
import { getSeedName } from 'utils/identitiesUtils';
import {
	unlockAndReturnSeed,
	navigateToLegacyAccountList,
	resetNavigationTo,
	resetNavigationWithNetworkChooser
} from 'utils/navigationHelpers';
import { Identity } from 'types/identityTypes';

function ButtonWithArrow(props: {
	onPress: () => void;
	testID?: string;
	title: string;
}): React.ReactElement {
	return <ButtonIcon {...props} {...i_arrowOptions} />;
}

function IdentitiesSwitch({}: {}): React.ReactElement {
	const accountsStore = useContext(AccountsContext);
	const navigation: StackNavigationProp<RootStackParamList> = useNavigation();
	const [visible, setVisible] = useState(false);
	const { currentIdentity, identities, accounts } = accountsStore.state;

	const closeModalAndNavigate = <RouteName extends keyof RootStackParamList>(
		screenName: RouteName,
		params?: RootStackParamList[RouteName]
	): void => {
		setVisible(false);
		// @ts-ignore
		navigation.navigate(screenName, params);
	};

	const onIdentitySelectedAndNavigate = async <
		RouteName extends keyof RootStackParamList
	>(
		identity: Identity,
		screenName: RouteName,
		params?: RootStackParamList[RouteName]
	): Promise<void> => {
		await accountsStore.selectIdentity(identity);
		setVisible(false);
		if (screenName === 'Main') {
			resetNavigationTo(navigation, screenName, params);
		} else if (screenName === 'IdentityBackup') {
			const seedPhrase = await unlockAndReturnSeed(navigation);
			resetNavigationWithNetworkChooser(navigation, screenName, {
				isNew: false,
				seedPhrase
			});
		} else {
			resetNavigationWithNetworkChooser(navigation, screenName, params);
		}
	};

	const onLegacyListClicked = (): void => {
		setVisible(false);
		navigateToLegacyAccountList(navigation);
		accountsStore.resetCurrentIdentity();
	};

	const renderIdentityOptions = (identity: Identity): React.ReactElement => {
		return (
			<>
				<ButtonWithArrow
					title="Manage Seed"
					onPress={(): Promise<void> =>
						onIdentitySelectedAndNavigate(identity, 'IdentityManagement')
					}
					testID={testIDs.IdentitiesSwitch.manageIdentityButton}
				/>
				<ButtonWithArrow
					title="Show Recovery Phrase"
					onPress={(): Promise<void> =>
						onIdentitySelectedAndNavigate(identity, 'IdentityBackup')
					}
				/>
			</>
		);
	};

	const renderCurrentIdentityCard = (): React.ReactNode => {
		if (!currentIdentity) return;

		const currentIdentityTitle = getSeedName(currentIdentity, identities);

		return (
			<>
				<ButtonIcon
					title={currentIdentityTitle}
					onPress={(): Promise<void> =>
						onIdentitySelectedAndNavigate(currentIdentity, 'Main')
					}
					iconType="antdesign"
					iconName="user"
					iconSize={40}
					style={{ paddingLeft: 16 }}
					textStyle={fontStyles.h1}
				/>
				{renderIdentityOptions(currentIdentity)}
				<Separator style={{ marginBottom: 0 }} />
			</>
		);
	};

	const renderNonSelectedIdentity = (
		identity: Identity
	): React.ReactElement => {
		const title = getSeedName(identity, identities);

		return (
			<ButtonIcon
				title={title}
				onPress={(): Promise<void> =>
					onIdentitySelectedAndNavigate(identity, 'Main')
				}
				key={identity.encryptedSeed}
				iconType="antdesign"
				iconName="user"
				iconSize={24}
				style={styles.indentedButton}
				textStyle={fontStyles.h2}
			/>
		);
	};

	const renderIdentities = (): React.ReactNode => {
		// if no identity or the only one we have is the selected one

		if (!identities.length || (identities.length === 1 && currentIdentity))
			return <Separator style={{ height: 0, marginVertical: 4 }} />;

		const identitiesToShow = currentIdentity
			? identities.filter(
					identity => identity.encryptedSeed !== currentIdentity.encryptedSeed
			  )
			: identities;

		return (
			<>
				<ScrollView
					bounces={false}
					style={{
						maxHeight: 160
					}}
				>
					<View style={{ paddingVertical: 8 }}>
						{identitiesToShow.map(renderNonSelectedIdentity)}
					</View>
				</ScrollView>
				{identities.length > 5 && (
					<Separator shadow={true} style={{ marginTop: 0 }} />
				)}
			</>
		);
	};

	return (
		<View>
			<ButtonIcon
				onPress={(): void => setVisible(!visible)}
				iconName="user"
				iconType="antdesign"
				iconBgStyle={{ backgroundColor: 'transparent' }}
				testID={testIDs.IdentitiesSwitch.toggleButton}
				style={{ paddingHorizontal: 6 }}
				iconSize={26}
			/>

			<TransparentBackground
				testID={testIDs.IdentitiesSwitch.modal}
				visible={visible}
				setVisible={setVisible}
				style={styles.container}
				animationType="none"
			>
				<View style={styles.card}>
					{renderCurrentIdentityCard()}
					{renderIdentities()}
					{accounts.size > 0 && (
						<>
							<ButtonIcon
								title="Legacy Accounts"
								onPress={onLegacyListClicked}
								iconName="solution1"
								iconType="antdesign"
								iconSize={24}
								textStyle={fontStyles.t_big}
								style={styles.indentedButton}
							/>
							<Separator />
						</>
					)}

					<ButtonIcon
						title="Add Seed"
						testID={testIDs.IdentitiesSwitch.addIdentityButton}
						onPress={(): void => closeModalAndNavigate('IdentityNew')}
						iconName="plus"
						iconType="antdesign"
						iconSize={24}
						textStyle={fontStyles.t_big}
						style={styles.indentedButton}
					/>
				</View>
			</TransparentBackground>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: colors.background.app,
		borderRadius: 4,
		paddingBottom: 16,
		paddingTop: 8
	},
	container: {
		justifyContent: 'center',
		paddingHorizontal: 16
	},
	i_arrowStyle: {
		paddingLeft: 64,
		paddingTop: 0
	},
	indentedButton: {
		paddingLeft: 32
	}
});

const i_arrowOptions = {
	iconColor: colors.signal.main,
	iconName: 'arrowright',
	iconSize: fontStyles.i_medium.fontSize,
	iconType: 'antdesign',
	style: styles.i_arrowStyle,
	textStyle: { ...fontStyles.a_text, color: colors.signal.main }
};

export default IdentitiesSwitch;
