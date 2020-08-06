import React, { useContext } from 'react';

import NoCurrentIdentity from 'modules/main/components/NoCurrentIdentity';
import { SafeAreaViewContainer } from 'components/SafeAreaContainer';
import OnBoardingView from 'modules/main/components/OnBoading';
import NetworkSelector from 'modules/main/components/NetworkSelector';
import { AccountsContext } from 'stores/AccountsContext';
import { NavigationAccountIdentityProps, NavigationProps } from 'types/props';

export default function Main(
	props: NavigationProps<'Main'>
): React.ReactElement {
	const accountsStore = useContext(AccountsContext);
	const { identities, currentIdentity, loaded, accounts } = accountsStore.state;
	const hasLegacyAccount = accounts.size !== 0;

	if (!loaded) return <SafeAreaViewContainer />;
	if (identities.length === 0)
		return <OnBoardingView hasLegacyAccount={hasLegacyAccount} />;
	if (currentIdentity === null) return <NoCurrentIdentity />;
	return (
		<NetworkSelector {...(props as NavigationAccountIdentityProps<'Main'>)} />
	);
}