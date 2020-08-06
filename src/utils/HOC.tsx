import { RouteProp } from '@react-navigation/native';
import React, { useContext } from 'react';
import { View } from 'react-native';

import { AccountsContext } from 'stores/AccountsContext';
import { AccountsStoreStateWithIdentity, Identity } from 'types/identityTypes';
import { RootStackParamList } from 'types/routes';
import {
	RegistriesContext,
	RegistriesStoreState
} from 'stores/RegistriesContext';

interface RegistriesInjectedProps {
	registriesStore: RegistriesStoreState;
}

export function withRegistriesStore<T extends RegistriesInjectedProps>(
	WrappedComponent: React.ComponentType<any>
): React.ComponentType<Omit<T, keyof RegistriesInjectedProps>> {
	return (props): React.ReactElement => {
		const registriesStore = useContext(RegistriesContext);
		return <WrappedComponent {...props} registriesStore={registriesStore} />;
	};
}

export function withCurrentIdentity<
	T extends { accountsStore: AccountsStoreStateWithIdentity }
>(WrappedComponent: React.ComponentType<T>): React.ComponentType<T> {
	return (props): React.ReactElement => {
		const accountsStore = useContext(AccountsContext);
		const { currentIdentity } = accountsStore.state;
		if (currentIdentity === null) return <View />;
		return <WrappedComponent {...props} accountsStore={accountsStore} />;
	};
}

interface UnlockScreenProps {
	route:
		| RouteProp<RootStackParamList, 'PinUnlock'>
		| RouteProp<RootStackParamList, 'PinUnlockWithPassword'>;
	targetIdentity: Identity;
}

export function withTargetIdentity<T extends UnlockScreenProps>(
	WrappedComponent: React.ComponentType<T>
): React.ComponentType<T> {
	return (props): React.ReactElement => {
		const accountsStore = useContext(AccountsContext);
		const targetIdentity =
			props.route.params.identity ?? accountsStore.state.currentIdentity;
		if (!targetIdentity) return <View />;
		return <WrappedComponent {...props} targetIdentity={targetIdentity} />;
	};
}
