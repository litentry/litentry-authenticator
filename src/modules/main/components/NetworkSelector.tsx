import React, { ReactElement, useContext, useMemo, useState } from 'react';
import { BackHandler, FlatList, FlatListProps } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import {
	SERVICES_LIST,
	ServicesSpecs,
	UNKNOWN_SERVICE_KEY
} from 'constants/servicesSpecs';
import { SubstrateNetworkKeys } from 'constants/networkSpecs';
import { NetworkCard } from 'components/AccountCard';
import { SafeAreaViewContainer } from 'components/SafeAreaContainer';
import ScreenHeading, { IdentityHeading } from 'components/ScreenHeading';
import testIDs from 'e2e/testIDs';
import { AlertStateContext } from 'stores/alertContext';
import colors from 'styles/colors';
import { NavigationAccountIdentityProps } from 'types/props';
import { alertPathDerivationError } from 'utils/alertUtils';
import { withCurrentIdentity } from 'utils/HOC';
import { getExistedServicesKeys, getIdentityName } from 'utils/identitiesUtils';
import {
	navigateToPathDetails,
	unlockSeedPhrase,
	useUnlockSeed
} from 'utils/navigationHelpers';
import { useSeedRef } from 'utils/seedRefHooks';
import QrScannerTab from 'components/QrScannerTab';

const excludedNetworks = [UNKNOWN_SERVICE_KEY, SubstrateNetworkKeys.KUSAMA_CC2];
if (!__DEV__) {
	excludedNetworks.push(SubstrateNetworkKeys.SUBSTRATE_DEV);
	excludedNetworks.push(SubstrateNetworkKeys.KUSAMA_DEV);
}

function NetworkSelector({
	accountsStore,
	navigation,
	route
}: NavigationAccountIdentityProps<'Main'>): React.ReactElement {
	const isNew = route.params?.isNew ?? false;
	const [shouldShowMoreNetworks, setShouldShowMoreNetworks] = useState(false);
	const { identities, currentIdentity } = accountsStore.state;
	const seedRefHooks = useSeedRef(currentIdentity.encryptedSeed);
	const { unlockWithoutPassword } = useUnlockSeed(seedRefHooks.isSeedRefValid);

	const { setAlert } = useContext(AlertStateContext);
	// catch android back button and prevent exiting the app
	useFocusEffect(
		React.useCallback((): any => {
			const handleBackButton = (): boolean => {
				if (shouldShowMoreNetworks) {
					setShouldShowMoreNetworks(false);
					return true;
				} else {
					return false;
				}
			};
			const backHandler = BackHandler.addEventListener(
				'hardwareBackPress',
				handleBackButton
			);
			return (): void => backHandler.remove();
		}, [shouldShowMoreNetworks])
	);

	const onAddCustomPath = (): Promise<void> =>
		unlockWithoutPassword({
			name: 'PathDerivation',
			params: { parentPath: '' }
		});

	const deriveSubstrateNetworkRootPath = async (
		serviceKey: string,
		serviceSpecs: ServicesSpecs
	): Promise<void> => {
		const { pathId } = serviceSpecs;
		await unlockSeedPhrase(navigation, seedRefHooks.isSeedRefValid);
		const fullPath = `//${pathId}`;
		try {
			await accountsStore.deriveNewPath(
				fullPath,
				seedRefHooks.substrateAddress,
				serviceKey,
				`${serviceSpecs.title} root`,
				''
			);
			navigateToPathDetails(navigation, serviceKey, fullPath);
		} catch (error) {
			alertPathDerivationError(setAlert, error.message);
		}
	};

	const getListOptions = (): Partial<FlatListProps<any>> => {
		if (isNew) return {};
		if (shouldShowMoreNetworks) {
			return {
				ListHeaderComponent: (
					<NetworkCard
						isAdd={true}
						onPress={onAddCustomPath}
						testID={testIDs.Main.addCustomNetworkButton}
						title="Create Custom Path"
						networkColor={colors.background.app}
					/>
				)
			};
		} else {
			return {
				ListFooterComponent: (
					<NetworkCard
						isAdd={true}
						onPress={(): void => setShouldShowMoreNetworks(true)}
						testID={testIDs.Main.addNewNetworkButton}
						title="Add Network Account"
						networkColor={colors.background.app}
					/>
				)
			};
		}
	};

	const renderScreenHeading = (): React.ReactElement => {
		if (isNew) {
			return <ScreenHeading title={'Create your first Keypair'} />;
		} else if (shouldShowMoreNetworks) {
			return (
				<IdentityHeading
					title={'Choose Network'}
					onPressBack={(): void => setShouldShowMoreNetworks(false)}
				/>
			);
		} else {
			const identityName = getIdentityName(currentIdentity, identities);
			return <IdentityHeading title={identityName} />;
		}
	};

	const onServiceChosen = async (
		serviceKey: string,
		serviceSpecs: ServicesSpecs
	): Promise<void> => {
		if (isNew || shouldShowMoreNetworks) {
			await deriveSubstrateNetworkRootPath(serviceKey, serviceSpecs);
		} else {
			navigation.navigate('PathsList', { networkKey: serviceKey });
		}
	};

	const availableNetworks = useMemo(
		() => getExistedServicesKeys(currentIdentity),
		[currentIdentity]
	);

	const sortNetworkKeys = (
		[, params1]: [any, ServicesSpecs],
		[, params2]: [any, ServicesSpecs]
	): number => params1.order - params2.order;

	const filterNetworkKeys = ([networkKey]: [string, any]): boolean => {
		const shouldExclude = excludedNetworks.includes(networkKey);
		if (isNew && !shouldExclude) return true;

		if (shouldShowMoreNetworks) {
			if (shouldExclude) return false;
			return !availableNetworks.includes(networkKey);
		}
		return availableNetworks.includes(networkKey);
	};

	const servicesList = Object.entries(SERVICES_LIST)
		.sort(sortNetworkKeys)
		.filter(filterNetworkKeys);

	const renderServices = ({
		item
	}: {
		item: [string, ServicesSpecs];
	}): ReactElement => {
		const [serviceKey, serviceSpecs] = item;
		return (
			<NetworkCard
				key={serviceKey}
				testID={testIDs.Main.networkButton}
				networkKey={serviceKey}
				onPress={(): Promise<void> => onServiceChosen(serviceKey, serviceSpecs)}
				title={serviceSpecs.title}
			/>
		);
	};

	return (
		<SafeAreaViewContainer>
			{renderScreenHeading()}
			<FlatList
				bounces={false}
				data={servicesList}
				keyExtractor={(item: [string, ServicesSpecs]): string => item[0]}
				renderItem={renderServices}
				testID={testIDs.Main.chooserScreen}
				{...getListOptions()}
			/>
			{!shouldShowMoreNetworks && !isNew && <QrScannerTab />}
		</SafeAreaViewContainer>
	);
}

export default withCurrentIdentity(NetworkSelector);
