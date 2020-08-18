'use strict';

import React from 'react';
import {
	Image,
	Platform,
	StyleSheet,
	Text,
	TouchableNativeFeedback,
	TouchableNativeFeedbackProps,
	TouchableOpacity,
	View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import TransparentBackground from './TransparentBackground';

import { KNOWN_SERVICES_LIST, SERVICES_LIST } from 'constants/servicesSpecs';
import {
	SUBSTRATE_NETWORK_LIST,
	SubstrateNetworkKeys
} from 'constants/networkSpecs';
import fontStyles from 'styles/fontStyles';
import colors from 'styles/colors';

const ACCOUNT_NETWORK = 'Account Network';
const Touchable: React.ComponentClass<TouchableNativeFeedbackProps> =
	Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;

const excludedNetworks = [SubstrateNetworkKeys.KUSAMA_CC2];
if (!__DEV__) {
	excludedNetworks.push(SubstrateNetworkKeys.SUBSTRATE_DEV);
	excludedNetworks.push(SubstrateNetworkKeys.KUSAMA_DEV);
}

export function DerivationServiceSelector({
	serviceKey,
	setVisible
}: {
	serviceKey: string;
	setVisible: (shouldVisible: boolean) => void;
}): React.ReactElement {
	return (
		<View style={styles.body}>
			<Text style={styles.label}>{ACCOUNT_NETWORK}</Text>
			<Touchable onPress={(): void => setVisible(true)}>
				<View style={styles.triggerWrapper}>
					<Text style={styles.triggerLabel}>
						{SERVICES_LIST[serviceKey].title}
					</Text>
					<Icon name="more-vert" size={25} color={colors.text.main} />
				</View>
			</Touchable>
		</View>
	);
}

export function ServiceOptions({
	setServiceKey,
	visible,
	setVisible
}: {
	setServiceKey: (serviceKey: string) => void;
	visible: boolean;
	setVisible: (shouldVisible: boolean) => void;
}): React.ReactElement {
	const onServiceSelected = (serviceKey: string): void => {
		setServiceKey(serviceKey);
		setVisible(false);
	};

	const menuOptions = Object.entries(KNOWN_SERVICES_LIST)
		.filter(([serviceKey]) => !excludedNetworks.includes(serviceKey))
		.map(([serviceKey, serviceSpecs]) => {
			return (
				<Touchable
					key={serviceKey}
					onPress={(): void => onServiceSelected(serviceKey)}
				>
					<View style={styles.optionWrapper}>
						<Image source={serviceSpecs.logo} style={styles.optionLogo} />
						<Text style={styles.optionText}>{serviceSpecs.title}</Text>
					</View>
				</Touchable>
			);
		});

	return (
		<TransparentBackground
			style={styles.optionsWrapper}
			visible={visible}
			setVisible={setVisible}
			animationType="fade"
		>
			<View style={styles.optionsBackground}>
				<View style={{ ...styles.optionWrapper, borderTopWidth: 0 }}>
					<Text style={styles.optionHeadingText}>
						{ACCOUNT_NETWORK.toUpperCase()}
					</Text>
				</View>
				{menuOptions}
			</View>
		</TransparentBackground>
	);
}

const styles = StyleSheet.create({
	body: {
		flex: 1,
		marginBottom: 48,
		marginTop: 24,
		paddingHorizontal: 16
	},
	label: {
		flex: 1,
		marginBottom: 3,
		...fontStyles.t_regular
	},
	menuOption: {
		width: '100%'
	},
	optionHeadingText: {
		...fontStyles.h_subheading,
		paddingLeft: 16
	},
	optionLogo: {
		alignItems: 'center',
		height: 32,
		justifyContent: 'center',
		marginHorizontal: 16,
		width: 32
	},
	optionText: {
		...fontStyles.h2,
		color: colors.text.main
	},
	optionWrapper: {
		alignItems: 'center',
		borderTopColor: 'black',
		borderTopWidth: 1,
		flexDirection: 'row',
		paddingVertical: 8
	},
	optionsBackground: {
		backgroundColor: colors.background.app
	},
	optionsWrapper: {
		justifyContent: 'flex-end'
	},
	triggerLabel: {
		flex: 1,
		...fontStyles.h2
	},
	triggerWrapper: {
		alignItems: 'center',
		backgroundColor: colors.background.app,
		borderBottomColor: colors.border.light,
		borderBottomWidth: 0.8,
		flexDirection: 'row',
		height: 40
	}
});
