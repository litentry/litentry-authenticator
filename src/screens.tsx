import {
	useNavigation,
	useNavigationState,
	useRoute
} from '@react-navigation/native';
import {
	CardStyleInterpolators,
	createStackNavigator,
	HeaderBackButton
} from '@react-navigation/stack';
import * as React from 'react';
import { View } from 'react-native';

import IdentityList from 'modules/token/screens/IdentityList';
import ReceivedTokenList from 'modules/token/screens/ReceivedTokenList';
import TokenDetails from 'modules/token/screens/TokenDetails';
import TokenList from 'modules/token/screens/TokenList';
import PathDerivation from 'modules/path/PathDerivation';
import PathsList from 'modules/path/PathsList';
import PinNew from 'modules/unlock/screens/PinNew';
import PinUnlock from 'modules/unlock/screens/PinUnlock';
import PinUnlockWithPassword from 'modules/unlock/screens/PinUnlockWithPassword';
import HeaderLeftHome from 'components/HeaderLeftHome';
import SecurityHeader from 'components/SecurityHeader';
import testIDs from 'e2e/testIDs';
import Main from 'modules/main/screens/Main';
import IdentityBackup from 'modules/identity/IdentityBackup';
import IdentityManagement from 'modules/identity/IdentityManagement';
import IdentityNew from 'modules/identity/IdentityNew';
import colors from 'styles/colors';
import { headerHeight, horizontalPadding } from 'styles/containerStyles';
import { RootStackParamList } from 'types/routes';

export const ScreenStack = createStackNavigator<RootStackParamList>();

const HeaderLeft = (): React.ReactElement => {
	const route = useRoute();
	const isFirstRouteInParent = useNavigationState(
		state => state.routes[0].key === route.key
	);
	return isFirstRouteInParent ? <HeaderLeftHome /> : <HeaderLeftWithBack />;
};

const globalStackNavigationOptions = {
	//more transition animations refer to: https://reactnavigation.org/docs/en/stack-navigator.html#animations
	cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
	headerBackTitleStyle: {
		color: colors.text.main
	},
	headerBackTitleVisible: false,
	headerLeft: (): React.ReactElement => <HeaderLeft />,
	headerLeftContainerStyle: {
		height: headerHeight,
		paddingLeft: 8
	},
	headerRight: (): React.ReactElement => <SecurityHeader />,
	headerRightContainerStyle: {
		height: headerHeight,
		paddingRight: horizontalPadding
	},
	headerStyle: {
		backgroundColor: colors.background.app,
		borderBottomColor: colors.background.app,
		borderBottomWidth: 0,
		elevation: 0,
		height: headerHeight,
		shadowColor: 'transparent'
	},
	headerTintColor: colors.text.main,
	headerTitle: (): React.ReactNode => null
};

const HeaderLeftWithBack = (): React.ReactElement => {
	const navigation = useNavigation();
	return (
		<View testID={testIDs.Header.headerBackButton}>
			<HeaderBackButton
				labelStyle={globalStackNavigationOptions.headerBackTitleStyle}
				labelVisible={false}
				tintColor={colors.text.main}
				onPress={(): void => navigation.goBack()}
			/>
		</View>
	);
};

export const AppNavigator = (): React.ReactElement => (
	<ScreenStack.Navigator
		initialRouteName="Main"
		screenOptions={globalStackNavigationOptions}
	>
		<ScreenStack.Screen name="Main" component={Main} />
		<ScreenStack.Screen name="IdentityBackup" component={IdentityBackup} />
		<ScreenStack.Screen
			name="IdentityManagement"
			component={IdentityManagement}
		/>
		<ScreenStack.Screen name="IdentityNew" component={IdentityNew} />
		<ScreenStack.Screen name="IdentityList" component={IdentityList} />
		<ScreenStack.Screen
			name="ReceivedTokenList"
			component={ReceivedTokenList}
		/>
		<ScreenStack.Screen name="TokenDetails" component={TokenDetails} />
		<ScreenStack.Screen name="TokenList" component={TokenList} />
		<ScreenStack.Screen name="PinNew" component={PinNew} />
		<ScreenStack.Screen name="PinUnlock" component={PinUnlock} />
		<ScreenStack.Screen
			name="PinUnlockWithPassword"
			component={PinUnlockWithPassword}
		/>
		<ScreenStack.Screen name="PathDerivation" component={PathDerivation} />
		<ScreenStack.Screen name="PathsList" component={PathsList} />
	</ScreenStack.Navigator>
);
