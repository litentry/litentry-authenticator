import './shim';
import 'utils/iconLoader';
import * as React from 'react';
import { StatusBar, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { MenuProvider } from 'react-native-popup-menu';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NavigationBar from 'react-native-navbar-color';

import { AppNavigator } from './screens';

import { useApi } from 'modules/token/hooks';
import ApiNotLoaded from 'modules/main/components/ApiNotLoaded';
import { useScannerContext, ScannerContext } from 'stores/ScannerContext';
import { useAccountContext, AccountsContext } from 'stores/AccountsContext';
import CustomAlert from 'components/CustomAlert';
import { SeedRefsContext, useSeedRefStore } from 'stores/SeedRefStore';
import colors from 'styles/colors';
import { AlertStateContext, useAlertContext } from 'stores/alertContext';

export default function App(): React.ReactElement {
	NavigationBar.setColor(colors.background.os);
	if (global.inTest) {
		console.disableYellowBox = true;
	} else if (__DEV__) {
		LogBox.ignoreLogs([
			'Warning: componentWillReceiveProps',
			'Warning: componentWillMount',
			'Warning: componentWillUpdate',
			'Sending `onAnimatedValueUpdate`',
			'MenuProviders',
			'currentlyFocusedField',
			'Remote debugger is in a background',
			'Non-serializable values were found in the navigation state' // https://reactnavigation.org/docs/troubleshooting/#i-get-the-warning-non-serializable-values-were-found-in-the-navigation-state
		]);
	}
	const isApiReady = useApi();
	const alertContext = useAlertContext();
	const seedRefContext = useSeedRefStore();
	const accountsContext = useAccountContext();
	const scannerContext = useScannerContext();

	if (!isApiReady)
		return (
			<SafeAreaProvider>
				<ApiNotLoaded />
			</SafeAreaProvider>
		);
	return (
		<SafeAreaProvider>
			<AccountsContext.Provider value={accountsContext}>
				<ScannerContext.Provider value={scannerContext}>
					<AlertStateContext.Provider value={alertContext}>
						<SeedRefsContext.Provider value={seedRefContext}>
							<MenuProvider backHandler={true}>
								<StatusBar
									barStyle="dark-content"
									backgroundColor={colors.background.app}
								/>
								<CustomAlert />
								<NavigationContainer>
									<AppNavigator />
								</NavigationContainer>
							</MenuProvider>
						</SeedRefsContext.Provider>
					</AlertStateContext.Provider>
				</ScannerContext.Provider>
			</AccountsContext.Provider>
		</SafeAreaProvider>
	);
}
