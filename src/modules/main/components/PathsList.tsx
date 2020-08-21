import { StackNavigationProp } from '@react-navigation/stack';
import React, { useMemo } from 'react';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { SERVICES_LIST } from 'constants/servicesSpecs';
import { AccountsContextState } from 'stores/AccountsContext';
import {
	AccountsStoreStateWithIdentity,
	Identity,
	PathGroup
} from 'types/identityTypes';
import PathGroupCard from 'components/PathGroupCard';
import { RootStackParamList } from 'types/routes';
import { useUnlockSeed } from 'utils/navigationHelpers';
import { useSeedRef } from 'utils/seedRefHooks';
import { SafeAreaViewContainer } from 'components/SafeAreaContainer';
import {
	defaultNetworkKey,
	NETWORK_LIST,
	SUBSTRATE_NETWORK_LIST,
	UnknownNetworkKeys
} from 'constants/networkSpecs';
import testIDs from 'e2e/testIDs';
import { getAllPaths, groupPaths } from 'utils/identitiesUtils';
import QRScannerAndDerivationTab from 'components/QRScannerAndDerivationTab';
import PathCard from 'components/PathCard';
import Separator from 'components/Separator';
import { MainScreenLeftHeading } from 'components/ScreenHeading';

function PathsList({
	accountsStore,
	currentIdentity
}: {
	accountsStore: AccountsStoreStateWithIdentity;
	currentIdentity: Identity;
}): React.ReactElement {
	const pathsGroups = useMemo((): PathGroup[] | null => {
		const listedPaths = getAllPaths(currentIdentity);
		return groupPaths(listedPaths);
	}, [currentIdentity]);
	const { isSeedRefValid } = useSeedRef(currentIdentity.encryptedSeed);
	const { unlockWithoutPassword } = useUnlockSeed(isSeedRefValid);
	const { navigate } = useNavigation<StackNavigationProp<RootStackParamList>>();
	const defaultNetworkParam = SUBSTRATE_NETWORK_LIST[defaultNetworkKey];

	const onTapDeriveButton = (): Promise<void> =>
		unlockWithoutPassword({
			name: 'PathDerivation',
			params: { parentPath: '' }
		});

	const navigateToIdentityList = (path: string): void => {
		navigate('IdentityList', { ownerPath: path });
	};

	const renderSinglePath = (pathsGroup: PathGroup): React.ReactElement => {
		const path = pathsGroup.paths[0];
		return (
			<PathCard
				key={path}
				testID={testIDs.PathsList.pathCard + path}
				identity={currentIdentity}
				path={path}
				onPress={(): void => navigateToIdentityList(path)}
			/>
		);
	};

	return (
		<SafeAreaViewContainer>
			<ScrollView testID={testIDs.PathsList.screen}>
				<MainScreenLeftHeading
					title="Identity Owners"
					hasSubtitleIcon={true}
				/>
				{(pathsGroups as PathGroup[]).map(pathsGroup =>
					pathsGroup.paths.length === 1 ? (
						renderSinglePath(pathsGroup)
					) : (
						<PathGroupCard
							currentIdentity={currentIdentity}
							pathGroup={pathsGroup}
							networkParams={defaultNetworkParam}
							accountsStore={accountsStore}
							key={pathsGroup.title}
						/>
					)
				)}
				<Separator style={{ backgroundColor: 'transparent' }} />
			</ScrollView>
			<QRScannerAndDerivationTab
				derivationTestID={testIDs.PathsList.deriveButton}
				title="Derive New Account"
				onPress={onTapDeriveButton}
			/>
		</SafeAreaViewContainer>
	);
}

export default PathsList;
