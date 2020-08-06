import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Icon } from 'react-native-elements';

import TouchableItem from './TouchableItem';

import colors from 'styles/colors';
import { navigateToQrScanner } from 'utils/navigationHelpers';
import testIDs from 'e2e/testIDs';
import fontStyles from 'styles/fontStyles';
import { RootStackParamList } from 'types/routes';

export default function QrScannerTab(): React.ReactElement {
	const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

	return (
		<TouchableItem
			onPress={(): void => navigateToQrScanner(navigation)}
			testID={testIDs.SecurityHeader.scanButton}
			style={styles.body}
		>
			<Icon
				color={colors.text.main}
				size={fontStyles.i_large.fontSize}
				name="qrcode-scan"
				type="material-community"
			/>
			<Text style={styles.textLabel}>QR Scanner</Text>
		</TouchableItem>
	);
}

const styles = StyleSheet.create({
	body: {
		alignItems: 'center',
		backgroundColor: colors.background.os,
		borderBottomColor: colors.background.app,
		borderBottomWidth: 1,
		height: 72,
		justifyContent: 'center',
		paddingVertical: 9
	},
	textLabel: {
		...fontStyles.a_text,
		color: colors.text.faded,
		marginTop: 4
	}
});
