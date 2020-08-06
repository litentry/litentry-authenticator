import {
	CommonActions,
	useNavigation,
	useNavigationState
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { Identity } from 'types/identityTypes';
import { RootStackParamList } from 'types/routes';

type Route = {
	name: keyof RootStackParamList;
	params?: RootStackParamList[keyof RootStackParamList];
};

export type GenericNavigationProps<
	RouteName extends keyof RootStackParamList
> = StackNavigationProp<RootStackParamList, RouteName>;

export const setPin = async <RouteName extends keyof RootStackParamList>(
	navigation: GenericNavigationProps<RouteName>
): Promise<string> =>
	new Promise(resolve => {
		navigation.navigate('PinNew', { resolve });
	});

export const unlockAndReturnSeed = async <
	RouteName extends keyof RootStackParamList
>(
	navigation: GenericNavigationProps<RouteName>
): Promise<string> =>
	new Promise(resolve => {
		navigation.navigate('PinUnlock', {
			resolve,
			shouldReturnSeed: true
		});
	});

type UnlockWithPassword = (
	nextRoute: (password: string) => Route,
	identity?: Identity
) => Promise<void>;

type UnlockWithoutPassword = (
	nextRoute: Route,
	identity?: Identity
) => Promise<void>;
export const useUnlockSeed = (
	isSeedRefValid: boolean
): {
	unlockWithPassword: UnlockWithPassword;
	unlockWithoutPassword: UnlockWithoutPassword;
} => {
	const currentRoutes = useNavigationState(state => state.routes) as Route[];
	const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
	const resetRoutes = (routes: Route[]): void => {
		const resetAction = CommonActions.reset({
			index: routes.length,
			routes: routes
		});
		navigation.dispatch(resetAction);
	};

	const unlockWithPassword: UnlockWithPassword = async (
		nextRoute,
		identity
	) => {
		const password = await unlockSeedPhraseWithPassword(
			navigation,
			isSeedRefValid,
			identity
		);
		const newRoutes = currentRoutes.concat(nextRoute(password));
		resetRoutes(newRoutes);
	};

	const unlockWithoutPassword: UnlockWithoutPassword = async (
		nextRoute,
		identity
	) => {
		await unlockSeedPhrase(navigation, isSeedRefValid, identity);
		const newRoutes = currentRoutes.concat(nextRoute);
		resetRoutes(newRoutes);
	};

	return { unlockWithPassword, unlockWithoutPassword };
};

export const unlockSeedPhrase = async <
	RouteName extends keyof RootStackParamList
>(
	navigation: GenericNavigationProps<RouteName>,
	isSeedRefValid: boolean,
	identity?: Identity
): Promise<void> =>
	new Promise(resolve => {
		if (isSeedRefValid) {
			resolve();
		} else {
			navigation.navigate('PinUnlock', {
				identity,
				resolve,
				shouldReturnSeed: false
			});
		}
	});

export const unlockSeedPhraseWithPassword = async <
	RouteName extends keyof RootStackParamList
>(
	navigation: GenericNavigationProps<RouteName>,
	isSeedRefValid: boolean,
	identity?: Identity
): Promise<string> =>
	new Promise(resolve => {
		navigation.navigate('PinUnlockWithPassword', {
			identity,
			isSeedRefValid,
			resolve
		});
	});

export const navigateToPathDetails = <
	RouteName extends keyof RootStackParamList
>(
	navigation: GenericNavigationProps<RouteName>,
	networkKey: string,
	path: string
): void => {
	const resetAction = CommonActions.reset({
		index: 2,
		routes: [
			{
				name: 'Main',
				params: { isNew: false }
			},
			{
				name: 'PathsList',
				params: { networkKey }
			},
			{
				name: 'PathDetails',
				params: { path }
			}
		]
	});
	navigation.dispatch(resetAction);
};

export const navigateToLandingPage = <
	RouteName extends keyof RootStackParamList
>(
	navigation: GenericNavigationProps<RouteName>
): void => {
	const resetAction = CommonActions.reset({
		index: 0,
		routes: [{ name: 'Main' }]
	});
	navigation.dispatch(resetAction);
};

export const navigateToNewIdentityNetwork = <
	RouteName extends keyof RootStackParamList
>(
	navigation: GenericNavigationProps<RouteName>
): void => {
	const resetAction = CommonActions.reset({
		index: 0,
		routes: [
			{
				name: 'Main',
				params: { isNew: true }
			}
		]
	});
	navigation.dispatch(resetAction);
};

export const resetNavigationTo = <RouteName extends keyof RootStackParamList>(
	navigation: GenericNavigationProps<RouteName>,
	screenName: string,
	params?: any
): void => {
	const resetAction = CommonActions.reset({
		index: 0,
		routes: [{ name: screenName, params }]
	});
	navigation.dispatch(resetAction);
};

export const resetNavigationWithNetworkChooser = <
	RouteName extends keyof RootStackParamList
>(
	navigation: GenericNavigationProps<RouteName>,
	screenName: string,
	params: object = {},
	isNew = false
): void => {
	const resetAction = CommonActions.reset({
		index: 1,
		routes: [
			{
				name: 'Main',
				params: { isNew }
			},
			{
				name: screenName,
				params: params
			}
		]
	});
	navigation.dispatch(resetAction);
};

export const resetNavigationWithScanner = <
	RouteName extends keyof RootStackParamList
>(
	navigation: GenericNavigationProps<RouteName>,
	screenName: string
): void => {
	const resetAction = CommonActions.reset({
		index: 1,
		routes: [
			{
				name: 'Main',
				params: { isNew: false }
			},
			{
				name: 'QrScanner'
			},
			{
				name: screenName
			}
		]
	});
	navigation.dispatch(resetAction);
};

export const navigateToPathsList = <RouteName extends keyof RootStackParamList>(
	navigation: GenericNavigationProps<RouteName>,
	networkKey: string
): void =>
	resetNavigationWithNetworkChooser(navigation, 'PathsList', { networkKey });

export const navigateToQrScanner = <RouteName extends keyof RootStackParamList>(
	navigation: GenericNavigationProps<RouteName>
): void => resetNavigationWithNetworkChooser(navigation, 'QrScanner');

export const navigateToLegacyAccountList = <
	RouteName extends keyof RootStackParamList
>(
	navigation: GenericNavigationProps<RouteName>
): void => resetNavigationTo(navigation, 'LegacyAccountList');
