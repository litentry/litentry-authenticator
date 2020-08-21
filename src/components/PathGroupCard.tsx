import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import testIDs from '../../test/e2e/testIDs';

import PathCard from './PathCard';
import Separator from './Separator';

import { ServicesSpecs } from 'constants/servicesSpecs';
import { AlertStateContext } from 'stores/alertContext';
import colors from 'styles/colors';
import TouchableItem from 'components/TouchableItem';
import fontStyles from 'styles/fontStyles';
import {
	AccountsStoreStateWithIdentity,
	Identity,
	PathGroup
} from 'types/identityTypes';
import {
	isSubstrateNetworkParams,
	SubstrateNetworkParams,
	UnknownNetworkParams
} from 'types/networkSpecsTypes';
import { removeSlash } from 'utils/identitiesUtils';
import { useSeedRef } from 'utils/seedRefHooks';
import { unlockSeedPhrase } from 'utils/navigationHelpers';
import { alertPathDerivationError } from 'utils/alertUtils';
import { RootStackParamList } from 'types/routes';

type Props = {
	accountsStore: AccountsStoreStateWithIdentity;
	currentIdentity: Identity;
	pathGroup: PathGroup;
	networkParams: SubstrateNetworkParams;
};

export default function PathGroupCard({
	currentIdentity,
	pathGroup,
	networkParams,
	accountsStore
}: Props): React.ReactElement {
	const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
	const { setAlert } = useContext(AlertStateContext);
	const paths = pathGroup.paths;
	const { isSeedRefValid, substrateAddress } = useSeedRef(
		currentIdentity.encryptedSeed
	);
	const _getFullPath = (index: number, isHardDerivation: boolean): string =>
		`//${networkParams.pathId}${pathGroup.title}${
			isHardDerivation ? '//' : '/'
		}${index}`;
	const _getNextIndex = (isHardDerivation: boolean): number => {
		let index = 0;
		while (paths.includes(_getFullPath(index, isHardDerivation))) {
			index++;
		}
		return index;
	};

	const addDerivationPath = async (
		isHardDerivation: boolean
	): Promise<void> => {
		if (!isSeedRefValid) {
			await unlockSeedPhrase(navigation, isSeedRefValid);
			navigation.goBack();
		}
		const nextIndex = _getNextIndex(isHardDerivation);
		const nextPath = _getFullPath(nextIndex, isHardDerivation);
		const name = removeSlash(`${pathGroup.title}${nextIndex}`);
		try {
			await accountsStore.deriveNewPath(
				nextPath,
				substrateAddress,
				(networkParams as SubstrateNetworkParams).genesisHash,
				name,
				''
			);
		} catch (error) {
			alertPathDerivationError(setAlert, error.message);
		}
	};

	const headerTitle = removeSlash(pathGroup.title);
	const headerCode = `//${networkParams.pathId}${pathGroup.title}`;
	return (
		<View key={`group${pathGroup.title}`} style={{ marginTop: 24 }}>
			<Separator shadow={true} style={styles.separator} />
			<View style={styles.header}>
				<View style={styles.headerText}>
					<View>
						<Text style={fontStyles.t_prefix}>{headerTitle}</Text>
						<Text style={fontStyles.t_codeS}>{headerCode}</Text>
					</View>
				</View>
				<TouchableItem
					onPress={(): any => addDerivationPath(true)}
					style={styles.derivationButton}
					testID={`${testIDs.PathsList.pathsGroup}${pathGroup.title}`}
				>
					<Text style={styles.derivationIcon}>+</Text>
					<Text style={styles.derivationTextLabel}>{'new derivation'}</Text>
				</TouchableItem>
			</View>
			{paths.map(path => (
				<PathCard
					key={path}
					testID={testIDs.PathsList.pathCard + path}
					identity={currentIdentity}
					path={path}
					onPress={(): void => {
						navigation.navigate('IdentityList', { ownerPath: path });
					}}
				/>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	derivationButton: {
		alignItems: 'center',
		backgroundColor: 'black',
		height: 63,
		justifyContent: 'center',
		marginHorizontal: 0,
		marginVertical: 0,
		paddingHorizontal: 10
	},
	derivationIcon: {
		...fontStyles.i_medium,
		color: colors.text.main,
		fontWeight: 'bold'
	},
	derivationTextLabel: {
		...fontStyles.a_text,
		color: colors.text.main
	},
	header: {
		flexDirection: 'row',
		height: 63,
		paddingLeft: 16,
		paddingRight: 0
	},
	headerText: {
		flexGrow: 1,
		marginVertical: 16
	},
	separator: {
		height: 0,
		marginVertical: 0
	}
});
