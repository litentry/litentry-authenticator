// Copyright 2015-2020 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// Parity is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Parity is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Parity.  If not, see <http://www.gnu.org/licenses/>.

import React, { useMemo } from 'react';
import { ScrollView } from 'react-native';

import { SERVICES_LIST } from 'constants/servicesSpecs';
import { PathGroup } from 'types/identityTypes';
import PathGroupCard from 'components/PathGroupCard';
import { useUnlockSeed } from 'utils/navigationHelpers';
import { useSeedRef } from 'utils/seedRefHooks';
import { SafeAreaViewContainer } from 'components/SafeAreaContainer';
import { NETWORK_LIST, UnknownNetworkKeys } from 'constants/networkSpecs';
import testIDs from 'e2e/testIDs';
import {
	isEthereumNetworkParams,
	isUnknownNetworkParams
} from 'types/networkSpecsTypes';
import { NavigationAccountIdentityProps } from 'types/props';
import { withCurrentIdentity } from 'utils/HOC';
import { getPathsWithServiceKey, groupPaths } from 'utils/identitiesUtils';
import QRScannerAndDerivationTab from 'components/QRScannerAndDerivationTab';
import PathCard from 'components/PathCard';
import Separator from 'components/Separator';
import { LeftScreenHeading } from 'components/ScreenHeading';

function PathsList({
	accountsStore,
	navigation,
	route
}: NavigationAccountIdentityProps<'PathsList'>): React.ReactElement {
	const networkKey = route.params.networkKey ?? UnknownNetworkKeys.UNKNOWN;
	const serviceParams = SERVICES_LIST[networkKey];

	const { currentIdentity } = accountsStore.state;
	const isUnknownNetworkPath =
		serviceParams.pathId === UnknownNetworkKeys.UNKNOWN;
	const pathsGroups = useMemo((): PathGroup[] | null => {
		const listedPaths = getPathsWithServiceKey(currentIdentity, networkKey);
		return groupPaths(listedPaths);
	}, [currentIdentity, networkKey]);
	const { isSeedRefValid } = useSeedRef(currentIdentity.encryptedSeed);
	const { unlockWithoutPassword } = useUnlockSeed(isSeedRefValid);
	const { navigate } = navigation;
	const rootPath = `//${serviceParams.pathId}`;

	const onTapDeriveButton = (): Promise<void> =>
		unlockWithoutPassword({
			name: 'PathDerivation',
			params: { parentPath: isUnknownNetworkPath ? '' : rootPath }
		});

	const renderSinglePath = (pathsGroup: PathGroup): React.ReactElement => {
		const path = pathsGroup.paths[0];
		return (
			<PathCard
				key={path}
				testID={testIDs.PathsList.pathCard + path}
				identity={currentIdentity}
				path={path}
				onPress={(): void => {}}
			/>
		);
	};

	return (
		<SafeAreaViewContainer>
			<ScrollView testID={testIDs.PathsList.screen}>
				<LeftScreenHeading
					title={serviceParams.title}
					hasSubtitleIcon={true}
					networkKey={networkKey}
				/>
				{(pathsGroups as PathGroup[]).map(pathsGroup =>
					pathsGroup.paths.length === 1 ? (
						renderSinglePath(pathsGroup)
					) : (
						<PathGroupCard
							currentIdentity={currentIdentity}
							pathGroup={pathsGroup}
							networkParams={serviceParams}
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

export default withCurrentIdentity(PathsList);
