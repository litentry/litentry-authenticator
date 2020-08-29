import React, { useContext } from 'react';

import PathsList from 'modules/main/components/PathsList';
import ApiNotLoaded from 'modules/main/components/ApiNotLoaded';
import NoCurrentIdentity from 'modules/main/components/NoCurrentIdentity';
import { SafeAreaViewContainer } from 'components/SafeAreaContainer';
import OnBoardingView from 'modules/main/components/OnBoading';
import { AccountsContext } from 'stores/AccountsContext';
import { AccountsStoreStateWithIdentity } from 'types/identityTypes';

export default function Main(): React.ReactElement {
	const accountsStore = useContext(AccountsContext);
	const { identities, currentIdentity, loaded, accounts } = accountsStore.state;
	const hasLegacyAccount = accounts.size !== 0;

	if (!loaded) return <SafeAreaViewContainer />;
	if (identities.length === 0)
		return <OnBoardingView hasLegacyAccount={hasLegacyAccount} />;
	if (currentIdentity === null) return <NoCurrentIdentity />;
	return (
		<PathsList
			currentIdentity={currentIdentity}
			accountsStore={accountsStore as AccountsStoreStateWithIdentity}
		/>
	);
}
